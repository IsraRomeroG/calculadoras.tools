export const WEDDING_BUDGET_CANONICAL_PATH =
  "/eventos/calculadora-presupuesto-boda";

export const WEDDING_BUDGET_CATEGORIES = [
  "lugar",
  "banquete",
  "bebidas",
  "foto_video",
  "musica",
  "decoracion",
  "vestimenta",
  "belleza",
  "ceremonia",
  "transporte",
  "hospedaje",
  "papeleria",
  "regalos",
  "otro",
] as const;

export const WEDDING_CALCULATION_TYPES = [
  "fijo",
  "por_invitado",
  "por_mesa",
  "cantidad_x_unitario",
] as const;

export const WEDDING_TEMPLATE_IDS = [
  "blank",
  "essential",
  "complete",
  "reception",
] as const;

export type WeddingBudgetCategory =
  (typeof WEDDING_BUDGET_CATEGORIES)[number];
export type WeddingCalculationType =
  (typeof WEDDING_CALCULATION_TYPES)[number];
export type WeddingTemplateId = (typeof WEDDING_TEMPLATE_IDS)[number];

export const WEDDING_BUDGET_CATEGORY_LABELS: Record<
  WeddingBudgetCategory,
  string
> = {
  lugar: "Lugar",
  banquete: "Banquete",
  bebidas: "Bebidas",
  foto_video: "Foto y video",
  musica: "Música",
  decoracion: "Decoración",
  vestimenta: "Vestimenta",
  belleza: "Belleza",
  ceremonia: "Ceremonia",
  transporte: "Transporte",
  hospedaje: "Hospedaje",
  papeleria: "Papelería",
  regalos: "Recuerdos y regalos",
  otro: "Otro",
};

export const WEDDING_CALCULATION_TYPE_LABELS: Record<
  WeddingCalculationType,
  string
> = {
  fijo: "Importe fijo",
  por_invitado: "Por invitado",
  por_mesa: "Por mesa",
  cantidad_x_unitario: "Cantidad x unitario",
};

export interface WeddingBudgetItem {
  id: string;
  name: string;
  category: WeddingBudgetCategory;
  calculationType: WeddingCalculationType;
  fixedAmount?: number;
  unitCost?: number;
  quantity?: number;
  manualTables?: number;
  deposit: number;
  responsible?: string;
  notes?: string;
}

export interface WeddingBudgetInput {
  guestCount: number;
  availableBudget?: number;
  guestsPerTable: number;
  contingencyPercentage: number;
  items: WeddingBudgetItem[];
}

export interface WeddingCalculatedItem extends WeddingBudgetItem {
  cost: number;
  paymentApplied: number;
  depositSurplus: number;
  balance: number;
  percentageOfSubtotal: number;
  tablesUsed?: number;
}

export interface WeddingCategorySubtotal {
  category: WeddingBudgetCategory;
  label: string;
  subtotal: number;
  percentageOfSubtotal: number;
}

export interface WeddingBudgetResult {
  items: WeddingCalculatedItem[];
  subtotal: number;
  contingencyAmount: number;
  total: number;
  costPerGuest: number;
  availableBudget?: number;
  budgetDifference?: number;
  budgetUsedPercentage?: number;
  budgetPerGuest?: number;
  paidCaptured: number;
  paidApplied: number;
  depositSurplus: number;
  itemBalance: number;
  contingencyReserved: number;
  pendingTotalEstimated: number;
  subtotalsByCategory: Record<WeddingBudgetCategory, number>;
  categoryBreakdown: WeddingCategorySubtotal[];
  topItems: WeddingCalculatedItem[];
  warnings: string[];
}

export interface WeddingTemplateItem {
  name: string;
  category: WeddingBudgetCategory;
}

export interface WeddingTemplate {
  label: string;
  description: string;
  items: WeddingTemplateItem[];
}

export type ParseWeddingNumberResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_large";
    };

const MAX_AMOUNT = 1_000_000_000_000;
const MAX_ITEMS = 100;
const MAX_QUANTITY = 1_000_000;

