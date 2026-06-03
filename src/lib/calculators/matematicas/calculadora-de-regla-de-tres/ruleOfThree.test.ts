import { describe, expect, it } from "vitest";
import {
  calculateDirectRuleOfThree,
  calculateInverseRuleOfThree,
  calculateRuleOfThree,
  formatRuleNumber,
  formatRuleResult,
  parseRuleOfThreeInput,
  simplifyFraction,
} from "./ruleOfThree";

describe("rule of three formulas", () => {
  it("calculates a direct rule of three", () => {
    expect(calculateDirectRuleOfThree(3, 150, 7)).toBe(350);
  });

  it("calculates an inverse rule of three", () => {
    expect(calculateInverseRuleOfThree(4, 12, 6)).toBe(8);
  });

  it("handles decimal values", () => {
    expect(calculateDirectRuleOfThree(1.5, 3, 2)).toBe(4);
  });

  it("allows zero as a valid direct result", () => {
    const result = calculateRuleOfThree({
      type: "direct",
      a: 3,
      b: 150,
      c: 0,
    });

    expect(result.x).toBe(0);
  });
});

describe("rule of three validation", () => {
  it("rejects A = 0", () => {
    expect(() =>
      calculateRuleOfThree({ type: "direct", a: 0, b: 150, c: 7 }),
    ).toThrow("El valor A no puede ser cero.");
  });

  it("rejects C = 0 for inverse proportions", () => {
    expect(() =>
      calculateRuleOfThree({ type: "inverse", a: 4, b: 12, c: 0 }),
    ).toThrow("El valor C no puede ser cero en una proporción inversa.");
  });
});

describe("rule of three parsing", () => {
  it("accepts common plain, currency, percent, and negative values", () => {
    expect(parseRuleOfThreeInput("350")).toEqual({
      ok: true,
      value: 350,
      normalized: "350",
    });
    expect(parseRuleOfThreeInput("$1,000.50")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.50",
    });
    expect(parseRuleOfThreeInput("20%")).toEqual({
      ok: true,
      value: 20,
      normalized: "20",
    });
    expect(parseRuleOfThreeInput("-10")).toEqual({
      ok: true,
      value: -10,
      normalized: "-10",
    });
  });

  it("normalizes comma decimals and European separators", () => {
    expect(parseRuleOfThreeInput("3,5")).toEqual({
      ok: true,
      value: 3.5,
      normalized: "3.5",
    });
    expect(parseRuleOfThreeInput("1.000,50")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.50",
    });
  });

  it("rejects empty and invalid values", () => {
    expect(parseRuleOfThreeInput("")).toEqual({
      ok: false,
      error: "required",
    });
    expect(parseRuleOfThreeInput("1,2,3")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseRuleOfThreeInput("abc")).toEqual({
      ok: false,
      error: "invalid",
    });
  });
});

describe("rule of three fractions and verification", () => {
  it("simplifies exact fractions", () => {
    expect(simplifyFraction(22, 6)).toBe("11/3");
    expect(simplifyFraction(350, 1)).toBeNull();
  });

  it("returns an exact fraction when useful", () => {
    const result = calculateRuleOfThree({
      type: "direct",
      a: 3,
      b: 11,
      c: 1,
      decimals: 4,
    });

    expect(result.x).toBeCloseTo(11 / 3);
    expect(result.fraction).toBe("11/3");
    expect(result.verification).toContain("3 × 3.6667 = 1 × 11.");
  });

  it("builds inverse verification steps", () => {
    const result = calculateRuleOfThree({
      type: "inverse",
      a: 4,
      b: 12,
      c: 6,
    });

    expect(result.verification).toContain("4 × 12 = 6 × 8.");
    expect(result.verification).toContain("48 = 48.");
  });
});

describe("rule of three formatting", () => {
  it("formats numbers and units for es-MX", () => {
    expect(formatRuleNumber(1234.567, 2)).toBe("1,234.57");
    expect(formatRuleResult(350, { decimals: 2, unit: "$" })).toBe("$350.00");
    expect(formatRuleResult(-15, { decimals: 2, unit: "$" })).toBe("-$15.00");
    expect(formatRuleResult(8, { decimals: 0, unit: "días" })).toBe("8 días");
  });
});
