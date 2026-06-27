export type PercentageMode =
  | "percentageOfNumber"
  | "whatPercentIs"
  | "percentChange"
  | "addPercent"
  | "subtractPercent";

export type ParseNumericInputResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

export interface PercentChangeResult {
  change: number;
  direction: "increase" | "decrease" | "none";
}

export interface AddPercentResult {
  increment: number;
  total: number;
}

export interface SubtractPercentResult {
  discount: number;
  total: number;
}

export interface PercentageFormatOptions {
  formatLocale?: string;
  currencySymbol?: string;
}

const DEFAULT_FORMAT_LOCALE = "es-MX";
const DEFAULT_CURRENCY_SYMBOL = "$";

const getFormatLocale = (options?: PercentageFormatOptions) =>
  options?.formatLocale ?? DEFAULT_FORMAT_LOCALE;

const getCurrencySymbol = (options?: PercentageFormatOptions) =>
  options?.currencySymbol ?? DEFAULT_CURRENCY_SYMBOL;

const createNumberFormatter = (options?: PercentageFormatOptions) =>
  new Intl.NumberFormat(getFormatLocale(options), {
    maximumFractionDigits: 2,
  });

export function calculatePercentageOfNumber(
  percent: number,
  base: number,
): number {
  return (percent / 100) * base;
}

export function calculateWhatPercentIs(partial: number, total: number): number {
  return (partial / total) * 100;
}

export function calculatePercentChange(
  original: number,
  next: number,
): PercentChangeResult {
  const change = ((next - original) / original) * 100;

  if (change > 0) {
    return { change, direction: "increase" };
  }

  if (change < 0) {
    return { change, direction: "decrease" };
  }

  return { change: 0, direction: "none" };
}

export function calculateAddPercent(
  base: number,
  percent: number,
): AddPercentResult {
  const increment = calculatePercentageOfNumber(percent, base);

  return {
    increment,
    total: base + increment,
  };
}

export function calculateSubtractPercent(
  base: number,
  percent: number,
): SubtractPercentResult {
  const discount = calculatePercentageOfNumber(percent, base);

  return {
    discount,
    total: base - discount,
  };
}

export function parseNumericInput(value: string): ParseNumericInputResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  if (/[-−]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const cleaned = trimmed.replace(/[$%\s]/g, "");

  if (!cleaned || /[^0-9.,]/.test(cleaned)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeSeparators(cleaned);

  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const decimalPart = normalized.split(".")[1];

  if (decimalPart && decimalPart.length > 2) {
    return { ok: false, error: "too_many_decimals" };
  }

  const numericValue = Number(normalized);

  if (!Number.isFinite(numericValue)) {
    return { ok: false, error: "invalid" };
  }

  return {
    ok: true,
    value: numericValue,
    normalized,
  };
}

export function formatNumber(
  value: number,
  options?: PercentageFormatOptions,
): string {
  return createNumberFormatter(options).format(roundToTwo(value));
}

export function formatCurrency(
  value: number,
  options?: PercentageFormatOptions,
): string {
  const rounded = roundToTwo(value);
  const sign = rounded < 0 ? "-" : "";

  return `${sign}${getCurrencySymbol(options)}${createNumberFormatter(options).format(Math.abs(rounded))}`;
}

export function formatPercent(
  value: number,
  options?: PercentageFormatOptions,
): string {
  return `${createNumberFormatter(options).format(roundToTwo(value))}%`;
}

export function roundToTwo(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
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

  if (lastComma !== -1) {
    return normalizeSingleSeparator(value, ",");
  }

  if (lastDot !== -1) {
    return normalizeSingleSeparator(value, ".");
  }

  return value;
}

function normalizeSingleSeparator(value: string, separator: "," | "."): string {
  const parts = value.split(separator);

  if (parts.length === 2) {
    const [integerPart, fractionalOrGroup] = parts;

    if (
      separator === "," &&
      fractionalOrGroup.length === 3 &&
      integerPart.length <= 3
    ) {
      return `${integerPart}${fractionalOrGroup}`;
    }

    return `${integerPart}.${fractionalOrGroup}`;
  }

  if (parts.length > 2 && parts.every(Boolean)) {
    return parts.join("");
  }

  return value;
}
