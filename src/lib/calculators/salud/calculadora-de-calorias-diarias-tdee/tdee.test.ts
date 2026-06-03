import { describe, expect, it } from "vitest";
import {
  calculateGoalCalories,
  calculateHarrisBenedictBmr,
  calculateKatchMcArdleBmr,
  calculateMifflinBmr,
  calculateTdee,
  calculateTdeeResult,
  convertImperialToMetric,
  convertMetricToImperial,
  estimateWeeklyEnergyEquivalentKg,
  formatCalories,
  formatHeight,
  formatSignedCalories,
  formatWeeklyEquivalentKg,
  formatWeight,
  parseHealthInput,
  roundTo,
  validateGoalCalories,
  validateTdeeInput,
} from "./tdee";

describe("tdee formulas", () => {
  it("calculates the Mifflin-St Jeor example for women", () => {
    const bmr = calculateMifflinBmr({
      sex: "female",
      age: 28,
      weightKg: 65,
      heightCm: 165,
    });
    const tdee = calculateTdee(bmr, 1.55);

    expect(roundTo(bmr, 2)).toBe(1380.25);
    expect(roundTo(tdee, 2)).toBe(2139.39);
  });

  it("calculates a basic male sedentary example", () => {
    const result = calculateTdeeResult({
      sex: "male",
      age: 30,
      weightKg: 80,
      heightCm: 180,
      activityLevel: "sedentary",
      goal: "maintain",
    });

    expect(roundTo(result.bmr, 0)).toBe(1780);
    expect(roundTo(result.tdee, 0)).toBe(2136);
  });

  it("calculates Harris-Benedict and Katch-McArdle comparison formulas", () => {
    const harris = calculateHarrisBenedictBmr({
      sex: "female",
      age: 28,
      weightKg: 65,
      heightCm: 165,
    });
    const katch = calculateKatchMcArdleBmr({
      weightKg: 65,
      bodyFatPercentage: 22,
    });

    expect(roundTo(harris, 0)).toBe(1439);
    expect(roundTo(katch, 0)).toBe(1465);
  });
});

describe("goal calories", () => {
  it("calculates all target adjustments from TDEE", () => {
    expect(roundTo(calculateGoalCalories(2139.39, "maintain"), 0)).toBe(2139);
    expect(roundTo(calculateGoalCalories(2139.39, "lose-moderate"), 0)).toBe(
      1818,
    );
    expect(roundTo(calculateGoalCalories(2139.39, "gain-moderate"), 0)).toBe(
      2353,
    );
  });

  it("estimates weekly energy equivalent with 7,700 kcal/kg", () => {
    expect(roundTo(estimateWeeklyEnergyEquivalentKg(-320.91), 2)).toBe(-0.29);
  });

  it("blocks calorie targets below 1,000 kcal", () => {
    const validation = validateGoalCalories({
      sex: "female",
      goalCalories: 920,
      tdee: 1150,
      goalAdjustmentCalories: -230,
      goal: "lose-aggressive",
    });

    expect(validation.isBlocked).toBe(true);
    expect(validation.warnings).toContain("goal_too_low");
  });
});

describe("unit conversion and parsing", () => {
  it("converts metric values to imperial values", () => {
    const imperial = convertMetricToImperial({
      weightKg: 65,
      heightCm: 165,
    });

    expect(roundTo(imperial.weightLb, 1)).toBe(143.3);
    expect(imperial.feet).toBe(5);
    expect(roundTo(imperial.inches, 1)).toBe(5);
  });

  it("converts imperial values close to the metric example", () => {
    const metric = convertImperialToMetric({
      weightLb: 143.3,
      feet: 5,
      inches: 5,
    });
    const result = calculateTdeeResult({
      sex: "female",
      age: 28,
      weightKg: metric.weightKg,
      heightCm: metric.heightCm,
      activityLevel: "moderate",
      goal: "maintain",
    });

    expect(roundTo(metric.weightKg, 1)).toBe(65);
    expect(roundTo(metric.heightCm, 1)).toBe(165.1);
    expect(roundTo(result.tdee, 0)).toBe(2140);
  });

  it("parses decimal separators and common unit labels", () => {
    expect(parseHealthInput("65 kg")).toEqual({
      ok: true,
      value: 65,
      normalized: "65",
    });
    expect(parseHealthInput("65,5")).toEqual({
      ok: true,
      value: 65.5,
      normalized: "65.5",
    });
    expect(
      parseHealthInput("1.65 m", { convertMetersToCentimeters: true }),
    ).toEqual({
      ok: true,
      value: 165,
      normalized: "165",
    });
  });
});

describe("validation", () => {
  it("blocks non-adult calculations and invalid ranges", () => {
    expect(
      validateTdeeInput({
        sex: "female",
        age: 16,
        weightKg: 65,
        heightCm: 165,
        activityLevel: "moderate",
        goal: "maintain",
      }).errors.age,
    ).toBe("age_under_18");

    expect(
      validateTdeeInput({
        sex: "male",
        age: 30,
        weightKg: -65,
        heightCm: 180,
        activityLevel: "sedentary",
        goal: "maintain",
      }).errors.weightKg,
    ).toBe("weight_range");
  });

  it("warns for older adults and unusually low TDEE without blocking", () => {
    const olderAdult = validateTdeeInput({
      sex: "female",
      age: 70,
      weightKg: 65,
      heightCm: 165,
      activityLevel: "moderate",
      goal: "maintain",
    });
    const lowTdee = validateTdeeInput({
      sex: "female",
      age: 100,
      weightKg: 30,
      heightCm: 100,
      activityLevel: "sedentary",
      goal: "maintain",
    });

    expect(olderAdult.isValid).toBe(true);
    expect(olderAdult.warnings).toContain("older_adult");
    expect(lowTdee.isValid).toBe(true);
    expect(lowTdee.warnings).toContain("low_tdee");
  });
});

describe("formatting helpers", () => {
  it("formats calories, signed calories, weights, heights, and weekly values", () => {
    expect(formatCalories(2139.39)).toBe("2,139 kcal/día");
    expect(formatSignedCalories(-320.91)).toBe("-321 kcal/día");
    expect(formatSignedCalories(106.9)).toBe("+107 kcal/día");
    expect(formatWeight(65, "kg")).toBe("65.0 kg");
    expect(formatWeight(143.3, "lb")).toBe("143.3 lb");
    expect(formatHeight(165, "cm")).toBe("165 cm");
    expect(formatHeight(65, "imperial")).toBe("5 ft 5 in");
    expect(formatWeeklyEquivalentKg(-0.29)).toBe("~0.29 kg/semana");
  });
});
