import { describe, expect, it } from "vitest";
import {
  calculateMexicoTax,
  calculateNetSalary,
  calculateProgressiveTax,
  formatMoney,
  MEXICO_SALARY_PRESET,
  parseMoneyInput,
} from "./netSalary";

describe("Mexico progressive ISR", () => {
  it("uses the fixed fee plus the marginal rate over the lower limit", () => {
    const result = calculateMexicoTax(20000, "monthly");

    expect(result.bracket?.lowerBound).toBe(17533.65);
    expect(result.marginalRate).toBe(21.36);
    expect(result.taxBeforeCredits).toBeCloseTo(2383.65, 2);
  });

  it("selects the official seven-day table for weekly pay", () => {
    const result = calculateMexicoTax(5000, "weekly");

    expect(result.bracket?.lowerBound).toBe(4037.33);
    expect(result.taxBeforeCredits).toBeCloseTo(633.19, 2);
  });

  it("selects the annual table for an annual calculation", () => {
    const result = calculateMexicoTax(240000, "annual");

    expect(result.bracket?.lowerBound).toBe(210403.7);
    expect(result.taxBeforeCredits).toBeCloseTo(28603.91, 2);
  });

  it("returns zero for a zero taxable base", () => {
    expect(calculateProgressiveTax(0, MEXICO_SALARY_PRESET.taxTables.monthly)).toEqual({
      taxableBase: 0,
      taxBeforeCredits: 0,
      marginalRate: 0,
      bracket: null,
    });
  });
});

describe("net salary calculation", () => {
  it("calculates monthly net salary and separates deductions", () => {
    const result = calculateNetSalary({
      gross: 20000,
      salaryBasis: "monthly",
      frequency: "monthly",
      employeeContributions: 800,
      postTaxDeductions: 200,
    });

    expect(result.grossCashPeriod).toBe(20000);
    expect(result.tax).toBeCloseTo(2383.65, 2);
    expect(result.employeeContributions).toBe(800);
    expect(result.netPeriod).toBeCloseTo(16616.35, 2);
    expect(result.annualNetProjection).toBeCloseTo(result.netPeriod * 12, 2);
    expect(result.status).toBe("manual");
  });

  it("applies the employment subsidy only against ISR", () => {
    const result = calculateNetSalary({
      gross: 10000,
      salaryBasis: "monthly",
      frequency: "monthly",
    });

    expect(result.taxBeforeCredits).toBeCloseTo(729.02, 2);
    expect(result.taxCredit).toBeCloseTo(535.65, 2);
    expect(result.tax).toBeCloseTo(193.37, 2);
    expect(result.netPeriod).toBeCloseTo(9806.63, 2);
  });

  it("does not repeat a one-time bonus in every annual period", () => {
    const result = calculateNetSalary({
      gross: 20000,
      salaryBasis: "monthly",
      frequency: "monthly",
      uniqueBonus: 10000,
    });

    expect(result.annualGrossProjection).toBe(250000);
    expect(result.annualGrossProjection).not.toBe(360000);
  });

  it("normalizes monthly salary to a selected payment frequency", () => {
    const result = calculateNetSalary({
      gross: 24000,
      salaryBasis: "monthly",
      frequency: "biweekly",
    });

    expect(result.grossCashPeriod).toBe(12000);
    expect(result.annualGrossProjection).toBe(288000);
  });

  it("rejects invalid salary amounts", () => {
    expect(() =>
      calculateNetSalary({
        gross: 0,
        salaryBasis: "monthly",
        frequency: "monthly",
      }),
    ).toThrow("mayor que cero");

    expect(() =>
      calculateNetSalary({
        gross: 10000,
        salaryBasis: "monthly",
        frequency: "monthly",
        postTaxDeductions: -1,
      }),
    ).toThrow("no pueden ser negativos");
  });
});

describe("salary input helpers", () => {
  it("accepts Mexican and international currency separators", () => {
    expect(parseMoneyInput("$20,000.50 MXN")).toEqual({
      ok: true,
      value: 20000.5,
      normalized: "20000.50",
    });
    expect(parseMoneyInput("20.000,50")).toEqual({
      ok: true,
      value: 20000.5,
      normalized: "20000.50",
    });
  });

  it("rejects negative and invalid values", () => {
    expect(parseMoneyInput("-100")).toEqual({ ok: false, error: "negative" });
    expect(parseMoneyInput("texto")).toEqual({ ok: false, error: "invalid" });
    expect(parseMoneyInput("")).toEqual({ ok: false, error: "required" });
  });

  it("formats pesos consistently", () => {
    expect(formatMoney(1234.5)).toContain("1,234.50");
  });
});
