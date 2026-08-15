export type ProfitStatus = "gain" | "break_even" | "loss";
export type CommercialRounding = "cent" | "integer" | "multiple_5" | "ending_99";

export type ParseMarginMarkupInputResult =
  | { ok: true; value: number; normalized: string }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

export interface SaleCosts {
  baseCost: number;
  shipping: number;
  packaging: number;
  fixedFee: number;
  otherCosts: number;
  commissionRate: number;
}

export interface SaleAnalysis {
  price: number;
  fixedCosts: number;
  commissionAmount: number;
  effectiveCost: number;
  profit: number;
  marginPercent: number;
  markupPercent: number | null;
  costPercent: number;
  breakEvenExact: number;
  breakEvenPrice: number;
  maxDiscountAmount: number;
  maxDiscountPercent: number;
  status: ProfitStatus;
}

export interface TargetPriceResult {
  exactPrice: number;
  commercialPrice: number;
  analysis: SaleAnalysis;
}

export interface MarginScenario extends TargetPriceResult {
  targetMargin: number;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "MXN",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const exactPriceFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

export function sumFixedCosts(costs: SaleCosts): number {
  validateCosts(costs);

  return (
    costs.baseCost +
    costs.shipping +
    costs.packaging +
    costs.fixedFee +
    costs.otherCosts
  );
}

export function analyzeSale(costs: SaleCosts, price: number): SaleAnalysis {
  validateCosts(costs);
  validatePositiveFinite(price, "price");

  const fixedCosts = sumFixedCosts(costs);
  const commissionAmount = price * (costs.commissionRate / 100);
  const effectiveCost = fixedCosts + commissionAmount;
  const profit = price - effectiveCost;
  const breakEvenExact = calculateBreakEvenExact(costs);
  const breakEvenPrice = roundCommercialPrice(breakEvenExact, "cent");
  const maxDiscountAmount = Math.max(0, price - breakEvenPrice);

  return {
    price,
    fixedCosts,
    commissionAmount,
    effectiveCost,
    profit,
    marginPercent: (profit / price) * 100,
    markupPercent: effectiveCost > 0 ? (profit / effectiveCost) * 100 : null,
    costPercent: (effectiveCost / price) * 100,
    breakEvenExact,
    breakEvenPrice,
    maxDiscountAmount,
    maxDiscountPercent: (maxDiscountAmount / price) * 100,
    status: getProfitStatus(profit),
  };
}

export function calculatePriceForMargin(
  costs: SaleCosts,
  targetMargin: number,
  rounding: CommercialRounding,
): TargetPriceResult {
  const fixedCosts = validateTargetCosts(costs);
  validateNonNegativeFinite(targetMargin, "margin");

  if (targetMargin >= 100) {
    throw new RangeError("The margin must be below 100%.");
  }

  const denominator =
    1 - costs.commissionRate / 100 - targetMargin / 100;

  if (denominator <= Number.EPSILON * 10) {
    throw new RangeError(
      "The fee and margin total 100% or more; no price can reach that target.",
    );
  }

  return buildTargetResult(fixedCosts / denominator, costs, rounding);
}

export function calculatePriceForMarkup(
  costs: SaleCosts,
  targetMarkup: number,
  rounding: CommercialRounding,
): TargetPriceResult {
  const fixedCosts = validateTargetCosts(costs);
  validateNonNegativeFinite(targetMarkup, "markup");

  const markup = targetMarkup / 100;
  const commission = costs.commissionRate / 100;
  const denominator = 1 - commission * (1 + markup);

  if (denominator <= Number.EPSILON * 10) {
    throw new RangeError(
      "With this fee, no price can reach the specified markup.",
    );
  }

  return buildTargetResult(
    (fixedCosts * (1 + markup)) / denominator,
    costs,
    rounding,
  );
}

export function buildMarginScenarios(
  costs: SaleCosts,
  rounding: CommercialRounding,
  targets = [20, 30, 40, 50],
): MarginScenario[] {
  return targets.flatMap((targetMargin) => {
    try {
      return [
        {
          targetMargin,
          ...calculatePriceForMargin(costs, targetMargin, rounding),
        },
      ];
    } catch {
      return [];
    }
  });
}

export function calculateBreakEvenExact(costs: SaleCosts): number {
  const fixedCosts = sumFixedCosts(costs);
  return fixedCosts / (1 - costs.commissionRate / 100);
}

export function roundCommercialPrice(
  price: number,
  rounding: CommercialRounding,
): number {
  validateNonNegativeFinite(price, "price");

  if (rounding === "cent") {
    return roundCurrency(Math.ceil(price * 100) / 100);
  }

  if (rounding === "integer") {
    return Math.ceil(price);
  }

  if (rounding === "multiple_5") {
    return Math.ceil(price / 5) * 5;
  }

  let candidate = Math.ceil(price) - 0.01;
  if (candidate < price) {
    candidate += 1;
  }

  return roundCurrency(candidate);
}

export function parseMoneyInput(
  value: string,
): ParseMarginMarkupInputResult {
  return parseNumericInput(value, { maxDecimals: 2, preferDecimal: false });
}

export function parsePercentInput(
  value: string,
): ParseMarginMarkupInputResult {
  return parseNumericInput(value, { maxDecimals: 4, preferDecimal: true });
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(roundCurrency(value));
}

export function formatExactPrice(value: number): string {
  return `$${exactPriceFormatter.format(value)}`;
}

export function formatPercent(value: number): string {
  return `${percentFormatter.format(value)}%`;
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function buildTargetResult(
  exactPrice: number,
  costs: SaleCosts,
  rounding: CommercialRounding,
): TargetPriceResult {
  const commercialPrice = roundCommercialPrice(exactPrice, rounding);

  return {
    exactPrice,
    commercialPrice,
    analysis: analyzeSale(costs, commercialPrice),
  };
}

function validateTargetCosts(costs: SaleCosts): number {
  const fixedCosts = sumFixedCosts(costs);

  if (fixedCosts <= 0) {
    throw new RangeError(
      "Add at least one per-sale cost to calculate a target price.",
    );
  }

  return fixedCosts;
}

function validateCosts(costs: SaleCosts): void {
  validateNonNegativeFinite(costs.baseCost, "base cost");
  validateNonNegativeFinite(costs.shipping, "shipping");
  validateNonNegativeFinite(costs.packaging, "packaging");
  validateNonNegativeFinite(costs.fixedFee, "fixed fee");
  validateNonNegativeFinite(costs.otherCosts, "other costs");
  validateNonNegativeFinite(costs.commissionRate, "fee");

  if (costs.commissionRate >= 100) {
    throw new RangeError("The fee must be below 100%.");
  }
}

function validatePositiveFinite(value: number, label: string): void {
  validateNonNegativeFinite(value, label);

  if (value <= 0) {
    throw new RangeError(`The ${label} must be greater than zero.`);
  }
}

function validateNonNegativeFinite(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`Check the value of ${label}.`);
  }
}

