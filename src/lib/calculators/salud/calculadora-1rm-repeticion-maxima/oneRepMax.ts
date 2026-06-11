export type WeightUnit = "kg" | "lb";
export type RirValue = 0 | 1 | 2 | "3+" | "unknown";
export type EstimateQuality = "lifted" | "better" | "orientation" | "low";
export type OneRepMaxFormula = "epley" | "brzycki";
export type OneRepMaxWarning =
  | "high_repetitions"
  | "unknown_rir"
  | "far_from_failure"
  | "formulas_diverge";

export interface OneRepMaxInput {
  weight: number;
  unit: WeightUnit;
  repetitions: number;
  rir: RirValue;
  increment: number;
  primaryFormula: OneRepMaxFormula;
}

export interface PracticalLoad {
  exact: number;
  nearest: number;
  lower: number;
  nearestRoundsUp: boolean;
}

export interface PercentageLoad extends PracticalLoad {
  percentage: number;
}

export interface FormulaEstimate {
  epley: number;
  brzycki: number;
  primary: number;
  min: number;
  max: number;
  differencePercent: number;
}

export interface OneRepMaxResult {
  input: OneRepMaxInput;
  effectiveRepetitions: number;
  estimate: FormulaEstimate;
  quality: EstimateQuality;
  warnings: OneRepMaxWarning[];
  percentageLoads: PercentageLoad[];
}

export interface PlannerSelection {
  mode: "repetitions" | "percentage";
  target: number;
  load: PracticalLoad;
}

export type OneRepMaxField =
  | "weight"
  | "repetitions"
  | "rir"
  | "increment"
  | "primaryFormula";

export type OneRepMaxValidationError =
  | "required"
  | "invalid"
  | "not_integer"
  | "out_of_range";

export interface OneRepMaxValidationResult {
  isValid: boolean;
  errors: Partial<Record<OneRepMaxField, OneRepMaxValidationError>>;
}

export const KG_TO_LB = 2.2046226218;
export const ONE_REP_MAX_PERCENTAGES = [50, 60, 70, 75, 80, 85, 90, 95];
export const ONE_REP_MAX_LIMITS = {
  weightKg: { min: 0.5, max: 2000 },
  repetitions: { min: 1, max: 15 },
  targetRepetitions: { min: 1, max: 15 },
  targetPercentage: { min: 40, max: 100 },
  incrementKg: { min: 0.1, max: 100 },
} as const;

export const QUALITY_LABELS: Record<EstimateQuality, string> = {
  lifted: "1RM levantado",
  better: "Mejor base de estimación",
  orientation: "Estimación orientativa",
  low: "Menor precisión",
};

export const FORMULA_LABELS: Record<OneRepMaxFormula, string> = {
  epley: "Epley",
  brzycki: "Brzycki",
};

export class OneRepMaxCalculationError extends RangeError {
  validation: OneRepMaxValidationResult;

  constructor(validation: OneRepMaxValidationResult) {
    super("Revisa los datos antes de calcular.");
    this.name = "OneRepMaxCalculationError";
    this.validation = validation;
  }
}

export function parseWeightInput(rawValue: string): number | undefined {
  const normalized = rawValue.trim().replace(",", ".");

  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) {
    return undefined;
  }

  const value = Number(normalized);
  return Number.isFinite(value) ? value : undefined;
}

export function convertWeight(
  value: number,
  fromUnit: WeightUnit,
  toUnit: WeightUnit,
): number {
  if (fromUnit === toUnit) {
    return value;
  }

  return fromUnit === "kg" ? value * KG_TO_LB : value / KG_TO_LB;
}

