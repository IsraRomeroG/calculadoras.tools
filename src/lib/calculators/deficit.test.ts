import { describe, expect, it } from "vitest";
import {
  buildComparisonRows,
  buildDeficitCopyText,
  buildEstimatedWeeksRange,
  calculateBmi,
  calculateDeficitPlan,
  calculateSimpleTimeline,
  calculateWeeklyLossKg,
  classifyDeficitRisk,
  formatCalories,
  formatDateRange,
  formatSignedCalories,
  formatWeeklyLossPercent,
  formatWeeksRange,
  roundTo,
  validateDeficitInput,
} from "./deficit";

const baseInput = {
  sex: "male" as const,
  age: 34,
  weightKg: 80,
  targetWeightKg: 68,
  heightCm: 172,
  activityLevel: "moderate" as const,
  pace: "moderate" as const,
  manualTdee: 2450,
};

describe("deficit formulas", () => {
  it("calculates a moderate deficit plan for the MVP example", () => {
    const result = calculateDeficitPlan(
      baseInput,
      new Date("2026-05-28T12:00:00-06:00"),
    );

    expect(result.tdee).toBe(2450);
    expect(result.dailyDeficit).toBe(500);
    expect(result.targetCalories).toBe(1950);
    expect(result.totalWeightLossKg).toBe(12);
    expect(result.totalEnergyDeficit).toBe(92400);
    expect(roundTo(result.weeklyLossKg, 2)).toBe(0.45);
    expect(roundTo(result.weeklyLossPercent, 2)).toBe(0.57);
    expect(roundTo(result.estimatedWeeksSimple, 1)).toBe(26.4);
    expect(result.estimatedWeeksRange).toEqual([27, 29]);
    expect(result.riskLevel).toBe("moderado");
    expect(result.isBlocked).toBe(false);
    expect(formatDateRange(result.estimatedDateRange)).toContain("2026");
  });

  it("calculates weekly loss and simple timeline with 7,700 kcal/kg", () => {
    expect(roundTo(calculateWeeklyLossKg(500), 2)).toBe(0.45);
    expect(roundTo(calculateSimpleTimeline(12, 500), 1)).toBe(26.4);
    expect(buildEstimatedWeeksRange(26.4)).toEqual([27, 29]);
  });

  it("calculates BMI values for current and target weight", () => {
    expect(roundTo(calculateBmi(80, 172), 2)).toBe(27.04);
    expect(roundTo(calculateBmi(68, 172), 2)).toBe(22.99);
  });
});

describe("deficit validation", () => {
  it("requires a lower target weight for weight loss", () => {
    expect(
      validateDeficitInput({
        ...baseInput,
        targetWeightKg: 80,
      }).errors.targetWeightKg,
    ).toBe("target_equal");

    expect(
      validateDeficitInput({
        ...baseInput,
        targetWeightKg: 85,
      }).errors.targetWeightKg,
    ).toBe("target_higher");
  });

  it("blocks adult-only and underweight target plans", () => {
    expect(
      validateDeficitInput({
        ...baseInput,
        age: 16,
      }).errors.age,
    ).toBe("age_under_18");

    expect(
      validateDeficitInput({
        ...baseInput,
        targetWeightKg: 50,
        heightCm: 180,
      }).errors.targetWeightKg,
    ).toBe("target_bmi_low");
  });

  it("warns for large goals, older adults, manual TDEE, and low TDEE", () => {
    const validation = validateDeficitInput({
      ...baseInput,
      age: 70,
      weightKg: 140,
      targetWeightKg: 80,
      manualTdee: 900,
    });

    expect(validation.isValid).toBe(true);
    expect(validation.warnings).toContain("older_adult");
    expect(validation.warnings).toContain("large_weight_loss");
    expect(validation.warnings).toContain("manual_tdee_used");
    expect(validation.warnings).toContain("low_tdee");
  });
});

describe("risk classification and comparison rows", () => {
  it("classifies moderate, supervision, and blocked plans", () => {
    expect(
      classifyDeficitRisk({
        weeklyLossPercent: 0.57,
        dailyDeficit: 500,
        targetCalories: 1950,
      }),
    ).toBe("moderado");

    expect(
      classifyDeficitRisk({
        weeklyLossPercent: 1.1,
        dailyDeficit: 750,
        targetCalories: 1500,
      }),
    ).toBe("solo-supervision");

    expect(
      classifyDeficitRisk({
        weeklyLossPercent: 1.6,
        dailyDeficit: 1000,
        targetCalories: 1700,
      }),
    ).toBe("bloqueado");
  });

  it("builds all MVP pace comparison rows", () => {
    const rows = buildComparisonRows(baseInput);

    expect(rows).toHaveLength(5);
    expect(rows.find((row) => row.pace === "moderate")?.isRecommended).toBe(
      true,
    );
    expect(rows[0].targetCalories).toBe(2200);
    expect(rows[0].estimatedWeeksRange[0]).toBeGreaterThan(50);
  });
});

describe("formatting helpers", () => {
  it("formats calorie, week, percent, date, and copy text values", () => {
    const result = calculateDeficitPlan(
      baseInput,
      new Date("2026-05-28T12:00:00-06:00"),
    );

    expect(formatCalories(1950)).toBe("1,950 kcal/dia");
    expect(formatSignedCalories(-500)).toBe("-500 kcal/dia");
    expect(formatWeeklyLossPercent(0.568)).toBe("~0.57% de tu peso/semana");
    expect(formatWeeksRange([27, 29])).toBe("27 - 29 semanas (6.2 - 6.7 meses)");
    expect(formatDateRange(result.estimatedDateRange)).toBe(
      "diciembre de 2026",
    );
    expect(buildDeficitCopyText(baseInput, result)).toContain(
      "Calorias objetivo: 1,950 kcal/dia",
    );
  });
});
