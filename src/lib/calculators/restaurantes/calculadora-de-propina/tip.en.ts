export const TIP_CURRENCIES = [
  "MXN",
  "USD",
  "EUR",
  "COP",
  "ARS",
  "CLP",
  "PEN",
  "BRL",
  "OTHER",
] as const;

export type TipCurrency = (typeof TIP_CURRENCIES)[number];
export type TipRoundingMode = "none" | "tip" | "total";
export type TipRoundingIncrement = 1 | 5 | 10 | "minimum";

export type ParseMoneyResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

export interface TipCalculationInput {
  consumption: number;
  percentage: number;
  people?: number;
  currency?: TipCurrency;
  serviceIncluded?: boolean;
  rounding?: {
    mode: TipRoundingMode;
    increment: TipRoundingIncrement;
  };
}

export interface TipCalculationResult {
  consumption: number;
  requestedPercentage: number;
  effectivePercentage: number | null;
  people: number;
  currency: TipCurrency;
  minorUnit: number;
  tip: number;
  total: number;
  tipPerPerson: number;
  totalPerPerson: number;
  serviceIncluded: boolean;
  rounding: {
    mode: TipRoundingMode;
    increment: number;
    adjustedTip: number;
    adjustedTotal: number;
    difference: number;
  };
}

const MONEY_MAX_DECIMALS = 4;
const SUPPORTED_CURRENCY_CODES = new Set(TIP_CURRENCIES);

export function calculateTip(consumption: number, percentage: number): number {
  validateFiniteNonNegative(consumption, "consumption");
  validateFiniteNonNegative(percentage, "percentage");

  return consumption * (percentage / 100);
}

export function calculateTipTotal(consumption: number, tip: number): number {
  validateFiniteNonNegative(consumption, "consumption");
  validateFiniteNonNegative(tip, "tip");

  return consumption + tip;
}

export function calculateTipPerPerson(
  total: number,
  tip: number,
  people: number,
) {
  validateFiniteNonNegative(total, "total");
  validateFiniteNonNegative(tip, "tip");
  validatePeople(people);

  return {
    tipPerPerson: tip / people,
    totalPerPerson: total / people,
  };
}

export function roundTipUp(tip: number, increment: number): number {
  validateFiniteNonNegative(tip, "tip");
  validatePositiveIncrement(increment);

  return roundUp(tip, increment);
}

export function roundTotalUp(total: number, increment: number): number {
  validateFiniteNonNegative(total, "total");
  validatePositiveIncrement(increment);

  return roundUp(total, increment);
}

export function calculateEffectiveTipPercentage(
  consumption: number,
  tipAmount: number,
): number | null {
  validateFiniteNonNegative(consumption, "consumption");
  validateFiniteNonNegative(tipAmount, "tipAmount");

  if (consumption === 0) {
    return null;
  }

  return (tipAmount / consumption) * 100;
}

export function calculateRestaurantTip(
  input: TipCalculationInput,
): TipCalculationResult {
  const people = input.people ?? 1;
  const currency = input.currency ?? "MXN";
  const serviceIncluded = input.serviceIncluded ?? false;

  validateFiniteNonNegative(input.consumption, "consumption");
  validateFiniteNonNegative(input.percentage, "percentage");
  validatePeople(people);

  if (!SUPPORTED_CURRENCY_CODES.has(currency)) {
    throw new RangeError("The currency is not supported.");
  }

  const minorUnit = getCurrencyMinorUnit(currency);
  const roundingMode = input.rounding?.mode ?? "none";
  const roundingIncrement =
    input.rounding?.increment === "minimum"
      ? minorUnit
      : (input.rounding?.increment ?? 1);

  validatePositiveIncrement(roundingIncrement);

  const baseTip = calculateTip(input.consumption, input.percentage);
  const baseTotal = calculateTipTotal(input.consumption, baseTip);
  let adjustedTip = baseTip;
  let adjustedTotal = baseTotal;

  if (roundingMode === "tip") {
    adjustedTip = roundTipUp(baseTip, roundingIncrement);
    adjustedTotal = calculateTipTotal(input.consumption, adjustedTip);
  }

  if (roundingMode === "total") {
    adjustedTotal = roundTotalUp(baseTotal, roundingIncrement);
    adjustedTip = Math.max(0, adjustedTotal - input.consumption);
  }

  const perPerson = calculateTipPerPerson(adjustedTotal, adjustedTip, people);

  return {
    consumption: input.consumption,
    requestedPercentage: input.percentage,
    effectivePercentage: calculateEffectiveTipPercentage(
      input.consumption,
      adjustedTip,
    ),
    people,
    currency,
    minorUnit,
    tip: adjustedTip,
    total: adjustedTotal,
    tipPerPerson: perPerson.tipPerPerson,
    totalPerPerson: perPerson.totalPerPerson,
    serviceIncluded,
    rounding: {
      mode: roundingMode,
      increment: roundingIncrement,
      adjustedTip,
      adjustedTotal,
      difference: adjustedTotal - baseTotal,
    },
  };
}

