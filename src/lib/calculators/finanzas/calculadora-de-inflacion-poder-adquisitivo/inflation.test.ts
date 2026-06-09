import { describe, expect, it } from "vitest";
import {
  buildInflationAnnualRows,
  buildInflationScenarios,
  calculateInflation,
  convertDuration,
  formatCurrency,
  formatDuration,
  parseDurationInput,
  parseMoneyInput,
  parseRateInput,
  roundCurrency,
} from "./inflation";

describe("inflation calculator", () => {
  it("calculates future cost and present value", () => {
    const future = calculateInflation({
      mode: "future-cost",
      amount: 1000,
      annualRate: 10,
      duration: 1,
      durationUnit: "years",
    });
    const present = calculateInflation({
      mode: "present-value",
      amount: 1100,
      annualRate: 10,
      duration: 1,
      durationUnit: "years",
    });

    expect(future.futureCost).toBeCloseTo(1100);
    expect(future.primaryValue).toBeCloseTo(1100);
    expect(present.presentValue).toBeCloseTo(1000);
    expect(present.primaryValue).toBeCloseTo(1000);
  });

  it("separates price increases from purchasing power loss", () => {
    const result = calculateInflation({
      mode: "future-cost",
      amount: 100,
      annualRate: 100,
      duration: 1,
      durationUnit: "years",
    });

    expect(result.futureCost).toBe(200);
    expect(result.priceIncreasePercent).toBe(100);
    expect(result.purchasingPowerRemainingPercent).toBe(50);
    expect(result.purchasingPowerLossPercent).toBe(50);
  });

  it("calculates the default example without rounding internally", () => {
    const result = calculateInflation({
      mode: "future-cost",
      amount: 10_000,
      annualRate: 5,
      duration: 10,
      durationUnit: "years",
    });

    expect(roundCurrency(result.futureCost)).toBe(16_288.95);
    expect(roundCurrency(result.presentValue)).toBe(6_139.13);
    expect(roundCurrency(result.additionalAmountNeeded)).toBe(6_288.95);
  });

  it("keeps values unchanged at zero inflation and creates a warning", () => {
    const result = calculateInflation({
      mode: "present-value",
      amount: 5000,
      annualRate: 0,
      duration: 20,
      durationUnit: "years",
    });

    expect(result.futureCost).toBe(5000);
    expect(result.presentValue).toBe(5000);
    expect(result.purchasingPowerLossPercent).toBe(0);
    expect(result.warnings).toHaveLength(1);
  });

  it("creates high-rate and long-duration warnings", () => {
    const result = calculateInflation({
      mode: "future-cost",
      amount: 1000,
      annualRate: 31,
      duration: 51,
      durationUnit: "years",
    });

    expect(result.warnings).toHaveLength(2);
  });
});

describe("scenarios and annual detail", () => {
  const input = {
    mode: "future-cost" as const,
    amount: 10_000,
    annualRate: 5,
    duration: 18,
    durationUnit: "months" as const,
  };

  it("builds low, current, and high scenarios", () => {
    const scenarios = buildInflationScenarios(input);

    expect(scenarios.map((scenario) => scenario.annualRate)).toEqual([3, 5, 7]);
    expect(scenarios[1].differenceFromCurrent).toBe(0);
    expect(scenarios[0].primaryValue).toBeLessThan(scenarios[1].primaryValue);
    expect(scenarios[2].primaryValue).toBeGreaterThan(scenarios[1].primaryValue);
  });

  it("respects scenario limits and removes duplicates", () => {
    const zeroRateScenarios = buildInflationScenarios({
      ...input,
      annualRate: 0,
    });

    expect(zeroRateScenarios.map((scenario) => scenario.annualRate)).toEqual([
      0, 2,
    ]);
    expect(zeroRateScenarios[0].key).toBe("current");
    expect(
      buildInflationScenarios({ ...input, annualRate: 100 }).map(
        (scenario) => scenario.annualRate,
      ),
    ).toEqual([98, 100]);
  });

  it("builds full-year rows and a final partial row", () => {
    const rows = buildInflationAnnualRows(input);

    expect(rows).toHaveLength(2);
    expect(rows[0].elapsedMonths).toBe(12);
    expect(rows[0].periodLabel).toBe("1 año");
    expect(rows[1].elapsedMonths).toBe(18);
    expect(rows[1].periodLabel).toBe("1 año y 6 meses");
  });
});

describe("conversion, parsing, and formatting", () => {
  it("converts duration units without changing the represented duration", () => {
    expect(convertDuration(1.5, "years", "months")).toBe(18);
    expect(convertDuration(18, "months", "years")).toBe(1.5);
    expect(formatDuration(18)).toBe("1 año y 6 meses");
  });

  it("parses common localized values", () => {
    expect(parseMoneyInput("$10,000.50 MXN")).toEqual({
      ok: true,
      value: 10_000.5,
      normalized: "10000.50",
    });
    expect(parseMoneyInput("10.000,50")).toEqual({
      ok: true,
      value: 10_000.5,
      normalized: "10000.50",
    });
    expect(parseRateInput("5,5%")).toEqual({
      ok: true,
      value: 5.5,
      normalized: "5.5",
    });
    expect(parseDurationInput("18,5")).toEqual({
      ok: true,
      value: 18.5,
      normalized: "18.5",
    });
  });

  it("rejects invalid, negative, and overly precise values", () => {
    expect(parseMoneyInput("")).toEqual({ ok: false, error: "required" });
    expect(parseRateInput("-2")).toEqual({ ok: false, error: "negative" });
    expect(parseDurationInput("12.345")).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
  });

  it("formats currency for es-MX", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });
});
