export const SCENARIO_IDS = ["conservative", "base", "optimistic"] as const;

export type AppreciationScenarioId = (typeof SCENARIO_IDS)[number];

export interface AppreciationInput {
  currentValue: number;
  annualRatePercent: number;
  years: number;
  improvements?: number;
}

export interface AppreciationScenario {
  id: AppreciationScenarioId;
  label: string;
  annualRatePercent: number;
  futureValue: number;
  nominalGain: number;
  accumulatedAppreciationPercent: number;
}

export interface AppreciationAnnualRow {
  year: number;
  baseValue: number;
  conservativeValue: number;
  optimisticValue: number;
}

export interface AppreciationResult {
  currentValue: number;
  improvements: number;
  baseAmount: number;
  years: number;
  annualRatePercent: number;
  scenarios: AppreciationScenario[];
  baseScenario: AppreciationScenario;
  annualRows: AppreciationAnnualRow[];
  warnings: string[];
}

const SCENARIO_DELTA_PERCENT = 2;
const MIN_SCENARIO_RATE_PERCENT = -99;

const SCENARIO_LABELS: Record<AppreciationScenarioId, string> = {
  conservative: "Conservative",
  base: "Base",
  optimistic: "Optimistic",
};

export function calculateAppreciation(
  input: AppreciationInput,
): AppreciationResult {
  const currentValue = normalizePositiveMoney(
    input.currentValue,
    "The current value",
  );
  const annualRatePercent = normalizeRate(input.annualRatePercent);
  const years = normalizeYears(input.years);
  const improvements = normalizeNonNegativeMoney(
    input.improvements ?? 0,
    "The improvements",
  );
  const baseAmount = currentValue + improvements;
  const scenarioRates = {
    conservative: Math.max(
      annualRatePercent - SCENARIO_DELTA_PERCENT,
      MIN_SCENARIO_RATE_PERCENT,
    ),
    base: annualRatePercent,
    optimistic: annualRatePercent + SCENARIO_DELTA_PERCENT,
  } satisfies Record<AppreciationScenarioId, number>;
  const scenarios = SCENARIO_IDS.map((id) =>
    buildScenario(id, baseAmount, years, scenarioRates[id]),
  );
  const baseScenario =
    scenarios.find((scenario) => scenario.id === "base") ?? scenarios[1];

  return {
    currentValue,
    improvements,
    baseAmount,
    years,
    annualRatePercent,
    scenarios,
    baseScenario,
    annualRows: buildAnnualRows(baseAmount, years, scenarioRates),
    warnings: buildWarnings({
      annualRatePercent,
      years,
      currentValue,
      improvements,
    }),
  };
}

export function parseLocalizedNumber(value: string): number | null {
  const cleaned = value
    .trim()
    .replace(/\s+/g, "")
    .replace(/MXN|USD|EUR/gi, "")
    .replace(/[%$]/g, "");

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
    maximumFractionDigits: 2,
  }).format(value)}%`;
}

export function roundMoney(value: number): number {
  assertFiniteNumber(value, "The amount");

  return Math.round(value * 100) / 100;
}

export function buildInterpretation(result: AppreciationResult): string {
  const gainLabel =
    result.baseScenario.nominalGain >= 0 ? "increase" : "decrease";
  const absoluteGain = Math.abs(result.baseScenario.nominalGain);

  return `With annual appreciation of ${formatPercent(result.annualRatePercent)}, your property could ${gainLabel} by approximately ${formatCurrency(absoluteGain)} over ${result.years} years.`;
}

export function buildCopyText(result: AppreciationResult): string {
  return [
    "Property appreciation calculator - calculadoras.tools",
    `Current value: ${formatCurrency(result.currentValue)}`,
    `Included improvements: ${formatCurrency(result.improvements)}`,
    `Projection base: ${formatCurrency(result.baseAmount)}`,
    `Base annual rate: ${formatPercent(result.annualRatePercent)}`,
    `Term: ${result.years} years`,
    `Base future value: ${formatCurrency(result.baseScenario.futureValue)}`,
    `Nominal gain/loss: ${formatCurrency(result.baseScenario.nominalGain)}`,
    `Accumulated appreciation: ${formatPercent(result.baseScenario.accumulatedAppreciationPercent)}`,
    ...result.scenarios.map(
      (scenario) =>
        `${scenario.label}: ${formatCurrency(scenario.futureValue)} (${formatPercent(scenario.annualRatePercent)} annually)`,
    ),
  ].join("\n");
}

function buildScenario(
  id: AppreciationScenarioId,
  baseAmount: number,
  years: number,
  annualRatePercent: number,
): AppreciationScenario {
  const futureValue = projectValue(baseAmount, annualRatePercent, years);
  const nominalGain = futureValue - baseAmount;
  const accumulatedAppreciationPercent = (futureValue / baseAmount - 1) * 100;

  return {
    id,
    label: SCENARIO_LABELS[id],
    annualRatePercent,
    futureValue,
    nominalGain,
    accumulatedAppreciationPercent,
  };
}

function buildAnnualRows(
  baseAmount: number,
  years: number,
  rates: Record<AppreciationScenarioId, number>,
): AppreciationAnnualRow[] {
  return Array.from({ length: years }, (_, index) => {
    const year = index + 1;

    return {
      year,
      baseValue: projectValue(baseAmount, rates.base, year),
      conservativeValue: projectValue(baseAmount, rates.conservative, year),
      optimisticValue: projectValue(baseAmount, rates.optimistic, year),
    };
  });
}

function projectValue(
  baseAmount: number,
  annualRatePercent: number,
  years: number,
): number {
  return baseAmount * (1 + annualRatePercent / 100) ** years;
}

function buildWarnings(options: {
  annualRatePercent: number;
  years: number;
  currentValue: number;
  improvements: number;
}): string[] {
  const warnings: string[] = [];

  if (options.annualRatePercent > 20) {
    warnings.push(
      "An annual rate above 20% may be optimistic for a real estate projection. Compare it with market references.",
    );
  }

  if (options.years > 30) {
    warnings.push(
      "Uncertainty increases beyond 30 years; treat the projection as an illustrative range.",
    );
  }

  if (options.improvements > options.currentValue * 0.5) {
    warnings.push(
      "Improvements exceed 50% of the current value. Not every improvement is reflected dollar-for-dollar in market value.",
    );
  }

  return warnings;
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

function normalizeRate(value: number): number {
  assertFiniteNumber(value, "The annual appreciation");

  if (value <= -100 || value > 100) {
    throw new RangeError("Annual appreciation must be greater than -100% and no more than 100%.");
  }

  return value;
}

function normalizeYears(value: number): number {
  assertFiniteNumber(value, "The term");

  if (!Number.isInteger(value) || value < 1 || value > 100) {
    throw new RangeError("The term must be a whole number between 1 and 100 years.");
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
