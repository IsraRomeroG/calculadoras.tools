import * as base from "./weddingBudget";
import type {
  WeddingBudgetCategory,
  WeddingBudgetInput,
  WeddingBudgetResult,
  WeddingCalculationType,
  WeddingTemplate,
  WeddingTemplateId,
} from "./weddingBudget";

export type {
  ParseWeddingNumberResult,
  WeddingBudgetCategory,
  WeddingBudgetInput,
  WeddingBudgetItem,
  WeddingBudgetResult,
  WeddingCalculatedItem,
  WeddingCalculationType,
  WeddingCategorySubtotal,
  WeddingTemplate,
  WeddingTemplateId,
  WeddingTemplateItem,
} from "./weddingBudget";

export const WEDDING_BUDGET_CANONICAL_PATH =
  "/en/events/wedding-budget-calculator";
export const WEDDING_BUDGET_CATEGORIES = base.WEDDING_BUDGET_CATEGORIES;
export const WEDDING_CALCULATION_TYPES = base.WEDDING_CALCULATION_TYPES;
export const WEDDING_TEMPLATE_IDS = base.WEDDING_TEMPLATE_IDS;

export const WEDDING_BUDGET_CATEGORY_LABELS: Record<
  WeddingBudgetCategory,
  string
> = {
  lugar: "Venue",
  banquete: "Catering",
  bebidas: "Drinks",
  foto_video: "Photography and video",
  musica: "Music",
  decoracion: "Decor",
  vestimenta: "Attire",
  belleza: "Beauty",
  ceremonia: "Ceremony",
  transporte: "Transportation",
  hospedaje: "Accommodation",
  papeleria: "Stationery",
  regalos: "Favors and gifts",
  otro: "Other",
};

export const WEDDING_CALCULATION_TYPE_LABELS: Record<
  WeddingCalculationType,
  string
> = {
  fijo: "Fixed amount",
  por_invitado: "Per guest",
  por_mesa: "Per table",
  cantidad_x_unitario: "Quantity × unit cost",
};

export const WEDDING_TEMPLATES: Record<WeddingTemplateId, WeddingTemplate> = {
  blank: {
    label: "Blank",
    description: "Start with one blank item.",
    items: [],
  },
  essential: {
    label: "Essential",
    description: "Core items for a simple wedding.",
    items: [
      templateItem("Reception venue", "lugar"),
      templateItem("Catering", "banquete"),
      templateItem("Drinks", "bebidas"),
      templateItem("Photography", "foto_video"),
      templateItem("Music", "musica"),
      templateItem("Decor", "decoracion"),
    ],
  },
  complete: {
    label: "Complete",
    description: "A broad list for reviewing common vendors and payments.",
    items: [
      templateItem("Reception venue", "lugar"),
      templateItem("Civil or religious ceremony", "ceremonia"),
      templateItem("Catering", "banquete"),
      templateItem("Drinks", "bebidas"),
      templateItem("Cake or dessert table", "banquete"),
      templateItem("Photography and video", "foto_video"),
      templateItem("Music or DJ", "musica"),
      templateItem("Flowers and decor", "decoracion"),
      templateItem("Dress or suit", "vestimenta"),
      templateItem("Hair and makeup", "belleza"),
      templateItem("Invitations", "papeleria"),
      templateItem("Transportation", "transporte"),
      templateItem("Accommodation", "hospedaje"),
      templateItem("Wedding favors", "regalos"),
    ],
  },
  reception: {
    label: "Reception",
    description: "Common items for the party, meal, and atmosphere.",
    items: [
      templateItem("Venue rental", "lugar"),
      templateItem("Menu per guest", "banquete"),
      templateItem("Drink service", "bebidas"),
      templateItem("Tables and furniture", "lugar"),
      templateItem("Centerpieces", "decoracion"),
      templateItem("DJ or live band", "musica"),
      templateItem("Guest favors", "regalos"),
    ],
  },
};

