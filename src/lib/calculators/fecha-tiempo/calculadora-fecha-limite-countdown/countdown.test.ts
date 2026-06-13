import { describe, expect, it } from "vitest";
import {
  buildCalendarFile,
  buildCopyText,
  buildShareFragment,
  calculateCountdown,
  createLocalTarget,
  decomposeDuration,
  formatDateInput,
  getLocalDateParts,
  parseDateInput,
  parseShareFragment,
} from "./countdown";

describe("countdown date helpers", () => {
  it("parses and formats valid date inputs", () => {
    const date = { year: 2028, month: 2, day: 29 };

    expect(parseDateInput("2028-02-29")).toEqual(date);
    expect(formatDateInput(date)).toBe("2028-02-29");
    expect(parseDateInput("2025-02-29")).toBeNull();
  });

  it("creates and validates a local target", () => {
    const result = createLocalTarget({ year: 2026, month: 9, day: 30 }, 23, 59);

    expect(result.ok).toBe(true);
    expect(getLocalDateParts(new Date(result.targetMs!))).toEqual({
      year: 2026,
      month: 9,
      day: 30,
    });
    expect(
      createLocalTarget({ year: 2026, month: 9, day: 30 }, 24, 0),
    ).toEqual({ ok: false, error: "time_invalid" });
  });
});

describe("countdown calculations", () => {
  it("calculates a future date-only deadline", () => {
    const now = new Date(2026, 8, 25, 10, 0).getTime();

    expect(
      calculateCountdown({
        mode: "date-only",
        targetDate: { year: 2026, month: 9, day: 30 },
        nowMs: now,
      }),
    ).toEqual({
      mode: "date-only",
      status: "date-future",
      calendarDays: 5,
    });
  });

  it("keeps a date-only deadline as today for the full local day", () => {
    const now = new Date(2026, 8, 30, 23, 59).getTime();

    expect(
      calculateCountdown({
        mode: "date-only",
        targetDate: { year: 2026, month: 9, day: 30 },
        nowMs: now,
      }).status,
    ).toBe("date-today");
  });

  it("decomposes exact duration into 24-hour blocks", () => {
    expect(decomposeDuration((26 * 60 * 60 + 3 * 60 + 4) * 1000)).toEqual({
      days: 1,
      hours: 2,
      minutes: 3,
      seconds: 4,
      totalSeconds: 93784,
    });
  });

  it("prioritizes today and now states", () => {
    const now = new Date(2026, 8, 30, 10, 0).getTime();
    const todayTarget = new Date(2026, 8, 30, 23, 59).getTime();

    expect(
      calculateCountdown({
        mode: "date-time",
        targetDate: getLocalDateParts(new Date(todayTarget)),
        targetMs: todayTarget,
        nowMs: now,
      }).status,
    ).toBe("datetime-today");

    expect(
      calculateCountdown({
        mode: "date-time",
        targetDate: getLocalDateParts(new Date(now)),
        targetMs: now + 500,
        nowMs: now,
      }).status,
    ).toBe("datetime-now");
  });

  it("calculates elapsed time for a past deadline", () => {
    const now = new Date(2026, 8, 30, 10, 0).getTime();
    const target = now - 90 * 60 * 1000;
    const result = calculateCountdown({
      mode: "date-time",
      targetDate: getLocalDateParts(new Date(target)),
      targetMs: target,
      nowMs: now,
    });

    expect(result.status).toBe("datetime-past");
    expect(result.duration).toMatchObject({ hours: 1, minutes: 30 });
  });
});

describe("countdown sharing and export", () => {
  it("shares date-only deadlines without the name by default", () => {
    const fragment = buildShareFragment({
      mode: "date-only",
      date: { year: 2026, month: 9, day: 30 },
      name: "Entrega secreta",
    });

    expect(fragment).toBe("#mode=date-only&date=2026-09-30");
    expect(parseShareFragment(fragment)).toEqual({
      ok: true,
      value: {
        mode: "date-only",
        date: { year: 2026, month: 9, day: 30 },
        name: undefined,
      },
    });
  });

  it("shares an exact timestamp and optional event name", () => {
    const targetMs = new Date(2026, 8, 30, 23, 59).getTime();
    const fragment = buildShareFragment(
      {
        mode: "date-time",
        targetMs,
        timeZone: "America/Mexico_City",
        name: "Entrega final",
      },
      true,
    );
    const parsed = parseShareFragment(fragment);

    expect(parsed).toEqual({
      ok: true,
      value: {
        mode: "date-time",
        targetMs,
        timeZone: "America/Mexico_City",
        name: "Entrega final",
      },
    });
  });

  it("rejects invalid shared fragments", () => {
    expect(parseShareFragment("#mode=date-only&date=2025-02-29")).toEqual({
      ok: false,
    });
    expect(
      parseShareFragment("#mode=date-time&target=abc&tz=Invalid%2FZone"),
    ).toEqual({ ok: false });
  });

  it("builds an all-day calendar event with exclusive end date", () => {
    const calendar = buildCalendarFile({
      name: "Entrega, final",
      mode: "date-only",
      targetDate: { year: 2026, month: 9, day: 30 },
      nowMs: Date.UTC(2026, 0, 1),
    });

    expect(calendar).toContain("SUMMARY:Entrega\\, final");
    expect(calendar).toContain("DTSTART;VALUE=DATE:20260930");
    expect(calendar).toContain("DTEND;VALUE=DATE:20261001");
  });

  it("builds a timed calendar event in UTC", () => {
    const targetMs = Date.UTC(2026, 8, 30, 23, 59);
    const calendar = buildCalendarFile({
      mode: "date-time",
      targetDate: getLocalDateParts(new Date(targetMs)),
      targetMs,
      nowMs: Date.UTC(2026, 0, 1),
    });

    expect(calendar).toContain("DTSTART:20260930T235900Z");
  });

  it("builds copy text without live seconds", () => {
    const targetDate = { year: 2026, month: 9, day: 30 };
    const result = calculateCountdown({
      mode: "date-time",
      targetDate,
      targetMs: new Date(2026, 8, 30, 23, 59).getTime(),
      nowMs: new Date(2026, 8, 29, 22, 56, 45).getTime(),
    });
    const text = buildCopyText({
      name: "Entrega",
      mode: "date-time",
      targetDate,
      targetMs: new Date(2026, 8, 30, 23, 59).getTime(),
      timeZone: "America/Mexico_City",
      result,
    });

    expect(text).toContain("Tiempo exacto: 1 día, 1 hora y 2 minutos.");
    expect(text).not.toContain("15 segundos");
  });
});
