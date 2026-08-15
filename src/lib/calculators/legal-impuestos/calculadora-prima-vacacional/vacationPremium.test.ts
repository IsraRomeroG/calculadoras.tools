import { describe, expect, it } from "vitest";
import {
  calculateVacationPremium,
  formatVacationPremiumMoney,
  normalizeVacationPremiumDays,
  parseVacationPremiumNumber,
} from "./vacationPremium";
import { MEXICO_VACATION_PREMIUM_RULE_2023 } from "./rules/mx/2023";

const baseInput = {
  situation: "active" as const,
  referenceDate: "2026-08-14",
  vacationDays: 10,
  salaryAmount: 100,
  salaryFrequency: "daily" as const,
};

describe("Mexico vacation premium rule", () => {
  it("keeps the 25% legal minimum and source metadata", () => {
    expect(MEXICO_VACATION_PREMIUM_RULE_2023.minimumPremiumRate).toBe(0.25);
    expect(MEXICO_VACATION_PREMIUM_RULE_2023.sources).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ articles: expect.arrayContaining(["80"]) }),
      ]),
    );
  });
});

describe("vacation premium calculation", () => {
  it("keeps ordinary vacation wages separate from the active premium", () => {
    const result = calculateVacationPremium(baseInput);

    expect(result.vacationBase).toBe(1_000);
    expect(result.minimumPremium).toBe(250);
    expect(result.applicablePremium).toBe(250);
    expect(result.primaryAmount).toBe(250);
    expect(result.terminationVacationComponent).toBeUndefined();
  });

  it("adds the vacation base only for the termination component", () => {
    const result = calculateVacationPremium({
      ...baseInput,
      situation: "termination",
    });

    expect(result.primaryAmount).toBe(1_250);
    expect(result.terminationVacationComponent).toBe(1_250);
  });

  it("accepts and compares a superior contractual premium", () => {
    const result = calculateVacationPremium({
      ...baseInput,
      contractualRatePercent: 30,
      offeredRatePercent: 20,
    });

    expect(result.applicableRate).toBe(0.3);
    expect(result.minimumPremium).toBe(250);
    expect(result.applicablePremium).toBe(300);
    expect(result.benefitAboveMinimum).toBe(50);
    expect(result.offeredPremium).toBe(200);
    expect(result.differenceFromApplicable).toBe(100);
  });

  it.each([
    ["daily", 600],
    ["weekly", 4_200],
    ["biweekly", 9_000],
    ["monthly", 18_000],
  ] as const)("normalizes %s fixed salary", (salaryFrequency, salaryAmount) => {
    const result = calculateVacationPremium({
      ...baseInput,
      salaryFrequency,
      salaryAmount,
    });

    expect(result.dailySalary).toBe(600);
  });

  it("keeps intermediate precision and rounds only formatted money", () => {
    const result = calculateVacationPremium({
      ...baseInput,
      vacationDays: 12,
      salaryAmount: 333.33,
    });

    expect(result.vacationBase).toBeCloseTo(3_999.96);
    expect(result.applicablePremium).toBeCloseTo(999.99);
    expect(formatVacationPremiumMoney(result.applicablePremium)).toContain(
      "999.99",
    );
  });

  it("rejects invalid or unsupported inputs", () => {
    expect(() =>
      calculateVacationPremium({ ...baseInput, vacationDays: 0 }),
    ).toThrowError(expect.objectContaining({ code: "days_not_positive" }));
    expect(() =>
      calculateVacationPremium({ ...baseInput, salaryAmount: -1 }),
    ).toThrowError(expect.objectContaining({ code: "salary_not_positive" }));
    expect(() =>
      calculateVacationPremium({ ...baseInput, contractualRatePercent: 24 }),
    ).toThrowError(
      expect.objectContaining({ code: "contractual_rate_below_minimum" }),
    );
    expect(() =>
      calculateVacationPremium({ ...baseInput, offeredRatePercent: -1 }),
    ).toThrowError(expect.objectContaining({ code: "negative_offered_rate" }));
    expect(() =>
      calculateVacationPremium({ ...baseInput, referenceDate: "2022-12-31" }),
    ).toThrowError(
      expect.objectContaining({ code: "unsupported_rule_period" }),
    );
    expect(() =>
      calculateVacationPremium({ ...baseInput, referenceDate: "2026-02-30" }),
    ).toThrowError(expect.objectContaining({ code: "invalid_reference_date" }));
  });
});

describe("localized inputs", () => {
  it("parses amounts and percentages with local separators", () => {
    expect(parseVacationPremiumNumber("18,000")).toEqual({
      ok: true,
      value: 18_000,
      normalized: "18000",
    });
    expect(parseVacationPremiumNumber("25,5 %")).toEqual({
      ok: true,
      value: 25.5,
      normalized: "25.5",
    });
    expect(parseVacationPremiumNumber("0.25")).toEqual({
      ok: true,
      value: 0.25,
      normalized: "0.25",
    });
  });

  it("rejects malformed, negative and overly precise values", () => {
    expect(parseVacationPremiumNumber("")).toEqual({
      ok: false,
      error: "required",
    });
    expect(parseVacationPremiumNumber("-10")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(
      parseVacationPremiumNumber("1.234", { allowThousands: false }),
    ).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
  });

  it("normalizes guided vacation days once", () => {
    expect(normalizeVacationPremiumDays(6.6666)).toBe(6.67);
  });
});
