import {
  getExerciseActivity,
  getExerciseVariant,
  type ExerciseIntensity,
  type ExerciseVariant,
} from "./activities";

export type WeightUnit = "kg" | "lb";
export type ExerciseCaloriesWarning = "long_duration" | "very_high_met" | "manual_met" | "tdee_overlap";
export type ExerciseCaloriesField = "activityId" | "variantId" | "weight" | "durationMinutes" | "manualMet";
export type ExerciseCaloriesValidationError = "required" | "invalid" | "not_integer" | "out_of_range" | "too_many_decimals";

export interface ExerciseCaloriesInput {
  activityId: string;
  variantId: string;
  weight: number;
  weightUnit: WeightUnit;
  durationMinutes: number;
  useManualMet: boolean;
  manualMet?: number;
}

export interface ExerciseCaloriesResult {
  input: ExerciseCaloriesInput;
  weightKg: number;
  activityLabel: string;
  variant: ExerciseVariant;
  metUsed: number;
  usesManualMet: boolean;
  intensity: ExerciseIntensity;
  totalCaloriesPerMinute: number;
  activeCaloriesPerMinute: number;
  totalCalories: number;
  activeCalories: number;
  projections: { durationMinutes: number; totalCalories: number; activeCalories: number }[];
  comparisons: { variant: ExerciseVariant; totalCalories: number; activeCalories: number; isSelected: boolean }[];
  warnings: ExerciseCaloriesWarning[];
}

export interface ExerciseCaloriesValidationResult {
  isValid: boolean;
  errors: Partial<Record<ExerciseCaloriesField, ExerciseCaloriesValidationError>>;
}

export const EXERCISE_CALORIES_LIMITS = {
  weightKg: { min: 20, max: 250 },
  durationMinutes: { min: 1, max: 720 },
  manualMet: { min: 1, max: 25 },
} as const;
export const PROJECTION_DURATIONS = [15, 30, 45, 60] as const;
export const KG_PER_LB = 0.45359237;

export class ExerciseCaloriesCalculationError extends RangeError {
  constructor(public validation: ExerciseCaloriesValidationResult) {
    super("Revisa los datos antes de calcular.");
    this.name = "ExerciseCaloriesCalculationError";
  }
}

export function calculateCaloriesPerMinute(met: number, weightKg: number): number {
  assertPositive(met);
  assertPositive(weightKg);
  return (met * 3.5 * weightKg) / 200;
}

export function calculateActiveCaloriesPerMinute(met: number, weightKg: number): number {
  assertPositive(met);
  assertPositive(weightKg);
  return (Math.max(met - 1, 0) * 3.5 * weightKg) / 200;
}

export function convertExerciseWeight(value: number, fromUnit: WeightUnit, toUnit: WeightUnit): number {
  if (fromUnit === toUnit) return value;
  return fromUnit === "kg" ? value / KG_PER_LB : value * KG_PER_LB;
}

export function parseExerciseNumber(rawValue: string, maxDecimals = 2):
  { ok: true; value: number } | { ok: false; error: ExerciseCaloriesValidationError } {
  const normalized = rawValue.trim().replace(",", ".");
  if (!normalized) return { ok: false, error: "required" };
  if (!/^\d+(\.\d+)?$/.test(normalized)) return { ok: false, error: "invalid" };
  const decimals = normalized.split(".")[1];
  if (decimals && decimals.length > maxDecimals) return { ok: false, error: "too_many_decimals" };
  const value = Number(normalized);
  return Number.isFinite(value) ? { ok: true, value } : { ok: false, error: "invalid" };
}

