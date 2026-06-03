export const DISTANCE_UNITS = ["km", "mi"] as const;

export type DistanceUnit = (typeof DISTANCE_UNITS)[number];

export interface DistanceUnitMetadata {
  label: string;
  symbol: string;
  kilometers: number;
}

export const KILOMETERS_PER_MILE = 1.609344;
export const MILES_PER_KILOMETER = 1 / KILOMETERS_PER_MILE;

export const DISTANCE_UNIT_METADATA = {
  km: {
    label: "Kilómetros",
    symbol: "km",
    kilometers: 1,
  },
  mi: {
    label: "Millas terrestres",
    symbol: "mi",
    kilometers: KILOMETERS_PER_MILE,
  },
} as const satisfies Record<DistanceUnit, DistanceUnitMetadata>;

export type ParseDistanceInputResult =
  | {
      ok: true;
      value: number;
      normalized: string;
      detectedUnit?: DistanceUnit;
    }
  | {
      ok: false;
      error: "empty" | "incomplete" | "invalid" | "nautical";
    };

export interface DistanceExplanation {
  formula: string;
  substitution: string;
  result: string;
  steps: string[];
}

const DEFAULT_DECIMALS = 2;
const MAX_ADAPTIVE_DECIMALS = 8;
const SCIENTIFIC_NOTATION_UPPER_THRESHOLD = 1_000_000_000_000;
const SCIENTIFIC_NOTATION_LOWER_THRESHOLD = 0.00000001;

const UNIT_ALIASES: Record<string, DistanceUnit> = {
  km: "km",
  kilometro: "km",
  kilometros: "km",
  mi: "mi",
  milla: "mi",
  millas: "mi",
};

const NAUTICAL_ALIASES = new Set([
  "nmi",
  "milla nautica",
  "millas nauticas",
  "nautical mile",
  "nautical miles",
]);

export function isDistanceUnit(value: string): value is DistanceUnit {
  return DISTANCE_UNITS.includes(value as DistanceUnit);
}

export function parseDistanceInput(
  rawValue: string,
): ParseDistanceInputResult {
  const trimmed = rawValue.trim().replaceAll("−", "-");

  if (!trimmed) {
    return { ok: false, error: "empty" };
  }

  if (isIncompleteDistanceInput(trimmed)) {
    return { ok: false, error: "incomplete" };
  }

  const match = trimmed.match(
    /^([+-]?(?:(?:\d[\d., ]*|[.,]\d+)(?:e[+-]?\d+)?))(?:\s*([\p{L}]+(?:\s+[\p{L}]+)*))?$/iu,
  );

  if (!match) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeLocalizedNumber(match[1]);

  if (!normalized) {
    return { ok: false, error: "invalid" };
  }

  const value = Number(normalized);

  if (!Number.isFinite(value)) {
    return { ok: false, error: "invalid" };
  }

  const unitText = match[2];
  const detectedUnit = detectDistanceUnit(unitText);

  if (unitText && isNauticalUnit(unitText)) {
    return { ok: false, error: "nautical" };
  }

  if (unitText && !detectedUnit) {
    return { ok: false, error: "invalid" };
  }

  return {
    ok: true,
    value,
    normalized: String(value),
    ...(detectedUnit ? { detectedUnit } : {}),
  };
}

export function convertDistance(
  value: number,
  from: DistanceUnit,
  to: DistanceUnit,
): number {
  assertValidDistance(value);

  return (value * DISTANCE_UNIT_METADATA[from].kilometers) /
    DISTANCE_UNIT_METADATA[to].kilometers;
}

export function convertAllDistances(
  value: number,
  from: DistanceUnit,
): Record<DistanceUnit, number> {
  assertValidDistance(value);

  return Object.fromEntries(
    DISTANCE_UNITS.map((unit) => [unit, convertDistance(value, from, unit)]),
  ) as Record<DistanceUnit, number>;
}

export function getDistanceFormula(
  from: DistanceUnit,
  to: DistanceUnit,
): string {
  if (from === to) {
    return `${to} = ${from}`;
  }

  if (from === "km" && to === "mi") {
    return "mi = km / 1.609344";
  }

  return "km = mi * 1.609344";
}

