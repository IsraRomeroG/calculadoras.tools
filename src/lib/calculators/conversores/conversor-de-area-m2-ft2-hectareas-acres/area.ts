export const AREA_UNITS = ["m2", "ft2", "ha", "acre"] as const;
export const LINEAR_UNITS = ["m", "ft"] as const;

export type AreaUnit = (typeof AREA_UNITS)[number];
export type LinearUnit = (typeof LINEAR_UNITS)[number];

export interface AreaUnitMetadata {
  label: string;
  singularLabel: string;
  symbol: string;
  squareMeters: number;
}

export interface LinearUnitMetadata {
  label: string;
  singularLabel: string;
  symbol: string;
  meters: number;
}

export const SQUARE_METERS_PER_SQUARE_FOOT = 0.09290304;
export const SQUARE_METERS_PER_HECTARE = 10_000;
export const SQUARE_METERS_PER_ACRE = 4_046.8564224;
export const METERS_PER_FOOT = 0.3048;
export const MAX_AREA_INPUT = 1_000_000_000_000_000;
export const MAX_LINEAR_INPUT = 1_000_000_000;

export const AREA_UNIT_METADATA = {
  m2: {
    label: "Metros cuadrados",
    singularLabel: "metro cuadrado",
    symbol: "m²",
    squareMeters: 1,
  },
  ft2: {
    label: "Pies cuadrados",
    singularLabel: "pie cuadrado",
    symbol: "ft²",
    squareMeters: SQUARE_METERS_PER_SQUARE_FOOT,
  },
  ha: {
    label: "Hectáreas",
    singularLabel: "hectárea",
    symbol: "ha",
    squareMeters: SQUARE_METERS_PER_HECTARE,
  },
  acre: {
    label: "Acres",
    singularLabel: "acre",
    symbol: "acre",
    squareMeters: SQUARE_METERS_PER_ACRE,
  },
} as const satisfies Record<AreaUnit, AreaUnitMetadata>;

export const LINEAR_UNIT_METADATA = {
  m: {
    label: "Metros",
    singularLabel: "metro",
    symbol: "m",
    meters: 1,
  },
  ft: {
    label: "Pies",
    singularLabel: "pie",
    symbol: "ft",
    meters: METERS_PER_FOOT,
  },
} as const satisfies Record<LinearUnit, LinearUnitMetadata>;

export type ParseNumericInputResult =
  | {
      ok: true;
      value: number;
      normalized: string;
      interpretation?: string;
    }
  | {
      ok: false;
      error:
        | "empty"
        | "incomplete"
        | "invalid"
        | "negative"
        | "out_of_range";
    };

export type ParseAreaInputResult =
  | {
      ok: true;
      value: number;
      normalized: string;
      detectedUnit?: AreaUnit;
      interpretation?: string;
    }
  | {
      ok: false;
      error:
        | "empty"
        | "incomplete"
        | "invalid"
        | "negative"
        | "out_of_range";
    };

export interface AreaExplanation {
  formula: string;
  substitution: string;
  result: string;
  steps: string[];
}

const DEFAULT_DECIMALS = 4;
const MAX_DECIMALS = 8;
const SCIENTIFIC_NOTATION_UPPER_THRESHOLD = 1_000_000_000_000;
const SCIENTIFIC_NOTATION_LOWER_THRESHOLD = 0.00000001;

const AREA_UNIT_ALIASES: Record<string, AreaUnit> = {
  m2: "m2",
  "m 2": "m2",
  sqm: "m2",
  "sq m": "m2",
  "metro cuadrado": "m2",
  "metros cuadrados": "m2",
  ft2: "ft2",
  "ft 2": "ft2",
  sqft: "ft2",
  "sq ft": "ft2",
  "square foot": "ft2",
  "square feet": "ft2",
  "pie cuadrado": "ft2",
  "pies cuadrados": "ft2",
  ha: "ha",
  hectarea: "ha",
  hectareas: "ha",
  acre: "acre",
  acres: "acre",
};

export function isAreaUnit(value: string): value is AreaUnit {
  return AREA_UNITS.includes(value as AreaUnit);
}

