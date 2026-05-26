import { describe, expect, it } from "vitest";
import {
  calculateAdultBmiResult,
  calculateBmi,
  calculateHealthyWeightRange,
  classifyAdultBmi,
  convertImperialToMetric,
  convertMetricToImperial,
  formatBmi,
  formatHeight,
  formatWeight,
  parseHealthInput,
  roundTo,
} from "./bmi";

describe("bmi formulas", () => {
  it("calculates BMI from metric values", () => {
    expect(roundTo(calculateBmi(75, 172), 2)).toBe(25.35);
  });

  it("converts imperial values to metric values", () => {
    const metric = convertImperialToMetric({
      weightLb: 165,
      feet: 5,
      inches: 8,
    });

    expect(roundTo(metric.weightKg, 2)).toBe(74.84);
    expect(roundTo(metric.heightCm, 2)).toBe(172.72);
    expect(roundTo(calculateBmi(metric.weightKg, metric.heightCm), 2)).toBe(
      25.09,
    );
  });

  it("converts metric values to imperial values", () => {
    const imperial = convertMetricToImperial({
      weightKg: 75,
      heightCm: 172,
    });

    expect(roundTo(imperial.weightLb, 1)).toBe(165.3);
    expect(imperial.feet).toBe(5);
    expect(roundTo(imperial.inches, 1)).toBe(7.7);
  });

  it("calculates healthy weight range from height", () => {
    const range = calculateHealthyWeightRange(172);

    expect(roundTo(range.minKg, 1)).toBe(54.7);
    expect(roundTo(range.maxKg, 1)).toBe(73.7);
  });

  it("builds an adult BMI result with range difference", () => {
    const result = calculateAdultBmiResult({
      weightKg: 75,
      heightCm: 172,
    });

    expect(roundTo(result.bmi, 2)).toBe(25.35);
    expect(result.category.key).toBe("overweight");
    expect(result.rangeStatus).toBe("above");
    expect(roundTo(result.differenceFromRangeKg, 1)).toBe(1.3);
  });
});

describe("adult BMI classification", () => {
  it("uses lower-inclusive and upper-exclusive boundaries", () => {
    expect(classifyAdultBmi(15.99).key).toBe("severe-thinness");
    expect(classifyAdultBmi(16).key).toBe("moderate-thinness");
    expect(classifyAdultBmi(17).key).toBe("mild-thinness");
    expect(classifyAdultBmi(18.5).key).toBe("healthy");
    expect(classifyAdultBmi(25).key).toBe("overweight");
    expect(classifyAdultBmi(30).key).toBe("obesity-class-1");
    expect(classifyAdultBmi(35).key).toBe("obesity-class-2");
    expect(classifyAdultBmi(40).key).toBe("obesity-class-3");
  });
});

describe("health input parsing", () => {
  it("accepts plain numbers, decimal separators, and common units", () => {
    expect(parseHealthInput("75 kg")).toEqual({
      ok: true,
      value: 75,
      normalized: "75",
    });
    expect(parseHealthInput("75,5")).toEqual({
      ok: true,
      value: 75.5,
      normalized: "75.5",
    });
    expect(parseHealthInput("165 lb")).toEqual({
      ok: true,
      value: 165,
      normalized: "165",
    });
    expect(
      parseHealthInput("1.72 m", { convertMetersToCentimeters: true }),
    ).toEqual({
      ok: true,
      value: 172,
      normalized: "172",
    });
  });

  it("rejects empty, negative, invalid, and overly precise values", () => {
    expect(parseHealthInput("")).toEqual({ ok: false, error: "required" });
    expect(parseHealthInput("-75")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseHealthInput("abc")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseHealthInput("75.123")).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
  });
});

describe("bmi formatting helpers", () => {
  it("formats BMI, weight, and height values", () => {
    expect(formatBmi(25.3515)).toBe("25.35");
    expect(formatWeight(54.7376, "kg")).toBe("54.7 kg");
    expect(formatWeight(162.401, "lb")).toBe("162.4 lb");
    expect(formatHeight(172, "cm")).toBe("172 cm");
    expect(formatHeight(68, "imperial")).toBe("5 ft 8 in");
  });
});
