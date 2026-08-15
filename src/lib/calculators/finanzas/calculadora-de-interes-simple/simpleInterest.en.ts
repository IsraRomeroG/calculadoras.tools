export type TimeUnit = "days" | "months" | "years";
export type DayConvention = 360 | 365;

export type ParseSimpleInterestInputResult =
  | { ok: true; value: number; normalized: string }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

export interface SimpleInterestInput {
  principal: number;
  rate: number;
  ratePeriod: TimeUnit;
  duration: number;
  durationUnit: TimeUnit;
  dayConvention: DayConvention;
}

export interface SimpleInterestResult {
  interest: number;
  finalAmount: number;
  totalInterestPercent: number;
  interestPerDurationUnit: number;
  annualSimpleRate: number;
  durationInRatePeriods: number;
  durationDays: number;
  warnings: string[];
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "MXN",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 4,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 4,
});

export function calculateSimpleInterest(
  input: SimpleInterestInput,
): SimpleInterestResult {
  const durationDays = convertDurationToDays(
    input.duration,
    input.durationUnit,
    input.dayConvention,
  );
  const durationInRatePeriods = convertDaysToUnit(
    durationDays,
    input.ratePeriod,
    input.dayConvention,
  );
  const annualSimpleRate = convertRateToAnnual(
    input.rate,
    input.ratePeriod,
    input.dayConvention,
  );
  const totalInterestPercent = input.rate * durationInRatePeriods;
  const interest =
    input.principal * (input.rate / 100) * durationInRatePeriods;
  const warnings: string[] = [];

  if (annualSimpleRate > 100) {
    warnings.push("The equivalent annual simple rate exceeds 100%.");
  }

  if (totalInterestPercent > 100) {
    warnings.push("Interest over the term exceeds initial principal.");
  }

  return {
    interest,
    finalAmount: input.principal + interest,
    totalInterestPercent,
    interestPerDurationUnit: interest / input.duration,
    annualSimpleRate,
    durationInRatePeriods,
    durationDays,
    warnings,
  };
}

export function convertDurationToDays(
  duration: number,
  unit: TimeUnit,
  dayConvention: DayConvention,
): number {
  if (unit === "days") {
    return duration;
  }

  if (unit === "months") {
    return duration * (dayConvention / 12);
  }

  return duration * dayConvention;
}

export function convertDaysToUnit(
  days: number,
  unit: TimeUnit,
  dayConvention: DayConvention,
): number {
  if (unit === "days") {
    return days;
  }

  if (unit === "months") {
    return days / (dayConvention / 12);
  }

  return days / dayConvention;
}

export function convertRateToAnnual(
  rate: number,
  period: TimeUnit,
  dayConvention: DayConvention,
): number {
  if (period === "days") {
    return rate * dayConvention;
  }

  if (period === "months") {
    return rate * 12;
  }

  return rate;
}

export function parseMoneyInput(
  value: string,
): ParseSimpleInterestInputResult {
  return parseNumericInput(value, { maxDecimals: 2, preferDecimal: false });
}

export function parseRateInput(
  value: string,
): ParseSimpleInterestInputResult {
  return parseNumericInput(value, { maxDecimals: 4, preferDecimal: true });
}

export function parseDurationInput(
  value: string,
): ParseSimpleInterestInputResult {
  return parseNumericInput(value, { maxDecimals: 4, preferDecimal: true });
}

export function formatCurrency(value: number): string {
  return moneyFormatter.format(roundCurrency(value));
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatPercent(value: number): string {
  return `${percentFormatter.format(value)}%`;
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function parseNumericInput(
  value: string,
  options: { maxDecimals: number; preferDecimal: boolean },
): ParseSimpleInterestInputResult {
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

  if (
    !preferDecimal &&
    parts[1].length === 3 &&
    parts[0].length <= 3
  ) {
    return parts.join("");
  }

  return `${parts[0]}.${parts[1]}`;
}


