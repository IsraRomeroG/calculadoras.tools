import { describe, expect, it } from "vitest";
import {
  buildCopyText,
  buildInterpretation,
  calculateHomeAffordability,
  calculateLoanAmountFromPayment,
  calculateMonthlyPayment,
  parseLocalizedNumber,
} from "./homeAffordability";

describe("home affordability calculator", () => {
  it("calculates max home price from income, debt, cash and mortgage assumptions", () => {
    const result = calculateHomeAffordability({
      monthlyIncome: 60_000,
      monthlyDebts: 5_000,
      maxDebtToIncomePercent: 35,
      availableCash: 500_000,
      downPaymentType: "percent",
      downPaymentPercent: 20,
      maxFinancingPercent: 80,
      annualRatePercent: 10,
      years: 20,
      monthlyHousingCosts: 2_000,
      upfrontCostPercent: 6,
    });

    expect(result.mortgagePaymentAvailable).toBe(14_000);
    expect(result.loanByIncome).toBeCloseTo(1_450_744.66, 2);
    expect(result.maxHomePrice).toBeCloseTo(1_813_430.83, 2);
    expect(result.estimatedDownPayment).toBeCloseTo(362_686.17, 2);
    expect(result.initialCashRequired).toBeCloseTo(471_492.02, 2);
    expect(result.limitingFactor.id).toBe("income");
    expect(buildInterpretation(result)).toContain("precio maximo estimado");
  });

  it("returns zero capacity when current debts exceed the selected obligation limit", () => {
    const result = calculateHomeAffordability({
      monthlyIncome: 60_000,
      monthlyDebts: 30_000,
      maxDebtToIncomePercent: 35,
      availableCash: 500_000,
      annualRatePercent: 10,
    });

    expect(result.mortgagePaymentAvailable).toBe(0);
    expect(result.maxHomePrice).toBe(0);
    expect(result.limitingFactor.id).toBe("currentDebts");
    expect(result.warnings.join(" ")).toContain("deudas actuales");
  });

  it("uses the zero-rate loan formula as payment times months", () => {
    expect(calculateLoanAmountFromPayment(10_000, 0, 20)).toBe(2_400_000);
    expect(calculateMonthlyPayment(2_400_000, 0, 20)).toBe(10_000);
  });

  it("lets upfront cash become the main limit when cash is tighter than income", () => {
    const result = calculateHomeAffordability({
      monthlyIncome: 120_000,
      monthlyDebts: 0,
      maxDebtToIncomePercent: 35,
      availableCash: 260_000,
      downPaymentType: "percent",
      downPaymentPercent: 20,
      maxFinancingPercent: 80,
      annualRatePercent: 10,
      years: 20,
      upfrontCostPercent: 6,
    });

    expect(result.maxHomePrice).toBe(1_000_000);
    expect(result.initialCashRequired).toBe(260_000);
    expect(result.limitingFactor.id).toBe("initialCash");
  });

  it("adjusts percent down payment to the minimum required by max financing", () => {
    const result = calculateHomeAffordability({
      monthlyIncome: 80_000,
      monthlyDebts: 0,
      availableCash: 500_000,
      downPaymentType: "percent",
      downPaymentPercent: 5,
      maxFinancingPercent: 80,
      annualRatePercent: 10,
    });

    expect(result.effectiveDownPaymentPercent).toBe(20);
    expect(result.estimatedDownPayment).toBeCloseTo(
      result.maxHomePrice * 0.2,
      2,
    );
    expect(result.warnings.join(" ")).toContain("enganche");
  });

  it("limits a fixed down payment by LTV when the amount is too small", () => {
    const result = calculateHomeAffordability({
      monthlyIncome: 250_000,
      monthlyDebts: 0,
      availableCash: 1_000_000,
      downPaymentType: "amount",
      downPaymentAmount: 100_000,
      maxFinancingPercent: 80,
      annualRatePercent: 10,
      upfrontCostPercent: 0,
    });

    expect(result.maxHomePrice).toBe(500_000);
    expect(result.estimatedDownPayment).toBe(100_000);
    expect(result.estimatedLoanAmount).toBe(400_000);
    expect(result.limitingFactor.id).toBe("financing");
  });

  it("compares a target home against available monthly payment and cash", () => {
    const result = calculateHomeAffordability({
      monthlyIncome: 60_000,
      monthlyDebts: 5_000,
      maxDebtToIncomePercent: 35,
      availableCash: 500_000,
      downPaymentType: "percent",
      downPaymentPercent: 20,
      maxFinancingPercent: 80,
      annualRatePercent: 10,
      years: 20,
      monthlyHousingCosts: 2_000,
      upfrontCostPercent: 6,
      targetHomePrice: 2_200_000,
    });

    expect(result.target).not.toBeNull();
    expect(result.target?.status).toBe("above_range");
    expect(result.target?.priceGap).toBeGreaterThan(300_000);
    expect(result.target?.monthlyShortfall).toBeGreaterThan(0);
    expect(result.target?.cashShortfall).toBeGreaterThan(0);
    expect(result.target?.requiredMonthlyIncome).toBeGreaterThan(60_000);
  });

  it("parses localized numbers and builds copy text", () => {
    expect(parseLocalizedNumber("$2,000,000")).toBe(2_000_000);
    expect(parseLocalizedNumber("2.000.000")).toBe(2_000_000);
    expect(parseLocalizedNumber("35,5%")).toBe(35.5);
    expect(parseLocalizedNumber("abc")).toBeNull();

    const result = calculateHomeAffordability({
      monthlyIncome: 60_000,
      monthlyDebts: 5_000,
      availableCash: 500_000,
      annualRatePercent: 10,
    });

    expect(buildCopyText(result)).toContain("Precio maximo estimado");
  });

  it("validates input ranges", () => {
    expect(() =>
      calculateHomeAffordability({
        monthlyIncome: 0,
        annualRatePercent: 10,
      }),
    ).toThrow("ingreso mensual");
    expect(() =>
      calculateHomeAffordability({
        monthlyIncome: 60_000,
        maxDebtToIncomePercent: 101,
        annualRatePercent: 10,
      }),
    ).toThrow("ratio");
    expect(() =>
      calculateHomeAffordability({
        monthlyIncome: 60_000,
        annualRatePercent: 10,
        years: 41,
      }),
    ).toThrow("40");
  });
});
