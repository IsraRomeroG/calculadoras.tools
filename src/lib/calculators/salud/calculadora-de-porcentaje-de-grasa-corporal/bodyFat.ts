import {
  convertCmToIn,
  convertInToCm,
  convertKgToLb,
  convertLbToKg,
  roundTo,
} from "../calculadora-de-imc/bmi";

export const BODY_FAT_LIMITS = {
  heightCm: { min: 100, max: 250 },
  neckCm: { min: 20, max: 80 },
  waistCm: { min: 40, max: 250 },
  hipCm: { min: 50, max: 250 },
  weightKg: { min: 20, max: 500 },
} as const;

export const SENSITIVITY_DELTA_CM = 1;

export type BodyFatFormula = "male" | "female";
export type BodyFatUnit = "metric" | "imperial";
export type BodyFatField =
  | "heightCm"
  | "neckCm"
  | "waistCm"
  | "hipCm"
  | "weightKg";

export type BodyFatValidationErrorCode =
  | "required"
  | "out_of_range"
  | "waist_not_above_neck"
  | "invalid_female_combination";

export type BodyFatCalculationErrorCode =
  | "invalid_input"
  | "result_out_of_range";

export interface BodyFatInput {
  formula: BodyFatFormula;
  heightCm: number;
  neckCm: number;
  waistCm: number;
  hipCm?: number;
  weightKg?: number;
}

export interface BodyFatSensitivity {
  minPercentage: number;
  maxPercentage: number;
}

export interface BodyCompositionEstimate {
  fatMassKg: number;
  fatFreeMassKg: number;
}

export interface BodyFatResult {
  input: BodyFatInput;
  percentage: number;
  sensitivity?: BodyFatSensitivity;
  composition?: BodyCompositionEstimate;
  isUnusual: boolean;
}

export interface BodyFatValidationResult {
  isValid: boolean;
  errors: Partial<Record<BodyFatField, BodyFatValidationErrorCode>>;
}

const percentageFormatter = new Intl.NumberFormat("es-MX", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const measurementFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 1,
});

export class BodyFatCalculationError extends RangeError {
  code: BodyFatCalculationErrorCode;
  validation?: BodyFatValidationResult;

  constructor(
    code: BodyFatCalculationErrorCode,
    message: string,
    validation?: BodyFatValidationResult,
  ) {
    super(message);
    this.name = "BodyFatCalculationError";
    this.code = code;
    this.validation = validation;
  }
}

