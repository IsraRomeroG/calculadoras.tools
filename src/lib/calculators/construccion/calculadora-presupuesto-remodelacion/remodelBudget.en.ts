import {
  calculateRemodelBudget as calculateRemodelBudgetEs,
  type RemodelBudgetInput,
  type RemodelBudgetResult,
  type RemodelCostType,
  type RemodelTemplate,
  type RemodelTemplateId,
  REMODEL_COST_TYPES,
  REMODEL_TAX_MODES,
  REMODEL_TEMPLATE_IDS,
  parseRemodelNumberInput,
} from "./remodelBudget";

export const REMODEL_BUDGET_CANONICAL_PATH =
  "/en/construction/renovation-budget-calculator";
export {
  REMODEL_COST_TYPES,
  REMODEL_TAX_MODES,
  REMODEL_TEMPLATE_IDS,
  parseRemodelNumberInput,
};

export const REMODEL_COST_TYPE_LABELS: Record<RemodelCostType, string> = {
  material: "Materials",
  mano_obra: "Labor",
  permiso: "Permits",
  otro: "Other",
};

const item = (
  name: string,
  zone: string,
  type: RemodelCostType,
  unit = "service",
) => ({ name, zone, type, quantity: 1, unit });

export const REMODEL_TEMPLATES: Record<RemodelTemplateId, RemodelTemplate> = {
  blank: {
    label: "Blank",
    description: "Start with one empty line item.",
    items: [],
  },
  kitchen: {
    label: "Kitchen",
    description: "Common line items for a kitchen renovation.",
    items: [
      item("Demolition and removal", "Kitchen", "mano_obra"),
      item("Cabinets and countertops", "Kitchen", "material", "lot"),
      item("Electrical installation", "Kitchen", "mano_obra"),
      item("Plumbing installation", "Kitchen", "mano_obra"),
      item("Finishes and paint", "Kitchen", "material", "lot"),
      item("Freight and debris removal", "Kitchen", "otro"),
      item("Final cleaning", "Kitchen", "otro"),
    ],
  },
  bathroom: {
    label: "Bathroom",
    description: "Base line items for a bathroom renovation.",
    items: [
      item("Demolition and removal", "Bathroom", "mano_obra"),
      item("Tile and wall coverings", "Bathroom", "material", "lot"),
      item("Fixtures and accessories", "Bathroom", "material", "lot"),
      item("Plumbing installation", "Bathroom", "mano_obra"),
      item("Electrical installation", "Bathroom", "mano_obra"),
      item("Installation and finishes", "Bathroom", "mano_obra"),
      item("Debris removal and cleaning", "Bathroom", "otro"),
    ],
  },
  painting: {
    label: "Painting",
    description: "Preparation, materials and paint application.",
    items: [
      item("Preparation and repairs", "Painting", "mano_obra"),
      item("Primer, paint and supplies", "Painting", "material", "lot"),
      item("Paint application", "Painting", "mano_obra"),
      item("Furniture and floor protection", "Painting", "otro"),
      item("Final cleaning", "Painting", "otro"),
    ],
  },
  flooring: {
    label: "Flooring",
    description: "Removal, materials, installation and cleaning.",
    items: [
      item("Existing floor removal", "Flooring", "mano_obra"),
      item("Flooring, adhesive and grout", "Flooring", "material", "lot"),
      item("Leveling and preparation", "Flooring", "mano_obra"),
      item("Floor installation", "Flooring", "mano_obra"),
      item("Baseboards and trim", "Flooring", "material", "lot"),
      item("Debris, freight and cleaning", "Flooring", "otro"),
    ],
  },
  general: {
    label: "General renovation",
    description: "A broad list for starting a complete budget.",
    items: [
      item("Design and supervision", "General", "otro"),
      item("Demolition and removal", "General", "mano_obra"),
      item("Construction materials", "General", "material", "lot"),
      item("General labor", "General", "mano_obra"),
      item("Electrical installation", "Electrical", "mano_obra"),
      item("Plumbing installation", "Plumbing", "mano_obra"),
      item("Permits and fees", "General", "permiso"),
      item("Freight and debris removal", "General", "otro"),
      item("Final cleaning", "General", "otro"),
    ],
  },
};

