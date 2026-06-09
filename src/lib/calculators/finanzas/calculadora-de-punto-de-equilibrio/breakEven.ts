export type BreakEvenStatus = "below" | "break_even" | "above";

export type ParseBreakEvenInputResult =
  | { ok: true; value: number; normalized: string }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

export interface BreakEvenInput {
  price: number;
  variableCost: number;
  fixedCosts: number;
  commissionRate: number;
  increment: number;
  expectedUnits?: number;
  targetProfit?: number;
}

export interface VolumeAnalysis {
  units: number;
  revenue: number;
  variableCosts: number;
  commission: number;
  totalCosts: number;
  profit: number;
  status: BreakEvenStatus;
}

export interface ExpectedVolumeAnalysis extends VolumeAnalysis {
  differenceFromExactUnits: number;
  differenceFromPracticalUnits: number;
  differenceFromExactSales: number;
  safetyMarginAmount: number;
  safetyMarginPercent: number | null;
}

export interface TargetProfitAnalysis {
  targetProfit: number;
  exactUnits: number;
  practicalUnits: number;
  practicalSales: number;
  actualProfit: number;
}

export interface BreakEvenScenario extends VolumeAnalysis {
  percentage: number;
}

interface BreakEvenBaseResult {
  commissionPerUnit: number;
  contributionPerUnit: number;
  contributionPercent: number;
}

export interface InfeasibleBreakEvenResult extends BreakEvenBaseResult {
  feasible: false;
  lossPerAdditionalUnit: number;
}

export interface FeasibleBreakEvenResult extends BreakEvenBaseResult {
  feasible: true;
  exactBreakEvenUnits: number;
  exactBreakEvenSales: number;
  practicalBreakEvenUnits: number;
  practicalBreakEvenSales: number;
  practicalAnalysis: VolumeAnalysis;
  expected?: ExpectedVolumeAnalysis;
  target?: TargetProfitAnalysis;
  scenarios: BreakEvenScenario[];
}

export type BreakEvenResult =
  | InfeasibleBreakEvenResult
  | FeasibleBreakEvenResult;

const PROFIT_TOLERANCE = 0.005;
const ROUNDING_PRECISION = 10;

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("es-MX", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const quantityFormatter = new Intl.NumberFormat("es-MX", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 4,
});

export function calculateBreakEven(input: BreakEvenInput): BreakEvenResult {
  validateInput(input);

  const commissionPerUnit = input.price * (input.commissionRate / 100);
  const contributionPerUnit =
    input.price - input.variableCost - commissionPerUnit;
  const contributionPercent = (contributionPerUnit / input.price) * 100;

  if (contributionPerUnit <= 0) {
    return {
      feasible: false,
      commissionPerUnit,
      contributionPerUnit,
      contributionPercent,
      lossPerAdditionalUnit: Math.max(0, -contributionPerUnit),
    };
  }

  const exactBreakEvenUnits = input.fixedCosts / contributionPerUnit;
  const exactBreakEvenSales = exactBreakEvenUnits * input.price;
  const practicalBreakEvenUnits = roundToIncrement(
    exactBreakEvenUnits,
    input.increment,
  );
  const practicalBreakEvenSales = practicalBreakEvenUnits * input.price;
  const practicalAnalysis = analyzeVolume(input, practicalBreakEvenUnits);

  return {
    feasible: true,
    commissionPerUnit,
    contributionPerUnit,
    contributionPercent,
    exactBreakEvenUnits,
    exactBreakEvenSales,
    practicalBreakEvenUnits,
    practicalBreakEvenSales,
    practicalAnalysis,
    expected:
      input.expectedUnits === undefined
        ? undefined
        : buildExpectedAnalysis(
            input,
            input.expectedUnits,
            exactBreakEvenUnits,
            practicalBreakEvenUnits,
            exactBreakEvenSales,
          ),
    target:
      input.targetProfit === undefined || input.targetProfit <= 0
        ? undefined
        : buildTargetAnalysis(input, contributionPerUnit, input.targetProfit),
    scenarios: buildScenarios(input, exactBreakEvenUnits),
  };
}

export function analyzeVolume(
  input: BreakEvenInput,
  units: number,
): VolumeAnalysis {
  validateInput(input);
  validateNonNegativeFinite(units, "unidades");

  const revenue = units * input.price;
  const variableCosts = units * input.variableCost;
  const commission = revenue * (input.commissionRate / 100);
  const totalCosts = input.fixedCosts + variableCosts + commission;
  const profit = revenue - totalCosts;

  return {
    units,
    revenue,
    variableCosts,
    commission,
    totalCosts,
    profit,
    status: getBreakEvenStatus(profit),
  };
}

