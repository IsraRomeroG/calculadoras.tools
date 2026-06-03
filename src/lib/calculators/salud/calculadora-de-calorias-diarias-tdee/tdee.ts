export type FormulaSex = "male" | "female";
export type UnitSystem = "metric" | "imperial";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "very-active"
  | "extreme";
export type Goal =
  | "lose-aggressive"
  | "lose-moderate"
  | "lose-gentle"
  | "maintain"
  | "gain-gentle"
  | "gain-moderate"
  | "gain-high";

export type TdeeField =
  | "sex"
  | "age"
  | "weightKg"
  | "heightCm"
  | "activityLevel"
  | "goal"
  | "bodyFatPercentage";

export type TdeeValidationError =
  | "required"
  | "invalid"
  | "age_under_18"
  | "age_over_100"
  | "weight_range"
  | "height_range"
  | "body_fat_range";

export type TdeeWarning =
  | "older_adult"
  | "low_tdee"
  | "goal_too_low"
  | "low_goal_female"
  | "low_goal_male"
  | "high_deficit"
  | "extreme_activity"
  | "superplus_note";

export interface ActivityOption {
  key: ActivityLevel;
  label: string;
  shortLabel: string;
  description: string;
  detail: string;
  factor: number;
}

export interface GoalOption {
  key: Goal;
  label: string;
  adjustment: number;
  description: string;
}

export interface TdeeInput {
  sex: FormulaSex;
  age: number;
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export interface TdeeResult {
  bmr: number;
  tdee: number;
  activityFactor: number;
  goalCalories: number;
  goalAdjustmentCalories: number;
  weeklyEnergyEquivalentKg: number;
  warnings: TdeeWarning[];
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

export interface MetricValues {
  weightKg: number;
  heightCm: number;
}

export interface ImperialValues {
  weightLb: number;
  feet: number;
  inches: number;
}

export interface TdeeValidationResult {
  isValid: boolean;
  errors: Partial<Record<TdeeField, TdeeValidationError>>;
  warnings: TdeeWarning[];
}

export interface GoalCalorieValidation {
  isBlocked: boolean;
  warnings: TdeeWarning[];
}

export interface TdeeGoalRow {
  goal: Goal;
  label: string;
  adjustmentPercent: number;
  adjustmentCalories: number;
  calories: number;
  weeklyEnergyEquivalentKg: number;
}

const kgPerLb = 0.45359237;
const cmPerIn = 2.54;

export const KCAL_PER_KG = 7700;

export const ACTIVITY_OPTIONS: ActivityOption[] = [
  {
    key: "sedentary",
    label: "Sedentario",
    shortLabel: "Sedentario",
    description: "Trabajo de escritorio, sin ejercicio regular",
    detail: "Poco movimiento diario y desplazamientos principalmente sentado.",
    factor: 1.2,
  },
  {
    key: "light",
    label: "Ligeramente activo",
    shortLabel: "Ligero",
    description: "Ejercicio ligero 1 - 3 días/semana",
    detail: "Caminatas frecuentes, pausas activas o entrenamientos ligeros.",
    factor: 1.375,
  },
  {
    key: "moderate",
    label: "Moderadamente activo",
    shortLabel: "Moderado",
    description: "Ejercicio moderado 3 - 5 días/semana",
    detail: "Actividad diaria constante o deporte varias veces por semana.",
    factor: 1.55,
  },
  {
    key: "very-active",
    label: "Muy activo",
    shortLabel: "Muy activo",
    description: "Ejercicio intenso 6 - 7 dias/semana",
    detail: "Entrenamiento intenso y/o trabajo físico moderado.",
    factor: 1.725,
  },
  {
    key: "extreme",
    label: "Extremadamente activo",
    shortLabel: "Extremo",
    description: "Atleta o trabajo físico muy demandante",
    detail: "Doble sesión frecuente, construcción pesada o esfuerzo similar.",
    factor: 1.9,
  },
] as const;

export const ACTIVITY_FACTORS = ACTIVITY_OPTIONS.reduce(
  (factors, option) => ({
    ...factors,
    [option.key]: option.factor,
  }),
  {} as Record<ActivityLevel, number>,
);

export const GOAL_OPTIONS: GoalOption[] = [
  {
    key: "lose-aggressive",
    label: "Perder peso agresivo",
    adjustment: -0.2,
    description: "Deficit alto; requiere mas cautela.",
  },
  {
    key: "lose-moderate",
    label: "Perder peso moderado",
    adjustment: -0.15,
    description: "Deficit intermedio y mas facil de sostener.",
  },
  {
    key: "lose-gentle",
    label: "Perder peso suave",
    adjustment: -0.1,
    description: "Deficit gradual para empezar con calma.",
  },
  {
    key: "maintain",
    label: "Mantener peso",
    adjustment: 0,
    description: "Punto de partida para estabilidad.",
  },
  {
    key: "gain-gentle",
    label: "Superavit suave",
    adjustment: 0.05,
    description: "Aumento pequeño como apoyo a ganancia gradual.",
  },
  {
    key: "gain-moderate",
    label: "Superavit moderado",
    adjustment: 0.1,
    description: "Aumento mayor; no garantiza ganancia muscular.",
  },
  {
    key: "gain-high",
    label: "Superavit alto",
    adjustment: 0.15,
    description: "Aumento alto; conviene vigilar evolucion real.",
  },
] as const;

export const GOAL_ADJUSTMENTS = GOAL_OPTIONS.reduce(
  (adjustments, option) => ({
    ...adjustments,
    [option.key]: option.adjustment,
  }),
  {} as Record<Goal, number>,
);

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

const heightFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 1,
});

