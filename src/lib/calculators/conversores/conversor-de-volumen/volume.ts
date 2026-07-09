import {
  VOLUME_UNIT_GROUPS,
  VOLUME_UNIT_METADATA,
  VOLUME_UNITS,
  type VolumeSystem,
  type VolumeUnit,
} from "../shared/volumeUnits";

export {
  LITERS_PER_CUBIC_CENTIMETER,
  LITERS_PER_CUBIC_METER,
  LITERS_PER_IMPERIAL_FLUID_OUNCE,
  LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_IMPERIAL_PINT,
  LITERS_PER_IMPERIAL_QUART,
  LITERS_PER_MILLILITER,
  LITERS_PER_US_FLUID_OUNCE,
  LITERS_PER_US_GALLON,
  LITERS_PER_US_PINT,
  LITERS_PER_US_QUART,
  VOLUME_UNIT_GROUPS,
  VOLUME_UNIT_METADATA,
  VOLUME_UNITS,
  type VolumeSystem,
  type VolumeUnit,
} from "../shared/volumeUnits";

export type VolumePrecision = "auto" | number;

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
        | "mass_unit"
        | "negative"
        | "out_of_range";
    };

export interface VolumeExplanation {
  formula: string;
  substitution: string;
  result: string;
  steps: string[];
}

export const MAX_VOLUME_INPUT = 1_000_000_000_000_000;
const DEFAULT_AUTOMATIC_DECIMALS = 4;
const MAX_DECIMALS = 8;
const REFERENCE_DECIMALS = 13;
const SCIENTIFIC_NOTATION_UPPER_THRESHOLD = 1_000_000_000_000;
const SCIENTIFIC_NOTATION_LOWER_THRESHOLD = 0.00000001;
const NUMBER_PATTERN = String.raw`[+-]?(?:(?:\d[\d., ]*|[.,]\d+)(?:e[+-]?\d+)?)`;

export const MAX_GENERAL_VOLUME_INPUT = MAX_VOLUME_INPUT;

const UNIT_ALIASES: Record<string, VolumeUnit> = {
  ml: "ml",
  mililitro: "ml",
  mililitros: "ml",
  l: "l",
  lt: "l",
  litro: "l",
  litros: "l",
  cm3: "cm3",
  cc: "cm3",
  "centimetro cubico": "cm3",
  "centimetros cubicos": "cm3",
  m3: "m3",
  "metro cubico": "m3",
  "metros cubicos": "m3",
  "fl oz us": "us_fl_oz",
  "us fl oz": "us_fl_oz",
  "onza liquida us": "us_fl_oz",
  "onzas liquidas us": "us_fl_oz",
  "onza liquida estadounidense": "us_fl_oz",
  "onzas liquidas estadounidenses": "us_fl_oz",
  "pt us": "us_pt",
  "pinta us": "us_pt",
  "pintas us": "us_pt",
  "pinta estadounidense": "us_pt",
  "pintas estadounidenses": "us_pt",
  "qt us": "us_qt",
  "cuarto us": "us_qt",
  "cuartos us": "us_qt",
  "cuarto estadounidense": "us_qt",
  "cuartos estadounidenses": "us_qt",
  "gal us": "us_gal",
  "us gal": "us_gal",
  "galon us": "us_gal",
  "galones us": "us_gal",
  "galon estadounidense": "us_gal",
  "galones estadounidenses": "us_gal",
  "fl oz imperial": "imp_fl_oz",
  "imperial fl oz": "imp_fl_oz",
  "onza liquida imperial": "imp_fl_oz",
  "onzas liquidas imperiales": "imp_fl_oz",
  "pt imperial": "imp_pt",
  "pinta imperial": "imp_pt",
  "pintas imperiales": "imp_pt",
  "qt imperial": "imp_qt",
  "cuarto imperial": "imp_qt",
  "cuartos imperiales": "imp_qt",
  "gal imperial": "imp_gal",
  "imperial gal": "imp_gal",
  "galon imperial": "imp_gal",
  "galones imperiales": "imp_gal",
};

const AMBIGUOUS_UNIT_ALIASES = new Set([
  "fl oz",
  "onza liquida",
  "onzas liquidas",
  "pt",
  "pinta",
  "pintas",
  "qt",
  "cuarto",
  "cuartos",
  "gal",
  "galon",
  "galones",
  "gallon",
  "gallons",
]);

const MASS_UNIT_ALIASES = new Set(["oz", "onza", "onzas", "ounce", "ounces"]);

export function isVolumeUnit(value: string): value is VolumeUnit {
  return VOLUME_UNITS.includes(value as VolumeUnit);
}

export function getVolumeUnitSystem(unit: VolumeUnit): VolumeSystem {
  return VOLUME_UNIT_METADATA[unit].system;
}

