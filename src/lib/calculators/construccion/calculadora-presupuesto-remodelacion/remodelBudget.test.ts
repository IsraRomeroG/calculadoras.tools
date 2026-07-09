import { describe, expect, it } from "vitest";
import {
  buildRemodelCsv,
  buildRemodelShareText,
  calculateRemodelBudget,
  createRemodelTemplateItems,
  parseRemodelNumberInput,
  type RemodelBudgetInput,
} from "./remodelBudget";

const baseInput: RemodelBudgetInput = {
  availableBudget: 250_000,
  areaM2: 50,
  contingencyPercentage: 15,
  taxMode: "costos_finales",
  taxPercentage: 16,
  items: [
    {
      id: "materials",
      name: "Materiales",
      zone: "Cocina",
      type: "material",
      quantity: 10,
      unit: "pieza",
      unitCost: 5_000,
    },
    {
      id: "labor",
      name: "Instalación",
      zone: "Cocina",
      type: "mano_obra",
      quantity: 1,
      unit: "servicio",
      unitCost: 25_000,
    },
    {
      id: "permit",
      name: "Permiso",
      zone: "General",
      type: "permiso",
      quantity: 1,
      unit: "trámite",
      unitCost: 5_000,
    },
  ],
};

describe("remodel budget formulas", () => {
  it("calculates subtotals, contingency and budget metrics", () => {
    const result = calculateRemodelBudget(baseInput);

    expect(result.baseSubtotal).toBe(80_000);
    expect(result.taxAmount).toBe(0);
    expect(result.contingencyAmount).toBe(12_000);
    expect(result.total).toBe(92_000);
    expect(result.budgetDifference).toBe(158_000);
    expect(result.budgetUsedPercentage).toBeCloseTo(36.8);
    expect(result.maximumBaseBudget).toBeCloseTo(217_391.3043);
    expect(result.baseCapacity).toBeCloseTo(137_391.3043);
    expect(result.costPerM2).toBe(1_840);
  });

  it("adds taxes before calculating contingency", () => {
    const result = calculateRemodelBudget({
      ...baseInput,
      contingencyPercentage: 10,
      taxMode: "agregar_impuestos",
      taxPercentage: 16,
    });

    expect(result.taxAmount).toBe(12_800);
    expect(result.subtotalWithTax).toBe(92_800);
    expect(result.contingencyAmount).toBe(9_280);
    expect(result.total).toBe(102_080);
  });

  it("returns all cost types and zone breakdowns", () => {
    const result = calculateRemodelBudget(baseInput);

    expect(result.subtotalsByType).toEqual({
      material: 50_000,
      mano_obra: 25_000,
      permiso: 5_000,
      otro: 0,
    });
    expect(result.subtotalsByZone).toEqual([
      {
        zone: "Cocina",
        subtotal: 75_000,
        percentageOfBase: 93.75,
      },
      {
        zone: "General",
        subtotal: 5_000,
        percentageOfBase: 6.25,
      },
    ]);
    expect(result.topItems.map((item) => item.id)).toEqual([
      "materials",
      "labor",
      "permit",
    ]);
  });

  it("keeps a zero budget comparable without dividing by zero", () => {
    const result = calculateRemodelBudget({
      ...baseInput,
      availableBudget: 0,
    });

    expect(result.budgetDifference).toBe(-92_000);
    expect(result.budgetUsedPercentage).toBeUndefined();
    expect(result.maximumBaseBudget).toBe(0);
    expect(result.baseCapacity).toBe(-80_000);
  });

  it("omits optional budget and area outputs when inputs are empty", () => {
    const { availableBudget: _budget, areaM2: _area, ...input } = baseInput;
    const result = calculateRemodelBudget(input);

    expect(result.budgetDifference).toBeUndefined();
    expect(result.baseCapacity).toBeUndefined();
    expect(result.costPerM2).toBeUndefined();
  });

  it("accepts an explicitly entered zero cost", () => {
    const result = calculateRemodelBudget({
      ...baseInput,
      items: [{ ...baseInput.items[0], unitCost: 0 }],
    });

    expect(result.baseSubtotal).toBe(0);
    expect(result.total).toBe(0);
    expect(result.items[0].percentageOfBase).toBe(0);
  });

  it("rejects invalid quantities and percentages", () => {
    expect(() =>
      calculateRemodelBudget({
        ...baseInput,
        items: [{ ...baseInput.items[0], quantity: 0 }],
      }),
    ).toThrow(/cantidad/i);

    expect(() =>
      calculateRemodelBudget({
        ...baseInput,
        contingencyPercentage: 101,
      }),
    ).toThrow(/contingencia/i);
  });
});

describe("remodel templates, parsing and exports", () => {
  it("creates independent template items without prices", () => {
    const first = createRemodelTemplateItems("bathroom");
    const second = createRemodelTemplateItems("bathroom");

    expect(first.length).toBeGreaterThan(3);
    expect(first[0]).not.toHaveProperty("unitCost");
    first[0].name = "Cambiado";
    expect(second[0].name).not.toBe("Cambiado");
  });

  it("accepts currency and common decimal formats", () => {
    expect(parseRemodelNumberInput("$25,000.50")).toEqual({
      ok: true,
      value: 25_000.5,
      normalized: "25000.50",
    });
    expect(parseRemodelNumberInput("MXN 12.5")).toEqual({
      ok: true,
      value: 12.5,
      normalized: "12.5",
    });
    expect(parseRemodelNumberInput("12,5")).toEqual({
      ok: true,
      value: 12.5,
      normalized: "12.5",
    });
  });

  it("distinguishes empty, negative and invalid values", () => {
    expect(parseRemodelNumberInput("")).toEqual({
      ok: false,
      error: "required",
    });
    expect(parseRemodelNumberInput("-1")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseRemodelNumberInput("doce")).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("builds a useful summary and escapes CSV fields", () => {
    const input = {
      ...baseInput,
      items: [
        {
          ...baseInput.items[0],
          name: 'Piso, modelo "Arena"',
        },
      ],
    };
    const result = calculateRemodelBudget(input);
    const shareText = buildRemodelShareText(result, input);
    const csv = buildRemodelCsv(result, input);

    expect(shareText).toContain("Total estimado");
    expect(shareText).toContain("Costo estimado por m²");
    expect(csv).toContain('"Piso, modelo ""Arena"""');
    expect(csv).toContain("Total estimado");
  });
});
