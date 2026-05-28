import { describe, expect, it } from "vitest";
import {
  calculateAge,
  calculateAgeDifferenceBetweenPeople,
  calculateAgeResult,
  calculateAlternativeUnits,
  calculateNextAnniversary,
  calculateTargetAgeDate,
  diffCalendarDates,
  diffTotalDays,
  formatAgeDifference,
  formatCompactDuration,
  formatPlainDate,
  isLeapYear,
  isValidDateParts,
  parseDateParts,
} from "./age";

describe("age calendar helpers", () => {
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
        year: "90",
        minYear: 1900,
        maxYear: 2026,
      }),
    ).toEqual({ ok: false, error: "year_four_digits" });
  });
});

describe("age calculations", () => {
  it("calculates the main age example", () => {
    const age = calculateAge({
      birthDate: { year: 1990, month: 3, day: 15 },
      referenceDate: { year: 2026, month: 4, day: 25 },
    });

    expect(age).toEqual({
      years: 36,
      months: 1,
      days: 10,
      totalDays: 13190,
    });
  });

  it("calculates alternative units from the main example", () => {
    const age = calculateAge({
      birthDate: { year: 1990, month: 3, day: 15 },
      referenceDate: { year: 2026, month: 4, day: 25 },
    });

    expect(calculateAlternativeUnits(age.totalDays, age)).toEqual({
      completeYears: 36,
      completeMonths: 433,
      completeWeeks: 1884,
      days: 13190,
      approximateHours: 316560,
      approximateMinutes: 18993600,
      approximateSeconds: 1139616000,
    });
  });

  it("calculates age on a future reference date", () => {
    expect(
      calculateAge({
        birthDate: { year: 2020, month: 7, day: 3 },
        referenceDate: { year: 2026, month: 9, day: 1 },
      }),
    ).toMatchObject({
      years: 6,
      months: 1,
      days: 29,
    });
  });

  it("calculates event age and total days", () => {
    expect(
      calculateAge({
        birthDate: { year: 2015, month: 1, day: 10 },
        referenceDate: { year: 2026, month: 4, day: 25 },
      }),
    ).toEqual({
      years: 11,
      months: 3,
      days: 15,
      totalDays: 4123,
    });
  });

  it("returns zero for the same date", () => {
    expect(
      calculateAge({
        birthDate: { year: 2026, month: 4, day: 25 },
        referenceDate: { year: 2026, month: 4, day: 25 },
      }),
    ).toEqual({
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
    });
  });

  it("throws when reference date is before birth date", () => {
    expect(() =>
      calculateAge({
        birthDate: { year: 2026, month: 4, day: 25 },
        referenceDate: { year: 2026, month: 4, day: 24 },
      }),
    ).toThrow(RangeError);
  });
});

describe("anniversaries and target ages", () => {
  it("calculates the next birthday after the reference date", () => {
    const result = calculateNextAnniversary({
      date: { year: 1990, month: 3, day: 15 },
      referenceDate: { year: 2026, month: 4, day: 25 },
    });

    expect(result).toMatchObject({
      date: { year: 2027, month: 3, day: 15 },
      daysUntil: 324,
      calendarUntil: { years: 0, months: 10, days: 18 },
      turningYears: 37,
    });
  });

  it("calculates target age date", () => {
    expect(
      calculateTargetAgeDate({
        birthDate: { year: 1990, month: 3, day: 15 },
        targetAge: 40,
      }),
    ).toEqual({ year: 2030, month: 3, day: 15 });
  });
});

describe("leap day behavior", () => {
  it("uses February 28 as the default rule for leap day birthdays", () => {
    const result = calculateAgeResult({
      birthDate: { year: 2024, month: 2, day: 29 },
      referenceDate: { year: 2025, month: 2, day: 28 },
      today: { year: 2025, month: 2, day: 28 },
    });

    expect(result.age).toMatchObject({ years: 1, months: 0, days: 0 });
    expect(result.nextAnniversary.date).toEqual({
      year: 2025,
      month: 2,
      day: 28,
    });
  });

  it("supports March 1 as an alternate leap day rule", () => {
    const result = calculateAgeResult({
      birthDate: { year: 2024, month: 2, day: 29 },
      referenceDate: { year: 2025, month: 2, day: 28 },
      today: { year: 2025, month: 2, day: 28 },
      leapDayRule: "mar-01",
    });

    expect(result.age).toMatchObject({ years: 0, months: 11, days: 30 });
    expect(result.nextAnniversary.date).toEqual({
      year: 2025,
      month: 3,
      day: 1,
    });
  });

  it("restores February 29 for the next anniversary in a future leap year", () => {
    const result = calculateNextAnniversary({
      date: { year: 2024, month: 2, day: 29 },
      referenceDate: { year: 2027, month: 3, day: 1 },
    });

    expect(result.date).toEqual({ year: 2028, month: 2, day: 29 });
  });
});

describe("date differences and formatting", () => {
  it("calculates the difference between two people", () => {
    expect(
      calculateAgeDifferenceBetweenPeople(
        { year: 1990, month: 3, day: 15 },
        { year: 1994, month: 8, day: 22 },
      ),
    ).toEqual({
      older: "a",
      difference: {
        years: 4,
        months: 5,
        days: 7,
        totalDays: 1621,
      },
    });
  });

  it("keeps end-of-month behavior stable", () => {
    expect(
      diffCalendarDates(
        { year: 2026, month: 1, day: 31 },
        { year: 2026, month: 2, day: 28 },
      ),
    ).toEqual({ years: 0, months: 1, days: 0 });
    expect(
      diffCalendarDates(
        { year: 2026, month: 1, day: 31 },
        { year: 2026, month: 3, day: 1 },
      ),
    ).toEqual({ years: 0, months: 1, days: 1 });
  });

  it("calculates total days without inclusive counting", () => {
    expect(
      diffTotalDays(
        { year: 2026, month: 1, day: 1 },
        { year: 2026, month: 1, day: 2 },
      ),
    ).toBe(1);
  });

  it("formats Spanish dates and durations", () => {
    expect(formatPlainDate({ year: 2027, month: 3, day: 15 })).toBe(
      "15 de marzo de 2027",
    );
    expect(formatAgeDifference({ years: 36, months: 1, days: 10 })).toBe(
      "36 años, 1 mes y 10 días",
    );
    expect(formatCompactDuration({ years: 0, months: 10, days: 18 })).toBe(
      "10 meses y 18 días",
    );
  });
});
