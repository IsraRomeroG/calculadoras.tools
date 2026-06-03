export const WEIGHT_UNITS = ["kg", "lb", "g", "oz", "st"] as const;

export type WeightUnit = (typeof WEIGHT_UNITS)[number];

export interface WeightUnitMetadata {
  label: string;
  symbol: string;
  secondary: boolean;
  kilograms: number;
}

export const WEIGHT_UNIT_METADATA = {
  kg: { label: "Kilogramos", symbol: "kg", secondary: false, kilograms: 1 },
  lb: {
    label: "Libras",
    symbol: "lb",
    secondary: false,
    kilograms: 0.45359237,
  },
  g: { label: "Gramos", symbol: "g", secondary: true, kilograms: 0.001 },
  oz: {
    label: "Onzas",
    symbol: "oz",
    secondary: true,
    kilograms: 0.028349523125,
  },
  st: {
    label: "Stone",
    symbol: "st",
    secondary: true,
    kilograms: 6.35029318,
  },
} as const satisfies Record<WeightUnit, WeightUnitMetadata>;

export type ParseWeightInputResult =
  | {
      ok: true;
      value: number;
      normalized: string;
      detectedUnit?: WeightUnit;
    }
  | {
      ok: false;
      error: "empty" | "incomplete" | "invalid";
    };

export interface WeightExplanation {
  formula: string;
  substitution: string;
  result: string;
  steps: string[];
}

const DEFAULT_DECIMALS = 2;
const MAX_ADAPTIVE_DECIMALS = 8;
const SCIENTIFIC_NOTATION_UPPER_THRESHOLD = 1_000_000_000_000;
const SCIENTIFIC_NOTATION_LOWER_THRESHOLD = 0.00000001;

const UNIT_ALIASES: Record<string, WeightUnit> = {
  kg: "kg",
  kilo: "kg",
  kilos: "kg",
  kilogramo: "kg",
  kilogramos: "kg",
  lb: "lb",
  lbs: "lb",
  libra: "lb",
  libras: "lb",
  g: "g",
  gramo: "g",
  gramos: "g",
  oz: "oz",
  onza: "oz",
  onzas: "oz",
  st: "st",
  stone: "st",
  stones: "st",
};

const DIRECT_FORMULAS: Partial<
  Record<WeightUnit, Partial<Record<WeightUnit, string>>>
> = {
  kg: {
    lb: "lb = kg ÷ 0.45359237",
    g: "g = kg × 1000",
    oz: "oz = kg ÷ 0.028349523125",
    st: "st = kg ÷ 6.35029318",
  },
  lb: {
    kg: "kg = lb × 0.45359237",
  },
  g: {
    kg: "kg = g ÷ 1000",
  },
  oz: {
    kg: "kg = oz × 0.028349523125",
  },
  st: {
    kg: "kg = st × 6.35029318",
  },
};

export function isWeightUnit(value: string): value is WeightUnit {
  return WEIGHT_UNITS.includes(value as WeightUnit);
}

export function parseWeightInput(rawValue: string): ParseWeightInputResult {
  const trimmed = rawValue.trim().replaceAll("−", "-");

  if (!trimmed) {
    return { ok: false, error: "empty" };
  }

  if (isIncompleteWeightInput(trimmed)) {
    return { ok: false, error: "incomplete" };
  }

  const match = trimmed.match(
    /^([+-]?(?:(?:\d[\d., ]*|[.,]\d+)(?:e[+-]?\d+)?))\s*([\p{L}]+)?$/iu,
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

  const detectedUnit = detectWeightUnit(match[2]);

  if (match[2] && !detectedUnit) {
    return { ok: false, error: "invalid" };
  }

  return {
    ok: true,
    value,
    normalized: String(value),
    ...(detectedUnit ? { detectedUnit } : {}),
  };
}

export function convertWeight(
  value: number,
  from: WeightUnit,
  to: WeightUnit,
): number {
  assertValidWeight(value);

  return (value * WEIGHT_UNIT_METADATA[from].kilograms) /
    WEIGHT_UNIT_METADATA[to].kilograms;
}

export function convertAllWeights(
  value: number,
  from: WeightUnit,
): Record<WeightUnit, number> {
  assertValidWeight(value);

  return Object.fromEntries(
    WEIGHT_UNITS.map((unit) => [unit, convertWeight(value, from, unit)]),
  ) as Record<WeightUnit, number>;
}

export function getWeightFormula(from: WeightUnit, to: WeightUnit): string {
  if (from === to) {
    return `${from} = ${from}`;
  }

  const directFormula = DIRECT_FORMULAS[from]?.[to];

  if (directFormula) {
    return directFormula;
  }

  return `${to} = ${from} × ${formatFactor(
    WEIGHT_UNIT_METADATA[from].kilograms /
      WEIGHT_UNIT_METADATA[to].kilograms,
  )}`;
}

export function buildWeightExplanation(
  value: number,
  from: WeightUnit,
  to: WeightUnit,
): WeightExplanation {
  const resultValue = convertWeight(value, from, to);
  const formula = getWeightFormula(from, to);
  const formattedSource = formatWeightNumber(value);
  const result = formatWeight(resultValue, to);

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
      `Resultado: ${result} aproximadamente.`,
    ],
  };
}

