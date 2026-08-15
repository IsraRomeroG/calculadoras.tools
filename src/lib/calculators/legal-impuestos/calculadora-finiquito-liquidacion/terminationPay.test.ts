import { describe, expect, it } from "vitest";
import {
  TerminationValidationError,
  calculateTerminationPay,
  formatTerminationCurrency,
  normalizeDailySalary,
  parseAmountInput,
} from "./terminationPay";
import { getMexicoTerminationRule } from "./rules/mx/2026";

const baseInput = {
  situation: "resignation" as const,
  hireDate: "2025-01-01",
  endDate: "2025-06-30",
  contractType: "indefinite" as const,
  salaryBase: 30_000,
  frequency: "monthly" as const,
  unpaidDays: 5,
  annualBonusDays: 15,
  ineligibleBonusDays: 0,
  priorVacationBalance: 0,
  usedVacationDays: 0,
  vacationPremiumRate: 0.25,
};

describe("termination salary normalization", () => {
  it.each([
    [1000, "daily", 1000],
    [7000, "weekly", 1000],
    [15000, "biweekly", 1000],
    [30000, "monthly", 1000],
  ] as const)("normalizes %s %s salary", (salary, frequency, expected) => {
    expect(normalizeDailySalary(salary, frequency)).toBe(expected);
  });

  it("parses Mexican decimal input and formats MXN", () => {
    expect(parseAmountInput(" 1000,50 ")).toBe(1000.5);
    expect(parseAmountInput("30,000")).toBe(30000);
    expect(parseAmountInput("30.000,50")).toBe(30000.5);
    expect(formatTerminationCurrency(1234.5)).toContain("1,234.50");
  });
});

describe("Mexico termination pay", () => {
  it("selects the minimum-wage rule by final date", () => {
    expect(getMexicoTerminationRule("2025-12-31").minimumWageByArea.general).toBe(278.8);
    expect(getMexicoTerminationRule("2026-01-01").minimumWageByArea.general).toBe(315.04);
  });

  it("calculates proportional benefits as monetary amounts", () => {
    const result = calculateTerminationPay(baseInput);

    expect(result.ordinaryDailySalary).toBe(1000);
    expect(result.annualBonusEligibleDays).toBe(181);
    expect(result.vacation.mainDays).toBeCloseTo((12 * 181) / 365);
    expect(result.vacationPay).toBeCloseTo((12 * 181) / 365 * 1000);
    expect(result.vacationPremiumAmount).toBeCloseTo(result.vacationPay * 0.25);
    expect(result.finiquitoGross).toBeGreaterThan(result.annualBonusAmount);
  });

  it("uses a manual unpaid salary amount instead of days", () => {
    const result = calculateTerminationPay({
      ...baseInput,
      unpaidDays: 5,
      unpaidAmountOverride: 2500,
    });

    expect(result.unpaidSalaryAmount).toBe(2500);
    expect(result.usedUnpaidAmountOverride).toBe(true);
  });

  it("subtracts payments once and never returns a negative pending amount", () => {
    const result = calculateTerminationPay({
      ...baseInput,
      receivedPayments: [{ amount: 999_999 }],
    });

    expect(result.finiquitoPending).toBe(0);
    expect(result.receivedExcess).toBeGreaterThan(0);
  });

  it("requires at least the legal annual bonus and premium", () => {
    expect(() =>
      calculateTerminationPay({ ...baseInput, annualBonusDays: 14 }),
    ).toThrowError(
      expect.objectContaining<TerminationValidationError>({
        code: "contract_below_legal",
      }),
    );
    expect(() =>
      calculateTerminationPay({ ...baseInput, vacationPremiumRate: 0.2 }),
    ).toThrowError(
      expect.objectContaining<TerminationValidationError>({
        code: "contract_below_legal",
      }),
    );
  });

  it("does not activate indemnity from the situation alone", () => {
    const result = calculateTerminationPay({
      ...baseInput,
      situation: "dismissal",
    });

    expect(result.constitutionalIndemnityAmount).toBe(0);
    expect(result.twentyDaysIndemnityAmount).toBe(0);
    expect(result.conditionalTotal).toBe(0);
  });

  it("calculates a separately activated three-month scenario with integrated salary", () => {
    const result = calculateTerminationPay({
      ...baseInput,
      situation: "dismissal",
      includeConstitutionalIndemnity: true,
    });

    expect(result.integratedDailySalary).toBeGreaterThan(1000);
    expect(result.constitutionalIndemnityAmount).toBeCloseTo(
      result.integratedDailySalary * 90,
    );
    expect(result.finiquitoGross).not.toBe(result.constitutionalIndemnityAmount);
  });

  it("requires fifteen years for voluntary seniority premium", () => {
    const result = calculateTerminationPay({
      ...baseInput,
      includeSeniorityPremium: true,
      plantWorker: true,
    });

    expect(result.seniorityEligible).toBe(false);
    expect(result.seniorityAmount).toBe(0);
  });

  it("allows seniority premium scenario after dismissal for a plant worker", () => {
    const result = calculateTerminationPay({
      ...baseInput,
      situation: "dismissal",
      hireDate: "2010-01-01",
      endDate: "2026-06-30",
      includeSeniorityPremium: true,
      plantWorker: true,
      minimumWageArea: "general",
    });

    expect(result.seniorityEligible).toBe(true);
    expect(result.seniorityBaseSalary).toBe(630.08);
    expect(result.seniorityAmount).toBeGreaterThan(0);
  });

  it("rejects invalid dates, salary and excessive ineligible days", () => {
    expect(() =>
      calculateTerminationPay({ ...baseInput, endDate: "2025-02-30" }),
    ).toThrowError(expect.objectContaining({ code: "invalid_end_date" }));
    expect(() =>
      calculateTerminationPay({ ...baseInput, salaryBase: 0 }),
    ).toThrowError(expect.objectContaining({ code: "zero_salary" }));
    expect(() =>
      calculateTerminationPay({ ...baseInput, ineligibleBonusDays: 200 }),
    ).toThrowError(expect.objectContaining({ code: "invalid_number" }));
  });
});
