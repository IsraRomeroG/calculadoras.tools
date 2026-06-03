export type StatisticsParseError =
  | "too_many_characters"
  | "too_many_values"
  | "ambiguous_list"
  | "invalid_token"
  | "invalid_number"
  | "thousands_separator";

export type ParseStatisticsInputResult =
  | {
      ok: true;
      values: number[];
      normalizedInput: string;
      tokens: string[];
    }
  | {
      ok: false;
      error: StatisticsParseError;
      message: string;
      token?: string;
    };

export interface FrequencyRow {
  value: number;
  frequency: number;
  percentage: number;
}

export interface BasicStatistics {
  count: number;
  sum: number;
  mean: number;
  median: number;
  modes: number[];
  hasMode: boolean;
  min: number;
  max: number;
  range: number;
  sortedValues: number[];
  maxFrequency: number;
  frequencyTable: FrequencyRow[];
}

export interface StatisticsCalculationSteps {
  mean: string;
  median: string;
  mode: string;
  range: string;
}

export interface StatisticsExample {
  id: string;
  label: string;
  description: string;
  value: string;
}

export const MAX_STATISTICS_VALUES = 1000;
export const MAX_STATISTICS_CHARACTERS = 10000;
export const MAX_SHARE_VALUES = 50;
export const MAX_SHARE_CHARACTERS = 500;
export const DEFAULT_STATISTICS_DECIMALS = 2;
export const STATISTICS_CANONICAL_PATH =
  "/matematicas/calculadora-de-estadistica-basica";

export const STATISTICS_EXAMPLES: StatisticsExample[] = [
  {
    id: "grades",
    label: "Calificaciones",
    description: "Promedio escolar con un valor repetido.",
    value: "70; 85; 85; 90; 100",
  },
  {
    id: "decimal-measurements",
    label: "Mediciones decimales",
    description: "Decimales con coma separados por punto y coma.",
    value: "1,5; 1,7; 1,7; 2,1",
  },
  {
    id: "no-mode",
    label: "Sin moda",
    description: "Todos los valores aparecen una sola vez.",
    value: "2; 4; 6; 8",
  },
  {
    id: "multimodal",
    label: "Multimodal",
    description: "Dos valores empatan como los mas frecuentes.",
    value: "1; 1; 2; 2; 3",
  },
];

export function parseStatisticsInput(
  rawValue: string,
): ParseStatisticsInputResult {
  const value = rawValue.replaceAll("−", "-");

  if (value.length > MAX_STATISTICS_CHARACTERS) {
    return {
      ok: false,
      error: "too_many_characters",
      message: `La lista supera el limite de ${MAX_STATISTICS_CHARACTERS} caracteres.`,
    };
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return {
      ok: true,
      values: [],
      normalizedInput: "",
      tokens: [],
    };
  }

  const tokenResult = tokenizeStatisticsInput(trimmed);

  if (!tokenResult.ok) {
    return tokenResult;
  }

  if (tokenResult.tokens.length > MAX_STATISTICS_VALUES) {
    return {
      ok: false,
      error: "too_many_values",
      message: `La lista supera el limite de ${MAX_STATISTICS_VALUES} valores.`,
    };
  }

  const values: number[] = [];
  const normalizedTokens: string[] = [];

  for (const token of tokenResult.tokens) {
    const parsed = parseStatisticsToken(token);

    if (!parsed.ok) {
      return parsed;
    }

    values.push(parsed.value);
    normalizedTokens.push(parsed.normalized);
  }

  return {
    ok: true,
    values,
    normalizedInput: normalizedTokens.join("; "),
    tokens: normalizedTokens,
  };
}

export function calculateMean(values: number[]): number {
  assertNonEmptyFiniteValues(values);

  return calculateSum(values) / values.length;
}

