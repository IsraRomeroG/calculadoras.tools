export const COOKING_MEASURE_DIMENSIONS = ["volume", "mass"] as const;

export type CookingMeasureDimension =
  (typeof COOKING_MEASURE_DIMENSIONS)[number];

export const COOKING_VOLUME_SYSTEMS = ["metric", "us"] as const;

export type CookingVolumeSystem = (typeof COOKING_VOLUME_SYSTEMS)[number];

export const COOKING_VOLUME_UNITS = [
  "ml",
  "l",
  "cup",
  "tbsp",
  "tsp",
  "us-fl-oz",
] as const;

export const COOKING_MASS_UNITS = ["g", "kg", "oz", "lb"] as const;

export const COOKING_MEASURE_UNITS = [
  ...COOKING_VOLUME_UNITS,
  ...COOKING_MASS_UNITS,
] as const;

export type CookingVolumeUnit = (typeof COOKING_VOLUME_UNITS)[number];
export type CookingMassUnit = (typeof COOKING_MASS_UNITS)[number];
export type CookingMeasureUnit = (typeof COOKING_MEASURE_UNITS)[number];

export interface CookingMeasureUnitMetadata {
  label: string;
  shortLabel: string;
  symbol: string;
  dimension: CookingMeasureDimension;
  aliases: readonly string[];
  dependsOnSystem?: boolean;
}

export interface CookingVolumeSystemMetadata {
  label: string;
  adjective: string;
  cupMl: number;
  tablespoonMl: number;
  teaspoonMl: number;
}

export type ParseCookingMeasureInputResult =
  | {
      ok: true;
      value: number;
      normalized: string;
      interpretation?: string;
    }
  | {
      ok: false;
      error: "empty" | "incomplete" | "invalid";
    };

export interface CookingMeasureConversion {
  value: number;
  origin: CookingMeasureUnit;
  destination: CookingMeasureUnit;
  system: CookingVolumeSystem;
  dimension: CookingMeasureDimension;
  result: number;
  formula: string;
}

const DEFAULT_DECIMALS = 2;
const MAX_DECIMALS = 6;
const MAX_ADAPTIVE_DECIMALS = 10;
const SCIENTIFIC_NOTATION_UPPER_THRESHOLD = 1_000_000_000_000;
const SCIENTIFIC_NOTATION_LOWER_THRESHOLD = 0.00000001;

export const COOKING_VOLUME_SYSTEM_METADATA = {
  metric: {
    label: "Metrico",
    adjective: "metricas",
    cupMl: 250,
    tablespoonMl: 15,
    teaspoonMl: 5,
  },
  us: {
    label: "Estadounidense",
    adjective: "estadounidenses",
    cupMl: 236.5882365,
    tablespoonMl: 14.78676478125,
    teaspoonMl: 4.92892159375,
  },
} as const satisfies Record<CookingVolumeSystem, CookingVolumeSystemMetadata>;

export const COOKING_VOLUME_SYSTEM_METADATA_EN = {
  metric: {
    label: "Metric",
    adjective: "metric",
    cupMl: 250,
    tablespoonMl: 15,
    teaspoonMl: 5,
  },
  us: {
    label: "US customary",
    adjective: "US",
    cupMl: 236.5882365,
    tablespoonMl: 14.78676478125,
    teaspoonMl: 4.92892159375,
  },
} as const satisfies Record<CookingVolumeSystem, CookingVolumeSystemMetadata>;

