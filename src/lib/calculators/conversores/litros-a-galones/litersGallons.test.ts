import { describe, expect, it } from "vitest";
import {
  IMPERIAL_GALLON_DIFFERENCE_PERCENT,
  LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_US_GALLON,
  MAX_VOLUME_INPUT,
  VOLUME_UNITS,
  buildVolumeExplanation,
  convertAllVolumes,
  convertVolume,
  formatVolume,
  formatVolumeRate,
  getVolumeFormula,
  parseVolumeInput,
} from "./litersGallons";

describe("liters and gallons conversion", () => {
  it("uses the exact US and imperial gallon factors", () => {
    expect(convertVolume(LITERS_PER_US_GALLON, "l", "us_gal")).toBe(1);
    expect(convertVolume(LITERS_PER_IMPERIAL_GALLON, "l", "imp_gal")).toBe(1);
    expect(convertVolume(1, "us_gal", "l")).toBe(LITERS_PER_US_GALLON);
    expect(convertVolume(1, "imp_gal", "l")).toBe(
      LITERS_PER_IMPERIAL_GALLON,
    );
  });

  it("returns all supported units from one input", () => {
    expect(convertAllVolumes(10, "l")).toEqual(
      expect.objectContaining({
        l: 10,
        us_gal: expect.closeTo(2.641720523581484, 14),
        imp_gal: expect.closeTo(2.1996924829908776, 14),
      }),
    );
  });

  it("converts directly between US and imperial gallons", () => {
    expect(convertVolume(10, "us_gal", "imp_gal")).toBeCloseTo(
      8.3267418462899,
      13,
    );
    expect(convertVolume(10, "imp_gal", "us_gal")).toBeCloseTo(
      12.0094992550486,
      13,
    );
  });

  it("reports the gallon size difference", () => {
    expect(IMPERIAL_GALLON_DIFFERENCE_PERCENT).toBeCloseTo(20.0949925505, 10);
  });

  it("round trips without relevant precision loss", () => {
    VOLUME_UNITS.forEach((from) => {
      VOLUME_UNITS.forEach((to) => {
        expect(
          convertVolume(convertVolume(42.195, from, to), to, from),
        ).toBeCloseTo(42.195, 12);
      });
    });
  });

  it("returns the input when both units are equal", () => {
    expect(convertVolume(25, "l", "l")).toBe(25);
    expect(convertVolume(25, "us_gal", "us_gal")).toBe(25);
    expect(convertVolume(25, "imp_gal", "imp_gal")).toBe(25);
  });
});

describe("volume validation", () => {
  it("accepts zero", () => {
    expect(convertVolume(0, "l", "us_gal")).toBe(0);
  });

  it("rejects negative, non-finite, and excessive inputs", () => {
    expect(() => convertVolume(-1, "l", "us_gal")).toThrow(
      "no puede ser negativo",
    );
    expect(() => convertVolume(Number.NaN, "l", "us_gal")).toThrow(
      "número finito",
    );
    expect(() =>
      convertVolume(Number.POSITIVE_INFINITY, "l", "us_gal"),
    ).toThrow("número finito");
    expect(() =>
      convertVolume(MAX_VOLUME_INPUT + 1, "l", "us_gal"),
    ).toThrow("no puede superar");
  });
});

