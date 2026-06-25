import { describe, expect, it } from "vitest";
import {
  calculateMonthlyMortgagePayment,
  calculateRentVsBuy,
  formatCurrency,
  formatPercent,
  parseRentVsBuyInput,
  roundCurrency,
  type RentVsBuyInput,
} from "./rentVsBuy";

const baseInput: RentVsBuyInput = {
  monthlyRent: 18_000,
  annualRentIncreasePercent: 4,
  propertyPrice: 3_500_000,
  downPaymentPercent: 20,
  annualMortgageRatePercent: 10,
  mortgageTermYears: 20,
  comparisonYears: 10,
  purchaseCostPercent: 5,
  sellingCostPercent: 5,
  annualMaintenancePercent: 1,
  annualPropertyTaxPercent: 0.2,
  annualAppreciationPercent: 3,
  annualAlternativeReturnPercent: 5,
};

describe("rent vs buy calculation", () => {
  it("calculates the main MVP scenario with annual rows", () => {
    const result = calculateRentVsBuy(baseInput);

    expect(result.annualRows).toHaveLength(10);
    expect(roundCurrency(result.downPaymentAmount)).toBe(700_000);
    expect(roundCurrency(result.purchaseCostAmount)).toBe(175_000);
    expect(roundCurrency(result.initialCashRequired)).toBe(875_000);
    expect(roundCurrency(result.loanAmount)).toBe(2_800_000);
    expect(roundCurrency(result.monthlyMortgagePayment)).toBe(27_020.61);
    expect(roundCurrency(result.totalInterestPaid)).toBe(2_487_153.42);
    expect(roundCurrency(result.finalPropertyValue)).toBe(4_703_707.33);
    expect(roundCurrency(result.finalMortgageBalance)).toBe(2_044_680.7);
  });

  it("handles a zero mortgage rate without interest", () => {
    const payment = calculateMonthlyMortgagePayment(1_200_000, 0, 10);
    const result = calculateRentVsBuy({
      ...baseInput,
      propertyPrice: 1_500_000,
      downPaymentPercent: 20,
      annualMortgageRatePercent: 0,
      mortgageTermYears: 10,
      comparisonYears: 1,
    });

    expect(payment).toBe(10_000);
    expect(result.totalInterestPaid).toBe(0);
    expect(roundCurrency(result.annualRows[0].principalPaid)).toBe(120_000);
  });

  it("increases rent annually according to the rent growth rate", () => {
    const result = calculateRentVsBuy({
      ...baseInput,
      monthlyRent: 10_000,
      annualRentIncreasePercent: 4,
      comparisonYears: 2,
    });

    expect(roundCurrency(result.annualRows[0].annualRent)).toBe(120_000);
    expect(roundCurrency(result.annualRows[1].annualRent)).toBe(124_800);
  });

  it("allows negative appreciation and reduces the home value", () => {
    const result = calculateRentVsBuy({
      ...baseInput,
      annualAppreciationPercent: -5,
      comparisonYears: 2,
    });

    expect(roundCurrency(result.finalPropertyValue)).toBe(3_158_750);
  });

  it("handles a 100 percent down payment without a mortgage", () => {
    const result = calculateRentVsBuy({
      ...baseInput,
      downPaymentPercent: 100,
      comparisonYears: 1,
    });

    expect(result.loanAmount).toBe(0);
    expect(result.monthlyMortgagePayment).toBe(0);
    expect(result.finalMortgageBalance).toBe(0);
    expect(result.totalInterestPaid).toBe(0);
  });

  it("includes purchase costs in the alternative initial capital", () => {
    const result = calculateRentVsBuy({
      ...baseInput,
      annualAlternativeReturnPercent: 0,
      comparisonYears: 1,
    });

    expect(roundCurrency(result.initialCashRequired)).toBe(875_000);
    expect(roundCurrency(result.annualRows[0].alternativeCapital)).toBe(
      roundCurrency(875_000 + result.annualRows[0].flowDifference),
    );
  });

  it("adds positive flow difference to the renter investment scenario", () => {
    const result = calculateRentVsBuy({
      ...baseInput,
      monthlyRent: 5_000,
      annualAlternativeReturnPercent: 0,
      comparisonYears: 1,
    });

    expect(result.annualRows[0].flowDifference).toBeGreaterThan(0);
    expect(result.annualRows[0].alternativeCapital).toBeGreaterThan(
      result.initialCashRequired,
    );
  });

  it("subtracts selling costs from the buyer net worth", () => {
    const result = calculateRentVsBuy({
      ...baseInput,
      comparisonYears: 1,
      sellingCostPercent: 5,
    });
    const firstRow = result.annualRows[0];

    expect(roundCurrency(firstRow.sellingCosts)).toBe(
      roundCurrency(firstRow.propertyValue * 0.05),
    );
    expect(roundCurrency(firstRow.buyNetWorth)).toBe(
      roundCurrency(
        firstRow.propertyValue -
          firstRow.remainingMortgageBalance -
          firstRow.sellingCosts,
      ),
    );
  });

  it("detects the patrimonial break-even year", () => {
    const result = calculateRentVsBuy({
      monthlyRent: 1_000,
      annualRentIncreasePercent: 0,
      propertyPrice: 100_000,
      downPaymentPercent: 100,
      annualMortgageRatePercent: 0,
      mortgageTermYears: 1,
      comparisonYears: 1,
      purchaseCostPercent: 0,
      sellingCostPercent: 0,
      annualMaintenancePercent: 0,
      annualPropertyTaxPercent: 0,
      annualAppreciationPercent: 0,
      annualAlternativeReturnPercent: 0,
    });

    expect(result.breakEvenYear).toBe(1);
    expect(result.winner).toBe("buy");
  });
});

describe("rent vs buy parsing and formatting", () => {
  it("accepts common money and percentage formats", () => {
    expect(parseRentVsBuyInput("$1,000.50 MXN")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.50",
    });
    expect(parseRentVsBuyInput("1.000,50")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.50",
    });
    expect(
      parseRentVsBuyInput("-5%", {
        allowNegative: true,
        maxDecimals: 4,
        preferDecimal: true,
      }),
    ).toEqual({
      ok: true,
      value: -5,
      normalized: "-5",
    });
  });

  it("rejects empty, negative, invalid, and overly precise values", () => {
    expect(parseRentVsBuyInput("")).toEqual({
      ok: false,
      error: "required",
    });
    expect(parseRentVsBuyInput("-100")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseRentVsBuyInput("abc")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseRentVsBuyInput("100.123")).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
  });

  it("formats values for es-MX", () => {
    expect(formatCurrency(27_021.509)).toBe("$27,021.51");
    expect(formatPercent(5.126)).toBe("5.13%");
  });
});
