export const VEHICLE_ANNUAL_COSTS_CANONICAL_PATH =
  "/vehiculos/calculadora-de-gastos-anuales-del-vehiculo";

export const VEHICLE_ANNUAL_COST_CATEGORIES = [
  "servicio",
  "llantas",
  "seguro",
  "impuestos_verificacion",
  "reparacion",
  "estacionamiento_peajes",
  "lavado_accesorios",
  "otro",
] as const;

export const VEHICLE_ANNUAL_COST_GROUPS = [
  "mantenimiento",
  "propiedad",
  "uso",
] as const;

export const VEHICLE_ANNUAL_COST_FREQUENCIES = [
  "mensual",
  "anual",
  "cada_n_meses",
  "cada_n_km",
] as const;

export type VehicleAnnualCostCategory =
  (typeof VEHICLE_ANNUAL_COST_CATEGORIES)[number];
export type VehicleAnnualCostGroup =
  (typeof VEHICLE_ANNUAL_COST_GROUPS)[number];
export type VehicleAnnualCostFrequency =
  (typeof VEHICLE_ANNUAL_COST_FREQUENCIES)[number];

export const VEHICLE_ANNUAL_COST_CATEGORY_LABELS: Record<
  VehicleAnnualCostCategory,
  string
> = {
  servicio: "Servicio",
  llantas: "Llantas",
  seguro: "Seguro",
  impuestos_verificacion: "Impuestos y verificacion",
  reparacion: "Reparacion",
  estacionamiento_peajes: "Estacionamiento y peajes",
  lavado_accesorios: "Lavado y accesorios",
  otro: "Otro",
};

export const VEHICLE_ANNUAL_COST_GROUP_LABELS: Record<
  VehicleAnnualCostGroup,
  string
> = {
  mantenimiento: "Mantenimiento",
  propiedad: "Propiedad",
  uso: "Uso",
};

export const VEHICLE_ANNUAL_COST_FREQUENCY_LABELS: Record<
  VehicleAnnualCostFrequency,
  string
> = {
  mensual: "Mensual",
  anual: "Anual",
  cada_n_meses: "Cada N meses",
  cada_n_km: "Cada N km",
};

export const DEFAULT_CATEGORY_GROUP: Record<
  VehicleAnnualCostCategory,
  VehicleAnnualCostGroup
> = {
  servicio: "mantenimiento",
  llantas: "mantenimiento",
  reparacion: "mantenimiento",
  seguro: "propiedad",
  impuestos_verificacion: "propiedad",
  estacionamiento_peajes: "uso",
  lavado_accesorios: "uso",
  otro: "uso",
};

export interface VehicleAnnualCostItem {
  id: string;
  name: string;
  category: VehicleAnnualCostCategory;
  group?: VehicleAnnualCostGroup;
  amount: number;
  frequency: VehicleAnnualCostFrequency;
  interval?: number;
  notes?: string;
  amountMissing?: boolean;
}

export interface VehicleAnnualCostsInput {
  vehicleName?: string;
  annualKilometers: number;
  items: VehicleAnnualCostItem[];
  currency?: string;
}

export interface VehicleAnnualCostCalculatedItem extends VehicleAnnualCostItem {
  name: string;
  group: VehicleAnnualCostGroup;
  interval?: number;
  eventsTheoretical: number;
  eventsPractical: number;
  averageAnnualCost: number;
  practicalAnnualCost: number;
  averageMonthlyCost: number;
  practicalMonthlyCost: number;
  averageCostPerKm: number | null;
  practicalCostPerKm: number | null;
  incomplete: boolean;
}

export interface VehicleAnnualCostBreakdown {
  id: string;
  label: string;
  subtotalAverage: number;
  subtotalPractical: number;
  percentageOfAverageTotal: number | null;
}

export interface VehicleAnnualCostsResult {
  vehicleName?: string;
  annualKilometers: number;
  items: VehicleAnnualCostCalculatedItem[];
  totalAnnualAverage: number;
  practicalAnnualReserve: number;
  averageMonthlyCost: number;
  suggestedMonthlyReserve: number;
  averageCostPerKm: number | null;
  practicalCostPerKm: number | null;
  groupBreakdown: VehicleAnnualCostBreakdown[];
  categoryBreakdown: VehicleAnnualCostBreakdown[];
  topItems: VehicleAnnualCostCalculatedItem[];
  incompleteItems: VehicleAnnualCostCalculatedItem[];
  hasPracticalDifference: boolean;
  isEmptyEstimate: boolean;
  currency: string;
}

export type ParseVehicleAnnualCostNumberResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_large";
    };

const MAX_ITEMS = 100;
const MAX_AMOUNT = 1_000_000_000_000;
const MAX_KILOMETERS = 10_000_000;
const DEFAULT_LOCALE = "es-MX";
const DEFAULT_CURRENCY = "MXN";

export function calculateVehicleAnnualCosts(
  input: VehicleAnnualCostsInput,
): VehicleAnnualCostsResult {
  validateInput(input);

  const items = input.items.map((item, index) => calculateItem(item, input, index));
  const totalAnnualAverage = sum(items.map((item) => item.averageAnnualCost));
  const practicalAnnualReserve = sum(items.map((item) => item.practicalAnnualCost));
  const averageMonthlyCost = totalAnnualAverage / 12;
  const suggestedMonthlyReserve = practicalAnnualReserve / 12;
  const averageCostPerKm =
    input.annualKilometers > 0 ? totalAnnualAverage / input.annualKilometers : null;
  const practicalCostPerKm =
    input.annualKilometers > 0
      ? practicalAnnualReserve / input.annualKilometers
      : null;

  return {
    vehicleName: input.vehicleName?.trim() || undefined,
    annualKilometers: input.annualKilometers,
    items,
    totalAnnualAverage,
    practicalAnnualReserve,
    averageMonthlyCost,
    suggestedMonthlyReserve,
    averageCostPerKm,
    practicalCostPerKm,
    groupBreakdown: buildGroupBreakdown(items, totalAnnualAverage),
    categoryBreakdown: buildCategoryBreakdown(items, totalAnnualAverage),
    topItems: [...items]
      .filter((item) => item.averageAnnualCost > 0)
      .sort(
        (a, b) =>
          b.averageAnnualCost - a.averageAnnualCost ||
          a.name.localeCompare(b.name, DEFAULT_LOCALE),
      )
      .slice(0, 3),
    incompleteItems: items.filter((item) => item.incomplete),
    hasPracticalDifference: items.some(
      (item) =>
        Math.abs(item.practicalAnnualCost - item.averageAnnualCost) > 0.000001,
    ),
    isEmptyEstimate: totalAnnualAverage === 0 && practicalAnnualReserve === 0,
    currency: input.currency ?? DEFAULT_CURRENCY,
  };
}

export function parseVehicleAnnualCostNumberInput(
  value: string,
): ParseVehicleAnnualCostNumberResult {
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

export function formatVehicleAnnualCostCurrency(
  value: number,
  currency = DEFAULT_CURRENCY,
) {
  assertFinite(value, "importe");

  try {
    return new Intl.NumberFormat(DEFAULT_LOCALE, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 2,
    }).format(roundToPrecision(value, 2));
  } catch {
    return `${formatVehicleAnnualCostNumber(value)} ${currency}`;
  }
}

export function formatVehicleAnnualCostNumber(
  value: number,
  maximumFractionDigits = 2,
) {
  assertFinite(value, "numero");

  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    maximumFractionDigits,
  }).format(roundToPrecision(value, maximumFractionDigits));
}

export function buildVehicleAnnualCostsShareText(
  result: VehicleAnnualCostsResult,
) {
  const lines = [
    result.vehicleName
      ? `Gastos anuales del vehiculo: ${result.vehicleName}`
      : "Gastos anuales del vehiculo",
    `Kilometros anuales: ${formatVehicleAnnualCostNumber(
      result.annualKilometers,
      0,
    )}`,
    `Costo anual promedio: ${formatVehicleAnnualCostCurrency(
      result.totalAnnualAverage,
      result.currency,
    )}`,
    `Reserva anual practica: ${formatVehicleAnnualCostCurrency(
      result.practicalAnnualReserve,
      result.currency,
    )}`,
    `Promedio mensual: ${formatVehicleAnnualCostCurrency(
      result.averageMonthlyCost,
      result.currency,
    )}`,
    `Reserva mensual sugerida: ${formatVehicleAnnualCostCurrency(
      result.suggestedMonthlyReserve,
      result.currency,
    )}`,
  ];

  if (result.averageCostPerKm !== null) {
    lines.push(
      `Costo por km promedio: ${formatVehicleAnnualCostCurrency(
        result.averageCostPerKm,
        result.currency,
      )}/km`,
    );
  }

  if (result.topItems.length) {
    lines.push(
      "",
      "Partidas mas altas:",
      ...result.topItems.map(
        (item) =>
          `- ${item.name}: ${formatVehicleAnnualCostCurrency(
            item.averageAnnualCost,
            result.currency,
          )} promedio anual`,
      ),
    );
  }

  if (result.incompleteItems.length) {
    lines.push(
      "",
      `Partidas incompletas: ${result.incompleteItems.length}`,
    );
  }

  lines.push(
    "",
    "Estimacion con gastos capturados manualmente. No incluye combustible ni depreciacion salvo que los agregues como partidas.",
  );

  return lines.join("\n");
}