export const parseWeddingNumberInput = base.parseWeddingNumberInput;

export function createWeddingTemplateItems(templateId: WeddingTemplateId) {
  const template = WEDDING_TEMPLATES[templateId];

  if (!template) {
    throw new RangeError("Unsupported template.");
  }

  return template.items.map((item) => ({ ...item }));
}

export function calculateWeddingBudget(
  input: WeddingBudgetInput,
): WeddingBudgetResult {
  try {
    const result = base.calculateWeddingBudget(input);

    return {
      ...result,
      categoryBreakdown: result.categoryBreakdown
        .map((category) => ({
          ...category,
          label: WEDDING_BUDGET_CATEGORY_LABELS[category.category],
        }))
        .sort(
          (a, b) =>
            b.subtotal - a.subtotal || a.label.localeCompare(b.label, "en-US"),
        ),
      topItems: [...result.topItems].sort(
        (a, b) => b.cost - a.cost || a.name.localeCompare(b.name, "en-US"),
      ),
      warnings: result.items
        .filter((item) => item.depositSurplus > 0)
        .map(
          (item) =>
            `The deposit for "${item.name}" exceeds its cost by ${formatWeddingCurrency(item.depositSurplus)}.`,
        ),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new RangeError(translateWeddingError(error.message));
    }
    throw error;
  }
}

export function formatWeddingCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatWeddingNumber(
  value: number,
  maximumFractionDigits = 2,
) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value);
}

export function buildWeddingShareText(
  result: WeddingBudgetResult,
  input: WeddingBudgetInput,
) {
  const lines = [
    "Wedding budget — calculadoras.tools",
    `Guests: ${formatWeddingNumber(input.guestCount, 0)}`,
    `Item subtotal: ${formatWeddingCurrency(result.subtotal)}`,
    `Contingency (${formatWeddingNumber(input.contingencyPercentage)}%): ${formatWeddingCurrency(result.contingencyAmount)}`,
    `Estimated total: ${formatWeddingCurrency(result.total)}`,
    `Cost per guest: ${formatWeddingCurrency(result.costPerGuest)}`,
    `Payments applied: ${formatWeddingCurrency(result.paidApplied)}`,
    `Outstanding item balance: ${formatWeddingCurrency(result.itemBalance)}`,
    `Estimated amount still due: ${formatWeddingCurrency(result.pendingTotalEstimated)}`,
  ];

  if (
    typeof input.availableBudget === "number" &&
    typeof result.budgetDifference === "number"
  ) {
    lines.push(
      `Available budget: ${formatWeddingCurrency(input.availableBudget)}`,
      result.budgetDifference >= 0
        ? `Estimated amount remaining: ${formatWeddingCurrency(result.budgetDifference)}`
        : `Estimated shortfall: ${formatWeddingCurrency(Math.abs(result.budgetDifference))}`,
    );
  }

  if (result.depositSurplus > 0) {
    lines.push(
      `Excess deposits entered: ${formatWeddingCurrency(result.depositSurplus)}`,
    );
  }

  lines.push(
    "",
    "Top categories:",
    ...(result.categoryBreakdown.length
      ? result.categoryBreakdown.map(
          (category) =>
            `- ${category.label}: ${formatWeddingCurrency(category.subtotal)}`,
        )
      : ["- No categories with costs"]),
    "",
    "Preliminary estimate. Prices depend on vendors, location, season, and scope.",
  );

  return lines.join("\n");
}