export function calculateMedian(values: number[]): number {
  assertNonEmptyFiniteValues(values);

  const sortedValues = sortValuesAscending(values);
  const middleIndex = Math.floor(sortedValues.length / 2);

  if (sortedValues.length % 2 === 1) {
    return sortedValues[middleIndex];
  }

  return (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2;
}

export function calculateModes(values: number[]): {
  modes: number[];
  hasMode: boolean;
  maxFrequency: number;
} {
  assertNonEmptyFiniteValues(values);

  const frequencyTable = buildFrequencyTable(values);
  const maxFrequency = Math.max(...frequencyTable.map((row) => row.frequency));

  if (values.length > 1 && maxFrequency === 1) {
    return {
      modes: [],
      hasMode: false,
      maxFrequency,
    };
  }

  return {
    modes: frequencyTable
      .filter((row) => row.frequency === maxFrequency)
      .map((row) => row.value),
    hasMode: true,
    maxFrequency,
  };
}

export function calculateRange(values: number[]): number {
  assertNonEmptyFiniteValues(values);

  return Math.max(...values) - Math.min(...values);
}

export function buildFrequencyTable(values: number[]): FrequencyRow[] {
  assertNonEmptyFiniteValues(values);

  const frequencies = new Map<string, { value: number; frequency: number }>();

  for (const rawValue of values) {
    const value = normalizeNegativeZero(rawValue);
    const key = String(value);
    const current = frequencies.get(key);

    if (current) {
      current.frequency += 1;
    } else {
      frequencies.set(key, { value, frequency: 1 });
    }
  }

  return Array.from(frequencies.values())
    .sort((a, b) => a.value - b.value)
    .map((row) => ({
      ...row,
      percentage: (row.frequency / values.length) * 100,
    }));
}

export function calculateBasicStatistics(values: number[]): BasicStatistics {
  assertNonEmptyFiniteValues(values);

  const sortedValues = sortValuesAscending(values);
  const frequencyTable = buildFrequencyTable(values);
  const modesResult = calculateModes(values);

  return {
    count: values.length,
    sum: calculateSum(values),
    mean: calculateMean(values),
    median: calculateMedian(values),
    modes: modesResult.modes,
    hasMode: modesResult.hasMode,
    min: sortedValues[0],
    max: sortedValues[sortedValues.length - 1],
    range: calculateRange(values),
    sortedValues,
    maxFrequency: modesResult.maxFrequency,
    frequencyTable,
  };
}

export function buildStatisticsInterpretation(
  statistics: BasicStatistics,
  decimals = DEFAULT_STATISTICS_DECIMALS,
): string {
  const safeDecimals = normalizeStatisticsDecimals(decimals);
  const roundedMean = roundToDecimals(statistics.mean, safeDecimals);
  const roundedMedian = roundToDecimals(statistics.median, safeDecimals);

  if (statistics.count === 1) {
    return "Con un solo valor, media, mediana y moda coinciden.";
  }

  if (!statistics.hasMode) {
    return "No hay moda porque todos los valores aparecen una sola vez.";
  }

  if (statistics.modes.length > 1) {
    return `Hay ${statistics.modes.length} modas y cada una aparece ${statistics.maxFrequency} veces.`;
  }

  const modePhrase = `El valor mas frecuente es ${formatStatistic(
    statistics.modes[0],
    safeDecimals,
  )} y aparece ${statistics.maxFrequency} veces.`;

  if (roundedMean > roundedMedian) {
    return `La media es mayor que la mediana; algunos valores altos pueden estar empujando el promedio. ${modePhrase}`;
  }

  if (roundedMean < roundedMedian) {
    return `La media es menor que la mediana; algunos valores bajos pueden estar bajando el promedio. ${modePhrase}`;
  }

  return modePhrase;
}

export function buildCalculationSteps(
  values: number[],
  statistics: BasicStatistics,
  decimals = DEFAULT_STATISTICS_DECIMALS,
): StatisticsCalculationSteps {
  const safeDecimals = normalizeStatisticsDecimals(decimals);
  const sortedValues = statistics.sortedValues
    .map((value) => formatFlexibleStatistic(value))
    .join(", ");
  const sum = formatFlexibleStatistic(statistics.sum);
  const mean = formatStatistic(statistics.mean, safeDecimals);
  const median = formatStatistic(statistics.median, safeDecimals);
  const range = formatStatistic(statistics.range, safeDecimals);
  const middleIndex = Math.floor(statistics.sortedValues.length / 2);
  const medianStep =
    statistics.count % 2 === 1
      ? `Ordenamos los datos: ${sortedValues}. El valor central es ${median}.`
      : `Ordenamos los datos: ${sortedValues}. Los dos valores centrales son ${formatFlexibleStatistic(
          statistics.sortedValues[middleIndex - 1],
        )} y ${formatFlexibleStatistic(
          statistics.sortedValues[middleIndex],
        )}; su promedio es ${median}.`;

  return {
    mean: `${sum} / ${statistics.count} = ${mean}.`,
    median: medianStep,
    mode: buildModeStep(statistics, safeDecimals),
    range: `${formatFlexibleStatistic(statistics.max)} - ${formatFlexibleStatistic(
      statistics.min,
    )} = ${range}.`,
  };
}

export function formatStatistic(
  value: number,
  decimals = DEFAULT_STATISTICS_DECIMALS,
): string {
  assertFiniteNumber(value);

  const safeDecimals = normalizeStatisticsDecimals(decimals);

  return new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: safeDecimals,
    maximumFractionDigits: safeDecimals,
  }).format(roundToDecimals(value, safeDecimals));
}

