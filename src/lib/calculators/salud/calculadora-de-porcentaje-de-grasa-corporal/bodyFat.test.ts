import { describe, expect, it } from "vitest";
import {
  BODY_FAT_LIMITS,
  buildBodyFatCopyText,
  calculateBodyFatPercentage,
  calculateBodyFatResult,
  calculateBodyFatSensitivity,
  convertCmToIn,
  convertKgToLb,
  type BodyFatInput,
  BodyFatCalculationError,
  formatBodyFatMeasurementSummary,
  validateBodyFatInput,
} from "./bodyFat";

const maleExample: BodyFatInput = {
  formula: "male",
  heightCm: 180,
  neckCm: 40,
  waistCm: 90,
  weightKg: 80,
};

const femaleExample: BodyFatInput = {
  formula: "female",
  heightCm: 165,
  neckCm: 34,
  waistCm: 75,
  hipCm: 100,
  weightKg: 65,
};

describe("body fat formulas", () => {
  it("calculates the male example at approximately 18.5%", () => {
    expect(calculateBodyFatPercentage(maleExample)).toBeCloseTo(18.46, 1);
  });

  it("calculates a finite female result", () => {
    expect(calculateBodyFatPercentage(femaleExample)).toBeCloseTo(29.24, 1);
  });

  it("increases with waist and decreases with neck", () => {
    const base = calculateBodyFatPercentage(maleExample);
    const largerWaist = calculateBodyFatPercentage({
      ...maleExample,
      waistCm: maleExample.waistCm + 2,
    });
    const largerNeck = calculateBodyFatPercentage({
      ...maleExample,
      neckCm: maleExample.neckCm + 2,
    });

    expect(largerWaist).toBeGreaterThan(base);
    expect(largerNeck).toBeLessThan(base);
  });

  it("produces the same result from equivalent converted measurements", () => {
    const percentage = calculateBodyFatPercentage(maleExample);
    const convertedInput = {
      ...maleExample,
      heightCm: convertCmToIn(maleExample.heightCm) * 2.54,
      neckCm: convertCmToIn(maleExample.neckCm) * 2.54,
      waistCm: convertCmToIn(maleExample.waistCm) * 2.54,
    };

    expect(calculateBodyFatPercentage(convertedInput)).toBeCloseTo(
      percentage,
      10,
    );
  });
});

describe("body fat validation", () => {
  it("requires hip for the female formula", () => {
    const validation = validateBodyFatInput({
      formula: "female",
      heightCm: 165,
      neckCm: 34,
      waistCm: 75,
    });

    expect(validation.isValid).toBe(false);
    expect(validation.errors.hipCm).toBe("required");
  });

  it("rejects a male waist that is not above neck", () => {
    const validation = validateBodyFatInput({
      ...maleExample,
      waistCm: 40,
      neckCm: 40,
    });

    expect(validation.errors.waistCm).toBe("waist_not_above_neck");
  });

  it("rejects measurements outside the orientative limits", () => {
    const validation = validateBodyFatInput({
      ...maleExample,
      heightCm: BODY_FAT_LIMITS.heightCm.min - 1,
      weightKg: BODY_FAT_LIMITS.weightKg.max + 1,
    });

    expect(validation.errors.heightCm).toBe("out_of_range");
    expect(validation.errors.weightKg).toBe("out_of_range");
  });
});

describe("body fat result and sensitivity", () => {
  it("calculates optional body composition that sums to weight", () => {
    const result = calculateBodyFatResult(maleExample);

    expect(result.composition).toBeDefined();
    expect(
      result.composition!.fatMassKg + result.composition!.fatFreeMassKg,
    ).toBeCloseTo(maleExample.weightKg as number, 10);
  });

  it("calculates percentage without weight and omits composition", () => {
    const { weightKg: _weightKg, ...withoutWeight } = maleExample;
    const result = calculateBodyFatResult(withoutWeight);

    expect(result.percentage).toBeGreaterThan(0);
    expect(result.composition).toBeUndefined();
  });

  it("returns a conservative sensitivity interval around the result", () => {
    const result = calculateBodyFatResult(femaleExample);
    const sensitivity = calculateBodyFatSensitivity(femaleExample);

    expect(sensitivity).toBeDefined();
    expect(sensitivity!.minPercentage).toBeLessThan(result.percentage);
    expect(sensitivity!.maxPercentage).toBeGreaterThan(result.percentage);
  });

  it("does not expose an unusable sensitivity result", () => {
    expect(
      calculateBodyFatSensitivity({
        ...maleExample,
        waistCm: 41,
        neckCm: 40,
      }),
    ).toBeUndefined();
  });

  it("throws instead of returning an unusable body fat result", () => {
    expect(() =>
      calculateBodyFatResult({
        formula: "male",
        heightCm: 250,
        neckCm: 79,
        waistCm: 80,
      }),
    ).toThrow(BodyFatCalculationError);
  });
});

describe("body fat display text", () => {
  it("includes composition in copy text when weight exists", () => {
    const result = calculateBodyFatResult(maleExample);
    const copyText = buildBodyFatCopyText(result, "metric");

    expect(copyText).toContain("Estimación: 18.5%");
    expect(copyText).toContain("Sensibilidad por variación");
    expect(copyText).toContain("Masa grasa estimada");
    expect(copyText).toContain("Masa libre de grasa estimada");
    expect(copyText).toContain("no es una medición clínica");
  });

  it("omits composition when weight is absent", () => {
    const { weightKg: _weightKg, ...withoutWeight } = maleExample;
    const copyText = buildBodyFatCopyText(
      calculateBodyFatResult(withoutWeight),
      "metric",
    );

    expect(copyText).not.toContain("Masa grasa estimada");
    expect(copyText).not.toContain("Masa libre de grasa estimada");
  });

  it("formats imperial summaries and masses in imperial units", () => {
    const result = calculateBodyFatResult(maleExample);
    const copyText = buildBodyFatCopyText(result, "imperial");

    expect(formatBodyFatMeasurementSummary(maleExample, "imperial")).toContain(
      "5 ft 10.9 in",
    );
    expect(copyText).toContain(
      `${Math.round(convertKgToLb(result.composition!.fatMassKg) * 10) / 10}`,
    );
    expect(copyText).toContain("lb");
  });
});
