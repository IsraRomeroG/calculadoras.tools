import { describe, expect, it } from "vitest";
import {
  buildAmortizationSchedule,
  calculateExtraPaymentSavings,
  calculateLoanAmountFromPayment,
  calculateMonthlyPayment,
  calculateMortgageSummary,
  compareMortgageScenarios,
  formatCurrency,
  formatDuration,
  formatPercent,
  parseMortgageInput,
  roundCurrency,
} from "./mortgage";

describe("mortgage monthly payment and amortization", () => {
  it("calculates the baseline mortgage from the spec", () => {
    const monthlyPayment = calculateMonthlyPayment(2_000_000, 9, 20);
    const schedule = buildAmortizationSchedule({
      principal: 2_000_000,
      annualRate: 9,
      years: 20,
    });
    const summary = calculateMortgageSummary(schedule, 2_000_000);

    expect(roundCurrency(monthlyPayment)).toBe(17_994.52);
    expect(schedule).toHaveLength(240);
    expect(roundCurrency(summary.totalPaid)).toBe(4_318_684.59);
    expect(roundCurrency(summary.totalInterest)).toBe(2_318_684.59);
    expect(roundCurrency(summary.interestShare)).toBe(53.69);
    expect(roundCurrency(summary.principalShare)).toBe(46.31);
    expect(roundCurrency(schedule.at(-1)?.remainingBalance ?? 1)).toBe(0);
  });

  it("handles zero interest without finance cost", () => {
    const monthlyPayment = calculateMonthlyPayment(120_000, 0, 1);
    const schedule = buildAmortizationSchedule({
      principal: 120_000,
      annualRate: 0,
      years: 1,
    });
    const summary = calculateMortgageSummary(schedule, 120_000);

    expect(monthlyPayment).toBe(10_000);
    expect(schedule).toHaveLength(12);
    expect(summary.totalInterest).toBe(0);
    expect(roundCurrency(summary.totalPaid)).toBe(120_000);
  });

  it("shortens the mortgage with monthly extra payments", () => {
    const baseSchedule = buildAmortizationSchedule({
      principal: 2_000_000,
      annualRate: 9,
      years: 20,
    });
    const extraSchedule = buildAmortizationSchedule({
      principal: 2_000_000,
      annualRate: 9,
      years: 20,
      extraPayment: 2_000,
    });
    const savings = calculateExtraPaymentSavings(baseSchedule, extraSchedule);

    expect(extraSchedule).toHaveLength(186);
    expect(roundCurrency(savings.interestWithExtra)).toBe(1_711_832.41);
    expect(savings.monthsSaved).toBe(54);
    expect(roundCurrency(savings.interestSaved)).toBe(606_852.18);
    expect(roundCurrency(extraSchedule.at(-1)?.remainingBalance ?? 1)).toBe(0);
  });
});

describe("mortgage inverse helpers and comparison", () => {
  it("calculates the maximum loan from a target payment", () => {
    const amount = calculateLoanAmountFromPayment(15_000, 9, 20);

    expect(roundCurrency(amount)).toBe(1_667_174.31);
  });

  it("compares scenarios by total paid", () => {
    const rows = compareMortgageScenarios([
      {
        label: "Escenario A",
        principal: 2_000_000,
        annualRate: 8.5,
        years: 15,
      },
      {
        label: "Escenario B",
        principal: 2_000_000,
        annualRate: 9,
        years: 20,
      },
      {
        label: "Escenario C",
        principal: 2_000_000,
        annualRate: 9.5,
        years: 25,
      },
    ]);

    expect(rows[0].isBest).toBe(true);
    expect(roundCurrency(rows[0].monthlyPayment)).toBe(19_694.79);
    expect(roundCurrency(rows[2].totalPaid)).toBe(5_242_179.97);
    expect(roundCurrency(rows[0].savingsVsWorst)).toBe(1_697_117.56);
  });
});

describe("mortgage parsing and formatting", () => {
  it("accepts common money and percentage formats", () => {
    expect(parseMortgageInput("$1,000.50 MXN")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.50",
    });
    expect(parseMortgageInput("1.000,50")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.50",
    });
    expect(
      parseMortgageInput("20%", { maxDecimals: 4, preferDecimal: true }),
    ).toEqual({
      ok: true,
      value: 20,
      normalized: "20",
    });
  });

  it("rejects empty, negative, invalid, and overly precise values", () => {
    expect(parseMortgageInput("")).toEqual({ ok: false, error: "required" });
    expect(parseMortgageInput("-100")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseMortgageInput("abc")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseMortgageInput("100.123")).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
  });

  it("formats mortgage outputs for es-MX", () => {
    expect(formatCurrency(17_994.519)).toBe("$17,994.52");
    expect(formatPercent(53.686)).toBe("53.69%");
    expect(formatDuration(186)).toBe("15 años 6 meses");
  });
});
