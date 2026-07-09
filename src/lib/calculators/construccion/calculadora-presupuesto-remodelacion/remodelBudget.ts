export const REMODEL_BUDGET_CANONICAL_PATH =
  "/construccion/calculadora-presupuesto-remodelacion";

export const REMODEL_COST_TYPES = [
  "material",
  "mano_obra",
  "permiso",
  "otro",
] as const;

export const REMODEL_TAX_MODES = [
  "costos_finales",
  "agregar_impuestos",
] as const;

export const REMODEL_TEMPLATE_IDS = [
  "blank",
  "kitchen",
  "bathroom",
  "painting",
  "flooring",
  "general",
] as const;

export type RemodelCostType = (typeof REMODEL_COST_TYPES)[number];
export type RemodelTaxMode = (typeof REMODEL_TAX_MODES)[number];
export type RemodelTemplateId = (typeof REMODEL_TEMPLATE_IDS)[number];

export const REMODEL_COST_TYPE_LABELS: Record<RemodelCostType, string> = {
  material: "Materiales",
  mano_obra: "Mano de obra",
  permiso: "Permisos",
  otro: "Otros",
};

export interface RemodelBudgetItem {
  id: string;
  name: string;
  zone: string;
  type: RemodelCostType;
  quantity: number;
  unit: string;
  unitCost: number;
}

export interface RemodelBudgetInput {
  availableBudget?: number;
  areaM2?: number;
  contingencyPercentage: number;
  taxMode: RemodelTaxMode;
  taxPercentage: number;
  items: RemodelBudgetItem[];
}

export interface RemodelCalculatedItem extends RemodelBudgetItem {
  subtotal: number;
  percentageOfBase: number;
}

export interface RemodelZoneSubtotal {
  zone: string;
  subtotal: number;
  percentageOfBase: number;
}

export interface RemodelBudgetResult {
  items: RemodelCalculatedItem[];
  baseSubtotal: number;
  taxAmount: number;
  subtotalWithTax: number;
  contingencyAmount: number;
  total: number;
  budgetDifference?: number;
  budgetUsedPercentage?: number;
  maximumBaseBudget?: number;
  baseCapacity?: number;
  costPerM2?: number;
  subtotalsByType: Record<RemodelCostType, number>;
  subtotalsByZone: RemodelZoneSubtotal[];
  topItems: RemodelCalculatedItem[];
}

export interface RemodelTemplateItem {
  name: string;
  zone: string;
  type: RemodelCostType;
  quantity: number;
  unit: string;
}

export interface RemodelTemplate {
  label: string;
  description: string;
  items: RemodelTemplateItem[];
}

