export const USER_MODES = ["buyer", "seller", "both"] as const;
export const COST_TYPES = ["percent", "fixed"] as const;
export const RESPONSIBILITIES = ["buyer", "seller"] as const;

export type UserMode = (typeof USER_MODES)[number];
export type CostType = (typeof COST_TYPES)[number];
export type Responsibility = (typeof RESPONSIBILITIES)[number];

export interface ClosingCostItem {
  id?: string;
  name: string;
  type: CostType;
  value: number;
  responsible: Responsibility;
}

export interface CalculatedClosingCostItem extends ClosingCostItem {
  id: string;
  amount: number;
  percentOfPrice: number;
}

export interface ClosingCostsInput {
  propertyPrice: number;
  downPayment?: number;
  reservePercent?: number;
  items?: readonly ClosingCostItem[];
}

export interface ClosingCostsResult {
  propertyPrice: number;
  downPayment: number;
  reservePercent: number;
  reserveAmount: number;
  buyerCosts: number;
  sellerCosts: number;
  totalCosts: number;
  totalCostPercent: number;
  additionalCashToDownPayment: number;
  buyerCashRequired: number;
  sellerNet: number;
  items: CalculatedClosingCostItem[];
  impactItems: CalculatedClosingCostItem[];
  warnings: string[];
}

export const USER_MODE_LABELS: Record<UserMode, string> = {
  buyer: "Comprador",
  seller: "Vendedor",
  both: "Ambos",
};

export const COST_TYPE_LABELS: Record<CostType, string> = {
  percent: "Porcentaje",
  fixed: "Monto fijo",
};

export const RESPONSIBILITY_LABELS: Record<Responsibility, string> = {
  buyer: "Comprador",
  seller: "Vendedor",
};

export const SUGGESTED_CLOSING_COSTS = [
  {
    name: "Impuesto de adquisicion",
    type: "percent",
    responsible: "buyer",
  },
  {
    name: "Honorarios notariales",
    type: "percent",
    responsible: "buyer",
  },
  {
    name: "Registro",
    type: "fixed",
    responsible: "buyer",
  },
  {
    name: "Avaluo",
    type: "fixed",
    responsible: "buyer",
  },
  {
    name: "Gestoria",
    type: "fixed",
    responsible: "buyer",
  },
  {
    name: "Comision de venta",
    type: "percent",
    responsible: "seller",
  },
] as const satisfies readonly Omit<ClosingCostItem, "value" | "id">[];

export function calculateClosingCosts(
  input: ClosingCostsInput,
): ClosingCostsResult {
  const propertyPrice = normalizePositiveMoney(
    input.propertyPrice,
    "El precio de la propiedad",
  );
  const downPayment = normalizeNonNegativeMoney(
    input.downPayment ?? 0,
    "El enganche",
  );
  const reservePercent = normalizePercent(
    input.reservePercent ?? 0,
    "El margen de reserva",
    0,
    30,
  );
  const warnings: string[] = [];

  if (downPayment > propertyPrice) {
    warnings.push(
      "El enganche supera el precio de la propiedad; revisa si capturaste el importe correcto.",
    );
  }

  const items = (input.items ?? []).map((item, index) =>
    calculateItem(item, propertyPrice, index, warnings),
  );
  const buyerCosts = sumByResponsibility(items, "buyer");
  const sellerCosts = sumByResponsibility(items, "seller");
  const totalCosts = buyerCosts + sellerCosts;
  const reserveAmount = buyerCosts * (reservePercent / 100);
  const additionalCashToDownPayment = buyerCosts + reserveAmount;
  const buyerCashRequired = downPayment + additionalCashToDownPayment;
  const sellerNet = propertyPrice - sellerCosts;
  const impactItems = items
    .filter((item) => item.amount > 0)
    .slice()
    .sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name));

  if (items.length === 0) {
    warnings.push(
      "No hay partidas capturadas; el resultado queda en cero hasta agregar gastos.",
    );
  }

  return {
    propertyPrice,
    downPayment,
    reservePercent,
    reserveAmount,
    buyerCosts,
    sellerCosts,
    totalCosts,
    totalCostPercent: totalCosts / propertyPrice * 100,
    additionalCashToDownPayment,
    buyerCashRequired,
    sellerNet,
    items,
    impactItems,
    warnings,
  };
}

export function parseLocalizedNumber(value: string): number | null {
  const cleaned = value
    .trim()
    .replace(/\s+/g, "")
    .replace(/MXN|USD|EUR/gi, "")
    .replace(/[$%]/g, "");

  if (!cleaned || !/^[+-]?\d[\d.,]*$/.test(cleaned)) {
    return null;
  }

  const sign = cleaned.startsWith("-") ? "-" : "";
  const unsigned = cleaned.replace(/^[+-]/, "");
  const normalized = normalizeSeparators(unsigned);

  if (!/^\d+(?:\.\d+)?$/.test(normalized)) {
    return null;
  }

  const parsed = Number(`${sign}${normalized}`);

  return Number.isFinite(parsed) ? parsed : null;
}

