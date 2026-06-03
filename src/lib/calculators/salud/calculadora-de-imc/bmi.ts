export type BmiCategoryKey =
  | "severe-thinness"
  | "moderate-thinness"
  | "mild-thinness"
  | "healthy"
  | "overweight"
  | "obesity-class-1"
  | "obesity-class-2"
  | "obesity-class-3";

export type RangeStatus = "below" | "within" | "above";

export interface AdultBmiCategory {
  key: BmiCategoryKey;
  label: string;
  rangeLabel: string;
  severity: "high-alert" | "alert" | "caution" | "normal";
  min: number;
  max: number;
}

export interface HealthyWeightRange {
  minKg: number;
  maxKg: number;
}

export interface AdultBmiResult {
  bmi: number;
  category: AdultBmiCategory;
  healthyWeightMinKg: number;
  healthyWeightMaxKg: number;
  differenceFromRangeKg: number;
  rangeStatus: RangeStatus;
}

export interface MetricValues {
  weightKg: number;
  heightCm: number;
}

export interface ImperialValues {
  weightLb: number;
  feet: number;
  inches: number;
}

export type ParseHealthInputResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

export interface ParseHealthInputOptions {
  maxDecimals?: number;
  convertMetersToCentimeters?: boolean;
}

const kgPerLb = 0.45359237;
const cmPerIn = 2.54;

const bmiFormatter = new Intl.NumberFormat("es-MX", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const oneDecimalFormatter = new Intl.NumberFormat("es-MX", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const heightFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 1,
});

export const ADULT_BMI_CATEGORIES: AdultBmiCategory[] = [
  {
    min: 0,
    max: 16,
    key: "severe-thinness",
    label: "Delgadez severa",
    rangeLabel: "Menos de 16.0",
    severity: "high-alert",
  },
  {
    min: 16,
    max: 17,
    key: "moderate-thinness",
    label: "Delgadez moderada",
    rangeLabel: "16.0 - 16.9",
    severity: "alert",
  },
  {
    min: 17,
    max: 18.5,
    key: "mild-thinness",
    label: "Delgadez leve",
    rangeLabel: "17.0 - 18.4",
    severity: "caution",
  },
  {
    min: 18.5,
    max: 25,
    key: "healthy",
    label: "Rango saludable",
    rangeLabel: "18.5 - 24.9",
    severity: "normal",
  },
  {
    min: 25,
    max: 30,
    key: "overweight",
    label: "Sobrepeso",
    rangeLabel: "25.0 - 29.9",
    severity: "caution",
  },
  {
    min: 30,
    max: 35,
    key: "obesity-class-1",
    label: "Obesidad clase 1",
    rangeLabel: "30.0 - 34.9",
    severity: "alert",
  },
  {
    min: 35,
    max: 40,
    key: "obesity-class-2",
    label: "Obesidad clase 2",
    rangeLabel: "35.0 - 39.9",
    severity: "high-alert",
  },
  {
    min: 40,
    max: Number.POSITIVE_INFINITY,
    key: "obesity-class-3",
    label: "Obesidad clase 3",
    rangeLabel: "40.0 o más",
    severity: "high-alert",
  },
];

export function calculateBmi(weightKg: number, heightCm: number): number {
  if (weightKg <= 0 || heightCm <= 0) {
    return Number.NaN;
  }

  const heightM = heightCm / 100;

  return weightKg / (heightM * heightM);
}

export function classifyAdultBmi(bmi: number): AdultBmiCategory {
  const category = ADULT_BMI_CATEGORIES.find(
    (item) => bmi >= item.min && bmi < item.max,
  );

  return category ?? ADULT_BMI_CATEGORIES[ADULT_BMI_CATEGORIES.length - 1];
}

export function calculateHealthyWeightRange(
  heightCm: number,
): HealthyWeightRange {
  const heightM = heightCm / 100;
  const squaredHeight = heightM * heightM;

  return {
    minKg: 18.5 * squaredHeight,
    maxKg: 24.9 * squaredHeight,
  };
}

export function calculateAdultBmiResult({
  weightKg,
  heightCm,
}: MetricValues): AdultBmiResult {
  const bmi = calculateBmi(weightKg, heightCm);
  const category = classifyAdultBmi(bmi);
  const healthyWeight = calculateHealthyWeightRange(heightCm);
  let rangeStatus: RangeStatus = "within";
  let differenceFromRangeKg = 0;

  if (weightKg < healthyWeight.minKg) {
    rangeStatus = "below";
    differenceFromRangeKg = healthyWeight.minKg - weightKg;
  } else if (weightKg > healthyWeight.maxKg) {
    rangeStatus = "above";
    differenceFromRangeKg = weightKg - healthyWeight.maxKg;
  }

  return {
    bmi,
    category,
    healthyWeightMinKg: healthyWeight.minKg,
    healthyWeightMaxKg: healthyWeight.maxKg,
    differenceFromRangeKg,
    rangeStatus,
  };
}