export function isLinearUnit(value: string): value is LinearUnit {
  return LINEAR_UNITS.includes(value as LinearUnit);
}

export function parseNumericInput(
  rawValue: string,
  maxValue = MAX_AREA_INPUT,
): ParseNumericInputResult {
  const trimmed = rawValue.trim().replaceAll("−", "-");

  if (!trimmed) {
    return { ok: false, error: "empty" };
  }

  if (isIncompleteNumericInput(trimmed)) {
    return { ok: false, error: "incomplete" };
  }

  const match = trimmed.match(
    /^([+-]?(?:(?:\d[\d., ]*|[.,]\d+)(?:e[+-]?\d+)?))$/iu,
  );

  if (!match) {
    return { ok: false, error: "invalid" };
  }

  return normalizeParsedNumber(match[1], maxValue);
}

export function parseAreaInput(rawValue: string): ParseAreaInputResult {
  const trimmed = rawValue.trim().replaceAll("−", "-");

  if (!trimmed) {
    return { ok: false, error: "empty" };
  }

  if (isIncompleteNumericInput(trimmed)) {
    return { ok: false, error: "incomplete" };
  }

  const match = trimmed.match(
    /^([+-]?(?:(?:\d[\d., ]*|[.,]\d+)(?:e[+-]?\d+)?))(?:\s*(.*?))?$/iu,
  );

  if (!match) {
    return { ok: false, error: "invalid" };
  }

  const parsedNumber = normalizeParsedNumber(match[1], MAX_AREA_INPUT);

  if (!parsedNumber.ok) {
    return parsedNumber;
  }

  const unitText = match[2]?.trim();
  const detectedUnit = unitText
    ? AREA_UNIT_ALIASES[normalizeAlias(unitText)]
    : undefined;

  if (unitText && !detectedUnit) {
    return { ok: false, error: "invalid" };
  }

  return {
    ok: true,
    value: parsedNumber.value,
    normalized: parsedNumber.normalized,
    ...(detectedUnit ? { detectedUnit } : {}),
    ...(parsedNumber.interpretation
      ? { interpretation: parsedNumber.interpretation }
      : {}),
  };
}

export function convertArea(
  value: number,
  from: AreaUnit,
  to: AreaUnit,
): number {
  assertValidArea(value);

  return (value * AREA_UNIT_METADATA[from].squareMeters) /
    AREA_UNIT_METADATA[to].squareMeters;
}

export function convertAllAreas(
  value: number,
  from: AreaUnit,
): Record<AreaUnit, number> {
  assertValidArea(value);

  return Object.fromEntries(
    AREA_UNITS.map((unit) => [unit, convertArea(value, from, unit)]),
  ) as Record<AreaUnit, number>;
}

export function convertLengthToMeters(
  value: number,
  unit: LinearUnit,
): number {
  assertValidLength(value);

  return value * LINEAR_UNIT_METADATA[unit].meters;
}

export function calculateRectangleArea(
  length: number,
  width: number,
  unit: LinearUnit,
): number {
  const lengthMeters = convertLengthToMeters(length, unit);
  const widthMeters = convertLengthToMeters(width, unit);
  const squareMeters = lengthMeters * widthMeters;

  assertValidArea(squareMeters);

  return squareMeters;
}

export function getAreaFormula(from: AreaUnit, to: AreaUnit): string {
  const fromToken = getFormulaToken(from);
  const toToken = getFormulaToken(to);

  if (from === to) {
    return `${toToken} = ${fromToken}`;
  }

  if (from === "m2") {
    return `${toToken} = m² ÷ ${formatFactor(
      AREA_UNIT_METADATA[to].squareMeters,
    )}`;
  }

  if (to === "m2") {
    return `m² = ${fromToken} × ${formatFactor(
      AREA_UNIT_METADATA[from].squareMeters,
    )}`;
  }

  return `${toToken} = ${fromToken} × ${formatFactor(
    AREA_UNIT_METADATA[from].squareMeters,
  )} ÷ ${formatFactor(AREA_UNIT_METADATA[to].squareMeters)}`;
}

