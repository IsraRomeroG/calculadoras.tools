import { describe, expect, it } from "vitest";
import { SAFE_TEMPERATURES } from "./safeTemperatures";
import {
  createOvenTemperatureReading,
  getConvectionSuggestion,
  getOvenEquivalences,
  getOvenRangeWarning,
  getPracticalOvenSetting,
  parseOvenTemperatureInput,
} from "./ovenTemperature";

function reading(rawValue: string, fallbackUnit: "c" | "f" | "gas" | "k" = "c") {
  const parsed = parseOvenTemperatureInput(rawValue);

  if (!parsed.ok) {
    throw new Error(`Entrada invalida: ${rawValue}`);
  }

  return createOvenTemperatureReading(parsed, fallbackUnit);
}

describe("oven temperature conversion", () => {
  it("converts 180 C exactly and suggests the practical oven setting", () => {
    const result = getOvenEquivalences(reading("180 °C"));
    const practical = getPracticalOvenSetting(reading("180 °C"));

    expect(result.fahrenheit).toBe(356);
    expect(practical.fahrenheit).toBe(350);
    expect(practical.gasMark?.mark).toBe("4");
  });

  it("converts 350 F exactly and suggests 180 C / gas 4", () => {
    const result = getOvenEquivalences(reading("350 °F"));
    const practical = getPracticalOvenSetting(reading("350 °F"));

    expect(result.celsius).toBeCloseTo(176.667, 3);
    expect(practical.celsius).toBe(180);
    expect(practical.gasMark?.mark).toBe("4");
  });

  it("uses the local gas mark table in both directions", () => {
    const result = getOvenEquivalences(reading("gas 4"));

    expect(result.celsius).toBe(180);
    expect(result.fahrenheit).toBe(350);
    expect(result.gasMark?.mark).toBe("4");
  });

  it("calculates convection suggestions from practical oven settings", () => {
    expect(getConvectionSuggestion(reading("200 °C")).celsius).toBe(180);
    expect(getConvectionSuggestion(reading("400 °F")).fahrenheit).toBe(375);
  });

  it("supports Kelvin as an advanced unit and rejects impossible temperatures", () => {
    expect(getOvenEquivalences(reading("0 K")).celsius).toBe(-273.15);
    expect(() => reading("-1 K")).toThrow("cero absoluto");
    expect(() => reading("-274 °C")).toThrow("cero absoluto");
    expect(() => reading("-460 °F")).toThrow("cero absoluto");
  });

  it("warns for values outside normal domestic oven range without blocking", () => {
    const result = getOvenEquivalences(reading("32 °F"));

    expect(result.celsius).toBe(0);
    expect(getOvenRangeWarning(reading("32 °F"))).toContain("fuera del rango");
  });
});

describe("oven temperature parsing", () => {
  it("accepts common compact cooking inputs", () => {
    expect(parseOvenTemperatureInput("180c")).toMatchObject({
      ok: true,
      value: 180,
      detectedUnit: "c",
    });
    expect(parseOvenTemperatureInput("350 f")).toMatchObject({
      ok: true,
      value: 350,
      detectedUnit: "f",
    });
    expect(parseOvenTemperatureInput("gas 4")).toMatchObject({
      ok: true,
      gasMark: "4",
      detectedUnit: "gas",
    });
    expect(parseOvenTemperatureInput("mark 6")).toMatchObject({
      ok: true,
      gasMark: "6",
      detectedUnit: "gas",
    });
  });

  it("rejects unsupported gas marks", () => {
    expect(parseOvenTemperatureInput("gas 10")).toEqual({
      ok: false,
      error: "unsupported-gas",
    });
    expect(() => reading("10", "gas")).toThrow("Marca de gas");
  });
});

describe("safe temperature editorial data", () => {
  it("keeps official source metadata with every entry", () => {
    expect(SAFE_TEMPERATURES.length).toBeGreaterThanOrEqual(6);

    SAFE_TEMPERATURES.forEach((entry) => {
      expect(entry.sourceName).toContain("FoodSafety.gov");
      expect(entry.sourceUrl).toContain("foodsafety.gov");
      expect(entry.sourceReviewedAt).toBe("2024-11-21");
      expect(entry.editorialReviewedAt).toBeTruthy();
    });
  });
});
