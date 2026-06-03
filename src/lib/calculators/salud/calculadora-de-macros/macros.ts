export type UnitSystem = "metric" | "imperial";
export type Macro = "protein" | "carbs" | "fat";
export type MacroMethod = "protein-first" | "percentages";
export type MacroGoal =
  | "lose-fat"
  | "maintain"
  | "gain-muscle"
  | "performance"
  | "recomposition";
export type DietPreset =
  | "balanced"
  | "high-protein"
  | "keto"
  | "low-carb"
  | "vegetarian"
  | "vegan"
  | "mediterranean"
  | "paleo"
  | "intermittent-fasting";

export type MacroField =
  | "calories"
  | "weightKg"
  | "proteinGramsPerKg"
  | "fatPercent"
  | "carbLimitGrams"
  | "proteinPercent"
  | "carbsPercent"
  | "fatPercentManual"
  | "percentageTotal"
  | "meals";

export type MacroValidationError =
  | "required"
  | "invalid"
  | "calories_range"
  | "weight_range"
  | "protein_range_low"
  | "protein_range_high"
  | "fat_percent_range"
  | "carb_limit_range"
  | "percentage_range"
  | "percentage_total"
  | "negative_carbs"
  | "negative_fat"
  | "meals_range";

export type MacroWarning =
  | "calories_low"
  | "protein_low"
  | "protein_high"
  | "fat_low"
  | "carbs_low"
  | "keto_carbs_high"
  | "restrictive_diet"
  | "vegan_high_protein"
  | "one_meal"
  | "percent_outside_amdr";

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
}

export interface MacroGoalOption {
  key: MacroGoal;
  label: string;
  description: string;
}

export interface DietPresetOption {
  key: DietPreset;
  label: string;
  description: string;
  isRestrictive?: boolean;
}

export interface GoalDefaults {
  proteinGramsPerKg: number;
  fatPercent: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercentManual: number;
}

export interface DietPresetDefaults {
  proteinGramsPerKg: number;
  fatPercent: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercentManual: number;
  carbLimitGrams?: number;
}

export interface ProteinFirstInput {
  calories: number;
  weightKg: number;
  goal: MacroGoal;
  dietPreset: DietPreset;
  proteinGramsPerKg: number;
  fatPercent: number;
  carbLimitGrams?: number;
}

export interface PercentageInput {
  calories: number;
  weightKg?: number;
  goal: MacroGoal;
  dietPreset: DietPreset;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
}

export interface MealDistributionInput {
  meals: number;
  result: MacroResult;
}

export interface MacroBreakdown {
  grams: number;
  calories: number;
  percent: number;
}

export interface MacroResult {
  protein: MacroBreakdown;
  carbs: MacroBreakdown;
  fat: MacroBreakdown;
  totalCalories: number;
  warnings: MacroWarning[];
}

