import {
  calculateExerciseCaloriesResult as calculateExerciseCaloriesResultBase,
  type ExerciseCaloriesInput,
  type ExerciseCaloriesResult,
} from "./exerciseCalories";
import { getExerciseActivity, getExerciseVariant } from "./activities.en";

export {
  EXERCISE_CALORIES_LIMITS,
  KG_PER_LB,
  PROJECTION_DURATIONS,
  ExerciseCaloriesCalculationError,
  calculateActiveCaloriesPerMinute,
  calculateCaloriesPerMinute,
  classifyMetIntensity,
  convertExerciseWeight,
  parseExerciseNumber,
  validateExerciseCaloriesInput,
} from "./exerciseCalories";

export type {
  ExerciseCaloriesField,
  ExerciseCaloriesInput,
  ExerciseCaloriesResult,
  ExerciseCaloriesValidationError,
  ExerciseCaloriesValidationResult,
  ExerciseCaloriesWarning,
  WeightUnit,
} from "./exerciseCalories";

export function calculateExerciseCaloriesResult(input: ExerciseCaloriesInput): ExerciseCaloriesResult {
  const result = calculateExerciseCaloriesResultBase(input);
  const activity = getExerciseActivity(input.activityId)!;
  const selectedVariant = getExerciseVariant(input.activityId, input.variantId)!;

  return {
    ...result,
    activityLabel: activity.label,
    variant: selectedVariant,
    comparisons: result.comparisons.map((comparison) => ({
      ...comparison,
      variant: getExerciseVariant(input.activityId, comparison.variant.id)!,
    })),
  };
}

export const formatExerciseCalories = (value: number) =>
  `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(value))} kcal`;

export const formatExerciseDecimal = (value: number) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);

export function buildExerciseCaloriesCopyText(result: ExerciseCaloriesResult): string {
  return [
    "Exercise calories burned - calculadoras.tools",
    `Activity: ${result.activityLabel} - ${result.variant.label}`,
    `Details: ${result.variant.description}`,
    `Duration: ${result.input.durationMinutes} min`,
    `Weight: ${formatExerciseDecimal(result.input.weight)} ${result.input.weightUnit}`,
    `MET used: ${formatExerciseDecimal(result.metUsed)}${result.usesManualMet ? " (manual)" : ""}`,
    `Estimated total calories: ${formatExerciseCalories(result.totalCalories)}`,
    `Estimated active calories: ${formatExerciseCalories(result.activeCalories)}`,
    "Educational estimate: actual energy expenditure may vary.",
  ].join("\n");
}
