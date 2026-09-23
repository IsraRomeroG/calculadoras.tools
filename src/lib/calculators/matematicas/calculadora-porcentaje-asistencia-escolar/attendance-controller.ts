import * as es from "./attendance";
import * as en from "./attendance.en";
import type { AttendanceCalendarMode, AttendanceInputMode, AttendancePercent } from "./attendance-core";
import {
  ATTENDANCE_CONTEXT_EVENT,
  getAttendanceContext,
  invalidateAttendanceContext,
} from "./attendance-context";
import { initAttendancePhase2Calculators } from "./attendance-phase2-controller";

type Locale = "es" | "en";
type FieldName =
  | "totalClasses"
  | "requiredPercent"
  | "attendedClasses"
  | "absences"
  | "remainingClasses"
  | "courseTotalClasses";

const TEXT = {
  es: {
    integer: {
      required: "Campo obligatorio.",
      invalid: "Usa un entero entre 0 y 1000.",
      negative: "No se permiten valores negativos.",
      zero: "Usa un entero entre 1 y 1000.",
      too_large: "Usa un entero entre 0 y 1000.",
    },
    percent: {
      required: "Campo obligatorio.",
      invalid: "Usa un porcentaje de 0 a 100 con hasta 4 decimales. Escribe 0.5 en lugar de .5.",
      negative: "No se permiten porcentajes negativos.",
      too_large: "El porcentaje no puede superar 100.",
      too_many_decimals: "Usa un porcentaje de 0 a 100 con hasta 4 decimales.",
    },
    totalRange: "Usa un entero entre 1 y 1000.",
    remainingRange: "Usa un entero entre 0 y 1000.",
    courseTotalRange: "Usa un entero entre 1 y 2000.",
    courseTotalTooSmall: "El total del curso no puede ser menor que las clases impartidas hasta hoy.",
    courseTotalTooMany: "El total del curso admite como máximo 1000 clases restantes.",
    calculatedTotal: (value: number) => `Calculado automáticamente: total del curso = ${value}`,
    calculatedRemaining: (value: number) => `Calculado automáticamente: clases restantes = ${value}`,
    tooManyAttended: (total: number) => `Las asistencias no pueden superar las ${total} clases impartidas hasta hoy.`,
    tooManyAbsences: (total: number) => `Las faltas no pueden superar las ${total} clases impartidas hasta hoy.`,
    incomplete: "Completa los campos obligatorios con valores válidos.",
    initial: "Introduce las clases impartidas hasta hoy y las asistidas o faltas. Después indica las restantes o el total del curso.",
    remainingInvalid: "Revisa las clases restantes.",
    calendarInvalid: "Revisa el total del curso.",
    updated: "Resultado actualizado.",
    example: "Ejemplo cargado.",
    cleared: "Formulario limpio.",
    copied: "Resumen copiado.",
    copyFailed: "No se pudo copiar automáticamente.",
    noSummary: "No hay un resumen válido para copiar.",
    unknown: "No indicadas",
  },
  en: {
    integer: {
      required: "This field is required.",
      invalid: "Use a whole number from 0 to 1000.",
      negative: "Negative values are not allowed.",
      zero: "Use a whole number from 1 to 1000.",
      too_large: "Use a whole number from 0 to 1000.",
    },
    percent: {
      required: "This field is required.",
      invalid: "Use a percentage from 0 to 100 with up to 4 decimals. Write 0.5 instead of .5.",
      negative: "Negative percentages are not allowed.",
      too_large: "The percentage cannot exceed 100.",
      too_many_decimals: "Use a percentage from 0 to 100 with up to 4 decimals.",
    },
    totalRange: "Use a whole number from 1 to 1000.",
    remainingRange: "Use a whole number from 0 to 1000.",
    courseTotalRange: "Use a whole number from 1 to 2000.",
    courseTotalTooSmall: "The course total cannot be lower than the classes held so far.",
    courseTotalTooMany: "The course total allows at most 1000 remaining classes.",
    calculatedTotal: (value: number) => `Calculated automatically: total classes in the course = ${value}`,
    calculatedRemaining: (value: number) => `Calculated automatically: remaining classes = ${value}`,
    tooManyAttended: (total: number) => `Attendances cannot exceed the ${total} classes held so far.`,
    tooManyAbsences: (total: number) => `Absences cannot exceed the ${total} classes held so far.`,
    incomplete: "Complete the required fields with valid values.",
    initial: "Enter classes held so far and either attendances or absences. Then provide remaining classes or the course total.",
    remainingInvalid: "Check the remaining classes.",
    calendarInvalid: "Check the course total.",
    updated: "Result updated.",
    example: "Example loaded.",
    cleared: "Form cleared.",
    copied: "Summary copied.",
    copyFailed: "Could not copy automatically.",
    noSummary: "There is no valid summary to copy.",
    unknown: "Not provided",
  },
} as const;