export const WEDDING_TEMPLATES: Record<WeddingTemplateId, WeddingTemplate> = {
  blank: {
    label: "En blanco",
    description: "Empieza con una partida vacía.",
    items: [],
  },
  essential: {
    label: "Esencial",
    description: "Partidas base para una boda sencilla.",
    items: [
      templateItem("Lugar de la recepción", "lugar"),
      templateItem("Banquete", "banquete"),
      templateItem("Bebidas", "bebidas"),
      templateItem("Fotografía", "foto_video"),
      templateItem("Música", "musica"),
      templateItem("Decoración", "decoracion"),
    ],
  },
  complete: {
    label: "Completa",
    description: "Lista amplia para revisar proveedores y pagos frecuentes.",
    items: [
      templateItem("Lugar de la recepción", "lugar"),
      templateItem("Ceremonia civil o religiosa", "ceremonia"),
      templateItem("Banquete", "banquete"),
      templateItem("Bebidas", "bebidas"),
      templateItem("Pastel o mesa de postres", "banquete"),
      templateItem("Fotografía y video", "foto_video"),
      templateItem("Música o DJ", "musica"),
      templateItem("Flores y decoración", "decoracion"),
      templateItem("Vestido o traje", "vestimenta"),
      templateItem("Maquillaje y peinado", "belleza"),
      templateItem("Invitaciones", "papeleria"),
      templateItem("Transporte", "transporte"),
      templateItem("Hospedaje", "hospedaje"),
      templateItem("Recuerdos", "regalos"),
    ],
  },
  reception: {
    label: "Recepción",
    description: "Conceptos comunes para fiesta, comida y ambientación.",
    items: [
      templateItem("Renta del salón", "lugar"),
      templateItem("Menú por invitado", "banquete"),
      templateItem("Barra de bebidas", "bebidas"),
      templateItem("Mesas y mobiliario", "lugar"),
      templateItem("Centros de mesa", "decoracion"),
      templateItem("DJ o grupo musical", "musica"),
      templateItem("Recuerdos para invitados", "regalos"),
    ],
  },
};

export function calculateWeddingBudget(
  input: WeddingBudgetInput,
): WeddingBudgetResult {
  validateInput(input);

  const calculatedItems = input.items.map((item) => {
    const cost = calculateItemCost(item, input);
    const paymentApplied = Math.min(item.deposit, cost);
    const depositSurplus = Math.max(item.deposit - cost, 0);
    const balance = Math.max(cost - paymentApplied, 0);

    if (!Number.isFinite(cost) || cost > MAX_AMOUNT) {
      throw new RangeError(
        `El costo de "${item.name}" supera el límite permitido.`,
      );
    }

    return {
      ...item,
      name: item.name.trim(),
      responsible: item.responsible?.trim(),
      notes: item.notes?.trim(),
      cost,
      paymentApplied,
      depositSurplus,
      balance,
      percentageOfSubtotal: 0,
      ...(item.calculationType === "por_mesa"
        ? { tablesUsed: getTablesUsed(item, input) }
        : {}),
    };
  });

  const subtotal = sum(calculatedItems.map((item) => item.cost));

  if (!Number.isFinite(subtotal) || subtotal > MAX_AMOUNT) {
    throw new RangeError("El subtotal del presupuesto supera el límite permitido.");
  }

  calculatedItems.forEach((item) => {
    item.percentageOfSubtotal =
      subtotal > 0 ? (item.cost / subtotal) * 100 : 0;
  });

  const contingencyAmount = subtotal * (input.contingencyPercentage / 100);
  const total = subtotal + contingencyAmount;
  const paidCaptured = sum(calculatedItems.map((item) => item.deposit));
  const paidApplied = sum(calculatedItems.map((item) => item.paymentApplied));
  const depositSurplus = sum(
    calculatedItems.map((item) => item.depositSurplus),
  );
  const itemBalance = Math.max(subtotal - paidApplied, 0);
  const contingencyReserved = contingencyAmount;
  const pendingTotalEstimated = itemBalance + contingencyReserved;
  const subtotalsByCategory = Object.fromEntries(
    WEDDING_BUDGET_CATEGORIES.map((category) => [category, 0]),
  ) as Record<WeddingBudgetCategory, number>;

  calculatedItems.forEach((item) => {
    subtotalsByCategory[item.category] += item.cost;
  });

  const categoryBreakdown = WEDDING_BUDGET_CATEGORIES.map((category) => ({
    category,
    label: WEDDING_BUDGET_CATEGORY_LABELS[category],
    subtotal: subtotalsByCategory[category],
    percentageOfSubtotal:
      subtotal > 0 ? (subtotalsByCategory[category] / subtotal) * 100 : 0,
  }))
    .filter((category) => category.subtotal > 0)
    .sort(
      (a, b) =>
        b.subtotal - a.subtotal || a.label.localeCompare(b.label, "es-MX"),
    );

  const budgetMetrics =
    typeof input.availableBudget === "number"
      ? {
          availableBudget: input.availableBudget,
          budgetDifference: input.availableBudget - total,
          budgetPerGuest: input.availableBudget / input.guestCount,
          ...(input.availableBudget > 0
            ? {
                budgetUsedPercentage:
                  (total / input.availableBudget) * 100,
              }
            : {}),
        }
      : {};

  return {
    items: calculatedItems,
    subtotal,
    contingencyAmount,
    total,
    costPerGuest: total / input.guestCount,
    ...budgetMetrics,
    paidCaptured,
    paidApplied,
    depositSurplus,
    itemBalance,
    contingencyReserved,
    pendingTotalEstimated,
    subtotalsByCategory,
    categoryBreakdown,
    topItems: [...calculatedItems]
      .sort((a, b) => b.cost - a.cost || a.name.localeCompare(b.name, "es-MX"))
      .slice(0, 3),
    warnings: calculatedItems
      .filter((item) => item.depositSurplus > 0)
      .map(
        (item) =>
          `El depósito de "${item.name}" supera su costo por ${formatWeddingCurrency(item.depositSurplus)}.`,
      ),
  };
}