export function calculateRemodelBudget(input: RemodelBudgetInput) {
  try {
    return calculateRemodelBudgetEs(input);
  } catch {
    throw new RangeError("Check the entered values.");
  }
}

export function createRemodelTemplateItems(templateId: RemodelTemplateId) {
  const template = REMODEL_TEMPLATES[templateId];
  if (!template) throw new RangeError("Unsupported template.");
  return template.items.map((templateItem) => ({ ...templateItem }));
}

export function formatRemodelCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatRemodelNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

export function buildRemodelShareText(
  result: RemodelBudgetResult,
  input: RemodelBudgetInput,
) {
  const lines = [
    "Renovation budget — calculadoras.tools",
    `Estimated total: ${formatRemodelCurrency(result.total)}`,
    `Line items: ${formatRemodelCurrency(result.baseSubtotal)}`,
  ];
  if (input.taxMode === "agregar_impuestos") {
    lines.push(
      `Taxes (${formatRemodelNumber(input.taxPercentage)}%): ${formatRemodelCurrency(result.taxAmount)}`,
    );
  } else {
    lines.push("Additional taxes: not added");
  }
  lines.push(
    `Contingency (${formatRemodelNumber(input.contingencyPercentage)}%): ${formatRemodelCurrency(result.contingencyAmount)}`,
  );
  if (typeof input.availableBudget === "number" && typeof result.budgetDifference === "number") {
    lines.push(
      `Available budget: ${formatRemodelCurrency(input.availableBudget)}`,
      result.budgetDifference >= 0
        ? `Remaining after estimate: ${formatRemodelCurrency(result.budgetDifference)}`
        : `Estimated overage: ${formatRemodelCurrency(Math.abs(result.budgetDifference))}`,
    );
  }
  if (typeof input.areaM2 === "number" && typeof result.costPerM2 === "number") {
    lines.push(
      `Area: ${formatRemodelNumber(input.areaM2)} m²`,
      `Estimated cost per m²: ${formatRemodelCurrency(result.costPerM2)}`,
    );
  }
  lines.push(
    "",
    "Breakdown by type:",
    ...REMODEL_COST_TYPES.map(
      (type) =>
        `- ${REMODEL_COST_TYPE_LABELS[type]}: ${formatRemodelCurrency(result.subtotalsByType[type])}`,
    ),
    "",
    "Preliminary estimate. Prices, taxes and scope may change.",
  );
  return lines.join("\n");
}

export function buildRemodelCsv(
  result: RemodelBudgetResult,
  input: RemodelBudgetInput,
) {
  const rows: string[][] = [
    ["name", "zone", "type", "quantity", "unit", "unit_cost", "subtotal"],
    ...result.items.map((lineItem) => [
      lineItem.name,
      lineItem.zone,
      REMODEL_COST_TYPE_LABELS[lineItem.type],
      csvNumber(lineItem.quantity),
      lineItem.unit,
      csvNumber(lineItem.unitCost),
      csvNumber(lineItem.subtotal),
    ]),
    [],
    ["SUMMARY", "Line item subtotal", "", "", "", "", csvNumber(result.baseSubtotal)],
    [
      "SUMMARY",
      input.taxMode === "agregar_impuestos"
        ? `Taxes (${csvNumber(input.taxPercentage)}%)`
        : "Additional taxes",
      "",
      "",
      "",
      "",
      csvNumber(result.taxAmount),
    ],
    ["SUMMARY", `Contingency (${csvNumber(input.contingencyPercentage)}%)`, "", "", "", "", csvNumber(result.contingencyAmount)],
    ["SUMMARY", "Estimated total", "", "", "", "", csvNumber(result.total)],
  ];
  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

function csvNumber(value: number) {
  return Number.isFinite(value) ? String(Number(value.toFixed(6))) : "";
}

function csvCell(value: string) {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}
