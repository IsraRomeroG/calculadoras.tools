import { describe, expect, it } from "vitest";
import {
  WEIGHT_UNITS,
  buildWeightExplanation,
  convertAllWeights,
  convertWeight,
  formatPoundsAndOunces,
  formatStoneAndPounds,
  formatWeight,
  formatWeightRate,
  getWeightFormula,
  parseWeightInput,
} from "./weight";

describe("weight conversion", () => {
  it("converts the primary units with the international avoirdupois pound", () => {
    expect(convertWeight(1, "lb", "kg")).toBe(0.45359237);
    expect(convertWeight(1, "kg", "lb")).toBeCloseTo(2.2046226218487757, 12);
    expect(convertWeight(100, "kg", "lb")).toBeCloseTo(220.46226218487757, 10);
  });

  it("converts secondary units", () => {
    expect(convertWeight(1000, "g", "kg")).toBe(1);
    expect(convertWeight(16, "oz", "lb")).toBeCloseTo(1, 12);
    expect(convertWeight(14, "lb", "st")).toBeCloseTo(1, 12);
  });

  it("returns every supported unit", () => {
    expect(convertAllWeights(1, "kg")).toEqual(
      expect.objectContaining({
        kg: 1,
        lb: expect.closeTo(2.2046226218487757, 12),
        g: 1000,
        oz: expect.closeTo(35.27396194958041, 12),
        st: expect.closeTo(0.1574730444177697, 12),
      }),
    );
  });

  it("round trips through every unit", () => {
    WEIGHT_UNITS.forEach((from) => {
      WEIGHT_UNITS.forEach((to) => {
        expect(
          convertWeight(convertWeight(37.25, from, to), to, from),
        ).toBeCloseTo(37.25, 10);
      });
    });
  });
});

describe("weight validation", () => {
  it("accepts zero", () => {
    expect(convertWeight(0, "kg", "lb")).toBe(0);
  });

  it("rejects negative and non-finite values", () => {
    expect(() => convertWeight(-1, "kg", "lb")).toThrow(
      "El peso no puede ser negativo.",
    );
    expect(() => convertWeight(Number.POSITIVE_INFINITY, "kg", "lb")).toThrow(
      "número finito",
    );
    expect(() => convertWeight(Number.NaN, "kg", "lb")).toThrow(
      "número finito",
    );
  });
});

describe("weight parsing", () => {
  it("accepts decimal points, comma decimals, spaces, and scientific notation", () => {
    expect(parseWeightInput("70.5")).toEqual({
      ok: true,
      value: 70.5,
      normalized: "70.5",
    });
    expect(parseWeightInput("70,5 kg")).toEqual({
      ok: true,
      value: 70.5,
      normalized: "70.5",
      detectedUnit: "kg",
    });
    expect(parseWeightInput("2 000 g")).toEqual({
      ok: true,
      value: 2000,
      normalized: "2000",
      detectedUnit: "g",
    });
    expect(parseWeightInput("1e9 g")).toEqual({
      ok: true,
      value: 1_000_000_000,
      normalized: "1000000000",
      detectedUnit: "g",
    });
  });

  it("detects symbols and common aliases", () => {
    expect(parseWeightInput("154.32lb")).toEqual({
      ok: true,
      value: 154.32,
      normalized: "154.32",
      detectedUnit: "lb",
    });
    expect(parseWeightInput("23 kilos")).toEqual({
      ok: true,
      value: 23,
      normalized: "23",
      detectedUnit: "kg",
    });
    expect(parseWeightInput("50 libras")).toEqual({
      ok: true,
      value: 50,
      normalized: "50",
      detectedUnit: "lb",
    });
    expect(parseWeightInput("16 onzas")).toEqual({
      ok: true,
      value: 16,
      normalized: "16",
      detectedUnit: "oz",
    });
  });

  it("applies the documented separator rules", () => {
    expect(parseWeightInput("1,000 g")).toEqual({
      ok: true,
      value: 1000,
      normalized: "1000",
      detectedUnit: "g",
    });
    expect(parseWeightInput("1.000 kg")).toEqual({
      ok: true,
      value: 1,
      normalized: "1",
      detectedUnit: "kg",
    });
    expect(parseWeightInput("1,000.5 lb")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.5",
      detectedUnit: "lb",
    });
    expect(parseWeightInput("1.000,5 lb")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.5",
      detectedUnit: "lb",
    });
    expect(parseWeightInput("1 000,5 lb")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.5",
      detectedUnit: "lb",
    });
    expect(parseWeightInput("1,000,000 g")).toEqual({
      ok: true,
      value: 1_000_000,
      normalized: "1000000",
      detectedUnit: "g",
    });
  });

  it("distinguishes empty, incomplete, and invalid values", () => {
    expect(parseWeightInput("")).toEqual({ ok: false, error: "empty" });
    expect(parseWeightInput(".")).toEqual({
      ok: false,
      error: "incomplete",
    });
    expect(parseWeightInput("70,")).toEqual({
      ok: false,
      error: "incomplete",
    });
    expect(parseWeightInput("1e")).toEqual({
      ok: false,
      error: "incomplete",
    });
    expect(parseWeightInput("12 34 kg")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseWeightInput("70 widgets")).toEqual({
      ok: false,
      error: "invalid",
    });
  });
});

describe("weight formulas and formatting", () => {
  it("builds explanations for primary directions", () => {
    expect(getWeightFormula("kg", "lb")).toBe("lb = kg ÷ 0.45359237");
    expect(getWeightFormula("lb", "kg")).toBe("kg = lb × 0.45359237");
    expect(buildWeightExplanation(70, "kg", "lb")).toEqual({
      formula: "lb = kg ÷ 0.45359237",
      substitution: "lb = 70 ÷ 0.45359237",
      result: "154.32 lb",
      steps: [
        "Usamos la fórmula: lb = kg ÷ 0.45359237.",
        "Sustituimos el valor: lb = 70 ÷ 0.45359237.",
        "Resultado: 154.32 lb aproximadamente.",
      ],
    });
  });

  it("uses adaptive precision and readable formatting", () => {
    expect(formatWeight(70, "kg")).toBe("70 kg");
    expect(formatWeight(1, "g")).toBe("1 g");
    expect(formatWeight(0.001, "kg")).toBe("0.001 kg");
    expect(formatWeight(0.00028349523125, "kg")).toBe("0.00028 kg");
    expect(formatWeight(1000, "kg")).toBe("1,000 kg");
    expect(formatWeight(1e13, "g")).toBe("1.00e+13 g");
  });

  it("formats verification rates and mixed-unit context", () => {
    expect(formatWeightRate("kg", "lb", 5)).toBe("1 kg = 2.20462 lb");
    expect(formatWeightRate("lb", "kg", 8)).toBe("1 lb = 0.45359237 kg");
    expect(formatPoundsAndOunces(154.32)).toBe("154 lb 5.12 oz");
    expect(formatStoneAndPounds(11.02)).toBe("11 st 0.28 lb");
  });
});