export function buildDistanceExplanation(
  value: number,
  from: DistanceUnit,
  to: DistanceUnit,
  decimals = DEFAULT_DECIMALS,
): DistanceExplanation {
  const resultValue = convertDistance(value, from, to);
  const formula = getDistanceFormula(from, to);
  const formattedSource = formatDistanceNumber(value, decimals);
  const result = formatDistance(resultValue, to, decimals);

  if (from === to) {
    return {
      formula,
      substitution: `${to} = ${formattedSource}`,
      result,
      steps: [
        "La unidad de origen y destino es la misma.",
        `Resultado: ${result}.`,
      ],
    };
  }

  const substitution = formula.replace(
    new RegExp(`\\b${escapeRegExp(from)}\\b`, "g"),
    formattedSource,
  );

  return {
    formula,
    substitution,
    result,
    steps: [
      `Usamos la fórmula: ${formula}.`,
      `Sustituimos el valor: ${substitution}.`,
      `Resultado: ${result}.`,
    ],
  };
}

export function formatDistance(
  value: number,
  unit: DistanceUnit,
  decimals = DEFAULT_DECIMALS,
): string {
  return `${formatDistanceNumber(value, decimals)} ${DISTANCE_UNIT_METADATA[unit].symbol}`;
}

export function formatDistanceNumber(
  value: number,
  decimals = DEFAULT_DECIMALS,
): string {
  assertFinite(value);

  const safeDecimals = normalizeDecimals(decimals);
  const normalizedValue = Object.is(value, -0) ? 0 : value;
  const absoluteValue = Math.abs(normalizedValue);

  if (
    absoluteValue >= SCIENTIFIC_NOTATION_UPPER_THRESHOLD ||
    (absoluteValue > 0 && absoluteValue < SCIENTIFIC_NOTATION_LOWER_THRESHOLD)
  ) {
    return normalizedValue.toExponential(safeDecimals);
  }

  const adaptiveDecimals = getAdaptiveDecimals(normalizedValue, safeDecimals);

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: adaptiveDecimals,
  }).format(roundToDecimals(normalizedValue, adaptiveDecimals));
}

export function formatDistanceRate(
  from: DistanceUnit,
  to: DistanceUnit,
  decimals = 6,
): string {
  return `1 ${from} = ${formatDistanceNumber(convertDistance(1, from, to), decimals)} ${to}`;
}

function isIncompleteDistanceInput(value: string) {
  return (
    /^[+-]?(?:[.,])?$/.test(value) ||
    /^[+-]?(?:\d[\d., ]*|[.,]\d+)[eE][+-]?$/.test(value) ||
    /^[+-]?(?:\d[\d ]*|[.,]\d+)[.,]$/.test(value)
  );
}

function normalizeLocalizedNumber(rawValue: string): string | undefined {
  const value = rawValue.trim();
  const exponentIndex = value.search(/[eE]/);
  const mantissa =
    exponentIndex === -1 ? value : value.slice(0, exponentIndex);
  const exponent =
    exponentIndex === -1 ? "" : value.slice(exponentIndex).toLowerCase();

  if (exponent && !/^e[+-]?\d+$/.test(exponent)) {
    return undefined;
  }

  const normalizedMantissa = normalizeMantissa(mantissa);

  return normalizedMantissa ? `${normalizedMantissa}${exponent}` : undefined;
}

