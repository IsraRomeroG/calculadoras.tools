import { describe, expect, it } from "vitest";
import {
  buildEventCostCsv,
  buildEventCostShareText,
  calculateEventCost,
  formatEventCostCurrency,
  parseEventCostNumberInput,
  type EventCostInput,
} from "./eventCost";

const baseInput: EventCostInput = {
  mode: "costo_por_persona",
  eventName: "Cena de fin de curso",
  eventType: "cena",
  guestCount: 100,
  availableBudget: 130_000,
  contingencyPercentage: 0,
  roundingIncrement: 50,
  items: [
    {
      id: "venue",
      type: "fijo",
      name: "Salon",
      category: "lugar",
      amount: 50_000,
    },
    {
      id: "menu",
      type: "por_invitado",
      name: "Menu",
      category: "comida",
      amount: 700,
    },
  ],
};

describe("event cost formulas", () => {
  it("calculates total and cost per person for the main example", () => {
    const result = calculateEventCost(baseInput);

    expect(result.fixedTotal).toBe(50_000);
    expect(result.variableUnitCost).toBe(700);
    expect(result.variableTotal).toBe(70_000);
    expect(result.subtotal).toBe(120_000);
    expect(result.total).toBe(120_000);
    expect(result.costPerPerson).toBe(1_200);
  });

  it("applies contingency to subtotal", () => {
    const result = calculateEventCost({
      ...baseInput,
      contingencyPercentage: 10,
    });

    expect(result.contingencyAmount).toBe(12_000);
    expect(result.total).toBe(132_000);
    expect(result.costPerPerson).toBe(1_320);
  });

  it("rounds suggested contribution upward and reports surplus", () => {
    const result = calculateEventCost({
      ...baseInput,
      contingencyPercentage: 10,
      roundingIncrement: 50,
    });

    expect(result.suggestedContribution).toBe(1_350);
    expect(result.contributionSurplus).toBe(3_000);
  });

  it("compares against budget and avoids percentage for zero budget", () => {
    const result = calculateEventCost({
      ...baseInput,
      availableBudget: 0,
    });

    expect(result.budgetDifference).toBe(-120_000);
    expect(result.budgetUsedPercentage).toBeUndefined();
  });

  it("calculates possible guests with budget and contingency", () => {
    const result = calculateEventCost({
      ...baseInput,
      mode: "invitados_posibles",
      guestCount: undefined,
      availableBudget: 200_000,
      contingencyPercentage: 10,
    });

    expect(result.possibleGuestState).toBe("calculable");
    expect(result.possibleGuests).toBe(188);
    expect(result.possibleGuestsTotal).toBeCloseTo(199_760);
    expect(result.possibleGuestsBudgetRemaining).toBeCloseTo(240);
  });

  it("returns zero possible guests when budget does not cover fixed costs", () => {
    const result = calculateEventCost({
      ...baseInput,
      mode: "invitados_posibles",
      guestCount: undefined,
      availableBudget: 54_000,
      contingencyPercentage: 10,
    });

    expect(result.possibleGuestState).toBe("budget_below_fixed_costs");
    expect(result.possibleGuests).toBe(0);
    expect(result.possibleGuestsBudgetRemaining).toBe(-1_000);
  });

  it("does not divide by zero when variable cost is zero", () => {
    const result = calculateEventCost({
      mode: "invitados_posibles",
      availableBudget: 60_000,
      contingencyPercentage: 10,
      roundingIncrement: 50,
      items: [
        {
          id: "venue",
          type: "fijo",
          name: "Salon",
          category: "lugar",
          amount: 50_000,
        },
      ],
    });

    expect(result.possibleGuestState).toBe("unlimited_by_variable_cost");
    expect(result.possibleGuests).toBeUndefined();
    expect(result.possibleGuestsBudgetRemaining).toBe(5_000);
  });

  it("builds quick scenarios from base guests", () => {
    const result = calculateEventCost(baseInput);

    expect(result.scenarios.map((scenario) => scenario.guestCount)).toEqual([
      80,
      100,
      120,
    ]);
    expect(result.scenarios[0]).toMatchObject({
      total: 106_000,
      costPerPerson: 1_325,
    });
  });

  it("returns category breakdown and top items", () => {
    const result = calculateEventCost(baseInput);

    expect(result.categoryBreakdown[0]).toMatchObject({
      category: "comida",
      subtotal: 70_000,
    });
    expect(result.topItems.map((item) => item.id)).toEqual(["menu", "venue"]);
  });
});

describe("event cost parsing, formatting and exports", () => {
  it("accepts common Mexico currency formats", () => {
    expect(parseEventCostNumberInput("$400,000")).toEqual({
      ok: true,
      value: 400_000,
      normalized: "400000",
    });
    expect(parseEventCostNumberInput("400,000.50")).toEqual({
      ok: true,
      value: 400_000.5,
      normalized: "400000.50",
    });
    expect(parseEventCostNumberInput("12,5")).toEqual({
      ok: true,
      value: 12.5,
      normalized: "12.5",
    });
  });

  it("distinguishes empty, negative and invalid inputs", () => {
    expect(parseEventCostNumberInput("")).toEqual({
      ok: false,
      error: "required",
    });
    expect(parseEventCostNumberInput("-1")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseEventCostNumberInput("doce")).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("formats currency for MXN", () => {
    expect(formatEventCostCurrency(1200)).toBe("$1,200.00");
  });

  it("builds share text and CSV without currency symbols in numeric cells", () => {
    const input = {
      ...baseInput,
      items: [
        {
          ...baseInput.items[0],
          name: 'Salon, jardin "Norte"',
          notes: "Apartado",
        },
      ],
    };
    const result = calculateEventCost(input);
    const summary = buildEventCostShareText(result, input);
    const csv = buildEventCostCsv(result, input);

    expect(summary).toContain("Costo por persona");
    expect(summary).toContain("Cuota sugerida");
    expect(csv).toContain('"Salon, jardin ""Norte"""');
    expect(csv).toContain("50000");
    expect(csv).not.toContain("$50,000");
  });
});

describe("event cost validation", () => {
  it("allows empty or zero items as an initial estimate state", () => {
    const result = calculateEventCost({
      ...baseInput,
      items: [],
    });

    expect(result.isEmptyEstimate).toBe(true);
    expect(result.total).toBe(0);
    expect(result.costPerPerson).toBe(0);
  });

  it("rejects invalid guests, costs and contingency", () => {
    expect(() =>
      calculateEventCost({
        ...baseInput,
        guestCount: 0,
      }),
    ).toThrow(/invitados/i);

    expect(() =>
      calculateEventCost({
        ...baseInput,
        contingencyPercentage: 101,
      }),
    ).toThrow(/contingencia/i);

    expect(() =>
      calculateEventCost({
        ...baseInput,
        items: [{ ...baseInput.items[0], amount: -1 }],
      }),
    ).toThrow(/mayor o igual que cero/i);
  });

  it("requires positive budget in possible guests mode", () => {
    expect(() =>
      calculateEventCost({
        ...baseInput,
        mode: "invitados_posibles",
        guestCount: undefined,
        availableBudget: 0,
      }),
    ).toThrow(/presupuesto disponible/i);
  });
});
