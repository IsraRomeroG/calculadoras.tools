import * as base from "./eventCost";
import type {
  EventCostCategory,
  EventCostInput,
  EventCostItemType,
  EventCostResult,
  EventType,
} from "./eventCost";

export type {
  EventCostCalculatedItem,
  EventCostCategory,
  EventCostCategorySubtotal,
  EventCostInput,
  EventCostItem,
  EventCostItemType,
  EventCostMode,
  EventCostResult,
  EventCostScenario,
  EventType,
  ParseEventCostNumberResult,
  PossibleGuestState,
} from "./eventCost";

export const EVENT_COST_CANONICAL_PATH =
  "/en/events/event-cost-per-person-calculator";
export const EVENT_COST_CATEGORIES = base.EVENT_COST_CATEGORIES;
export const EVENT_TYPES = base.EVENT_TYPES;
export const EVENT_COST_ITEM_TYPES = base.EVENT_COST_ITEM_TYPES;
export const EVENT_ROUNDING_OPTIONS = base.EVENT_ROUNDING_OPTIONS;
export const DEFAULT_SCENARIO_FACTORS = base.DEFAULT_SCENARIO_FACTORS;

export const EVENT_COST_CATEGORY_LABELS: Record<EventCostCategory, string> = {
  lugar: "Venue",
  comida: "Food",
  bebidas: "Drinks",
  personal: "Staff",
  mobiliario: "Furniture",
  entretenimiento: "Entertainment",
  invitaciones: "Invitations",
  transporte: "Transportation",
  limpieza: "Cleaning",
  otro: "Other",
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  fiesta: "Party",
  cena: "Dinner",
  reunion: "Gathering",
  corporativo: "Corporate event",
  boda_celebracion: "Wedding or celebration",
  otro: "Other",
};

export const EVENT_COST_ITEM_TYPE_LABELS: Record<EventCostItemType, string> = {
  fijo: "Fixed expense",
  por_invitado: "Cost per guest",
};

export const parseEventCostNumberInput = base.parseEventCostNumberInput;

export function calculateEventCost(input: EventCostInput): EventCostResult {
  try {
    const result = base.calculateEventCost(input);

    return {
      ...result,
      categoryBreakdown: result.categoryBreakdown
        .map((category) => ({
          ...category,
          label: EVENT_COST_CATEGORY_LABELS[category.category],
        }))
        .sort(
          (a, b) =>
            b.subtotal - a.subtotal || a.label.localeCompare(b.label, "en-US"),
        ),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new RangeError(translateEventCostError(error.message));
    }
    throw error;
  }
}

export function formatEventCostCurrency(value: number) {
  assertFinite(value, "amount");

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MXN",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 2,
  }).format(roundToPrecision(value, 2));
}

export function formatEventCostNumber(
  value: number,
  maximumFractionDigits = 2,
) {
  assertFinite(value, "number");

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(roundToPrecision(value, maximumFractionDigits));
}

export function getPossibleGuestLabel(result: EventCostResult) {
  if (result.possibleGuestState === "budget_below_fixed_costs") {
    return "0 guests";
  }

  if (result.possibleGuestState === "unlimited_by_variable_cost") {
    return "No limit from variable costs";
  }

  if (result.possibleGuestState === "calculable") {
    return `${formatEventCostNumber(result.possibleGuests ?? 0, 0)} guests`;
  }

  return "Not calculated";
}

export function buildEventCostShareText(
  result: EventCostResult,
  input: EventCostInput,
) {
  const lines = [
    input.eventName?.trim()
      ? `Event cost: ${input.eventName.trim()}`
      : "Event cost per person",
    `Type: ${EVENT_TYPE_LABELS[input.eventType ?? "otro"]}`,
  ];

  if (typeof input.guestCount === "number") {
    lines.push(`Guests: ${formatEventCostNumber(input.guestCount, 0)}`);
  }

  if (typeof input.availableBudget === "number") {
    lines.push(
      `Available budget: ${formatEventCostCurrency(input.availableBudget)}`,
    );
  }

  lines.push(
    `Fixed expenses: ${formatEventCostCurrency(result.fixedTotal)}`,
    `Variable cost per guest: ${formatEventCostCurrency(result.variableUnitCost)}`,
  );

  if (typeof result.total === "number") {
    lines.push(
      `Subtotal: ${formatEventCostCurrency(result.subtotal ?? 0)}`,
      `Contingency (${formatEventCostNumber(input.contingencyPercentage)}%): ${formatEventCostCurrency(result.contingencyAmount ?? 0)}`,
      `Total: ${formatEventCostCurrency(result.total)}`,
      `Cost per guest: ${formatEventCostCurrency(result.costPerPerson ?? 0)}`,
      `Suggested contribution: ${formatEventCostCurrency(result.suggestedContribution ?? 0)}`,
    );
  }

  if (typeof result.budgetDifference === "number") {
    lines.push(
      result.budgetDifference >= 0
        ? `Amount under budget: ${formatEventCostCurrency(result.budgetDifference)}`
        : `Amount over budget: ${formatEventCostCurrency(Math.abs(result.budgetDifference))}`,
    );
  }

  if (input.mode === "invitados_posibles") {
    lines.push(`Possible guests: ${getPossibleGuestLabel(result)}`);

    if (typeof result.possibleGuestsBudgetRemaining === "number") {
      lines.push(
        `Estimated amount remaining: ${formatEventCostCurrency(result.possibleGuestsBudgetRemaining)}`,
      );
    }
  }

  if (result.topItems.length) {
    lines.push(
      "",
      "Largest expenses:",
      ...result.topItems.map(
        (item) =>
          `- ${item.name}: ${formatEventCostCurrency(item.totalAtReferenceGuests)}`,
      ),
    );
  }

  lines.push(
    "",
    "Preliminary estimate based on costs entered manually at calculadoras.tools.",
  );

  return lines.join("\n");
}