export function roundToIncrement(value: number, increment: number): number {
  validateNonNegativeFinite(value, "valor");
  validatePositiveFinite(increment, "incremento");

  const ratio = value / increment;
  const tolerance = Number.EPSILON * Math.max(1, Math.abs(ratio)) * 100;
  const rounded = Math.ceil(ratio - tolerance) * increment;

  return roundToPrecision(rounded, ROUNDING_PRECISION);
}

export function parseMoneyInput(
  value: string,
): ParseBreakEvenInputResult {
  return parseNumericInput(value, { maxDecimals: 2, preferDecimal: false });
}

export function parsePercentInput(
  value: string,
): ParseBreakEvenInputResult {
  return parseNumericInput(value, { maxDecimals: 4, preferDecimal: true });
}

export function parseQuantityInput(
  value: string,
): ParseBreakEvenInputResult {
  return parseNumericInput(value, { maxDecimals: 4, preferDecimal: false });
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(roundCurrency(value));
}

export function formatPercent(value: number): string {
  return `${percentFormatter.format(roundCurrency(value))}%`;
}

export function formatQuantity(value: number): string {
  return quantityFormatter.format(roundToPrecision(value, ROUNDING_PRECISION));
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function buildExpectedAnalysis(
  input: BreakEvenInput,
  expectedUnits: number,
  exactBreakEvenUnits: number,
  practicalBreakEvenUnits: number,
  exactBreakEvenSales: number,
): ExpectedVolumeAnalysis {
  const analysis = analyzeVolume(input, expectedUnits);
  const differenceFromExactSales = analysis.revenue - exactBreakEvenSales;

  return {
    ...analysis,
    differenceFromExactUnits: expectedUnits - exactBreakEvenUnits,
    differenceFromPracticalUnits: expectedUnits - practicalBreakEvenUnits,
    differenceFromExactSales,
    safetyMarginAmount: differenceFromExactSales,
    safetyMarginPercent:
      analysis.revenue > 0
        ? (differenceFromExactSales / analysis.revenue) * 100
        : null,
  };
}

function buildTargetAnalysis(
  input: BreakEvenInput,
  contributionPerUnit: number,
  targetProfit: number,
): TargetProfitAnalysis {
  const exactUnits = (input.fixedCosts + targetProfit) / contributionPerUnit;
  const practicalUnits = roundToIncrement(exactUnits, input.increment);
  const practicalAnalysis = analyzeVolume(input, practicalUnits);

  return {
    targetProfit,
    exactUnits,
    practicalUnits,
    practicalSales: practicalAnalysis.revenue,
    actualProfit: practicalAnalysis.profit,
  };
}

function buildScenarios(
  input: BreakEvenInput,
  exactBreakEvenUnits: number,
): BreakEvenScenario[] {
  if (exactBreakEvenUnits <= 0) {
    return [];
  }

  const seenUnits = new Set<string>();

  return [80, 100, 120, 150].flatMap((percentage) => {
    const units = roundToIncrement(
      exactBreakEvenUnits * (percentage / 100),
      input.increment,
    );
    const key = units.toFixed(ROUNDING_PRECISION);

    if (seenUnits.has(key)) {
      return [];
    }

    seenUnits.add(key);

    return [
      {
        percentage,
        ...analyzeVolume(input, units),
      },
    ];
  });
}

function getBreakEvenStatus(profit: number): BreakEvenStatus {
  if (Math.abs(profit) < PROFIT_TOLERANCE) {
    return "break_even";
  }

  return profit > 0 ? "above" : "below";
}

function validateInput(input: BreakEvenInput): void {
  validatePositiveFinite(input.price, "precio");
  validateNonNegativeFinite(input.variableCost, "costo variable");
  validateNonNegativeFinite(input.fixedCosts, "costos fijos");
  validateNonNegativeFinite(input.commissionRate, "comisión");
  validatePositiveFinite(input.increment, "incremento");

  if (input.commissionRate >= 100) {
    throw new RangeError("La comisión debe ser menor que 100%.");
  }

  if (input.expectedUnits !== undefined) {
    validateNonNegativeFinite(input.expectedUnits, "unidades esperadas");
  }

  if (input.targetProfit !== undefined) {
    validateNonNegativeFinite(input.targetProfit, "utilidad objetivo");
  }
}

function validatePositiveFinite(value: number, label: string): void {
  validateNonNegativeFinite(value, label);

  if (value <= 0) {
    throw new RangeError(`El ${label} debe ser mayor que cero.`);
  }
}

function validateNonNegativeFinite(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`Revisa el valor de ${label}.`);
  }
}

function roundToPrecision(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function parseNumericInput(
  value: string,
  options: { maxDecimals: number; preferDecimal: boolean },
): ParseBreakEvenInputResult {
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