const weeklyFormatter = new Intl.NumberFormat("es-MX", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function calculateMifflinBmr({
  sex,
  age,
  weightKg,
  heightCm,
}: Pick<TdeeInput, "sex" | "age" | "weightKg" | "heightCm">): number {
  const sexConstant = sex === "male" ? 5 : -161;

  return 10 * weightKg + 6.25 * heightCm - 5 * age + sexConstant;
}

export function calculateHarrisBenedictBmr({
  sex,
  age,
  weightKg,
  heightCm,
}: Pick<TdeeInput, "sex" | "age" | "weightKg" | "heightCm">): number {
  if (sex === "male") {
    return 13.397 * weightKg + 4.799 * heightCm - 5.677 * age + 88.362;
  }

  return 9.247 * weightKg + 3.098 * heightCm - 4.33 * age + 447.593;
}

export function calculateKatchMcArdleBmr({
  weightKg,
  bodyFatPercentage,
}: {
  weightKg: number;
  bodyFatPercentage: number;
}): number {
  const leanMassKg = weightKg * (1 - bodyFatPercentage / 100);

  return 370 + 21.6 * leanMassKg;
}

export function calculateTdee(bmr: number, activityFactor: number): number {
  return bmr * activityFactor;
}

export function calculateGoalCalories(tdee: number, goal: Goal): number {
  return tdee * (1 + GOAL_ADJUSTMENTS[goal]);
}

export function estimateWeeklyEnergyEquivalentKg(
  dailyAdjustmentCalories: number,
): number {
  return (dailyAdjustmentCalories * 7) / KCAL_PER_KG;
}

export function getActivityFactor(activityLevel: ActivityLevel): number {
  return ACTIVITY_FACTORS[activityLevel];
}

export function getActivityOption(activityLevel: ActivityLevel): ActivityOption {
  return ACTIVITY_OPTIONS.find((option) => option.key === activityLevel)!;
}

export function getGoalOption(goal: Goal): GoalOption {
  return GOAL_OPTIONS.find((option) => option.key === goal)!;
}

export function calculateTdeeResult(input: TdeeInput): TdeeResult {
  const bmr = calculateMifflinBmr(input);
  const activityFactor = getActivityFactor(input.activityLevel);
  const tdee = calculateTdee(bmr, activityFactor);
  const goalCalories = calculateGoalCalories(tdee, input.goal);
  const goalAdjustmentCalories = goalCalories - tdee;
  const weeklyEnergyEquivalentKg = estimateWeeklyEnergyEquivalentKg(
    goalAdjustmentCalories,
  );
  const inputValidation = validateTdeeInput(input);
  const goalValidation = validateGoalCalories({
    sex: input.sex,
    goalCalories,
    tdee,
    goalAdjustmentCalories,
    goal: input.goal,
  });

  return {
    bmr,
    tdee,
    activityFactor,
    goalCalories,
    goalAdjustmentCalories,
    weeklyEnergyEquivalentKg,
    warnings: uniqueWarnings([
      ...inputValidation.warnings,
      ...goalValidation.warnings,
    ]),
  };
}

export function buildGoalRows(tdee: number): TdeeGoalRow[] {
  return GOAL_OPTIONS.map((option) => {
    const calories = calculateGoalCalories(tdee, option.key);
    const adjustmentCalories = calories - tdee;

    return {
      goal: option.key,
      label: option.label,
      adjustmentPercent: option.adjustment,
      adjustmentCalories,
      calories,
      weeklyEnergyEquivalentKg:
        estimateWeeklyEnergyEquivalentKg(adjustmentCalories),
    };
  });
}

export function validateTdeeInput(
  input: Partial<TdeeInput>,
): TdeeValidationResult {
  const errors: TdeeValidationResult["errors"] = {};
  const warnings: TdeeWarning[] = [];

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

  if (
    input.weightKg === undefined ||
    input.weightKg === null ||
    Number.isNaN(input.weightKg)
  ) {
    errors.weightKg = "required";
  } else if (!Number.isFinite(input.weightKg)) {
    errors.weightKg = "invalid";
  } else if (input.weightKg < 30 || input.weightKg > 300) {
    errors.weightKg = "weight_range";
  }

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

  if (!input.goal || !GOAL_OPTIONS.some((option) => option.key === input.goal)) {
    errors.goal = "required";
  }

  if (
    input.activityLevel === "extreme" &&
    typeof input.weightKg === "number" &&
    input.weightKg < 50
  ) {
    warnings.push("extreme_activity");
  }

  if (
    Object.keys(errors).length === 0 &&
    typeof input.sex === "string" &&
    typeof input.age === "number" &&
    typeof input.weightKg === "number" &&
    typeof input.heightCm === "number" &&
    typeof input.activityLevel === "string"
  ) {
    const bmr = calculateMifflinBmr(input as TdeeInput);
    const tdee = calculateTdee(
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

export function validateGoalCalories({
  sex,
  goalCalories,
  goalAdjustmentCalories,
  goal = "maintain",
}: {
  sex: FormulaSex;
  goalCalories: number;
  tdee: number;
  goalAdjustmentCalories: number;
  goal?: Goal;
}): GoalCalorieValidation {
  const warnings: TdeeWarning[] = [];

  if (goalCalories < 1000) {
    warnings.push("goal_too_low");
  }

  if (sex === "female" && goalCalories < 1200) {
    warnings.push("low_goal_female");
  }

  if (sex === "male" && goalCalories < 1500) {
    warnings.push("low_goal_male");
  }

  if (goalAdjustmentCalories < -1000) {
    warnings.push("high_deficit");
  }

  if (GOAL_ADJUSTMENTS[goal] > 0) {
    warnings.push("superplus_note");
  }

  return {
    isBlocked: goalCalories < 1000,
    warnings: uniqueWarnings(warnings),
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

export function formatCalories(value: number): string {
  return `${calorieFormatter.format(roundTo(value, 0))} kcal/día`;
}

export function formatSignedCalories(value: number): string {
  return `${signedCalorieFormatter.format(roundTo(value, 0))} kcal/día`;
}

export function formatWeeklyEquivalentKg(value: number): string {
  if (value === 0) {
    return "Estable";
  }

  return `~${weeklyFormatter.format(Math.abs(value))} kg/semana`;
}

export function formatWeight(value: number, unit: "kg" | "lb"): string {
  return `${oneDecimalFormatter.format(roundTo(value, 1))} ${unit}`;
}

export function formatHeight(value: number, unit: "cm" | "imperial"): string {
  if (unit === "cm") {
    return `${heightFormatter.format(roundTo(value, 1))} cm`;
  }

  const feet = Math.floor(value / 12);
  const inches = roundTo(value - feet * 12, 1);

  return `${feet} ft ${heightFormatter.format(inches)} in`;
}

export function buildTdeeCopyText(input: TdeeInput, result: TdeeResult): string {
  const activity = getActivityOption(input.activityLevel);
  const goal = getGoalOption(input.goal);
  const goalValidation = validateGoalCalories({
    sex: input.sex,
    goalCalories: result.goalCalories,
    tdee: result.tdee,
    goalAdjustmentCalories: result.goalAdjustmentCalories,
    goal: input.goal,
  });
  const goalCaloriesText = goalValidation.isBlocked
    ? "Objetivo bloqueado por estar bajo 1,000 kcal/día"
    : formatCalories(result.goalCalories);

  return [
    "Calculadora de Calorías Diarias - calculadoras.tools",
    `Sexo usado por fórmula: ${input.sex === "male" ? "Hombre" : "Mujer"}`,
    `Edad: ${input.age} años`,
    `Peso: ${formatWeight(input.weightKg, "kg")}`,
    `Altura: ${formatHeight(input.heightCm, "cm")}`,
    `Actividad: ${activity.label}`,
    `TMB estimada: ${formatCalories(result.bmr)}`,
    `TDEE estimado: ${formatCalories(result.tdee)}`,
    `Objetivo: ${goal.label}`,
    `Calorías objetivo: ${goalCaloriesText}`,
  ].join("\n");
}

export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function uniqueWarnings(warnings: TdeeWarning[]): TdeeWarning[] {
  return [...new Set(warnings)];
}

function removeKnownAffixes(value: string): string {
  return value
    .replace(
      /\b(kilocalorias?|calorias?|kcals?|kcal|kilogramos?|kilos?|kgs?|kg|libras?|lbs?|lb)\b/gi,
      "",
    )
    .replace(/\b(cent[ií]metros?|cms?|cm|metros?|mts?|m)\b/gi, "")
    .replace(/\b(pies?|ft|pulgadas?|in|inch|inches)\b/gi, "")
    .replace(/['"\s%]/g, "");
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