export const REMODEL_TEMPLATES: Record<RemodelTemplateId, RemodelTemplate> = {
  blank: {
    label: "En blanco",
    description: "Empieza con una partida vacía.",
    items: [],
  },
  kitchen: {
    label: "Cocina",
    description: "Conceptos frecuentes para renovar una cocina.",
    items: [
      templateItem("Demolición y retiro", "Cocina", "mano_obra", "servicio"),
      templateItem("Muebles y cubiertas", "Cocina", "material", "lote"),
      templateItem("Instalación eléctrica", "Cocina", "mano_obra", "servicio"),
      templateItem("Instalación hidráulica", "Cocina", "mano_obra", "servicio"),
      templateItem("Acabados y pintura", "Cocina", "material", "lote"),
      templateItem("Fletes y retiro de escombro", "Cocina", "otro", "servicio"),
      templateItem("Limpieza final", "Cocina", "otro", "servicio"),
    ],
  },
  bathroom: {
    label: "Baño",
    description: "Partidas base para una remodelación de baño.",
    items: [
      templateItem("Demolición y retiro", "Baño", "mano_obra", "servicio"),
      templateItem("Azulejo y recubrimientos", "Baño", "material", "lote"),
      templateItem("Muebles y accesorios", "Baño", "material", "lote"),
      templateItem("Instalación hidráulica", "Baño", "mano_obra", "servicio"),
      templateItem("Instalación eléctrica", "Baño", "mano_obra", "servicio"),
      templateItem("Colocación y acabados", "Baño", "mano_obra", "servicio"),
      templateItem("Retiro de escombro y limpieza", "Baño", "otro", "servicio"),
    ],
  },
  painting: {
    label: "Pintura",
    description: "Preparación, materiales y aplicación de pintura.",
    items: [
      templateItem("Preparación y resanes", "Pintura", "mano_obra", "servicio"),
      templateItem("Sellador, pintura y consumibles", "Pintura", "material", "lote"),
      templateItem("Aplicación de pintura", "Pintura", "mano_obra", "servicio"),
      templateItem("Protección de muebles y pisos", "Pintura", "otro", "servicio"),
      templateItem("Limpieza final", "Pintura", "otro", "servicio"),
    ],
  },
  flooring: {
    label: "Piso",
    description: "Retiro, materiales, colocación y limpieza.",
    items: [
      templateItem("Retiro de piso existente", "Pisos", "mano_obra", "servicio"),
      templateItem("Piso, adhesivo y boquilla", "Pisos", "material", "lote"),
      templateItem("Nivelación y preparación", "Pisos", "mano_obra", "servicio"),
      templateItem("Colocación de piso", "Pisos", "mano_obra", "servicio"),
      templateItem("Zoclos y remates", "Pisos", "material", "lote"),
      templateItem("Escombro, flete y limpieza", "Pisos", "otro", "servicio"),
    ],
  },
  general: {
    label: "Remodelación general",
    description: "Una lista amplia para iniciar un presupuesto completo.",
    items: [
      templateItem("Diseño y supervisión", "General", "otro", "servicio"),
      templateItem("Demolición y retiro", "General", "mano_obra", "servicio"),
      templateItem("Materiales de obra", "General", "material", "lote"),
      templateItem("Mano de obra general", "General", "mano_obra", "servicio"),
      templateItem("Instalación eléctrica", "Instalación eléctrica", "mano_obra", "servicio"),
      templateItem("Instalación hidráulica", "Plomería", "mano_obra", "servicio"),
      templateItem("Permisos y trámites", "General", "permiso", "servicio"),
      templateItem("Fletes y retiro de escombro", "General", "otro", "servicio"),
      templateItem("Limpieza final", "General", "otro", "servicio"),
    ],
  },
};

export type ParseRemodelNumberResult =
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
const MAX_QUANTITY = 1_000_000;
const MAX_ITEMS = 200;

export function calculateRemodelBudget(
  input: RemodelBudgetInput,
): RemodelBudgetResult {
  validateInput(input);

  const calculatedItems = input.items.map((item) => {
    const subtotal = item.quantity * item.unitCost;

    if (!Number.isFinite(subtotal) || subtotal > MAX_AMOUNT) {
      throw new RangeError(
        `El subtotal de "${item.name}" supera el límite permitido.`,
      );
    }

    return {
      ...item,
      name: item.name.trim(),
      zone: item.zone.trim(),
      unit: item.unit.trim(),
      subtotal,
      percentageOfBase: 0,
    };
  });

  const baseSubtotal = sum(calculatedItems.map((item) => item.subtotal));

  if (!Number.isFinite(baseSubtotal) || baseSubtotal > MAX_AMOUNT) {
    throw new RangeError("El subtotal del presupuesto supera el límite permitido.");
  }

  calculatedItems.forEach((item) => {
    item.percentageOfBase =
      baseSubtotal > 0 ? (item.subtotal / baseSubtotal) * 100 : 0;
  });

  const taxFactor =
    input.taxMode === "agregar_impuestos"
      ? 1 + input.taxPercentage / 100
      : 1;
  const contingencyFactor = 1 + input.contingencyPercentage / 100;
  const taxAmount =
    input.taxMode === "agregar_impuestos"
      ? baseSubtotal * (input.taxPercentage / 100)
      : 0;
  const subtotalWithTax = baseSubtotal + taxAmount;
  const contingencyAmount =
    subtotalWithTax * (input.contingencyPercentage / 100);
  const total = subtotalWithTax + contingencyAmount;

  const budgetMetrics =
    typeof input.availableBudget === "number"
      ? {
          budgetDifference: input.availableBudget - total,
          ...(input.availableBudget > 0
            ? {
                budgetUsedPercentage:
                  (total / input.availableBudget) * 100,
              }
            : {}),
          maximumBaseBudget:
            input.availableBudget / (taxFactor * contingencyFactor),
          baseCapacity:
            input.availableBudget / (taxFactor * contingencyFactor) -
            baseSubtotal,
        }
      : {};

  const subtotalsByType = Object.fromEntries(
    REMODEL_COST_TYPES.map((type) => [type, 0]),
  ) as Record<RemodelCostType, number>;
  const zoneTotals = new Map<string, number>();

  calculatedItems.forEach((item) => {
    subtotalsByType[item.type] += item.subtotal;
    zoneTotals.set(item.zone, (zoneTotals.get(item.zone) ?? 0) + item.subtotal);
  });

  const subtotalsByZone = [...zoneTotals.entries()]
    .map(([zone, subtotal]) => ({
      zone,
      subtotal,
      percentageOfBase:
        baseSubtotal > 0 ? (subtotal / baseSubtotal) * 100 : 0,
    }))
    .sort((a, b) => b.subtotal - a.subtotal || a.zone.localeCompare(b.zone));

  return {
    items: calculatedItems,
    baseSubtotal,
    taxAmount,
    subtotalWithTax,
    contingencyAmount,
    total,
    ...budgetMetrics,
    ...(typeof input.areaM2 === "number"
      ? { costPerM2: total / input.areaM2 }
      : {}),
    subtotalsByType,
    subtotalsByZone,
    topItems: [...calculatedItems]
      .sort((a, b) => b.subtotal - a.subtotal || a.name.localeCompare(b.name))
      .slice(0, 3),
  };
}

