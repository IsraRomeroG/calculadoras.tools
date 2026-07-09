import {
  LITERS_PER_IMPERIAL_GALLON as SHARED_LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_US_GALLON as SHARED_LITERS_PER_US_GALLON,
} from "../shared/volumeUnits";

export const VOLUME_UNITS = ["l", "us_gal", "imp_gal"] as const;

export type VolumeUnit = (typeof VOLUME_UNITS)[number];
export type VolumePrecision = "auto" | number;

export interface VolumeUnitMetadata {
  label: string;
  singularLabel: string;
  symbol: string;
  liters: number;
}

export const LITERS_PER_US_GALLON = SHARED_LITERS_PER_US_GALLON;
export const LITERS_PER_IMPERIAL_GALLON = SHARED_LITERS_PER_IMPERIAL_GALLON;
export const MAX_VOLUME_INPUT = 1_000_000_000_000_000;
export const IMPERIAL_GALLON_DIFFERENCE_PERCENT =
  (LITERS_PER_IMPERIAL_GALLON / LITERS_PER_US_GALLON - 1) * 100;

export const VOLUME_UNIT_METADATA = {
  l: {
    label: "Litros",
    singularLabel: "litro",
    symbol: "L",
    liters: 1,
  },
  us_gal: {
    label: "Galones estadounidenses",
    singularLabel: "galón estadounidense",
    symbol: "gal US",
    liters: LITERS_PER_US_GALLON,
  },
  imp_gal: {
    label: "Galones imperiales",
    singularLabel: "galón imperial",
    symbol: "gal imperial",
    liters: LITERS_PER_IMPERIAL_GALLON,
  },
} as const satisfies Record<VolumeUnit, VolumeUnitMetadata>;

export type ParseVolumeInputResult =
  | {
      ok: true;
      value: number;
      normalized: string;
      detectedUnit?: VolumeUnit;
      interpretation?: string;
    }
  | {
      ok: false;
      error:
        | "empty"
        | "incomplete"
        | "invalid"
        | "ambiguous"
        | "negative"
        | "out_of_range";
    };

export interface VolumeExplanation {
  formula: string;
  substitution: string;
  result: string;
  steps: string[];
}

const DEFAULT_AUTOMATIC_DECIMALS = 4;
const MAX_DECIMALS = 8;
const SCIENTIFIC_NOTATION_UPPER_THRESHOLD = 1_000_000_000_000;
const SCIENTIFIC_NOTATION_LOWER_THRESHOLD = 0.00000001;

const UNIT_ALIASES: Record<string, VolumeUnit> = {
  l: "l",
  lt: "l",
  litro: "l",
  litros: "l",
  liter: "l",
  liters: "l",
  "gal us": "us_gal",
  "us gal": "us_gal",
  "galon us": "us_gal",
  "galones us": "us_gal",
  "us gallon": "us_gal",
  "us gallons": "us_gal",
  "gallon us": "us_gal",
  "gallons us": "us_gal",
  "galon estadounidense": "us_gal",
  "galones estadounidenses": "us_gal",
  "galon americano": "us_gal",
  "galones americanos": "us_gal",
  "gal imperial": "imp_gal",
  "imp gal": "imp_gal",
  "galon imp": "imp_gal",
  "galones imp": "imp_gal",
  "imperial gal": "imp_gal",
  "imperial gallon": "imp_gal",
  "imperial gallons": "imp_gal",
  "gallon imperial": "imp_gal",
  "gallons imperial": "imp_gal",
  "galon imperial": "imp_gal",
  "galones imperiales": "imp_gal",
};

const AMBIGUOUS_GALLON_ALIASES = new Set([
  "gal",
  "galon",
  "galones",
  "gallon",
  "gallons",
]);

export function isVolumeUnit(value: string): value is VolumeUnit {
  return VOLUME_UNITS.includes(value as VolumeUnit);
}

export function parseVolumeInput(rawValue: string): ParseVolumeInputResult {
  const trimmed = rawValue.trim().replaceAll("−", "-");

  if (!trimmed) {
    return { ok: false, error: "empty" };
  }

  if (isIncompleteVolumeInput(trimmed)) {
    return { ok: false, error: "incomplete" };
  }

  const match = trimmed.match(
    /^([+-]?(?:(?:\d[\d., ]*|[.,]\d+)(?:e[+-]?\d+)?))(?:\s*(.*?))?$/iu,
  );

  if (!match) {
    return { ok: false, error: "invalid" };
  }

  const normalizedNumber = normalizeLocalizedNumber(match[1]);

  if (!normalizedNumber) {
    return { ok: false, error: "invalid" };
  }

  const value = Number(normalizedNumber.value);

  if (!Number.isFinite(value) || value > MAX_VOLUME_INPUT) {
    return { ok: false, error: "out_of_range" };
  }

  if (value < 0) {
    return { ok: false, error: "negative" };
  }

  const unitText = match[2]?.trim();
  const normalizedUnit = unitText ? normalizeAlias(unitText) : undefined;

  if (normalizedUnit && AMBIGUOUS_GALLON_ALIASES.has(normalizedUnit)) {
    return { ok: false, error: "ambiguous" };
  }

  const detectedUnit = normalizedUnit
    ? UNIT_ALIASES[normalizedUnit]
    : undefined;

  if (unitText && !detectedUnit) {
    return { ok: false, error: "invalid" };
  }

  return {
    ok: true,
    value,
    normalized: String(value),
    ...(detectedUnit ? { detectedUnit } : {}),
    ...(normalizedNumber.interpretation
      ? { interpretation: normalizedNumber.interpretation }
      : {}),
  };
}

export function convertVolume(
  value: number,
  from: VolumeUnit,
  to: VolumeUnit,
): number {
  assertValidVolume(value);

  return (value * VOLUME_UNIT_METADATA[from].liters) /
    VOLUME_UNIT_METADATA[to].liters;
}

