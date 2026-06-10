import { describe, expect, it } from "vitest";
import {
  calculateFreelanceRate,
  formatCurrency,
  formatPercent,
  formatQuantity,
  parseMoneyInput,
  parsePercentInput,
  parseQuantityInput,
  roundUpToIncrement,
  type FreelanceRateInput,
} from "./freelanceRate";

const baseInput: FreelanceRateInput = {
  desiredNetMonthlyIncome: 40_000,
  weeklyWorkHours: 40,
  billablePercentage: 60,
  monthlyBusinessExpenses: 8_000,
  monthlySavings: 3_000,
  taxReserveRate: 25,
  collectionFeeRate: 3,
  weeksOffPerYear: 4,
  billableDayHours: 8,
  roundingIncrement: 50,
};

describe("freelance rate calculation", () => {
  it("calculates the documented example", () => {
    const result = calculateFreelanceRate(baseInput);

    expect(result.weeksWorkedPerYear).toBe(48);
    expect(result.billableHoursAnnual).toBe(1152);
    expect(result.billableHoursMonthly).toBe(96);
    expect(result.preTaxProfitRequired).toBeCloseTo(57_333.3333);
    expect(result.monthlyRevenueRequired).toBeCloseTo(67_353.9519);
    expect(result.minimumHourlyRate).toBeCloseTo(701.6037);
    expect(result.practicalHourlyRate).toBe(750);
    expect(result.practicalDayRate).toBe(6000);
  });

  it("applies taxes to profit instead of business expenses", () => {
    const result = calculateFreelanceRate({
      ...baseInput,
      desiredNetMonthlyIncome: 10_000,
      monthlySavings: 0,
      monthlyBusinessExpenses: 5_000,
      taxReserveRate: 25,
      collectionFeeRate: 0,
    });

    expect(result.preTaxProfitRequired).toBeCloseTo(13_333.3333);
    expect(result.monthlyRevenueRequired).toBeCloseTo(18_333.3333);
    expect(result.monthlyTaxReserve).toBeCloseTo(3333.3333);
  });

  it("applies collection fees to total required revenue", () => {
    const result = calculateFreelanceRate({
      ...baseInput,
      desiredNetMonthlyIncome: 10_000,
      monthlySavings: 0,
      monthlyBusinessExpenses: 0,
      taxReserveRate: 0,
      collectionFeeRate: 3,
    });

    expect(result.monthlyRevenueRequired).toBeCloseTo(10_000 / 0.97);
    expect(result.monthlyCollectionFee).toBeCloseTo(
      result.monthlyRevenueRequired * 0.03,
    );
  });

  it("calculates the rate without savings separately", () => {
    const withSavings = calculateFreelanceRate(baseInput);
    const withoutSavings = calculateFreelanceRate({
      ...baseInput,
      monthlySavings: 0,
    });

    expect(withSavings.minimumRateWithoutSavings).toBeCloseTo(
      withoutSavings.minimumHourlyRate,
    );
    expect(withSavings.minimumRateWithoutSavings).toBeLessThan(
      withSavings.minimumHourlyRate,
    );
  });

  it("raises the rate when billable capacity or worked weeks decrease", () => {
    const lowerCapacity = calculateFreelanceRate({
      ...baseInput,
      billablePercentage: 50,
    });
    const moreTimeOff = calculateFreelanceRate({
      ...baseInput,
      weeksOffPerYear: 8,
    });
    const result = calculateFreelanceRate(baseInput);

    expect(lowerCapacity.minimumHourlyRate).toBeGreaterThan(
      result.minimumHourlyRate,
    );
    expect(moreTimeOff.minimumHourlyRate).toBeGreaterThan(
      result.minimumHourlyRate,
    );
  });
});

