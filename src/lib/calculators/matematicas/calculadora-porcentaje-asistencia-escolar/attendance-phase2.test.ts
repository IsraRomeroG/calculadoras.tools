import { describe, expect, it } from "vitest";
import {
  appendAttendanceHistory,
  buildAttendanceCsv,
  calculatePolicyAttendance,
  clearAttendanceHistory,
  createAttendanceHistorySnapshot,
  createAttendanceSubject,
  meetsPolicy,
  minimumAttendancesForPolicy,
  prepareAttendanceRestore,
  policyAttendanceToCsvRow,
  readAttendanceHistory,
  roundedPercentUnits,
  summarizeCalendar,
  upsertCalendarEvent,
  type AttendanceCalendarEvent,
  type StorageLike,
} from "./attendance-phase2";
import {
  normalizeAttendanceCalendar,
  parseAttendanceCourseTotal,
} from "./attendance-core";

function memoryStorage(): StorageLike {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

describe("attendance phase 2 policies", () => {
  it("keeps justified absences as absence, excludes them, or credits them", () => {
    const base = calculatePolicyAttendance({ totalClasses: 10, attendedClasses: 8, justifiedAbsences: 1, requiredPercent: 80 });
    const excluded = calculatePolicyAttendance({ totalClasses: 10, attendedClasses: 8, justifiedAbsences: 1, requiredPercent: 80, policy: { justified: "exclude" } });
    const credited = calculatePolicyAttendance({ totalClasses: 10, attendedClasses: 8, justifiedAbsences: 1, requiredPercent: 80, policy: { justified: "credit" } });
    expect(base.currentPercent).toBe(80);
    expect(excluded.currentPercent).toBeCloseTo(8 / 9 * 100);
    expect(credited.currentPercent).toBe(90);
  });

  it("applies only complete tardy groups", () => {
    const three = calculatePolicyAttendance({ totalClasses: 10, attendedClasses: 9, tardyClasses: 3, requiredPercent: 80, policy: { tardyConversion: 3 } });
    const two = calculatePolicyAttendance({ totalClasses: 10, attendedClasses: 9, tardyClasses: 2, requiredPercent: 80, policy: { tardyConversion: 3 } });
    expect(three.effectiveAttendedClasses).toBe(8);
    expect(three.tardyRemainder).toBe(0);
    expect(two.effectiveAttendedClasses).toBe(9);
    expect(two.tardyPenalty).toBe(0);
  });

  it("shares the rounded predicate with minimum and projection", () => {
    expect(meetsPolicy(2, 3, 66.67)).toBe(false);
    expect(meetsPolicy(2, 3, 66.67, { rounding: { mode: "half-up", decimals: 2 } })).toBe(true);
    expect(roundedPercentUnits(2, 3, 2)).toBe(6667);
    expect(minimumAttendancesForPolicy(3, 66.67, { rounding: { mode: "half-up", decimals: 2 } })).toBe(2);
    const result = calculatePolicyAttendance({ totalClasses: 3, attendedClasses: 2, requiredPercent: 66.67, remainingClasses: 0, policy: { rounding: { mode: "half-up", decimals: 2 } } });
    expect(result.currentStatus).toBe("meets");
    expect(result.projection.status).toBe("finished_meets");
  });

  it("does not divide by zero when exclusion removes every class", () => {
    const result = calculatePolicyAttendance({ totalClasses: 1, attendedClasses: 0, justifiedAbsences: 1, requiredPercent: 80, remainingClasses: 0, policy: { justified: "exclude" } });
    expect(result.currentPercent).toBeNull();
    expect(result.currentStatus).toBe("undefined");
    expect(result.projection.status).toBe("undefined");
  });
});

describe("course calendar input", () => {
  it("normalizes remaining classes and course total to the same R", () => {
    expect(normalizeAttendanceCalendar({ totalClasses: 40, calendarMode: "remaining", remainingClasses: 10 })).toEqual({
      calendarMode: "remaining",
      remainingClasses: 10,
      courseTotalClasses: 50,
    });
    expect(normalizeAttendanceCalendar({ totalClasses: 40, calendarMode: "total", courseTotalClasses: 50 })).toEqual({
      calendarMode: "total",
      remainingClasses: 10,
      courseTotalClasses: 50,
    });
  });

  it("distinguishes unknown calendar, finished course, and invalid totals", () => {
    expect(normalizeAttendanceCalendar({ totalClasses: 40, calendarMode: "remaining", remainingClasses: null })).toMatchObject({ remainingClasses: null, courseTotalClasses: null });
    expect(normalizeAttendanceCalendar({ totalClasses: 40, calendarMode: "total", courseTotalClasses: 40 })).toMatchObject({ remainingClasses: 0, courseTotalClasses: 40 });
    expect(parseAttendanceCourseTotal("1,000", 40)).toMatchObject({ ok: true, value: 1000 });
    expect(parseAttendanceCourseTotal("0", 40)).toEqual({ ok: false, error: "zero" });
    expect(parseAttendanceCourseTotal("39", 40)).toEqual({ ok: false, error: "too_small" });
    expect(parseAttendanceCourseTotal("1041", 40)).toEqual({ ok: false, error: "too_many_remaining" });
    expect(() => normalizeAttendanceCalendar({ totalClasses: 40, calendarMode: "total", courseTotalClasses: 39 })).toThrow();
  });

  it("supports the maximum course total without extending the remaining limit", () => {
    expect(parseAttendanceCourseTotal("2000", 1000)).toMatchObject({ ok: true, value: 2000 });
    expect(parseAttendanceCourseTotal("2001", 1000)).toMatchObject({ ok: false });
    expect(() => normalizeAttendanceCalendar({ totalClasses: 1000, calendarMode: "total", courseTotalClasses: 2001 })).toThrow();
  });
});

describe("attendance phase 2 calendar, history and CSV", () => {
  it("counts multiple local sessions and excludes cancellations", () => {
    const events: AttendanceCalendarEvent[] = [];
    const withEvents = [
      { id: "a", date: "2026-09-01", label: "", status: "attended" as const },
      { id: "b", date: "2026-09-01", label: "second", status: "absence" as const },
      { id: "c", date: "2026-09-02", label: "", status: "justified" as const },
      { id: "d", date: "2026-09-03", label: "", status: "tardy" as const },
      { id: "e", date: "2026-09-04", label: "", status: "scheduled" as const },
      { id: "f", date: "2026-09-05", label: "", status: "cancelled" as const },
    ].reduce((current, event) => upsertCalendarEvent(current, event), events);
    expect(summarizeCalendar(withEvents, true)).toEqual({ completedClasses: 4, attendedClasses: 2, absences: 2, justifiedAbsences: 1, tardyClasses: 1, remainingClasses: 1, activeScheduledClasses: 1 });
    expect(summarizeCalendar(withEvents, false).remainingClasses).toBeNull();
  });

  it("validates, preserves full history, and does not silently evict snapshots", () => {
    const storage = memoryStorage();
    const subject = createAttendanceSubject("Álgebra");
    const input = {
      ...subject.manual,
      totalClasses: "1",
      attendedClasses: "0",
      absences: "1",
      requiredPercent: "80",
    };
    const first = createAttendanceHistorySnapshot({
      subject: { id: subject.id, name: subject.name },
      input,
      policy: subject.policy,
      source: "manual",
      result: calculatePolicyAttendance({ totalClasses: 1, attendedClasses: 0, requiredPercent: 80 }),
    });
    expect(appendAttendanceHistory(storage, first).ok).toBe(true);
    expect(readAttendanceHistory(storage).ok).toBe(true);
    const raw = storage.getItem("calculadoras.tools.attendance.history.v1");
    expect(raw).toContain("Álgebra");
    storage.setItem("calculadoras.tools.attendance.history.v1", "not json");
    expect(readAttendanceHistory(storage)).toMatchObject({ ok: false, reason: "corrupt" });
    expect(clearAttendanceHistory(storage)).toEqual({ ok: true, snapshots: [] });
  });

  it("restores manual inputs without importing events from the active subject", () => {
    const active = createAttendanceSubject("Historia", "subject-a");
    active.events = [{ id: "event-a", date: "2026-09-01", label: "A", status: "attended" }];
    const restored = createAttendanceSubject("Biología", "subject-b");
    restored.manual = {
      ...restored.manual,
      totalClasses: "3",
      attendedClasses: "2",
      requiredPercent: "80",
    };
    const snapshot = createAttendanceHistorySnapshot({
      subject: { id: restored.id, name: restored.name },
      input: { ...restored.manual },
      policy: restored.policy,
      source: "manual",
      result: calculatePolicyAttendance({ totalClasses: 3, attendedClasses: 2, requiredPercent: 80 }),
    });

    const prepared = prepareAttendanceRestore([active, restored], snapshot);

    expect(prepared.subject.source).toBe("manual");
    expect(prepared.subject.manual).toEqual(snapshot.input);
    expect(prepared.subject.events).toEqual([]);
    expect(prepared.subject.events).not.toBe(active.events);
    expect(prepared.subject.events).not.toBe(restored.events);
    expect(prepared.subject.calendarComplete).toBe(restored.calendarComplete);
  });

  it("keeps only the restored manual subject's persisted events and copies them", () => {
    const active = createAttendanceSubject("Historia", "subject-a");
    active.events = [{ id: "event-a", date: "2026-09-01", label: "A", status: "attended" }];
    const restored = createAttendanceSubject("Biología", "subject-b");
    restored.events = [{ id: "event-b", date: "2026-09-02", label: "B", status: "absence" }];
    const snapshot = createAttendanceHistorySnapshot({
      subject: { id: restored.id, name: restored.name },
      input: {
        ...restored.manual,
        totalClasses: "3",
        attendedClasses: "2",
        requiredPercent: "80",
      },
      policy: restored.policy,
      source: "manual",
      result: calculatePolicyAttendance({ totalClasses: 3, attendedClasses: 2, requiredPercent: 80 }),
    });

    const prepared = prepareAttendanceRestore([active, restored], snapshot);

    expect(prepared.subject.events).toEqual(restored.events);
    expect(prepared.subject.events).not.toBe(restored.events);
    expect(prepared.subject.events[0]).not.toBe(restored.events[0]);
    prepared.subject.events.push({ id: "event-new", date: "2026-09-03", label: "", status: "attended" });
    expect(restored.events).toHaveLength(1);
    expect(active.events).toEqual([{ id: "event-a", date: "2026-09-01", label: "A", status: "attended" }]);
  });

  it("replaces calendar events and completion state from the snapshot", () => {
    const restored = createAttendanceSubject("Historia", "subject-a");
    restored.events = [{ id: "old-a", date: "2026-09-01", label: "old", status: "absence" }];
    restored.calendarComplete = false;
    const active = createAttendanceSubject("Biología", "subject-b");
    active.events = [{ id: "event-b", date: "2026-09-02", label: "B", status: "attended" }];
    const snapshotEvents: AttendanceCalendarEvent[] = [
      { id: "new-a", date: "2026-09-03", label: "new", status: "attended" },
    ];
    const snapshot = createAttendanceHistorySnapshot({
      subject: { id: restored.id, name: restored.name },
      input: { events: snapshotEvents, calendarComplete: true, requiredPercent: "80" },
      policy: restored.policy,
      source: "calendar",
      result: calculatePolicyAttendance({ totalClasses: 1, attendedClasses: 1, requiredPercent: 80 }),
    });

    const prepared = prepareAttendanceRestore([restored, active], snapshot);

    expect(prepared.subject.source).toBe("calendar");
    expect(prepared.subject.events).toEqual(snapshotEvents);
    expect(prepared.subject.events).not.toBe(snapshotEvents);
    expect(prepared.subject.events[0]).not.toBe(snapshotEvents[0]);
    expect(prepared.subject.calendarComplete).toBe(true);
    expect(prepared.subjects.find((item) => item.id === active.id)?.events).toEqual(active.events);
    prepared.subject.events.pop();
    expect(snapshotEvents).toHaveLength(1);
    expect(active.events).toHaveLength(1);
  });

  it("writes CRLF CSV, separates null from zero, and neutralizes text formulas", () => {
    const result = calculatePolicyAttendance({ totalClasses: 3, attendedClasses: 2, requiredPercent: 80, remainingClasses: 0 });
    const csv = buildAttendanceCsv([policyAttendanceToCsvRow("=SUM(A1)", "manual", result)]);
    expect(csv).toContain("\r\n");
    expect(csv).toContain("'=SUM(A1)");
    expect(csv).toContain(",0,");
    expect(csv.endsWith("\r\n")).toBe(true);
  });
});