export interface MealDistributionRow {
  meal: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface MacroValidationResult {
  isValid: boolean;
  errors: Partial<Record<MacroField, MacroValidationError>>;
  warnings: MacroWarning[];
}

const kgPerLb = 0.45359237;

export const KCAL_PER_GRAM = {
  protein: 4,
  carbs: 4,
  fat: 9,
} as const;

export const CALORIE_RANGE = {
  min: 800,
  warnLow: 1200,
  max: 6000,
} as const;

export const WEIGHT_KG_RANGE = {
  min: 30,
  max: 300,
} as const;

export const WEIGHT_LB_RANGE = {
  min: 66,
  max: 660,
} as const;

export const PROTEIN_G_PER_KG_RANGE = {
  min: 0.6,
  warnLow: 0.8,
  warnHigh: 3.0,
  max: 3.5,
} as const;

export const FAT_PERCENT_RANGE = {
  warnLow: 15,
  min: 10,
  max: 75,
} as const;

export const CARB_LIMIT_RANGE = {
  min: 0,
  warnHighKeto: 50,
  max: 300,
} as const;

const PERCENTAGE_PROTEIN_WARN_HIGH_G_PER_KG = 2.4;

export const PERCENTAGE_TOLERANCE = 0.1;

export const MACRO_GOAL_OPTIONS: MacroGoalOption[] = [
  {
    key: "lose-fat",
    label: "Perder grasa",
    description: "Más proteína y grasas moderadas como punto de partida.",
  },
  {
    key: "maintain",
    label: "Mantener peso",
    description: "Distribución equilibrada para mantenimiento.",
  },
  {
    key: "gain-muscle",
    label: "Ganar músculo",
    description: "Proteína suficiente y más espacio para carbohidratos.",
  },
  {
    key: "performance",
    label: "Rendimiento deportivo",
    description: "Carbohidratos más altos para apoyar entrenamiento.",
  },
  {
    key: "recomposition",
    label: "Recomposición corporal",
    description: "Proteína más alta con calorías controladas.",
  },
] as const;

export const DIET_PRESET_OPTIONS: DietPresetOption[] = [
  {
    key: "balanced",
    label: "Estándar / balanceada",
    description: "Punto de partida general y flexible.",
  },
  {
    key: "high-protein",
    label: "Alta en proteína",
    description: "Eleva proteína y reduce ligeramente grasas.",
  },
  {
    key: "keto",
    label: "Keto / cetogénica",
    description: "Usa carbohidratos en gramos y calcula grasas como resto.",
    isRestrictive: true,
  },
  {
    key: "low-carb",
    label: "Low carb",
    description: "Reduce carbohidratos sin modelar cetosis.",
    isRestrictive: true,
  },
  {
    key: "vegetarian",
    label: "Vegetariana",
    description: "Mantiene una distribución flexible con nota de proteína.",
  },
  {
    key: "vegan",
    label: "Vegana",
    description: "Sube un poco proteína y recuerda variar fuentes vegetales.",
  },
  {
    key: "mediterranean",
    label: "Mediterránea",
    description: "Grasas algo más altas dentro de un patrón flexible.",
  },
  {
    key: "paleo",
    label: "Paleo",
    description: "Más proteína y grasas; restringe grupos de alimentos.",
    isRestrictive: true,
  },
  {
    key: "intermittent-fasting",
    label: "Ayuno intermitente",
    description: "No cambia macros; solo modifica horarios de comidas.",
  },
] as const;

export const GOAL_DEFAULTS: Record<MacroGoal, GoalDefaults> = {
  "lose-fat": {
    proteinGramsPerKg: 1.8,
    fatPercent: 30,
    proteinPercent: 30,
    carbsPercent: 40,
    fatPercentManual: 30,
  },
  maintain: {
    proteinGramsPerKg: 1.6,
    fatPercent: 30,
    proteinPercent: 25,
    carbsPercent: 45,
    fatPercentManual: 30,
  },
  "gain-muscle": {
    proteinGramsPerKg: 1.8,
    fatPercent: 25,
    proteinPercent: 25,
    carbsPercent: 50,
    fatPercentManual: 25,
  },
  performance: {
    proteinGramsPerKg: 1.6,
    fatPercent: 25,
    proteinPercent: 20,
    carbsPercent: 55,
    fatPercentManual: 25,
  },
  recomposition: {
    proteinGramsPerKg: 2,
    fatPercent: 30,
    proteinPercent: 30,
    carbsPercent: 40,
    fatPercentManual: 30,
  },
} as const;

const calorieFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 0,
});

const gramFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 0,
});

