import { describe, expect, it } from "vitest";
import {
  calculateKetoMacros,
  calculateMealDistribution,
  calculatePercentageMacros,
  calculateProteinFirstMacros,
  convertKgToLb,
  convertLbToKg,
  formatCalories,
  formatGrams,
  formatMealGrams,
  formatPercent,
  formatWeight,
  getDietPresetDefaults,
  parseHealthInput,
  roundTo,
  validateMeals,
  validatePercentageInput,
  validateProteinFirstInput,
} from "./macros";

describe("macro calculations", () => {
  it("calculates the protein-first MVP example", () => {
    const result = calculateProteinFirstMacros({
      calories: 1818,
      weightKg: 65,
      goal: "lose-fat",
      dietPreset: "balanced",
      proteinGramsPerKg: 1.8,
      fatPercent: 30,
    });

    expect(roundTo(result.protein.grams, 0)).toBe(117);
    expect(roundTo(result.carbs.grams, 0)).toBe(201);
    expect(roundTo(result.fat.grams, 0)).toBe(61);
    expect(roundTo(result.protein.percent, 1)).toBe(25.7);
    expect(roundTo(result.carbs.percent, 1)).toBe(44.3);
    expect(roundTo(result.fat.percent, 1)).toBe(30);
  });

  it("calculates the 80 kg protein-first example", () => {
    const result = calculateProteinFirstMacros({
      calories: 2400,
      weightKg: 80,
      goal: "gain-muscle",
      dietPreset: "balanced",
      proteinGramsPerKg: 2,
      fatPercent: 30,
    });

    expect(roundTo(result.protein.grams, 0)).toBe(160);
    expect(roundTo(result.carbs.grams, 0)).toBe(260);
    expect(roundTo(result.fat.grams, 0)).toBe(80);
  });

  it("calculates macros by percentages", () => {
    const result = calculatePercentageMacros({
      calories: 1818,
      weightKg: 65,
      goal: "lose-fat",
      dietPreset: "balanced",
      proteinPercent: 35,
      carbsPercent: 35,
      fatPercent: 30,
    });

    expect(roundTo(result.protein.grams, 0)).toBe(159);
    expect(roundTo(result.carbs.grams, 0)).toBe(159);
    expect(roundTo(result.fat.grams, 0)).toBe(61);
    expect(result.warnings).toContain("protein_high");
  });

  it("calculates keto with carbohydrate grams", () => {
    const result = calculateKetoMacros({
      calories: 1818,
      weightKg: 65,
      goal: "lose-fat",
      dietPreset: "keto",
      proteinGramsPerKg: 1.8,
      fatPercent: 65,
      carbLimitGrams: 30,
    });

    expect(roundTo(result.protein.grams, 0)).toBe(117);
    expect(roundTo(result.carbs.grams, 0)).toBe(30);
    expect(roundTo(result.fat.grams, 0)).toBe(137);
  });
});

describe("macro validation", () => {
  it("blocks percentage totals outside tolerance", () => {
    const validation = validatePercentageInput({
      calories: 1818,
      weightKg: 65,
      goal: "lose-fat",
      dietPreset: "balanced",
      proteinPercent: 40,
      carbsPercent: 40,
      fatPercent: 30,
    });

    expect(validation.isValid).toBe(false);
    expect(validation.errors.percentageTotal).toBe("percentage_total");
  });

  it("blocks impossible protein-first distributions", () => {
    const validation = validateProteinFirstInput({
      calories: 1000,
      weightKg: 60,
      goal: "lose-fat",
      dietPreset: "balanced",
      proteinGramsPerKg: 3.5,
      fatPercent: 30,
    });

    expect(validation.isValid).toBe(false);
    expect(validation.errors.fatPercent).toBe("negative_carbs");
  });

  it("warns for keto carbohydrates above 50 grams", () => {
    const validation = validateProteinFirstInput({
      calories: 1818,
      weightKg: 65,
      goal: "lose-fat",
      dietPreset: "keto",
      proteinGramsPerKg: 1.8,
      fatPercent: 65,
      carbLimitGrams: 80,
    });

    expect(validation.isValid).toBe(true);
    expect(validation.warnings).toContain("keto_carbs_high");
  });

  it("validates meal count and warns for one meal", () => {
    expect(validateMeals(0).errors.meals).toBe("meals_range");
    expect(validateMeals(8).errors.meals).toBe("meals_range");
    expect(validateMeals(1).warnings).toContain("one_meal");
  });
});

describe("meal distribution", () => {
  it("splits a valid result across meals", () => {
    const result = calculateProteinFirstMacros({
      calories: 1818,
      weightKg: 65,
      goal: "lose-fat",
      dietPreset: "balanced",
      proteinGramsPerKg: 1.8,
      fatPercent: 30,
    });
    const meals = calculateMealDistribution({ result, meals: 3 });

    expect(roundTo(meals[0].calories, 0)).toBe(606);
    expect(roundTo(meals[0].proteinGrams, 1)).toBe(39);
    expect(roundTo(meals[0].carbsGrams, 1)).toBe(67.1);
    expect(roundTo(meals[0].fatGrams, 1)).toBe(20.2);
  });
});

describe("presets, parsing, conversion, and formatting", () => {
  it("returns keto defaults with carb grams", () => {
    const defaults = getDietPresetDefaults("keto", "lose-fat");

    expect(defaults.carbLimitGrams).toBe(30);
    expect(defaults.proteinGramsPerKg).toBe(1.8);
  });

  it("converts weight units", () => {
    expect(roundTo(convertKgToLb(65), 1)).toBe(143.3);
    expect(roundTo(convertLbToKg(143.3), 1)).toBe(65);
  });

  it("parses common macro inputs", () => {
    expect(parseHealthInput("1,818 kcal")).toEqual({
      ok: true,
      value: 1818,
      normalized: "1818",
    });
    expect(parseHealthInput("1.8 g/kg")).toEqual({
      ok: true,
      value: 1.8,
      normalized: "1.8",
    });
    expect(parseHealthInput("30%")).toEqual({
      ok: true,
      value: 30,
      normalized: "30",
    });
  });

  it("formats macro values", () => {
    expect(formatCalories(1818.4)).toBe("1,818 kcal");
    expect(formatGrams(116.9)).toBe("117 g");
    expect(formatMealGrams(20.222)).toBe("20.2 g");
    expect(formatPercent(25.714)).toBe("25.7%");
    expect(formatWeight(65, "kg")).toBe("65.0 kg");
  });
});
