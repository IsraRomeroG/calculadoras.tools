



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
  "/en/math/basic-statistics-calculator";

export const STATISTICS_EXAMPLES: StatisticsExample[] = [
  {
    id: "grades",
    label: "Grades",
    description: "Grade average with one repeated value.",
    value: "70; 85; 85; 90; 100",
  },
  {
    id: "decimal-measurements",
    label: "Decimal measurements",
    description: "Comma decimals separated by semicolons.",
    value: "1,5; 1,7; 1,7; 2,1",
  },
  {
    id: "no-mode",
    label: "No mode",
    description: "Every value appears once.",
    value: "2; 4; 6; 8",
  },
  {
    id: "multimodal",
    label: "Multimodal",
    description: "Two values tie as the most frequent.",
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
      message: `The list exceeds the limit of ${MAX_STATISTICS_CHARACTERS} characters.`,
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
      message: `The list exceeds the limit of ${MAX_STATISTICS_VALUES} values.`,
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
    return "With one value, the mean, median and mode are the same.";
  }

  if (!statistics.hasMode) {
    return "There is no mode because every value appears once.";
  }

  if (statistics.modes.length > 1) {
    return `There are ${statistics.modes.length} modes and each appears ${statistics.maxFrequency} times.`;
  }

  const modePhrase = `The most frequent value is ${formatStatistic(
    statistics.modes[0],
    safeDecimals,
  )} and appears ${statistics.maxFrequency} times.`;

  if (roundedMean > roundedMedian) {
    return `The mean is greater than the median; some high values may be pulling the average upward. ${modePhrase}`;
  }

  if (roundedMean < roundedMedian) {
    return `The mean is less than the median; some low values may be pulling the average downward. ${modePhrase}`;
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
      ? `Sorted data: ${sortedValues}. The middle value is ${median}.`
      : `Sorted data: ${sortedValues}. The two middle values are ${formatFlexibleStatistic(
          statistics.sortedValues[middleIndex - 1],
  )} and ${formatFlexibleStatistic(
          statistics.sortedValues[middleIndex],
        )}; their average is ${median}.`;

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

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: safeDecimals,
    maximumFractionDigits: safeDecimals,
  }).format(roundToDecimals(value, safeDecimals));
}

export function formatFlexibleStatistic(value: number): string {
  assertFiniteNumber(value);

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 6,
  }).format(roundToDecimals(value, 6));
}

export function formatFrequencyPercentage(value: number): string {
  assertFiniteNumber(value);

  return new Intl.NumberFormat("en-US", {
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
    : "No mode";

  return [
    "Basic statistics calculator",
    `Data: ${values.map((value) => formatFlexibleStatistic(value)).join("; ")}`,
    `Mean: ${formatStatistic(statistics.mean, safeDecimals)}`,
    `Median: ${formatStatistic(statistics.median, safeDecimals)}`,
    `Mode: ${modes}`,
    `Data count: ${statistics.count}`,
    `Sum: ${formatStatistic(statistics.sum, safeDecimals)}`,
    `Minimum: ${formatStatistic(statistics.min, safeDecimals)}`,
    `Maximum: ${formatStatistic(statistics.max, safeDecimals)}`,
    `Range: ${formatStatistic(statistics.range, safeDecimals)}`,
    buildStatisticsInterpretation(statistics, safeDecimals),
  ].join("\n");
}

export function buildFrequencyTableText(
  frequencyTable: FrequencyRow[],
  decimals = DEFAULT_STATISTICS_DECIMALS,
): string {
  const safeDecimals = normalizeStatisticsDecimals(decimals);

  return [
    "Value\tFrequency\tPercentage",
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

  return `${basePath}?data=${encodeURIComponent(normalizedInput)}`;
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
        "The list is ambiguous. For multiple values, use semicolons: 1; 2; 3.",
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
      message: `Do not use thousands separators. Enter ${token.replace(/[,.]/g, "")} instead of ${token}.`,
      token,
    };
  }

  if (/nan|infinity/i.test(token)) {
    return {
      ok: false,
      error: "invalid_number",
      message: `${token} is not a valid number for this calculator.`,
      token,
    };
  }

  if (!/^[+-]?\d+(?:[.,]\d+)?$/.test(token)) {
    return {
      ok: false,
      error: "invalid_token",
      message: `"${token}" could not be read as a number. Correct that value to continue.`,
      token,
    };
  }

  const normalized = token.replace(",", ".");
  const value = normalizeNegativeZero(Number(normalized));

  if (!Number.isFinite(value)) {
    return {
      ok: false,
      error: "invalid_number",
      message: `${token} is not a valid number for this calculator.`,
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
    return "No value repeats, so there is no mode.";
  }

  const modeText = statistics.modes
    .map((value) => formatStatistic(value, decimals))
    .join(", ");

  if (statistics.count === 1) {
    return `The only value is ${modeText}; so it is also shown as the mode.`;
  }

  if (statistics.modes.length > 1) {
    return `The modes are ${modeText}, each with frequency ${statistics.maxFrequency}.`;
  }

  return `The mode is ${modeText}, with frequency ${statistics.maxFrequency}.`;
}

function calculateSum(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0);
}

function sortValuesAscending(values: number[]) {
  return values.map(normalizeNegativeZero).toSorted((a, b) => a - b);
}

function assertNonEmptyFiniteValues(values: number[]) {
  if (values.length === 0) {
    throw new RangeError("The list must include at least one value.");
  }

  values.forEach(assertFiniteNumber);
}

function assertFiniteNumber(value: number) {
  if (!Number.isFinite(value)) {
    throw new RangeError("All values must be finite numbers.");
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





