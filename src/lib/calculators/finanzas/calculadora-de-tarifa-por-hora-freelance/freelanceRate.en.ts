export type FreelanceRateWarning =
  | "no_tax_reserve"
  | "high_billable_percentage"
  | "low_billable_hours"
  | "high_weekly_hours";

export type CurrentRateStatus = "below" | "meets";

export type ParseFreelanceRateInputResult =
  | { ok: true; value: number; normalized: string }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

export interface FreelanceRateInput {
  desiredNetMonthlyIncome: number;
  weeklyWorkHours: number;
  billablePercentage: number;
  monthlyBusinessExpenses: number;
  monthlySavings: number;
  taxReserveRate: number;
  collectionFeeRate: number;
  weeksOffPerYear: number;
  billableDayHours: number;
  roundingIncrement: number;
  currentHourlyRate?: number;
}

export interface BillableCapacityScenario {
  billablePercentage: number;
  billableHoursMonthly: number;
  minimumHourlyRate: number;
  practicalHourlyRate: number;
  current: boolean;
}

export interface CurrentRateComparison {
  currentHourlyRate: number;
  differenceAmount: number;
  differencePercentage: number;
  status: CurrentRateStatus;
}

export interface FreelanceRateResult {
  weeksWorkedPerYear: number;
  billableHoursAnnual: number;
  billableHoursMonthly: number;
  netAfterTaxesTarget: number;
  preTaxProfitRequired: number;
  monthlyRevenueRequired: number;
  monthlyCollectionFee: number;
  monthlyTaxReserve: number;
  minimumHourlyRate: number;
  practicalHourlyRate: number;
  practicalDayRate: number;
  minimumRateWithoutSavings: number;
  currentRateComparison?: CurrentRateComparison;
  scenarios: BillableCapacityScenario[];
  warnings: FreelanceRateWarning[];
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "MXN",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const quantityFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const ROUNDING_PRECISION = 10;

export function calculateFreelanceRate(
  input: FreelanceRateInput,
): FreelanceRateResult {
  validateInput(input);

  const weeksWorkedPerYear = 52 - input.weeksOffPerYear;
  const billableHoursAnnual = calculateBillableHoursAnnual(
    input.weeklyWorkHours,
    weeksWorkedPerYear,
    input.billablePercentage,
  );
  const billableHoursMonthly = billableHoursAnnual / 12;
  const netAfterTaxesTarget =
    input.desiredNetMonthlyIncome + input.monthlySavings;
  const preTaxProfitRequired =
    netAfterTaxesTarget / (1 - input.taxReserveRate / 100);
  const monthlyRevenueRequired =
    (input.monthlyBusinessExpenses + preTaxProfitRequired) /
    (1 - input.collectionFeeRate / 100);
  const monthlyCollectionFee =
    monthlyRevenueRequired * (input.collectionFeeRate / 100);
  const monthlyTaxReserve =
    preTaxProfitRequired * (input.taxReserveRate / 100);
  const minimumHourlyRate = monthlyRevenueRequired / billableHoursMonthly;
  const practicalHourlyRate = roundUpToIncrement(
    minimumHourlyRate,
    input.roundingIncrement,
  );
  const practicalDayRate = practicalHourlyRate * input.billableDayHours;
  const minimumRateWithoutSavings = calculateMinimumRateWithoutSavings(
    input,
    billableHoursMonthly,
  );

  return {
    weeksWorkedPerYear,
    billableHoursAnnual,
    billableHoursMonthly,
    netAfterTaxesTarget,
    preTaxProfitRequired,
    monthlyRevenueRequired,
    monthlyCollectionFee,
    monthlyTaxReserve,
    minimumHourlyRate,
    practicalHourlyRate,
    practicalDayRate,
    minimumRateWithoutSavings,
    currentRateComparison:
      input.currentHourlyRate === undefined
        ? undefined
        : buildCurrentRateComparison(
            input.currentHourlyRate,
            minimumHourlyRate,
          ),
    scenarios: buildCapacityScenarios(input, monthlyRevenueRequired),
    warnings: buildWarnings(input, billableHoursMonthly),
  };
}

export function roundUpToIncrement(value: number, increment: number): number {
  validatePositiveFinite(value, "value");
  validatePositiveFinite(increment, "incremento");

  const ratio = value / increment;
  const tolerance = Number.EPSILON * Math.max(1, Math.abs(ratio)) * 100;
  const rounded = Math.ceil(ratio - tolerance) * increment;

  return roundToPrecision(rounded, ROUNDING_PRECISION);
}

export function parseMoneyInput(
  value: string,
): ParseFreelanceRateInputResult {
  return parseNumericInput(value, { maxDecimals: 2, preferDecimal: false });
}

export function parsePercentInput(
  value: string,
): ParseFreelanceRateInputResult {
  return parseNumericInput(value, { maxDecimals: 2, preferDecimal: true });
}

export function parseQuantityInput(
  value: string,
): ParseFreelanceRateInputResult {
  return parseNumericInput(value, { maxDecimals: 2, preferDecimal: true });
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(roundToPrecision(value, 2));
}

export function formatQuantity(value: number): string {
  return quantityFormatter.format(roundToPrecision(value, 2));
}

export function formatPercent(value: number): string {
  return `${percentFormatter.format(roundToPrecision(value, 2))}%`;
}

function calculateBillableHoursAnnual(
  weeklyWorkHours: number,
  weeksWorkedPerYear: number,
  billablePercentage: number,
): number {
  return weeklyWorkHours * weeksWorkedPerYear * (billablePercentage / 100);
}

function calculateMinimumRateWithoutSavings(
  input: FreelanceRateInput,
  billableHoursMonthly: number,
): number {
  const profitWithoutSavings =
    input.desiredNetMonthlyIncome / (1 - input.taxReserveRate / 100);
  const revenueWithoutSavings =
    (input.monthlyBusinessExpenses + profitWithoutSavings) /
    (1 - input.collectionFeeRate / 100);

  return revenueWithoutSavings / billableHoursMonthly;
}

function buildCurrentRateComparison(
  currentHourlyRate: number,
  minimumHourlyRate: number,
): CurrentRateComparison {
  const differenceAmount = currentHourlyRate - minimumHourlyRate;

  return {
    currentHourlyRate,
    differenceAmount,
    differencePercentage: (differenceAmount / minimumHourlyRate) * 100,
    status: differenceAmount >= 0 ? "meets" : "below",
  };
}

function buildCapacityScenarios(
  input: FreelanceRateInput,
  monthlyRevenueRequired: number,
): BillableCapacityScenario[] {
  const percentages = [
    Math.max(1, input.billablePercentage - 10),
    input.billablePercentage,
    Math.min(100, input.billablePercentage + 10),
  ];

  return [...new Set(percentages)].map((billablePercentage) => {
    const billableHoursAnnual = calculateBillableHoursAnnual(
      input.weeklyWorkHours,
      52 - input.weeksOffPerYear,
      billablePercentage,
    );
    const billableHoursMonthly = billableHoursAnnual / 12;
    const minimumHourlyRate =
      monthlyRevenueRequired / billableHoursMonthly;

    return {
      billablePercentage,
      billableHoursMonthly,
      minimumHourlyRate,
      practicalHourlyRate: roundUpToIncrement(
        minimumHourlyRate,
        input.roundingIncrement,
      ),
      current: billablePercentage === input.billablePercentage,
    };
  });
}

function buildWarnings(
  input: FreelanceRateInput,
  billableHoursMonthly: number,
): FreelanceRateWarning[] {
  const warnings: FreelanceRateWarning[] = [];

  if (input.taxReserveRate === 0) warnings.push("no_tax_reserve");
  if (input.billablePercentage > 80) {
    warnings.push("high_billable_percentage");
  }
  if (billableHoursMonthly < 20) warnings.push("low_billable_hours");
  if (input.weeklyWorkHours > 60) warnings.push("high_weekly_hours");

  return warnings;
}

function validateInput(input: FreelanceRateInput): void {
  validatePositiveFinite(
    input.desiredNetMonthlyIncome,
    "desired personal income",
  );
  validateRange(input.weeklyWorkHours, 1, 80, "weekly hours");
  validateRange(input.billablePercentage, 1, 100, "billable percentage");
  validateNonNegativeFinite(
    input.monthlyBusinessExpenses,
    "monthly expenses",
  );
  validateNonNegativeFinite(input.monthlySavings, "monthly savings");
  validateRange(input.taxReserveRate, 0, 80, "tax reserve");
  validateRange(input.collectionFeeRate, 0, 50, "collection fee");
  validateRange(input.weeksOffPerYear, 0, 20, "weeks off");
  validateRange(input.billableDayHours, 1, 12, "hours per day");
  validatePositiveFinite(input.roundingIncrement, "rounding increment");

  if (input.currentHourlyRate !== undefined) {
    validatePositiveFinite(input.currentHourlyRate, "current rate");
  }
}

function validateRange(
  value: number,
  minimum: number,
  maximum: number,
  label: string,
): void {
  if (!Number.isFinite(value) || value < minimum || value > maximum) {
    throw new RangeError(
      `${label} must be between ${minimum} y ${maximum}.`,
    );
  }
}

function validatePositiveFinite(value: number, label: string): void {
  validateNonNegativeFinite(value, label);

  if (value <= 0) {
    throw new RangeError(`${label} must be greater than zero.`);
  }
}

function validateNonNegativeFinite(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`Check the value of ${label}.`);
  }
}

function parseNumericInput(
  value: string,
  options: { maxDecimals: number; preferDecimal: boolean },
): ParseFreelanceRateInputResult {
  const trimmed = value.trim();

  if (!trimmed) return { ok: false, error: "required" };
  if (/[-−]/.test(trimmed)) return { ok: false, error: "negative" };

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

  if (!separator) return value;

  const parts = value.split(separator);

  if (
    parts.length > 2 &&
    parts.every(Boolean) &&
    parts.slice(1).every((part) => part.length === 3)
  ) {
    return parts.join("");
  }

  if (parts.length !== 2 || !parts[0] || !parts[1]) return value;

  if (!preferDecimal && parts[1].length === 3 && parts[0].length <= 3) {
    return parts.join("");
  }

  return `${parts[0]}.${parts[1]}`;
}

function roundToPrecision(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
