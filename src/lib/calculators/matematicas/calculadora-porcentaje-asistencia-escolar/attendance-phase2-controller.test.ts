import { describe, expect, it } from "vitest";
import {
  ATTENDANCE_HISTORY_KEY,
  ATTENDANCE_SUBJECTS_KEY,
  createAttendanceSubject,
  type StorageLike,
} from "./attendance-phase2";
import { getAttendanceContext } from "./attendance-context";
import { initAttendancePhase2Calculators } from "./attendance-phase2-controller";

class FakeClassList {
  private readonly values = new Set<string>();

  add(...names: string[]): void {
    names.forEach((name) => this.values.add(name));
  }

  remove(...names: string[]): void {
    names.forEach((name) => this.values.delete(name));
  }

  toggle(name: string, force?: boolean): boolean {
    const next = force ?? !this.values.has(name);
    if (next) this.values.add(name);
    else this.values.delete(name);
    return next;
  }

  contains(name: string): boolean {
    return this.values.has(name);
  }
}

class FakeElement extends EventTarget {
  readonly classList = new FakeClassList();
  readonly dataset: Record<string, string> = {};
  readonly attributes = new Map<string, string>();
  children: FakeElement[] = [];
  value = "";
  textContent = "";
  className = "";
  checked = false;
  disabled = false;

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
    if (name === "disabled") this.disabled = true;
  }

  removeAttribute(name: string): void {
    this.attributes.delete(name);
    if (name === "disabled") this.disabled = false;
  }

  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }

  toggleAttribute(name: string, force?: boolean): boolean {
    const next = force ?? !this.attributes.has(name);
    if (next) this.setAttribute(name, "");
    else this.removeAttribute(name);
    return next;
  }

  replaceChildren(...children: FakeElement[]): void {
    this.children = children;
  }

  append(...children: FakeElement[]): void {
    this.children.push(...children);
  }

  click(): void {
    this.dispatchEvent(new Event("click"));
  }
}

class FakeRoot extends FakeElement {
  readonly elements = new Map<string, FakeElement>();
  readonly collections = new Map<string, FakeElement[]>();

  querySelector<T extends Element>(selector: string): T | null {
    return (this.elements.get(selector) as T | undefined) ?? null;
  }

  querySelectorAll<T extends Element>(selector: string): T[] {
    return (this.collections.get(selector) as T[] | undefined) ?? [];
  }
}

function memoryStorage(values = new Map<string, string>()): StorageLike {
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

function installFakeBrowser(root: FakeRoot, localStorage: StorageLike, sessionStorage: StorageLike) {
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      querySelectorAll: () => [root],
      createElement: () => new FakeElement(),
      createTextNode: (text: string) => Object.assign(new FakeElement(), { textContent: text }),
    },
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage, sessionStorage, setTimeout, confirm: () => true },
  });
  return () => {
    if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument);
    else Reflect.deleteProperty(globalThis, "document");
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
  };
}

