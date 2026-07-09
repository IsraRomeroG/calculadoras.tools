import { describe, expect, it } from "vitest";
import {
  LITERS_PER_IMPERIAL_GALLON as SPECIALIZED_IMPERIAL_GALLON,
  LITERS_PER_US_GALLON as SPECIALIZED_US_GALLON,
} from "../litros-a-galones/litersGallons";
import {
  LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_US_GALLON,
  MAX_GENERAL_VOLUME_INPUT,
  VOLUME_UNIT_GROUPS,
  VOLUME_UNITS,
  buildVolumeExplanation,
  convertAllVolumes,
  convertVolume,
  formatVolume,
  formatVolumeRate,
  getVolumeFormula,
  parseVolumeInput,
} from "./volume";

describe("general volume conversion", () => {
  it("converts metric units through liters", () => {
    expect(convertVolume(1, "l", "ml")).toBe(1_000);
    expect(convertVolume(1, "ml", "cm3")).toBe(1);
    expect(convertVolume(1, "m3", "l")).toBe(1_000);
    expect(convertVolume(1, "m3", "ml")).toBe(1_000_000);
  });

  it("converts US liquid units with exact relationships", () => {
    expect(convertVolume(1, "us_gal", "us_fl_oz")).toBe(128);
    expect(convertVolume(1, "us_gal", "us_pt")).toBe(8);
    expect(convertVolume(1, "us_gal", "us_qt")).toBe(4);
  });

  it("converts imperial liquid units with exact relationships", () => {
    expect(convertVolume(1, "imp_gal", "imp_fl_oz")).toBeCloseTo(160, 12);
    expect(convertVolume(1, "imp_gal", "imp_pt")).toBe(8);
    expect(convertVolume(1, "imp_gal", "imp_qt")).toBe(4);
  });

  it("shares gallon constants with the specialized liters to gallons converter", () => {
    expect(LITERS_PER_US_GALLON).toBe(SPECIALIZED_US_GALLON);
    expect(LITERS_PER_IMPERIAL_GALLON).toBe(SPECIALIZED_IMPERIAL_GALLON);
  });

  it("converts across regional systems", () => {
    expect(convertVolume(32, "us_fl_oz", "l")).toBeCloseTo(0.946352946, 12);
    expect(convertVolume(1, "us_qt", "imp_pt")).toBeCloseTo(
      1.66534836925798,
      12,
    );
  });

  it("round trips all units within a tight tolerance", () => {
    VOLUME_UNITS.forEach((from) => {
      VOLUME_UNITS.forEach((to) => {
        expect(
          convertVolume(convertVolume(42.195, from, to), to, from),
        ).toBeCloseTo(42.195, 11);
      });
    });
  });

  it("returns the input for equal units and zero", () => {
    expect(convertVolume(25, "l", "l")).toBe(25);
    expect(convertVolume(0, "us_gal", "imp_gal")).toBe(0);
    expect(convertAllVolumes(0, "l").ml).toBe(0);
  });

  it("rejects invalid domain values", () => {
    expect(() => convertVolume(-1, "l", "ml")).toThrow("negativo");
    expect(() => convertVolume(Number.NaN, "l", "ml")).toThrow(
      "numero finito",
    );
    expect(() =>
      convertVolume(Number.POSITIVE_INFINITY, "l", "ml"),
    ).toThrow("numero finito");
    expect(() =>
      convertVolume(MAX_GENERAL_VOLUME_INPUT + 1, "l", "ml"),
    ).toThrow("no puede superar");
  });
});