export function buildAreaExplanation(
  value: number,
  from: AreaUnit,
  to: AreaUnit,
  decimals = DEFAULT_DECIMALS,
): AreaExplanation {
  const resultValue = convertArea(value, from, to);
  const result = formatArea(resultValue, to, decimals);
  const formula = getAreaFormula(from, to);
  const source = formatAreaNumber(value, decimals);
  const substitution = buildSubstitution(source, result, from, to);

  if (from === to) {
    return {
      formula,
      substitution,
      result,
      steps: [
        "La unidad de origen y destino es la misma.",
        `Resultado: ${result}.`,
      ],
    };
  }

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

export function formatArea(
  value: number,
  unit: AreaUnit,
  decimals = DEFAULT_DECIMALS,
): string {
  return `${formatAreaNumber(value, decimals)} ${AREA_UNIT_METADATA[unit].symbol}`;
}

export function formatAreaNumber(
  value: number,
  decimals = DEFAULT_DECIMALS,
): string {
  assertFinite(value);

  const normalizedValue = Object.is(value, -0) ? 0 : value;
  const safeDecimals = normalizeDecimals(decimals);
  const absoluteValue = Math.abs(normalizedValue);

  if (
    absoluteValue >= SCIENTIFIC_NOTATION_UPPER_THRESHOLD ||
    (absoluteValue > 0 && absoluteValue < SCIENTIFIC_NOTATION_LOWER_THRESHOLD)
  ) {
    return normalizedValue.toExponential(safeDecimals);
  }

  const displayDecimals = getDisplayDecimals(normalizedValue, safeDecimals);

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: displayDecimals,
  }).format(roundToDecimals(normalizedValue, displayDecimals));
}

export function formatAreaRate(
  from: AreaUnit,
  to: AreaUnit,
  decimals = DEFAULT_DECIMALS,
): string {
  return `1 ${AREA_UNIT_METADATA[from].symbol} = ${formatAreaNumber(
    convertArea(1, from, to),
    decimals,
  )} ${AREA_UNIT_METADATA[to].symbol}`;
}

export function formatAreaUnitName(unit: AreaUnit): string {
  const metadata = AREA_UNIT_METADATA[unit];

  return `${metadata.symbol} · ${metadata.label.toLocaleLowerCase("es-MX")}`;
}

function normalizeParsedNumber(
  rawNumber: string,
  maxValue: number,
): ParseNumericInputResult {
  const normalizedNumber = normalizeLocalizedNumber(rawNumber);

  if (!normalizedNumber) {
    return { ok: false, error: "invalid" };
  }

  const value = Number(normalizedNumber.value);

  if (!Number.isFinite(value) || value > maxValue) {
    return { ok: false, error: "out_of_range" };
  }

  if (value < 0) {
    return { ok: false, error: "negative" };
  }

  return {
    ok: true,
    value,
    normalized: String(value),
    ...(normalizedNumber.interpretation
      ? { interpretation: normalizedNumber.interpretation }
      : {}),
  };
}

function buildSubstitution(
  source: string,
  result: string,
  from: AreaUnit,
  to: AreaUnit,
) {
  if (from === to) {
    return `${source} ${AREA_UNIT_METADATA[from].symbol} = ${result}`;
  }

  if (from === "m2") {
    return `${source} ÷ ${formatFactor(AREA_UNIT_METADATA[to].squareMeters)} = ${result}`;
  }

  if (to === "m2") {
    return `${source} × ${formatFactor(AREA_UNIT_METADATA[from].squareMeters)} = ${result}`;
  }

  return `${source} × ${formatFactor(
    AREA_UNIT_METADATA[from].squareMeters,
  )} ÷ ${formatFactor(AREA_UNIT_METADATA[to].squareMeters)} = ${result}`;
}

function isIncompleteNumericInput(value: string) {
  return (
    /^[+-]?(?:[.,])?$/.test(value) ||
    /^[+-]?(?:\d[\d., ]*|[.,]\d+)[eE][+-]?$/.test(value) ||
    /^[+-]?(?:\d[\d ]*|[.,]\d+)[.,]$/.test(value)
  );
}

