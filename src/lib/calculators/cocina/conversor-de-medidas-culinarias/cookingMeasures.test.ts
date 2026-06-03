import { describe, expect, it } from "vitest";
import {
  COOKING_MASS_UNITS,
  COOKING_VOLUME_UNITS,
  buildCookingMeasureFormula,
  convertCookingMeasure,
  formatCookingMeasure,
  formatPracticalCookingResult,
  getCookingMeasureDimension,
  parseCookingMeasureInput,
} from "./cookingMeasures";

describe("cooking measure conversion", () => {
  it("converts volume units through milliliters", () => {
    expect(convertCookingMeasure(1, "l", "ml").result).toBe(1000);
    expect(convertCookingMeasure(1, "cup", "ml", "metric").result).toBe(250);
    expect(convertCookingMeasure(1, "cup", "ml", "us").result).toBe(
      236.5882365,
    );
    expect(convertCookingMeasure(1, "tbsp", "ml", "metric").result).toBe(15);
    expect(convertCookingMeasure(1, "tbsp", "ml", "us").result).toBe(
      14.78676478125,
    );
  });

  it("converts mass units through grams", () => {
    expect(convertCookingMeasure(1, "lb", "g").result).toBe(453.59237);
    expect(convertCookingMeasure(1, "oz", "g").result).toBe(28.349523125);
    expect(convertCookingMeasure(1000, "g", "kg").result).toBe(1);
  });

  it("rejects conversions across dimensions", () => {
    expect(() => convertCookingMeasure(1, "cup", "g")).toThrow(
      "ingrediente",
    );
    expect(() => convertCookingMeasure(1, "kg", "ml")).toThrow(
      "ingrediente",
    );
  });

  it("round trips within each dimension", () => {
    COOKING_VOLUME_UNITS.forEach((origin) => {
      COOKING_VOLUME_UNITS.forEach((destination) => {
        const converted = convertCookingMeasure(
          37.25,
          origin,
          destination,
          "metric",
        ).result;

        expect(
          convertCookingMeasure(converted, destination, origin, "metric").result,
        ).toBeCloseTo(37.25, 10);
      });
    });

    COOKING_MASS_UNITS.forEach((origin) => {
      COOKING_MASS_UNITS.forEach((destination) => {
        const converted = convertCookingMeasure(37.25, origin, destination)
          .result;

        expect(
          convertCookingMeasure(converted, destination, origin).result,
        ).toBeCloseTo(37.25, 10);
      });
    });
  });

  it("identifies dimensions", () => {
    expect(getCookingMeasureDimension("ml")).toBe("volume");
    expect(getCookingMeasureDimension("cup")).toBe("volume");
    expect(getCookingMeasureDimension("g")).toBe("mass");
    expect(getCookingMeasureDimension("oz")).toBe("mass");
  });
});

describe("cooking measure parsing", () => {
  it("accepts zero, points, commas, and grouped numbers", () => {
    expect(parseCookingMeasureInput("0")).toEqual({
      ok: true,
      value: 0,
      normalized: "0",
    });
    expect(parseCookingMeasureInput("2.5")).toEqual({
      ok: true,
      value: 2.5,
      normalized: "2.5",
    });
    expect(parseCookingMeasureInput("2,5")).toEqual({
      ok: true,
      value: 2.5,
      normalized: "2.5",
    });
    expect(parseCookingMeasureInput("1.000,5")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.5",
    });
    expect(parseCookingMeasureInput("1,000.5")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.5",
    });
  });

  it("accepts ASCII cooking fractions and mixed numbers", () => {
    expect(parseCookingMeasureInput("1/2")).toEqual({
      ok: true,
      value: 0.5,
      normalized: "0.5",
    });
    expect(parseCookingMeasureInput("3/4")).toEqual({
      ok: true,
      value: 0.75,
      normalized: "0.75",
    });
    expect(parseCookingMeasureInput("1 1/2")).toEqual({
      ok: true,
      value: 1.5,
      normalized: "1.5",
    });
  });

  it("distinguishes incomplete and invalid values", () => {
    expect(parseCookingMeasureInput("")).toEqual({
      ok: false,
      error: "empty",
    });
    expect(parseCookingMeasureInput("2,")).toEqual({
      ok: false,
      error: "incomplete",
    });
    expect(parseCookingMeasureInput("abc")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseCookingMeasureInput("-1")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseCookingMeasureInput("1/0")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseCookingMeasureInput("1 / / 2")).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("reports an interpretation for ambiguous grouping", () => {
    expect(parseCookingMeasureInput("1,000")).toEqual({
      ok: true,
      value: 1000,
      normalized: "1000",
      interpretation: "Interpretado como 1000",
    });
  });
});

describe("cooking measure formatting", () => {
  it("formats system-dependent units explicitly", () => {
    expect(formatCookingMeasure(2, "cup", 2, "metric")).toBe(
      "2 taza metricas",
    );
    expect(formatCookingMeasure(1, "tbsp", 2, "us")).toBe(
      "1 cda estadounidenses",
    );
    expect(formatCookingMeasure(1, "us-fl-oz")).toBe("1 fl oz");
    expect(formatCookingMeasure(1, "oz")).toBe("1 oz");
  });

  it("generates practical cooking results when they are exact", () => {
    expect(formatPracticalCookingResult(500, "ml", "metric")).toBe(
      "2 taza metricas",
    );
    expect(formatPracticalCookingResult(1, "tbsp", "metric")).toBe(
      "3 cdta metricas",
    );
    expect(formatPracticalCookingResult(28.349523125, "g")).toBeUndefined();
  });

  it("builds formula details", () => {
    expect(
      buildCookingMeasureFormula(
        convertCookingMeasure(2, "cup", "ml", "metric"),
      ),
    ).toEqual({
      formula: "resultado = valor x factorOrigen / factorDestino",
      substitution: "resultado = 2 x 250 / 1",
      result: "500 ml",
      steps: [
        "Usamos la formula: resultado = valor x factorOrigen / factorDestino.",
        "Sustituimos: resultado = 2 x 250 / 1.",
        "Resultado: 500 ml.",
      ],
    });
  });
});
