import {
  convertKgToLb,
  convertLbToKg,
  parseHealthInput,
  roundTo,
} from "../calculadora-de-imc/bmi";

export type ProteinUnit = "metric" | "imperial";
export type ProteinAgeGroup = "adult" | "minor";
export type ProteinGoal = "maintain" | "lose-fat" | "gain-muscle";
export type ProteinActivity = "unstructured" | "regular" | "strength";
export type ProteinField = "weightKg" | "ageGroup" | "meals";
export type ProteinValidationError =
  | "required"
  | "out_of_range"
  | "not_adult"
  | "not_integer";
export type ProteinWarning =
  | "extreme_weight"
  | "one_meal"
  | "gain_without_strength"
  | "high_range"
  | "pregnancy_or_lactation"
  | "kidney_condition"
  | "professional_diet";

export interface ProteinRange {
  min: number;
  max: number;
}

export interface DailyProteinInput {
  weightKg: number;
  ageGroup: ProteinAgeGroup | undefined;
  goal: ProteinGoal;
  activity: ProteinActivity;
  meals: number;
  isPregnantOrLactating: boolean;
  hasKidneyCondition: boolean;
  followsProfessionalDiet: boolean;
}

export interface DailyProteinResult {
  input: DailyProteinInput;
  gramsPerKg: ProteinRange;
  exactDailyGrams: ProteinRange;
  displayedDailyGrams: ProteinRange;
  exactPracticalGrams: number;
  displayedPracticalGrams: number;
  displayedGramsPerMeal: number;
  warnings: ProteinWarning[];
  requiresIndividualGuidance: boolean;
}

export interface ProteinValidationResult {
  isValid: boolean;
  errors: Partial<Record<ProteinField, ProteinValidationError>>;
}

export const DAILY_PROTEIN_LIMITS = {
  weightKg: { min: 20, max: 250 },
  meals: { min: 1, max: 8 },
  extremeWeight: { low: 35, high: 150 },
} as const;

export const PROTEIN_RANGE_MATRIX: Record<
  ProteinGoal,
  Record<ProteinActivity, ProteinRange>
> = {
  maintain: {
    unstructured: { min: 0.8, max: 1.2 },
    regular: { min: 1.2, max: 1.6 },
    strength: { min: 1.6, max: 2 },
  },
  "lose-fat": {
    unstructured: { min: 1.2, max: 1.6 },
    regular: { min: 1.4, max: 1.8 },
    strength: { min: 1.6, max: 2.2 },
  },
  "gain-muscle": {
    unstructured: { min: 1.2, max: 1.6 },
    regular: { min: 1.4, max: 1.8 },
    strength: { min: 1.6, max: 2.2 },
  },
};

export const PROTEIN_GOAL_LABELS: Record<ProteinGoal, string> = {
  maintain: "Salud y mantenimiento",
  "lose-fat": "Perder grasa",
  "gain-muscle": "Ganar músculo",
};

export const PROTEIN_ACTIVITY_LABELS: Record<ProteinActivity, string> = {
  unstructured: "Sin entrenamiento estructurado",
  regular: "Actividad o entrenamiento regular",
  strength: "Entrenamiento de fuerza regular",
};

const numberFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 0,
});
const oneDecimalFormatter = new Intl.NumberFormat("es-MX", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export class DailyProteinCalculationError extends RangeError {
  validation: ProteinValidationResult;

  constructor(validation: ProteinValidationResult) {
    super("Revisa los datos antes de calcular.");
    this.name = "DailyProteinCalculationError";
    this.validation = validation;
  }
}

export function validateDailyProteinInput(
  input: DailyProteinInput,
): ProteinValidationResult {
  const errors: ProteinValidationResult["errors"] = {};

  if (!Number.isFinite(input.weightKg)) {
    errors.weightKg = "required";
  } else if (
    input.weightKg < DAILY_PROTEIN_LIMITS.weightKg.min ||
    input.weightKg > DAILY_PROTEIN_LIMITS.weightKg.max
  ) {
    errors.weightKg = "out_of_range";
  }

  if (!input.ageGroup) {
    errors.ageGroup = "required";
  } else if (input.ageGroup === "minor") {
    errors.ageGroup = "not_adult";
  }

  if (!Number.isFinite(input.meals)) {
    errors.meals = "required";
  } else if (!Number.isInteger(input.meals)) {
    errors.meals = "not_integer";
  } else if (
    input.meals < DAILY_PROTEIN_LIMITS.meals.min ||
    input.meals > DAILY_PROTEIN_LIMITS.meals.max
  ) {
    errors.meals = "out_of_range";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function calculateDailyProteinResult(
  input: DailyProteinInput,
): DailyProteinResult {
  const validation = validateDailyProteinInput(input);

  if (!validation.isValid) {
    throw new DailyProteinCalculationError(validation);
  }

  const gramsPerKg = PROTEIN_RANGE_MATRIX[input.goal][input.activity];
  const exactDailyGrams = {
    min: input.weightKg * gramsPerKg.min,
    max: input.weightKg * gramsPerKg.max,
  };
  const displayedDailyGrams = {
    min: roundToIncrement(exactDailyGrams.min, 5),
    max: roundToIncrement(exactDailyGrams.max, 5),
  };
  const exactPracticalGrams =
    (exactDailyGrams.min + exactDailyGrams.max) / 2;
  const displayedPracticalGrams = clamp(
    roundToIncrement(exactPracticalGrams, 5),
    displayedDailyGrams.min,
    displayedDailyGrams.max,
  );
  const warnings: ProteinWarning[] = [];

  if (
    input.weightKg <= DAILY_PROTEIN_LIMITS.extremeWeight.low ||
    input.weightKg >= DAILY_PROTEIN_LIMITS.extremeWeight.high
  ) {
    warnings.push("extreme_weight");
  }

  if (input.meals === 1) {
    warnings.push("one_meal");
  }

  if (input.goal === "gain-muscle" && input.activity !== "strength") {
    warnings.push("gain_without_strength");
  }

  if (gramsPerKg.max > 2) {
    warnings.push("high_range");
  }

  if (input.isPregnantOrLactating) {
    warnings.push("pregnancy_or_lactation");
  }

  if (input.hasKidneyCondition) {
    warnings.push("kidney_condition");
  }

  if (input.followsProfessionalDiet) {
    warnings.push("professional_diet");
  }

  return {
    input: { ...input },
    gramsPerKg: { ...gramsPerKg },
    exactDailyGrams,
    displayedDailyGrams,
    exactPracticalGrams,
    displayedPracticalGrams,
    displayedGramsPerMeal: roundToIncrement(
      exactPracticalGrams / input.meals,
      5,
    ),
    warnings,
    requiresIndividualGuidance:
      input.isPregnantOrLactating ||
      input.hasKidneyCondition ||
      input.followsProfessionalDiet,
  };
}

export function formatProteinRange(range: ProteinRange): string {
  return `${numberFormatter.format(range.min)}-${numberFormatter.format(range.max)} g`;
}

export function formatProteinPerKg(range: ProteinRange): string {
  return `${oneDecimalFormatter.format(range.min)}-${oneDecimalFormatter.format(range.max)} g/kg`;
}

export function formatProteinWeight(
  weightKg: number,
  unit: ProteinUnit,
): string {
  const value = unit === "metric" ? weightKg : convertKgToLb(weightKg);
  return `${oneDecimalFormatter.format(roundTo(value, 1))} ${unit === "metric" ? "kg" : "lb"}`;
}

export function buildDailyProteinCopyText(
  result: DailyProteinResult,
  unit: ProteinUnit,
): string {
  const lines = [
    "Calculadora de proteína diaria - calculadoras.tools",
    `Peso: ${formatProteinWeight(result.input.weightKg, unit)}`,
    `Objetivo: ${PROTEIN_GOAL_LABELS[result.input.goal]}`,
    `Actividad: ${PROTEIN_ACTIVITY_LABELS[result.input.activity]}`,
    `Rango orientativo: ${formatProteinRange(result.displayedDailyGrams)}/día`,
    `Referencia usada: ${formatProteinPerKg(result.gramsPerKg)}`,
  ];

  if (result.requiresIndividualGuidance) {
    lines.push(
      "Este rango es información educativa. Prioriza orientación profesional individual.",
    );
  } else {
    lines.push(
      `Punto de partida práctico: ${numberFormatter.format(result.displayedPracticalGrams)} g/día`,
      `Con ${result.input.meals} ${result.input.meals === 1 ? "comida" : "comidas"}: aproximadamente ${numberFormatter.format(result.displayedGramsPerMeal)} g por comida`,
    );
  }

  lines.push(
    "Referencia educativa, no una prescripción ni una garantía de resultados.",
  );

  return lines.join("\n");
}

export { convertKgToLb, convertLbToKg, parseHealthInput, roundTo };

function roundToIncrement(value: number, increment: number): number {
  return Math.round(value / increment) * increment;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