function normalizeLocalizedNumber(
  rawValue: string,
): { value: string; interpretation?: string } | undefined {
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

  if (!normalizedMantissa) {
    return undefined;
  }

  return {
    value: `${normalizedMantissa.value}${exponent}`,
    ...(normalizedMantissa.interpretation
      ? { interpretation: normalizedMantissa.interpretation }
      : {}),
  };
}

function normalizeMantissa(
  rawMantissa: string,
): { value: string; interpretation?: string } | undefined {
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

    return {
      value: `${sign}${stripGrouping(integerPart, groupingSeparator)}.${decimalPart}`,
    };
  }

  if (hasComma || hasPoint) {
    const separator = hasComma ? "," : ".";
    const parts = mantissa.split(separator);

    if (parts.length > 2) {
      if (!isValidIntegerPart(mantissa, separator)) {
        return undefined;
      }

      const groupedValue = `${sign}${stripGrouping(mantissa, separator)}`;

      return {
        value: groupedValue,
        interpretation: `Interpretado como ${groupedValue}`,
      };
    }

    const [integerPart, decimalPart] = parts;

    if (!decimalPart) {
      return undefined;
    }

    if (
      separator === "," &&
      integerPart &&
      integerPart !== "0" &&
      decimalPart.length === 3 &&
      isValidIntegerPart(mantissa, separator)
    ) {
      const groupedValue = `${sign}${stripGrouping(mantissa, separator)}`;

      return {
        value: groupedValue,
        interpretation: `Interpretado como ${groupedValue}`,
      };
    }

    const normalizedInteger = normalizeIntegerWithOptionalSpaces(integerPart);

    if (normalizedInteger === undefined) {
      return undefined;
    }

    return {
      value: `${sign}${normalizedInteger || "0"}.${decimalPart}`,
    };
  }

  if (!isValidIntegerPart(mantissa, " ")) {
    return undefined;
  }

  return { value: `${sign}${stripGrouping(mantissa, " ")}` };
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

function normalizeIntegerWithOptionalSpaces(value: string) {
  if (value === "" || /^\d+$/.test(value)) {
    return value;
  }

  return isValidIntegerPart(value, " ")
    ? stripGrouping(value, " ")
    : undefined;
}

function stripGrouping(value: string, separator: string) {
  return value.split(separator).join("");
}

function normalizeAlias(value: string) {
  return value
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/²/g, "2")
    .replace(/\^2/g, "2")
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getFormulaToken(unit: AreaUnit) {
  switch (unit) {
    case "m2":
      return "m²";
    case "ft2":
      return "ft²";
    case "ha":
      return "ha";
    case "acre":
      return "acre";
  }
}

function normalizeDecimals(decimals: number) {
  if (!Number.isFinite(decimals)) {
    return DEFAULT_DECIMALS;
  }

  return Math.min(MAX_DECIMALS, Math.max(0, Math.trunc(decimals)));
}

function getDisplayDecimals(value: number, decimals: number) {
  if (value === 0 || roundToDecimals(value, decimals) !== 0) {
    return decimals;
  }

  for (
    let candidate = decimals + 1;
    candidate <= MAX_DECIMALS;
    candidate += 1
  ) {
    if (roundToDecimals(value, candidate) !== 0) {
      return candidate;
    }
  }

  return MAX_DECIMALS;
}

function assertValidArea(value: number) {
  assertFinite(value);

  if (value < 0) {
    throw new RangeError("El área no puede ser negativa.");
  }

  if (value > MAX_AREA_INPUT) {
    throw new RangeError(
      `El área no puede superar ${MAX_AREA_INPUT.toExponential()} m².`,
    );
  }
}

function assertValidLength(value: number) {
  assertFinite(value);

  if (value < 0) {
    throw new RangeError("La longitud no puede ser negativa.");
  }

  if (value > MAX_LINEAR_INPUT) {
    throw new RangeError(
      `La longitud no puede superar ${MAX_LINEAR_INPUT.toExponential()} unidades.`,
    );
  }
}

function assertFinite(value: number) {
  if (!Number.isFinite(value)) {
    throw new RangeError("El valor debe ser un número finito.");
  }
}

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function formatFactor(value: number) {
  return String(value);
}
