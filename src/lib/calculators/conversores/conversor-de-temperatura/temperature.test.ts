import { describe, expect, it } from "vitest";
import {
  buildTemperatureExplanation,
  convertAllTemperatures,
  convertTemperature,
  convertTemperatureDifference,
  formatTemperature,
  getTemperatureFormula,
  parseTemperatureInput,
} from "./temperature";

describe("temperature conversion", () => {
  it("converts common Celsius reference points", () => {
    expect(convertTemperature(0, "c", "f")).toBeCloseTo(32);
    expect(convertTemperature(0, "c", "k")).toBeCloseTo(273.15);
    expect(convertTemperature(100, "c", "f")).toBeCloseTo(212);
    expect(convertTemperature(100, "c", "k")).toBeCloseTo(373.15);
  });

  it("converts absolute zero without floating point drift", () => {
    expect(convertTemperature(-273.15, "c", "k")).toBe(0);
    expect(convertTemperature(0, "k", "c")).toBeCloseTo(-273.15);
    expect(convertTemperature(0, "k", "f")).toBeCloseTo(-459.67);
  });

  it("converts Rankine and Réaumur", () => {
    expect(convertTemperature(273.15, "k", "r")).toBeCloseTo(491.67);
    expect(convertTemperature(80, "re", "c")).toBeCloseTo(100);
    expect(convertTemperature(212, "f", "re")).toBeCloseTo(80);
  });

  it("returns all supported scales", () => {
    expect(convertAllTemperatures(37, "c")).toEqual(
      expect.objectContaining({
        c: expect.closeTo(37),
        f: expect.closeTo(98.6),
        k: expect.closeTo(310.15),
        r: expect.closeTo(558.27),
        re: expect.closeTo(29.6),
      }),
    );
  });

  it("round trips through every scale", () => {
    const scales = ["c", "f", "k", "r", "re"] as const;

    scales.forEach((from) => {
      scales.forEach((to) => {
        expect(
          convertTemperature(convertTemperature(37.25, from, to), to, from),
        ).toBeCloseTo(37.25, 10);
      });
    });
  });
});

describe("temperature validation", () => {
  it("rejects values below absolute zero from every scale", () => {
    expect(() => convertTemperature(-273.16, "c", "f")).toThrow(
      "inferior al cero absoluto",
    );
    expect(() => convertTemperature(-1, "k", "c")).toThrow(
      "inferior al cero absoluto",
    );
    expect(() => convertTemperature(-459.68, "f", "c")).toThrow(
      "inferior al cero absoluto",
    );
    expect(() => convertTemperature(-0.01, "r", "c")).toThrow(
      "inferior al cero absoluto",
    );
  });

  it("rejects non-finite values", () => {
    expect(() => convertTemperature(Number.POSITIVE_INFINITY, "c", "f")).toThrow(
      "número finito",
    );
  });
});

describe("temperature parsing", () => {
  it("accepts decimal points, comma decimals, and negatives", () => {
    expect(parseTemperatureInput("36.5")).toEqual({
      ok: true,
      value: 36.5,
      normalized: "36.5",
    });
    expect(parseTemperatureInput("36,5")).toEqual({
      ok: true,
      value: 36.5,
      normalized: "36.5",
    });
    expect(parseTemperatureInput("−40")).toEqual({
      ok: true,
      value: -40,
      normalized: "-40",
    });
  });

  it("detects unambiguous pasted units", () => {
    expect(parseTemperatureInput("37°C")).toEqual({
      ok: true,
      value: 37,
      normalized: "37",
      detectedScale: "c",
    });
    expect(parseTemperatureInput("98.6 °F")).toEqual({
      ok: true,
      value: 98.6,
      normalized: "98.6",
      detectedScale: "f",
    });
    expect(parseTemperatureInput("273.15 K")).toEqual({
      ok: true,
      value: 273.15,
      normalized: "273.15",
      detectedScale: "k",
    });
    expect(parseTemperatureInput("80 °Ré")).toEqual({
      ok: true,
      value: 80,
      normalized: "80",
      detectedScale: "re",
    });
  });

  it("does not infer ambiguous Rankine suffixes", () => {
    expect(parseTemperatureInput("491.67 °R")).toEqual({
      ok: true,
      value: 491.67,
      normalized: "491.67",
    });
  });

  it("distinguishes empty, incomplete, and invalid values", () => {
    expect(parseTemperatureInput("")).toEqual({
      ok: false,
      error: "empty",
    });
    expect(parseTemperatureInput("-")).toEqual({
      ok: false,
      error: "incomplete",
    });
    expect(parseTemperatureInput("36 grados")).toEqual({
      ok: false,
      error: "invalid",
    });
  });
});

describe("temperature differences", () => {
  it("converts differences without applying point offsets", () => {
    expect(convertTemperatureDifference(10, "c", "f")).toBeCloseTo(18);
    expect(convertTemperatureDifference(10, "c", "k")).toBeCloseTo(10);
    expect(convertTemperatureDifference(18, "f", "c")).toBeCloseTo(10);
  });
});

describe("temperature formulas and formatting", () => {
  it("builds an explanation for Celsius to Fahrenheit", () => {
    expect(getTemperatureFormula("c", "f")).toBe("°F = (°C × 9 / 5) + 32");
    expect(buildTemperatureExplanation(37, "c", "f", 1)).toEqual({
      formula: "°F = (°C × 9 / 5) + 32",
      substitution: "°F = (37 × 9 / 5) + 32",
      result: "98.6 °F",
      steps: [
        "Usamos la fórmula: °F = (°C × 9 / 5) + 32.",
        "Sustituimos el valor: °F = (37 × 9 / 5) + 32.",
        "Resultado: 98.6 °F.",
      ],
    });
  });

  it("does not replace the Réaumur output symbol in Rankine explanations", () => {
    expect(buildTemperatureExplanation(491.67, "r", "re", 2).substitution).toBe(
      "°Ré = ((491.67 × 5 / 9) - 273.15) × 4 / 5",
    );
  });

  it("formats units and large values", () => {
    expect(formatTemperature(98.6, "f", 2)).toBe("98.6 °F");
    expect(formatTemperature(273.15, "k", 2)).toBe("273.15 K");
    expect(formatTemperature(1_000_000, "c", 2)).toBe("1.00e+6 °C");
  });
});