export function validateOneRepMaxInput(
  input: OneRepMaxInput,
): OneRepMaxValidationResult {
  const errors: OneRepMaxValidationResult["errors"] = {};
  const weightKg = convertWeight(input.weight, input.unit, "kg");
  const incrementKg = convertWeight(input.increment, input.unit, "kg");

  if (!Number.isFinite(input.weight)) {
    errors.weight = "required";
  } else if (
    weightKg < ONE_REP_MAX_LIMITS.weightKg.min ||
    weightKg > ONE_REP_MAX_LIMITS.weightKg.max
  ) {
    errors.weight = "out_of_range";
  }

  if (!Number.isFinite(input.repetitions)) {
    errors.repetitions = "required";
  } else if (!Number.isInteger(input.repetitions)) {
    errors.repetitions = "not_integer";
  } else if (
    input.repetitions < ONE_REP_MAX_LIMITS.repetitions.min ||
    input.repetitions > ONE_REP_MAX_LIMITS.repetitions.max
  ) {
    errors.repetitions = "out_of_range";
  }

  if (![0, 1, 2, "3+", "unknown"].includes(input.rir)) {
    errors.rir = "invalid";
  }

  if (!Number.isFinite(input.increment)) {
    errors.increment = "required";
  } else if (
    incrementKg < ONE_REP_MAX_LIMITS.incrementKg.min ||
    incrementKg > ONE_REP_MAX_LIMITS.incrementKg.max
  ) {
    errors.increment = "out_of_range";
  }

  if (!["epley", "brzycki"].includes(input.primaryFormula)) {
    errors.primaryFormula = "invalid";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function calculateEffectiveRepetitions(
  repetitions: number,
  rir: RirValue,
): number {
  return typeof rir === "number" ? repetitions + rir : repetitions;
}

export function calculateEpleyOneRepMax(
  weight: number,
  effectiveRepetitions: number,
): number {
  assertFormulaInput(weight, effectiveRepetitions);
  return effectiveRepetitions === 1
    ? weight
    : weight * (1 + effectiveRepetitions / 30);
}

export function calculateBrzyckiOneRepMax(
  weight: number,
  effectiveRepetitions: number,
): number {
  assertFormulaInput(weight, effectiveRepetitions);

  if (effectiveRepetitions >= 37) {
    throw new RangeError("Brzycki requiere menos de 37 repeticiones.");
  }

  return effectiveRepetitions === 1
    ? weight
    : weight * (36 / (37 - effectiveRepetitions));
}

export function calculateOneRepMaxResult(
  input: OneRepMaxInput,
): OneRepMaxResult {
  const validation = validateOneRepMaxInput(input);

  if (!validation.isValid) {
    throw new OneRepMaxCalculationError(validation);
  }

  const effectiveRepetitions = calculateEffectiveRepetitions(
    input.repetitions,
    input.rir,
  );
  const epley = calculateEpleyOneRepMax(input.weight, effectiveRepetitions);
  const brzycki = calculateBrzyckiOneRepMax(
    input.weight,
    effectiveRepetitions,
  );
  const primary = input.primaryFormula === "epley" ? epley : brzycki;
  const min = Math.min(epley, brzycki);
  const max = Math.max(epley, brzycki);
  const differencePercent = ((max - min) / primary) * 100;
  const estimate = { epley, brzycki, primary, min, max, differencePercent };
  const quality = getEstimateQuality(input, effectiveRepetitions);
  const warnings = buildWarnings(input, effectiveRepetitions, differencePercent);

  return {
    input: { ...input },
    effectiveRepetitions,
    estimate,
    quality,
    warnings,
    percentageLoads: ONE_REP_MAX_PERCENTAGES.map((percentage) => ({
      percentage,
      ...calculatePercentageLoad(primary, percentage, input.increment),
    })),
  };
}

export function getEstimateQuality(
  input: Pick<OneRepMaxInput, "repetitions" | "rir">,
  effectiveRepetitions = calculateEffectiveRepetitions(
    input.repetitions,
    input.rir,
  ),
): EstimateQuality {
  if (input.repetitions === 1 && input.rir === 0) {
    return "lifted";
  }

  if (
    input.rir === "3+" ||
    input.rir === "unknown" ||
    effectiveRepetitions > 10
  ) {
    return "low";
  }

  if (input.rir === 2 || effectiveRepetitions >= 6) {
    return "orientation";
  }

  return "better";
}

export function calculatePercentageLoad(
  oneRepMax: number,
  percentage: number,
  increment: number,
): PracticalLoad {
  assertPositive(oneRepMax, "El 1RM debe ser mayor que cero.");

  if (
    !Number.isFinite(percentage) ||
    percentage < ONE_REP_MAX_LIMITS.targetPercentage.min ||
    percentage > ONE_REP_MAX_LIMITS.targetPercentage.max
  ) {
    throw new RangeError("El porcentaje debe estar entre 40 y 100.");
  }

  return roundToAvailableIncrement(oneRepMax * (percentage / 100), increment);
}

export function calculateTargetRepetitionLoad(
  oneRepMax: number,
  repetitions: number,
  formula: OneRepMaxFormula,
  increment: number,
): PracticalLoad {
  assertPositive(oneRepMax, "El 1RM debe ser mayor que cero.");

  if (
    !Number.isInteger(repetitions) ||
    repetitions < ONE_REP_MAX_LIMITS.targetRepetitions.min ||
    repetitions > ONE_REP_MAX_LIMITS.targetRepetitions.max
  ) {
    throw new RangeError("Las repeticiones objetivo deben estar entre 1 y 15.");
  }

  const exact =
    repetitions === 1
      ? oneRepMax
      : formula === "epley"
        ? oneRepMax / (1 + repetitions / 30)
        : oneRepMax * ((37 - repetitions) / 36);

  return roundToAvailableIncrement(exact, increment);
}

export function roundToAvailableIncrement(
  value: number,
  increment: number,
): PracticalLoad {
  assertPositive(value, "La carga debe ser mayor que cero.");
  assertPositive(increment, "El incremento debe ser mayor que cero.");

  const nearest = cleanFloatingPoint(Math.round(value / increment) * increment);
  const lower = cleanFloatingPoint(Math.floor(value / increment) * increment);

  return {
    exact: value,
    nearest,
    lower,
    nearestRoundsUp: nearest > value + 1e-9,
  };
}

export function formatWeight(value: number, unit: WeightUnit): string {
  return `${new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 1,
  }).format(value)} ${unit}`;
}

export function buildOneRepMaxCopyText(
  result: OneRepMaxResult,
  planner?: PlannerSelection,
): string {
  const rirLabel =
    result.input.rir === "unknown" ? "No lo sé" : String(result.input.rir);
  const lines = [
    "Calculadora 1RM - calculadoras.tools",
    `Serie: ${formatWeight(result.input.weight, result.input.unit)} x ${result.input.repetitions} repeticiones`,
    `RIR: ${rirLabel}`,
    `Repeticiones efectivas: ${result.effectiveRepetitions}`,
    `Fórmula principal: ${FORMULA_LABELS[result.input.primaryFormula]}`,
    `1RM principal: ${formatWeight(result.estimate.primary, result.input.unit)}`,
    `Epley: ${formatWeight(result.estimate.epley, result.input.unit)}`,
    `Brzycki: ${formatWeight(result.estimate.brzycki, result.input.unit)}`,
    `Rango entre fórmulas: ${formatWeight(result.estimate.min, result.input.unit)}-${formatWeight(result.estimate.max, result.input.unit)}`,
    `Calidad contextual: ${QUALITY_LABELS[result.quality]}`,
    `Incremento disponible: ${formatWeight(result.input.increment, result.input.unit)}`,
  ];

  if (planner) {
    const target =
      planner.mode === "repetitions"
        ? `${planner.target} repeticiones`
        : `${planner.target}% del 1RM`;
    lines.push(
      `Próxima carga para ${target}: ${formatWeight(planner.load.nearest, result.input.unit)} práctica (${formatWeight(planner.load.exact, result.input.unit)} matemática)`,
    );
  }

  lines.push(
    "Estimación orientativa: la carga no garantiza completar un número concreto de repeticiones.",
  );

  return lines.join("\n");
}

function buildWarnings(
  input: OneRepMaxInput,
  effectiveRepetitions: number,
  differencePercent: number,
): OneRepMaxWarning[] {
  const warnings: OneRepMaxWarning[] = [];

  if (effectiveRepetitions > 10) warnings.push("high_repetitions");
  if (input.rir === "unknown") warnings.push("unknown_rir");
  if (input.rir === "3+") warnings.push("far_from_failure");
  if (differencePercent >= 5) warnings.push("formulas_diverge");

  return warnings;
}

function assertFormulaInput(weight: number, repetitions: number): void {
  assertPositive(weight, "El peso debe ser mayor que cero.");

  if (!Number.isInteger(repetitions) || repetitions < 1) {
    throw new RangeError("Las repeticiones deben ser un entero positivo.");
  }
}

function assertPositive(value: number, message: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(message);
  }
}

function cleanFloatingPoint(value: number): number {
  return Number(value.toFixed(10));
}
