import {
  ACTIVITY_OPTIONS,
  type ActivityLevel,
  type FormulaSex,
  calculateMifflinBmr,
  calculateTdee,
  getActivityFactor,
  parseHealthInput,
  roundTo,
} from "@lib/calculators/salud/calculadora-de-calorias-diarias-tdee/tdee";

export { ACTIVITY_OPTIONS, parseHealthInput, roundTo };
export type { ActivityLevel, FormulaSex };

export type DeficitPace =
  | "very-gentle"
  | "gentle"
  | "moderate"
  | "aggressive"
  | "limit";

export type DeficitRiskLevel =
  | "suave"
  | "moderado"
  | "agresivo"
  | "solo-supervision"
  | "bloqueado";

export type DeficitField =
  | "sex"
  | "age"
  | "weightKg"
  | "targetWeightKg"
  | "heightCm"
  | "activityLevel"
  | "pace"
  | "manualTdee";

export type DeficitValidationError =
  | "required"
  | "invalid"
  | "age_under_18"
  | "age_over_100"
  | "weight_range"
  | "target_weight_range"
  | "height_range"
  | "target_equal"
  | "target_higher"
  | "target_bmi_low"
  | "manual_tdee_range";

export type DeficitWarning =
  | "older_adult"
  | "large_weight_loss"
  | "low_tdee"
  | "manual_tdee_used"
  | "low_calories_female"
  | "low_calories_male"
  | "calories_below_bmr"
  | "high_deficit"
  | "high_weekly_loss"
  | "very_high_weekly_loss"
  | "target_calories_blocked";

export interface DeficitPaceOption {
  key: DeficitPace;
  label: string;
  shortLabel: string;
  dailyDeficit: number;
  description: string;
}

export interface DeficitInput {
  sex: FormulaSex;
  age: number;
  weightKg: number;
  targetWeightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
  pace: DeficitPace;
  manualTdee?: number;
}

export interface DeficitValidationResult {
  isValid: boolean;
  errors: Partial<Record<DeficitField, DeficitValidationError>>;
  warnings: DeficitWarning[];
}

export interface DateRange {
  earliest: Date;
  latest: Date;
}

export interface DeficitComparisonRow {
  pace: DeficitPace;
  label: string;
  dailyDeficit: number;
  targetCalories: number;
  weeklyLossKg: number;
  weeklyLossPercent: number;
  estimatedWeeksRange: [number, number];
  riskLevel: DeficitRiskLevel;
  isRecommended: boolean;
  isBlocked: boolean;
}

export interface DeficitResult {
  bmr: number;
  tdee: number;
  activityFactor: number;
  dailyDeficit: number;
  targetCalories: number;
  totalWeightLossKg: number;
  totalEnergyDeficit: number;
  weeklyLossKg: number;
  weeklyLossPercent: number;
  estimatedWeeksSimple: number;
  estimatedWeeksRange: [number, number];
  estimatedDateRange: DateRange;
  currentBmi: number;
  targetBmi: number;
  riskLevel: DeficitRiskLevel;
  isBlocked: boolean;
  warnings: DeficitWarning[];
  comparisonRows: DeficitComparisonRow[];
}

export const KCAL_PER_KG = 7700;
export const MIN_TARGET_CALORIES = 800;
export const FEMALE_LOW_CALORIE_WARNING = 1200;
export const MALE_LOW_CALORIE_WARNING = 1500;
export const TARGET_BMI_MIN = 18.5;
export const LARGE_WEIGHT_LOSS_KG = 50;