const oneDecimalFormatter = new Intl.NumberFormat("es-MX", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function getGoalOption(goal: MacroGoal): MacroGoalOption {
  return MACRO_GOAL_OPTIONS.find((option) => option.key === goal)!;
}

export function getDietPresetOption(preset: DietPreset): DietPresetOption {
  return DIET_PRESET_OPTIONS.find((option) => option.key === preset)!;
}

export function getGoalDefaults(goal: MacroGoal): GoalDefaults {
  return GOAL_DEFAULTS[goal];
}

export function getDietPresetDefaults(
  dietPreset: DietPreset,
  goal: MacroGoal,
): DietPresetDefaults {
  const goalDefaults = getGoalDefaults(goal);

  if (dietPreset === "balanced" || dietPreset === "intermittent-fasting") {
    return { ...goalDefaults };
  }

  if (dietPreset === "high-protein") {
    return {
      ...goalDefaults,
      proteinGramsPerKg: Math.max(goalDefaults.proteinGramsPerKg, 2),
      fatPercent: Math.min(goalDefaults.fatPercent, 25),
      proteinPercent: 35,
      carbsPercent: 40,
      fatPercentManual: 25,
    };
  }

  if (dietPreset === "keto") {
    return {
      ...goalDefaults,
      proteinGramsPerKg: clamp(goalDefaults.proteinGramsPerKg, 1.4, 2),
      fatPercent: 65,
      proteinPercent: 25,
      carbsPercent: 5,
      fatPercentManual: 70,
      carbLimitGrams: 30,
    };
  }

  if (dietPreset === "low-carb") {
    return {
      ...goalDefaults,
      proteinGramsPerKg: Math.max(goalDefaults.proteinGramsPerKg, 1.6),
      fatPercent: 40,
      proteinPercent: 30,
      carbsPercent: 25,
      fatPercentManual: 45,
    };
  }

  if (dietPreset === "vegetarian") {
    return {
      ...goalDefaults,
      proteinGramsPerKg: Math.max(goalDefaults.proteinGramsPerKg, 1.6),
      proteinPercent: 25,
      carbsPercent: 50,
      fatPercentManual: 25,
    };
  }

  if (dietPreset === "vegan") {
    return {
      ...goalDefaults,
      proteinGramsPerKg: Math.max(goalDefaults.proteinGramsPerKg, 1.8),
      proteinPercent: 25,
      carbsPercent: 50,
      fatPercentManual: 25,
    };
  }

  if (dietPreset === "mediterranean") {
    return {
      ...goalDefaults,
      proteinGramsPerKg: Math.min(goalDefaults.proteinGramsPerKg, 1.6),
      fatPercent: 35,
      proteinPercent: 20,
      carbsPercent: 45,
      fatPercentManual: 35,
    };
  }

  return {
    ...goalDefaults,
    proteinGramsPerKg: Math.max(goalDefaults.proteinGramsPerKg, 1.8),
    fatPercent: 35,
    proteinPercent: 30,
    carbsPercent: 35,
    fatPercentManual: 35,
  };
}

export function calculateProteinFirstMacros(
  input: ProteinFirstInput,
): MacroResult {
  if (input.dietPreset === "keto") {
    return calculateKetoMacros(input);
  }

  const protein = buildBreakdown(
    input.weightKg * input.proteinGramsPerKg,
    "protein",
    input.calories,
  );
  const fatCalories = input.calories * (input.fatPercent / 100);
  const fat = buildBreakdown(fatCalories / KCAL_PER_GRAM.fat, "fat", input.calories);
  const carbsCalories = input.calories - protein.calories - fat.calories;
  const carbs = buildBreakdown(
    carbsCalories / KCAL_PER_GRAM.carbs,
    "carbs",
    input.calories,
  );

  return {
    protein,
    carbs,
    fat,
    totalCalories: input.calories,
    warnings: buildProteinFirstWarnings(input, carbs.grams),
  };
}

export function calculateKetoMacros(input: ProteinFirstInput): MacroResult {
  const carbLimitGrams =
    input.carbLimitGrams ?? getDietPresetDefaults("keto", input.goal).carbLimitGrams!;
  const protein = buildBreakdown(
    input.weightKg * input.proteinGramsPerKg,
    "protein",
    input.calories,
  );
  const carbs = buildBreakdown(carbLimitGrams, "carbs", input.calories);
  const fatCalories = input.calories - protein.calories - carbs.calories;
  const fat = buildBreakdown(fatCalories / KCAL_PER_GRAM.fat, "fat", input.calories);

  return {
    protein,
    carbs,
    fat,
    totalCalories: input.calories,
    warnings: buildProteinFirstWarnings(input, carbs.grams),
  };
}

export function calculatePercentageMacros(input: PercentageInput): MacroResult {
  const protein = buildBreakdown(
    (input.calories * (input.proteinPercent / 100)) / KCAL_PER_GRAM.protein,
    "protein",
    input.calories,
  );
  const carbs = buildBreakdown(
    (input.calories * (input.carbsPercent / 100)) / KCAL_PER_GRAM.carbs,
    "carbs",
    input.calories,
  );
  const fat = buildBreakdown(
    (input.calories * (input.fatPercent / 100)) / KCAL_PER_GRAM.fat,
    "fat",
    input.calories,
  );

  return {
    protein,
    carbs,
    fat,
    totalCalories: input.calories,
    warnings: buildPercentageWarnings(input, protein.grams),
  };
}

export function calculateMealDistribution({
  meals,
  result,
}: MealDistributionInput): MealDistributionRow[] {
  return Array.from({ length: meals }, (_, index) => ({
    meal: index + 1,
    calories: result.totalCalories / meals,
    proteinGrams: result.protein.grams / meals,
    carbsGrams: result.carbs.grams / meals,
    fatGrams: result.fat.grams / meals,
  }));
}

export function validateProteinFirstInput(
  input: Partial<ProteinFirstInput>,
): MacroValidationResult {
  const errors: MacroValidationResult["errors"] = {};
  const warnings: MacroWarning[] = [];

  validateCalories(input.calories, errors, warnings);
  validateWeight(input.weightKg, errors);

  if (
    input.proteinGramsPerKg === undefined ||
    input.proteinGramsPerKg === null ||
    Number.isNaN(input.proteinGramsPerKg)
  ) {
    errors.proteinGramsPerKg = "required";
  } else if (!Number.isFinite(input.proteinGramsPerKg)) {
    errors.proteinGramsPerKg = "invalid";
  } else if (input.proteinGramsPerKg < PROTEIN_G_PER_KG_RANGE.min) {
    errors.proteinGramsPerKg = "protein_range_low";
  } else if (input.proteinGramsPerKg > PROTEIN_G_PER_KG_RANGE.max) {
    errors.proteinGramsPerKg = "protein_range_high";
  } else {
    if (input.proteinGramsPerKg < PROTEIN_G_PER_KG_RANGE.warnLow) {
      warnings.push("protein_low");
    }

    if (input.proteinGramsPerKg > PROTEIN_G_PER_KG_RANGE.warnHigh) {
      warnings.push("protein_high");
    }
  }

  if (input.dietPreset === "keto") {
    validateCarbLimit(input.carbLimitGrams, errors, warnings);
  } else if (
    input.fatPercent === undefined ||
    input.fatPercent === null ||
    Number.isNaN(input.fatPercent)
  ) {
    errors.fatPercent = "required";
  } else if (
    !Number.isFinite(input.fatPercent) ||
    input.fatPercent < FAT_PERCENT_RANGE.min ||
    input.fatPercent > FAT_PERCENT_RANGE.max
  ) {
    errors.fatPercent = "fat_percent_range";
  } else if (input.fatPercent < FAT_PERCENT_RANGE.warnLow) {
    warnings.push("fat_low");
  }

  if (input.dietPreset && getDietPresetOption(input.dietPreset).isRestrictive) {
    warnings.push("restrictive_diet");
  }

  if (
    input.dietPreset === "vegan" &&
    typeof input.proteinGramsPerKg === "number" &&
    input.proteinGramsPerKg >= 2.2
  ) {
    warnings.push("vegan_high_protein");
  }

  if (Object.keys(errors).length === 0) {
    const proteinCalories =
      input.weightKg! * input.proteinGramsPerKg! * KCAL_PER_GRAM.protein;

    if (input.dietPreset === "keto") {
      const carbsCalories = input.carbLimitGrams! * KCAL_PER_GRAM.carbs;

      if (proteinCalories + carbsCalories > input.calories!) {
        errors.carbLimitGrams = "negative_fat";
      }
    } else {
      const fatCalories = input.calories! * (input.fatPercent! / 100);

      if (proteinCalories + fatCalories > input.calories!) {
        errors.fatPercent = "negative_carbs";
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings: uniqueWarnings(warnings),
  };
}

export function validatePercentageInput(
  input: Partial<PercentageInput>,
): MacroValidationResult {
  const errors: MacroValidationResult["errors"] = {};
  const warnings: MacroWarning[] = [];

  validateCalories(input.calories, errors, warnings);

  if (input.weightKg !== undefined) {
    validateWeight(input.weightKg, errors);
  }

  validatePercent(input.proteinPercent, "proteinPercent", 10, 60, errors);
  validatePercent(input.carbsPercent, "carbsPercent", 0, 70, errors);
  validatePercent(input.fatPercent, "fatPercentManual", 10, 75, errors);

  const total =
    (input.proteinPercent ?? Number.NaN) +
    (input.carbsPercent ?? Number.NaN) +
    (input.fatPercent ?? Number.NaN);

  if (
    Number.isFinite(total) &&
    Math.abs(total - 100) > PERCENTAGE_TOLERANCE
  ) {
    errors.percentageTotal = "percentage_total";
  }

  if (Object.keys(errors).length === 0) {
    if (input.fatPercent! < FAT_PERCENT_RANGE.warnLow) {
      warnings.push("fat_low");
    }

    if (input.carbsPercent! < 10 && input.dietPreset !== "keto") {
      warnings.push("carbs_low");
    }

    if (
      input.weightKg &&
      (input.calories! * (input.proteinPercent! / 100)) /
        KCAL_PER_GRAM.protein /
        input.weightKg >
        PERCENTAGE_PROTEIN_WARN_HIGH_G_PER_KG
    ) {
      warnings.push("protein_high");
    }

    if (
      input.proteinPercent! < 10 ||
      input.proteinPercent! > 35 ||
      input.carbsPercent! < 45 ||
      input.carbsPercent! > 65 ||
      input.fatPercent! < 20 ||
      input.fatPercent! > 35
    ) {
      warnings.push("percent_outside_amdr");
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings: uniqueWarnings(warnings),
  };
}

export function validateMeals(meals: number): MacroValidationResult {
  const errors: MacroValidationResult["errors"] = {};
  const warnings: MacroWarning[] = [];

  if (!Number.isFinite(meals) || !Number.isInteger(meals) || meals < 1 || meals > 7) {
    errors.meals = "meals_range";
  } else if (meals === 1) {
    warnings.push("one_meal");
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

export function convertKgToLb(kg: number): number {
  return kg / kgPerLb;
}

export function convertLbToKg(lb: number): number {
  return lb * kgPerLb;
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

  const numericValue = Number(normalized);

  if (!Number.isFinite(numericValue)) {
    return { ok: false, error: "invalid" };
  }

  return {
    ok: true,
    value: numericValue,
    normalized: String(numericValue),
  };
}

export function formatCalories(value: number): string {
  return `${calorieFormatter.format(roundTo(value, 0))} kcal`;
}

export function formatDailyCalories(value: number): string {
  return `${formatCalories(value)}/día`;
}

export function formatGrams(value: number): string {
  return `${gramFormatter.format(roundTo(value, 0))} g`;
}

export function formatMealGrams(value: number): string {
  return `${oneDecimalFormatter.format(roundTo(value, 1))} g`;
}

export function formatPercent(value: number): string {
  return `${oneDecimalFormatter.format(roundTo(value, 1))}%`;
}

export function formatWeight(value: number, unit: "kg" | "lb"): string {
  return `${oneDecimalFormatter.format(roundTo(value, 1))} ${unit}`;
}

export function buildMacroCopyText({
  inputLabel,
  result,
  meals,
}: {
  inputLabel: string[];
  result: MacroResult;
  meals: number;
}): string {
  return [
    "Calculadora de Macros - calculadoras.tools",
    ...inputLabel,
    `Proteína: ${formatGrams(result.protein.grams)}/día (${formatCalories(result.protein.calories)}, ${formatPercent(result.protein.percent)})`,
    `Carbohidratos: ${formatGrams(result.carbs.grams)}/día (${formatCalories(result.carbs.calories)}, ${formatPercent(result.carbs.percent)})`,
    `Grasas: ${formatGrams(result.fat.grams)}/día (${formatCalories(result.fat.calories)}, ${formatPercent(result.fat.percent)})`,
    `Total: ${formatDailyCalories(result.totalCalories)}`,
    `Distribución: ${meals} ${meals === 1 ? "comida" : "comidas"}`,
  ].join("\n");
}

export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function validateCalories(
  calories: number | undefined,
  errors: MacroValidationResult["errors"],
  warnings: MacroWarning[],
): void {
  if (calories === undefined || calories === null || Number.isNaN(calories)) {
    errors.calories = "required";
  } else if (!Number.isFinite(calories)) {
    errors.calories = "invalid";
  } else if (calories < CALORIE_RANGE.min || calories > CALORIE_RANGE.max) {
    errors.calories = "calories_range";
  } else if (calories < CALORIE_RANGE.warnLow) {
    warnings.push("calories_low");
  }
}

function validateWeight(
  weightKg: number | undefined,
  errors: MacroValidationResult["errors"],
): void {
  if (weightKg === undefined || weightKg === null || Number.isNaN(weightKg)) {
    errors.weightKg = "required";
  } else if (!Number.isFinite(weightKg)) {
    errors.weightKg = "invalid";
  } else if (
    weightKg < WEIGHT_KG_RANGE.min ||
    weightKg > WEIGHT_KG_RANGE.max
  ) {
    errors.weightKg = "weight_range";
  }
}

function validateCarbLimit(
  carbLimitGrams: number | undefined,
  errors: MacroValidationResult["errors"],
  warnings: MacroWarning[],
): void {
  if (
    carbLimitGrams === undefined ||
    carbLimitGrams === null ||
    Number.isNaN(carbLimitGrams)
  ) {
    errors.carbLimitGrams = "required";
  } else if (
    !Number.isFinite(carbLimitGrams) ||
    carbLimitGrams < CARB_LIMIT_RANGE.min ||
    carbLimitGrams > CARB_LIMIT_RANGE.max
  ) {
    errors.carbLimitGrams = "carb_limit_range";
  } else if (carbLimitGrams > CARB_LIMIT_RANGE.warnHighKeto) {
    warnings.push("keto_carbs_high");
  }
}

function validatePercent(
  value: number | undefined,
  field: "proteinPercent" | "carbsPercent" | "fatPercentManual",
  min: number,
  max: number,
  errors: MacroValidationResult["errors"],
): void {
  if (value === undefined || value === null || Number.isNaN(value)) {
    errors[field] = "required";
  } else if (!Number.isFinite(value) || value < min || value > max) {
    errors[field] = "percentage_range";
  }
}

function buildBreakdown(
  grams: number,
  macro: Macro,
  totalCalories: number,
): MacroBreakdown {
  const calories = grams * KCAL_PER_GRAM[macro];

  return {
    grams,
    calories,
    percent: (calories / totalCalories) * 100,
  };
}

function buildProteinFirstWarnings(
  input: ProteinFirstInput,
  carbsGrams: number,
): MacroWarning[] {
  const validation = validateProteinFirstInput(input);
  const warnings = [...validation.warnings];

  if (input.dietPreset !== "keto" && carbsGrams < 50) {
    warnings.push("carbs_low");
  }

  return uniqueWarnings(warnings);
}

function buildPercentageWarnings(
  input: PercentageInput,
  proteinGrams: number,
): MacroWarning[] {
  const validation = validatePercentageInput(input);
  const warnings = [...validation.warnings];

  if (
    input.weightKg &&
    proteinGrams / input.weightKg > PERCENTAGE_PROTEIN_WARN_HIGH_G_PER_KG
  ) {
    warnings.push("protein_high");
  }

  return uniqueWarnings(warnings);
}

function uniqueWarnings(warnings: MacroWarning[]): MacroWarning[] {
  return [...new Set(warnings)];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function removeKnownAffixes(value: string): string {
  return value
    .replace(/\b(gramos?\s*\/\s*kilos?|g\s*\/\s*kg|gkg)\b/gi, "")
    .replace(
      /\b(kilocalorias?|calorias?|kcals?|kcal|kilogramos?|kilos?|kgs?|kg|libras?|lbs?|lb)\b/gi,
      "",
    )
    .replace(/\b(gramos?|grs?|g)\b/gi, "")
    .replace(/[%\s]/g, "");
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