describe("volume parsing", () => {
  it("accepts decimal points, comma decimals, grouping, and exponents", () => {
    expect(parseVolumeInput("10.5")).toEqual({
      ok: true,
      value: 10.5,
      normalized: "10.5",
    });
    expect(parseVolumeInput("10,5 L")).toEqual({
      ok: true,
      value: 10.5,
      normalized: "10.5",
      detectedUnit: "l",
    });
    expect(parseVolumeInput("2 000 litros")).toEqual({
      ok: true,
      value: 2000,
      normalized: "2000",
      detectedUnit: "l",
    });
    expect(parseVolumeInput("1e3 L")).toEqual({
      ok: true,
      value: 1000,
      normalized: "1000",
      detectedUnit: "l",
    });
  });

  it("detects Spanish and English unit aliases", () => {
    expect(parseVolumeInput("5 gal US")).toEqual({
      ok: true,
      value: 5,
      normalized: "5",
      detectedUnit: "us_gal",
    });
    expect(parseVolumeInput("5 galones estadounidenses")).toEqual({
      ok: true,
      value: 5,
      normalized: "5",
      detectedUnit: "us_gal",
    });
    expect(parseVolumeInput("2.5 US gallons")).toEqual({
      ok: true,
      value: 2.5,
      normalized: "2.5",
      detectedUnit: "us_gal",
    });
    expect(parseVolumeInput("5 gal imperial")).toEqual({
      ok: true,
      value: 5,
      normalized: "5",
      detectedUnit: "imp_gal",
    });
    expect(parseVolumeInput("2,5 imperial gallons")).toEqual({
      ok: true,
      value: 2.5,
      normalized: "2.5",
      detectedUnit: "imp_gal",
    });
  });

  it("applies localized separator rules", () => {
    expect(parseVolumeInput("1,000 L")).toEqual({
      ok: true,
      value: 1000,
      normalized: "1000",
      detectedUnit: "l",
      interpretation: "Interpretado como 1000",
    });
    expect(parseVolumeInput("0,001 L")).toEqual({
      ok: true,
      value: 0.001,
      normalized: "0.001",
      detectedUnit: "l",
    });
    expect(parseVolumeInput("1,000.5 gal US")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.5",
      detectedUnit: "us_gal",
    });
    expect(parseVolumeInput("1.000,5 gal imperial")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.5",
      detectedUnit: "imp_gal",
    });
  });

  it("distinguishes ambiguous and invalid unit text", () => {
    expect(parseVolumeInput("5 galones")).toEqual({
      ok: false,
      error: "ambiguous",
    });
    expect(parseVolumeInput("5 gallons")).toEqual({
      ok: false,
      error: "ambiguous",
    });
    expect(parseVolumeInput("5 tazas")).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("distinguishes empty, incomplete, negative, and out-of-range values", () => {
    expect(parseVolumeInput("")).toEqual({ ok: false, error: "empty" });
    expect(parseVolumeInput(".")).toEqual({
      ok: false,
      error: "incomplete",
    });
    expect(parseVolumeInput("12,")).toEqual({
      ok: false,
      error: "incomplete",
    });
    expect(parseVolumeInput("-5 L")).toEqual({
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
  });
});

describe("volume formulas and formatting", () => {
  it("builds formulas for every relevant direction", () => {
    expect(getVolumeFormula("l", "us_gal")).toBe(
      "gal_US = L ÷ 3.785411784",
    );
    expect(getVolumeFormula("l", "imp_gal")).toBe(
      "gal_imperial = L ÷ 4.54609",
    );
    expect(getVolumeFormula("us_gal", "l")).toBe(
      "L = gal_US × 3.785411784",
    );
    expect(getVolumeFormula("imp_gal", "l")).toBe(
      "L = gal_imperial × 4.54609",
    );
  });

  it("builds an explanation with the substituted value", () => {
    expect(buildVolumeExplanation(10, "l", "us_gal")).toEqual({
      formula: "gal_US = L ÷ 3.785411784",
      substitution: "10 ÷ 3.785411784 = 2.6417 gal US",
      result: "2.6417 gal US",
      steps: [
        "Usamos la fórmula: gal_US = L ÷ 3.785411784.",
        "Sustituimos el valor: 10 ÷ 3.785411784 = 2.6417 gal US.",
        "Resultado: 2.6417 gal US.",
      ],
    });
  });

  it("uses automatic and manual precision", () => {
    expect(formatVolume(10, "l")).toBe("10 L");
    expect(formatVolume(2.6417205235, "us_gal")).toBe("2.6417 gal US");
    expect(formatVolume(2.5, "imp_gal", 4)).toBe(
      "2.5000 gal imperial",
    );
    expect(formatVolume(0.0000002, "us_gal")).toBe("0.0000002 gal US");
    expect(formatVolume(1e13, "l")).toBe("1.0000e+13 L");
  });

  it("formats direct reference rates", () => {
    expect(formatVolumeRate("us_gal", "l", 9)).toBe(
      "1 gal US = 3.785411784 L",
    );
    expect(formatVolumeRate("imp_gal", "l", 5)).toBe(
      "1 gal imperial = 4.54609 L",
    );
  });
});