export function formatFlexibleStatistic(value: number): string {
  assertFiniteNumber(value);

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 6,
  }).format(roundToDecimals(value, 6));
}

export function formatFrequencyPercentage(value: number): string {
  assertFiniteNumber(value);

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 2,
  }).format(roundToDecimals(value, 2));
}

export function buildStatisticsSummary(
  values: number[],
  statistics = calculateBasicStatistics(values),
  decimals = DEFAULT_STATISTICS_DECIMALS,
): string {
  const safeDecimals = normalizeStatisticsDecimals(decimals);
  const modes = statistics.hasMode
    ? statistics.modes
        .map((value) => formatStatistic(value, safeDecimals))
        .join(", ")
    : "No hay moda";

  return [
    "Calculadora de estadistica basica",
    `Datos: ${values.map((value) => formatFlexibleStatistic(value)).join("; ")}`,
    `Media: ${formatStatistic(statistics.mean, safeDecimals)}`,
    `Mediana: ${formatStatistic(statistics.median, safeDecimals)}`,
    `Moda: ${modes}`,
    `Cantidad de datos: ${statistics.count}`,
    `Suma: ${formatStatistic(statistics.sum, safeDecimals)}`,
    `Minimo: ${formatStatistic(statistics.min, safeDecimals)}`,
    `Maximo: ${formatStatistic(statistics.max, safeDecimals)}`,
    `Rango: ${formatStatistic(statistics.range, safeDecimals)}`,
    buildStatisticsInterpretation(statistics, safeDecimals),
  ].join("\n");
}

export function buildFrequencyTableText(
  frequencyTable: FrequencyRow[],
  decimals = DEFAULT_STATISTICS_DECIMALS,
): string {
  const safeDecimals = normalizeStatisticsDecimals(decimals);

  return [
    "Valor\tFrecuencia\tPorcentaje",
    ...frequencyTable.map(
      (row) =>
        `${formatStatistic(row.value, safeDecimals)}\t${row.frequency}\t${formatFrequencyPercentage(
          row.percentage,
        )}%`,
    ),
  ].join("\n");
}

export function buildShareableStatisticsUrl(
  values: number[],
  basePath = STATISTICS_CANONICAL_PATH,
): string | null {
  if (values.length === 0 || values.length > MAX_SHARE_VALUES) {
    return null;
  }

  const normalizedInput = values
    .map((value) => formatShareValue(value))
    .join(";");

  if (normalizedInput.length > MAX_SHARE_CHARACTERS) {
    return null;
  }

  return `${basePath}?datos=${encodeURIComponent(normalizedInput)}`;
}

export function shouldShowRoundingNote(values: number[], decimals: number) {
  const safeDecimals = normalizeStatisticsDecimals(decimals);
  const seenRoundedValues = new Map<string, number>();

  for (const value of values) {
    const roundedValue = formatStatistic(value, safeDecimals);
    const current = seenRoundedValues.get(roundedValue);

    if (current !== undefined && current !== value) {
      return true;
    }

    seenRoundedValues.set(roundedValue, value);
  }

  return false;
}

