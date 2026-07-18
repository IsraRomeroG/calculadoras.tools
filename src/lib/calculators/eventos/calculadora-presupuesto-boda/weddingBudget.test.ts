import { describe, expect, it } from "vitest";
import {
  buildWeddingCsv,
  buildWeddingShareText,
  calculateWeddingBudget,
  createWeddingTemplateItems,
  parseWeddingNumberInput,
  type WeddingBudgetInput,
} from "./weddingBudget";

const baseInput: WeddingBudgetInput = {
  guestCount: 120,
  availableBudget: 400_000,
  guestsPerTable: 10,
  contingencyPercentage: 10,
  items: [
    {
      id: "venue",
      name: "Lugar",
      category: "lugar",
      calculationType: "fijo",
      fixedAmount: 80_000,
      deposit: 20_000,
    },
    {
      id: "banquet",
      name: "Banquete",
      category: "banquete",
      calculationType: "por_invitado",
      unitCost: 900,
      deposit: 30_000,
    },
    {
      id: "centerpieces",
      name: "Centros de mesa",
      category: "decoracion",
      calculationType: "por_mesa",
      unitCost: 1_200,
      deposit: 0,
    },
    {
      id: "favors",
      name: "Recuerdos",
      category: "regalos",
      calculationType: "cantidad_x_unitario",
      quantity: 120,
      unitCost: 45,
      deposit: 0,
    },
  ],
};

describe("wedding budget formulas", () => {
  it("calculates fixed, guest, table and unit costs", () => {
    const result = calculateWeddingBudget(baseInput);

    expect(result.items.find((item) => item.id === "venue")?.cost).toBe(80_000);
    expect(result.items.find((item) => item.id === "banquet")?.cost).toBe(
      108_000,
    );
    expect(
      result.items.find((item) => item.id === "centerpieces")?.cost,
    ).toBe(14_400);
    expect(result.items.find((item) => item.id === "favors")?.cost).toBe(5_400);
    expect(result.subtotal).toBe(207_800);
  });

  it("adds contingency and divides total by guests", () => {
    const result = calculateWeddingBudget(baseInput);

    expect(result.contingencyAmount).toBe(20_780);
    expect(result.total).toBe(228_580);
    expect(result.costPerGuest).toBeCloseTo(1_904.8333);
  });

  it("compares against budget without dividing by zero for a zero budget", () => {
    const result = calculateWeddingBudget({
      ...baseInput,
      availableBudget: 0,
    });

    expect(result.budgetDifference).toBe(-228_580);
    expect(result.budgetUsedPercentage).toBeUndefined();
    expect(result.budgetPerGuest).toBe(0);
  });

  it("omits budget metrics when budget is empty", () => {
    const { availableBudget: _budget, ...input } = baseInput;
    const result = calculateWeddingBudget(input);

    expect(result.availableBudget).toBeUndefined();
    expect(result.budgetDifference).toBeUndefined();
    expect(result.budgetUsedPercentage).toBeUndefined();
  });

  it("separates captured, applied and surplus deposits", () => {
    const result = calculateWeddingBudget({
      ...baseInput,
      items: [
        {
          id: "music",
          name: "Música",
          category: "musica",
          calculationType: "fijo",
          fixedAmount: 12_000,
          deposit: 15_000,
        },
      ],
    });

    expect(result.paidCaptured).toBe(15_000);
    expect(result.paidApplied).toBe(12_000);
    expect(result.depositSurplus).toBe(3_000);
    expect(result.itemBalance).toBe(0);
    expect(result.pendingTotalEstimated).toBe(1_200);
    expect(result.warnings[0]).toContain("supera su costo");
  });

  it("keeps item balance separate from contingency", () => {
    const result = calculateWeddingBudget({
      ...baseInput,
      contingencyPercentage: 10,
      items: [
        {
          id: "photo",
          name: "Fotografía",
          category: "foto_video",
          calculationType: "fijo",
          fixedAmount: 20_000,
          deposit: 20_000,
        },
      ],
    });

    expect(result.itemBalance).toBe(0);
    expect(result.contingencyReserved).toBe(2_000);
    expect(result.pendingTotalEstimated).toBe(2_000);
  });

  it("uses manual tables when provided", () => {
    const result = calculateWeddingBudget({
      ...baseInput,
      guestCount: 95,
      guestsPerTable: 10,
      items: [
        {
          id: "tables",
          name: "Centros de mesa",
          category: "decoracion",
          calculationType: "por_mesa",
          unitCost: 1_000,
          manualTables: 8,
          deposit: 0,
        },
      ],
    });

    expect(result.items[0].tablesUsed).toBe(8);
    expect(result.items[0].cost).toBe(8_000);
  });

  it("returns category breakdown and top items", () => {
    const result = calculateWeddingBudget(baseInput);

    expect(result.categoryBreakdown[0]).toMatchObject({
      category: "banquete",
      subtotal: 108_000,
    });
    expect(result.topItems.map((item) => item.id)).toEqual([
      "banquet",
      "venue",
      "centerpieces",
    ]);
  });

  it("rejects invalid guests and percentages", () => {
    expect(() =>
      calculateWeddingBudget({
        ...baseInput,
        guestCount: 0,
      }),
    ).toThrow(/invitados/i);

    expect(() =>
      calculateWeddingBudget({
        ...baseInput,
        contingencyPercentage: 101,
      }),
    ).toThrow(/contingencia/i);
  });
});

describe("wedding templates, parsing and exports", () => {
  it("creates independent template items without prices", () => {
    const first = createWeddingTemplateItems("complete");
    const second = createWeddingTemplateItems("complete");

    expect(first.length).toBeGreaterThan(10);
    expect(first[0]).not.toHaveProperty("unitCost");
    first[0].name = "Cambiado";
    expect(second[0].name).not.toBe("Cambiado");
  });

  it("accepts currency and common Mexico number formats", () => {
    expect(parseWeddingNumberInput("$400,000")).toEqual({
      ok: true,
      value: 400_000,
      normalized: "400000",
    });
    expect(parseWeddingNumberInput("400,000.50")).toEqual({
      ok: true,
      value: 400_000.5,
      normalized: "400000.50",
    });
    expect(parseWeddingNumberInput("12,5")).toEqual({
      ok: true,
      value: 12.5,
      normalized: "12.5",
    });
  });

  it("distinguishes empty, negative and invalid values", () => {
    expect(parseWeddingNumberInput("")).toEqual({
      ok: false,
      error: "required",
    });
    expect(parseWeddingNumberInput("-1")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseWeddingNumberInput("doce")).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("builds a useful summary and CSV without currency symbols", () => {
    const input = {
      ...baseInput,
      items: [
        {
          ...baseInput.items[0],
          name: 'Lugar, jardín "Norte"',
          responsible: "Ana",
          notes: "Apartado sábado",
        },
      ],
    };
    const result = calculateWeddingBudget(input);
    const shareText = buildWeddingShareText(result, input);
    const csv = buildWeddingCsv(result, input);

    expect(shareText).toContain("Total estimado");
    expect(shareText).toContain("Costo por invitado");
    expect(csv).toContain('"Lugar, jardín ""Norte"""');
    expect(csv).toContain("80000");
    expect(csv).not.toContain("$80,000");
  });
});
