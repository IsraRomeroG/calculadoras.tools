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
  conservative: "Conservador",
  base: "Base",
  optimistic: "Optimista",
};

export function calculateAppreciation(
  input: AppreciationInput,
): AppreciationResult {
  const currentValue = normalizePositiveMoney(
    input.currentValue,
    "El valor actual",
  );
  const annualRatePercent = normalizeRate(input.annualRatePercent);
  const years = normalizeYears(input.years);
  const improvements = normalizeNonNegativeMoney(
    input.improvements ?? 0,
    "Las mejoras",
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
  locale = "es-MX",
): string {
  assertFiniteNumber(value, "El importe");

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactCurrency(
  value: number,
  currency = "MXN",
  locale = "es-MX",
): string {
  assertFiniteNumber(value, "El importe");

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  assertFiniteNumber(value, "El porcentaje");

  return `${new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 2,
  }).format(value)}%`;
}

export function roundMoney(value: number): number {
  assertFiniteNumber(value, "El importe");

  return Math.round(value * 100) / 100;
}

export function buildInterpretation(result: AppreciationResult): string {
  const gainLabel =
    result.baseScenario.nominalGain >= 0 ? "aumentar" : "disminuir";
  const absoluteGain = Math.abs(result.baseScenario.nominalGain);

  return `Con una plusvalía anual de ${formatPercent(result.annualRatePercent)}, tu propiedad podría ${gainLabel} aproximadamente ${formatCurrency(absoluteGain)} en ${result.years} años.`;
}

export function buildCopyText(result: AppreciationResult): string {
  return [
    "Calculadora de plusvalia estimada - calculadoras.tools",
    `Valor actual: ${formatCurrency(result.currentValue)}`,
    `Mejoras incluidas: ${formatCurrency(result.improvements)}`,
    `Base proyectada: ${formatCurrency(result.baseAmount)}`,
    `Tasa base anual: ${formatPercent(result.annualRatePercent)}`,
    `Plazo: ${result.years} años`,
    `Valor futuro base: ${formatCurrency(result.baseScenario.futureValue)}`,
    `Ganancia/perdida nominal: ${formatCurrency(result.baseScenario.nominalGain)}`,
    `Plusvalia acumulada: ${formatPercent(result.baseScenario.accumulatedAppreciationPercent)}`,
    ...result.scenarios.map(
      (scenario) =>
        `${scenario.label}: ${formatCurrency(scenario.futureValue)} (${formatPercent(scenario.annualRatePercent)} anual)`,
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
      "Una tasa mayor a 20% anual puede ser optimista para una proyección inmobiliaria. Revísala contra referencias de mercado.",
    );
  }

  if (options.years > 30) {
    warnings.push(
      "A plazos mayores de 30 años la incertidumbre aumenta; interpreta la proyección como un rango orientativo.",
    );
  }

  if (options.improvements > options.currentValue * 0.5) {
    warnings.push(
      "Las mejoras superan 50% del valor actual. No toda mejora se refleja necesariamente 1:1 en el precio de mercado.",
    );
  }

  return warnings;
}

function normalizePositiveMoney(value: number, label: string): number {
  assertFiniteNumber(value, label);

  if (value <= 0) {
    throw new RangeError(`${label} debe ser mayor que cero.`);
  }

  return value;
}

function normalizeNonNegativeMoney(value: number, label: string): number {
  assertFiniteNumber(value, label);

  if (value < 0) {
    throw new RangeError(`${label} no puede ser negativo.`);
  }

  return value;
}

function normalizeRate(value: number): number {
  assertFiniteNumber(value, "La plusvalía anual");

  if (value <= -100 || value > 100) {
    throw new RangeError("La plusvalía anual debe ser mayor que -100% y menor o igual que 100%.");
  }

  return value;
}

function normalizeYears(value: number): number {
  assertFiniteNumber(value, "El plazo");

  if (!Number.isInteger(value) || value < 1 || value > 100) {
    throw new RangeError("El plazo debe ser un número entero entre 1 y 100 años.");
  }

  return value;
}

function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${label} debe ser un numero valido.`);
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
