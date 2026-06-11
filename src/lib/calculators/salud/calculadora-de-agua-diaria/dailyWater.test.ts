import { describe, expect, it } from "vitest";
import {
  buildDailyWaterCopyText,
  calculateDailyWaterResult,
  DailyWaterCalculationError,
  formatContainerRange,
  formatDailyWaterRange,
  formatMl,
  validateDailyWaterInput,
  type DailyWaterInput,
} from "./dailyWater";

const validInput: DailyWaterInput = {
  adultConfirmed: true,
  hasFluidRestriction: false,
  hasKidneyOrHeartCondition: false,
  isPregnant: false,
  isLactating: false,
  weightKg: 70,
  exerciseToday: false,
  heatExposure: false,
  containerMl: 500,
};

describe("daily water calculation", () => {
  it("calculates the base range from weight", () => {
    const result = calculateDailyWaterResult(validInput);

    expect(result.base).toEqual({ lowMl: 2100, highMl: 2450 });
    expect(result.total).toEqual(result.base);
    expect(formatDailyWaterRange(result.total)).toBe("2.1 L a 2.5 L");
  });

  it("adds an exercise range based on duration and perceived sweating", () => {
    const result = calculateDailyWaterResult({
      ...validInput,
      exerciseToday: true,
      exerciseMinutes: 60,
      sweatLevel: "moderate",
    });

    expect(result.exerciseAdjustment).toEqual({
      lowMl: 400,
      highMl: 700,
    });
    expect(result.total).toEqual({ lowMl: 2500, highMl: 3150 });
  });

  it("avoids adding the full heat adjustment twice during exercise", () => {
    const exerciseAndHeat = calculateDailyWaterResult({
      ...validInput,
      exerciseToday: true,
      exerciseMinutes: 60,
      sweatLevel: "moderate",
      heatExposure: true,
    });
    const heatWithoutExercise = calculateDailyWaterResult({
      ...validInput,
      heatExposure: true,
    });

    expect(exerciseAndHeat.heatAdjustment).toEqual({
      lowMl: 0,
      highMl: 250,
    });
    expect(heatWithoutExercise.heatAdjustment).toEqual({
      lowMl: 250,
      highMl: 500,
    });
  });

  it("calculates container equivalents and a complete flexible plan", () => {
    const result = calculateDailyWaterResult(validInput);

    expect(formatContainerRange(result.containerRange)).toBe("4.2 a 4.9");
    expect(result.plan).toHaveLength(4);
    expect(result.plan.reduce((sum, item) => sum + item.percentage, 0)).toBe(1);
    expect(result.plan.reduce((sum, item) => sum + item.amountMl, 0)).toBe(
      result.midpointMl,
    );
  });

  it("flags totals above the product review threshold", () => {
    const result = calculateDailyWaterResult({
      ...validInput,
      weightKg: 170,
      exerciseToday: true,
      exerciseMinutes: 120,
      sweatLevel: "high",
      heatExposure: true,
    });

    expect(result.total.highMl).toBeGreaterThan(6000);
    expect(result.requiresReview).toBe(true);
    expect(result.warnings).toContain("review_high_total");
  });

  it("adds pregnancy and lactation warnings without changing the formula", () => {
    const result = calculateDailyWaterResult({
      ...validInput,
      isPregnant: true,
      isLactating: true,
    });

    expect(result.total).toEqual({ lowMl: 2100, highMl: 2450 });
    expect(result.warnings).toEqual(
      expect.arrayContaining(["pregnancy", "lactation"]),
    );
  });
});

describe("daily water validation and blocking", () => {
  it("blocks non-adults and medical fluid restrictions", () => {
    const validation = validateDailyWaterInput({
      ...validInput,
      adultConfirmed: false,
      hasFluidRestriction: true,
      hasKidneyOrHeartCondition: true,
    });

    expect(validation.isValid).toBe(false);
    expect(validation.blockers).toEqual(
      expect.arrayContaining([
        "not_adult",
        "fluid_restriction",
        "kidney_or_heart_condition",
      ]),
    );
    expect(() =>
      calculateDailyWaterResult({
        ...validInput,
        hasFluidRestriction: true,
      }),
    ).toThrow(DailyWaterCalculationError);
  });

  it("requires duration and sweating only when exercise is selected", () => {
    const withExercise = validateDailyWaterInput({
      ...validInput,
      exerciseToday: true,
    });
    const withoutExercise = validateDailyWaterInput(validInput);

    expect(withExercise.errors.exerciseMinutes).toBe("required");
    expect(withExercise.errors.sweatLevel).toBe("required");
    expect(withoutExercise.errors.exerciseMinutes).toBeUndefined();
    expect(withoutExercise.errors.sweatLevel).toBeUndefined();
  });

  it("validates weight, duration, and container ranges", () => {
    const validation = validateDailyWaterInput({
      ...validInput,
      weightKg: 20,
      exerciseToday: true,
      exerciseMinutes: 301,
      sweatLevel: "low",
      containerMl: 50,
    });

    expect(validation.errors.weightKg).toBe("out_of_range");
    expect(validation.errors.exerciseMinutes).toBe("out_of_range");
    expect(validation.errors.containerMl).toBe("out_of_range");
  });
});

describe("daily water formatting and copy text", () => {
  it("rounds milliliters for presentation without changing result values", () => {
    const result = calculateDailyWaterResult({
      ...validInput,
      weightKg: 71,
    });

    expect(result.base.lowMl).toBe(2130);
    expect(formatMl(result.base.lowMl)).toBe("2,150 ml");
  });

  it("includes context and limitations in copied text", () => {
    const text = buildDailyWaterCopyText(
      calculateDailyWaterResult({
        ...validInput,
        exerciseToday: true,
        exerciseMinutes: 60,
        sweatLevel: "moderate",
        heatExposure: true,
      }),
      "metric",
    );

    expect(text).toContain("Rango orientativo de líquidos para beber");
    expect(text).toContain("Ajuste por ejercicio");
    expect(text).toContain("Ajuste por calor");
    expect(text).toContain("no una necesidad exacta");
    expect(text).toContain("alimentos también aportan agua");
  });
});
