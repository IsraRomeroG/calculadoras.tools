import {
  convertKgToLb,
  convertLbToKg,
  parseHealthInput,
  roundTo,
} from "../calculadora-de-imc/bmi";

export const DAILY_WATER_LIMITS = {
  weightKg: { min: 30, max: 250 },
  exerciseMinutes: { min: 1, max: 300 },
  containerMl: { min: 100, max: 2000 },
  reviewTotalMl: 6000,
} as const;

export const SWEAT_RATES_ML_PER_HOUR = {
  low: { low: 200, high: 400 },
  moderate: { low: 400, high: 700 },
  high: { low: 700, high: 1000 },
} as const;

export const DAILY_PLAN = [
  { key: "morning", label: "Mañana", percentage: 0.3 },
  { key: "midday", label: "Mediodía y comida", percentage: 0.3 },
  { key: "afternoon", label: "Tarde", percentage: 0.25 },
  { key: "evening", label: "Noche", percentage: 0.15 },
] as const;

export type DailyWaterUnit = "metric" | "imperial";
export type SweatLevel = keyof typeof SWEAT_RATES_ML_PER_HOUR;
export type DailyWaterField =
  | "adultConfirmed"
  | "weightKg"
  | "exerciseToday"
  | "exerciseMinutes"
  | "sweatLevel"
  | "heatExposure"
  | "containerMl";
export type DailyWaterValidationError = "required" | "out_of_range";
export type DailyWaterBlocker =
  | "not_adult"
  | "fluid_restriction"
  | "kidney_or_heart_condition";
export type DailyWaterWarning =
  | "pregnancy"
  | "lactation"
  | "high_variability"
  | "review_high_total";

export interface DailyWaterInput {
  adultConfirmed: boolean;
  hasFluidRestriction: boolean;
  hasKidneyOrHeartCondition: boolean;
  isPregnant: boolean;
  isLactating: boolean;
  weightKg: number;
  exerciseToday: boolean | undefined;
  exerciseMinutes?: number;
  sweatLevel?: SweatLevel;
  heatExposure: boolean | undefined;
  containerMl: number;
}

export interface DailyWaterRange {
  lowMl: number;
  highMl: number;
}

export interface DailyWaterPlanItem {
  key: (typeof DAILY_PLAN)[number]["key"];
  label: string;
  percentage: number;
  amountMl: number;
}

export interface DailyWaterResult {
  input: DailyWaterInput;
  base: DailyWaterRange;
  exerciseAdjustment: DailyWaterRange;
  heatAdjustment: DailyWaterRange;
  total: DailyWaterRange;
  midpointMl: number;
  containerRange: { low: number; high: number };
  plan: DailyWaterPlanItem[];
  warnings: DailyWaterWarning[];
  requiresReview: boolean;
}

export interface DailyWaterValidationResult {
  isValid: boolean;
  errors: Partial<Record<DailyWaterField, DailyWaterValidationError>>;
  blockers: DailyWaterBlocker[];
}

const literFormatter = new Intl.NumberFormat("es-MX", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const integerFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 0,
});
const oneDecimalFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 1,
});

export class DailyWaterCalculationError extends RangeError {
  validation: DailyWaterValidationResult;

  constructor(validation: DailyWaterValidationResult) {
    super("Revisa los datos antes de calcular.");
    this.name = "DailyWaterCalculationError";
    this.validation = validation;
  }
}

export function validateDailyWaterInput(
  input: DailyWaterInput,
): DailyWaterValidationResult {
  const errors: DailyWaterValidationResult["errors"] = {};
  const blockers: DailyWaterBlocker[] = [];

  if (!input.adultConfirmed) {
    errors.adultConfirmed = "required";
    blockers.push("not_adult");
  }

  validateRange(input.weightKg, "weightKg", errors);

  if (input.exerciseToday === undefined) {
    errors.exerciseToday = "required";
  } else if (input.exerciseToday) {
    validateRange(input.exerciseMinutes, "exerciseMinutes", errors);

    if (!input.sweatLevel || !(input.sweatLevel in SWEAT_RATES_ML_PER_HOUR)) {
      errors.sweatLevel = "required";
    }
  }

  if (input.heatExposure === undefined) {
    errors.heatExposure = "required";
  }

  validateRange(input.containerMl, "containerMl", errors);

  if (input.hasFluidRestriction) {
    blockers.push("fluid_restriction");
  }

  if (input.hasKidneyOrHeartCondition) {
    blockers.push("kidney_or_heart_condition");
  }

  return {
    isValid: Object.keys(errors).length === 0 && blockers.length === 0,
    errors,
    blockers: [...new Set(blockers)],
  };
}

