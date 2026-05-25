import { describe, expect, it } from "vitest";
import {
  buildAmortizationSchedule,
  calculateExtraPaymentSavings,
  calculateLoanAmountFromPayment,
  calculateLoanSummary,
  calculateMonthlyPayment,
  calculatePayoffMonths,
  compareLoanScenarios,
  formatCurrency,
  formatDuration,
  formatPercent,
  parseLoanInput,
  roundCurrency,
} from "./loan";

describe("loan monthly payment and amortization", () => {
  it("calculates a fixed monthly payment with positive interest", () => {
    const payment = calculateMonthlyPayment(50_000, 24, 24);

    expect(roundCurrency(payment)).toBe(2_643.55);
  });

  it("builds the amortization schedule for the spec baseline", () => {
    const monthlyPayment = calculateMonthlyPayment(50_000, 24, 24);
    const schedule = buildAmortizationSchedule({
      principal: 50_000,
      annualRate: 24,
      months: 24,
    });
    const summary = calculateLoanSummary({
      schedule,
      principal: 50_000,
      monthlyPayment,
      openingFee: 1_000,
    });

    expect(schedule).toHaveLength(24);
    expect(roundCurrency(summary.totalPaid)).toBe(63_445.32);
    expect(roundCurrency(summary.totalInterest)).toBe(13_445.32);
    expect(roundCurrency(summary.openingFee)).toBe(1_000);
    expect(roundCurrency(summary.totalCost)).toBe(64_445.32);
    expect(roundCurrency(summary.approximateCat ?? 0)).toBe(29.52);
    expect(roundCurrency(schedule.at(-1)?.remainingBalance ?? 1)).toBe(0);
  });

  it("handles zero interest without adding finance cost", () => {
    const monthlyPayment = calculateMonthlyPayment(12_000, 0, 12);
    const schedule = buildAmortizationSchedule({
      principal: 12_000,
      annualRate: 0,
      months: 12,
    });
    const summary = calculateLoanSummary({
      schedule,
      principal: 12_000,
      monthlyPayment,
    });

    expect(monthlyPayment).toBe(1_000);
    expect(schedule).toHaveLength(12);
    expect(summary.totalInterest).toBe(0);
    expect(roundCurrency(summary.totalPaid)).toBe(12_000);
  });

  it("shortens the loan with monthly extra payments and adjusts the last row", () => {
    const baseSchedule = buildAmortizationSchedule({
      principal: 50_000,
      annualRate: 24,
      months: 24,
    });
    const extraSchedule = buildAmortizationSchedule({
      principal: 50_000,
      annualRate: 24,
      months: 24,
      extraPayment: 500,
    });
    const savings = calculateExtraPaymentSavings(baseSchedule, extraSchedule);

    expect(extraSchedule).toHaveLength(20);
    expect(roundCurrency(savings.interestWithExtra)).toBe(10_788.35);
    expect(roundCurrency(savings.interestSaved)).toBe(2_656.96);
    expect(roundCurrency(extraSchedule.at(-1)?.remainingBalance ?? 1)).toBe(0);
  });

  it("adds monthly insurance to payments and summary totals", () => {
    const monthlyPayment = calculateMonthlyPayment(10_000, 12, 10);
    const schedule = buildAmortizationSchedule({
      principal: 10_000,
      annualRate: 12,
      months: 10,
      monthlyInsurance: 100,
    });
    const summary = calculateLoanSummary({
      schedule,
      principal: 10_000,
      monthlyPayment,
      monthlyInsurance: 100,
    });

    expect(summary.totalInsurance).toBe(1_000);
    expect(roundCurrency(summary.totalMonthlyPayment)).toBe(
      roundCurrency(monthlyPayment + 100),
    );
  });
});

describe("loan inverse helpers and comparison", () => {
  it("calculates the maximum loan from a target payment", () => {
    const amount = calculateLoanAmountFromPayment(3_000, 20, 18);

    expect(roundCurrency(amount)).toBe(46_322.6);
  });

  it("calculates payoff time from a fixed payment", () => {
    const months = calculatePayoffMonths(30_000, 18, 1_800);

    expect(roundCurrency(months)).toBe(19.32);
    expect(Math.ceil(months)).toBe(20);
    expect(calculatePayoffMonths(30_000, 18, 400)).toBe(
      Number.POSITIVE_INFINITY,
    );
  });

  it("compares scenarios by total cost", () => {
    const rows = compareLoanScenarios([
      {
        label: "Prestamo A",
        principal: 40_000,
        annualRate: 22,
        months: 12,
        openingFeePercent: 2,
      },
      {
        label: "Prestamo B",
        principal: 40_000,
        annualRate: 19,
        months: 18,
        openingFeePercent: 0,
      },
      {
        label: "Prestamo C",
        principal: 40_000,
        annualRate: 21,
        months: 24,
        openingFeePercent: 1,
      },
    ]);

    expect(rows[0].isBest).toBe(true);
    expect(roundCurrency(rows[0].monthlyPayment)).toBe(3_743.78);
    expect(roundCurrency(rows[0].totalCost)).toBe(45_725.3);
  });
});

describe("loan parsing and formatting", () => {
  it("accepts common money and percentage formats", () => {
    expect(parseLoanInput("$1,000.50 MXN")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.50",
    });
    expect(parseLoanInput("1.000,50")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.50",
    });
    expect(parseLoanInput("20%", { maxDecimals: 4, preferDecimal: true })).toEqual(
      {
        ok: true,
        value: 20,
        normalized: "20",
      },
    );
  });

  it("rejects empty, negative, invalid, and overly precise values", () => {
    expect(parseLoanInput("")).toEqual({ ok: false, error: "required" });
    expect(parseLoanInput("-100")).toEqual({ ok: false, error: "negative" });
    expect(parseLoanInput("abc")).toEqual({ ok: false, error: "invalid" });
    expect(parseLoanInput("100.123")).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
  });

  it("formats loan outputs for es-MX", () => {
    expect(formatCurrency(2_643.554)).toBe("$2,643.55");
    expect(formatPercent(29.516)).toBe("29.52%");
    expect(formatDuration(20)).toBe("1 año 8 meses");
  });
});