export function createWeddingTemplateItems(templateId: WeddingTemplateId) {
  const template = WEDDING_TEMPLATES[templateId];

  if (!template) {
    throw new RangeError("Plantilla no soportada.");
  }

  return template.items.map((item) => ({ ...item }));
}

export function parseWeddingNumberInput(
  value: string,
): ParseWeddingNumberResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  if (/[-\u2212]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const compact = trimmed
    .replace(/mxn/gi, "")
    .replace(/\$/g, "")
    .replace(/\s+/g, "");

  if (!compact || /[^0-9.,]/.test(compact)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeDecimalSeparators(compact);

  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const numericValue = Number(normalized);

  if (!Number.isFinite(numericValue)) {
    return { ok: false, error: "invalid" };
  }

  if (numericValue > MAX_AMOUNT) {
    return { ok: false, error: "too_large" };
  }

  return {
    ok: true,
    value: numericValue,
    normalized,
  };
}

export function formatWeddingCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatWeddingNumber(
  value: number,
  maximumFractionDigits = 2,
) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits,
  }).format(value);
}

export function buildWeddingShareText(
  result: WeddingBudgetResult,
  input: WeddingBudgetInput,
) {
  const lines = [
    "Presupuesto de boda - calculadoras.tools",
    `Invitados: ${formatWeddingNumber(input.guestCount, 0)}`,
    `Subtotal de partidas: ${formatWeddingCurrency(result.subtotal)}`,
    `Contingencia (${formatWeddingNumber(input.contingencyPercentage)}%): ${formatWeddingCurrency(result.contingencyAmount)}`,
    `Total estimado: ${formatWeddingCurrency(result.total)}`,
    `Costo por invitado: ${formatWeddingCurrency(result.costPerGuest)}`,
    `Pagado aplicado: ${formatWeddingCurrency(result.paidApplied)}`,
    `Saldo de partidas: ${formatWeddingCurrency(result.itemBalance)}`,
    `Pendiente total estimado: ${formatWeddingCurrency(result.pendingTotalEstimated)}`,
  ];

  if (
    typeof input.availableBudget === "number" &&
    typeof result.budgetDifference === "number"
  ) {
    lines.push(
      `Presupuesto disponible: ${formatWeddingCurrency(input.availableBudget)}`,
      result.budgetDifference >= 0
        ? `Sobrante estimado: ${formatWeddingCurrency(result.budgetDifference)}`
        : `Faltante estimado: ${formatWeddingCurrency(Math.abs(result.budgetDifference))}`,
    );
  }

  if (result.depositSurplus > 0) {
    lines.push(
      `Excedente de depósitos capturados: ${formatWeddingCurrency(result.depositSurplus)}`,
    );
  }

  lines.push(
    "",
    "Categorías principales:",
    ...(result.categoryBreakdown.length
      ? result.categoryBreakdown.map(
          (category) =>
            `- ${category.label}: ${formatWeddingCurrency(category.subtotal)}`,
        )
      : ["- Sin categorías con costo"]),
    "",
    "Estimación preliminar. Los precios dependen de proveedores, ciudad, temporada y alcance.",
  );

  return lines.join("\n");
}