export function calculateDailyWaterResult(
  input: DailyWaterInput,
): DailyWaterResult {
  const validation = validateDailyWaterInput(input);

  if (!validation.isValid) {
    throw new DailyWaterCalculationError(validation);
  }

  const base = {
    lowMl: input.weightKg * 30,
    highMl: input.weightKg * 35,
  };
  const exerciseAdjustment = calculateExerciseAdjustment(input);
  const heatAdjustment = calculateHeatAdjustment(input);
  const total = {
    lowMl: base.lowMl + exerciseAdjustment.lowMl + heatAdjustment.lowMl,
    highMl: base.highMl + exerciseAdjustment.highMl + heatAdjustment.highMl,
  };
  const midpointMl = (total.lowMl + total.highMl) / 2;
  const contextualHighMl =
    exerciseAdjustment.highMl + heatAdjustment.highMl;
  const requiresReview = total.highMl > DAILY_WATER_LIMITS.reviewTotalMl;
  const warnings: DailyWaterWarning[] = [];

  if (input.isPregnant) {
    warnings.push("pregnancy");
  }

  if (input.isLactating) {
    warnings.push("lactation");
  }

  if (contextualHighMl > base.lowMl) {
    warnings.push("high_variability");
  }

  if (requiresReview) {
    warnings.push("review_high_total");
  }

  return {
    input: { ...input },
    base,
    exerciseAdjustment,
    heatAdjustment,
    total,
    midpointMl,
    containerRange: {
      low: total.lowMl / input.containerMl,
      high: total.highMl / input.containerMl,
    },
    plan: DAILY_PLAN.map((item) => ({
      ...item,
      amountMl: midpointMl * item.percentage,
    })),
    warnings,
    requiresReview,
  };
}

export function formatDailyWaterRange(range: DailyWaterRange): string {
  return `${formatLiters(range.lowMl)} a ${formatLiters(range.highMl)}`;
}

export function formatDailyWaterMlRange(range: DailyWaterRange): string {
  return `${formatMl(range.lowMl)} a ${formatMl(range.highMl)}`;
}

export function formatContainerRange(
  range: DailyWaterResult["containerRange"],
): string {
  return `${oneDecimalFormatter.format(roundTo(range.low, 1))} a ${oneDecimalFormatter.format(roundTo(range.high, 1))}`;
}

export function formatMl(value: number): string {
  return `${integerFormatter.format(roundToIncrement(value, 50))} ml`;
}

export function formatLiters(valueMl: number): string {
  return `${literFormatter.format(roundTo(valueMl / 1000, 1))} L`;
}

export function formatWeight(
  weightKg: number,
  unit: DailyWaterUnit,
): string {
  const value = unit === "metric" ? weightKg : convertKgToLb(weightKg);
  return `${oneDecimalFormatter.format(roundTo(value, 1))} ${unit === "metric" ? "kg" : "lb"}`;
}

export function buildDailyWaterCopyText(
  result: DailyWaterResult,
  unit: DailyWaterUnit,
): string {
  const lines = [
    "Calculadora de agua diaria - calculadoras.tools",
    `Peso: ${formatWeight(result.input.weightKg, unit)}`,
    `Rango orientativo de líquidos para beber: ${formatDailyWaterRange(result.total)} (${formatDailyWaterMlRange(result.total)})`,
    `Equivalencia aproximada: ${formatContainerRange(result.containerRange)} recipientes de ${formatMl(result.input.containerMl)}`,
    `Base estimada: ${formatDailyWaterRange(result.base)}`,
  ];

  if (result.input.exerciseToday) {
    lines.push(
      `Ajuste por ejercicio: ${formatDailyWaterRange(result.exerciseAdjustment)} para ${result.input.exerciseMinutes} min y sudoración ${getSweatLevelLabel(result.input.sweatLevel as SweatLevel).toLowerCase()}`,
    );
  }

  if (result.input.heatExposure) {
    lines.push(
      `Ajuste por calor: ${formatDailyWaterRange(result.heatAdjustment)}`,
    );
  }

  lines.push(
    "Referencia educativa, no una necesidad exacta ni una prescripción médica.",
    "Otras bebidas y alimentos también aportan agua; no necesitas forzar el extremo alto.",
  );

  return lines.join("\n");
}

export function getSweatLevelLabel(level: SweatLevel): string {
  return {
    low: "Poca",
    moderate: "Moderada",
    high: "Mucha",
  }[level];
}

export {
  convertKgToLb,
  convertLbToKg,
  parseHealthInput,
  roundTo,
};

function calculateExerciseAdjustment(
  input: DailyWaterInput,
): DailyWaterRange {
  if (!input.exerciseToday) {
    return { lowMl: 0, highMl: 0 };
  }

  const hours = (input.exerciseMinutes as number) / 60;
  const rates = SWEAT_RATES_ML_PER_HOUR[input.sweatLevel as SweatLevel];

  return {
    lowMl: hours * rates.low,
    highMl: hours * rates.high,
  };
}

function calculateHeatAdjustment(input: DailyWaterInput): DailyWaterRange {
  if (!input.heatExposure) {
    return { lowMl: 0, highMl: 0 };
  }

  return input.exerciseToday
    ? { lowMl: 0, highMl: 250 }
    : { lowMl: 250, highMl: 500 };
}

function validateRange(
  value: number | undefined,
  field: "weightKg" | "exerciseMinutes" | "containerMl",
  errors: DailyWaterValidationResult["errors"],
): void {
  if (value === undefined || !Number.isFinite(value)) {
    errors[field] = "required";
    return;
  }

  const limits = DAILY_WATER_LIMITS[field];

  if (value < limits.min || value > limits.max) {
    errors[field] = "out_of_range";
  }
}

function roundToIncrement(value: number, increment: number): number {
  return Math.round(value / increment) * increment;
}