export function getCurrencyMinorUnit(currency: TipCurrency): number {
  if (currency === "CLP" || currency === "COP") {
    return 1;
  }

  return 0.01;
}

export function parseMoneyInput(value: string): ParseMoneyResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  if (/[-−]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const cleaned = removeKnownMoneyAffixes(trimmed);

  if (!cleaned || /[^0-9.,]/.test(cleaned)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeMoneySeparators(cleaned);

  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const decimalPart = normalized.split(".")[1];

  if (decimalPart && decimalPart.length > MONEY_MAX_DECIMALS) {
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

export function formatMoney(
  value: number,
  currency: TipCurrency = "MXN",
  locale = "en-US",
): string {
  const minorUnit = getCurrencyMinorUnit(currency);
  const fractionDigits = minorUnit >= 1 ? 0 : 2;
  const roundedValue = roundToMinorUnit(value, minorUnit);

  if (currency === "OTHER") {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(roundedValue);
  }

  return `${new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(roundedValue)} ${currency}`;
}

export function formatPercentage(value: number | null): string {
  if (value === null) {
    return "No aplica";
  }

  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value)}%`;
}

export function buildShareText(result: TipCalculationResult): string {
  const lines = [
    "Calculated tip:",
    `Bill amount: ${formatMoney(result.consumption, result.currency)}`,
  ];

  if (result.rounding.mode === "total") {
    lines.push(
      `Total cerrado: ${formatMoney(result.total, result.currency)}`,
      `Adjusted tip: ${formatMoney(result.tip, result.currency)}`,
      `Effective percentage: ${formatPercentage(result.effectivePercentage)}`,
    );
  } else {
    lines.push(
      `Tip: ${formatMoney(result.tip, result.currency)}`,
      `Total: ${formatMoney(result.total, result.currency)}`,
    );

    if (result.rounding.mode === "tip") {
      lines.push(
        `Effective percentage: ${formatPercentage(result.effectivePercentage)}`,
      );
    }
  }

  if (result.people > 1) {
    lines.push(
      `People: ${result.people}`,
      `Total per person: ${formatMoney(result.totalPerPerson, result.currency)}`,
    );
  }

  return lines.join("\n");
}

function removeKnownMoneyAffixes(value: string): string {
  return value
    .replace(
      /\b(MXN|USD|EUR|COP|ARS|CLP|PEN|BRL|Otra|OTHER)\b/gi,
      "",
    )
    .replace(/S\/|R\$|[$€£¥₡Q%\s]/gi, "");
}

function normalizeMoneySeparators(value: string): string | undefined {
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
    const [integerPart, fractionalOrGroup] = parts;

    if (!integerPart || !fractionalOrGroup) {
      return undefined;
    }

    if (
      fractionalOrGroup.length === 3 &&
      integerPart.length <= 3 &&
      /^\d{1,3}$/.test(integerPart)
    ) {
      return `${integerPart}${fractionalOrGroup}`;
    }

    return `${integerPart}.${fractionalOrGroup}`;
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

function validateFiniteNonNegative(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} must be a finite nonnegative number.`);
  }
}

function validatePeople(value: number) {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError("People must be an integer greater than or equal to 1.");
  }
}

function validatePositiveIncrement(increment: number) {
  if (!Number.isFinite(increment) || increment <= 0) {
    throw new RangeError("The increment must be positive.");
  }
}

function roundUp(value: number, increment: number) {
  return Math.ceil((value - Number.EPSILON) / increment) * increment;
}

function roundToMinorUnit(value: number, minorUnit: number) {
  const units = Math.round((value + Number.EPSILON) / minorUnit);

  return roundToDecimals(units * minorUnit, getMinorUnitDecimals(minorUnit));
}

function getMinorUnitDecimals(minorUnit: number) {
  if (minorUnit >= 1) {
    return 0;
  }

  const text = minorUnit.toString();

  if (text.includes("e-")) {
    return Number(text.split("e-")[1]);
  }

  return text.split(".")[1]?.length ?? 0;
}

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
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