describe("general volume parsing", () => {
  it("accepts localized numbers and valid grouping", () => {
    expect(parseVolumeInput("2,5 L")).toEqual({
      ok: true,
      value: 2.5,
      normalized: "2.5",
      detectedUnit: "l",
    });
    expect(parseVolumeInput("1,000.5 ml")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.5",
      detectedUnit: "ml",
    });
    expect(parseVolumeInput("1.000,5 litros")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.5",
      detectedUnit: "l",
    });
    expect(parseVolumeInput("1 000 cc")).toEqual({
      ok: true,
      value: 1000,
      normalized: "1000",
      detectedUnit: "cm3",
    });
    expect(parseVolumeInput("1e3 L")).toEqual({
      ok: true,
      value: 1000,
      normalized: "1000",
      detectedUnit: "l",
    });
  });

  it("detects metric and regional aliases", () => {
    expect(parseVolumeInput("1000 cm3")).toEqual({
      ok: true,
      value: 1000,
      normalized: "1000",
      detectedUnit: "cm3",
    });
    expect(parseVolumeInput("1.5 m3")).toEqual({
      ok: true,
      value: 1.5,
      normalized: "1.5",
      detectedUnit: "m3",
    });
    expect(parseVolumeInput("32 fl oz US")).toEqual({
      ok: true,
      value: 32,
      normalized: "32",
      detectedUnit: "us_fl_oz",
    });
    expect(parseVolumeInput("US fl oz 32")).toEqual({
      ok: true,
      value: 32,
      normalized: "32",
      detectedUnit: "us_fl_oz",
    });
    expect(parseVolumeInput("2 pt imperial")).toEqual({
      ok: true,
      value: 2,
      normalized: "2",
      detectedUnit: "imp_pt",
    });
    expect(parseVolumeInput("5 galones estadounidenses")).toEqual({
      ok: true,
      value: 5,
      normalized: "5",
      detectedUnit: "us_gal",
    });
  });

  it("reports ambiguous regional units and mass ounces", () => {
    expect(parseVolumeInput("32 fl oz")).toEqual({
      ok: false,
      error: "ambiguous",
    });
    expect(parseVolumeInput("2 pt")).toEqual({
      ok: false,
      error: "ambiguous",
    });
    expect(parseVolumeInput("5 galon")).toEqual({
      ok: false,
      error: "ambiguous",
    });
    expect(parseVolumeInput("12 oz")).toEqual({
      ok: false,
      error: "mass_unit",
    });
  });

  it("rejects malformed values without guessing", () => {
    expect(parseVolumeInput("")).toEqual({ ok: false, error: "empty" });
    expect(parseVolumeInput("12,")).toEqual({
      ok: false,
      error: "incomplete",
    });
    expect(parseVolumeInput("-1 L")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseVolumeInput("1e20 L")).toEqual({
      ok: false,
      error: "out_of_range",
    });
    expect(parseVolumeInput("12 34 L")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseVolumeInput("NaN L")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseVolumeInput("5 tazas")).toEqual({
      ok: false,
      error: "invalid",
    });
  });
});

describe("general volume presentation", () => {
  it("formats automatic and manual precision", () => {
    expect(formatVolume(2, "l")).toBe("2 L");
    expect(formatVolume(2000, "ml")).toBe("2,000 ml");
    expect(formatVolume(0.946352946, "l")).toBe("0.9464 L");
    expect(formatVolume(2.5, "l", 4)).toBe("2.5000 L");
    expect(formatVolume(0.0000002, "l")).toBe("0.0000002 L");
    expect(formatVolume(1e13, "l")).toBe("1.0000e+13 L");
  });

  it("builds direct formulas and substitutions", () => {
    expect(getVolumeFormula("l", "ml")).toBe("ml = L × 1,000");
    expect(getVolumeFormula("m3", "l")).toBe("L = m³ × 1,000");
    expect(getVolumeFormula("us_fl_oz", "l")).toBe(
      "L = fl oz US × 0.0295735295625",
    );
    expect(buildVolumeExplanation(2, "l", "ml")).toEqual({
      formula: "ml = L × 1,000",
      substitution: "2 × 1,000 = 2,000 ml",
      result: "2,000 ml",
      steps: [
        "Usamos la formula: ml = L × 1,000.",
        "Sustituimos el valor: 2 × 1,000 = 2,000 ml.",
        "Resultado: 2,000 ml.",
      ],
    });
  });

  it("formats reference rates and groups supported units", () => {
    expect(formatVolumeRate("l", "ml")).toBe("1 L = 1,000 ml");
    expect(formatVolumeRate("us_fl_oz", "l")).toBe(
      "1 fl oz US = 0.0295735295625 L",
    );
    expect(VOLUME_UNIT_GROUPS.map((group) => group.id)).toEqual([
      "metric",
      "us",
      "imperial",
    ]);
  });
});