export function createRemodelTemplateItems(templateId: RemodelTemplateId) {
  const template = REMODEL_TEMPLATES[templateId];

  if (!template) {
    throw new RangeError("Plantilla no soportada.");
  }

  return template.items.map((item) => ({ ...item }));
}

export function parseRemodelNumberInput(
  value: string,
): ParseRemodelNumberResult {
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

export function formatRemodelCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatRemodelNumber(
  value: number,
  maximumFractionDigits = 2,
) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits,
  }).format(value);
}

export function buildRemodelShareText(
  result: RemodelBudgetResult,
  input: RemodelBudgetInput,
) {
  const lines = [
    "Presupuesto de remodelación - calculadoras.tools",
    `Total estimado: ${formatRemodelCurrency(result.total)}`,
    `Partidas: ${formatRemodelCurrency(result.baseSubtotal)}`,
  ];

  if (input.taxMode === "agregar_impuestos") {
    lines.push(
      `Impuestos (${formatRemodelNumber(input.taxPercentage)}%): ${formatRemodelCurrency(result.taxAmount)}`,
    );
  } else {
    lines.push("Impuestos adicionales: no se agregaron");
  }

  lines.push(
    `Contingencia (${formatRemodelNumber(input.contingencyPercentage)}%): ${formatRemodelCurrency(result.contingencyAmount)}`,
  );

  if (
    typeof input.availableBudget === "number" &&
    typeof result.budgetDifference === "number"
  ) {
    lines.push(
      `Presupuesto disponible: ${formatRemodelCurrency(input.availableBudget)}`,
      result.budgetDifference >= 0
        ? `Disponible después de la estimación: ${formatRemodelCurrency(result.budgetDifference)}`
        : `Excedente estimado: ${formatRemodelCurrency(Math.abs(result.budgetDifference))}`,
    );
  }

  if (
    typeof input.areaM2 === "number" &&
    typeof result.costPerM2 === "number"
  ) {
    lines.push(
      `Superficie: ${formatRemodelNumber(input.areaM2)} m²`,
      `Costo estimado por m²: ${formatRemodelCurrency(result.costPerM2)}`,
    );
  }

  lines.push(
    "",
    "Desglose por tipo:",
    ...REMODEL_COST_TYPES.map(
      (type) =>
        `- ${REMODEL_COST_TYPE_LABELS[type]}: ${formatRemodelCurrency(result.subtotalsByType[type])}`,
    ),
    "",
    "Estimación preliminar. Los precios, impuestos y alcances pueden cambiar.",
  );

  return lines.join("\n");
}

