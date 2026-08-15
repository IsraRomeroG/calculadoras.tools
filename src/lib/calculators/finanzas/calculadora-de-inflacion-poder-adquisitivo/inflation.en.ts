export type InflationMode = "future-cost" | "present-value";
export type DurationUnit = "months" | "years";

export type ParseInflationInputResult =
  | { ok: true; value: number; normalized: string }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

export interface InflationInput {
  mode: InflationMode;
  amount: number;
  annualRate: number;
  duration: number;
  durationUnit: DurationUnit;
}

export interface InflationResult {
  durationYears: number;
  inflationFactor: number;
  futureCost: number;
  presentValue: number;
  additionalAmountNeeded: number;
  purchasingPowerLossAmount: number;
  priceIncreasePercent: number;
  purchasingPowerRemainingPercent: number;
  purchasingPowerLossPercent: number;
  primaryValue: number;
  warnings: string[];
}

export interface InflationScenario {
  key: "low" | "current" | "high";
  label: string;
  annualRate: number;
  primaryValue: number;
  differenceFromCurrent: number;
  purchasingPowerRemainingPercent: number;
}

export interface InflationAnnualRow {
  periodLabel: string;
  elapsedMonths: number;
  annualRate: number;
  priceIncreasePercent: number;
  equivalentCost: number;
  equivalentPurchasingPower: number;
  purchasingPowerRemainingPercent: number;
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "MXN",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function calculateInflation(input: InflationInput): InflationResult {
  const durationYears = convertDurationToYears(input.duration, input.durationUnit);
  const inflationFactor = calculateInflationFactor(input.annualRate, durationYears);
  const futureCost = input.amount * inflationFactor;
  const presentValue = input.amount / inflationFactor;
  const priceIncreasePercent = (inflationFactor - 1) * 100;
  const purchasingPowerRemainingPercent = (1 / inflationFactor) * 100;
  const purchasingPowerLossPercent = 100 - purchasingPowerRemainingPercent;
  const warnings: string[] = [];

  if (input.annualRate > 30) {
    warnings.push(
      "This is a high rate. The result rises quickly; review several scenarios.",
    );
  }

  if (durationYears > 50) {
    warnings.push(
      "For terms over 50 years, small rate differences greatly change the result.",
    );
  }

  if (input.annualRate === 0) {
    warnings.push(
      "At 0% inflation, cost and purchasing power remain unchanged.",
    );
  }

  return {
    durationYears,
    inflationFactor,
    futureCost,
    presentValue,
    additionalAmountNeeded: futureCost - input.amount,
    purchasingPowerLossAmount: input.amount - presentValue,
    priceIncreasePercent,
    purchasingPowerRemainingPercent,
    purchasingPowerLossPercent,
    primaryValue: input.mode === "future-cost" ? futureCost : presentValue,
    warnings,
  };
}

export function calculateInflationFactor(
  annualRate: number,
  durationYears: number,
): number {
  return Math.pow(1 + annualRate / 100, durationYears);
}

export function buildInflationScenarios(
  input: InflationInput,
): InflationScenario[] {
  const lowRate = Math.max(0, input.annualRate - 2);
  const highRate = Math.min(100, input.annualRate + 2);
  const rates = [
    ...(lowRate < input.annualRate
      ? [
          {
            key: "low" as const,
            label: "Low inflation",
            annualRate: lowRate,
          },
        ]
      : []),
    {
      key: "current" as const,
      label: "Entered rate",
      annualRate: input.annualRate,
    },
    ...(highRate > input.annualRate
      ? [
          {
            key: "high" as const,
            label: "High inflation",
            annualRate: highRate,
          },
        ]
      : []),
  ];
  const current = calculateInflation(input);

  return rates.map((scenario) => {
    const result = calculateInflation({
      ...input,
      annualRate: scenario.annualRate,
    });

    return {
      ...scenario,
      primaryValue: result.primaryValue,
      differenceFromCurrent: result.primaryValue - current.primaryValue,
      purchasingPowerRemainingPercent: result.purchasingPowerRemainingPercent,
    };
  });
}

export function buildInflationAnnualRows(
  input: InflationInput,
): InflationAnnualRow[] {
  const totalMonths = convertDurationToMonths(input.duration, input.durationUnit);
  const endingMonths: number[] = [];

  for (let month = 12; month < totalMonths; month += 12) {
    endingMonths.push(month);
  }

  if (totalMonths > 0) {
    endingMonths.push(totalMonths);
  }

  return endingMonths.map((elapsedMonths) => {
    const durationYears = elapsedMonths / 12;
    const factor = calculateInflationFactor(input.annualRate, durationYears);

    return {
      periodLabel: formatDuration(elapsedMonths),
      elapsedMonths,
      annualRate: input.annualRate,
      priceIncreasePercent: (factor - 1) * 100,
      equivalentCost: input.amount * factor,
      equivalentPurchasingPower: input.amount / factor,
      purchasingPowerRemainingPercent: (1 / factor) * 100,
    };
  });
}

export function convertDurationToYears(
  duration: number,
  unit: DurationUnit,
): number {
  return unit === "months" ? duration / 12 : duration;
}

export function convertDuration(
  duration: number,
  from: DurationUnit,
  to: DurationUnit,
): number {
  if (from === to) {
    return duration;
  }

  return to === "months" ? duration * 12 : duration / 12;
}

export function parseMoneyInput(value: string): ParseInflationInputResult {
  return parseNumericInput(value, { maxDecimals: 2, preferDecimal: false });
}

export function parseRateInput(value: string): ParseInflationInputResult {
  return parseNumericInput(value, { maxDecimals: 4, preferDecimal: true });
}

export function parseDurationInput(value: string): ParseInflationInputResult {
  return parseNumericInput(value, { maxDecimals: 2, preferDecimal: true });
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

export function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = roundToTwo(months - years * 12);
  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  }

  if (remainingMonths > 0 || parts.length === 0) {
    parts.push(
      `${formatNumber(remainingMonths)} ${
        Math.abs(remainingMonths - 1) < Number.EPSILON ? "month" : "months"
      }`,
    );
  }

  return parts.join(" and ");
}

export function roundCurrency(value: number): number {
  return roundToTwo(value);
}

function convertDurationToMonths(
  duration: number,
  unit: DurationUnit,
): number {
  return unit === "years" ? duration * 12 : duration;
}

function roundToTwo(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function parseNumericInput(
  value: string,
  options: { maxDecimals: number; preferDecimal: boolean },
): ParseInflationInputResult {
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
