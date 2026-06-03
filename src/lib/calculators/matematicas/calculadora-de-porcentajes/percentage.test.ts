import { describe, expect, it } from "vitest";
import {
  calculateAddPercent,
  calculatePercentChange,
  calculatePercentageOfNumber,
  calculateSubtractPercent,
  calculateWhatPercentIs,
  formatCurrency,
  formatNumber,
  formatPercent,
  parseNumericInput,
  roundToTwo,
} from "./percentage";

describe("percentage calculator formulas", () => {
  it("calculates a percentage of a number", () => {
    expect(calculatePercentageOfNumber(20, 350)).toBe(70);
  });

  it("calculates what percentage a partial value represents", () => {
    expect(calculateWhatPercentIs(45, 200)).toBe(22.5);
  });

  it("calculates percentage increases, decreases, and no change", () => {
    expect(calculatePercentChange(80, 100)).toEqual({
      change: 25,
      direction: "increase",
    });
    expect(calculatePercentChange(100, 80)).toEqual({
      change: -20,
      direction: "decrease",
    });
    expect(calculatePercentChange(100, 100)).toEqual({
      change: 0,
      direction: "none",
    });
  });

  it("calculates totals when adding or subtracting a percentage", () => {
    expect(calculateAddPercent(500, 16)).toEqual({
      increment: 80,
      total: 580,
    });
    expect(calculateSubtractPercent(1200, 25)).toEqual({
      discount: 300,
      total: 900,
    });
  });
});

describe("numeric input parsing", () => {
  it("accepts plain numbers, currency symbols, percent symbols, and spaces", () => {
    expect(parseNumericInput("350")).toEqual({
      ok: true,
      value: 350,
      normalized: "350",
    });
    expect(parseNumericInput("$ 1,234")).toEqual({
      ok: true,
      value: 1234,
      normalized: "1234",
    });
    expect(parseNumericInput("20%")).toEqual({
      ok: true,
      value: 20,
      normalized: "20",
    });
  });

  it("accepts decimal values with comma or dot separators", () => {
    expect(parseNumericInput("1.23")).toEqual({
      ok: true,
      value: 1.23,
      normalized: "1.23",
    });
    expect(parseNumericInput("1,23")).toEqual({
      ok: true,
      value: 1.23,
      normalized: "1.23",
    });
  });

  it("rejects dot decimals with more than two decimal places instead of treating them as thousands", () => {
    expect(parseNumericInput("1.234")).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
  });

  it("rejects empty, negative, invalid, and overly precise values", () => {
    expect(parseNumericInput("")).toEqual({ ok: false, error: "required" });
    expect(parseNumericInput("-10")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseNumericInput("abc")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseNumericInput("1,2345")).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
  });
});

describe("percentage formatting helpers", () => {
  it("rounds and formats numbers, currencies, and percentages for es-MX", () => {
    expect(roundToTwo(1.005)).toBe(1.01);
    expect(formatNumber(1234.567)).toBe("1,234.57");
    expect(formatCurrency(-1234.567)).toBe("-$1,234.57");
    expect(formatPercent(12.345)).toBe("12.35%");
  });
});
