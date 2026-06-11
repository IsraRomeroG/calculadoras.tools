import { describe, expect, it } from "vitest";
import {
  buildDailyProteinCopyText,
  calculateDailyProteinResult,
  convertLbToKg,
  DailyProteinCalculationError,
  PROTEIN_RANGE_MATRIX,
  validateDailyProteinInput,
  type DailyProteinInput,
} from "./dailyProtein";

const validInput: DailyProteinInput = {
  weightKg: 70,
  ageGroup: "adult",
  goal: "maintain",
  activity: "regular",
  meals: 3,
  isPregnantOrLactating: false,
  hasKidneyCondition: false,
  followsProfessionalDiet: false,
};

describe("daily protein calculation", () => {
  it("uses the documented range for maintenance without structured training", () => {
    const result = calculateDailyProteinResult({
      ...validInput,
      activity: "unstructured",
    });

    expect(result.gramsPerKg).toEqual({ min: 0.8, max: 1.2 });
    expect(result.displayedDailyGrams).toEqual({ min: 55, max: 85 });
  });

  it("uses the documented range for regular activity", () => {
    const result = calculateDailyProteinResult(validInput);

    expect(result.gramsPerKg).toEqual({ min: 1.2, max: 1.6 });
    expect(result.displayedDailyGrams).toEqual({ min: 85, max: 110 });
  });

  it("calculates the strength and muscle gain example", () => {
    const result = calculateDailyProteinResult({
      ...validInput,
      weightKg: 75,
      goal: "gain-muscle",
      activity: "strength",
    });

    expect(result.gramsPerKg).toEqual({ min: 1.6, max: 2.2 });
    expect(result.displayedDailyGrams).toEqual({ min: 120, max: 165 });
    expect(result.displayedPracticalGrams).toBe(145);
    expect(result.displayedGramsPerMeal).toBe(50);
  });

  it("documents all nine goal and activity combinations", () => {
    expect(Object.values(PROTEIN_RANGE_MATRIX).flatMap(Object.values)).toHaveLength(
      9,
    );
  });

  it("uses exact values before rounding presentation values", () => {
    const result = calculateDailyProteinResult({
      ...validInput,
      weightKg: 68.04,
      goal: "gain-muscle",
      activity: "strength",
    });

    expect(result.exactDailyGrams.min).toBeCloseTo(108.864);
    expect(result.exactPracticalGrams).toBeCloseTo(129.276);
    expect(result.displayedPracticalGrams % 5).toBe(0);
    expect(result.displayedPracticalGrams).toBeGreaterThanOrEqual(
      result.displayedDailyGrams.min,
    );
    expect(result.displayedPracticalGrams).toBeLessThanOrEqual(
      result.displayedDailyGrams.max,
    );
  });
});

describe("daily protein safety and validation", () => {
  it("blocks minors, invalid weight, and invalid meal counts", () => {
    const validation = validateDailyProteinInput({
      ...validInput,
      weightKg: 10,
      ageGroup: "minor",
      meals: 9,
    });

    expect(validation.errors.weightKg).toBe("out_of_range");
    expect(validation.errors.ageGroup).toBe("not_adult");
    expect(validation.errors.meals).toBe("out_of_range");
    expect(() =>
      calculateDailyProteinResult({ ...validInput, ageGroup: "minor" }),
    ).toThrow(DailyProteinCalculationError);
  });

  it("warns for contextual and individual-guidance situations", () => {
    const result = calculateDailyProteinResult({
      ...validInput,
      weightKg: 150,
      goal: "gain-muscle",
      activity: "regular",
      meals: 1,
      isPregnantOrLactating: true,
      hasKidneyCondition: true,
      followsProfessionalDiet: true,
    });

    expect(result.requiresIndividualGuidance).toBe(true);
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        "extreme_weight",
        "one_meal",
        "gain_without_strength",
        "pregnancy_or_lactation",
        "kidney_condition",
        "professional_diet",
      ]),
    );
  });
});

describe("daily protein conversion and copy", () => {
  it("converts pounds to kilograms", () => {
    expect(convertLbToKg(150)).toBeCloseTo(68.04, 2);
  });

  it("copies practical context for general results", () => {
    const text = buildDailyProteinCopyText(
      calculateDailyProteinResult(validInput),
      "metric",
    );

    expect(text).toContain("Rango orientativo");
    expect(text).toContain("Punto de partida práctico");
    expect(text).toContain("aproximadamente");
    expect(text).toContain("no una prescripción");
  });

  it("does not present the midpoint as personal guidance when review applies", () => {
    const text = buildDailyProteinCopyText(
      calculateDailyProteinResult({
        ...validInput,
        hasKidneyCondition: true,
      }),
      "metric",
    );

    expect(text).not.toContain("Punto de partida práctico");
    expect(text).not.toContain("por comida");
    expect(text).toContain("Prioriza orientación profesional individual");
  });
});
