import {
  ACTIVITY_OPTIONS as SPANISH_ACTIVITY_OPTIONS,
  type DateRange,
  type DeficitInput,
  type DeficitPaceOption,
  type DeficitResult,
  type DeficitRiskLevel,
  type DeficitPace,
} from "./deficit";

export {
  FEMALE_LOW_CALORIE_WARNING,
  KCAL_PER_KG,
  LARGE_WEIGHT_LOSS_KG,
  MALE_LOW_CALORIE_WARNING,
  MIN_TARGET_CALORIES,
  TARGET_BMI_MIN,
  buildComparisonRows,
  buildDateRange,
  buildEstimatedWeeksRange,
  calculateBmi,
  calculateDeficitPlan,
  calculateSimpleTimeline,
  calculateTargetCalories,
  calculateWeeklyLossKg,
  calculateWeeklyLossPercent,
  classifyDeficitRisk,
  parseHealthInput,
  roundTo,
  validateDeficitInput,
} from "./deficit";

export type {
  ActivityLevel,
  DateRange,
  DeficitComparisonRow,
  DeficitField,
  DeficitInput,
  DeficitPace,
  DeficitPaceOption,
  DeficitResult,
  DeficitRiskLevel,
  DeficitValidationError,
  DeficitValidationResult,
  DeficitWarning,
  FormulaSex,
} from "./deficit";

const ACTIVITY_TEXT = {
  sedentary: ["Sedentary", "Mostly seated, with little planned exercise."],
  light: ["Lightly active", "Light exercise or sports 1-3 days per week."],
  moderate: ["Moderately active", "Moderate exercise or sports 3-5 days per week."],
  "very-active": ["Very active", "Hard exercise or sports 6-7 days per week."],
  extreme: ["Extremely active", "Very hard training or a highly physical job."],
} as const;

export const ACTIVITY_OPTIONS = SPANISH_ACTIVITY_OPTIONS.map((option) => ({
  ...option,
  label: ACTIVITY_TEXT[option.key][0],
  description: ACTIVITY_TEXT[option.key][1],
}));

export const PACE_OPTIONS: DeficitPaceOption[] = [
  { key: "very-gentle", label: "Very gentle", shortLabel: "Very gentle", dailyDeficit: 250, description: "A gradual pace designed for long-term sustainability." },
  { key: "gentle", label: "Gentle", shortLabel: "Gentle", dailyDeficit: 350, description: "A reasonable starting point for many people." },
  { key: "moderate", label: "Moderate", shortLabel: "Moderate", dailyDeficit: 500, description: "The calculator's recommended starting option." },
  { key: "aggressive", label: "Aggressive", shortLabel: "Aggressive", dailyDeficit: 750, description: "Demanding; nutritional supervision may be appropriate." },
  { key: "limit", label: "Upper limit", shortLabel: "Upper limit", dailyDeficit: 1000, description: "Shown for comparison, not as a primary recommendation." },
];

const number0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const signed0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0, signDisplay: "exceptZero" });
const number1 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const number2 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function getPaceOption(pace: DeficitPace): DeficitPaceOption {
  return PACE_OPTIONS.find((option) => option.key === pace)!;
}

export function formatCalories(value: number): string {
  return `${number0.format(Math.round(value))} kcal/day`;
}

export function formatSignedCalories(value: number): string {
  return `${signed0.format(Math.round(value))} kcal/day`;
}

export function formatWeight(value: number, unit: "kg" | "lb" = "kg"): string {
  return `${number1.format(Math.round(value * 10) / 10)} ${unit}`;
}

export function formatBmi(value: number): string {
  return number2.format(Math.round(value * 100) / 100);
}

export function formatWeeklyLossKg(value: number): string {
  return `~${number2.format(Math.round(value * 100) / 100)} kg/week`;
}

export function formatWeeklyLossPercent(value: number): string {
  return `~${number2.format(Math.round(value * 100) / 100)}% of body weight/week`;
}

export function formatWeeksRange([min, max]: [number, number]): string {
  return `${min}-${max} weeks (${number1.format(Math.round((min / 4.345) * 10) / 10)}-${number1.format(Math.round((max / 4.345) * 10) / 10)} months)`;
}

export function formatDateRange(range: DateRange): string {
  const formatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
  const earliest = formatter.format(range.earliest);
  const latest = formatter.format(range.latest);
  return earliest === latest ? earliest : `${earliest}-${latest}`;
}

export function getRiskLabel(riskLevel: DeficitRiskLevel): string {
  return {
    suave: "Gentle",
    moderado: "Moderate",
    agresivo: "Aggressive",
    "solo-supervision": "Professional supervision only",
    bloqueado: "Blocked",
  }[riskLevel];
}

export function buildDeficitCopyText(input: DeficitInput, result: DeficitResult): string {
  return [
    "Calorie deficit calculator - calculadoras.tools",
    `Current weight: ${formatWeight(input.weightKg)}`,
    `Goal: ${formatWeight(input.targetWeightKg)}`,
    `Estimated TDEE: ${formatCalories(result.tdee)}`,
    `Target calories: ${result.isBlocked ? "Plan blocked" : formatCalories(result.targetCalories)}`,
    `Deficit: ${formatSignedCalories(-result.dailyDeficit)}`,
    `Rate: ${getRiskLabel(result.riskLevel)}`,
    `Estimated timeline: ${formatWeeksRange(result.estimatedWeeksRange)}`,
  ].join("\n");
}
