import { describe, expect, it } from "vitest";
import {
  DISTANCE_UNITS,
  MILES_PER_KILOMETER,
  buildDistanceExplanation,
  convertAllDistances,
  convertDistance,
  formatDistance,
  formatDistanceRate,
  getDistanceFormula,
  parseDistanceInput,
} from "./distance";

describe("distance conversion", () => {
  it("uses the exact international mile factor", () => {
    expect(convertDistance(1, "mi", "km")).toBe(1.609344);
    expect(convertDistance(1, "km", "mi")).toBeCloseTo(
      MILES_PER_KILOMETER,
      15,
    );
    expect(convertDistance(100, "mi", "km")).toBe(160.9344);
  });

  it("returns every supported unit", () => {
    expect(convertAllDistances(10, "km")).toEqual(
      expect.objectContaining({
        km: 10,
        mi: expect.closeTo(6.21371192237334, 12),
      }),
    );
  });

  it("round trips without relevant precision loss", () => {
    DISTANCE_UNITS.forEach((from) => {
      DISTANCE_UNITS.forEach((to) => {
        expect(
          convertDistance(convertDistance(42.195, from, to), to, from),
        ).toBeCloseTo(42.195, 12);
      });
    });
  });

  it("keeps the value when origin and destination are equal", () => {
    expect(convertDistance(25, "km", "km")).toBe(25);
    expect(convertDistance(25, "mi", "mi")).toBe(25);
  });
});

describe("distance validation", () => {
  it("accepts zero", () => {
    expect(convertDistance(0, "km", "mi")).toBe(0);
  });

  it("rejects negative and non-finite values", () => {
    expect(() => convertDistance(-5, "km", "mi")).toThrow(
      "La distancia no puede ser negativa.",
    );
    expect(() =>
      convertDistance(Number.POSITIVE_INFINITY, "km", "mi"),
    ).toThrow("número finito");
    expect(() => convertDistance(Number.NaN, "km", "mi")).toThrow(
      "número finito",
    );
  });
});

describe("distance parsing", () => {
  it("accepts decimal points, comma decimals, spaces, and scientific notation", () => {
    expect(parseDistanceInput("10.5")).toEqual({
      ok: true,
      value: 10.5,
      normalized: "10.5",
    });
    expect(parseDistanceInput("10,5 km")).toEqual({
      ok: true,
      value: 10.5,
      normalized: "10.5",
      detectedUnit: "km",
    });
    expect(parseDistanceInput("2 000 mi")).toEqual({
      ok: true,
      value: 2000,
      normalized: "2000",
      detectedUnit: "mi",
    });
    expect(parseDistanceInput("1e3 km")).toEqual({
      ok: true,
      value: 1000,
      normalized: "1000",
      detectedUnit: "km",
    });
  });

  it("detects symbols and common aliases", () => {
    expect(parseDistanceInput("42.195km")).toEqual({
      ok: true,
      value: 42.195,
      normalized: "42.195",
      detectedUnit: "km",
    });
    expect(parseDistanceInput("15 kilómetros")).toEqual({
      ok: true,
      value: 15,
      normalized: "15",
      detectedUnit: "km",
    });
    expect(parseDistanceInput("15 kilometros")).toEqual({
      ok: true,
      value: 15,
      normalized: "15",
      detectedUnit: "km",
    });
    expect(parseDistanceInput("8 millas")).toEqual({
      ok: true,
      value: 8,
      normalized: "8",
      detectedUnit: "mi",
    });
  });

  it("applies the documented separator rules", () => {
    expect(parseDistanceInput("1,000 km")).toEqual({
      ok: true,
      value: 1000,
      normalized: "1000",
      detectedUnit: "km",
    });
    expect(parseDistanceInput("42.195 km")).toEqual({
      ok: true,
      value: 42.195,
      normalized: "42.195",
      detectedUnit: "km",
    });
    expect(parseDistanceInput("1,000.5 mi")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.5",
      detectedUnit: "mi",
    });
    expect(parseDistanceInput("1.000,5 mi")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.5",
      detectedUnit: "mi",
    });
  });

  it("distinguishes empty, incomplete, invalid, and nautical inputs", () => {
    expect(parseDistanceInput("")).toEqual({ ok: false, error: "empty" });
    expect(parseDistanceInput(".")).toEqual({
      ok: false,
      error: "incomplete",
    });
    expect(parseDistanceInput("12,")).toEqual({
      ok: false,
      error: "incomplete",
    });
    expect(parseDistanceInput("12 34 km")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseDistanceInput("10 yards")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseDistanceInput("5 nmi")).toEqual({
      ok: false,
      error: "nautical",
    });
    expect(parseDistanceInput("5 millas náuticas")).toEqual({
      ok: false,
      error: "nautical",
    });
  });
});

describe("distance formulas and formatting", () => {
  it("builds explanations for primary directions", () => {
    expect(getDistanceFormula("km", "mi")).toBe("mi = km / 1.609344");
    expect(getDistanceFormula("mi", "km")).toBe("km = mi * 1.609344");
    expect(buildDistanceExplanation(10, "km", "mi")).toEqual({
      formula: "mi = km / 1.609344",
      substitution: "mi = 10 / 1.609344",
      result: "6.21 mi",
      steps: [
        "Usamos la fórmula: mi = km / 1.609344.",
        "Sustituimos el valor: mi = 10 / 1.609344.",
        "Resultado: 6.21 mi.",
      ],
    });
  });

  it("uses adaptive precision and readable formatting", () => {
    expect(formatDistance(10, "km")).toBe("10 km");
    expect(formatDistance(10, "mi")).toBe("10 mi");
    expect(formatDistance(42.195, "km", 3)).toBe("42.195 km");
    expect(formatDistance(1000, "km")).toBe("1,000 km");
    expect(formatDistance(0.0000002, "mi", 2)).toBe("0.0000002 mi");
    expect(formatDistance(1e13, "km")).toBe("1.00e+13 km");
  });

  it("formats verification rates", () => {
    expect(formatDistanceRate("km", "mi", 5)).toBe("1 km = 0.62137 mi");
    expect(formatDistanceRate("mi", "km", 6)).toBe("1 mi = 1.609344 km");
  });
});