function makeCalculatorRoot(locale: "es" | "en" = "es"): FakeRoot {
  const root = new FakeRoot();
  root.dataset.locale = locale;
  const selectors = [
    "[data-action-status]",
    "[data-initial-result]",
    "[data-results]",
    "[data-save-result]",
    "[data-export-csv]",
    "[data-history-panel]",
    "[data-history-note]",
    "[data-history-list]",
    "[data-history-comparison]",
    "[data-calendar-error]",
    "[data-result-current-status]",
    "[data-result-percent]",
    '[data-source-button="manual"]',
    '[data-source-button="calendar"]',
    "[data-subject-select]",
    "[data-policy-justified]",
    "[data-policy-tardy]",
    "[data-policy-rounding]",
    "[data-calendar-complete]",
    "[data-calendar-panel]",
    "[data-event-list]",
    '[data-mode-button="attended"]',
    '[data-calendar-mode-button="remaining"]',
    '[data-policy-count-help="justifiedAbsences"]',
    '[data-policy-count-help="tardyClasses"]',
  ];
  selectors.forEach((selector) => root.elements.set(selector, new FakeElement()));
  root.elements.get("[data-subject-select]")!.dataset.subjectSelect = "";
  root.elements.get('[data-source-button="manual"]')!.dataset.sourceButton = "manual";
  root.elements.get('[data-source-button="calendar"]')!.dataset.sourceButton = "calendar";
  root.elements.get('[data-mode-button="attended"]')!.dataset.modeButton = "attended";
  root.elements.get('[data-calendar-mode-button="remaining"]')!.dataset.calendarModeButton = "remaining";

  const fields = [
    "totalClasses",
    "attendedClasses",
    "absences",
    "requiredPercent",
    "remainingClasses",
    "courseTotalClasses",
    "justifiedAbsences",
    "tardyClasses",
  ].map((name) => {
    const element = new FakeElement();
    element.dataset.field = name;
    root.elements.set(`[data-field="${name}"]`, element);
    return element;
  });
  const policyControls = [
    "[data-policy-justified]",
    "[data-policy-tardy]",
    "[data-policy-rounding]",
  ].map((selector) => root.elements.get(selector)!);
  root.collections.set("[data-field]", fields);
  root.collections.set("[data-requires-js]", []);
  root.collections.set("[data-policy-justified], [data-policy-tardy], [data-policy-rounding]", policyControls);
  for (const selector of [
    "[data-subject-select]",
    "[data-mode-button]",
    "[data-calendar-mode-button]",
    "[data-manual-source-fields], [data-manual-only]",
    "[data-known-detail]",
    "[data-excess-detail]",
    "[data-example-id]",
  ]) root.collections.set(selector, []);
  root.collections.set("[data-source-button]", [
    root.elements.get('[data-source-button="manual"]')!,
    root.elements.get('[data-source-button="calendar"]')!,
  ]);
  return root;
}

