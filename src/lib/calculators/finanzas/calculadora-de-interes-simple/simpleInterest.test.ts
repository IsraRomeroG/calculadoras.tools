import { describe, expect, it } from "vitest";
import {
  calculateSimpleInterest,
  convertDurationToDays,
  convertRateToAnnual,
  formatCurrency,
  formatPercent,
  parseDurationInput,
  parseMoneyInput,
  parseRateInput,
  roundCurrency,
} from "./simpleInterest";

describe("simple interest", () => {
  it("calculates the spec example", () => {
    const result = calculateSimpleInterest({
      principal: 10_000,
      rate: 12,
      ratePeriod: "years",
      duration: 18,
      durationUnit: "months",
      dayConvention: 365,
    });

    expect(result.interest).toBe(1800);
    expect(result.finalAmount).toBe(11_800);
    expect(result.totalInterestPercent).toBe(18);
    expect(result.interestPerDurationUnit).toBe(100);
    expect(result.durationInRatePeriods).toBe(1.5);
  });

  it("supports monthly and daily rates", () => {
    const monthly = calculateSimpleInterest({
      principal: 1000,
      rate: 2,
      ratePeriod: "months",
      duration: 6,
      durationUnit: "months",
      dayConvention: 365,
    });
    const daily = calculateSimpleInterest({
      principal: 1000,
      rate: 0.1,
      ratePeriod: "days",
      duration: 30,
      durationUnit: "days",
      dayConvention: 365,
    });

    expect(monthly.interest).toBe(120);
    expect(roundCurrency(daily.interest)).toBe(30);
  });

  it("uses the selected day convention", () => {
    const common = {
      principal: 10_000,
      rate: 12,
      ratePeriod: "years" as const,
      duration: 30,
      durationUnit: "days" as const,
    };

    const civil = calculateSimpleInterest({ ...common, dayConvention: 365 });
    const commercial = calculateSimpleInterest({
      ...common,
      dayConvention: 360,
    });

    expect(roundCurrency(civil.interest)).toBe(98.63);
    expect(roundCurrency(commercial.interest)).toBe(100);
  });

  it("creates contextual warnings", () => {
    const result = calculateSimpleInterest({
      principal: 1000,
      rate: 10,
      ratePeriod: "months",
      duration: 12,
      durationUnit: "months",
      dayConvention: 365,
    });

    expect(result.annualSimpleRate).toBe(120);
    expect(result.totalInterestPercent).toBe(120);
    expect(result.warnings).toHaveLength(2);
  });
});

describe("conversion, parsing, and formatting", () => {
  it("converts durations and rates using the selected convention", () => {
    expect(convertDurationToDays(1, "years", 365)).toBe(365);
    expect(convertDurationToDays(1, "years", 360)).toBe(360);
    expect(convertDurationToDays(6, "months", 360)).toBe(180);
    expect(convertRateToAnnual(2, "months", 365)).toBe(24);
    expect(convertRateToAnnual(0.1, "days", 360)).toBe(36);
  });

  it("parses common money, percentage, and duration formats", () => {
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
    expect(parseRateInput("0.1%")).toEqual({
      ok: true,
      value: 0.1,
      normalized: "0.1",
    });
    expect(parseDurationInput("18,5")).toEqual({
      ok: true,
      value: 18.5,
      normalized: "18.5",
    });
  });

  it("rejects invalid, negative, and overly precise inputs", () => {
    expect(parseMoneyInput("")).toEqual({ ok: false, error: "required" });
    expect(parseMoneyInput("-20")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseRateInput("abc")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseMoneyInput("12.3456")).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
  });

  it("formats results for es-MX", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
    expect(formatPercent(18)).toBe("18%");
  });
});