function tokenizeStatisticsInput(
  value: string,
):
  | { ok: true; tokens: string[] }
  | {
      ok: false;
      error: "ambiguous_list";
      message: string;
      token?: string;
    } {
  const hasPrimarySeparators = /[;\r\n]/.test(value);
  const rawTokens = hasPrimarySeparators
    ? value.split(/[;\r\n]+/)
    : value.split(/\s*,\s+|\s+/);
  const tokens = rawTokens.map((token) => token.trim()).filter(Boolean);

  if (
    !hasPrimarySeparators &&
    tokens.length === 1 &&
    countOccurrences(tokens[0], ",") > 1
  ) {
    return {
      ok: false,
      error: "ambiguous_list",
      message:
        "La lista es ambigua. Si son varios valores, usa punto y coma: 1; 2; 3.",
      token: tokens[0],
    };
  }

  return { ok: true, tokens };
}

function parseStatisticsToken(
  token: string,
):
  | { ok: true; value: number; normalized: string }
  | {
      ok: false;
      error: Exclude<StatisticsParseError, "too_many_characters" | "too_many_values" | "ambiguous_list">;
      message: string;
      token: string;
    } {
  if (isApparentThousandsSeparator(token)) {
    return {
      ok: false,
      error: "thousands_separator",
      message: `No uses separadores de miles. Escribe ${token.replace(/[,.]/g, "")} en lugar de ${token}.`,
      token,
    };
  }

  if (/nan|infinity/i.test(token)) {
    return {
      ok: false,
      error: "invalid_number",
      message: `${token} no es un numero valido para esta calculadora.`,
      token,
    };
  }

  if (!/^[+-]?\d+(?:[.,]\d+)?$/.test(token)) {
    return {
      ok: false,
      error: "invalid_token",
      message: `No se pudo leer "${token}" como numero. Corrige ese valor para continuar.`,
      token,
    };
  }

  const normalized = token.replace(",", ".");
  const value = normalizeNegativeZero(Number(normalized));

  if (!Number.isFinite(value)) {
    return {
      ok: false,
      error: "invalid_number",
      message: `${token} no es un numero valido para esta calculadora.`,
      token,
    };
  }

  return {
    ok: true,
    value,
    normalized: formatShareValue(value),
  };
}

function buildModeStep(statistics: BasicStatistics, decimals: number) {
  if (!statistics.hasMode) {
    return "Ningun valor se repite, asi que no hay moda.";
  }

  const modeText = statistics.modes
    .map((value) => formatStatistic(value, decimals))
    .join(", ");

  if (statistics.count === 1) {
    return `El unico valor es ${modeText}; por eso tambien se muestra como moda.`;
  }

  if (statistics.modes.length > 1) {
    return `Las modas son ${modeText}, cada una con frecuencia ${statistics.maxFrequency}.`;
  }

  return `La moda es ${modeText}, con frecuencia ${statistics.maxFrequency}.`;
}

function calculateSum(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0);
}

function sortValuesAscending(values: number[]) {
  return values.map(normalizeNegativeZero).toSorted((a, b) => a - b);
}

function assertNonEmptyFiniteValues(values: number[]) {
  if (values.length === 0) {
    throw new RangeError("La lista debe incluir al menos un valor.");
  }

  values.forEach(assertFiniteNumber);
}

function assertFiniteNumber(value: number) {
  if (!Number.isFinite(value)) {
    throw new RangeError("Todos los valores deben ser numeros finitos.");
  }
}

function normalizeStatisticsDecimals(decimals = DEFAULT_STATISTICS_DECIMALS) {
  if (!Number.isFinite(decimals)) {
    return DEFAULT_STATISTICS_DECIMALS;
  }

  return Math.min(6, Math.max(0, Math.trunc(decimals)));
}

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** decimals;

  return normalizeNegativeZero(
    Math.round((value + Number.EPSILON) * factor) / factor,
  );
}

function normalizeNegativeZero(value: number) {
  return Object.is(value, -0) ? 0 : value;
}

function formatShareValue(value: number) {
  return String(normalizeNegativeZero(value));
}

function countOccurrences(value: string, character: string) {
  return value.split(character).length - 1;
}

function isApparentThousandsSeparator(token: string) {
  return /^[+-]?\d{1,3}[,.]\d{3}$/.test(token);
}