export function formatCurrency(
  value: number,
  currency = "MXN",
  locale = "es-MX",
): string {
  assertFiniteNumber(value, "El importe");

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactCurrency(
  value: number,
  currency = "MXN",
  locale = "es-MX",
): string {
  assertFiniteNumber(value, "El importe");

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  assertFiniteNumber(value, "El porcentaje");

  return `${new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: Math.abs(value) < 10 ? 2 : 1,
  }).format(value)}%`;
}

export function roundMoney(value: number): number {
  assertFiniteNumber(value, "El importe");

  return Math.round(value * 100) / 100;
}

export function buildCopyText(
  result: ClosingCostsResult,
  mode: UserMode = "buyer",
): string {
  const lines = [
    "Calculadora de gastos de escrituracion - calculadoras.tools",
    `Vista: ${USER_MODE_LABELS[mode]}`,
    `Precio de propiedad: ${formatCurrency(result.propertyPrice)}`,
  ];

  if (mode !== "seller") {
    lines.push(
      `Enganche: ${formatCurrency(result.downPayment)}`,
      `Gastos del comprador: ${formatCurrency(result.buyerCosts)}`,
      `Margen de reserva: ${formatCurrency(result.reserveAmount)} (${formatPercent(result.reservePercent)})`,
      `Adicional al enganche: ${formatCurrency(result.additionalCashToDownPayment)}`,
      `Efectivo requerido para cerrar: ${formatCurrency(result.buyerCashRequired)}`,
    );
  }

  if (mode !== "buyer") {
    lines.push(
      `Gastos del vendedor: ${formatCurrency(result.sellerCosts)}`,
      `Neto estimado del vendedor: ${formatCurrency(result.sellerNet)}`,
    );
  }

  lines.push(
    `Gastos totales: ${formatCurrency(result.totalCosts)} (${formatPercent(result.totalCostPercent)} del precio)`,
  );

  if (result.impactItems.length > 0) {
    lines.push(
      "Partidas de mayor impacto:",
      ...result.impactItems
        .slice(0, 5)
        .map(
          (item) =>
            `- ${item.name}: ${formatCurrency(item.amount)} (${RESPONSIBILITY_LABELS[item.responsible]})`,
        ),
    );
  }

  return lines.join("\n");
}

function calculateItem(
  item: ClosingCostItem,
  propertyPrice: number,
  index: number,
  warnings: string[],
): CalculatedClosingCostItem {
  const name = normalizeName(item.name, index);
  const type = normalizeCostType(item.type);
  const responsible = normalizeResponsibility(item.responsible);
  const value = normalizeNonNegativeMoney(item.value, name);
  const amount = type === "percent" ? propertyPrice * (value / 100) : value;

  if (type === "percent" && value > 15) {
    warnings.push(
      `${name} usa ${formatPercent(value)}; revisa que el porcentaje sea intencional.`,
    );
  }

  return {
    id: item.id?.trim() || `item-${index + 1}`,
    name,
    type,
    value,
    responsible,
    amount,
    percentOfPrice: amount / propertyPrice * 100,
  };
}

function sumByResponsibility(
  items: readonly CalculatedClosingCostItem[],
  responsibility: Responsibility,
): number {
  return items
    .filter((item) => item.responsible === responsibility)
    .reduce((total, item) => total + item.amount, 0);
}

function normalizeName(name: string, index: number): string {
  const trimmed = name.trim();

  if (!trimmed) {
    throw new RangeError(`La partida ${index + 1} necesita nombre.`);
  }

  if (trimmed.length > 60) {
    throw new RangeError(`La partida ${index + 1} no puede superar 60 caracteres.`);
  }

  return trimmed;
}

function normalizeCostType(type: string): CostType {
  if (!COST_TYPES.includes(type as CostType)) {
    throw new RangeError("El tipo de partida no es valido.");
  }

  return type as CostType;
}

function normalizeResponsibility(responsibility: string): Responsibility {
  if (!RESPONSIBILITIES.includes(responsibility as Responsibility)) {
    throw new RangeError("El responsable no es valido.");
  }

  return responsibility as Responsibility;
}

function normalizePositiveMoney(value: number, label: string): number {
  assertFiniteNumber(value, label);

  if (value <= 0) {
    throw new RangeError(`${label} debe ser mayor que cero.`);
  }

  return value;
}

function normalizeNonNegativeMoney(value: number, label: string): number {
  assertFiniteNumber(value, label);

  if (value < 0) {
    throw new RangeError(`${label} no puede ser negativo.`);
  }

  return value;
}

function normalizePercent(
  value: number,
  label: string,
  min: number,
  max: number,
): number {
  assertFiniteNumber(value, label);

  if (value < min || value > max) {
    throw new RangeError(`${label} debe estar entre ${min}% y ${max}%.`);
  }

  return value;
}

function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${label} debe ser un numero valido.`);
  }
}

function normalizeSeparators(value: string): string {
  const commaCount = countOccurrences(value, ",");
  const dotCount = countOccurrences(value, ".");

  if (commaCount > 0 && dotCount > 0) {
    const decimalSeparator =
      value.lastIndexOf(",") > value.lastIndexOf(".") ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";

    return value
      .replaceAll(thousandsSeparator, "")
      .replace(decimalSeparator, ".");
  }

  if (commaCount > 0) {
    return normalizeSingleSeparator(value, ",");
  }

  if (dotCount > 0) {
    return normalizeSingleSeparator(value, ".");
  }

  return value;
}

function normalizeSingleSeparator(value: string, separator: "," | "."): string {
  if (countOccurrences(value, separator) > 1) {
    return value.replaceAll(separator, "");
  }

  const [integerPart, fractionalPart] = value.split(separator);

  if (!fractionalPart) {
    return integerPart;
  }

  const looksLikeThousands =
    integerPart.length <= 3 &&
    fractionalPart.length === 3 &&
    /^\d{1,3}$/.test(integerPart);

  return looksLikeThousands
    ? `${integerPart}${fractionalPart}`
    : `${integerPart}.${fractionalPart}`;
}

function countOccurrences(value: string, character: string): number {
  return value.split(character).length - 1;
}
