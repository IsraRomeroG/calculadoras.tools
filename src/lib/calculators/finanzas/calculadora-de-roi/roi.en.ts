export type RoiStatus = "gain" | "break_even" | "loss";
export type DurationUnit = "days" | "months" | "years";

export type ParseRoiInputResult =
  | { ok: true; value: number; normalized: string }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

export interface RoiTargetResult {
  targetValue: number;
  difference: number;
}

export interface SimpleRoiInput {
  initialInvestment: number;
  recoveredValue: number;
  targetRoi?: number;
  duration?: number;
  durationUnit?: DurationUnit;
}

export interface BusinessRoiInput {
  revenue: number;
  initialCosts: number;
  fixedCosts: number;
  variableCosts: number;
  otherCosts: number;
  targetRoi?: number;
}

export interface RoiResult {
  roi: number;
  profit: number;
  totalCost: number;
  currentValue: number;
  multiplier: number;
  breakEvenValue: number;
  breakEvenDifference: number;
  status: RoiStatus;
  target?: RoiTargetResult;
}

export interface SimpleRoiResult extends RoiResult {
  annualizedReturn?: number;
}

export interface BusinessRoiResult extends RoiResult {
  marginOnRevenue: number | null;
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

const multiplierFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function calculateSimpleRoi(input: SimpleRoiInput): SimpleRoiResult {
  const profit = input.recoveredValue - input.initialInvestment;
  const roi = (profit / input.initialInvestment) * 100;
  const years =
    input.duration && input.durationUnit
      ? convertDurationToYears(input.duration, input.durationUnit)
      : undefined;

  return {
    ...buildCommonResult({
      currentValue: input.recoveredValue,
      totalCost: input.initialInvestment,
      targetRoi: input.targetRoi,
    }),
    annualizedReturn:
      years && years > 0 && input.recoveredValue > 0
        ? (Math.pow(input.recoveredValue / input.initialInvestment, 1 / years) -
            1) *
          100
        : undefined,
    profit,
    roi,
  };
}

export function calculateBusinessRoi(
  input: BusinessRoiInput,
): BusinessRoiResult {
  const totalCost =
    input.initialCosts +
    input.fixedCosts +
    input.variableCosts +
    input.otherCosts;
  const common = buildCommonResult({
    currentValue: input.revenue,
    totalCost,
    targetRoi: input.targetRoi,
  });

  return {
    ...common,
    marginOnRevenue:
      input.revenue > 0 ? (common.profit / input.revenue) * 100 : null,
  };
}

export function calculateTarget(
  baseValue: number,
  currentValue: number,
  targetRoi?: number,
): RoiTargetResult | undefined {
  if (typeof targetRoi !== "number") {
    return undefined;
  }

  const targetValue = baseValue * (1 + targetRoi / 100);

  return {
    targetValue,
    difference: currentValue - targetValue,
  };
}

export function convertDurationToYears(
  duration: number,
  unit: DurationUnit,
): number {
  if (unit === "days") {
    return duration / 365;
  }

  if (unit === "months") {
    return duration / 12;
  }

  return duration;
}

export function parseMoneyInput(value: string): ParseRoiInputResult {
  return parseNumericInput(value, { allowNegative: false, maxDecimals: 2 });
}

export function parsePositiveInput(value: string): ParseRoiInputResult {
  return parseNumericInput(value, { allowNegative: false, maxDecimals: 4 });
}

export function parseTargetRoiInput(value: string): ParseRoiInputResult {
  return parseNumericInput(value, { allowNegative: true, maxDecimals: 4 });
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(roundCurrency(value));
}

export function formatPercent(value: number): string {
  return `${percentFormatter.format(roundCurrency(value))}%`;
}

export function formatMultiplier(value: number): string {
  return `${multiplierFormatter.format(roundCurrency(value))}x`;
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function buildCommonResult({
  currentValue,
  totalCost,
  targetRoi,
}: {
  currentValue: number;
  totalCost: number;
  targetRoi?: number;
}): RoiResult {
  const profit = currentValue - totalCost;

  return {
    roi: (profit / totalCost) * 100,
    profit,
    totalCost,
    currentValue,
    multiplier: currentValue / totalCost,
    breakEvenValue: totalCost,
    breakEvenDifference: profit,
    status: getRoiStatus(profit),
    target: calculateTarget(totalCost, currentValue, targetRoi),
  };
}

function getRoiStatus(profit: number): RoiStatus {
  if (profit === 0) {
    return "break_even";
  }

  return profit > 0 ? "gain" : "loss";
}

function parseNumericInput(
  value: string,
  options: { allowNegative: boolean; maxDecimals: number },
): ParseRoiInputResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  const isNegative = /^[-−]/.test(trimmed);

  if (isNegative && !options.allowNegative) {
    return { ok: false, error: "negative" };
  }

  const cleaned = trimmed
    .replace(/\b(MXN|USD|EUR|ARS|COP|CLP|PEN|GTQ|CRC|UYU)\b/gi, "")
    .replace(/S\/|[$€₡Q%\s]/gi, "")
    .replace("−", "-");

  if (!cleaned || /[^0-9.,-]/.test(cleaned) || /-/.test(cleaned.slice(1))) {
    return { ok: false, error: "invalid" };
  }

  const sign = cleaned.startsWith("-") ? "-" : "";
  const unsigned = sign ? cleaned.slice(1) : cleaned;
  const normalizedUnsigned = normalizeSeparators(unsigned);
  const normalized = `${sign}${normalizedUnsigned}`;

  if (!normalizedUnsigned || !/^-?\d+(\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const decimals = normalizedUnsigned.split(".")[1];

  if (decimals && decimals.length > options.maxDecimals) {
    return { ok: false, error: "too_many_decimals" };
  }

  const numericValue = Number(normalized);

  if (!Number.isFinite(numericValue)) {
    return { ok: false, error: "invalid" };
  }

  return { ok: true, value: numericValue, normalized };
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

  if (
    separator === "," &&
    parts[1].length === 3 &&
    parts[0].length <= 3
  ) {
    return parts.join("");
  }

  return `${parts[0]}.${parts[1]}`;
}


