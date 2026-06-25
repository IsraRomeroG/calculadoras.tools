import { describe, expect, it } from "vitest";
import {
  buildComparisonCopyText,
  buildCopyText,
  buildPropertyComparison,
  calculatePricePerArea,
  convertAreaToM2,
  formatCurrency,
  parseLocalizedNumber,
} from "./pricePerArea";

describe("price per area calculator", () => {
  it("calculates base price per m2 from total price and area", () => {
    const result = calculatePricePerArea({
      mode: "price-per-area",
      totalPrice: 3_000_000,
      area: 120,
      areaUnit: "m2",
    });

    expect(result.basePricePerM2).toBe(25_000);
    expect(result.effectivePricePerM2).toBe(25_000);
    expect(formatCurrency(result.basePricePerM2)).toBe("$25,000.00");
  });

  it("calculates effective price per m2 with additional costs", () => {
    const result = calculatePricePerArea({
      mode: "price-per-area",
      totalPrice: 3_000_000,
      area: 120,
      areaUnit: "m2",
      additionalCosts: 80_000,
    });

    expect(result.effectiveTotal).toBe(3_080_000);
    expect(result.effectivePricePerM2).toBeCloseTo(25_666.6667, 4);
  });

  it("converts supported area units to m2", () => {
    expect(convertAreaToM2(1_000, "ft2")).toBeCloseTo(92.90304, 5);
    expect(convertAreaToM2(1, "ha")).toBe(10_000);
    expect(convertAreaToM2(1, "acre")).toBe(4_046.8564224);
  });

  it("calculates total price from area and price per m2", () => {
    const result = calculatePricePerArea({
      mode: "total-price",
      area: 250,
      areaUnit: "m2",
      pricePerM2: 12_500,
      additionalCosts: 50_000,
    });

    expect(result.totalPrice).toBe(3_125_000);
    expect(result.effectiveTotal).toBe(3_175_000);
    expect(result.basePricePerM2).toBe(12_500);
    expect(result.effectivePricePerM2).toBe(12_700);
  });

  it("validates zero, negative, and missing values", () => {
    expect(() =>
      calculatePricePerArea({
        mode: "price-per-area",
        totalPrice: 3_000_000,
        area: 0,
        areaUnit: "m2",
      }),
    ).toThrow("superficie");
    expect(() =>
      calculatePricePerArea({
        mode: "price-per-area",
        totalPrice: 3_000_000,
        area: 120,
        areaUnit: "m2",
        additionalCosts: -1,
      }),
    ).toThrow("costos adicionales");
    expect(() =>
      calculatePricePerArea({
        mode: "total-price",
        area: 120,
        areaUnit: "m2",
      }),
    ).toThrow("precio por m2");
  });

  it("builds comparisons with normalized units and relative differences", () => {
    const comparison = buildPropertyComparison([
      {
        id: "a",
        name: "Casa A",
        totalPrice: 3_000_000,
        area: 120,
        areaUnit: "m2",
        additionalCosts: 80_000,
      },
      {
        id: "b",
        name: "Casa B",
        totalPrice: 2_800_000,
        area: 1_000,
        areaUnit: "ft2",
      },
    ]);

    const casaA = comparison.items.find((item) => item.id === "a");
    const casaB = comparison.items.find((item) => item.id === "b");

    expect(comparison.cheapest.id).toBe("a");
    expect(casaA?.isCheapest).toBe(true);
    expect(casaB?.differenceAbsolute).toBeGreaterThan(4_000);
    expect(casaB?.differencePercent).toBeGreaterThan(15);
  });

  it("warns when comparison mixes surface types", () => {
    const comparison = buildPropertyComparison([
      {
        name: "Construida",
        totalPrice: 3_000_000,
        area: 120,
        areaUnit: "m2",
        surfaceType: "built",
      },
      {
        name: "Terreno",
        totalPrice: 2_000_000,
        area: 250,
        areaUnit: "m2",
        surfaceType: "land",
      },
    ]);

    expect(comparison.hasMixedSurfaceTypes).toBe(true);
    expect(comparison.warning).toContain("tipos de superficie");
  });

  it("parses localized money and decimal values", () => {
    expect(parseLocalizedNumber("$3,000,000")).toBe(3_000_000);
    expect(parseLocalizedNumber("3 000 000")).toBe(3_000_000);
    expect(parseLocalizedNumber("120.5")).toBe(120.5);
    expect(parseLocalizedNumber("120,5")).toBe(120.5);
    expect(parseLocalizedNumber("MXN 1,234.56")).toBe(1_234.56);
    expect(parseLocalizedNumber("1.234,56")).toBe(1_234.56);
    expect(parseLocalizedNumber("abc")).toBeNull();
  });

  it("builds copy-ready summaries", () => {
    const result = calculatePricePerArea({
      mode: "price-per-area",
      totalPrice: 3_000_000,
      area: 120,
      areaUnit: "m2",
      additionalCosts: 80_000,
    });
    const comparison = buildPropertyComparison([
      { name: "A", totalPrice: 3_000_000, area: 120, areaUnit: "m2" },
      { name: "B", totalPrice: 2_500_000, area: 100, areaUnit: "m2" },
    ]);

    expect(buildCopyText(result)).toContain("Precio efectivo por m2");
    expect(buildComparisonCopyText(comparison)).toContain(
      "Opcion mas barata",
    );
  });
});