export function buildVehicleAnnualCostsCsv(result: VehicleAnnualCostsResult) {
  const rows: string[][] = [
    [
      "nombre",
      "categoria",
      "grupo",
      "costo_evento",
      "frecuencia",
      "intervalo",
      "notas",
      "eventos_teoricos",
      "eventos_practicos",
      "costo_anual_promedio",
      "costo_anual_practico",
    ],
    ...result.items.map((item) => [
      item.name,
      VEHICLE_ANNUAL_COST_CATEGORY_LABELS[item.category],
      VEHICLE_ANNUAL_COST_GROUP_LABELS[item.group],
      formatCsvNumber(item.amount),
      VEHICLE_ANNUAL_COST_FREQUENCY_LABELS[item.frequency],
      item.interval === undefined ? "" : formatCsvNumber(item.interval),
      item.notes ?? "",
      formatCsvNumber(item.eventsTheoretical),
      formatCsvNumber(item.eventsPractical),
      formatCsvNumber(item.averageAnnualCost),
      formatCsvNumber(item.practicalAnnualCost),
    ]),
    [],
    ["concepto", "valor", "", "", "", "", "", "", "", "", ""],
    ["nombre_vehiculo", result.vehicleName ?? "", "", "", "", "", "", "", "", "", ""],
    [
      "kilometros_anuales",
      formatCsvNumber(result.annualKilometers),
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
    [
      "total_anual_promedio",
      formatCsvNumber(result.totalAnnualAverage),
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
    [
      "reserva_anual_practica",
      formatCsvNumber(result.practicalAnnualReserve),
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
    [
      "promedio_mensual",
      formatCsvNumber(result.averageMonthlyCost),
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
    [
      "reserva_mensual_sugerida",
      formatCsvNumber(result.suggestedMonthlyReserve),
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
    [
      "costo_por_km_promedio",
      result.averageCostPerKm === null ? "" : formatCsvNumber(result.averageCostPerKm),
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
    [
      "costo_por_km_practico",
      result.practicalCostPerKm === null
        ? ""
        : formatCsvNumber(result.practicalCostPerKm),
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
  ];

  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
}

function calculateItem(
  item: VehicleAnnualCostItem,
  input: VehicleAnnualCostsInput,
  index: number,
): VehicleAnnualCostCalculatedItem {
  const normalizedItem = normalizeItem(item, index);
  const eventsTheoretical = getEventsTheoretical(
    normalizedItem.frequency,
    input.annualKilometers,
    normalizedItem.interval,
  );
  const eventsPractical =
    normalizedItem.frequency === "cada_n_meses" ||
    normalizedItem.frequency === "cada_n_km"
      ? Math.ceil(eventsTheoretical)
      : eventsTheoretical;
  const averageAnnualCost = normalizedItem.amount * eventsTheoretical;
  const practicalAnnualCost = normalizedItem.amount * eventsPractical;

  return {
    ...normalizedItem,
    eventsTheoretical,
    eventsPractical,
    averageAnnualCost,
    practicalAnnualCost,
    averageMonthlyCost: averageAnnualCost / 12,
    practicalMonthlyCost: practicalAnnualCost / 12,
    averageCostPerKm:
      input.annualKilometers > 0 ? averageAnnualCost / input.annualKilometers : null,
    practicalCostPerKm:
      input.annualKilometers > 0 ? practicalAnnualCost / input.annualKilometers : null,
    incomplete: Boolean(normalizedItem.amountMissing),
  };
}

function getEventsTheoretical(
  frequency: VehicleAnnualCostFrequency,
  annualKilometers: number,
  interval?: number,
) {
  if (frequency === "mensual") return 12;
  if (frequency === "anual") return 1;

  if (typeof interval !== "number" || !Number.isFinite(interval) || interval <= 0) {
    throw new RangeError("El intervalo debe ser mayor que cero.");
  }

  if (frequency === "cada_n_meses") return 12 / interval;

  if (annualKilometers <= 0) {
    throw new RangeError(
      "Los gastos por kilometraje requieren kilometros anuales mayores que cero.",
    );
  }

  return annualKilometers / interval;
}

function buildGroupBreakdown(
  items: VehicleAnnualCostCalculatedItem[],
  totalAnnualAverage: number,
) {
  return VEHICLE_ANNUAL_COST_GROUPS.map((group) => {
    const groupItems = items.filter((item) => item.group === group);
    const subtotalAverage = sum(groupItems.map((item) => item.averageAnnualCost));
    const subtotalPractical = sum(groupItems.map((item) => item.practicalAnnualCost));

    return {
      id: group,
      label: VEHICLE_ANNUAL_COST_GROUP_LABELS[group],
      subtotalAverage,
      subtotalPractical,
      percentageOfAverageTotal:
        totalAnnualAverage > 0 ? (subtotalAverage / totalAnnualAverage) * 100 : null,
    };
  }).filter((breakdown) => breakdown.subtotalAverage > 0);
}

function buildCategoryBreakdown(
  items: VehicleAnnualCostCalculatedItem[],
  totalAnnualAverage: number,
) {
  return VEHICLE_ANNUAL_COST_CATEGORIES.map((category) => {
    const categoryItems = items.filter((item) => item.category === category);
    const subtotalAverage = sum(
      categoryItems.map((item) => item.averageAnnualCost),
    );
    const subtotalPractical = sum(
      categoryItems.map((item) => item.practicalAnnualCost),
    );

    return {
      id: category,
      label: VEHICLE_ANNUAL_COST_CATEGORY_LABELS[category],
      subtotalAverage,
      subtotalPractical,
      percentageOfAverageTotal:
        totalAnnualAverage > 0 ? (subtotalAverage / totalAnnualAverage) * 100 : null,
    };
  })
    .filter((breakdown) => breakdown.subtotalAverage > 0)
    .sort(
      (a, b) =>
        b.subtotalAverage - a.subtotalAverage ||
        a.label.localeCompare(b.label, DEFAULT_LOCALE),
    );
}

function validateInput(input: VehicleAnnualCostsInput) {
  if (!Number.isFinite(input.annualKilometers) || input.annualKilometers < 0) {
    throw new RangeError("Los kilometros anuales deben ser mayores o iguales a cero.");
  }

  if (input.annualKilometers > MAX_KILOMETERS) {
    throw new RangeError("Los kilometros anuales son demasiado altos.");
  }

  if (input.vehicleName !== undefined && input.vehicleName.trim().length > 80) {
    throw new RangeError("El nombre del vehiculo debe tener 80 caracteres o menos.");
  }

  if (input.items.length > MAX_ITEMS) {
    throw new RangeError(`No se permiten mas de ${MAX_ITEMS} partidas.`);
  }

  input.items.forEach(validateItem);
}

function validateItem(item: VehicleAnnualCostItem) {
  if (!VEHICLE_ANNUAL_COST_CATEGORIES.includes(item.category)) {
    throw new RangeError("Categoria de vehiculo no soportada.");
  }

  if (
    item.group !== undefined &&
    !VEHICLE_ANNUAL_COST_GROUPS.includes(item.group)
  ) {
    throw new RangeError("Grupo de gasto no soportado.");
  }

  if (!VEHICLE_ANNUAL_COST_FREQUENCIES.includes(item.frequency)) {
    throw new RangeError("Frecuencia no soportada.");
  }

  if (!Number.isFinite(item.amount) || item.amount < 0 || item.amount > MAX_AMOUNT) {
    throw new RangeError("El costo por evento debe ser mayor o igual a cero.");
  }

  if (item.name.trim().length > 80) {
    throw new RangeError("El nombre del gasto debe tener 80 caracteres o menos.");
  }

  if (item.notes && item.notes.trim().length > 140) {
    throw new RangeError("Las notas deben tener 140 caracteres o menos.");
  }
}

function normalizeItem(
  item: VehicleAnnualCostItem,
  index: number,
): VehicleAnnualCostItem & {
  name: string;
  group: VehicleAnnualCostGroup;
  notes?: string;
} {
  const name = item.name.trim() || `Gasto ${index + 1}`;
  const group = item.group ?? DEFAULT_CATEGORY_GROUP[item.category];

  return {
    ...item,
    name,
    group,
    notes: item.notes?.trim() || undefined,
    interval:
      item.frequency === "mensual" || item.frequency === "anual"
        ? undefined
        : item.interval,
  };
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
    throw new RangeError(`El ${label} debe ser finito.`);
  }
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function roundToPrecision(value: number, decimals: number) {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}
