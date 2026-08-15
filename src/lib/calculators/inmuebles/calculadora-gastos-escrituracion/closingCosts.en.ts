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
  buyer: "Buyer",
  seller: "Seller",
  both: "Both",
};

export const COST_TYPE_LABELS: Record<CostType, string> = {
  percent: "Percentage",
  fixed: "Fixed amount",
};

export const RESPONSIBILITY_LABELS: Record<Responsibility, string> = {
  buyer: "Buyer",
  seller: "Seller",
};

export const SUGGESTED_CLOSING_COSTS = [
  {
    name: "Transfer tax",
    type: "percent",
    responsible: "buyer",
  },
  {
    name: "Notary fees",
    type: "percent",
    responsible: "buyer",
  },
  {
    name: "Registration",
    type: "fixed",
    responsible: "buyer",
  },
  {
    name: "Appraisal",
    type: "fixed",
    responsible: "buyer",
  },
  {
    name: "Administrative processing",
    type: "fixed",
    responsible: "buyer",
  },
  {
    name: "Sales commission",
    type: "percent",
    responsible: "seller",
  },
] as const satisfies readonly Omit<ClosingCostItem, "value" | "id">[];

export function calculateClosingCosts(
  input: ClosingCostsInput,
): ClosingCostsResult {
  const propertyPrice = normalizePositiveMoney(
    input.propertyPrice,
    "The property price",
  );
  const downPayment = normalizeNonNegativeMoney(
    input.downPayment ?? 0,
    "The down payment",
  );
  const reservePercent = normalizePercent(
    input.reservePercent ?? 0,
    "The contingency allowance",
    0,
    30,
  );
  const warnings: string[] = [];

  if (downPayment > propertyPrice) {
    warnings.push(
      "The down payment exceeds the property price; check the amount entered.",
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
      "No cost items have been entered; the result remains zero until you add expenses.",
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
  locale = "en-US",
): string {
  assertFiniteNumber(value, "The amount");

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactCurrency(
  value: number,
  currency = "MXN",
  locale = "en-US",
): string {
  assertFiniteNumber(value, "The amount");

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  assertFiniteNumber(value, "The percentage");

  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: Math.abs(value) < 10 ? 2 : 1,
  }).format(value)}%`;
}

export function roundMoney(value: number): number {
  assertFiniteNumber(value, "The amount");

  return Math.round(value * 100) / 100;
}

export function buildCopyText(
  result: ClosingCostsResult,
  mode: UserMode = "buyer",
): string {
  const lines = [
    "Closing costs calculator - calculadoras.tools",
    `Vista: ${USER_MODE_LABELS[mode]}`,
    `Property price: ${formatCurrency(result.propertyPrice)}`,
  ];

  if (mode !== "seller") {
    lines.push(
      `Down payment: ${formatCurrency(result.downPayment)}`,
      `Buyer costs: ${formatCurrency(result.buyerCosts)}`,
      `Contingency allowance: ${formatCurrency(result.reserveAmount)} (${formatPercent(result.reservePercent)})`,
      `Additional cash beyond down payment: ${formatCurrency(result.additionalCashToDownPayment)}`,
      `Cash required at closing: ${formatCurrency(result.buyerCashRequired)}`,
    );
  }

  if (mode !== "buyer") {
    lines.push(
      `Seller costs: ${formatCurrency(result.sellerCosts)}`,
      `Estimated seller proceeds: ${formatCurrency(result.sellerNet)}`,
    );
  }

  lines.push(
    `Total costs: ${formatCurrency(result.totalCosts)} (${formatPercent(result.totalCostPercent)} of price)`,
  );

  if (result.impactItems.length > 0) {
    lines.push(
      "Highest-impact items:",
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
      `${name} uses ${formatPercent(value)}; confirm that this percentage is intentional.`,
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
    throw new RangeError(`Item ${index + 1} needs a name.`);
  }

  if (trimmed.length > 60) {
    throw new RangeError(`Item ${index + 1} cannot exceed 60 characters.`);
  }

  return trimmed;
}

function normalizeCostType(type: string): CostType {
  if (!COST_TYPES.includes(type as CostType)) {
    throw new RangeError("The item type is invalid.");
  }

  return type as CostType;
}

function normalizeResponsibility(responsibility: string): Responsibility {
  if (!RESPONSIBILITIES.includes(responsibility as Responsibility)) {
    throw new RangeError("The responsible party is invalid.");
  }

  return responsibility as Responsibility;
}

function normalizePositiveMoney(value: number, label: string): number {
  assertFiniteNumber(value, label);

  if (value <= 0) {
    throw new RangeError(`${label} must be greater than zero.`);
  }

  return value;
}

function normalizeNonNegativeMoney(value: number, label: string): number {
  assertFiniteNumber(value, label);

  if (value < 0) {
    throw new RangeError(`${label} cannot be negative.`);
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
    throw new RangeError(`${label} must be between ${min}% and ${max}%.`);
  }

  return value;
}

function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${label} must be a valid number.`);
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
