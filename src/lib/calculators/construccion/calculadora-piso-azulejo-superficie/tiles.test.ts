import { describe, expect, it } from "vitest";
import {
  buildTileCsv,
  buildTileShareText,
  calculateTileEstimate,
  parseTileNumberInput,
} from "./tiles";

const baseInput = {
  surfaces: [
    {
      name: "Habitacion",
      mode: "dimensions" as const,
      lengthMeters: 4,
      widthMeters: 5,
      quantity: 1,
    },
  ],
  deductions: [],
  piece: {
    lengthCm: 60,
    widthCm: 60,
  },
  pattern: "straight" as const,
  wastePercentage: 10,
  box: {
    mode: "pieces" as const,
    piecesPerBox: 4,
  },
};

describe("tile estimate formulas", () => {
  it("calculates the MVP example with pieces per box", () => {
    const result = calculateTileEstimate(baseInput);

    expect(result.grossArea).toBeCloseTo(20);
    expect(result.netArea).toBeCloseTo(20);
    expect(result.purchaseArea).toBeCloseTo(22);
    expect(result.pieceArea).toBeCloseTo(0.36);
    expect(result.requiredPieces).toBe(62);
    expect(result.boxes).toBe(16);
    expect(result.purchasedPieces).toBe(64);
    expect(result.purchasedArea).toBeCloseTo(23.04);
    expect(result.surplusPieces).toBe(2);
    expect(result.surplusArea).toBeCloseTo(1.04);
  });

  it("calculates boxes by m2 per box and labels pieces as estimated", () => {
    const result = calculateTileEstimate({
      ...baseInput,
      box: {
        mode: "area",
        areaPerBoxM2: 1.44,
      },
    });

    expect(result.boxes).toBe(16);
    expect(result.purchasedArea).toBeCloseTo(23.04);
    expect(result.estimatedPurchasedPieces).toBe(64);
    expect(result.estimatedSurplusPieces).toBe(2);
  });

  it("supports direct area input", () => {
    const result = calculateTileEstimate({
      ...baseInput,
      surfaces: [
        {
          name: "Plano",
          mode: "area",
          areaM2: 20,
          quantity: 1,
        },
      ],
    });

    expect(result.netArea).toBeCloseTo(20);
    expect(result.requiredPieces).toBe(62);
    expect(result.boxes).toBe(16);
  });

  it("subtracts deductions and calculates optional cost", () => {
    const result = calculateTileEstimate({
      ...baseInput,
      deductions: [
        {
          name: "Isla",
          mode: "dimensions",
          lengthMeters: 1,
          widthMeters: 2,
          quantity: 1,
        },
      ],
      pricePerBox: 580,
    });

    expect(result.deductionArea).toBeCloseTo(2);
    expect(result.netArea).toBeCloseTo(18);
    expect(result.requiredPieces).toBe(55);
    expect(result.boxes).toBe(14);
    expect(result.totalCost).toBe(8120);
    expect(result.costPerNetM2).toBeCloseTo(451.1111);
  });

  it("warns when deductions exceed gross area and returns zero purchase", () => {
    const result = calculateTileEstimate({
      ...baseInput,
      deductions: [
        {
          name: "Descuento grande",
          mode: "area",
          areaM2: 25,
          quantity: 1,
        },
      ],
    });

    expect(result.netArea).toBe(0);
    expect(result.requiredPieces).toBe(0);
    expect(result.boxes).toBe(0);
    expect(result.warnings.join(" ")).toContain("descontada");
  });

  it("warns for high waste, tight surplus and impossible area per box", () => {
    const result = calculateTileEstimate({
      ...baseInput,
      wastePercentage: 35,
      box: {
        mode: "area",
        areaPerBoxM2: 0.2,
      },
    });

    expect(result.warnings.join(" ")).toContain("desperdicio");
    expect(result.warnings.join(" ")).toContain("menor que el area de una pieza");
  });

  it("warns when a narrow strip can need more pieces than area math suggests", () => {
    const result = calculateTileEstimate({
      ...baseInput,
      surfaces: [
        {
          name: "Franja",
          mode: "dimensions",
          lengthMeters: 1,
          widthMeters: 0.2,
          quantity: 1,
        },
      ],
      wastePercentage: 0,
    });

    expect(result.requiredPieces).toBe(1);
    expect(result.warnings.join(" ")).toContain("franjas estrechas");
  });
});

describe("tile parsing and exports", () => {
  it("accepts comma and point decimals", () => {
    expect(parseTileNumberInput("12.5")).toEqual({
      ok: true,
      value: 12.5,
      normalized: "12.5",
    });
    expect(parseTileNumberInput("12,5")).toEqual({
      ok: true,
      value: 12.5,
      normalized: "12.5",
    });
  });

  it("rejects invalid numeric values", () => {
    expect(parseTileNumberInput("")).toEqual({
      ok: false,
      error: "required",
    });
    expect(parseTileNumberInput("-1")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseTileNumberInput("abc")).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("builds copyable text and CSV", () => {
    const input = {
      ...baseInput,
      pricePerBox: 580,
    };
    const result = calculateTileEstimate(input);

    expect(buildTileShareText(result, input)).toContain("Cajas a comprar: 16");
    expect(buildTileCsv(result, input)).toContain("area_con_desperdicio_m2");
  });
});