export function validateExerciseCaloriesInput(input: ExerciseCaloriesInput): ExerciseCaloriesValidationResult {
  const errors: ExerciseCaloriesValidationResult["errors"] = {};
  const weightKg = convertExerciseWeight(input.weight, input.weightUnit, "kg");

  if (!getExerciseActivity(input.activityId)) errors.activityId = "required";
  if (!getExerciseVariant(input.activityId, input.variantId)) errors.variantId = "required";
  if (!Number.isFinite(input.weight)) errors.weight = "required";
  else if (weightKg < 20 || weightKg > 250) errors.weight = "out_of_range";
  if (!Number.isFinite(input.durationMinutes)) errors.durationMinutes = "required";
  else if (!Number.isInteger(input.durationMinutes)) errors.durationMinutes = "not_integer";
  else if (input.durationMinutes < 1 || input.durationMinutes > 720) errors.durationMinutes = "out_of_range";
  if (input.useManualMet) {
    if (!Number.isFinite(input.manualMet)) errors.manualMet = "required";
    else if (input.manualMet! < 1 || input.manualMet! > 25) errors.manualMet = "out_of_range";
    else if (countDecimals(input.manualMet!) > 1) errors.manualMet = "too_many_decimals";
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}

export function calculateExerciseCaloriesResult(input: ExerciseCaloriesInput): ExerciseCaloriesResult {
  const validation = validateExerciseCaloriesInput(input);
  if (!validation.isValid) throw new ExerciseCaloriesCalculationError(validation);
  const activity = getExerciseActivity(input.activityId)!;
  const selectedVariant = getExerciseVariant(input.activityId, input.variantId)!;
  const weightKg = convertExerciseWeight(input.weight, input.weightUnit, "kg");
  const metUsed = input.useManualMet ? input.manualMet! : selectedVariant.met;
  const totalPerMinute = calculateCaloriesPerMinute(metUsed, weightKg);
  const activePerMinute = calculateActiveCaloriesPerMinute(metUsed, weightKg);
  const comparisonVariants = activity.variants.length <= 3
    ? activity.variants
    : activity.variants.slice(
        Math.max(0, Math.min(activity.variants.findIndex((item) => item.id === selectedVariant.id) - 1, activity.variants.length - 3)),
        Math.max(0, Math.min(activity.variants.findIndex((item) => item.id === selectedVariant.id) - 1, activity.variants.length - 3)) + 3,
      );

  return {
    input: { ...input },
    weightKg,
    activityLabel: activity.label,
    variant: selectedVariant,
    metUsed,
    usesManualMet: input.useManualMet,
    intensity: classifyMetIntensity(metUsed),
    totalCaloriesPerMinute: totalPerMinute,
    activeCaloriesPerMinute: activePerMinute,
    totalCalories: totalPerMinute * input.durationMinutes,
    activeCalories: activePerMinute * input.durationMinutes,
    projections: PROJECTION_DURATIONS.filter((duration) => duration !== input.durationMinutes).map((durationMinutes) => ({
      durationMinutes,
      totalCalories: totalPerMinute * durationMinutes,
      activeCalories: activePerMinute * durationMinutes,
    })),
    comparisons: comparisonVariants.map((item) => ({
      variant: item,
      totalCalories: calculateCaloriesPerMinute(item.met, weightKg) * input.durationMinutes,
      activeCalories: calculateActiveCaloriesPerMinute(item.met, weightKg) * input.durationMinutes,
      isSelected: item.id === selectedVariant.id,
    })),
    warnings: buildWarnings(input.durationMinutes, metUsed, input.useManualMet),
  };
}

export const classifyMetIntensity = (met: number): ExerciseIntensity =>
  met < 3 ? "light" : met < 6 ? "moderate" : "vigorous";

export const formatExerciseCalories = (value: number) =>
  `${new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 }).format(Math.round(value))} kcal`;

export const formatExerciseDecimal = (value: number) =>
  new Intl.NumberFormat("es-MX", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);

export function buildExerciseCaloriesCopyText(result: ExerciseCaloriesResult): string {
  return [
    "Calorías quemadas por ejercicio - calculadoras.tools",
    `Actividad: ${result.activityLabel} - ${result.variant.label}`,
    `Detalle: ${result.variant.description}`,
    `Duración: ${result.input.durationMinutes} min`,
    `Peso: ${formatExerciseDecimal(result.input.weight)} ${result.input.weightUnit}`,
    `MET utilizado: ${formatExerciseDecimal(result.metUsed)}${result.usesManualMet ? " (manual)" : ""}`,
    `Calorías totales aproximadas: ${formatExerciseCalories(result.totalCalories)}`,
    `Calorías activas aproximadas: ${formatExerciseCalories(result.activeCalories)}`,
    "Estimación educativa: el gasto real puede variar.",
  ].join("\n");
}

function buildWarnings(duration: number, met: number, manual: boolean): ExerciseCaloriesWarning[] {
  const warnings: ExerciseCaloriesWarning[] = ["tdee_overlap"];
  if (duration > 240) warnings.unshift("long_duration");
  if (met >= 15) warnings.unshift("very_high_met");
  if (manual) warnings.unshift("manual_met");
  return warnings;
}

function countDecimals(value: number): number {
  return String(value).split(".")[1]?.length ?? 0;
}

function assertPositive(value: number): void {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError("El valor debe ser positivo.");
}
