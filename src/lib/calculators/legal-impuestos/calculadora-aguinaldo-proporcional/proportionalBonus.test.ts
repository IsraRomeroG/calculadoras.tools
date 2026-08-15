import { describe, expect, it } from "vitest";
import {
  AnnualBonusValidationError,
  calculateProportionalAnnualBonus,
  formatAnnualBonusDate,
  formatAnnualBonusMoney,
  parseLocalizedNumber,
} from "./proportionalBonus";
import { MEXICO_ANNUAL_BONUS_RULE_2026 } from "./rules/mx/2026";

const baseInput = {
  employmentStatus: "active" as const,
  hireDate: "2026-01-01",
  endDate: "2026-06-30",
  today: "2026-08-13",
  salaryAmount: 18_000,
  salaryFrequency: "monthly" as const,
};

describe("Mexico annual bonus rule", () => {
  it("keeps the legal minimum and source metadata", () => {
    expect(MEXICO_ANNUAL_BONUS_RULE_2026.minimumDays).toBe(15);
    expect(MEXICO_ANNUAL_BONUS_RULE_2026.reviewedAt).toMatch(
      /^\d{4}-\d{2}-\d{2}$/,
    );
    expect(MEXICO_ANNUAL_BONUS_RULE_2026.sources).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ articles: expect.arrayContaining(["87"]) }),
      ]),
    );
  });
});