export function validateBodyFatInput(
  input: BodyFatInput,
): BodyFatValidationResult {
  const errors: Partial<Record<BodyFatField, BodyFatValidationErrorCode>> = {};

  validateRequiredRange(input.heightCm, "heightCm", errors);
  validateRequiredRange(input.neckCm, "neckCm", errors);
  validateRequiredRange(input.waistCm, "waistCm", errors);

  if (input.formula === "female") {
    validateRequiredRange(input.hipCm, "hipCm", errors);
  }

  if (input.weightKg !== undefined) {
    validateRequiredRange(input.weightKg, "weightKg", errors);
  }

  if (
    !errors.waistCm &&
    !errors.neckCm &&
    input.formula === "male" &&
    input.waistCm <= input.neckCm
  ) {
    errors.waistCm = "waist_not_above_neck";
  }

  if (
    !errors.waistCm &&
    !errors.neckCm &&
    !errors.hipCm &&
    input.formula === "female" &&
    input.waistCm + (input.hipCm as number) <= input.neckCm
  ) {
    errors.hipCm = "invalid_female_combination";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function calculateBodyFatPercentage(input: BodyFatInput): number {
  const heightIn = convertCmToIn(input.heightCm);
  const neckIn = convertCmToIn(input.neckCm);
  const waistIn = convertCmToIn(input.waistCm);

  if (input.formula === "male") {
    const circumferenceDifference = waistIn - neckIn;

    if (circumferenceDifference <= 0 || heightIn <= 0) {
      return Number.NaN;
    }

    return (
      86.01 * Math.log10(circumferenceDifference) -
      70.041 * Math.log10(heightIn) +
      36.76
    );
  }

  const hipIn = convertCmToIn(input.hipCm as number);
  const circumferenceDifference = waistIn + hipIn - neckIn;

  if (circumferenceDifference <= 0 || heightIn <= 0) {
    return Number.NaN;
  }

  return (
    163.205 * Math.log10(circumferenceDifference) -
    97.684 * Math.log10(heightIn) -
    78.387
  );
}

export function calculateBodyFatResult(input: BodyFatInput): BodyFatResult {
  const validation = validateBodyFatInput(input);

  if (!validation.isValid) {
    throw new BodyFatCalculationError(
      "invalid_input",
      "Revisa las medidas antes de calcular.",
      validation,
    );
  }

  const percentage = calculateBodyFatPercentage(input);

  if (!isUsablePercentage(percentage)) {
    throw new BodyFatCalculationError(
      "result_out_of_range",
      "El resultado quedó fuera del rango utilizable de esta fórmula.",
    );
  }

  const composition =
    input.weightKg === undefined
      ? undefined
      : {
          fatMassKg: input.weightKg * (percentage / 100),
          fatFreeMassKg: input.weightKg * (1 - percentage / 100),
        };

  return {
    input: { ...input },
    percentage,
    sensitivity: calculateBodyFatSensitivity(input),
    composition,
    isUnusual: percentage < 2 || percentage > 70,
  };
}

export function calculateBodyFatSensitivity(
  input: BodyFatInput,
): BodyFatSensitivity | undefined {
  const lowerInput: BodyFatInput = {
    ...input,
    waistCm: input.waistCm - SENSITIVITY_DELTA_CM,
    neckCm: input.neckCm + SENSITIVITY_DELTA_CM,
    hipCm:
      input.formula === "female"
        ? (input.hipCm as number) - SENSITIVITY_DELTA_CM
        : undefined,
  };
  const upperInput: BodyFatInput = {
    ...input,
    waistCm: input.waistCm + SENSITIVITY_DELTA_CM,
    neckCm: input.neckCm - SENSITIVITY_DELTA_CM,
    hipCm:
      input.formula === "female"
        ? (input.hipCm as number) + SENSITIVITY_DELTA_CM
        : undefined,
  };
  const minPercentage = calculateBodyFatPercentage(lowerInput);
  const maxPercentage = calculateBodyFatPercentage(upperInput);

  if (
    !isUsablePercentage(minPercentage) ||
    !isUsablePercentage(maxPercentage) ||
    minPercentage >= maxPercentage
  ) {
    return undefined;
  }

  return {
    minPercentage,
    maxPercentage,
  };
}

export function buildBodyFatCopyText(
  result: BodyFatResult,
  unit: BodyFatUnit,
): string {
  const lines = [
    "Calculadora de porcentaje de grasa corporal - calculadoras.tools",
    `Fórmula: ${getBodyFatFormulaLabel(result.input.formula).toLowerCase()}`,
    `Estimación: ${formatBodyFatPercentage(result.percentage)}`,
  ];

  if (result.sensitivity) {
    lines.push(
      `Sensibilidad por variación de perímetros de ±1 cm: ${formatBodyFatPercentage(result.sensitivity.minPercentage)} a ${formatBodyFatPercentage(result.sensitivity.maxPercentage)}`,
    );
  }

  if (result.composition) {
    const massUnit = unit === "metric" ? "kg" : "lb";
    const fatMass =
      unit === "metric"
        ? result.composition.fatMassKg
        : convertKgToLb(result.composition.fatMassKg);
    const fatFreeMass =
      unit === "metric"
        ? result.composition.fatFreeMassKg
        : convertKgToLb(result.composition.fatFreeMassKg);

    lines.push(
      `Masa grasa estimada: ${formatBodyFatMass(fatMass, massUnit)}`,
      `Masa libre de grasa estimada: ${formatBodyFatMass(fatFreeMass, massUnit)}`,
    );
  }

  lines.push(
    `Medidas: ${formatBodyFatMeasurementSummary(result.input, unit)}`,
    "Resultado orientativo; no es una medición clínica.",
  );

  return lines.join("\n");
}

export function formatBodyFatPercentage(value: number): string {
  return `${percentageFormatter.format(roundTo(value, 1))}%`;
}

export function formatBodyFatMass(
  value: number,
  unit: "kg" | "lb",
): string {
  return `${measurementFormatter.format(roundTo(value, 1))} ${unit}`;
}

export function formatBodyFatMeasurementSummary(
  input: BodyFatInput,
  unit: BodyFatUnit,
): string {
  const lengthUnit = unit === "metric" ? "cm" : "in";
  const convertLength = (value: number) =>
    unit === "metric" ? value : convertCmToIn(value);
  const measurements = [
    unit === "metric"
      ? `altura ${formatMeasurement(input.heightCm, "cm")}`
      : `altura ${formatImperialHeight(input.heightCm)}`,
    `cuello ${formatMeasurement(convertLength(input.neckCm), lengthUnit)}`,
    `cintura ${formatMeasurement(convertLength(input.waistCm), lengthUnit)}`,
  ];

  if (input.formula === "female") {
    measurements.push(
      `cadera ${formatMeasurement(convertLength(input.hipCm as number), lengthUnit)}`,
    );
  }

  return measurements.join(", ");
}

export function getBodyFatFormulaLabel(formula: BodyFatFormula): string {
  return formula === "male" ? "Fórmula masculina" : "Fórmula femenina";
}

export { convertCmToIn, convertInToCm, convertKgToLb, convertLbToKg };

function validateRequiredRange(
  value: number | undefined,
  field: BodyFatField,
  errors: Partial<Record<BodyFatField, BodyFatValidationErrorCode>>,
): void {
  if (value === undefined || !Number.isFinite(value)) {
    errors[field] = "required";
    return;
  }

  const limits = BODY_FAT_LIMITS[field];

  if (value < limits.min || value > limits.max) {
    errors[field] = "out_of_range";
  }
}

function isUsablePercentage(value: number): boolean {
  return Number.isFinite(value) && value > 0 && value < 100;
}

function formatMeasurement(value: number, unit: "cm" | "in"): string {
  return `${measurementFormatter.format(roundTo(value, 1))} ${unit}`;
}

function formatImperialHeight(heightCm: number): string {
  const totalInches = convertCmToIn(heightCm);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches - feet * 12;

  return `${feet} ft ${formatMeasurement(inches, "in")}`;
}
