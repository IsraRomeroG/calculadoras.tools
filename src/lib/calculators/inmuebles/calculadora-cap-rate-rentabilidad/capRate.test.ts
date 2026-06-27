import { describe, expect, it } from "vitest";
import {
  buildCopyText,
  calculateCapRate,
  formatCurrency,
  formatPercent,
  parseLocalizedNumber,
} from "./capRate";

describe("cap rate calculator", () => {
  it("calculates a typical rental property scenario", () => {
    const result = calculateCapRate({
      propertyValue: 2_500_000,
      monthlyRent: 18_000,
      vacancyPercent: 5,
      otherAnnualOperatingExpenses: 35_000,
      initialImprovements: 120_000,
      debtPayment: 120_000,
      debtPaymentPeriod: "annual",
    });

    expect(result.grossAnnualIncome).toBe(216_000);
    expect(result.vacancyLoss).toBe(10_800);
    expect(result.effectiveIncome).toBe(205_200);
    expect(result.operatingExpensesAnnual).toBe(35_000);
    expect(result.noi).toBe(170_200);
    expect(result.capRatePercent).toBeCloseTo(6.808, 3);
    expect(result.grossYieldPercent).toBeCloseTo(8.64, 2);
    expect(result.annualDebtPayment).toBe(120_000);
    expect(result.cashFlowAnnual).toBe(50_200);
    expect(result.cashFlowMonthly).toBeCloseTo(4_183.3333, 4);
    expect(result.initialCapital).toBe(2_620_000);
    expect(result.cashOnCashReturnPercent).toBeCloseTo(1.916, 3);
  });

  it("keeps debt out of cap rate and applies it only to cash flow", () => {
    const withoutDebt = calculateCapRate({
      propertyValue: 1_000_000,
      monthlyRent: 10_000,
      vacancyPercent: 0,
      otherAnnualOperatingExpenses: 20_000,
    });
    const withDebt = calculateCapRate({
      propertyValue: 1_000_000,
      monthlyRent: 10_000,
      vacancyPercent: 0,
      otherAnnualOperatingExpenses: 20_000,
      debtPayment: 5_000,
      debtPaymentPeriod: "monthly",
    });

    expect(withDebt.capRatePercent).toBe(withoutDebt.capRatePercent);
    expect(withDebt.noi).toBe(withoutDebt.noi);
    expect(withDebt.cashFlowAnnual).toBe(withoutDebt.cashFlowAnnual - 60_000);
  });

  it("allows negative NOI and negative cash-on-cash", () => {
    const result = calculateCapRate({
      propertyValue: 1_500_000,
      monthlyRent: 5_000,
      vacancyPercent: 10,
      otherAnnualOperatingExpenses: 70_000,
      downPayment: 300_000,
      debtPayment: 4_000,
      debtPaymentPeriod: "monthly",
    });

    expect(result.noi).toBe(-16_000);
    expect(result.cashFlowAnnual).toBe(-64_000);
    expect(result.capRatePercent).toBeCloseTo(-1.0667, 4);
    expect(result.cashOnCashReturnPercent).toBeCloseTo(-21.3333, 4);
  });

  it("turns 100% vacancy into zero effective income", () => {
    const result = calculateCapRate({
      propertyValue: 1_000_000,
      monthlyRent: 12_000,
      vacancyPercent: 100,
      annualPropertyTax: 3_000,
    });

    expect(result.effectiveIncome).toBe(0);
    expect(result.noi).toBe(-3_000);
    expect(result.maxVacancyBeforeNoiZeroPercent).toBeCloseTo(97.9167, 4);
  });

  it("calculates variable expenses, break-even rent, and target price", () => {
    const result = calculateCapRate({
      propertyValue: 2_000_000,
      monthlyRent: 20_000,
      otherMonthlyIncome: 1_000,
      vacancyPercent: 5,
      annualPropertyTax: 6_000,
      annualInsurance: 4_000,
      monthlyHoa: 1_500,
      managementFee: 8,
      managementFeeMode: "rent-percent",
      maintenanceReserve: 1_000,
      maintenanceReserveMode: "monthly",
      debtPayment: 8_000,
      debtPaymentPeriod: "monthly",
      targetCapRatePercent: 7,
    });

    expect(result.grossAnnualIncome).toBe(252_000);
    expect(result.variableAnnualExpenses).toBe(20_160);
    expect(result.fixedAnnualOperatingExpenses).toBe(40_000);
    expect(result.operatingExpensesAnnual).toBe(60_160);
    expect(result.noi).toBe(179_240);
    expect(result.breakEvenMonthlyRent).toBeCloseTo(12_026.8199, 4);
    expect(result.maxPriceForTargetCapRate).toBeCloseTo(2_560_571.4286, 4);
  });

  it("returns neutral values when decision outputs cannot be interpreted", () => {
    const result = calculateCapRate({
      propertyValue: 1_000_000,
      monthlyRent: 0,
      vacancyPercent: 5,
      managementFee: 96,
      managementFeeMode: "rent-percent",
      targetCapRatePercent: 8,
    });

    expect(result.grossAnnualIncome).toBe(0);
    expect(result.breakEvenMonthlyRent).toBeNull();
    expect(result.maxPriceForTargetCapRate).toBeNull();
    expect(result.maxVacancyBeforeNoiZeroPercent).toBeNull();
  });

  it("validates invalid inputs", () => {
    expect(() =>
      calculateCapRate({
        propertyValue: 0,
        monthlyRent: 10_000,
      }),
    ).toThrow("mayor que cero");

    expect(() =>
      calculateCapRate({
        propertyValue: 1_000_000,
        monthlyRent: 10_000,
        vacancyPercent: 101,
      }),
    ).toThrow("vacancia");

    expect(() =>
      calculateCapRate({
        propertyValue: 1_000_000,
        monthlyRent: 10_000,
        annualInsurance: -1,
      }),
    ).toThrow("negativo");
  });

  it("warns about zero expenses, zero vacancy, and missing down payment with debt", () => {
    const result = calculateCapRate({
      propertyValue: 1_000_000,
      monthlyRent: 10_000,
      vacancyPercent: 0,
      debtPayment: 5_000,
    });

    expect(result.warnings).toHaveLength(3);
    expect(result.warnings.join(" ")).toContain("gastos operativos");
    expect(result.warnings.join(" ")).toContain("vacancia");
    expect(result.warnings.join(" ")).toContain("enganche");
  });

  it("formats and parses values for the UI", () => {
    expect(parseLocalizedNumber("$2,500,000")).toBe(2_500_000);
    expect(parseLocalizedNumber("1.234,56")).toBe(1_234.56);
    expect(parseLocalizedNumber("abc")).toBeNull();
    expect(formatCurrency(12_345.5)).toBe("$12,345.50");
    expect(formatPercent(6.808)).toBe("6.81%");
  });

  it("builds copy-ready summaries", () => {
    const result = calculateCapRate({
      propertyValue: 2_500_000,
      monthlyRent: 18_000,
      vacancyPercent: 5,
      otherAnnualOperatingExpenses: 35_000,
    });

    expect(buildCopyText(result)).toContain("Cap rate");
    expect(buildCopyText(result)).toContain("NOI anual");
  });
});
