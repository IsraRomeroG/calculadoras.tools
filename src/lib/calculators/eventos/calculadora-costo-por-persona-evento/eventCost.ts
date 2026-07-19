export const EVENT_COST_CANONICAL_PATH =
  "/eventos/calculadora-costo-por-persona-evento";

export const EVENT_COST_CATEGORIES = [
  "lugar",
  "comida",
  "bebidas",
  "personal",
  "mobiliario",
  "entretenimiento",
  "invitaciones",
  "transporte",
  "limpieza",
  "otro",
] as const;

export const EVENT_TYPES = [
  "fiesta",
  "cena",
  "reunion",
  "corporativo",
  "boda_celebracion",
  "otro",
] as const;

export const EVENT_COST_ITEM_TYPES = ["fijo", "por_invitado"] as const;
export const EVENT_ROUNDING_OPTIONS = [0, 10, 50, 100] as const;
export const DEFAULT_SCENARIO_FACTORS = [0.8, 1, 1.2] as const;

export type EventCostCategory = (typeof EVENT_COST_CATEGORIES)[number];
export type EventType = (typeof EVENT_TYPES)[number];
export type EventCostItemType = (typeof EVENT_COST_ITEM_TYPES)[number];
export type EventCostMode = "costo_por_persona" | "invitados_posibles";

export const EVENT_COST_CATEGORY_LABELS: Record<EventCostCategory, string> = {
  lugar: "Lugar",
  comida: "Comida",
  bebidas: "Bebidas",
  personal: "Personal",
  mobiliario: "Mobiliario",
  entretenimiento: "Entretenimiento",
  invitaciones: "Invitaciones",
  transporte: "Transporte",
  limpieza: "Limpieza",
  otro: "Otro",
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  fiesta: "Fiesta",
  cena: "Cena",
  reunion: "Reunion",
  corporativo: "Corporativo",
  boda_celebracion: "Boda o celebracion",
  otro: "Otro",
};

export const EVENT_COST_ITEM_TYPE_LABELS: Record<EventCostItemType, string> = {
  fijo: "Gasto fijo",
  por_invitado: "Costo por invitado",
};

export interface EventCostItem {
  id: string;
  type: EventCostItemType;
  name: string;
  category: EventCostCategory;
  amount: number;
  notes?: string;
}

export interface EventCostInput {
  mode: EventCostMode;
  eventName?: string;
  eventType?: EventType;
  guestCount?: number;
  availableBudget?: number;
  contingencyPercentage: number;
  roundingIncrement: number;
  items: EventCostItem[];
  scenarioFactors?: readonly number[];
}

export interface EventCostCalculatedItem extends EventCostItem {
  name: string;
  totalAtReferenceGuests: number;
  percentageOfSubtotal: number;
}

export interface EventCostCategorySubtotal {
  category: EventCostCategory;
  label: string;
  subtotal: number;
  percentageOfSubtotal: number;
}

export interface EventCostScenario {
  factor: number;
  guestCount: number;
  total: number;
  costPerPerson: number;
  suggestedContribution: number;
}

export type PossibleGuestState =
  | "not_requested"
  | "calculable"
  | "budget_below_fixed_costs"
  | "unlimited_by_variable_cost";

export interface EventCostResult {
  items: EventCostCalculatedItem[];
  fixedTotal: number;
  variableUnitCost: number;
  variableTotal?: number;
  subtotal?: number;
  contingencyAmount?: number;
  total?: number;
  costPerPerson?: number;
  suggestedContribution?: number;
  contributionSurplus?: number;
  availableBudget?: number;
  budgetDifference?: number;
  budgetUsedPercentage?: number;
  possibleGuestState: PossibleGuestState;
  possibleGuests?: number;
  possibleGuestsTotal?: number;
  possibleGuestsBudgetRemaining?: number;
  categoryBreakdown: EventCostCategorySubtotal[];
  topItems: EventCostCalculatedItem[];
  scenarios: EventCostScenario[];
  isEmptyEstimate: boolean;
}

export type ParseEventCostNumberResult =
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
const MAX_GUESTS = 10_000;
const DEFAULT_LOCALE = "es-MX";
const DEFAULT_CURRENCY = "MXN";

