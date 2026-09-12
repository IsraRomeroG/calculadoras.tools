import { describe, expect, it } from "vitest";
import {
  addBusinessDays,
  addCalendarMonths,
  calculateDateDifference,
  calculateDateOperation,
  countBusinessDays,
  countWeekendDays,
  diffCalendarParts,
  diffTotalDays,
  buildDateDifferenceCopyText,
  formatCompactDuration,
  formatFullPlainDate,
  formatWeekDuration,
  getDayOfYear,
  getIsoWeek,
  getNextBusinessDay,
  isLeapYear,
  isValidDateParts,
  parseDateParts,
} from "./date-difference";

describe("date difference calendar helpers", () => {
  it("detects leap years using Gregorian rules", () => {
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2025)).toBe(false);
  });

  it("validates real calendar dates", () => {
    expect(isValidDateParts({ year: 2024, month: 2, day: 29 })).toBe(true);
    expect(isValidDateParts({ year: 2025, month: 2, day: 29 })).toBe(false);
    expect(isValidDateParts({ year: 2026, month: 4, day: 31 })).toBe(false);
  });

  it("rejects two-digit years when parsing", () => {
    expect(
      parseDateParts({
        day: "15",
        month: "03",
        year: "26",
        minYear: 1900,
        maxYear: 2100,
      }),
    ).toEqual({ ok: false, error: "year_four_digits" });
  });
});

describe("date differences", () => {
  it("calculates the main standard difference example", () => {
    const result = calculateDateDifference({
      startDate: { year: 2026, month: 1, day: 15 },
      endDate: { year: 2026, month: 9, day: 30 },
    });

    expect(result).toMatchObject({
      sign: 1,
      totalDays: 258,
      calendar: { years: 0, months: 8, days: 15 },
      weeks: { weeks: 36, days: 6 },
      businessDays: 184,
      weekendDays: 74,
      startWeekday: "jueves",
      endWeekday: "miércoles",
    });
  });

  it("supports inclusive counting", () => {
    expect(
      diffTotalDays(
        { year: 2026, month: 1, day: 15 },
        { year: 2026, month: 9, day: 30 },
        "inclusive",
      ),
    ).toBe(259);
    expect(
      calculateDateDifference({
        startDate: { year: 2026, month: 1, day: 15 },
        endDate: { year: 2026, month: 9, day: 30 },
        countMode: "inclusive",
      }).totalDays,
    ).toBe(259);
  });

  it("handles equal dates in standard and inclusive counting", () => {
    expect(
      diffTotalDays(
        { year: 2026, month: 1, day: 1 },
        { year: 2026, month: 1, day: 1 },
      ),
    ).toBe(0);
    expect(
      diffTotalDays(
        { year: 2026, month: 1, day: 1 },
        { year: 2026, month: 1, day: 1 },
        "inclusive",
      ),
    ).toBe(1);

    const result = calculateDateDifference({
      startDate: { year: 2026, month: 1, day: 1 },
      endDate: { year: 2026, month: 1, day: 1 },
      countMode: "inclusive",
    });

    expect(result.businessDays + result.weekendDays).toBe(result.totalDays);
  });

  it("keeps the sign for inverted date ranges", () => {
    const result = calculateDateDifference({
      startDate: { year: 2026, month: 9, day: 30 },
      endDate: { year: 2026, month: 1, day: 15 },
    });

    expect(result.sign).toBe(-1);
    expect(result.totalDays).toBe(258);
    expect(
      diffTotalDays(
        { year: 2026, month: 9, day: 30 },
        { year: 2026, month: 1, day: 15 },
      ),
    ).toBe(-258);
  });

  it("counts business days and weekends without holidays", () => {
    expect(
      countBusinessDays(
        { year: 2026, month: 1, day: 15 },
        { year: 2026, month: 9, day: 30 },
      ),
    ).toBe(184);
    expect(
      countWeekendDays(
        { year: 2026, month: 1, day: 15 },
        { year: 2026, month: 9, day: 30 },
      ),
    ).toBe(74);
  });

  it("keeps business and weekend counts partitioned in both directions and modes", () => {
    const dates = [
      [
        { year: 2026, month: 9, day: 11 },
        { year: 2026, month: 9, day: 14 },
      ],
      [
        { year: 2026, month: 9, day: 14 },
        { year: 2026, month: 9, day: 11 },
      ],
    ] as const;

    expect(
      dates.map(([startDate, endDate]) =>
        calculateDateDifference({ startDate, endDate }),
      ),
    ).toEqual([
      expect.objectContaining({ totalDays: 3, businessDays: 1, weekendDays: 2 }),
      expect.objectContaining({ totalDays: 3, businessDays: 1, weekendDays: 2 }),
    ]);

    expect(
      dates.map(([startDate, endDate]) =>
        calculateDateDifference({
          startDate,
          endDate,
          countMode: "inclusive",
        }),
      ),
    ).toEqual([
      expect.objectContaining({ totalDays: 4, businessDays: 2, weekendDays: 2 }),
      expect.objectContaining({ totalDays: 4, businessDays: 2, weekendDays: 2 }),
    ]);
  });

  it("keeps end-of-month calendar duration behavior stable", () => {
    expect(
      diffCalendarParts(
        { year: 2026, month: 1, day: 31 },
        { year: 2026, month: 2, day: 28 },
      ),
    ).toEqual({ years: 0, months: 1, days: 0 });
    expect(
      diffCalendarParts(
        { year: 2026, month: 1, day: 31 },
        { year: 2026, month: 3, day: 1 },
      ),
    ).toEqual({ years: 0, months: 1, days: 1 });
  });
});