export const COOKING_MEASURE_UNIT_METADATA = {
  ml: {
    label: "Mililitro",
    shortLabel: "ml",
    symbol: "ml",
    dimension: "volume",
    aliases: ["mililitro", "mililitros"],
  },
  l: {
    label: "Litro",
    shortLabel: "l",
    symbol: "l",
    dimension: "volume",
    aliases: ["litro", "litros"],
  },
  cup: {
    label: "Taza",
    shortLabel: "taza",
    symbol: "taza",
    dimension: "volume",
    aliases: ["cup", "cups", "taza", "tazas"],
    dependsOnSystem: true,
  },
  tbsp: {
    label: "Cucharada",
    shortLabel: "cda",
    symbol: "cda",
    dimension: "volume",
    aliases: ["tbsp", "cda", "cucharada", "cucharadas"],
    dependsOnSystem: true,
  },
  tsp: {
    label: "Cucharadita",
    shortLabel: "cdta",
    symbol: "cdta",
    dimension: "volume",
    aliases: ["tsp", "cdta", "cucharadita", "cucharaditas"],
    dependsOnSystem: true,
  },
  "us-fl-oz": {
    label: "Onza liquida estadounidense",
    shortLabel: "fl oz",
    symbol: "fl oz",
    dimension: "volume",
    aliases: ["fl oz", "floz", "onza liquida", "onzas liquidas"],
  },
  g: {
    label: "Gramo",
    shortLabel: "g",
    symbol: "g",
    dimension: "mass",
    aliases: ["gramo", "gramos"],
  },
  kg: {
    label: "Kilogramo",
    shortLabel: "kg",
    symbol: "kg",
    dimension: "mass",
    aliases: ["kilogramo", "kilogramos", "kilo", "kilos"],
  },
  oz: {
    label: "Onza de peso",
    shortLabel: "oz",
    symbol: "oz",
    dimension: "mass",
    aliases: ["onza", "onzas", "ounce", "ounces"],
  },
  lb: {
    label: "Libra",
    shortLabel: "lb",
    symbol: "lb",
    dimension: "mass",
    aliases: ["libra", "libras", "pound", "pounds"],
  },
} as const satisfies Record<CookingMeasureUnit, CookingMeasureUnitMetadata>;

export const COOKING_MEASURE_UNIT_METADATA_EN = {
  ml: {
    label: "Milliliter",
    shortLabel: "ml",
    symbol: "ml",
    dimension: "volume",
    aliases: ["milliliter", "milliliters", "millilitre", "millilitres"],
  },
  l: {
    label: "Liter",
    shortLabel: "l",
    symbol: "l",
    dimension: "volume",
    aliases: ["liter", "liters", "litre", "litres"],
  },
  cup: {
    label: "Cup",
    shortLabel: "cup",
    symbol: "cup",
    dimension: "volume",
    aliases: ["cup", "cups"],
    dependsOnSystem: true,
  },
  tbsp: {
    label: "Tablespoon",
    shortLabel: "tbsp",
    symbol: "tbsp",
    dimension: "volume",
    aliases: ["tbsp", "tablespoon", "tablespoons"],
    dependsOnSystem: true,
  },
  tsp: {
    label: "Teaspoon",
    shortLabel: "tsp",
    symbol: "tsp",
    dimension: "volume",
    aliases: ["tsp", "teaspoon", "teaspoons"],
    dependsOnSystem: true,
  },
  "us-fl-oz": {
    label: "US fluid ounce",
    shortLabel: "fl oz",
    symbol: "fl oz",
    dimension: "volume",
    aliases: ["fl oz", "floz", "fluid ounce", "fluid ounces"],
  },
  g: {
    label: "Gram",
    shortLabel: "g",
    symbol: "g",
    dimension: "mass",
    aliases: ["gram", "grams"],
  },
  kg: {
    label: "Kilogram",
    shortLabel: "kg",
    symbol: "kg",
    dimension: "mass",
    aliases: ["kilogram", "kilograms", "kilo", "kilos"],
  },
  oz: {
    label: "Weight ounce",
    shortLabel: "oz",
    symbol: "oz",
    dimension: "mass",
    aliases: ["ounce", "ounces"],
  },
  lb: {
    label: "Pound",
    shortLabel: "lb",
    symbol: "lb",
    dimension: "mass",
    aliases: ["pound", "pounds"],
  },
} as const satisfies Record<CookingMeasureUnit, CookingMeasureUnitMetadata>;

const FIXED_VOLUME_FACTORS_ML: Partial<Record<CookingVolumeUnit, number>> = {
  ml: 1,
  l: 1000,
  "us-fl-oz": 29.5735295625,
};

const MASS_FACTORS_G: Record<CookingMassUnit, number> = {
  g: 1,
  kg: 1000,
  oz: 28.349523125,
  lb: 453.59237,
};

const EXACT_PRACTICAL_VALUES = [
  { unit: "cup", value: 2 },
  { unit: "cup", value: 1 },
  { unit: "cup", value: 0.75 },
  { unit: "cup", value: 0.5 },
  { unit: "cup", value: 0.25 },
  { unit: "tsp", value: 3 },
  { unit: "tbsp", value: 3 },
  { unit: "tbsp", value: 2 },
  { unit: "tbsp", value: 1 },
  { unit: "tsp", value: 2 },
  { unit: "tsp", value: 1 },
] as const satisfies readonly {
  unit: CookingVolumeUnit;
  value: number;
}[];