describe("comparison, scenarios, and warnings", () => {
  it("compares a current rate against the exact minimum", () => {
    const below = calculateFreelanceRate({
      ...baseInput,
      currentHourlyRate: 600,
    });
    const meets = calculateFreelanceRate({
      ...baseInput,
      currentHourlyRate: 750,
    });

    expect(below.currentRateComparison?.status).toBe("below");
    expect(below.currentRateComparison?.differenceAmount).toBeLessThan(0);
    expect(meets.currentRateComparison?.status).toBe("meets");
    expect(meets.currentRateComparison?.differencePercentage).toBeGreaterThan(0);
  });

  it("builds low, current, and high capacity scenarios", () => {
    const result = calculateFreelanceRate(baseInput);

    expect(result.scenarios.map((scenario) => scenario.billablePercentage)).toEqual([
      50, 60, 70,
    ]);
    expect(result.scenarios.find((scenario) => scenario.current)?.billablePercentage).toBe(
      60,
    );
    expect(result.scenarios[0].minimumHourlyRate).toBeGreaterThan(
      result.scenarios[2].minimumHourlyRate,
    );
  });

  it("clamps scenarios and removes duplicates", () => {
    const low = calculateFreelanceRate({
      ...baseInput,
      billablePercentage: 1,
    });
    const high = calculateFreelanceRate({
      ...baseInput,
      billablePercentage: 100,
    });

    expect(low.scenarios.map((scenario) => scenario.billablePercentage)).toEqual([
      1, 11,
    ]);
    expect(high.scenarios.map((scenario) => scenario.billablePercentage)).toEqual([
      90, 100,
    ]);
  });

  it("returns non-blocking warnings for risky assumptions", () => {
    const result = calculateFreelanceRate({
      ...baseInput,
      weeklyWorkHours: 70,
      billablePercentage: 90,
      taxReserveRate: 0,
      weeksOffPerYear: 20,
    });
    const lowCapacity = calculateFreelanceRate({
      ...baseInput,
      weeklyWorkHours: 1,
      billablePercentage: 1,
    });

    expect(result.warnings).toEqual(
      expect.arrayContaining([
        "no_tax_reserve",
        "high_billable_percentage",
        "high_weekly_hours",
      ]),
    );
    expect(lowCapacity.warnings).toContain("low_billable_hours");
  });
});

describe("validation, rounding, parsing, and formatting", () => {
  it("rejects values outside the documented domain", () => {
    expect(() =>
      calculateFreelanceRate({ ...baseInput, desiredNetMonthlyIncome: 0 }),
    ).toThrow(/mayor que cero/i);
    expect(() =>
      calculateFreelanceRate({ ...baseInput, billablePercentage: 0 }),
    ).toThrow(/entre 1 y 100/i);
    expect(() =>
      calculateFreelanceRate({ ...baseInput, taxReserveRate: 81 }),
    ).toThrow(/entre 0 y 80/i);
    expect(() =>
      calculateFreelanceRate({ ...baseInput, collectionFeeRate: 51 }),
    ).toThrow(/entre 0 y 50/i);
    expect(() =>
      calculateFreelanceRate({ ...baseInput, currentHourlyRate: 0 }),
    ).toThrow(/mayor que cero/i);
  });

  it("rounds upward without raising exact increments", () => {
    expect(roundUpToIncrement(701.6, 50)).toBe(750);
    expect(roundUpToIncrement(700, 50)).toBe(700);
    expect(roundUpToIncrement(0.3 / 0.1, 1)).toBe(3);
  });

  it("parses common es-MX values", () => {
    expect(parseMoneyInput("$40,000 MXN")).toMatchObject({
      ok: true,
      value: 40_000,
    });
    expect(parseMoneyInput("1.000,50")).toMatchObject({
      ok: true,
      value: 1000.5,
    });
    expect(parsePercentInput("12,5%")).toMatchObject({
      ok: true,
      value: 12.5,
    });
    expect(parseQuantityInput("40.5")).toMatchObject({
      ok: true,
      value: 40.5,
    });
  });

  it("rejects invalid, negative, and overly precise values", () => {
    expect(parseMoneyInput("")).toEqual({ ok: false, error: "required" });
    expect(parseMoneyInput("-20")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parsePercentInput("12.345")).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
    expect(parseQuantityInput("abc")).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("formats values for es-MX", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
    expect(formatQuantity(96.25)).toBe("96.25");
    expect(formatPercent(60)).toBe("60%");
  });
});
