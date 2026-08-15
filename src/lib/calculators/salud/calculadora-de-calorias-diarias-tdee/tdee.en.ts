import {
  type ActivityLevel,
  type ActivityOption,
  type Goal,
  type GoalOption,
  type TdeeInput,
  type TdeeResult,
} from "./tdee";

export {
  KCAL_PER_KG,
  buildGoalRows,
  calculateGoalCalories,
  calculateHarrisBenedictBmr,
  calculateKatchMcArdleBmr,
  calculateMifflinBmr,
  calculateTdee,
  calculateTdeeResult,
  convertCmToIn,
  convertImperialToMetric,
  convertInToCm,
  convertKgToLb,
  convertLbToKg,
  convertMetricToImperial,
  estimateWeeklyEnergyEquivalentKg,
  parseHealthInput,
  roundTo,
  validateGoalCalories,
  validateTdeeInput,
} from "./tdee";

export type {
  ActivityLevel,
  ActivityOption,
  FormulaSex,
  Goal,
  GoalCalorieValidation,
  GoalOption,
  ImperialValues,
  MetricValues,
  ParseHealthInputOptions,
  ParseHealthInputResult,
  TdeeField,
  TdeeGoalRow,
  TdeeInput,
  TdeeResult,
  TdeeValidationError,
  TdeeValidationResult,
  TdeeWarning,
  UnitSystem,
} from "./tdee";

export const ACTIVITY_OPTIONS: ActivityOption[] = [
  { key: "sedentary", label: "Sedentary", shortLabel: "Sedentary", description: "Desk job, no regular exercise", detail: "Little daily movement and mostly seated transportation", factor: 1.2 },
  { key: "light", label: "Lightly active", shortLabel: "Light", description: "Light exercise 1-3 days/week", detail: "Frequent walks, active breaks, or light workouts", factor: 1.375 },
  { key: "moderate", label: "Moderately active", shortLabel: "Moderate", description: "Moderate exercise 3-5 days/week", detail: "Consistent daily activity or sports several times per week", factor: 1.55 },
  { key: "very-active", label: "Very active", shortLabel: "Very active", description: "Hard exercise 6-7 days/week", detail: "Hard training and/or moderately physical work", factor: 1.725 },
  { key: "extreme", label: "Extremely active", shortLabel: "Extreme", description: "Athlete or highly demanding physical job", detail: "Frequent double sessions, heavy construction, or similar effort", factor: 1.9 },
];

export const ACTIVITY_FACTORS = ACTIVITY_OPTIONS.reduce(
  (factors, option) => ({ ...factors, [option.key]: option.factor }),
  {} as Record<ActivityLevel, number>,
);

export const GOAL_OPTIONS: GoalOption[] = [
  { key: "lose-aggressive", label: "Aggressive weight loss", adjustment: -0.2, description: "A large deficit that requires greater caution." },
  { key: "lose-moderate", label: "Moderate weight loss", adjustment: -0.15, description: "A middle-range deficit that may be easier to sustain." },
  { key: "lose-gentle", label: "Gentle weight loss", adjustment: -0.1, description: "A gradual deficit for a cautious start." },
  { key: "maintain", label: "Maintain weight", adjustment: 0, description: "A starting point for weight stability." },
  { key: "gain-gentle", label: "Gentle surplus", adjustment: 0.05, description: "A small increase to support gradual weight gain." },
  { key: "gain-moderate", label: "Moderate surplus", adjustment: 0.1, description: "A larger increase that does not guarantee muscle gain." },
  { key: "gain-high", label: "High surplus", adjustment: 0.15, description: "A large increase; monitor your actual progress." },
];

export const GOAL_ADJUSTMENTS = GOAL_OPTIONS.reduce(
  (adjustments, option) => ({ ...adjustments, [option.key]: option.adjustment }),
  {} as Record<Goal, number>,
);

const number0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const signed0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0, signDisplay: "exceptZero" });
const weekly = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function getActivityFactor(activityLevel: ActivityLevel): number {
  return ACTIVITY_FACTORS[activityLevel];
}

export function getActivityOption(activityLevel: ActivityLevel): ActivityOption {
  return ACTIVITY_OPTIONS.find((option) => option.key === activityLevel)!;
}

export function getGoalOption(goal: Goal): GoalOption {
  return GOAL_OPTIONS.find((option) => option.key === goal)!;
}

export function formatCalories(value: number): string {
  return `${number0.format(Math.round(value))} kcal/day`;
}

export function formatSignedCalories(value: number): string {
  return `${signed0.format(Math.round(value))} kcal/day`;
}

export function formatWeeklyEquivalentKg(value: number): string {
  if (Math.abs(value) < 0.005) return "Weight maintenance";
  const direction = value < 0 ? "loss" : "gain";
  return `~${weekly.format(Math.abs(value))} kg/week ${direction}`;
}

export function buildTdeeCopyText(input: TdeeInput, result: TdeeResult): string {
  const activity = getActivityOption(input.activityLevel);
  const goal = getGoalOption(input.goal);
  const goalCalories = result.goalCalories < 1000
    ? "Goal blocked because it falls below 1,000 kcal/day"
    : formatCalories(result.goalCalories);
  return [
    "Daily calorie calculator - calculadoras.tools",
    `Age: ${input.age} years`,
    `Weight: ${input.weightKg.toFixed(1)} kg`,
    `Height: ${input.heightCm.toFixed(1)} cm`,
    `Activity: ${activity.label}`,
    `Estimated BMR: ${formatCalories(result.bmr)}`,
    `Estimated TDEE: ${formatCalories(result.tdee)}`,
    `Goal: ${goal.label}`,
    `Goal calories: ${goalCalories}`,
  ].join("\n");
}