export function buildEventCostCsv(
  result: EventCostResult,
  input: EventCostInput,
) {
  const rows: string[][] = [
    ["item_type", "name", "category", "amount", "notes"],
    ...result.items.map((item) => [
      EVENT_COST_ITEM_TYPE_LABELS[item.type],
      item.name,
      EVENT_COST_CATEGORY_LABELS[item.category],
      formatCsvNumber(item.amount),
      item.notes ?? "",
    ]),
    [],
    ["metric", "value", "", "", ""],
    ["event_name", input.eventName?.trim() ?? "", "", "", ""],
    ["event_type", EVENT_TYPE_LABELS[input.eventType ?? "otro"], "", "", ""],
    ["mode", input.mode, "", "", ""],
    ["fixed_expenses", formatCsvNumber(result.fixedTotal), "", "", ""],
    [
      "variable_cost_per_guest",
      formatCsvNumber(result.variableUnitCost),
      "",
      "",
      "",
    ],
    [
      "contingency_percentage",
      formatCsvNumber(input.contingencyPercentage),
      "",
      "",
      "",
    ],
  ];

  if (typeof input.guestCount === "number") {
    rows.push(["guests", formatCsvNumber(input.guestCount), "", "", ""]);
  }

  if (typeof input.availableBudget === "number") {
    rows.push([
      "available_budget",
      formatCsvNumber(input.availableBudget),
      "",
      "",
      "",
    ]);
  }

  if (typeof result.total === "number") {
    rows.push(
      ["subtotal", formatCsvNumber(result.subtotal ?? 0), "", "", ""],
      ["total_cost", formatCsvNumber(result.total), "", "", ""],
      [
        "cost_per_guest",
        formatCsvNumber(result.costPerPerson ?? 0),
        "",
        "",
        "",
      ],
      [
        "suggested_contribution",
        formatCsvNumber(result.suggestedContribution ?? 0),
        "",
        "",
        "",
      ],
    );
  }

  if (input.mode === "invitados_posibles") {
    rows.push(
      ["possible_guests_status", result.possibleGuestState, "", "", ""],
      [
        "possible_guests",
        typeof result.possibleGuests === "number"
          ? formatCsvNumber(result.possibleGuests)
          : "",
        "",
        "",
        "",
      ],
    );
  }

  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
}

function translateEventCostError(message: string) {
  const exact: Record<string, string> = {
    "Modo de calculo no soportado.": "Unsupported calculation mode.",
    "Tipo de evento no soportado.": "Unsupported event type.",
    "El nombre del evento debe tener 80 caracteres o menos.":
      "The event name must be 80 characters or fewer.",
    "Tipo de partida no soportado.": "Unsupported item type.",
    "Categoria de evento no soportada.": "Unsupported event category.",
    "El nombre de partida debe tener 80 caracteres o menos.":
      "The item name must be 80 characters or fewer.",
    "Las notas deben tener 140 caracteres o menos.":
      "Notes must be 140 characters or fewer.",
    "El redondeo de cuota debe ser mayor o igual que cero.":
      "The contribution rounding increment must be zero or greater.",
  };

  if (exact[message]) return exact[message];
  if (/^No se permiten mas de \d+ partidas\.$/.test(message)) {
    return message.replace("No se permiten mas de", "No more than").replace(
      "partidas.",
      "items are allowed.",
    );
  }

  return message
    .replace("contingencia debe estar entre", "contingency must be between")
    .replace("invitados debe ser un entero positivo.", "guests must be a positive integer.")
    .replace(
      "presupuesto disponible debe ser mayor que cero.",
      "available budget must be greater than zero.",
    )
    .replace(
      "presupuesto disponible debe ser mayor o igual que cero.",
      "available budget must be zero or greater.",
    )
    .replace("importe de ", "amount for ")
    .replace(" debe ser mayor o igual que cero.", " must be zero or greater.");
}

function escapeCsvCell(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatCsvNumber(value: number) {
  return Number.isFinite(value) ? String(Number(value.toFixed(6))) : "";
}

function assertFinite(value: number, label: string) {
  if (!Number.isFinite(value)) {
    throw new RangeError(`The ${label} must be finite.`);
  }
}

function roundToPrecision(value: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