function normalizeMantissa(rawMantissa: string): string | undefined {
  const sign = rawMantissa.match(/^[+-]/)?.[0] ?? "";
  const mantissa = sign ? rawMantissa.slice(1) : rawMantissa;

  if (!mantissa || /[+-]/.test(mantissa)) {
    return undefined;
  }

  const lastComma = mantissa.lastIndexOf(",");
  const lastPoint = mantissa.lastIndexOf(".");
  const hasComma = lastComma !== -1;
  const hasPoint = lastPoint !== -1;

  if (hasComma && hasPoint) {
    const decimalSeparator = lastComma > lastPoint ? "," : ".";
    const groupingSeparator = decimalSeparator === "," ? "." : ",";
    const decimalIndex = mantissa.lastIndexOf(decimalSeparator);
    const integerPart = mantissa.slice(0, decimalIndex);
    const decimalPart = mantissa.slice(decimalIndex + 1);

    if (
      !decimalPart ||
      decimalPart.includes(groupingSeparator) ||
      !isValidIntegerPart(integerPart, groupingSeparator)
    ) {
      return undefined;
    }

    return `${sign}${stripGrouping(integerPart, groupingSeparator)}.${decimalPart}`;
  }

  if (hasComma || hasPoint) {
    const separator = hasComma ? "," : ".";
    const parts = mantissa.split(separator);

    if (parts.length > 2) {
      if (!isValidIntegerPart(mantissa, separator)) {
        return undefined;
      }

      return `${sign}${stripGrouping(mantissa, separator)}`;
    }

    const [integerPart, decimalPart] = parts;

    if (!decimalPart) {
      return undefined;
    }

    if (
      separator === "," &&
      integerPart &&
      decimalPart.length === 3 &&
      isValidIntegerPart(mantissa, separator)
    ) {
      return `${sign}${stripGrouping(mantissa, separator)}`;
    }

    const normalizedInteger = normalizeIntegerWithOptionalSpaces(integerPart);

    if (normalizedInteger === undefined) {
      return undefined;
    }

    return `${sign}${normalizedInteger || "0"}.${decimalPart}`;
  }

  if (!isValidIntegerPart(mantissa, " ")) {
    return undefined;
  }

  return `${sign}${stripGrouping(mantissa, " ")}`;
}

function isValidIntegerPart(value: string, separator: string) {
  if (!value) {
    return false;
  }

  if (separator !== " " && value.includes(" ")) {
    return false;
  }

  if (separator === " " && !value.includes(" ")) {
    return /^\d+$/.test(value);
  }

  const groups = value.split(separator);

  return (
    /^\d{1,3}$/.test(groups[0]) &&
    groups.slice(1).every((group) => /^\d{3}$/.test(group))
  );
}

function isValidUngroupedInteger(value: string) {
  return value === "" || /^\d+$/.test(value);
}

function normalizeIntegerWithOptionalSpaces(value: string) {
  if (isValidUngroupedInteger(value)) {
    return value;
  }

  return isValidIntegerPart(value, " ") ? stripGrouping(value, " ") : undefined;
}

function stripGrouping(value: string, separator: string) {
  return value.split(separator).join("");
}

function detectDistanceUnit(unit?: string): DistanceUnit | undefined {
  if (!unit) {
    return undefined;
  }

  return UNIT_ALIASES[normalizeAlias(unit)];
}

function isNauticalUnit(unit: string) {
  return NAUTICAL_ALIASES.has(normalizeAlias(unit));
}

function normalizeAlias(value: string) {
  return value
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeDecimals(decimals: number) {
  if (!Number.isFinite(decimals)) {
    return DEFAULT_DECIMALS;
  }

  return Math.min(MAX_ADAPTIVE_DECIMALS, Math.max(0, Math.trunc(decimals)));
}

function getAdaptiveDecimals(value: number, decimals: number) {
  if (value === 0 || roundToDecimals(value, decimals) !== 0) {
    return decimals;
  }

  for (
    let candidate = decimals + 1;
    candidate <= MAX_ADAPTIVE_DECIMALS;
    candidate += 1
  ) {
    if (roundToDecimals(value, candidate) !== 0) {
      return Math.min(candidate + 1, MAX_ADAPTIVE_DECIMALS);
    }
  }

  return MAX_ADAPTIVE_DECIMALS;
}

function assertValidDistance(value: number) {
  assertFinite(value);

  if (value < 0) {
    throw new RangeError("La distancia no puede ser negativa.");
  }
}

function assertFinite(value: number) {
  if (!Number.isFinite(value)) {
    throw new RangeError("La distancia debe ser un número finito.");
  }
}

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