export function formatWeight(
  value: number,
  unit: WeightUnit,
  decimals = DEFAULT_DECIMALS,
): string {
  return `${formatWeightNumber(value, decimals)} ${WEIGHT_UNIT_METADATA[unit].symbol}`;
}

export function formatWeightNumber(
  value: number,
  decimals = DEFAULT_DECIMALS,
): string {
  assertFinite(value);

  const normalizedValue = Object.is(value, -0) ? 0 : value;
  const absoluteValue = Math.abs(normalizedValue);

  if (
    absoluteValue >= SCIENTIFIC_NOTATION_UPPER_THRESHOLD ||
    (absoluteValue > 0 && absoluteValue < SCIENTIFIC_NOTATION_LOWER_THRESHOLD)
  ) {
    return normalizedValue.toExponential(Math.max(0, Math.trunc(decimals)));
  }

  const safeDecimals = getAdaptiveDecimals(normalizedValue, decimals);

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: safeDecimals,
  }).format(roundToDecimals(normalizedValue, safeDecimals));
}

export function formatWeightRate(
  from: WeightUnit,
  to: WeightUnit,
  decimals = 8,
): string {
  return `1 ${from} = ${formatWeightNumber(convertWeight(1, from, to), decimals)} ${to}`;
}

export function formatPoundsAndOunces(pounds: number): string {
  assertValidWeight(pounds);

  const wholePounds = Math.floor(pounds);
  const ounces = (pounds - wholePounds) * 16;

  return `${formatWeightNumber(wholePounds)} lb ${formatWeightNumber(ounces)} oz`;
}

export function formatStoneAndPounds(stone: number): string {
  assertValidWeight(stone);

  const wholeStone = Math.floor(stone);
  const pounds = (stone - wholeStone) * 14;

  return `${formatWeightNumber(wholeStone)} st ${formatWeightNumber(pounds)} lb`;
}

function isIncompleteWeightInput(value: string) {
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

function detectWeightUnit(unit?: string): WeightUnit | undefined {
  if (!unit) {
    return undefined;
  }

  return UNIT_ALIASES[normalizeAlias(unit)];
}

function normalizeAlias(value: string) {
  return value
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function getAdaptiveDecimals(value: number, decimals: number) {
  const initialDecimals = Math.min(
    MAX_ADAPTIVE_DECIMALS,
    Math.max(0, Math.trunc(decimals)),
  );

  if (value === 0 || roundToDecimals(value, initialDecimals) !== 0) {
    return initialDecimals;
  }

  for (
    let candidate = initialDecimals + 1;
    candidate <= MAX_ADAPTIVE_DECIMALS;
    candidate += 1
  ) {
    if (roundToDecimals(value, candidate) !== 0) {
      return Math.min(candidate + 1, MAX_ADAPTIVE_DECIMALS);
    }
  }

  return MAX_ADAPTIVE_DECIMALS;
}

function formatFactor(value: number) {
  return Number(value.toPrecision(12)).toString();
}

function assertValidWeight(value: number) {
  assertFinite(value);

  if (value < 0) {
    throw new RangeError("El peso no puede ser negativo.");
  }
}

function assertFinite(value: number) {
  if (!Number.isFinite(value)) {
    throw new RangeError("El peso debe ser un número finito.");
  }
}

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