export function buildWeddingCsv(
  result: WeddingBudgetResult,
  input: WeddingBudgetInput,
) {
  const rows: string[][] = [
    [
      "nombre",
      "categoria",
      "tipo_calculo",
      "cantidad",
      "costo_unitario",
      "costo_partida",
      "deposito",
      "responsable",
      "notas",
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
    ["RESUMEN", "Invitados", "", "", "", formatCsvNumber(input.guestCount), "", "", ""],
    ["RESUMEN", "Subtotal", "", "", "", formatCsvNumber(result.subtotal), "", "", ""],
    [
      "RESUMEN",
      `Contingencia (${formatCsvNumber(input.contingencyPercentage)}%)`,
      "",
      "",
      "",
      formatCsvNumber(result.contingencyAmount),
      "",
      "",
      "",
    ],
    ["RESUMEN", "Total estimado", "", "", "", formatCsvNumber(result.total), "", "", ""],
    [
      "RESUMEN",
      "Costo por invitado",
      "",
      "",
      "",
      formatCsvNumber(result.costPerGuest),
      "",
      "",
      "",
    ],
    [
      "RESUMEN",
      "Pagado aplicado",
      "",
      "",
      "",
      formatCsvNumber(result.paidApplied),
      "",
      "",
      "",
    ],
    [
      "RESUMEN",
      "Saldo de partidas",
      "",
      "",
      "",
      formatCsvNumber(result.itemBalance),
      "",
      "",
      "",
    ],
    [
      "RESUMEN",
      "Pendiente total estimado",
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
        "RESUMEN",
        "Presupuesto disponible",
        "",
        "",
        "",
        formatCsvNumber(input.availableBudget),
        "",
        "",
        "",
      ],
      [
        "RESUMEN",
        "Diferencia contra presupuesto",
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

function calculateItemCost(
  item: WeddingBudgetItem,
  input: WeddingBudgetInput,
) {
  switch (item.calculationType) {
    case "fijo":
      return item.fixedAmount ?? 0;
    case "por_invitado":
      return (item.unitCost ?? 0) * input.guestCount;
    case "por_mesa":
      return (item.unitCost ?? 0) * getTablesUsed(item, input);
    case "cantidad_x_unitario":
      return (item.unitCost ?? 0) * (item.quantity ?? 0);
  }
}

function getTablesUsed(item: WeddingBudgetItem, input: WeddingBudgetInput) {
  return item.manualTables ?? Math.ceil(input.guestCount / input.guestsPerTable);
}

function validateInput(input: WeddingBudgetInput) {
  validatePositiveInteger(input.guestCount, "invitados", 10_000);
  validatePositiveInteger(input.guestsPerTable, "invitados por mesa", 50);
  validatePercentage(input.contingencyPercentage, "contingencia");

  if (typeof input.availableBudget === "number") {
    validateNonNegativeAmount(input.availableBudget, "presupuesto disponible");
  }

  if (!input.items.length) {
    throw new RangeError("Agrega al menos una partida completa.");
  }

  if (input.items.length > MAX_ITEMS) {
    throw new RangeError(`No se permiten más de ${MAX_ITEMS} partidas.`);
  }

  input.items.forEach(validateItem);
}

function validateItem(item: WeddingBudgetItem) {
  validateText(item.name, "nombre", 80);

  if (!WEDDING_BUDGET_CATEGORIES.includes(item.category)) {
    throw new RangeError("Categoría de boda no soportada.");
  }

  if (!WEDDING_CALCULATION_TYPES.includes(item.calculationType)) {
    throw new RangeError("Tipo de cálculo no soportado.");
  }

  validateNonNegativeAmount(item.deposit, `depósito de "${item.name}"`);

  if (typeof item.responsible === "string" && item.responsible.trim()) {
    validateText(item.responsible, "responsable", 80);
  }

  if (typeof item.notes === "string" && item.notes.trim().length > 140) {
    throw new RangeError("notas debe contener 140 caracteres o menos.");
  }

  if (item.calculationType === "fijo") {
    validateNonNegativeAmount(item.fixedAmount ?? 0, `costo de "${item.name}"`);
    return;
  }

  validateNonNegativeAmount(item.unitCost ?? 0, `costo de "${item.name}"`);

  if (item.calculationType === "cantidad_x_unitario") {
    validateNonNegativeQuantity(item.quantity ?? 0, `cantidad de "${item.name}"`);
  }

  if (
    item.calculationType === "por_mesa" &&
    typeof item.manualTables === "number"
  ) {
    validatePositiveInteger(item.manualTables, "mesas manuales", 10_000);
  }
}

function validatePercentage(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError(`${label} debe estar entre 0 y 100.`);
  }
}

function validatePositiveInteger(
  value: number,
  label: string,
  maximum: number,
) {
  if (
    !Number.isInteger(value) ||
    value <= 0 ||
    value > maximum
  ) {
    throw new RangeError(`${label} debe ser un entero positivo.`);
  }
}

function validateNonNegativeAmount(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0 || value > MAX_AMOUNT) {
    throw new RangeError(`${label} debe ser mayor o igual que cero.`);
  }
}

function validateNonNegativeQuantity(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0 || value > MAX_QUANTITY) {
    throw new RangeError(`${label} debe ser mayor o igual que cero.`);
  }
}

function validateText(value: string, label: string, maxLength: number) {
  const normalized = value.trim();

  if (!normalized || normalized.length > maxLength) {
    throw new RangeError(
      `${label} debe contener entre 1 y ${maxLength} caracteres.`,
    );
  }
}

function templateItem(
  name: string,
  category: WeddingBudgetCategory,
): WeddingTemplateItem {
  return {
    name,
    category,
  };
}

function getItemQuantityForCsv(item: WeddingCalculatedItem) {
  if (item.calculationType === "por_invitado") return 0;
  if (item.calculationType === "por_mesa") return item.tablesUsed ?? 0;
  if (item.calculationType === "cantidad_x_unitario") return item.quantity ?? 0;
  return 1;
}

function getItemUnitCostForCsv(item: WeddingCalculatedItem) {
  if (item.calculationType === "fijo") return item.fixedAmount ?? item.cost;
  return item.unitCost ?? 0;
}

function normalizeDecimalSeparators(value: string): string | undefined {
  const lastComma = value.lastIndexOf(",");
  const lastDot = value.lastIndexOf(".");

  if (lastComma !== -1 && lastDot !== -1) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const groupingSeparator = decimalSeparator === "," ? "." : ",";
    const decimalIndex = value.lastIndexOf(decimalSeparator);
    const integerPart = value.slice(0, decimalIndex);
    const decimalPart = value.slice(decimalIndex + 1);

    if (
      !decimalPart ||
      decimalPart.includes(groupingSeparator) ||
      !isValidGroupedInteger(integerPart, groupingSeparator)
    ) {
      return undefined;
    }

    return `${stripGrouping(integerPart, groupingSeparator)}.${decimalPart}`;
  }

  if (lastComma !== -1) {
    return normalizeSingleSeparator(value, ",");
  }

  if (lastDot !== -1) {
    return normalizeSingleSeparator(value, ".");
  }

  return value;
}

function normalizeSingleSeparator(
  value: string,
  separator: "," | ".",
): string | undefined {
  const parts = value.split(separator);

  if (parts.length === 2) {
    const [integerPart, decimalOrGroupPart] = parts;

    if (!integerPart || !decimalOrGroupPart) {
      return undefined;
    }

    if (
      decimalOrGroupPart.length === 3 &&
      integerPart.length <= 3 &&
      /^\d{1,3}$/.test(integerPart)
    ) {
      return `${integerPart}${decimalOrGroupPart}`;
    }

    return `${integerPart}.${decimalOrGroupPart}`;
  }

  if (
    parts.length > 2 &&
    parts.every(Boolean) &&
    parts.slice(1).every((part) => part.length === 3)
  ) {
    return parts.join("");
  }

  return undefined;
}

function isValidGroupedInteger(value: string, separator: string) {
  const groups = value.split(separator);

  return (
    /^\d{1,3}$/.test(groups[0]) &&
    groups.slice(1).every((group) => /^\d{3}$/.test(group))
  );
}

function stripGrouping(value: string, separator: string) {
  return value.split(separator).join("");
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

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}