export function calculateEventCost(
  input: EventCostInput,
): EventCostResult {
  validateInput(input);

  const normalizedItems = input.items.map(normalizeItem);
  const fixedTotal = sum(
    normalizedItems
      .filter((item) => item.type === "fijo")
      .map((item) => item.amount),
  );
  const variableUnitCost = sum(
    normalizedItems
      .filter((item) => item.type === "por_invitado")
      .map((item) => item.amount),
  );
  const factor = 1 + input.contingencyPercentage / 100;
  const hasGuestCount = typeof input.guestCount === "number";
  const guestCount = hasGuestCount ? input.guestCount : undefined;
  const costMetrics =
    guestCount !== undefined
      ? buildCostMetrics({
          fixedTotal,
          variableUnitCost,
          guestCount,
          contingencyPercentage: input.contingencyPercentage,
          roundingIncrement: input.roundingIncrement,
          availableBudget: input.availableBudget,
        })
      : {};
  const possibleGuestMetrics = buildPossibleGuestMetrics({
    fixedTotal,
    variableUnitCost,
    availableBudget: input.availableBudget,
    factor,
    requested: input.mode === "invitados_posibles",
  });
  const referenceGuests =
    guestCount ??
    (possibleGuestMetrics.possibleGuestState === "calculable"
      ? possibleGuestMetrics.possibleGuests
      : undefined) ??
    1;
  const items = normalizedItems.map((item) => ({
    ...item,
    totalAtReferenceGuests:
      item.type === "por_invitado" ? item.amount * referenceGuests : item.amount,
    percentageOfSubtotal: 0,
  }));
  const referenceSubtotal = sum(
    items.map((item) => item.totalAtReferenceGuests),
  );

  items.forEach((item) => {
    item.percentageOfSubtotal =
      referenceSubtotal > 0 ? (item.totalAtReferenceGuests / referenceSubtotal) * 100 : 0;
  });

  return {
    items,
    fixedTotal,
    variableUnitCost,
    ...costMetrics,
    ...possibleGuestMetrics,
    categoryBreakdown: buildCategoryBreakdown(items, referenceSubtotal),
    topItems: [...items]
      .filter((item) => item.totalAtReferenceGuests > 0)
      .sort(
        (a, b) =>
          b.totalAtReferenceGuests - a.totalAtReferenceGuests ||
          a.name.localeCompare(b.name, DEFAULT_LOCALE),
      )
      .slice(0, 3),
    scenarios:
      guestCount !== undefined
        ? buildScenarios({
            fixedTotal,
            variableUnitCost,
            guestCount,
            factor,
            roundingIncrement: input.roundingIncrement,
            scenarioFactors: input.scenarioFactors ?? DEFAULT_SCENARIO_FACTORS,
          })
        : [],
    isEmptyEstimate: fixedTotal === 0 && variableUnitCost === 0,
  };
}

export function parseEventCostNumberInput(
  value: string,
): ParseEventCostNumberResult {
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

export function formatEventCostCurrency(value: number) {
  assertFinite(value, "importe");

  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: "currency",
    currency: DEFAULT_CURRENCY,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 2,
  }).format(roundToPrecision(value, 2));
}

export function formatEventCostNumber(value: number, maximumFractionDigits = 2) {
  assertFinite(value, "numero");

  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    maximumFractionDigits,
  }).format(roundToPrecision(value, maximumFractionDigits));
}

export function getPossibleGuestLabel(result: EventCostResult) {
  if (result.possibleGuestState === "budget_below_fixed_costs") {
    return "0 invitados";
  }

  if (result.possibleGuestState === "unlimited_by_variable_cost") {
    return "Sin limite por costo variable";
  }

  if (result.possibleGuestState === "calculable") {
    return `${formatEventCostNumber(result.possibleGuests ?? 0, 0)} invitados`;
  }

  return "No calculado";
}

