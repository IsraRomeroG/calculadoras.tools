import { describe, expect, it } from "vitest";
import {
  AREA_UNITS,
  MAX_AREA_INPUT,
  SQUARE_METERS_PER_ACRE,
  SQUARE_METERS_PER_HECTARE,
  SQUARE_METERS_PER_SQUARE_FOOT,
  buildAreaExplanation,
  calculateRectangleArea,
  convertAllAreas,
  convertArea,
  convertLengthToMeters,
  formatArea,
  formatAreaRate,
  getAreaFormula,
  parseAreaInput,
  parseNumericInput,
} from "./area";

describe("area conversion", () => {
  it("uses the expected square meter factors", () => {
    expect(convertArea(1, "ft2", "m2")).toBe(SQUARE_METERS_PER_SQUARE_FOOT);
    expect(convertArea(1, "ha", "m2")).toBe(SQUARE_METERS_PER_HECTARE);
    expect(convertArea(1, "acre", "m2")).toBe(SQUARE_METERS_PER_ACRE);
    expect(convertArea(1, "m2", "ft2")).toBeCloseTo(10.7639104167, 10);
  });

  it("returns all supported area units from one input", () => {
    expect(convertAllAreas(1, "ha")).toEqual(
      expect.objectContaining({
        m2: 10_000,
        ft2: expect.closeTo(107_639.10416709722, 9),
        ha: 1,
        acre: expect.closeTo(2.471053814671653, 12),
      }),
    );
  });

  it("round trips without relevant precision loss", () => {
    AREA_UNITS.forEach((from) => {
      AREA_UNITS.forEach((to) => {
        expect(convertArea(convertArea(42.195, from, to), to, from)).toBeCloseTo(
          42.195,
          11,
        );
      });
    });
  });

  it("accepts zero and rejects invalid numeric values", () => {
    expect(convertArea(0, "m2", "ft2")).toBe(0);
    expect(() => convertArea(-1, "m2", "ft2")).toThrow("negativa");
    expect(() => convertArea(Number.NaN, "m2", "ft2")).toThrow(
      "número finito",
    );
    expect(() => convertArea(MAX_AREA_INPUT + 1, "m2", "ft2")).toThrow(
      "no puede superar",
    );
  });
});

describe("area input parsing", () => {
  it("accepts comma decimals, point decimals, grouping, and area aliases", () => {
    expect(parseAreaInput("1,5 ha")).toEqual({
      ok: true,
      value: 1.5,
      normalized: "1.5",
      detectedUnit: "ha",
    });
    expect(parseAreaInput("10.5 m²")).toEqual({
      ok: true,
      value: 10.5,
      normalized: "10.5",
      detectedUnit: "m2",
    });
    expect(parseAreaInput("10,000 ft2")).toEqual({
      ok: true,
      value: 10_000,
      normalized: "10000",
      detectedUnit: "ft2",
      interpretation: "Interpretado como 10000",
    });
    expect(parseAreaInput("2 000 metros cuadrados")).toEqual({
      ok: true,
      value: 2_000,
      normalized: "2000",
      detectedUnit: "m2",
    });
    expect(parseAreaInput("1 acre")).toEqual({
      ok: true,
      value: 1,
      normalized: "1",
      detectedUnit: "acre",
    });
  });

  it("distinguishes empty, incomplete, negative, and invalid values", () => {
    expect(parseAreaInput("")).toEqual({ ok: false, error: "empty" });
    expect(parseAreaInput("12,")).toEqual({
      ok: false,
      error: "incomplete",
    });
    expect(parseAreaInput("-1 ha")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseAreaInput("12 litros")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseAreaInput("1e20 m2")).toEqual({
      ok: false,
      error: "out_of_range",
    });
  });

  it("parses dimension fields without units", () => {
    expect(parseNumericInput("15,25")).toEqual({
      ok: true,
      value: 15.25,
      normalized: "15.25",
    });
    expect(parseNumericInput("10 000")).toEqual({
      ok: true,
      value: 10_000,
      normalized: "10000",
    });
    expect(parseNumericInput("abc")).toEqual({
      ok: false,
      error: "invalid",
    });
  });
});

describe("rectangle area calculation", () => {
  it("calculates square meters from metric dimensions", () => {
    expect(calculateRectangleArea(20, 15, "m")).toBe(300);
  });

  it("calculates square meters from feet dimensions", () => {
    expect(calculateRectangleArea(10, 10, "ft")).toBeCloseTo(9.290304, 12);
  });

  it("converts linear feet to meters exactly", () => {
    expect(convertLengthToMeters(1, "ft")).toBe(0.3048);
  });
});

describe("area formulas and formatting", () => {
  it("builds formulas for direct and base conversions", () => {
    expect(getAreaFormula("ha", "m2")).toBe("m² = ha × 10000");
    expect(getAreaFormula("m2", "ft2")).toBe("ft² = m² ÷ 0.09290304");
    expect(getAreaFormula("acre", "ha")).toBe(
      "ha = acre × 4046.8564224 ÷ 10000",
    );
  });

  it("builds an explanation with the substituted value", () => {
    expect(buildAreaExplanation(1, "ha", "acre", 4)).toEqual({
      formula: "acre = ha × 10000 ÷ 4046.8564224",
      substitution: "1 × 10000 ÷ 4046.8564224 = 2.4711 acre",
      result: "2.4711 acre",
      steps: [
        "Usamos la fórmula: acre = ha × 10000 ÷ 4046.8564224.",
        "Sustituimos el valor: 1 × 10000 ÷ 4046.8564224 = 2.4711 acre.",
        "Resultado: 2.4711 acre.",
      ],
    });
  });

  it("formats visible decimals without changing internal precision", () => {
    const acres = convertArea(1, "ha", "acre");

    expect(formatArea(acres, "acre", 0)).toBe("2 acre");
    expect(formatArea(acres, "acre", 2)).toBe("2.47 acre");
    expect(formatArea(acres, "acre", 4)).toBe("2.4711 acre");
    expect(formatArea(acres, "acre", 8)).toBe("2.47105381 acre");
    expect(convertArea(acres, "acre", "ha")).toBeCloseTo(1, 12);
  });

  it("uses scientific notation only for extreme visible values", () => {
    expect(formatArea(1e13, "m2", 4)).toBe("1.0000e+13 m²");
    expect(formatArea(0.0000000002, "m2", 4)).toBe("2.0000e-10 m²");
  });

  it("formats reference rates", () => {
    expect(formatAreaRate("ha", "m2", 4)).toBe("1 ha = 10,000 m²");
    expect(formatAreaRate("acre", "ha", 4)).toBe("1 acre = 0.4047 ha");
  });
});
