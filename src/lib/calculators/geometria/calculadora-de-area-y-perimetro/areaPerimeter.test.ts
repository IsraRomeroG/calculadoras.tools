import { describe, expect, it } from "vitest";
import {
  calculateCircle,
  calculateCircleFromDiameter,
  calculateRectangle,
  calculateRegularPolygon,
  calculateSquare,
  calculateTriangleAreaFromBaseHeight,
  calculateTriangleFromSides,
  formatAreaMeasurement,
  formatLinearMeasurement,
  formatMeasurementAuto,
  getRegularPolygonName,
  parseMeasurement,
  validatePositiveMeasurement,
} from "./areaPerimeter";

describe("area and perimeter formulas", () => {
  it("calculates a square", () => {
    expect(calculateSquare(4)).toEqual({
      area: 16,
      perimeter: 16,
    });
  });

  it("calculates a rectangle", () => {
    expect(calculateRectangle(5, 3)).toEqual({
      area: 15,
      perimeter: 16,
    });
  });

  it("calculates a triangle from three sides using Heron's formula", () => {
    expect(calculateTriangleFromSides(3, 4, 5)).toEqual({
      area: 6,
      perimeter: 12,
    });
  });

  it("rejects an impossible triangle", () => {
    expect(() => calculateTriangleFromSides(1, 2, 3)).toThrow(/dos lados/);
  });

  it("calculates a triangle from base and height without inventing perimeter", () => {
    expect(calculateTriangleAreaFromBaseHeight(8, 3)).toEqual({
      area: 12,
      perimeter: null,
    });
  });

  it("calculates a circle from radius", () => {
    const circle = calculateCircle(2);

    expect(circle.radius).toBe(2);
    expect(circle.area).toBeCloseTo(4 * Math.PI, 12);
    expect(circle.circumference).toBeCloseTo(4 * Math.PI, 12);
  });

  it("normalizes circle diameter to radius", () => {
    expect(calculateCircleFromDiameter(10).radius).toBe(5);
  });

  it("calculates a regular hexagon", () => {
    const hexagon = calculateRegularPolygon(6, 4);

    expect(hexagon.perimeter).toBe(24);
    expect(hexagon.area).toBeCloseTo(41.5692, 4);
    expect(hexagon.apothem).toBeCloseTo(3.4641, 4);
  });

  it("names common regular polygons", () => {
    expect(getRegularPolygonName(6)).toBe("Hexágono regular");
    expect(getRegularPolygonName(7)).toBeUndefined();
  });
});

describe("measurement parsing and validation", () => {
  it("accepts decimal points, comma decimals, and grouping separators", () => {
    expect(parseMeasurement("10")).toEqual({
      ok: true,
      value: 10,
      normalized: "10",
    });
    expect(parseMeasurement("10.5")).toEqual({
      ok: true,
      value: 10.5,
      normalized: "10.5",
    });
    expect(parseMeasurement("10,5")).toEqual({
      ok: true,
      value: 10.5,
      normalized: "10.5",
    });
    expect(parseMeasurement("1,000")).toEqual({
      ok: true,
      value: 1000,
      normalized: "1000",
    });
    expect(parseMeasurement("1.000,5")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.5",
    });
  });

  it("rejects unknown text and unit text in inputs", () => {
    expect(parseMeasurement("10abc")).toEqual({
      ok: false,
      error: "unit",
    });
    expect(parseMeasurement("10 m")).toEqual({
      ok: false,
      error: "unit",
    });
    expect(parseMeasurement("10#")).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("distinguishes empty and incomplete values", () => {
    expect(parseMeasurement("")).toEqual({ ok: false, error: "empty" });
    expect(parseMeasurement(".")).toEqual({
      ok: false,
      error: "incomplete",
    });
    expect(parseMeasurement("12,")).toEqual({
      ok: false,
      error: "incomplete",
    });
  });

  it("validates positive finite measurements", () => {
    expect(validatePositiveMeasurement(5)).toEqual({ ok: true, value: 5 });
    expect(validatePositiveMeasurement(0)).toEqual({
      ok: false,
      error: "non_positive",
    });
    expect(validatePositiveMeasurement(-1)).toEqual({
      ok: false,
      error: "non_positive",
    });
    expect(validatePositiveMeasurement(Number.NaN)).toEqual({
      ok: false,
      error: "non_finite",
    });
    expect(validatePositiveMeasurement(Number.POSITIVE_INFINITY)).toEqual({
      ok: false,
      error: "non_finite",
    });
  });

  it("rejects invalid values in calculations", () => {
    expect(() => calculateSquare(0)).toThrow(/mayor que cero/);
    expect(() => calculateSquare(-2)).toThrow(/mayor que cero/);
    expect(() => calculateSquare(Number.NaN)).toThrow(/finito/);
    expect(() => calculateRegularPolygon(2, 4)).toThrow(/al menos 3/);
    expect(() => calculateRegularPolygon(1001, 4)).toThrow(/1000/);
  });
});

describe("measurement formatting", () => {
  it("formats linear and area units", () => {
    expect(formatLinearMeasurement(16, "m")).toBe("16 m");
    expect(formatAreaMeasurement(15, "m")).toBe("15 m²");
    expect(formatAreaMeasurement(15, "none")).toBe("15 unidades²");
  });

  it("formats automatic decimals without trailing zeroes", () => {
    expect(formatMeasurementAuto(15)).toBe("15");
    expect(formatMeasurementAuto(15.5)).toBe("15.5");
    expect(formatMeasurementAuto(15.567)).toBe("15.57");
    expect(formatAreaMeasurement(41.5692, "cm", 4)).toBe("41.5692 cm²");
  });
});