export function parseVolumeInput(rawValue: string): ParseVolumeInputResult {
  const trimmed = rawValue.trim().replaceAll("−", "-");

  if (!trimmed) {
    return { ok: false, error: "empty" };
  }

  if (isIncompleteNumericInput(trimmed)) {
    return { ok: false, error: "incomplete" };
  }

  const parts = splitVolumeInput(trimmed);

  if (!parts) {
    return { ok: false, error: "invalid" };
  }

  if (isIncompleteNumericInput(parts.rawNumber)) {
    return { ok: false, error: "incomplete" };
  }

  const parsedNumber = normalizeParsedNumber(parts.rawNumber, MAX_VOLUME_INPUT);

  if (!parsedNumber.ok) {
    return parsedNumber;
  }

  const unitText = parts.unitText?.trim();
  const normalizedUnit = unitText ? normalizeAlias(unitText) : undefined;

  if (normalizedUnit && MASS_UNIT_ALIASES.has(normalizedUnit)) {
    return { ok: false, error: "mass_unit" };
  }

  if (normalizedUnit && AMBIGUOUS_UNIT_ALIASES.has(normalizedUnit)) {
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
    value: parsedNumber.value,
    normalized: parsedNumber.normalized,
    ...(detectedUnit ? { detectedUnit } : {}),
    ...(parsedNumber.interpretation
      ? { interpretation: parsedNumber.interpretation }
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

export function getVolumeFormula(from: VolumeUnit, to: VolumeUnit): string {
  const fromToken = getFormulaToken(from);
  const toToken = getFormulaToken(to);

  if (from === to) {
    return `${toToken} = ${fromToken}`;
  }

  if (usesDirectFactor(from, to)) {
    return `${toToken} = ${fromToken} × ${formatFactor(
      getDirectFactor(from, to),
    )}`;
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
      `Usamos la formula: ${formula}.`,
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
  decimals = REFERENCE_DECIMALS,
): string {
  return `1 ${VOLUME_UNIT_METADATA[from].symbol} = ${formatReferenceNumber(
    convertVolume(1, from, to),
    decimals,
  )} ${VOLUME_UNIT_METADATA[to].symbol}`;
}

export function formatVolumeUnitName(unit: VolumeUnit): string {
  const metadata = VOLUME_UNIT_METADATA[unit];

  return `${metadata.symbol} · ${metadata.label.toLocaleLowerCase("es-MX")}`;
}

function splitVolumeInput(
  value: string,
): { rawNumber: string; unitText?: string } | undefined {
  const numberFirst = value.match(
    new RegExp(`^(${NUMBER_PATTERN})(?:\\s*(.*?))?$`, "iu"),
  );

  if (numberFirst) {
    return {
      rawNumber: numberFirst[1],
      ...(numberFirst[2]?.trim() ? { unitText: numberFirst[2].trim() } : {}),
    };
  }

  const unitFirst = value.match(
    new RegExp(`^(.*?)(?:\\s+)(${NUMBER_PATTERN})$`, "iu"),
  );

  if (!unitFirst) {
    return undefined;
  }

  return {
    rawNumber: unitFirst[2],
    ...(unitFirst[1]?.trim() ? { unitText: unitFirst[1].trim() } : {}),
  };
}

function normalizeParsedNumber(
  rawNumber: string,
  maxValue: number,
): ParseVolumeInputResult {
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
  from: VolumeUnit,
  to: VolumeUnit,
) {
  if (from === to) {
    return `${source} ${VOLUME_UNIT_METADATA[from].symbol} = ${result}`;
  }

  if (usesDirectFactor(from, to)) {
    return `${source} × ${formatFactor(getDirectFactor(from, to))} = ${result}`;
  }

  return `${source} × ${formatFactor(
    VOLUME_UNIT_METADATA[from].liters,
  )} ÷ ${formatFactor(VOLUME_UNIT_METADATA[to].liters)} = ${result}`;
}

function usesDirectFactor(from: VolumeUnit, to: VolumeUnit) {
  return (
    from === "l" ||
    to === "l" ||
    VOLUME_UNIT_METADATA[from].system === VOLUME_UNIT_METADATA[to].system
  );
}

function getDirectFactor(from: VolumeUnit, to: VolumeUnit) {
  return VOLUME_UNIT_METADATA[from].liters / VOLUME_UNIT_METADATA[to].liters;
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
    .replace(/³/g, "3")
    .replace(/\^3/g, "3")
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getFormulaToken(unit: VolumeUnit) {
  return VOLUME_UNIT_METADATA[unit].symbol;
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

  const safeDecimals = Math.min(13, Math.max(0, Math.trunc(decimals)));
  const normalizedValue = Object.is(value, -0) ? 0 : value;

  if (
    Math.abs(normalizedValue) >= SCIENTIFIC_NOTATION_UPPER_THRESHOLD ||
    (Math.abs(normalizedValue) > 0 &&
      Math.abs(normalizedValue) < SCIENTIFIC_NOTATION_LOWER_THRESHOLD)
  ) {
    return normalizedValue.toExponential(safeDecimals);
  }

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: safeDecimals,
  }).format(normalizedValue);
}

function formatFactor(value: number) {
  return formatReferenceNumber(Number(value.toPrecision(15)), REFERENCE_DECIMALS);
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
    throw new RangeError("El volumen debe ser un numero finito.");
  }
}

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}