export function convertAllVolumes(
  value: number,
  from: VolumeUnit,
): Record<VolumeUnit, number> {
  assertValidVolume(value);

  return Object.fromEntries(
    VOLUME_UNITS.map((unit) => [unit, convertVolume(value, from, unit)]),
  ) as Record<VolumeUnit, number>;
}

export function getVolumeFormula(
  from: VolumeUnit,
  to: VolumeUnit,
): string {
  const fromToken = getFormulaToken(from);
  const toToken = getFormulaToken(to);

  if (from === to) {
    return `${toToken} = ${fromToken}`;
  }

  if (from === "l") {
    return `${toToken} = L ÷ ${formatFactor(VOLUME_UNIT_METADATA[to].liters)}`;
  }

  if (to === "l") {
    return `L = ${fromToken} × ${formatFactor(VOLUME_UNIT_METADATA[from].liters)}`;
  }

  return `${toToken} = ${fromToken} × ${formatFactor(
    VOLUME_UNIT_METADATA[from].liters,
  )} ÷ ${formatFactor(VOLUME_UNIT_METADATA[to].liters)}`;
}

export function buildVolumeExplanation(
  value: number,
  from: VolumeUnit,
  to: VolumeUnit,
  precision: VolumePrecision = "auto",
): VolumeExplanation {
  const resultValue = convertVolume(value, from, to);
  const result = formatVolume(resultValue, to, precision);
  const formula = getVolumeFormula(from, to);
  const source = formatVolumeNumber(value, precision);
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

export function formatVolume(
  value: number,
  unit: VolumeUnit,
  precision: VolumePrecision = "auto",
): string {
  return `${formatVolumeNumber(value, precision)} ${VOLUME_UNIT_METADATA[unit].symbol}`;
}

export function formatVolumeNumber(
  value: number,
  precision: VolumePrecision = "auto",
): string {
  assertFinite(value);

  const normalizedValue = Object.is(value, -0) ? 0 : value;
  const absoluteValue = Math.abs(normalizedValue);
  const automatic = precision === "auto";
  const safeDecimals = automatic
    ? getAutomaticDecimals(normalizedValue)
    : normalizeDecimals(precision);

  if (
    absoluteValue >= SCIENTIFIC_NOTATION_UPPER_THRESHOLD ||
    (absoluteValue > 0 && absoluteValue < SCIENTIFIC_NOTATION_LOWER_THRESHOLD)
  ) {
    return normalizedValue.toExponential(safeDecimals);
  }

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: safeDecimals,
    ...(automatic ? {} : { minimumFractionDigits: safeDecimals }),
  }).format(roundToDecimals(normalizedValue, safeDecimals));
}

export function formatVolumeRate(
  from: VolumeUnit,
  to: VolumeUnit,
  decimals = 9,
): string {
  return `1 ${VOLUME_UNIT_METADATA[from].symbol} = ${formatReferenceNumber(
    convertVolume(1, from, to),
    decimals,
  )} ${VOLUME_UNIT_METADATA[to].symbol}`;
}

function buildSubstitution(
  source: string,
  result: string,
  from: VolumeUnit,
  to: VolumeUnit,
) {
  if (from === to) {
    return `${source} ${VOLUME_UNIT_METADATA[from].symbol} = ${result}`;
  }

  if (from === "l") {
    return `${source} ÷ ${formatFactor(VOLUME_UNIT_METADATA[to].liters)} = ${result}`;
  }

  if (to === "l") {
    return `${source} × ${formatFactor(VOLUME_UNIT_METADATA[from].liters)} = ${result}`;
  }

  return `${source} × ${formatFactor(
    VOLUME_UNIT_METADATA[from].liters,
  )} ÷ ${formatFactor(VOLUME_UNIT_METADATA[to].liters)} = ${result}`;
}

function isIncompleteVolumeInput(value: string) {
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
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getFormulaToken(unit: VolumeUnit) {
  switch (unit) {
    case "l":
      return "L";
    case "us_gal":
      return "gal_US";
    case "imp_gal":
      return "gal_imperial";
  }
}

function getAutomaticDecimals(value: number) {
  if (value === 0 || roundToDecimals(value, DEFAULT_AUTOMATIC_DECIMALS) !== 0) {
    return DEFAULT_AUTOMATIC_DECIMALS;
  }

  for (
    let decimals = DEFAULT_AUTOMATIC_DECIMALS + 1;
    decimals <= MAX_DECIMALS;
    decimals += 1
  ) {
    if (roundToDecimals(value, decimals) !== 0) {
      return decimals;
    }
  }

  return MAX_DECIMALS;
}

function normalizeDecimals(decimals: number) {
  if (!Number.isFinite(decimals)) {
    return DEFAULT_AUTOMATIC_DECIMALS;
  }

  return Math.min(MAX_DECIMALS, Math.max(0, Math.trunc(decimals)));
}

function formatReferenceNumber(value: number, decimals: number) {
  assertFinite(value);

  const safeDecimals = Math.min(12, Math.max(0, Math.trunc(decimals)));

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: safeDecimals,
  }).format(value);
}

function assertValidVolume(value: number) {
  assertFinite(value);

  if (value < 0) {
    throw new RangeError("El volumen no puede ser negativo.");
  }

  if (value > MAX_VOLUME_INPUT) {
    throw new RangeError(
      `El volumen no puede superar ${MAX_VOLUME_INPUT.toExponential()} unidades.`,
    );
  }
}

function assertFinite(value: number) {
  if (!Number.isFinite(value)) {
    throw new RangeError("El volumen debe ser un número finito.");
  }
}

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function formatFactor(value: number) {
  return String(value);
}