describe("date operations", () => {
  it("adds calendar days without counting the start date as day one", () => {
    expect(
      calculateDateOperation({
        startDate: { year: 2026, month: 5, day: 1 },
        operation: "add",
        amount: 90,
        unit: "days",
      }),
    ).toMatchObject({
      date: { year: 2026, month: 7, day: 30 },
      weekday: "jueves",
      dayOfYear: 211,
      isoWeek: 31,
      quarter: 3,
      isWeekend: false,
    });
  });

  it("adds business days by skipping Saturdays and Sundays", () => {
    expect(
      addBusinessDays({ year: 2026, month: 5, day: 1 }, 90),
    ).toEqual({ year: 2026, month: 9, day: 4 });
    expect(
      calculateDateOperation({
        startDate: { year: 2026, month: 5, day: 1 },
        operation: "add",
        amount: 90,
        unit: "businessDays",
      }).date,
    ).toEqual({ year: 2026, month: 9, day: 4 });
  });

  it("supports subtracting business days", () => {
    expect(addBusinessDays({ year: 2026, month: 9, day: 4 }, -90)).toEqual({
      year: 2026,
      month: 5,
      day: 1,
    });
  });

  it("adjusts month additions to the last valid day", () => {
    expect(addCalendarMonths({ year: 2026, month: 1, day: 31 }, 1)).toEqual({
      year: 2026,
      month: 2,
      day: 28,
    });
    expect(addCalendarMonths({ year: 2024, month: 1, day: 31 }, 1)).toEqual({
      year: 2024,
      month: 2,
      day: 29,
    });
  });

  it("suggests the next business day when a result falls on a weekend", () => {
    const result = calculateDateOperation({
      startDate: { year: 2026, month: 7, day: 31 },
      operation: "add",
      amount: 1,
      unit: "days",
    });

    expect(result).toMatchObject({
      date: { year: 2026, month: 8, day: 1 },
      isWeekend: true,
      nextBusinessDay: { year: 2026, month: 8, day: 3 },
    });
    expect(getNextBusinessDay({ year: 2026, month: 8, day: 1 })).toEqual({
      year: 2026,
      month: 8,
      day: 3,
    });
  });

  it("throws when an operation leaves the supported year range", () => {
    expect(() =>
      calculateDateOperation({
        startDate: { year: 1900, month: 1, day: 1 },
        operation: "subtract",
        amount: 1,
        unit: "days",
      }),
    ).toThrow(RangeError);
  });
});

describe("event and formatting helpers", () => {
  it("calculates days until a future event from a base date", () => {
    const result = calculateDateDifference({
      startDate: { year: 2026, month: 4, day: 25 },
      endDate: { year: 2026, month: 12, day: 31 },
    });

    expect(result.totalDays).toBe(250);
    expect(result.businessDays).toBe(179);
    expect(result.weeks).toEqual({ weeks: 35, days: 5 });
  });

  it("calculates day-of-year and ISO week metadata", () => {
    expect(getDayOfYear({ year: 2026, month: 7, day: 30 })).toBe(211);
    expect(getIsoWeek({ year: 2026, month: 7, day: 30 })).toBe(31);
  });

  it("formats Spanish dates and durations", () => {
    expect(formatFullPlainDate({ year: 2026, month: 9, day: 30 })).toBe(
      "miércoles, 30 de septiembre de 2026",
    );
    expect(formatCompactDuration({ years: 0, months: 8, days: 15 })).toBe(
      "8 meses y 15 días",
    );
    expect(formatWeekDuration({ weeks: 36, days: 6 })).toBe(
      "36 semanas y 6 días",
    );
  });

  it("copies explicit count labels and calendar limitations", () => {
    const result = calculateDateDifference({
      startDate: { year: 2026, month: 1, day: 15 },
      endDate: { year: 2026, month: 9, day: 30 },
      countMode: "inclusive",
    });
    const copy = buildDateDifferenceCopyText({
      startDate: { year: 2026, month: 1, day: 15 },
      endDate: { year: 2026, month: 9, day: 30 },
      countMode: "inclusive",
      result,
    });

    expect(copy).toContain("Días naturales (inclusivo): 259 días");
    expect(copy).toContain(
      "Desglose de calendario (conteo estándar): 8 meses y 15 días",
    );
    expect(copy).toContain("Fines de semana (inclusivo): 74");
  });
});