export function buildEventCostShareText(
  result: EventCostResult,
  input: EventCostInput,
) {
  const lines = [
    input.eventName?.trim()
      ? `Costo de evento: ${input.eventName.trim()}`
      : "Costo por persona en evento",
    `Tipo: ${EVENT_TYPE_LABELS[input.eventType ?? "otro"]}`,
  ];

  if (typeof input.guestCount === "number") {
    lines.push(`Invitados: ${formatEventCostNumber(input.guestCount, 0)}`);
  }

  if (typeof input.availableBudget === "number") {
    lines.push(
      `Presupuesto disponible: ${formatEventCostCurrency(input.availableBudget)}`,
    );
  }

  lines.push(
    `Gastos fijos: ${formatEventCostCurrency(result.fixedTotal)}`,
    `Costo variable por invitado: ${formatEventCostCurrency(result.variableUnitCost)}`,
  );

  if (typeof result.total === "number") {
    lines.push(
      `Subtotal: ${formatEventCostCurrency(result.subtotal ?? 0)}`,
      `Contingencia (${formatEventCostNumber(input.contingencyPercentage)}%): ${formatEventCostCurrency(result.contingencyAmount ?? 0)}`,
      `Total: ${formatEventCostCurrency(result.total)}`,
      `Costo por persona: ${formatEventCostCurrency(result.costPerPerson ?? 0)}`,
      `Cuota sugerida: ${formatEventCostCurrency(result.suggestedContribution ?? 0)}`,
    );
  }

  if (typeof result.budgetDifference === "number") {
    lines.push(
      result.budgetDifference >= 0
        ? `Sobrante contra presupuesto: ${formatEventCostCurrency(result.budgetDifference)}`
        : `Faltante contra presupuesto: ${formatEventCostCurrency(Math.abs(result.budgetDifference))}`,
    );
  }

  if (input.mode === "invitados_posibles") {
    lines.push(`Invitados posibles: ${getPossibleGuestLabel(result)}`);

    if (typeof result.possibleGuestsBudgetRemaining === "number") {
      lines.push(
        `Sobrante estimado: ${formatEventCostCurrency(result.possibleGuestsBudgetRemaining)}`,
      );
    }
  }

  if (result.topItems.length) {
    lines.push(
      "",
      "Partidas mas altas:",
      ...result.topItems.map(
        (item) =>
          `- ${item.name}: ${formatEventCostCurrency(item.totalAtReferenceGuests)}`,
      ),
    );
  }

  lines.push(
    "",
    "Estimacion preliminar con costos capturados manualmente en calculadoras.tools.",
  );

  return lines.join("\n");
}

