import { describe, expect, it } from "vitest";
import {
  buildPaintShareText,
  buildPaintShareUrl,
  calculateCeilingArea,
  calculateManualPaintArea,
  calculateNetPaintArea,
  calculateOpeningArea,
  calculatePaintContainers,
  calculatePaintLiters,
  calculateRoomPaintArea,
  calculateWallArea,
  parseMeasurementInput,
  parseOpeningMeasurementInput,
} from "./paintArea";

describe("paint area formulas", () => {
  it("calculates wall and ceiling area for a rectangular room", () => {
    expect(calculateWallArea(5, 4, 3)).toBe(54);
    expect(calculateCeilingArea(5, 4)).toBe(20);
  });

  it("subtracts openings from walls only", () => {
    const result = calculateRoomPaintArea({
      length: 5,
      width: 4,
      height: 3,
      paintWalls: true,
      paintCeiling: false,
      doorArea: 2,
      windowArea: 4,
    });

    expect(result.wallArea).toBe(54);
    expect(result.openingArea).toBe(6);
    expect(result.netWallArea).toBe(48);
    expect(result.netArea).toBe(48);
  });

  it("keeps the ceiling complete when walls and ceiling are selected", () => {
    const result = calculateRoomPaintArea({
      length: 5,
      width: 4,
      height: 3,
      paintWalls: true,
      paintCeiling: true,
      doorArea: 2,
      windowArea: 4,
    });

    expect(result.netWallArea).toBe(48);
    expect(result.netCeilingArea).toBe(20);
    expect(result.netArea).toBe(68);
  });

  it("does not subtract openings when painting only the ceiling", () => {
    const result = calculateRoomPaintArea({
      length: 5,
      width: 4,
      height: 3,
      paintWalls: false,
      paintCeiling: true,
      doorArea: 6,
      windowArea: 6,
    });

    expect(result.netWallArea).toBe(0);
    expect(result.netCeilingArea).toBe(20);
    expect(result.netArea).toBe(20);
  });

  it("calculates manual area with optional openings", () => {
    expect(calculateManualPaintArea(50, 5)).toBe(45);
  });

  it("estimates liters with coats, coverage and margin", () => {
    const result = calculatePaintLiters(48, 2, 10, 10);

    expect(result.accumulatedArea).toBe(96);
    expect(result.litersBase).toBe(9.6);
    expect(result.litersWithMargin).toBeCloseTo(10.56);
  });

  it("rounds containers up at the end and calculates surplus", () => {
    const result = calculatePaintContainers(10.56, 4);

    expect(result.containers).toBe(3);
    expect(result.litersBought).toBe(12);
    expect(result.litersSurplus).toBeCloseTo(1.44);
  });

  it("normalizes opening measurements in centimeters", () => {
    const area = calculateOpeningArea([
      { quantity: 1, width: 90, height: 210, unit: "cm" },
    ]);

    expect(area).toBeCloseTo(1.89);
  });

  it("rejects invalid area, opening and coat values", () => {
    expect(() => calculateNetPaintArea(54, 20, 54, true, false)).toThrow(
      "aberturas",
    );
    expect(() => calculatePaintLiters(48, 1.5, 10, 10)).toThrow("manos");
    expect(() => calculatePaintLiters(48, 0, 10, 10)).toThrow("manos");
    expect(() => calculatePaintLiters(48, 2, Number.NaN, 10)).toThrow(
      "rendimiento",
    );
    expect(() =>
      calculatePaintLiters(Number.POSITIVE_INFINITY, 2, 10, 10),
    ).toThrow("area neta");
  });
});

describe("paint parsing and sharing", () => {
  it("accepts point or comma decimal values", () => {
    expect(parseMeasurementInput("12.5")).toEqual({
      ok: true,
      value: 12.5,
      normalized: "12.5",
    });
    expect(parseMeasurementInput("12,5")).toEqual({
      ok: true,
      value: 12.5,
      normalized: "12.5",
    });
  });

  it("parses opening suffix units", () => {
    expect(parseOpeningMeasurementInput("90 cm")).toEqual({
      ok: true,
      value: 90,
      normalized: "90",
      unit: "cm",
    });
    expect(parseOpeningMeasurementInput("0.90 m")).toEqual({
      ok: true,
      value: 0.9,
      normalized: "0.90",
      unit: "m",
    });
  });

  it("rejects invalid decimal values", () => {
    expect(parseMeasurementInput("")).toEqual({ ok: false, error: "required" });
    expect(parseMeasurementInput("-1")).toEqual({ ok: false, error: "negative" });
    expect(parseMeasurementInput("abc")).toEqual({ ok: false, error: "invalid" });
  });

  it("builds share URLs with valid paint parameters", () => {
    expect(
      buildPaintShareUrl({
        mode: "habitacion",
        length: 5,
        width: 4,
        height: 3,
        paintWalls: true,
        paintCeiling: false,
        doorArea: 2,
        windowArea: 4,
        coats: 2,
        coverage: 10,
        marginPercentage: 10,
        containerSize: 4,
      }),
    ).toBe(
      "/construccion/metros-cuadrados-de-pintura?modo=habitacion&largo=5&ancho=4&altura=3&puertas=2&ventanas=4&manos=2&rendimiento=10&margen=10&envase=4&paredes=1&techo=0",
    );
  });

  it("builds copyable share text", () => {
    const liters = calculatePaintLiters(48, 2, 10, 10);
    const containers = calculatePaintContainers(liters.litersWithMargin, 4);
    const text = buildPaintShareText({
      netArea: liters.netArea,
      coats: liters.coats,
      accumulatedArea: liters.accumulatedArea,
      coverage: liters.coverage,
      litersBase: liters.litersBase,
      marginPercentage: liters.marginPercentage,
      litersWithMargin: liters.litersWithMargin,
      wallArea: 54,
      openingArea: 6,
      containers,
    });

    expect(text).toContain("Superficie neta: 48.00 m²");
    expect(text).toContain("Compra estimada: 3 envases de 4 l");
  });
});