export type AttendanceCopyAttemptResult = "copied" | "failed" | "stale";

export async function attemptAttendanceCopy({
  writeText,
  legacyCopy,
  isCurrent,
}: {
  writeText?: () => Promise<void>;
  legacyCopy: () => boolean;
  isCurrent: () => boolean;
}): Promise<AttendanceCopyAttemptResult> {
  let copied = false;
  if (writeText) {
    try {
      await writeText();
      copied = true;
    } catch {
      copied = false;
    }
  }

  if (!isCurrent()) return "stale";
  if (!copied) {
    try {
      copied = legacyCopy();
    } catch {
      copied = false;
    }
  }
  return copied ? "copied" : "failed";
}

export function initAttendanceCalculators(): void {
  const roots = Array.from(document
    .querySelectorAll<HTMLElement>("[data-attendance-calculator]")
  );
  roots.forEach((root) => {
    if (root.dataset.initialized === "true") return;
    root.dataset.initialized = "true";
    initAttendanceCalculator(root);
  });
  initAttendancePhase2Calculators();
}

function initAttendanceCalculator(root: HTMLElement): void {
  const locale: Locale = root.dataset.locale === "en" ? "en" : "es";
  const adapter = locale === "es" ? es : en;
  const text = TEXT[locale];
  let mode: AttendanceInputMode = "attended";
  let calendarMode: AttendanceCalendarMode = "remaining";
  let statusTimer = 0;

  const query = <T extends Element>(selector: string) => root.querySelector<T>(selector);
  const queryAll = <T extends Element>(selector: string) =>
    Array.from(root.querySelectorAll<T>(selector));
  const field = (name: FieldName) =>
    query<HTMLInputElement>(`[data-field="${name}"]`);
  const value = (name: FieldName) => field(name)?.value ?? "";
  const setValue = (name: FieldName, nextValue: string) => {
    const input = field(name);
    if (input) input.value = nextValue;
  };

  const modeButtons = queryAll<HTMLButtonElement>("[data-mode-button]");
  const calendarModeButtons = queryAll<HTMLButtonElement>("[data-calendar-mode-button]");
  const copyButton = query<HTMLButtonElement>("[data-copy-summary]");
  const clearButton = query<HTMLButtonElement>("[data-clear]");
  const status = query<HTMLElement>("[data-action-status]");
  const initialResult = query<HTMLElement>("[data-initial-result]");
  const results = query<HTMLElement>("[data-results]");
  const manualCopy = query<HTMLElement>("[data-manual-copy]");
  const manualCopyText = query<HTMLTextAreaElement>("[data-manual-copy-text]");
  const syncCopyAvailability = () => {
    copyButton?.toggleAttribute("disabled", !getAttendanceContext(root)?.summary);
  };
  root.addEventListener(ATTENDANCE_CONTEXT_EVENT, syncCopyAvailability);
  syncCopyAvailability();
  queryAll<HTMLButtonElement>("[data-requires-js]").forEach((button) =>
    button.removeAttribute("disabled"),
  );

  function updateCalculator(announce = false): void {
    invalidateAttendanceContext(root);
    copyButton?.setAttribute("disabled", "");
    clearStatus();
    hideManualCopy();
    updateModeUi();
    const parsed = readInput();

    if (!parsed.ok) {
      showInitial(parsed.message);
      copyButton?.setAttribute("disabled", "");
      return;
    }

    if (announce) setStatus(text.updated, "success");
  }

  function readInput():
    | {
        ok: true;
        input: {
          totalClasses: number;
          mode: AttendanceInputMode;
          attendedClasses?: number;
          absences?: number;
          requiredPercent: AttendancePercent;
          remainingClasses: number | null;
        };
      }
    | { ok: false; message: string } {
    clearCurrentErrors();
    const total = parseIntegerField(
      "totalClasses",
      false,
      1000,
      undefined,
      text.totalRange,
    );
    const percent = adapter.parseAttendancePercent(value("requiredPercent"));
    if (!percent.ok) setError("requiredPercent", text.percent[percent.error]);

    const calendar = readCalendar(total.ok ? total.value : null);
    const activeName: FieldName = mode === "attended" ? "attendedClasses" : "absences";
    const active = parseIntegerField(
      activeName,
      true,
      total.ok ? total.value : 1000,
      total.ok
        ? mode === "attended"
          ? text.tooManyAttended(total.value)
          : text.tooManyAbsences(total.value)
        : undefined,
    );

    if (!total.ok || !percent.ok || !active.ok) {
      return {
        ok: false,
        message: text.incomplete,
      };
    }

    return {
      ok: true,
      input: {
        totalClasses: total.value,
        mode,
        ...(mode === "attended"
          ? { attendedClasses: active.value }
          : { absences: active.value }),
        requiredPercent: percent,
        remainingClasses: calendar.ok ? calendar.value : null,
      },
    };
  }

  function readCalendar(total: number | null):
    | { ok: true; value: number | null }
    | { ok: false } {
    if (calendarMode === "remaining") {
      const remaining = adapter.parseAttendanceRemaining(value("remainingClasses"));
      if (!remaining.ok) {
        setError(
          "remainingClasses",
          remaining.error === "negative" ? text.integer.negative : text.remainingRange,
        );
        setText("[data-calendar-derived]", "");
        setValue("courseTotalClasses", "");
        return { ok: false };
      }
      setValue("courseTotalClasses", total === null || remaining.value === null ? "" : String(total + remaining.value));
      setText("[data-calendar-derived]", total === null || remaining.value === null ? "" : text.calculatedTotal(total + remaining.value));
      return { ok: true, value: remaining.value };
    }

    if (!value("courseTotalClasses").trim()) {
      setValue("remainingClasses", "");
      setText("[data-calendar-derived]", "");
      return { ok: true, value: null };
    }
    const courseTotal = adapter.parseAttendanceInteger(value("courseTotalClasses"), {
      allowZero: true,
      max: 2000,
    });
    if (!courseTotal.ok) {
      setError(
        "courseTotalClasses",
        courseTotal.error === "negative"
          ? text.integer.negative
          : courseTotal.error === "too_large"
            ? text.courseTotalRange
            : text.courseTotalRange,
      );
      setValue("remainingClasses", "");
      setText("[data-calendar-derived]", "");
      return { ok: false };
    }
    if (courseTotal.value === 0) {
      setError("courseTotalClasses", text.courseTotalRange);
      setValue("remainingClasses", "");
      setText("[data-calendar-derived]", "");
      return { ok: false };
    }
    if (total === null) {
      setText("[data-calendar-derived]", "");
      setValue("remainingClasses", "");
      return { ok: true, value: null };
    }
    if (courseTotal.value < total) {
      setError("courseTotalClasses", text.courseTotalTooSmall);
      setValue("remainingClasses", "");
      setText("[data-calendar-derived]", "");
      return { ok: false };
    }
    if (courseTotal.value - total > 1000) {
      setError("courseTotalClasses", text.courseTotalTooMany);
      setValue("remainingClasses", "");
      setText("[data-calendar-derived]", "");
      return { ok: false };
    }
    setValue("remainingClasses", String(courseTotal.value - total));
    setText("[data-calendar-derived]", text.calculatedRemaining(courseTotal.value - total));
    return { ok: true, value: courseTotal.value - total };
  }

  function parseIntegerField(
    name: FieldName,
    allowZero: boolean,
    max: number,
    tooLargeMessage?: string,
    rangeMessage?: string,
  ) {
    const parsed = adapter.parseAttendanceInteger(value(name), {
      allowZero,
      max,
    });
    if (!parsed.ok) {
      setError(
        name,
        parsed.error === "too_large" && tooLargeMessage
          ? tooLargeMessage
          : rangeMessage &&
              (parsed.error === "invalid" ||
                parsed.error === "zero" ||
                parsed.error === "too_large")
            ? rangeMessage
          : text.integer[parsed.error],
      );
    }
    return parsed;
  }

  function showInitial(message: string): void {
    results?.classList.add("hidden");
    initialResult?.classList.remove("hidden");
    if (initialResult) initialResult.textContent = message;
  }

  function setMode(nextMode: string | undefined): void {
    const normalized: AttendanceInputMode = nextMode === "absences" ? "absences" : "attended";
    if (normalized === mode) return;
    const total = adapter.parseAttendanceInteger(value("totalClasses"), {
      allowZero: false,
      max: 1000,
    });
    const sourceName: FieldName = mode === "attended" ? "attendedClasses" : "absences";
    const targetName: FieldName = normalized === "attended" ? "attendedClasses" : "absences";
    const source = total.ok
      ? adapter.parseAttendanceInteger(value(sourceName), { allowZero: true, max: total.value })
      : { ok: false as const };
    const canConvert = total.ok && source.ok;
    setValue(targetName, canConvert ? String(total.value - source.value) : "");
    clearError(targetName);
    if (!canConvert) {
      const target = field(targetName);
      if (target) target.dataset.touched = "true";
    }
    mode = normalized;
    updateCalculator(true);
  }

  function updateModeUi(): void {
    modeButtons.forEach((button) => {
      const active = button.dataset.modeButton === mode;
      button.setAttribute("aria-pressed", String(active));
      button.classList.toggle("bg-amber-400", active);
      button.classList.toggle("text-gray-950", active);
      button.classList.toggle("text-gray-300", !active);
    });
    query<HTMLElement>("[data-attended-wrapper]")?.classList.toggle("hidden", mode !== "attended");
    query<HTMLElement>("[data-absences-wrapper]")?.classList.toggle("hidden", mode !== "absences");
    updateCalendarModeUi();
  }

  function setCalendarMode(nextMode: string | undefined): void {
    const normalized: AttendanceCalendarMode = nextMode === "total" ? "total" : "remaining";
    if (normalized === calendarMode) return;
    const total = adapter.parseAttendanceInteger(value("totalClasses"), {
      allowZero: false,
      max: 1000,
    });
    const source = calendarMode === "remaining"
      ? adapter.parseAttendanceRemaining(value("remainingClasses"))
      : adapter.parseAttendanceInteger(value("courseTotalClasses"), { allowZero: true, max: 2000 });
    let canConvert = false;
    if (total.ok && source.ok) {
      const sourceValue = source.value;
      if (
        calendarMode === "remaining" &&
        sourceValue !== null &&
        normalized === "total"
      ) {
        setValue("courseTotalClasses", String(total.value + sourceValue));
        canConvert = true;
      } else if (
        calendarMode === "total" &&
        sourceValue > 0 &&
        normalized === "remaining" &&
        sourceValue >= total.value &&
        sourceValue - total.value <= 1000
      ) {
        setValue("remainingClasses", String(sourceValue - total.value));
        canConvert = true;
      }
    }
    if (!canConvert) {
      setValue(normalized === "total" ? "courseTotalClasses" : "remainingClasses", "");
      const target = field(normalized === "total" ? "courseTotalClasses" : "remainingClasses");
      if (target) target.dataset.touched = "true";
    }
    calendarMode = normalized;
    updateModeUi();
    updateCalculator(true);
  }

  function updateCalendarModeUi(): void {
    calendarModeButtons.forEach((button) => {
      const active = button.dataset.calendarModeButton === calendarMode;
      button.setAttribute("aria-pressed", String(active));
      button.classList.toggle("border-amber-400", active);
      button.classList.toggle("text-amber-300", active);
    });
    query<HTMLElement>("[data-calendar-remaining-wrapper]")?.classList.remove("hidden");
    query<HTMLElement>("[data-calendar-total-wrapper]")?.classList.remove("hidden");
    queryAll<HTMLElement>("[data-calendar-derived-label]").forEach((label) => {
      label.classList.toggle("hidden", label.dataset.calendarDerivedLabel !== (calendarMode === "remaining" ? "total" : "remaining"));
    });
    const remainingInput = field("remainingClasses");
    const courseTotalInput = field("courseTotalClasses");
    if (remainingInput) remainingInput.readOnly = calendarMode === "total";
    if (courseTotalInput) courseTotalInput.readOnly = calendarMode === "remaining";
    if (calendarMode === "total") setText("[data-calendar-derived]", "");
  }

  function loadExample(id: string | undefined, trigger: HTMLButtonElement): void {
    const example = adapter.ATTENDANCE_EXAMPLES.find((item) => item.id === id);
    if (!example) return;
    mode = example.values.mode;
    calendarMode = example.values.calendarMode ?? "remaining";
    setValue("totalClasses", example.values.totalClasses);
    setValue("attendedClasses", example.values.attendedClasses);
    setValue("absences", example.values.absences);
    setValue("requiredPercent", example.values.requiredPercent);
    setValue("remainingClasses", example.values.remainingClasses);
    setValue("courseTotalClasses", example.values.courseTotalClasses ?? "");
    clearAllErrors();
    updateModeUi();
    updateCalculator();
    trigger.focus();
    setStatus(text.example, "success");
  }

  function clearCalculator(): void {
    invalidateAttendanceContext(root);
    clearStatus();
    mode = "attended";
    calendarMode = "remaining";
    setValue("totalClasses", "");
    setValue("attendedClasses", "");
    setValue("absences", "");
    setValue("requiredPercent", "80");
    setValue("remainingClasses", "");
    setValue("courseTotalClasses", "");
    clearAllErrors();
    hideManualCopy();
    updateModeUi();
    showInitial(text.initial);
    copyButton?.setAttribute("disabled", "");
    field("totalClasses")?.focus();
    setStatus(text.cleared, "success");
  }

  async function copySummary(): Promise<void> {
    const context = getAttendanceContext(root);
    if (!context?.valid || !context.summary) {
      setStatus(text.noSummary, "error");
      return;
    }
    const summary = context.summary;
    const version = context.version;
    const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const outcome = await attemptAttendanceCopy({
      writeText: navigator.clipboard?.writeText
        ? () => navigator.clipboard.writeText(summary)
        : undefined,
      legacyCopy: () => tryLegacyCopy(summary, activeElement),
      isCurrent: () => {
        const current = getAttendanceContext(root);
        return current?.valid === true && current.version === version && current.summary === summary;
      },
    });
    if (outcome === "stale") return;
    if (outcome === "copied") {
      setStatus(text.copied, "success");
      return;
    }
    if (manualCopy && manualCopyText) {
      manualCopyText.value = summary;
      manualCopy.classList.remove("hidden");
      manualCopyText.focus();
      manualCopyText.select();
    }
    setStatus(text.copyFailed, "error", false);
  }

  function tryLegacyCopy(summary: string, restoreFocus: HTMLElement | null): boolean {
    if (typeof document.execCommand !== "function") return false;
    const textarea = document.createElement("textarea");
    textarea.value = summary;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    let copied = false;
    try {
      textarea.select();
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    } finally {
      textarea.remove();
      restoreFocus?.focus();
    }
    return copied;
  }

  function setError(name: FieldName, message: string): void {
    const input = field(name);
    if (input?.dataset.touched !== "true") return;
    const error = query<HTMLElement>(`[data-error-for="${name}"]`);
    if (error) {
      error.textContent = message;
      error.classList.remove("hidden");
    }
    input.setAttribute("aria-invalid", "true");
  }

  function clearError(name: FieldName): void {
    const error = query<HTMLElement>(`[data-error-for="${name}"]`);
    if (error) {
      error.textContent = "";
      error.classList.add("hidden");
    }
    field(name)?.removeAttribute("aria-invalid");
  }

  function clearCurrentErrors(): void {
    (Object.keys({ totalClasses: 0, requiredPercent: 0, attendedClasses: 0, absences: 0, remainingClasses: 0, courseTotalClasses: 0 }) as FieldName[]).forEach(clearError);
  }

  function clearAllErrors(): void {
    clearCurrentErrors();
    queryAll<HTMLInputElement>("[data-field]").forEach((input) => delete input.dataset.touched);
  }

  function hideManualCopy(): void {
    manualCopy?.classList.add("hidden");
    if (manualCopyText) manualCopyText.value = "";
  }

  function setText(selector: string, content: string): void {
    const element = query<HTMLElement>(selector);
    if (element) element.textContent = content;
  }

  function setStatus(message: string, kind: "success" | "error", clear = true): void {
    if (!status) return;
    window.clearTimeout(statusTimer);
    status.textContent = message;
    status.classList.toggle("text-emerald-300", kind === "success");
    status.classList.toggle("text-red-300", kind === "error");
    if (clear) statusTimer = window.setTimeout(() => (status.textContent = ""), 3000);
  }

  function clearStatus(): void {
    window.clearTimeout(statusTimer);
    if (status) status.textContent = "";
  }

  queryAll<HTMLInputElement>("[data-field]").forEach((input) => {
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") input.dataset.touched = "true";
      updateCalculator();
    });
    input.addEventListener("blur", () => {
      input.dataset.touched = "true";
      updateCalculator(true);
    });
  });
  modeButtons.forEach((button) =>
    button.addEventListener("click", () => setMode(button.dataset.modeButton)),
  );
  calendarModeButtons.forEach((button) =>
    button.addEventListener("click", () => setCalendarMode(button.dataset.calendarModeButton)),
  );
  queryAll<HTMLButtonElement>("[data-example-id]").forEach((button) =>
    button.addEventListener("click", () => loadExample(button.dataset.exampleId, button)),
  );
  copyButton?.addEventListener("click", copySummary);
  clearButton?.addEventListener("click", clearCalculator);
  updateModeUi();
  showInitial(text.initial);
}
