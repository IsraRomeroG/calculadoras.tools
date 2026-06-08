import { describe, expect, it } from "vitest";
import {
  calculateBusinessRoi,
  calculateSimpleRoi,
  convertDurationToYears,
  formatCurrency,
  formatMultiplier,
  formatPercent,
  parseMoneyInput,
  parseTargetRoiInput,
  roundCurrency,
} from "./roi";

describe("simple ROI", () => {
  it("calculates gain, ROI, multiplier, and distance to break even", () => {
    const result = calculateSimpleRoi({
      initialInvestment: 1000,
      recoveredValue: 1500,
    });

    expect(result.profit).toBe(500);
    expect(result.roi).toBe(50);
    expect(result.multiplier).toBe(1.5);
    expect(result.breakEvenDifference).toBe(500);
    expect(result.status).toBe("gain");
  });

  it("detects break even and total loss", () => {
    const breakEven = calculateSimpleRoi({
      initialInvestment: 1000,
      recoveredValue: 1000,
    });
    const totalLoss = calculateSimpleRoi({
      initialInvestment: 1000,
      recoveredValue: 0,
    });

    expect(breakEven.status).toBe("break_even");
    expect(breakEven.roi).toBe(0);
    expect(totalLoss.status).toBe("loss");
    expect(totalLoss.roi).toBe(-100);
    expect(totalLoss.multiplier).toBe(0);
    expect(totalLoss.annualizedReturn).toBeUndefined();
  });

  it("calculates target ROI difference", () => {
    const result = calculateSimpleRoi({
      initialInvestment: 1000,
      recoveredValue: 1180,
      targetRoi: 25,
    });

    expect(result.target?.targetValue).toBe(1250);
    expect(result.target?.difference).toBe(-70);
  });

  it("calculates positive and negative annualized equivalent returns", () => {
    const positive = calculateSimpleRoi({
      initialInvestment: 1000,
      recoveredValue: 1210,
      duration: 2,
      durationUnit: "years",
    });
    const negative = calculateSimpleRoi({
      initialInvestment: 1000,
      recoveredValue: 810,
      duration: 2,
      durationUnit: "years",
    });

    expect(roundCurrency(positive.annualizedReturn ?? 0)).toBe(10);
    expect(roundCurrency(negative.annualizedReturn ?? 0)).toBe(-10);
  });
});

describe("business ROI", () => {
  it("sums costs and calculates ROI, margin, and multiplier", () => {
    const result = calculateBusinessRoi({
      revenue: 120_000,
      initialCosts: 20_000,
      fixedCosts: 30_000,
      variableCosts: 25_000,
      otherCosts: 5_000,
    });

    expect(result.totalCost).toBe(80_000);
    expect(result.profit).toBe(40_000);
    expect(result.roi).toBe(50);
    expect(roundCurrency(result.marginOnRevenue ?? 0)).toBe(33.33);
    expect(result.multiplier).toBe(1.5);
  });

  it("allows zero initial costs and avoids dividing margin by zero", () => {
    const result = calculateBusinessRoi({
      revenue: 0,
      initialCosts: 0,
      fixedCosts: 500,
      variableCosts: 500,
      otherCosts: 0,
    });

    expect(result.totalCost).toBe(1000);
    expect(result.roi).toBe(-100);
    expect(result.marginOnRevenue).toBeNull();
  });
});

describe("duration, parsing, and formatting", () => {
  it("converts duration units to years", () => {
    expect(convertDurationToYears(365, "days")).toBe(1);
    expect(convertDurationToYears(18, "months")).toBe(1.5);
    expect(convertDurationToYears(2, "years")).toBe(2);
  });

  it("parses common money formats and signed target ROI", () => {
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
    expect(parseTargetRoiInput("-25%")).toEqual({
      ok: true,
      value: -25,
      normalized: "-25",
    });
  });

  it("rejects invalid and negative money inputs", () => {
    expect(parseMoneyInput("")).toEqual({ ok: false, error: "required" });
    expect(parseMoneyInput("-20")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseMoneyInput("abc")).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("formats outputs for es-MX", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
    expect(formatPercent(33.333)).toBe("33.33%");
    expect(formatMultiplier(1.525)).toBe("1.53x");
  });
});