function getProfitStatus(profit: number): ProfitStatus {
  if (Math.abs(profit) < 0.005) {
    return "break_even";
  }

  return profit > 0 ? "gain" : "loss";
}

function parseNumericInput(
  value: string,
  options: { maxDecimals: number; preferDecimal: boolean },
): ParseMarginMarkupInputResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  if (/[-−]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const cleaned = trimmed
    .replace(/\b(MXN|USD|EUR|ARS|COP|CLP|PEN|GTQ|CRC|UYU)\b/gi, "")
    .replace(/S\/|[$€₡Q%\s]/gi, "");

  if (!cleaned || /[^0-9.,]/.test(cleaned)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeSeparators(cleaned, options.preferDecimal);

  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const decimals = normalized.split(".")[1];

  if (decimals && decimals.length > options.maxDecimals) {
    return { ok: false, error: "too_many_decimals" };
  }

  const numericValue = Number(normalized);

  if (!Number.isFinite(numericValue)) {
    return { ok: false, error: "invalid" };
  }

  return { ok: true, value: numericValue, normalized };
}

function normalizeSeparators(value: string, preferDecimal: boolean): string {
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

  if (!preferDecimal && parts[1].length === 3 && parts[0].length <= 3) {
    return parts.join("");
  }

  return `${parts[0]}.${parts[1]}`;
}