export function buildWeddingCsv(
  result: WeddingBudgetResult,
  input: WeddingBudgetInput,
) {
  const rows: string[][] = [
    [
      "name",
      "category",
      "calculation_type",
      "quantity",
      "unit_cost",
      "item_cost",
      "deposit",
      "responsible_person",
      "notes",
    ],
    ...result.items.map((item) => [
      item.name,
      WEDDING_BUDGET_CATEGORY_LABELS[item.category],
      item.calculationType,
      formatCsvNumber(getItemQuantityForCsv(item)),
      formatCsvNumber(getItemUnitCostForCsv(item)),
      formatCsvNumber(item.cost),
      formatCsvNumber(item.deposit),
      item.responsible ?? "",
      item.notes ?? "",
    ]),
    [],
    ["SUMMARY", "Guests", "", "", "", formatCsvNumber(input.guestCount), "", "", ""],
    ["SUMMARY", "Subtotal", "", "", "", formatCsvNumber(result.subtotal), "", "", ""],
    [
      "SUMMARY",
      `Contingency (${formatCsvNumber(input.contingencyPercentage)}%)`,
      "",
      "",
      "",
      formatCsvNumber(result.contingencyAmount),
      "",
      "",
      "",
    ],
    ["SUMMARY", "Estimated total", "", "", "", formatCsvNumber(result.total), "", "", ""],
    ["SUMMARY", "Cost per guest", "", "", "", formatCsvNumber(result.costPerGuest), "", "", ""],
    ["SUMMARY", "Payments applied", "", "", "", formatCsvNumber(result.paidApplied), "", "", ""],
    ["SUMMARY", "Item balance", "", "", "", formatCsvNumber(result.itemBalance), "", "", ""],
    [
      "SUMMARY",
      "Estimated amount still due",
      "",
      "",
      "",
      formatCsvNumber(result.pendingTotalEstimated),
      "",
      "",
      "",
    ],
  ];

  if (
    typeof input.availableBudget === "number" &&
    typeof result.budgetDifference === "number"
  ) {
    rows.push(
      [
        "SUMMARY",
        "Available budget",
        "",
        "",
        "",
        formatCsvNumber(input.availableBudget),
        "",
        "",
        "",
      ],
      [
        "SUMMARY",
        "Difference from budget",
        "",
        "",
        "",
        formatCsvNumber(result.budgetDifference),
        "",
        "",
        "",
      ],
    );
  }

  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
}

function translateWeddingError(message: string) {
  const exact: Record<string, string> = {
    "Agrega al menos una partida completa.": "Add at least one complete item.",
    "Categoría de boda no soportada.": "Unsupported wedding category.",
    "Tipo de cálculo no soportado.": "Unsupported calculation type.",
    "Plantilla no soportada.": "Unsupported template.",
    "El subtotal del presupuesto supera el límite permitido.":
      "The budget subtotal exceeds the allowed limit.",
  };

  if (exact[message]) return exact[message];

  return message
    .replace("invitados por mesa debe ser un entero positivo.", "guests per table must be a positive integer.")
    .replace("invitados debe ser un entero positivo.", "guests must be a positive integer.")
    .replace("contingencia debe estar entre", "contingency must be between")
    .replace("presupuesto disponible debe ser mayor o igual que cero.", "available budget must be zero or greater.")
    .replace("No se permiten más de", "No more than")
    .replace(" partidas.", " items are allowed.")
    .replace("El costo de", "The cost of")
    .replace("supera el límite permitido.", "exceeds the allowed limit.");
}

function templateItem(
  name: string,
  category: WeddingBudgetCategory,
) {
  return { name, category };
}

function getItemQuantityForCsv(
  item: WeddingBudgetResult["items"][number],
) {
  if (item.calculationType === "por_invitado") return 0;
  if (item.calculationType === "por_mesa") return item.tablesUsed ?? 0;
  if (item.calculationType === "cantidad_x_unitario") return item.quantity ?? 0;
  return 1;
}

function getItemUnitCostForCsv(
  item: WeddingBudgetResult["items"][number],
) {
  if (item.calculationType === "fijo") return item.fixedAmount ?? item.cost;
  return item.unitCost ?? 0;
}

function formatCsvNumber(value: number) {
  return Number.isFinite(value) ? String(Number(value.toFixed(6))) : "";
}

function escapeCsvCell(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
