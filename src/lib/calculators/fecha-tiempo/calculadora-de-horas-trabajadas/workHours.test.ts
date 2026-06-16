import { describe, expect, it } from "vitest";
import {
  WorkHoursValidationError,
  buildWorkHoursSummary,
  calculateWorkHours,
  formatDecimalHours,
  formatDuration,
  formatWorkCurrency,
  parseTimeToMinutes,
  parseWorkNumber,
  type WorkHoursInput,
} from "./workHours";

const baseInput: WorkHoursInput = {
  shifts: [
    {
      label: "Jornada",
      start: "09:00",
      end: "18:00",
      breakMinutes: 60,
    },
  ],
  regularHoursLimit: 8,
  overtimeMultiplier: 1.5,
};

describe("work hours calculation", () => {
  it("calculates a standard shift with a break", () => {
    const result = calculateWorkHours(baseInput);

    expect(result).toMatchObject({
      grossMinutes: 540,
      breakMinutes: 60,
      netMinutes: 480,
      decimalHours: 8,
      regularMinutes: 480,
      overtimeMinutes: 0,
      differenceFromRegularLimitMinutes: 0,
    });
  });

  it("applies the regular limit once to the whole day", () => {
    const result = calculateWorkHours({
      ...baseInput,
      shifts: [
        { label: "Mañana", start: "08:00", end: "13:00", breakMinutes: 0 },
        { label: "Tarde", start: "14:00", end: "19:00", breakMinutes: 0 },
      ],
    });

    expect(result.netMinutes).toBe(600);
    expect(result.regularMinutes).toBe(480);
    expect(result.overtimeMinutes).toBe(120);
  });

  it("supports an overnight shift and subtracts its break", () => {
    const result = calculateWorkHours({
      ...baseInput,
      shifts: [
        { label: "Noche", start: "22:00", end: "06:00", breakMinutes: 30 },
      ],
    });

    expect(result.shifts[0]).toMatchObject({
      crossesMidnight: true,
      grossMinutes: 480,
      netMinutes: 450,
    });
    expect(result.warnings.map((warning) => warning.code)).toContain(
      "overnight_shift",
    );
  });

  it("allows adjacent shifts", () => {
    const result = calculateWorkHours({
      ...baseInput,
      shifts: [
        { label: "Uno", start: "09:00", end: "13:00", breakMinutes: 0 },
        { label: "Dos", start: "13:00", end: "17:00", breakMinutes: 0 },
      ],
    });

    expect(result.netMinutes).toBe(480);
  });

  it("detects overlapping shifts, including overnight intervals", () => {
    expect(() =>
      calculateWorkHours({
        ...baseInput,
        shifts: [
          { label: "Uno", start: "09:00", end: "14:00", breakMinutes: 0 },
          { label: "Dos", start: "13:00", end: "17:00", breakMinutes: 0 },
        ],
      }),
    ).toThrow(/solapan/i);

    try {
      calculateWorkHours({
        ...baseInput,
        shifts: [
          { label: "Noche", start: "22:00", end: "06:00", breakMinutes: 0 },
          { label: "Apoyo", start: "23:00", end: "01:00", breakMinutes: 0 },
        ],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(WorkHoursValidationError);
      expect((error as WorkHoursValidationError).code).toBe("overlap");
      expect((error as WorkHoursValidationError).shiftIndexes).toEqual([0, 1]);
    }
  });

  it("rejects equal entry and exit instead of assuming 24 hours", () => {
    expect(() =>
      calculateWorkHours({
        ...baseInput,
        shifts: [
          { label: "Ambiguo", start: "09:00", end: "09:00", breakMinutes: 0 },
        ],
      }),
    ).toThrow(/no pueden ser iguales/i);
  });

  it("rejects breaks equal to or longer than the gross shift", () => {
    expect(() =>
      calculateWorkHours({
        ...baseInput,
        shifts: [
          { label: "Corto", start: "09:00", end: "10:00", breakMinutes: 60 },
        ],
      }),
    ).toThrow(/debe ser menor/i);
  });
});

describe("payment and warnings", () => {
  it("calculates payment from exact minutes", () => {
    const result = calculateWorkHours({
      shifts: [
        { label: "Mañana", start: "09:00", end: "14:00", breakMinutes: 30 },
        { label: "Tarde", start: "15:00", end: "20:00", breakMinutes: 0 },
      ],
      regularHoursLimit: 8,
      overtimeMultiplier: 1.5,
      hourlyRate: 100,
    });

    expect(result.netMinutes).toBe(570);
    expect(result.payment).toMatchObject({
      regularPay: 800,
      overtimePay: 225,
      totalPay: 1025,
    });
  });

  it("keeps payment hidden when rate is absent and shows zero when rate is zero", () => {
    expect(calculateWorkHours(baseInput).payment).toBeUndefined();

    const zeroRate = calculateWorkHours({ ...baseInput, hourlyRate: 0 });

    expect(zeroRate.payment?.totalPay).toBe(0);
    expect(zeroRate.warnings.map((warning) => warning.code)).toContain(
      "zero_rate",
    );
  });

  it("converts all time to overtime when the regular limit is zero", () => {
    const result = calculateWorkHours({
      ...baseInput,
      regularHoursLimit: 0,
    });

    expect(result.regularMinutes).toBe(0);
    expect(result.overtimeMinutes).toBe(480);
    expect(result.warnings.map((warning) => warning.code)).toEqual(
      expect.arrayContaining(["zero_regular_limit", "legal_estimate"]),
    );
  });

  it("normalizes a decimal regular limit to the nearest minute", () => {
    const result = calculateWorkHours({
      ...baseInput,
      regularHoursLimit: 7.33,
    });

    expect(result.regularMinutes).toBe(440);
    expect(result.overtimeMinutes).toBe(40);
  });

  it("warns about unusually long days and long breaks", () => {
    const result = calculateWorkHours({
      ...baseInput,
      shifts: [
        { label: "Largo", start: "00:00", end: "23:59", breakMinutes: 400 },
      ],
    });

    expect(result.warnings.map((warning) => warning.code)).toContain(
      "long_day",
    );

    const longBreak = calculateWorkHours({
      ...baseInput,
      shifts: [
        {
          label: "Pausa larga",
          start: "09:00",
          end: "13:00",
          breakMinutes: 130,
        },
      ],
    });

    expect(longBreak.warnings.map((warning) => warning.code)).toContain(
      "long_break",
    );
  });
});

describe("parsing, formatting, and copy summary", () => {
  it("parses valid time and rejects invalid time", () => {
    expect(parseTimeToMinutes("22:30")).toBe(1350);
    expect(parseTimeToMinutes("24:00")).toBeNull();
    expect(parseTimeToMinutes("9:00")).toBeNull();
  });

  it("parses decimal and integer inputs", () => {
    expect(parseWorkNumber("12,5")).toEqual({
      ok: true,
      value: 12.5,
      normalized: "12.5",
    });
    expect(parseWorkNumber("30", { integer: true })).toMatchObject({
      ok: true,
      value: 30,
    });
    expect(parseWorkNumber("30.5", { integer: true })).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
    expect(parseWorkNumber("-1")).toEqual({
      ok: false,
      error: "negative",
    });
  });

  it("formats durations, decimal hours, and currency", () => {
    expect(formatDuration(485)).toBe("8 h 05 min");
    expect(formatDecimalHours(485 / 60)).toBe("8.08");
    expect(formatWorkCurrency(1025)).toBe("$1,025.00");
  });

  it("builds a copy summary and omits money without a rate", () => {
    const withoutRate = buildWorkHoursSummary(calculateWorkHours(baseInput));
    const withRate = buildWorkHoursSummary(
      calculateWorkHours({ ...baseInput, hourlyRate: 100 }),
    );

    expect(withoutRate).toContain("Total trabajado: 8 h 00 min (8.00 h)");
    expect(withoutRate).not.toContain("Pago total estimado");
    expect(withRate).toContain("Pago total estimado: $800.00");
  });
});

describe("settings validation", () => {
  it("rejects invalid settings and empty shifts", () => {
    expect(() => calculateWorkHours({ ...baseInput, shifts: [] })).toThrow(
      /al menos un turno/i,
    );
    expect(() =>
      calculateWorkHours({ ...baseInput, regularHoursLimit: 25 }),
    ).toThrow(/entre 0 y 24/i);
    expect(() =>
      calculateWorkHours({ ...baseInput, overtimeMultiplier: 0.5 }),
    ).toThrow(/entre 1 y 5/i);
    expect(() =>
      calculateWorkHours({ ...baseInput, hourlyRate: -1 }),
    ).toThrow(/igual o mayor que cero/i);
  });
});