export function isCookingMeasureUnit(
  value: string,
): value is CookingMeasureUnit {
  return COOKING_MEASURE_UNITS.includes(value as CookingMeasureUnit);
}

export function isCookingVolumeSystem(
  value: string,
): value is CookingVolumeSystem {
  return COOKING_VOLUME_SYSTEMS.includes(value as CookingVolumeSystem);
}

export function getCookingMeasureDimension(
  unit: CookingMeasureUnit,
): CookingMeasureDimension {
  return COOKING_MEASURE_UNIT_METADATA[unit].dimension;
}

export function getCookingMeasureFactor(
  unit: CookingMeasureUnit,
  system: CookingVolumeSystem = "metric",
): number {
  const dimension = getCookingMeasureDimension(unit);

  if (dimension === "mass") {
    return MASS_FACTORS_G[unit as CookingMassUnit];
  }

  const fixedFactor = FIXED_VOLUME_FACTORS_ML[unit as CookingVolumeUnit];

  if (fixedFactor) {
    return fixedFactor;
  }

  const systemMetadata = COOKING_VOLUME_SYSTEM_METADATA[system];

  switch (unit) {
    case "cup":
      return systemMetadata.cupMl;
    case "tbsp":
      return systemMetadata.tablespoonMl;
    case "tsp":
      return systemMetadata.teaspoonMl;
    default:
      throw new Error(`Unidad culinaria no soportada: ${unit}`);
  }
}

export function convertCookingMeasure(
  value: number,
  origin: CookingMeasureUnit,
  destination: CookingMeasureUnit,
  system: CookingVolumeSystem = "metric",
): CookingMeasureConversion {
  validateCookingMeasure(value);

  const originDimension = getCookingMeasureDimension(origin);
  const destinationDimension = getCookingMeasureDimension(destination);

  if (originDimension !== destinationDimension) {
    throw new RangeError(
      "Para convertir volumen a peso necesitas elegir un ingrediente. Esa conversion no esta incluida en esta version.",
    );
  }

  const originFactor = getCookingMeasureFactor(origin, system);
  const destinationFactor = getCookingMeasureFactor(destination, system);
  const result = (value * originFactor) / destinationFactor;

  return {
    value,
    origin,
    destination,
    system,
    dimension: originDimension,
    result,
    formula: "resultado = valor x factorOrigen / factorDestino",
  };
}

export function getRelatedCookingMeasureEquivalences(
  value: number,
  origin: CookingMeasureUnit,
  system: CookingVolumeSystem = "metric",
): Record<CookingMeasureUnit, number> {
  validateCookingMeasure(value);

  const dimension = getCookingMeasureDimension(origin);
  const units =
    dimension === "volume" ? COOKING_VOLUME_UNITS : COOKING_MASS_UNITS;

  return Object.fromEntries(
    units.map((unit) => [
      unit,
      convertCookingMeasure(value, origin, unit, system).result,
    ]),
  ) as Record<CookingMeasureUnit, number>;
}

export function validateCookingMeasure(value: number): void {
  if (!Number.isFinite(value)) {
    throw new RangeError("La cantidad debe ser un numero finito.");
  }

  if (value < 0) {
    throw new RangeError("La cantidad no puede ser negativa.");
  }
}

export function parseCookingMeasureInput(
  rawValue: string,
  locale: "es" | "en" = "es",
): ParseCookingMeasureInputResult {
  const trimmed = rawValue.trim().replaceAll("−", "-");

  if (!trimmed) {
    return { ok: false, error: "empty" };
  }

  if (isIncompleteCookingInput(trimmed)) {
    return { ok: false, error: "incomplete" };
  }

  const fraction = parseFractionInput(trimmed);

  if (fraction) {
    if (fraction.denominator === 0) {
      return { ok: false, error: "invalid" };
    }

    const value = fraction.whole + fraction.numerator / fraction.denominator;

    return {
      ok: true,
      value,
      normalized: String(value),
    };
  }

  const normalized = normalizeLocalizedNumber(trimmed, locale);

  if (!normalized) {
    return { ok: false, error: "invalid" };
  }

  const value = Number(normalized.value);

  if (!Number.isFinite(value)) {
    return { ok: false, error: "invalid" };
  }

  return {
    ok: true,
    value,
    normalized: String(value),
    ...(normalized.interpretation
      ? { interpretation: normalized.interpretation }
      : {}),
  };
}