export const PACE_OPTIONS: DeficitPaceOption[] = [
  {
    key: "very-gentle",
    label: "Muy suave",
    shortLabel: "Muy suave",
    dailyDeficit: 250,
    description: "Ritmo gradual y sostenible a largo plazo.",
  },
  {
    key: "gentle",
    label: "Suave",
    shortLabel: "Suave",
    dailyDeficit: 350,
    description: "Buen punto de partida para muchas personas.",
  },
  {
    key: "moderate",
    label: "Moderado",
    shortLabel: "Moderado",
    dailyDeficit: 500,
    description: "Opcion recomendada para el MVP.",
  },
  {
    key: "aggressive",
    label: "Agresivo",
    shortLabel: "Agresivo",
    dailyDeficit: 750,
    description: "Exigente; conviene seguimiento nutricional.",
  },
  {
    key: "limit",
    label: "Limite",
    shortLabel: "Limite",
    dailyDeficit: 1000,
    description: "Solo como referencia, no como recomendacion principal.",
  },
] as const;

const calorieFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 0,
});

const signedCalorieFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 0,
  signDisplay: "exceptZero",
});

const oneDecimalFormatter = new Intl.NumberFormat("es-MX", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const twoDecimalFormatter = new Intl.NumberFormat("es-MX", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function getPaceOption(pace: DeficitPace): DeficitPaceOption {
  return PACE_OPTIONS.find((option) => option.key === pace)!;
}

export function calculateBmi(weightKg: number, heightCm: number): number {
  if (weightKg <= 0 || heightCm <= 0) {
    return Number.NaN;
  }

  const heightM = heightCm / 100;

  return weightKg / (heightM * heightM);
}

export function calculateTargetCalories(
  tdee: number,
  dailyDeficit: number,
): number {
  return tdee - dailyDeficit;
}

export function calculateWeeklyLossKg(dailyDeficit: number): number {
  return (dailyDeficit * 7) / KCAL_PER_KG;
}

export function calculateWeeklyLossPercent({
  weeklyLossKg,
  weightKg,
}: {
  weeklyLossKg: number;
  weightKg: number;
}): number {
  return (weeklyLossKg / weightKg) * 100;
}

export function calculateSimpleTimeline(
  weightLossKg: number,
  dailyDeficit: number,
): number {
  if (weightLossKg <= 0 || dailyDeficit <= 0) {
    return Number.NaN;
  }

  return (weightLossKg * KCAL_PER_KG) / (dailyDeficit * 7);
}

export function buildEstimatedWeeksRange(weeks: number): [number, number] {
  const lower = Math.max(1, Math.ceil(weeks));
  const upper = Math.max(lower + 1, Math.ceil(weeks * 1.08));

  return [lower, upper];
}

export function buildDateRange(
  weeksRange: [number, number],
  startDate = new Date(),
): DateRange {
  return {
    earliest: addDays(startDate, weeksRange[0] * 7),
    latest: addDays(startDate, weeksRange[1] * 7),
  };
}

export function classifyDeficitRisk({
  weeklyLossPercent,
  dailyDeficit,
  targetCalories,
}: {
  weeklyLossPercent: number;
  dailyDeficit: number;
  targetCalories: number;
}): DeficitRiskLevel {
  if (targetCalories < MIN_TARGET_CALORIES || weeklyLossPercent > 1.5) {
    return "bloqueado";
  }

  if (dailyDeficit > 1000 || weeklyLossPercent > 1) {
    return "solo-supervision";
  }

  if (dailyDeficit >= 750 || weeklyLossPercent >= 0.75) {
    return "agresivo";
  }

  if (weeklyLossPercent >= 0.5 || dailyDeficit >= 500) {
    return "moderado";
  }

  return "suave";
}

export function validateDeficitInput(
  input: Partial<DeficitInput>,
): DeficitValidationResult {
  const errors: DeficitValidationResult["errors"] = {};
  const warnings: DeficitWarning[] = [];

  if (!input.sex || !["male", "female"].includes(input.sex)) {
    errors.sex = "required";
  }

  if (input.age === undefined || input.age === null || Number.isNaN(input.age)) {
    errors.age = "required";
  } else if (!Number.isFinite(input.age) || !Number.isInteger(input.age)) {
    errors.age = "invalid";
  } else if (input.age < 18) {
    errors.age = "age_under_18";
  } else if (input.age > 100) {
    errors.age = "age_over_100";
  } else if (input.age >= 65) {
    warnings.push("older_adult");
  }

  validateWeight(input.weightKg, "weightKg", errors);
  validateTargetWeight(input.targetWeightKg, errors);

  if (
    input.heightCm === undefined ||
    input.heightCm === null ||
    Number.isNaN(input.heightCm)
  ) {
    errors.heightCm = "required";
  } else if (!Number.isFinite(input.heightCm)) {
    errors.heightCm = "invalid";
  } else if (input.heightCm < 100 || input.heightCm > 250) {
    errors.heightCm = "height_range";
  }

  if (
    !input.activityLevel ||
    !ACTIVITY_OPTIONS.some((option) => option.key === input.activityLevel)
  ) {
    errors.activityLevel = "required";
  }

  if (!input.pace || !PACE_OPTIONS.some((option) => option.key === input.pace)) {
    errors.pace = "required";
  }

  if (input.manualTdee !== undefined && input.manualTdee !== null) {
    if (!Number.isFinite(input.manualTdee)) {
      errors.manualTdee = "invalid";
    } else if (input.manualTdee < 800 || input.manualTdee > 6000) {
      errors.manualTdee = "manual_tdee_range";
    } else {
      warnings.push("manual_tdee_used");
    }
  }

  if (
    typeof input.weightKg === "number" &&
    Number.isFinite(input.weightKg) &&
    typeof input.targetWeightKg === "number" &&
    Number.isFinite(input.targetWeightKg)
  ) {
    if (input.targetWeightKg === input.weightKg) {
      errors.targetWeightKg = "target_equal";
    } else if (input.targetWeightKg > input.weightKg) {
      errors.targetWeightKg = "target_higher";
    } else if (input.weightKg - input.targetWeightKg > LARGE_WEIGHT_LOSS_KG) {
      warnings.push("large_weight_loss");
    }
  }

  if (
    !errors.targetWeightKg &&
    !errors.heightCm &&
    typeof input.targetWeightKg === "number" &&
    typeof input.heightCm === "number" &&
    calculateBmi(input.targetWeightKg, input.heightCm) < TARGET_BMI_MIN
  ) {
    errors.targetWeightKg = "target_bmi_low";
  }

  if (
    Object.keys(errors).length === 0 &&
    typeof input.sex === "string" &&
    typeof input.age === "number" &&
    typeof input.weightKg === "number" &&
    typeof input.heightCm === "number" &&
    typeof input.activityLevel === "string"
  ) {
    const bmr = calculateMifflinBmr(input as DeficitInput);
    const tdee = input.manualTdee ?? calculateTdee(
      bmr,
      getActivityFactor(input.activityLevel as ActivityLevel),
    );

    if (tdee < 1000) {
      warnings.push("low_tdee");
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings: uniqueWarnings(warnings),
  };
}

export function calculateDeficitPlan(
  input: DeficitInput,
  startDate = new Date(),
): DeficitResult {
  const validation = validateDeficitInput(input);

  if (!validation.isValid) {
    throw new Error("Invalid deficit input");
  }

  const pace = getPaceOption(input.pace);
  const bmr = calculateMifflinBmr(input);
  const activityFactor = getActivityFactor(input.activityLevel);
  const tdee = input.manualTdee ?? calculateTdee(bmr, activityFactor);
  const dailyDeficit = pace.dailyDeficit;
  const targetCalories = calculateTargetCalories(tdee, dailyDeficit);
  const totalWeightLossKg = input.weightKg - input.targetWeightKg;
  const totalEnergyDeficit = totalWeightLossKg * KCAL_PER_KG;
  const weeklyLossKg = calculateWeeklyLossKg(dailyDeficit);
  const weeklyLossPercent = calculateWeeklyLossPercent({
    weeklyLossKg,
    weightKg: input.weightKg,
  });
  const estimatedWeeksSimple = calculateSimpleTimeline(
    totalWeightLossKg,
    dailyDeficit,
  );
  const estimatedWeeksRange = buildEstimatedWeeksRange(estimatedWeeksSimple);
  const riskLevel = classifyDeficitRisk({
    weeklyLossPercent,
    dailyDeficit,
    targetCalories,
  });
  const resultWarnings = buildResultWarnings({
    sex: input.sex,
    bmr,
    dailyDeficit,
    targetCalories,
    weeklyLossPercent,
    riskLevel,
  });

  return {
    bmr,
    tdee,
    activityFactor,
    dailyDeficit,
    targetCalories,
    totalWeightLossKg,
    totalEnergyDeficit,
    weeklyLossKg,
    weeklyLossPercent,
    estimatedWeeksSimple,
    estimatedWeeksRange,
    estimatedDateRange: buildDateRange(estimatedWeeksRange, startDate),
    currentBmi: calculateBmi(input.weightKg, input.heightCm),
    targetBmi: calculateBmi(input.targetWeightKg, input.heightCm),
    riskLevel,
    isBlocked: riskLevel === "bloqueado",
    warnings: uniqueWarnings([...validation.warnings, ...resultWarnings]),
    comparisonRows: buildComparisonRows(input),
  };
}

export function buildComparisonRows(input: DeficitInput): DeficitComparisonRow[] {
  const validation = validateDeficitInput(input);

  if (!validation.isValid) {
    return [];
  }

  const bmr = calculateMifflinBmr(input);
  const tdee =
    input.manualTdee ?? calculateTdee(bmr, getActivityFactor(input.activityLevel));
  const weightLossKg = input.weightKg - input.targetWeightKg;

  return PACE_OPTIONS.map((pace) => {
    const targetCalories = calculateTargetCalories(tdee, pace.dailyDeficit);
    const weeklyLossKg = calculateWeeklyLossKg(pace.dailyDeficit);
    const weeklyLossPercent = calculateWeeklyLossPercent({
      weeklyLossKg,
      weightKg: input.weightKg,
    });
    const riskLevel = classifyDeficitRisk({
      weeklyLossPercent,
      dailyDeficit: pace.dailyDeficit,
      targetCalories,
    });
    const weeks = calculateSimpleTimeline(weightLossKg, pace.dailyDeficit);

    return {
      pace: pace.key,
      label: pace.label,
      dailyDeficit: pace.dailyDeficit,
      targetCalories,
      weeklyLossKg,
      weeklyLossPercent,
      estimatedWeeksRange: buildEstimatedWeeksRange(weeks),
      riskLevel,
      isRecommended: pace.key === "moderate",
      isBlocked: riskLevel === "bloqueado",
    };
  });
}

export function formatCalories(value: number): string {
  return `${calorieFormatter.format(roundTo(value, 0))} kcal/dia`;
}

export function formatSignedCalories(value: number): string {
  return `${signedCalorieFormatter.format(roundTo(value, 0))} kcal/dia`;
}

export function formatWeight(value: number, unit: "kg" | "lb" = "kg"): string {
  return `${oneDecimalFormatter.format(roundTo(value, 1))} ${unit}`;
}

export function formatBmi(value: number): string {
  return twoDecimalFormatter.format(roundTo(value, 2));
}

export function formatWeeklyLossKg(value: number): string {
  return `~${twoDecimalFormatter.format(roundTo(value, 2))} kg/semana`;
}

export function formatWeeklyLossPercent(value: number): string {
  return `~${twoDecimalFormatter.format(roundTo(value, 2))}% de tu peso/semana`;
}

export function formatWeeksRange([min, max]: [number, number]): string {
  const minMonths = formatMonths(min);
  const maxMonths = formatMonths(max);

  return `${min} - ${max} semanas (${minMonths} - ${maxMonths} meses)`;
}

export function formatDateRange(
  range: DateRange,
  locale = "es-MX",
): string {
  const earliest = formatMonthYear(range.earliest, locale);
  const latest = formatMonthYear(range.latest, locale);

  if (earliest === latest) {
    return earliest;
  }

  return `${earliest} - ${latest}`;
}

export function getRiskLabel(riskLevel: DeficitRiskLevel): string {
  const labels: Record<DeficitRiskLevel, string> = {
    suave: "Suave",
    moderado: "Moderado",
    agresivo: "Agresivo",
    "solo-supervision": "Solo con supervision",
    bloqueado: "Bloqueado",
  };

  return labels[riskLevel];
}

export function buildDeficitCopyText(
  input: DeficitInput,
  result: DeficitResult,
): string {
  return [
    "Calculadora de deficit calorico - calculadoras.tools",
    `Peso actual: ${formatWeight(input.weightKg)}`,
    `Meta: ${formatWeight(input.targetWeightKg)}`,
    `TDEE estimado: ${formatCalories(result.tdee)}`,
    `Calorias objetivo: ${
      result.isBlocked ? "Plan bloqueado" : formatCalories(result.targetCalories)
    }`,
    `Deficit: ${formatSignedCalories(-result.dailyDeficit)}`,
    `Ritmo: ${getRiskLabel(result.riskLevel)}`,
    `Plazo estimado: ${formatWeeksRange(result.estimatedWeeksRange)}`,
  ].join("\n");
}

function validateWeight(
  value: number | undefined,
  field: "weightKg",
  errors: DeficitValidationResult["errors"],
): void {
  if (value === undefined || value === null || Number.isNaN(value)) {
    errors[field] = "required";
  } else if (!Number.isFinite(value)) {
    errors[field] = "invalid";
  } else if (value < 30 || value > 300) {
    errors[field] = "weight_range";
  }
}

function validateTargetWeight(
  value: number | undefined,
  errors: DeficitValidationResult["errors"],
): void {
  if (value === undefined || value === null || Number.isNaN(value)) {
    errors.targetWeightKg = "required";
  } else if (!Number.isFinite(value)) {
    errors.targetWeightKg = "invalid";
  } else if (value < 30 || value > 299) {
    errors.targetWeightKg = "target_weight_range";
  }
}

function buildResultWarnings({
  sex,
  bmr,
  dailyDeficit,
  targetCalories,
  weeklyLossPercent,
  riskLevel,
}: {
  sex: FormulaSex;
  bmr: number;
  dailyDeficit: number;
  targetCalories: number;
  weeklyLossPercent: number;
  riskLevel: DeficitRiskLevel;
}): DeficitWarning[] {
  const warnings: DeficitWarning[] = [];

  if (targetCalories < MIN_TARGET_CALORIES) {
    warnings.push("target_calories_blocked");
  }

  if (sex === "female" && targetCalories < FEMALE_LOW_CALORIE_WARNING) {
    warnings.push("low_calories_female");
  }

  if (sex === "male" && targetCalories < MALE_LOW_CALORIE_WARNING) {
    warnings.push("low_calories_male");
  }

  if (targetCalories < bmr) {
    warnings.push("calories_below_bmr");
  }

  if (dailyDeficit > 1000) {
    warnings.push("high_deficit");
  }

  if (weeklyLossPercent > 1) {
    warnings.push("high_weekly_loss");
  }

  if (riskLevel === "bloqueado" || weeklyLossPercent > 1.5) {
    warnings.push("very_high_weekly_loss");
  }

  return warnings;
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

function formatMonthYear(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatMonths(weeks: number): string {
  return oneDecimalFormatter.format(roundTo(weeks / 4.345, 1));
}

function uniqueWarnings(warnings: DeficitWarning[]): DeficitWarning[] {
  return [...new Set(warnings)];
}
