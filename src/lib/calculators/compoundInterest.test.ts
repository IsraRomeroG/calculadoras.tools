import { describe, expect, it } from "vitest";
import {
  buildAnnualGrowthRows,
  calculateCompoundInterest,
  calculateGrowthFactor,
  calculatePresentValue,
  calculateRequiredRate,
  calculateRuleOf72,
  calculateTimeToTarget,
  compareCompoundingFrequencies,
  formatCurrency,
  formatDuration,
  formatMultiplier,
  formatPercent,
  parseDurationInput,
  parseMoneyInput,
  parseRateInput,
  roundCurrency,
} from "./compoundInterest";

const baseInput = {
  principal: 10_000,
  annualRate: 8,
  durationMonths: 240,
  compoundingFrequency: "monthly" as const,
  contributionAmount: 0,
  contributionFrequency: "monthly" as const,
  contributionTiming: "end" as const,
};

describe("compound interest growth", () => {
  it("calculates growth factors for annual, monthly, and continuous compounding", () => {
    expect(calculateGrowthFactor(8, "annual", 10)).toBeCloseTo(2.158925);
    expect(calculateGrowthFactor(8, "monthly", 10)).toBeCloseTo(2.21964);
    expect(calculateGrowthFactor(8, "continuous", 10)).toBeCloseTo(2.225541);
    expect(calculateGrowthFactor(0, "monthly", 10)).toBe(1);
  });

  it("calculates compound interest without periodic contributions", () => {
    const result = calculateCompoundInterest(baseInput);

    expect(roundCurrency(result.futureValue)).toBe(49_268.03);
    expect(roundCurrency(result.interestEarned)).toBe(39_268.03);
    expect(result.totalContributions).toBe(0);
    expect(result.totalInvested).toBe(10_000);
  });

  it("calculates monthly end-of-period contributions", () => {
    const result = calculateCompoundInterest({
      ...baseInput,
      contributionAmount: 500,
    });

    expect(roundCurrency(result.futureValue)).toBe(343_778.24);
    expect(result.totalContributions).toBe(120_000);
    expect(result.totalInvested).toBe(130_000);
    expect(roundCurrency(result.interestEarned)).toBe(213_778.24);
    expect(roundCurrency(result.returnOnInvested)).toBe(164.44);
  });

  it("calculates monthly beginning-of-period contributions", () => {
    const result = calculateCompoundInterest({
      ...baseInput,
      contributionAmount: 500,
      contributionTiming: "beginning",
    });

    expect(roundCurrency(result.futureValue)).toBe(345_741.64);
    expect(roundCurrency(result.interestEarned)).toBe(215_741.64);
  });

  it("allows zero principal when contributions are present", () => {
    const result = calculateCompoundInterest({
      ...baseInput,
      principal: 0,
      contributionAmount: 500,
    });

    expect(roundCurrency(result.futureValue)).toBe(294_510.21);
    expect(result.totalContributions).toBe(120_000);
    expect(roundCurrency(result.interestEarned)).toBe(174_510.21);
  });

  it("handles a zero rate without adding interest", () => {
    const result = calculateCompoundInterest({
      ...baseInput,
      annualRate: 0,
      contributionAmount: 500,
    });

    expect(result.futureValue).toBe(130_000);
    expect(result.interestEarned).toBe(0);
  });

  it("calculates inflation adjustment", () => {
    const result = calculateCompoundInterest({
      ...baseInput,
      contributionAmount: 500,
      inflationRate: 4,
    });

    expect(roundCurrency(result.inflation?.realValue ?? 0)).toBe(156_895.9);
    expect(roundCurrency(result.inflation?.purchasingPowerLoss ?? 0)).toBe(
      186_882.34,
    );
    expect(roundCurrency(result.inflation?.realRate ?? 0)).toBe(3.85);
  });
});

describe("annual rows and compounding comparison", () => {
  it("builds annual growth rows with expected accumulated values", () => {
    const rows = buildAnnualGrowthRows({
      ...baseInput,
      contributionAmount: 500,
    });

    expect(rows).toHaveLength(20);
    expect(roundCurrency(rows[0].totalValue)).toBe(17_054.96);
    expect(roundCurrency(rows[1].interestEarned)).toBe(2_695.47);
    expect(roundCurrency(rows[4].totalValue)).toBe(51_636.89);
    expect(roundCurrency(rows[9].interestEarned)).toBe(43_669.42);
    expect(roundCurrency(rows[19].totalValue)).toBe(343_778.24);
  });

  it("compares compounding frequencies without contributions", () => {
    const rows = compareCompoundingFrequencies({
      principal: 10_000,
      annualRate: 8,
      durationMonths: 120,
    });
    const semiannual = rows.find((row) => row.frequency === "semiannual");
    const quarterly = rows.find((row) => row.frequency === "quarterly");
    const monthly = rows.find((row) => row.frequency === "monthly");
    const continuous = rows.find((row) => row.frequency === "continuous");

    expect(roundCurrency(semiannual?.futureValue ?? 0)).toBe(21_911.23);
    expect(roundCurrency(quarterly?.futureValue ?? 0)).toBe(22_080.4);
    expect(roundCurrency(monthly?.futureValue ?? 0)).toBe(22_196.4);
    expect(roundCurrency(continuous?.futureValue ?? 0)).toBe(22_255.41);
    expect(continuous?.isBest).toBe(true);
  });
});

describe("inverse helper formulas", () => {
  it("calculates present value", () => {
    expect(
      roundCurrency(calculatePresentValue(1_000_000, 10, 180, "annual")),
    ).toBe(239_392.05);
  });

  it("calculates time to target without contributions", () => {
    const months = calculateTimeToTarget({
      presentValue: 20_000,
      targetAmount: 100_000,
      annualRate: 7,
      compoundingFrequency: "annual",
    });

    expect(months).toBe(285);
    expect(formatDuration(months)).toBe("23 años y 9 meses");
  });

  it("calculates required annual rate", () => {
    const rate = calculateRequiredRate({
      presentValue: 50_000,
      targetAmount: 200_000,
      durationMonths: 120,
      compoundingFrequency: "annual",
    });

    expect(roundCurrency(rate)).toBe(14.87);
  });

  it("calculates the rule of 72", () => {
    expect(calculateRuleOf72(8)).toBe(9);
    expect(calculateRuleOf72(0)).toBeNull();
  });
});

describe("compound input parsing and formatting", () => {
  it("accepts money, rate, and duration values with common symbols", () => {
    expect(parseMoneyInput("$1,000.50 MXN")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.50",
    });
    expect(parseMoneyInput("1.000,50")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.50",
    });
    expect(parseRateInput("8%")).toEqual({
      ok: true,
      value: 8,
      normalized: "8",
    });
    expect(parseDurationInput("20,5")).toEqual({
      ok: true,
      value: 20.5,
      normalized: "20.5",
    });
  });

  it("rejects empty, negative, invalid, and overly precise values", () => {
    expect(parseMoneyInput("")).toEqual({ ok: false, error: "required" });
    expect(parseMoneyInput("-100")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseRateInput("ocho")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseMoneyInput("123.456")).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
  });

  it("formats financial outputs for es-MX", () => {
    expect(formatCurrency(343_778.236)).toBe("$343,778.24");
    expect(formatPercent(164.4449)).toBe("164.44%");
    expect(formatMultiplier(2.6444)).toBe("2.6×");
  });
});