export function convertKgToLb(kg: number): number {
  return kg / kgPerLb;
}

export function convertLbToKg(lb: number): number {
  return lb * kgPerLb;
}

export function convertCmToIn(cm: number): number {
  return cm / cmPerIn;
}

export function convertInToCm(inches: number): number {
  return inches * cmPerIn;
}

export function convertMetricToImperial({
  weightKg,
  heightCm,
}: MetricValues): ImperialValues {
  const totalInches = convertCmToIn(heightCm);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches - feet * 12;

  return {
    weightLb: convertKgToLb(weightKg),
    feet,
    inches,
  };
}

export function convertImperialToMetric({
  weightLb,
  feet,
  inches,
}: ImperialValues): MetricValues {
  return {
    weightKg: convertLbToKg(weightLb),
    heightCm: convertInToCm(feet * 12 + inches),
  };
}

export function parseHealthInput(
  value: string,
  options: ParseHealthInputOptions = {},
): ParseHealthInputResult {
  const trimmed = value.trim();
  const maxDecimals = options.maxDecimals ?? 2;

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  if (/[-\u2212]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const cleaned = removeKnownAffixes(trimmed);

  if (!cleaned || /[^0-9.,]/.test(cleaned)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeSeparators(cleaned);

  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const decimalPart = normalized.split(".")[1];

  if (decimalPart && decimalPart.length > maxDecimals) {
    return { ok: false, error: "too_many_decimals" };
  }

  let numericValue = Number(normalized);

  if (!Number.isFinite(numericValue)) {
    return { ok: false, error: "invalid" };
  }

  if (options.convertMetersToCentimeters && numericValue > 0 && numericValue < 3) {
    numericValue *= 100;
  }

  return {
    ok: true,
    value: numericValue,
    normalized: String(numericValue),
  };
}

export function formatBmi(value: number): string {
  return bmiFormatter.format(roundTo(value, 2));
}

export function formatWeight(value: number, unit: "kg" | "lb"): string {
  return `${oneDecimalFormatter.format(roundTo(value, 1))} ${unit}`;
}

export function formatHeight(
  value: number,
  unit: "cm" | "imperial",
): string {
  if (unit === "cm") {
    return `${heightFormatter.format(roundTo(value, 1))} cm`;
  }

  const feet = Math.floor(value / 12);
  const inches = roundTo(value - feet * 12, 1);

  return `${feet} ft ${heightFormatter.format(inches)} in`;
}

export function buildBmiCopyText({
  weight,
  height,
  bmi,
  category,
  healthyRange,
}: {
  weight: string;
  height: string;
  bmi: number;
  category: string;
  healthyRange: string;
}): string {
  return [
    "Calculadora de IMC - calculadoras.tools",
    `Peso: ${weight}`,
    `Altura: ${height}`,
    `IMC: ${formatBmi(bmi)}`,
    `Categoría: ${category}`,
    `Rango saludable de referencia: ${healthyRange}`,
  ].join("\n");
}

export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function removeKnownAffixes(value: string): string {
  return value
    .replace(/\b(kilogramos?|kilos?|kgs?|kg|libras?|lbs?|lb)\b/gi, "")
    .replace(/\b(cent[ií]metros?|cms?|cm|metros?|mts?|m)\b/gi, "")
    .replace(/\b(pies?|ft|pulgadas?|in|inch|inches)\b/gi, "")
    .replace(/['"\s]/g, "");
}

function normalizeSeparators(value: string): string {
  const lastComma = value.lastIndexOf(",");
  const lastDot = value.lastIndexOf(".");

  if (lastComma !== -1 && lastDot !== -1) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";

    return value
      .replaceAll(thousandsSeparator, "")
      .replace(decimalSeparator, ".");
  }

  if (lastComma !== -1) {
    return normalizeSingleSeparator(value, ",");
  }

  if (lastDot !== -1) {
    return normalizeSingleSeparator(value, ".");
  }

  return value;
}

function normalizeSingleSeparator(value: string, separator: "," | "."): string {
  const parts = value.split(separator);

  if (parts.length === 2) {
    const [integerPart, fractionalOrGroup] = parts;

    if (!integerPart || !fractionalOrGroup) {
      return value;
    }

    if (
      separator === "," &&
      fractionalOrGroup.length === 3 &&
      integerPart.length <= 3
    ) {
      return `${integerPart}${fractionalOrGroup}`;
    }

    return `${integerPart}.${fractionalOrGroup}`;
  }

  if (
    parts.length > 2 &&
    parts.every(Boolean) &&
    parts.slice(1).every((part) => part.length === 3)
  ) {
    return parts.join("");
  }

  return value;
}
