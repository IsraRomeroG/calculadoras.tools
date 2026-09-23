import { describe, expect, it } from "vitest";
import {
  ATTENDANCE_CONTEXT_EVENT,
  getAttendanceContext,
  invalidateAttendanceContext,
  publishAttendanceContext,
} from "./attendance-context";

describe("attendance result context", () => {
  it("versions each publication and immediately invalidates stale consumers", () => {
    const root = new EventTarget() as unknown as HTMLElement;
    const details: unknown[] = [];
    root.addEventListener(ATTENDANCE_CONTEXT_EVENT, (event) => {
      details.push((event as CustomEvent).detail);
    });
    const draft = {
      subject: { id: "subject-1", name: "Math" },
      source: "manual" as const,
      mode: "attended" as const,
      calendarMode: "remaining" as const,
      input: {
        kind: "manual" as const,
        values: {
          totalClasses: "10",
          mode: "attended" as const,
          attendedClasses: "8",
          absences: "2",
          requiredPercent: "80",
          remainingClasses: "5",
        },
      },
      policy: { justified: "absence" as const, tardyConversion: null, rounding: "exact" as const },
      result: null,
      presentation: null,
      summary: null,
      valid: false,
    };

    const first = publishAttendanceContext(root, draft);
    expect(first.version).toBe(1);
    expect(getAttendanceContext(root)).toBe(first);
    expect(details[0]).toBe(first);

    invalidateAttendanceContext(root);
    expect(getAttendanceContext(root)).toBeNull();
    expect(details[1]).toBeNull();

    const second = publishAttendanceContext(root, draft);
    expect(second.version).toBe(3);
    expect(getAttendanceContext(root)).toBe(second);
  });
});
