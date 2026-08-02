import { describe, expect, it } from "vitest";
import {
  EVENT_COST_CANONICAL_PATH,
  EVENT_COST_CATEGORY_LABELS,
  buildEventCostCsv,
  buildEventCostShareText,
  calculateEventCost,
} from "./calculadora-costo-por-persona-evento/eventCost.en";
import {
  WEDDING_BUDGET_CANONICAL_PATH,
  WEDDING_TEMPLATES,
  buildWeddingCsv,
  buildWeddingShareText,
  calculateWeddingBudget,
  createWeddingTemplateItems,
} from "./calculadora-presupuesto-boda/weddingBudget.en";

describe("English event calculator localization", () => {
  it("localizes the event cost route, labels and exports", () => {
    const input = {
      mode: "costo_por_persona" as const,
      eventName: "Community dinner",
      eventType: "cena" as const,
      guestCount: 20,
      contingencyPercentage: 10,
      roundingIncrement: 10,
      items: [
        {
          id: "venue",
          type: "fijo" as const,
          name: "Venue",
          category: "lugar" as const,
          amount: 1_000,
        },
      ],
    };
    const result = calculateEventCost(input);

    expect(EVENT_COST_CANONICAL_PATH).toBe(
      "/en/events/event-cost-per-person-calculator",
    );
    expect(EVENT_COST_CATEGORY_LABELS.lugar).toBe("Venue");
    expect(result.categoryBreakdown[0]?.label).toBe("Venue");
    expect(buildEventCostShareText(result, input)).toContain(
      "Event cost: Community dinner",
    );
    expect(buildEventCostCsv(result, input)).toContain(
      "item_type,name,category,amount,notes",
    );
  });

  it("localizes the wedding route, templates, warnings and exports", () => {
    const templateItems = createWeddingTemplateItems("essential");
    const input = {
      guestCount: 50,
      guestsPerTable: 10,
      contingencyPercentage: 10,
      items: [
        {
          id: "catering",
          name: "Catering",
          category: "banquete" as const,
          calculationType: "por_invitado" as const,
          unitCost: 100,
          deposit: 6_000,
        },
      ],
    };
    const result = calculateWeddingBudget(input);

    expect(WEDDING_BUDGET_CANONICAL_PATH).toBe(
      "/en/events/wedding-budget-calculator",
    );
    expect(WEDDING_TEMPLATES.essential.label).toBe("Essential");
    expect(templateItems[0]?.name).toBe("Reception venue");
    expect(result.categoryBreakdown[0]?.label).toBe("Catering");
    expect(result.warnings[0]).toContain("The deposit for");
    expect(buildWeddingShareText(result, input)).toContain(
      "Wedding budget — calculadoras.tools",
    );
    expect(buildWeddingCsv(result, input)).toContain(
      "name,category,calculation_type",
    );
  });
});
