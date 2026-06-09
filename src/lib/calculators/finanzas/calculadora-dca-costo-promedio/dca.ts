export interface DcaPurchase {
  amount: number;
  price: number;
  fee: number;
}

export type DcaStatus = "gain" | "break_even" | "loss";

export interface DcaMarketResult {
  currentPrice: number;
  currentValue: number;
  unrealizedProfit: number;
  returnPercent: number;
  differencePerUnit: number;
  breakEvenPercent: number;
  status: DcaStatus;
}

export interface DcaResult {
  totalPurchaseAmount: number;
  totalFees: number;
  totalOutlay: number;
  totalUnits: number;
  averagePurchasePrice: number;
  effectiveCostPerUnit: number;
  feeDifferencePerUnit: number;
  feePercent: number;
  market?: DcaMarketResult;
}

export interface DcaSimulationResult extends DcaResult {
  nextPurchaseUnits: number;
  additionalOutlay: number;
  averagePriceChange: number;
  averagePriceChangePercent: number;
  effectiveCostChange: number;
  effectiveCostChangePercent: number;
}

export type ParseDcaNumberResult =
  | { ok: true; value: number; normalized: string }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

export function calculateDca(
  purchases: DcaPurchase[],
  currentPrice?: number,
): DcaResult {
  const totals = purchases.reduce(
    (result, purchase) => ({
      totalPurchaseAmount: result.totalPurchaseAmount + purchase.amount,
      totalFees: result.totalFees + purchase.fee,
      totalUnits: result.totalUnits + purchase.amount / purchase.price,
    }),
    { totalPurchaseAmount: 0, totalFees: 0, totalUnits: 0 },
  );
  const totalOutlay = totals.totalPurchaseAmount + totals.totalFees;
  const averagePurchasePrice = totals.totalPurchaseAmount / totals.totalUnits;
  const effectiveCostPerUnit = totalOutlay / totals.totalUnits;

  const result: DcaResult = {
    ...totals,
    totalOutlay,
    averagePurchasePrice,
    effectiveCostPerUnit,
    feeDifferencePerUnit: effectiveCostPerUnit - averagePurchasePrice,
    feePercent: totalOutlay > 0 ? (totals.totalFees / totalOutlay) * 100 : 0,
  };

  if (typeof currentPrice === "number" && currentPrice > 0) {
    result.market = calculateMarketResult(result, currentPrice);
  }

  return result;
}

export function simulateNextPurchase(
  current: DcaResult,
  nextPurchase: DcaPurchase,
): DcaSimulationResult {
  const nextPurchaseUnits = nextPurchase.amount / nextPurchase.price;
  const totalPurchaseAmount = current.totalPurchaseAmount + nextPurchase.amount;
  const totalFees = current.totalFees + nextPurchase.fee;
  const totalOutlay = totalPurchaseAmount + totalFees;
  const totalUnits = current.totalUnits + nextPurchaseUnits;
  const averagePurchasePrice = totalPurchaseAmount / totalUnits;
  const effectiveCostPerUnit = totalOutlay / totalUnits;

  return {
    totalPurchaseAmount,
    totalFees,
    totalOutlay,
    totalUnits,
    averagePurchasePrice,
    effectiveCostPerUnit,
    feeDifferencePerUnit: effectiveCostPerUnit - averagePurchasePrice,
    feePercent: (totalFees / totalOutlay) * 100,
    nextPurchaseUnits,
    additionalOutlay: nextPurchase.amount + nextPurchase.fee,
    averagePriceChange: averagePurchasePrice - current.averagePurchasePrice,
    averagePriceChangePercent:
      ((averagePurchasePrice - current.averagePurchasePrice) /
        current.averagePurchasePrice) *
      100,
    effectiveCostChange: effectiveCostPerUnit - current.effectiveCostPerUnit,
    effectiveCostChangePercent:
      ((effectiveCostPerUnit - current.effectiveCostPerUnit) /
        current.effectiveCostPerUnit) *
      100,
  };
}

export function parseDcaNumber(
  value: string,
  maxDecimals = 12,
): ParseDcaNumberResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  if (/^[-−]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const cleaned = trimmed
    .replace(/\b(MXN|USD|EUR|ARS|COP|CLP|PEN|GTQ|CRC|UYU|BRL)\b/gi, "")
    .replace(/S\/|[$€₡Q%\s]/gi, "");

  if (!cleaned || /[^0-9.,]/.test(cleaned)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeSeparators(cleaned);

  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const decimals = normalized.split(".")[1];

  if (decimals && decimals.length > maxDecimals) {
    return { ok: false, error: "too_many_decimals" };
  }

  const numericValue = Number(normalized);

  if (!Number.isFinite(numericValue)) {
    return { ok: false, error: "invalid" };
  }

  return { ok: true, value: numericValue, normalized };
}

export function formatDcaCurrency(value: number, currency = "MXN"): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: Math.abs(value) > 0 && Math.abs(value) < 0.01 ? 12 : 2,
  }).format(value);
}

export function formatDcaNumber(value: number, maximumFractionDigits = 8): string {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits,
  }).format(value);
}

export function formatDcaPercent(value: number): string {
  return `${new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)}%`;
}

function calculateMarketResult(
  result: DcaResult,
  currentPrice: number,
): DcaMarketResult {
  const currentValue = result.totalUnits * currentPrice;
  const unrealizedProfit = currentValue - result.totalOutlay;
  const differencePerUnit = currentPrice - result.effectiveCostPerUnit;
  const breakEvenTolerance =
    Math.max(Math.abs(result.totalOutlay), 1) * Number.EPSILON * 10;
  const status: DcaStatus =
    Math.abs(unrealizedProfit) <= breakEvenTolerance
      ? "break_even"
      : unrealizedProfit > 0
        ? "gain"
        : "loss";

  return {
    currentPrice,
    currentValue,
    unrealizedProfit,
    returnPercent: (unrealizedProfit / result.totalOutlay) * 100,
    differencePerUnit,
    breakEvenPercent:
      status === "loss"
        ? ((result.effectiveCostPerUnit / currentPrice) - 1) * 100
        : status === "gain"
          ? (1 - result.effectiveCostPerUnit / currentPrice) * 100
          : 0,
    status,
  };
}

function normalizeSeparators(value: string): string {
  const lastComma = value.lastIndexOf(",");
  const lastDot = value.lastIndexOf(".");

  if (lastComma !== -1 && lastDot !== -1) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";

    return value
      .replaceAll(thousandsSeparator, "")
      .replace(decimalSeparator, ".");
  }

  const separator = lastComma !== -1 ? "," : lastDot !== -1 ? "." : null;

  if (!separator) {
    return value;
  }

  const parts = value.split(separator);

  if (
    parts.length > 2 &&
    parts.every(Boolean) &&
    parts.slice(1).every((part) => part.length === 3)
  ) {
    return parts.join("");
  }

  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return value;
  }

  if (separator === "," && parts[1].length === 3 && parts[0].length <= 3) {
    return parts.join("");
  }

  return `${parts[0]}.${parts[1]}`;
}