export function buildEventCostCsv(
  result: EventCostResult,
  input: EventCostInput,
) {
  const rows: string[][] = [
    ["tipo_partida", "nombre", "categoria", "importe", "notas"],
    ...result.items.map((item) => [
      EVENT_COST_ITEM_TYPE_LABELS[item.type],
      item.name,
      EVENT_COST_CATEGORY_LABELS[item.category],
      formatCsvNumber(item.amount),
      item.notes ?? "",
    ]),
    [],
    ["concepto", "valor", "", "", ""],
    ["nombre_evento", input.eventName?.trim() ?? "", "", "", ""],
    ["tipo_evento", EVENT_TYPE_LABELS[input.eventType ?? "otro"], "", "", ""],
    ["modo", input.mode, "", "", ""],
    ["gastos_fijos", formatCsvNumber(result.fixedTotal), "", "", ""],
    [
      "costo_variable_unitario",
      formatCsvNumber(result.variableUnitCost),
      "",
      "",
      "",
    ],
    ["contingencia_porcentaje", formatCsvNumber(input.contingencyPercentage), "", "", ""],
  ];

  if (typeof input.guestCount === "number") {
    rows.push(["invitados", formatCsvNumber(input.guestCount), "", "", ""]);
  }

  if (typeof input.availableBudget === "number") {
    rows.push(
      ["presupuesto_disponible", formatCsvNumber(input.availableBudget), "", "", ""],
    );
  }

  if (typeof result.total === "number") {
    rows.push(
      ["subtotal", formatCsvNumber(result.subtotal ?? 0), "", "", ""],
      ["costo_total", formatCsvNumber(result.total), "", "", ""],
      [
        "costo_por_persona",
        formatCsvNumber(result.costPerPerson ?? 0),
        "",
        "",
        "",
      ],
      [
        "cuota_sugerida",
        formatCsvNumber(result.suggestedContribution ?? 0),
        "",
        "",
        "",
      ],
    );
  }

  if (input.mode === "invitados_posibles") {
    rows.push(
      ["estado_invitados_posibles", result.possibleGuestState, "", "", ""],
      [
        "invitados_posibles",
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

function buildCostMetrics({
  fixedTotal,
  variableUnitCost,
  guestCount,
  contingencyPercentage,
  roundingIncrement,
  availableBudget,
}: {
  fixedTotal: number;
  variableUnitCost: number;
  guestCount: number;
  contingencyPercentage: number;
  roundingIncrement: number;
  availableBudget?: number;
}) {
  const variableTotal = variableUnitCost * guestCount;
  const subtotal = fixedTotal + variableTotal;
  const contingencyAmount = subtotal * (contingencyPercentage / 100);
  const total = subtotal + contingencyAmount;
  const costPerPerson = total / guestCount;
  const suggestedContribution = roundContribution(
    costPerPerson,
    roundingIncrement,
  );
  const contributionSurplus = suggestedContribution * guestCount - total;
  const budgetMetrics =
    typeof availableBudget === "number"
      ? {
          availableBudget,
          budgetDifference: availableBudget - total,
          ...(availableBudget > 0
            ? { budgetUsedPercentage: (total / availableBudget) * 100 }
            : {}),
        }
      : {};

  return {
    variableTotal,
    subtotal,
    contingencyAmount,
    total,
    costPerPerson,
    suggestedContribution,
    contributionSurplus,
    ...budgetMetrics,
  };
}

function buildPossibleGuestMetrics({
  fixedTotal,
  variableUnitCost,
  availableBudget,
  factor,
  requested,
}: {
  fixedTotal: number;
  variableUnitCost: number;
  availableBudget?: number;
  factor: number;
  requested: boolean;
}) {
  if (!requested || typeof availableBudget !== "number") {
    return { possibleGuestState: "not_requested" as const };
  }

  const budgetBeforeContingency = availableBudget / factor;
  const baseForVariables = budgetBeforeContingency - fixedTotal;

  if (baseForVariables < 0) {
    const possibleGuestsTotal = roundMoney(fixedTotal * factor);

    return {
      availableBudget,
      possibleGuestState: "budget_below_fixed_costs" as const,
      possibleGuests: 0,
      possibleGuestsTotal,
      possibleGuestsBudgetRemaining: roundMoney(
        availableBudget - possibleGuestsTotal,
      ),
    };
  }

  if (variableUnitCost === 0) {
    const possibleGuestsTotal = roundMoney(fixedTotal * factor);

    return {
      availableBudget,
      possibleGuestState: "unlimited_by_variable_cost" as const,
      possibleGuestsTotal,
      possibleGuestsBudgetRemaining: roundMoney(
        availableBudget - possibleGuestsTotal,
      ),
    };
  }

  const possibleGuests = Math.max(
    0,
    Math.floor(baseForVariables / variableUnitCost),
  );
  const possibleGuestsTotal = roundMoney(
    (fixedTotal + variableUnitCost * possibleGuests) * factor,
  );

  return {
    availableBudget,
    possibleGuestState: "calculable" as const,
    possibleGuests,
    possibleGuestsTotal,
    possibleGuestsBudgetRemaining: roundMoney(
      availableBudget - possibleGuestsTotal,
    ),
  };
}

function buildScenarios({
  fixedTotal,
  variableUnitCost,
  guestCount,
  factor,
  roundingIncrement,
  scenarioFactors,
}: {
  fixedTotal: number;
  variableUnitCost: number;
  guestCount: number;
  factor: number;
  roundingIncrement: number;
  scenarioFactors: readonly number[];
}) {
  return scenarioFactors.map((scenarioFactor) => {
    const scenarioGuests = Math.max(1, Math.round(guestCount * scenarioFactor));
    const total = (fixedTotal + variableUnitCost * scenarioGuests) * factor;
    const costPerPerson = total / scenarioGuests;

    return {
      factor: scenarioFactor,
      guestCount: scenarioGuests,
      total,
      costPerPerson,
      suggestedContribution: roundContribution(
        costPerPerson,
        roundingIncrement,
      ),
    };
  });
}

function buildCategoryBreakdown(
  items: EventCostCalculatedItem[],
  subtotal: number,
) {
  const subtotals = Object.fromEntries(
    EVENT_COST_CATEGORIES.map((category) => [category, 0]),
  ) as Record<EventCostCategory, number>;

  items.forEach((item) => {
    subtotals[item.category] += item.totalAtReferenceGuests;
  });

  return EVENT_COST_CATEGORIES.map((category) => ({
    category,
    label: EVENT_COST_CATEGORY_LABELS[category],
    subtotal: subtotals[category],
    percentageOfSubtotal:
      subtotal > 0 ? (subtotals[category] / subtotal) * 100 : 0,
  }))
    .filter((category) => category.subtotal > 0)
    .sort(
      (a, b) =>
        b.subtotal - a.subtotal || a.label.localeCompare(b.label, DEFAULT_LOCALE),
    );
}

function validateInput(input: EventCostInput) {
  if (!["costo_por_persona", "invitados_posibles"].includes(input.mode)) {
    throw new RangeError("Modo de calculo no soportado.");
  }

  if (
    input.eventType !== undefined &&
    !EVENT_TYPES.includes(input.eventType)
  ) {
    throw new RangeError("Tipo de evento no soportado.");
  }

  if (input.eventName !== undefined && input.eventName.trim().length > 80) {
    throw new RangeError("El nombre del evento debe tener 80 caracteres o menos.");
  }

  validatePercentage(input.contingencyPercentage, "contingencia");
  validateRounding(input.roundingIncrement);

  if (input.mode === "costo_por_persona") {
    validatePositiveInteger(input.guestCount, "invitados", MAX_GUESTS);
  } else {
    validatePositiveAmount(input.availableBudget, "presupuesto disponible");
  }

  if (typeof input.guestCount === "number") {
    validatePositiveInteger(input.guestCount, "invitados", MAX_GUESTS);
  }

  if (typeof input.availableBudget === "number") {
    validateNonNegativeAmount(input.availableBudget, "presupuesto disponible");
  }

  if (input.items.length > MAX_ITEMS) {
    throw new RangeError(`No se permiten mas de ${MAX_ITEMS} partidas.`);
  }

  input.items.forEach(validateItem);
}

function validateItem(item: EventCostItem) {
  if (!EVENT_COST_ITEM_TYPES.includes(item.type)) {
    throw new RangeError("Tipo de partida no soportado.");
  }

  if (!EVENT_COST_CATEGORIES.includes(item.category)) {
    throw new RangeError("Categoria de evento no soportada.");
  }

  if (item.name.trim().length > 80) {
    throw new RangeError("El nombre de partida debe tener 80 caracteres o menos.");
  }

  if (item.notes && item.notes.trim().length > 140) {
    throw new RangeError("Las notas deben tener 140 caracteres o menos.");
  }

  validateNonNegativeAmount(item.amount, `importe de ${item.name || "partida"}`);
}

function normalizeItem(item: EventCostItem, index: number) {
  const fallbackName =
    item.type === "fijo" ? `Gasto fijo ${index + 1}` : `Por invitado ${index + 1}`;

  return {
    ...item,
    name: item.name.trim() || fallbackName,
    notes: item.notes?.trim(),
  };
}

function validatePercentage(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError(`${label} debe estar entre 0 y 100.`);
  }
}

function validateRounding(value: number) {
  if (!Number.isFinite(value) || value < 0 || value > 100_000) {
    throw new RangeError("El redondeo de cuota debe ser mayor o igual que cero.");
  }
}

function validatePositiveInteger(
  value: unknown,
  label: string,
  maximum: number,
): asserts value is number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value <= 0 ||
    value > maximum
  ) {
    throw new RangeError(`${label} debe ser un entero positivo.`);
  }
}

function validatePositiveAmount(
  value: unknown,
  label: string,
): asserts value is number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} debe ser mayor que cero.`);
  }
}

function validateNonNegativeAmount(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0 || value > MAX_AMOUNT) {
    throw new RangeError(`${label} debe ser mayor o igual que cero.`);
  }
}

function roundContribution(value: number, increment: number) {
  if (increment <= 0) {
    return value;
  }

  return Math.ceil(value / increment) * increment;
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

function roundMoney(value: number) {
  return roundToPrecision(value, 6);
}
