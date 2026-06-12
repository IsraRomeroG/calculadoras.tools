import { describe, expect, it } from "vitest";
import {
  buildExerciseCaloriesCopyText,
  calculateActiveCaloriesPerMinute,
  calculateCaloriesPerMinute,
  calculateExerciseCaloriesResult,
  convertExerciseWeight,
  parseExerciseNumber,
  validateExerciseCaloriesInput,
  type ExerciseCaloriesInput,
} from "./exerciseCalories";

const validInput: ExerciseCaloriesInput = {
  activityId: "running",
  variantId: "running-10-kmh",
  weight: 70,
  weightUnit: "kg",
  durationMinutes: 30,
  useManualMet: false,
};

describe("exercise calorie formulas", () => {
  it("calculates total and active calories", () => {
    expect(calculateCaloriesPerMinute(10, 70) * 30).toBeCloseTo(367.5);
    expect(calculateActiveCaloriesPerMinute(10, 70) * 30).toBeCloseTo(330.75);
  });

  it("never produces negative active calories", () => {
    expect(calculateActiveCaloriesPerMinute(1, 70)).toBe(0);
    expect(calculateActiveCaloriesPerMinute(0.8, 70)).toBe(0);
  });

  it("uses documented variants, comparisons, and manual MET", () => {
    const standard = calculateExerciseCaloriesResult(validInput);
    const manual = calculateExerciseCaloriesResult({ ...validInput, useManualMet: true, manualMet: 10 });
    expect(standard.metUsed).toBe(9.3);
    expect(standard.variant.sourceCode).toBe("12050");
    expect(standard.comparisons.every((item) => item.variant.id.startsWith("running-"))).toBe(true);
    expect(manual.totalCalories).toBeCloseTo(367.5);
    expect(manual.warnings).toContain("manual_met");
  });
});

describe("exercise calorie input", () => {
  it("accepts decimal comma and preserves unit equivalence", () => {
    expect(parseExerciseNumber("70,5")).toEqual({ ok: true, value: 70.5 });
    const pounds = convertExerciseWeight(70, "kg", "lb");
    expect(convertExerciseWeight(pounds, "lb", "kg")).toBeCloseTo(70, 10);
    expect(convertExerciseWeight(154, "lb", "kg")).toBeCloseTo(69.853, 3);
  });

  it("rejects values outside limits", () => {
    const validation = validateExerciseCaloriesInput({
      ...validInput, weight: 10, durationMinutes: 0, useManualMet: true, manualMet: 25.55,
    });
    expect(validation.errors.weight).toBe("out_of_range");
    expect(validation.errors.durationMinutes).toBe("out_of_range");
    expect(validation.errors.manualMet).toBe("out_of_range");
  });
});

describe("exercise calorie copy text", () => {
  it("includes both results, MET, and limitation", () => {
    const text = buildExerciseCaloriesCopyText(calculateExerciseCaloriesResult(validInput));
    expect(text).toContain("Calorías totales");
    expect(text).toContain("Calorías activas");
    expect(text).toContain("MET utilizado");
    expect(text).toContain("Estimación educativa");
  });
});