describe("proportional annual bonus calculation", () => {
  it("counts a same-day employment period as one inclusive day", () => {
    const result = calculateProportionalAnnualBonus({
      ...baseInput,
      hireDate: "2026-05-01",
      endDate: "2026-05-01",
    });

    expect(result.inclusiveDays).toBe(1);
    expect(result.eligibleDays).toBe(1);
    expect(result.generatedAmount).toBeCloseTo((600 * 15) / 365);
  });

  it("produces exactly the annual benefit for a complete common year", () => {
    const result = calculateProportionalAnnualBonus({
      ...baseInput,
      endDate: "2026-12-31",
      today: "2026-12-31",
    });

    expect(result.basisDays).toBe(365);
    expect(result.inclusiveDays).toBe(365);
    expect(result.generatedProportion).toBe(1);
    expect(result.generatedAmount).toBe(9_000);
  });

  it("produces exactly the annual benefit for a complete leap year", () => {
    const result = calculateProportionalAnnualBonus({
      ...baseInput,
      hireDate: "2024-01-01",
      endDate: "2024-12-31",
      today: "2026-08-13",
    });

    expect(result.basisDays).toBe(366);
    expect(result.inclusiveDays).toBe(366);
    expect(result.generatedAmount).toBe(9_000);
  });

  it("limits a multi-year employment relationship to the selected year", () => {
    const result = calculateProportionalAnnualBonus({
      ...baseInput,
      hireDate: "2020-03-10",
      endDate: "2026-06-30",
    });

    expect(result.effectiveStart).toBe("2026-01-01");
    expect(result.inclusiveDays).toBe(181);
    expect(result.generatedProportion).toBeCloseTo(181 / 365);
  });

  it.each([
    ["daily", 600, 600],
    ["weekly", 4_200, 600],
    ["biweekly", 9_000, 600],
    ["monthly", 18_000, 600],
  ] as const)("normalizes %s salary", (salaryFrequency, salaryAmount, expected) => {
    const result = calculateProportionalAnnualBonus({
      ...baseInput,
      salaryFrequency,
      salaryAmount,
    });

    expect(result.dailySalary).toBe(expected);
  });

  it("subtracts confirmed non-eligible days", () => {
    const result = calculateProportionalAnnualBonus({
      ...baseInput,
      nonEligibleDays: 10,
    });

    expect(result.inclusiveDays).toBe(181);
    expect(result.eligibleDays).toBe(171);
    expect(result.generatedAmount).toBeCloseTo((9_000 * 171) / 365);
  });

  it("accepts a superior contractual benefit", () => {
    const result = calculateProportionalAnnualBonus({
      ...baseInput,
      annualBonusDays: 30,
    });

    expect(result.usesContractBenefit).toBe(true);
    expect(result.annualEquivalent).toBe(18_000);
  });

  it("projects to year end without replacing the generated amount", () => {
    const result = calculateProportionalAnnualBonus({
      ...baseInput,
      projectToYearEnd: true,
    });

    expect(result.generatedAmount).toBeCloseTo((9_000 * 181) / 365);
    expect(result.projectedEligibleDays).toBe(365);
    expect(result.projectedAmount).toBe(9_000);
  });

  it("compares a received gross amount neutrally", () => {
    const result = calculateProportionalAnnualBonus({
      ...baseInput,
      receivedAmount: 5_000,
    });

    expect(result.differenceFromEstimate).toBeCloseTo(
      5_000 - (9_000 * 181) / 365,
    );
  });

  it("rejects invalid dates, future dates and inverted ranges", () => {
    expect(() =>
      calculateProportionalAnnualBonus({
        ...baseInput,
        hireDate: "2026-02-30",
      }),
    ).toThrowError(expect.objectContaining({ code: "invalid_hire_date" }));

    expect(() =>
      calculateProportionalAnnualBonus({
        ...baseInput,
        hireDate: "2026-07-01",
      }),
    ).toThrowError(expect.objectContaining({ code: "end_before_hire" }));

    expect(() =>
      calculateProportionalAnnualBonus({
        ...baseInput,
        endDate: "2026-08-14",
      }),
    ).toThrowError(expect.objectContaining({ code: "end_in_future" }));
  });

  it("rejects values outside the supported legal calculation", () => {
    expect(() =>
      calculateProportionalAnnualBonus({
        ...baseInput,
        salaryAmount: 0,
      }),
    ).toThrowError(expect.objectContaining({ code: "salary_not_positive" }));

    expect(() =>
      calculateProportionalAnnualBonus({
        ...baseInput,
        annualBonusDays: 14,
      }),
    ).toThrowError(expect.objectContaining({ code: "below_legal_minimum" }));

    expect(() =>
      calculateProportionalAnnualBonus({
        ...baseInput,
        nonEligibleDays: 1.5,
      }),
    ).toThrowError(
      expect.objectContaining({ code: "non_eligible_days_not_integer" }),
    );

    expect(() =>
      calculateProportionalAnnualBonus({
        ...baseInput,
        nonEligibleDays: 182,
      }),
    ).toThrowError(
      expect.objectContaining({ code: "non_eligible_days_exceed_period" }),
    );
  });

  it("rejects unavailable projections", () => {
    expect(() =>
      calculateProportionalAnnualBonus({
        ...baseInput,
        employmentStatus: "terminated",
        projectToYearEnd: true,
      }),
    ).toThrowError(
      expect.objectContaining<AnnualBonusValidationError>({
        code: "projection_unavailable",
      }),
    );
  });
});

describe("localized input and output", () => {
  it("parses localized amounts and decimal benefit days", () => {
    expect(parseLocalizedNumber("18,000")).toEqual({
      ok: true,
      value: 18_000,
      normalized: "18000",
    });
    expect(parseLocalizedNumber("15,5")).toEqual({
      ok: true,
      value: 15.5,
      normalized: "15.5",
    });
    expect(parseLocalizedNumber("", { required: false })).toEqual({
      ok: true,
      value: 0,
      normalized: "0",
    });
  });

  it("rejects malformed, negative and overly precise values", () => {
    expect(parseLocalizedNumber("")).toEqual({
      ok: false,
      error: "required",
    });
    expect(parseLocalizedNumber("-10")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseLocalizedNumber("1.2.3")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseLocalizedNumber("1.23456")).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
  });

  it("formats money and civil dates for Mexico without timezone shifts", () => {
    expect(formatAnnualBonusMoney(2_958.904)).toContain("2,958.90");
    expect(formatAnnualBonusDate("2026-01-01")).toBe("1 de enero de 2026");
  });
});