describe("attendance phase 2 controller flows", () => {
  it("shows a calendar result, recalculates policy changes, and switches to the selected subject", () => {
    const localStorage = memoryStorage();
    const sessionValues = new Map<string, string>();
    const sessionStorage = memoryStorage(sessionValues);
    const calendar = createAttendanceSubject("Calendar", "subject-calendar");
    calendar.source = "calendar";
    calendar.manual.requiredPercent = "66.67";
    calendar.events = [
      { id: "attended-a", date: "2026-09-01", label: "", status: "attended" },
      { id: "attended-b", date: "2026-09-02", label: "", status: "attended" },
      { id: "absence-c", date: "2026-09-03", label: "", status: "absence" },
    ];
    const manual = createAttendanceSubject("Manual", "subject-manual");
    manual.manual = {
      ...manual.manual,
      totalClasses: "2",
      attendedClasses: "1",
      absences: "1",
      requiredPercent: "50",
      remainingClasses: "2",
      justifiedAbsences: "1",
    };
    manual.events = [
      { id: "manual-calendar-attended", date: "2026-09-04", label: "", status: "attended" },
    ];
    localStorage.setItem(ATTENDANCE_SUBJECTS_KEY, JSON.stringify([calendar, manual]));

    const root = makeCalculatorRoot();
    const minimum = root.elements.get('[data-field="requiredPercent"]')!;
    const results = root.elements.get("[data-results]")!;
    const initial = root.elements.get("[data-initial-result]")!;
    const rounding = root.elements.get("[data-policy-rounding]")!;
    const subjectSelect = root.elements.get("[data-subject-select]")!;
    const restoreGlobals = installFakeBrowser(root, localStorage, sessionStorage);
    try {
      initAttendancePhase2Calculators();

      const initialContext = getAttendanceContext(root as unknown as HTMLElement);
      expect(initialContext?.subject.id).toBe(calendar.id);
      expect(initialContext?.result?.currentStatus).toBe("below");
      expect(minimum.value).toBe("66.67");
      const spanishEventLabels = root.elements.get("[data-event-list]")!.children
        .map((item) => item.children[0]?.textContent ?? "");
      expect(spanishEventLabels[0]).toContain("Asistida");
      expect(spanishEventLabels[2]).toContain("Falta");
      expect(spanishEventLabels.join(" ")).not.toContain("attended");
      expect(initial.classList.contains("hidden")).toBe(true);
      expect(results.classList.contains("hidden")).toBe(false);

      const exactSummary = initialContext?.summary;
      const exactStatusLabel = root.elements.get("[data-result-current-status]")?.textContent;
      rounding.value = "0";
      rounding.dispatchEvent(new Event("change"));
      const roundedContext = getAttendanceContext(root as unknown as HTMLElement);
      expect(roundedContext?.result?.currentStatus).toBe("meets");
      expect(roundedContext?.summary).not.toBe(exactSummary);
      expect(root.elements.get("[data-result-current-status]")?.textContent).not.toBe(exactStatusLabel);

      root.elements.get("[data-save-result]")!.click();
      const saved = JSON.parse(sessionValues.get(ATTENDANCE_HISTORY_KEY) ?? "[]");
      expect(saved[0]).toMatchObject({
        source: "calendar",
        input: { requiredPercent: "66.67", calendarComplete: false },
        policy: { rounding: { mode: "half-up", decimals: 0 } },
        result: { currentStatus: "meets", currentEvaluatedPercent: 67 },
      });

      subjectSelect.value = manual.id;
      subjectSelect.dispatchEvent(new Event("change"));
      const selectedContext = getAttendanceContext(root as unknown as HTMLElement);
      expect(selectedContext?.subject.id).toBe(manual.id);
      expect(selectedContext?.source).toBe("manual");
      expect(selectedContext?.result?.currentPercent).toBe(50);
      expect(minimum.value).toBe("50");
      expect(results.classList.contains("hidden")).toBe(false);

      root.elements.get('[data-source-button="calendar"]')!.click();
      const calendarContext = getAttendanceContext(root as unknown as HTMLElement);
      expect(calendarContext?.subject.id).toBe(manual.id);
      expect(calendarContext?.source).toBe("calendar");
      expect(calendarContext?.result?.totalClasses).toBe(1);
      expect(calendarContext?.result?.attendedClasses).toBe(1);
      expect(calendarContext?.result?.justifiedAbsences).toBe(0);
      expect(calendarContext?.result?.currentPercent).toBe(100);
      expect(root.elements.get("[data-event-list]")!.children[0]?.children[0]?.textContent).toContain("Asistida");
    } finally {
      restoreGlobals();
    }
  });

  it("keeps the same numerical state and localizes the event list in English", () => {
    const localStorage = memoryStorage();
    const sessionStorage = memoryStorage();
    const subject = createAttendanceSubject("Physics", "subject-english");
    subject.source = "calendar";
    subject.manual.requiredPercent = "80";
    subject.events = [
      { id: "en-attended", date: "2026-09-01", label: "", status: "attended" },
      { id: "en-absence", date: "2026-09-02", label: "", status: "absence" },
    ];
    localStorage.setItem(ATTENDANCE_SUBJECTS_KEY, JSON.stringify([subject]));
    const root = makeCalculatorRoot("en");
    const restoreGlobals = installFakeBrowser(root, localStorage, sessionStorage);
    try {
      initAttendancePhase2Calculators();

      const context = getAttendanceContext(root as unknown as HTMLElement);
      const labels = root.elements.get("[data-event-list]")!.children
        .map((item) => item.children[0]?.textContent ?? "");
      expect(context?.result).toMatchObject({
        totalClasses: 2,
        attendedClasses: 1,
        currentPercent: 50,
        currentStatus: "below",
      });
      expect(context?.summary).toContain("Subject: Physics");
      expect(labels[0]).toContain("Attended");
      expect(labels[1]).toContain("Absence");
      expect(labels.join(" ")).not.toContain("attended");
      expect(labels.join(" ")).not.toContain("absence");
    } finally {
      restoreGlobals();
    }
  });
});