export function formatCookingMeasure(
  value: number,
  unit: CookingMeasureUnit,
  decimals = DEFAULT_DECIMALS,
  system: CookingVolumeSystem = "metric",
  locale: "es" | "en" = "es",
): string {
  const metadata: CookingMeasureUnitMetadata =
    locale === "en"
      ? COOKING_MEASURE_UNIT_METADATA_EN[unit]
      : COOKING_MEASURE_UNIT_METADATA[unit];
  const systemMetadata: Record<
    CookingVolumeSystem,
    CookingVolumeSystemMetadata
  > =
    locale === "en"
      ? COOKING_VOLUME_SYSTEM_METADATA_EN
      : COOKING_VOLUME_SYSTEM_METADATA;
  const suffix =
    metadata.dependsOnSystem && getCookingMeasureDimension(unit) === "volume"
      ? ` ${systemMetadata[system].adjective}`
      : "";

  const formattedValue = formatCookingMeasureNumber(value, decimals, locale);

  if (locale === "en" && suffix) {
    return `${formattedValue}${suffix} ${metadata.symbol}`;
  }

  return `${formattedValue} ${metadata.symbol}${suffix}`;
}

export function formatCookingMeasureNumber(
  value: number,
  decimals = DEFAULT_DECIMALS,
  locale: "es" | "en" = "es",
): string {
  if (!Number.isFinite(value)) {
    throw new RangeError("La cantidad debe ser un numero finito.");
  }

  const normalizedValue = Object.is(value, -0) ? 0 : value;
  const absoluteValue = Math.abs(normalizedValue);
  const safeDecimals = normalizeDecimals(decimals);

  if (
    absoluteValue >= SCIENTIFIC_NOTATION_UPPER_THRESHOLD ||
    (absoluteValue > 0 && absoluteValue < SCIENTIFIC_NOTATION_LOWER_THRESHOLD)
  ) {
    return normalizedValue.toExponential(safeDecimals);
  }

  const adaptiveDecimals = getAdaptiveDecimals(normalizedValue, safeDecimals);

  return new Intl.NumberFormat(locale === "en" ? "en-US" : "es-MX", {
    maximumFractionDigits: adaptiveDecimals,
  }).format(roundToDecimals(normalizedValue, adaptiveDecimals));
}

export function formatPracticalCookingResult(
  value: number,
  unit: CookingMeasureUnit,
  system: CookingVolumeSystem = "metric",
  decimals = DEFAULT_DECIMALS,
  locale: "es" | "en" = "es",
): string | undefined {
  if (getCookingMeasureDimension(unit) !== "volume") {
    return undefined;
  }

  const ml = convertCookingMeasure(value, unit, "ml", system).result;

  for (const candidate of EXACT_PRACTICAL_VALUES) {
    const candidateMl =
      candidate.value * getCookingMeasureFactor(candidate.unit, system);

    if (Math.abs(ml - candidateMl) <= 1e-9) {
      return formatCookingMeasure(
        candidate.value,
        candidate.unit,
        decimals,
        system,
        locale,
      );
    }
  }

  return undefined;
}

export function buildCookingMeasureFormula(
  conversion: CookingMeasureConversion,
  decimals = DEFAULT_DECIMALS,
  locale: "es" | "en" = "es",
): {
  formula: string;
  substitution: string;
  result: string;
  steps: string[];
} {
  const originFactor = getCookingMeasureFactor(
    conversion.origin,
    conversion.system,
  );
  const destinationFactor = getCookingMeasureFactor(
    conversion.destination,
    conversion.system,
  );
  const result = formatCookingMeasure(
    conversion.result,
    conversion.destination,
    decimals,
    conversion.system,
    locale,
  );
  const value = formatCookingMeasureNumber(
    conversion.value,
    decimals,
    locale,
  );
  const formula =
    locale === "en"
      ? "result = value x sourceFactor / destinationFactor"
      : conversion.formula;
  const substitution = `${locale === "en" ? "result" : "resultado"} = ${value} x ${formatFactor(originFactor)} / ${formatFactor(destinationFactor)}`;

  if (conversion.origin === conversion.destination) {
    return {
      formula: `${conversion.destination} = ${conversion.origin}`,
      substitution: `${conversion.destination} = ${value}`,
      result,
      steps:
        locale === "en"
          ? ["The source and destination units are the same.", `Result: ${result}.`]
          : [
              "La unidad de origen y destino es la misma.",
              `Resultado: ${result}.`,
            ],
    };
  }

  return {
    formula,
    substitution,
    result,
    steps:
      locale === "en"
        ? [
            `Use the formula: ${formula}.`,
            `Substitute the values: ${substitution}.`,
            `Result: ${result}.`,
          ]
        : [
            `Usamos la formula: ${formula}.`,
            `Sustituimos: ${substitution}.`,
            `Resultado: ${result}.`,
          ],
  };
}