export function buildRemodelCsv(
  result: RemodelBudgetResult,
  input: RemodelBudgetInput,
) {
  const rows: string[][] = [
    [
      "nombre",
      "zona",
      "tipo",
      "cantidad",
      "unidad",
      "costo_unitario",
      "subtotal",
    ],
    ...result.items.map((item) => [
      item.name,
      item.zone,
      REMODEL_COST_TYPE_LABELS[item.type],
      formatCsvNumber(item.quantity),
      item.unit,
      formatCsvNumber(item.unitCost),
      formatCsvNumber(item.subtotal),
    ]),
    [],
    ["RESUMEN", "Subtotal de partidas", "", "", "", "", formatCsvNumber(result.baseSubtotal)],
    [
      "RESUMEN",
      input.taxMode === "agregar_impuestos"
        ? `Impuestos (${formatCsvNumber(input.taxPercentage)}%)`
        : "Impuestos adicionales",
      "",
      "",
      "",
      "",
      formatCsvNumber(result.taxAmount),
    ],
    [
      "RESUMEN",
      `Contingencia (${formatCsvNumber(input.contingencyPercentage)}%)`,
      "",
      "",
      "",
      "",
      formatCsvNumber(result.contingencyAmount),
    ],
    ["RESUMEN", "Total estimado", "", "", "", "", formatCsvNumber(result.total)],
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
        "",
        formatCsvNumber(input.availableBudget),
      ],
      [
        "RESUMEN",
        "Diferencia contra presupuesto",
        "",
        "",
        "",
        "",
        formatCsvNumber(result.budgetDifference),
      ],
    );
  }

  if (
    typeof input.areaM2 === "number" &&
    typeof result.costPerM2 === "number"
  ) {
    rows.push(
      [
        "RESUMEN",
        "Superficie m2",
        "",
        "",
        "",
        "",
        formatCsvNumber(input.areaM2),
      ],
      [
        "RESUMEN",
        "Costo estimado por m2",
        "",
        "",
        "",
        "",
        formatCsvNumber(result.costPerM2),
      ],
    );
  }

  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
}

function templateItem(
  name: string,
  zone: string,
  type: RemodelCostType,
  unit: string,
): RemodelTemplateItem {
  return {
    name,
    zone,
    type,
    quantity: 1,
    unit,
  };
}

function validateInput(input: RemodelBudgetInput) {
  if (!input.items.length) {
    throw new RangeError("Agrega al menos una partida completa.");
  }

  if (input.items.length > MAX_ITEMS) {
    throw new RangeError(`No se permiten más de ${MAX_ITEMS} partidas.`);
  }

  validatePercentage(input.contingencyPercentage, "contingencia");
  validateTaxMode(input.taxMode);
  validatePercentage(input.taxPercentage, "impuestos");

  if (typeof input.availableBudget === "number") {
    validateNonNegativeAmount(input.availableBudget, "presupuesto disponible");
  }

  if (typeof input.areaM2 === "number") {
    validatePositiveAmount(input.areaM2, "superficie");
  }

  input.items.forEach(validateItem);
}

function validateItem(item: RemodelBudgetItem) {
  validateText(item.name, "nombre", 80);
  validateText(item.zone, "zona", 40);
  validateText(item.unit, "unidad", 20);

  if (!REMODEL_COST_TYPES.includes(item.type)) {
    throw new RangeError("Tipo de costo no soportado.");
  }

  if (
    !Number.isFinite(item.quantity) ||
    item.quantity <= 0 ||
    item.quantity > MAX_QUANTITY
  ) {
    throw new RangeError(
      `La cantidad de "${item.name}" debe ser mayor que cero.`,
    );
  }

  validateNonNegativeAmount(item.unitCost, `costo de "${item.name}"`);
}

function validateTaxMode(mode: RemodelTaxMode) {
  if (!REMODEL_TAX_MODES.includes(mode)) {
    throw new RangeError("Tratamiento de impuestos no soportado.");
  }
}

function validatePercentage(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError(`${label} debe estar entre 0 y 100.`);
  }
}

function validatePositiveAmount(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0 || value > MAX_AMOUNT) {
    throw new RangeError(`${label} debe ser mayor que cero.`);
  }
}

function validateNonNegativeAmount(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0 || value > MAX_AMOUNT) {
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
