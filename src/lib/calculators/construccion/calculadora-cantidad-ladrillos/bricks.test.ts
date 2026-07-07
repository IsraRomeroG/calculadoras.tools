import { describe, expect, it } from "vitest";
import {
  buildBrickCsv,
  buildBrickShareText,
  calculateBrickEstimate,
  convertBrickLengthToMeters,
  parseBrickNumberInput,
} from "./bricks";

const baseInput = {
  walls: [
    {
      name: "Muro principal",
      width: { value: 5, unit: "m" as const },
      height: { value: 2.5, unit: "m" as const },
      quantity: 1,
    },
  ],
  openings: [
    {
      name: "Puerta",
      width: { value: 0.9, unit: "m" as const },
      height: { value: 2.1, unit: "m" as const },
      quantity: 1,
    },
  ],
  piece: {
    preset: "red-brick" as const,
    length: { value: 20, unit: "cm" as const },
    height: { value: 10, unit: "cm" as const },
    thickness: { value: 6, unit: "cm" as const },
    horizontalJoint: { value: 1, unit: "cm" as const },
    verticalJoint: { value: 1, unit: "cm" as const },
  },
  wastePercentage: 10,
};

describe("brick estimate formulas", () => {
  it("subtracts openings and rounds pieces up", () => {
    const result = calculateBrickEstimate(baseInput);

    expect(result.wallArea).toBeCloseTo(12.5);
    expect(result.openingArea).toBeCloseTo(1.89);
    expect(result.netArea).toBeCloseTo(10.61);
    expect(result.module.moduleArea).toBeCloseTo(0.0231);
    expect(result.module.piecesPerM2).toBeCloseTo(43.29004329);
    expect(result.netPieces).toBe(460);
    expect(result.purchasePieces).toBe(506);
  });

  it("rounds purchase by packages and calculates cost from rounded pieces", () => {
    const result = calculateBrickEstimate({
      ...baseInput,
      pricePerPiece: 8,
      piecesPerPackage: 100,
    });

    expect(result.packages).toBe(6);
    expect(result.roundedPurchasePieces).toBe(600);
    expect(result.estimatedCost).toBe(4800);
  });

  it("estimates mortar when thickness is present", () => {
    const result = calculateBrickEstimate({
      ...baseInput,
      estimateMortar: true,
      mortarWastePercentage: 10,
    });

    expect(result.mortar?.netVolume).toBeCloseTo(0.0846);
    expect(result.mortar?.purchaseVolume).toBeCloseTo(0.09306);
  });

  it("warns when openings exceed wall area and returns zero pieces", () => {
    const result = calculateBrickEstimate({
      ...baseInput,
      openings: [
        {
          name: "Hueco grande",
          width: { value: 10, unit: "m" },
          height: { value: 3, unit: "m" },
          quantity: 1,
        },
      ],
    });

    expect(result.netArea).toBe(0);
    expect(result.netPieces).toBe(0);
    expect(result.purchasePieces).toBe(0);
    expect(result.warnings.join(" ")).toContain("aberturas");
  });

  it("warns for high waste and oversized joints", () => {
    const result = calculateBrickEstimate({
      ...baseInput,
      wastePercentage: 35,
      piece: {
        ...baseInput.piece,
        horizontalJoint: { value: 3, unit: "cm" },
      },
    });

    expect(result.warnings.join(" ")).toContain("desperdicio");
    expect(result.warnings.join(" ")).toContain("junta");
  });

  it("converts centimeters to meters", () => {
    expect(convertBrickLengthToMeters(100, "cm")).toBe(1);
    expect(convertBrickLengthToMeters(1, "m")).toBe(1);
    expect(convertBrickLengthToMeters(0, "cm", { allowZero: true })).toBe(0);
  });

  it("rejects invalid quantity, waste and mortar thickness values", () => {
    expect(() =>
      calculateBrickEstimate({
        ...baseInput,
        wastePercentage: 101,
      }),
    ).toThrow("desperdicio");

    expect(() =>
      calculateBrickEstimate({
        ...baseInput,
        walls: [{ ...baseInput.walls[0], quantity: 0 }],
      }),
    ).toThrow("cantidad");

    expect(() =>
      calculateBrickEstimate({
        ...baseInput,
        estimateMortar: true,
        piece: {
          ...baseInput.piece,
          thickness: undefined,
        },
      }),
    ).toThrow("espesor");
  });
});

describe("brick parsing and exports", () => {
  it("accepts comma and point decimals", () => {
    expect(parseBrickNumberInput("12.5")).toEqual({
      ok: true,
      value: 12.5,
      normalized: "12.5",
    });
    expect(parseBrickNumberInput("12,5")).toEqual({
      ok: true,
      value: 12.5,
      normalized: "12.5",
    });
  });

  it("rejects invalid numeric values", () => {
    expect(parseBrickNumberInput("")).toEqual({
      ok: false,
      error: "required",
    });
    expect(parseBrickNumberInput("-1")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseBrickNumberInput("abc")).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("builds copyable text and CSV", () => {
    const result = calculateBrickEstimate({
      ...baseInput,
      pricePerPiece: 8,
      piecesPerPackage: 100,
    });

    expect(buildBrickShareText(result, baseInput)).toContain(
      "Piezas a comprar: 506",
    );
    expect(buildBrickCsv(result)).toContain("piezas_a_comprar");
  });
});