function parseFractionInput(value: string):
  | {
      whole: number;
      numerator: number;
      denominator: number;
    }
  | undefined {
  const match = value.match(/^(\d+)?(?:\s+)?(\d+)\/(\d+)$/);

  if (!match) {
    return undefined;
  }

  return {
    whole: match[1] ? Number(match[1]) : 0,
    numerator: Number(match[2]),
    denominator: Number(match[3]),
  };
}

function isIncompleteCookingInput(value: string) {
  return /^[+-]?(?:[.,])?$/.test(value) || /^[+-]?\d+[\d.,\s]*[.,]$/.test(value);
}

function normalizeLocalizedNumber(
  rawValue: string,
  locale: "es" | "en",
): { value: string; interpretation?: string } | undefined {
  if (/^\+/.test(rawValue) || /-/.test(rawValue)) {
    return undefined;
  }

  const value = rawValue.replace(/\s/g, "");
  const lastComma = value.lastIndexOf(",");
  const lastPoint = value.lastIndexOf(".");
  const hasComma = lastComma !== -1;
  const hasPoint = lastPoint !== -1;

  if (!/^[\d.,]+$/.test(value)) {
    return undefined;
  }

  if (hasComma && hasPoint) {
    const decimalSeparator = lastComma > lastPoint ? "," : ".";
    const groupingSeparator = decimalSeparator === "," ? "." : ",";
    const decimalIndex = value.lastIndexOf(decimalSeparator);
    const integerPart = value.slice(0, decimalIndex);
    const decimalPart = value.slice(decimalIndex + 1);

    if (
      !decimalPart ||
      decimalPart.includes(groupingSeparator) ||
      !isValidGroupedInteger(integerPart, groupingSeparator)
    ) {
      return undefined;
    }

    return {
      value: `${stripGrouping(integerPart, groupingSeparator)}.${decimalPart}`,
    };
  }

  if (hasComma || hasPoint) {
    const separator = hasComma ? "," : ".";
    const parts = value.split(separator);

    if (parts.length > 2) {
      if (!isValidGroupedInteger(value, separator)) {
        return undefined;
      }

      const interpreted = stripGrouping(value, separator);

      return {
        value: interpreted,
        interpretation:
          locale === "en"
            ? `Interpreted as ${interpreted}`
            : `Interpretado como ${interpreted}`,
      };
    }

    const [integerPart, decimalPart] = parts;

    if (!decimalPart) {
      return undefined;
    }

    if (
      decimalPart.length === 3 &&
      integerPart.length >= 1 &&
      isValidGroupedInteger(value, separator)
    ) {
      const interpreted = stripGrouping(value, separator);

      return {
        value: interpreted,
        interpretation:
          locale === "en"
            ? `Interpreted as ${interpreted}`
            : `Interpretado como ${interpreted}`,
      };
    }

    return {
      value: `${integerPart || "0"}.${decimalPart}`,
    };
  }

  return /^\d+$/.test(value) ? { value } : undefined;
}

function isValidGroupedInteger(value: string, separator: string) {
  const groups = value.split(separator);

  return (
    /^\d{1,3}$/.test(groups[0]) &&
    groups.slice(1).every((group) => /^\d{3}$/.test(group))
  );
}

function stripGrouping(value: string, separator: string) {
  return value.split(separator).join("");
}

function normalizeDecimals(decimals: number) {
  if (!Number.isFinite(decimals)) {
    return DEFAULT_DECIMALS;
  }

  return Math.min(MAX_DECIMALS, Math.max(0, Math.trunc(decimals)));
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

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function formatFactor(value: number) {
  return Number(value.toPrecision(12)).toString();
}
