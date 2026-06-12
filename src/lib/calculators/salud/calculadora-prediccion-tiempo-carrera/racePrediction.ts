export type DistanceUnit = "km" | "mi";
export type ReferenceRecency = "recent" | "one_to_three_months" | "older" | "unknown";
export type ReferenceEffort = "race" | "controlled" | "unknown";
export type ComparableConditions = "yes" | "no" | "unknown";
export type ReferenceQuality = "good" | "acceptable" | "high_uncertainty";
export type RacePredictionField = "referenceDistance" | "referenceTime" | "targetDistance";
export type RacePredictionValidationError = "required" | "invalid" | "out_of_range";
export type RacePredictionWarning =
  | "wide_distance_ratio"
  | "old_reference"
  | "controlled_effort"
  | "different_conditions"
  | "marathon_from_short_reference";

export interface RacePredictionInput {
  referenceDistance: number;
  referenceUnit: DistanceUnit;
  referenceTimeSeconds: number;
  targetDistance: number;
  targetUnit: DistanceUnit;
  recency: ReferenceRecency;
  effort: ReferenceEffort;
  comparableConditions: ComparableConditions;
}

export interface PopularDistance {
  id: "1k" | "1mi" | "5k" | "10k" | "15k" | "half" | "marathon";
  label: string;
  distanceKm: number;
}

export interface PredictionScenario {
  id: "better_retention" | "central" | "greater_fatigue";
  label: string;
  exponent: number;
  timeSeconds: number;
}

export interface PopularPrediction extends PopularDistance {
  timeSeconds: number;
  paceSecondsPerKm: number;
  paceSecondsPerMi: number;
  isTarget: boolean;
}

export interface RacePredictionResult {
  input: RacePredictionInput;
  referenceDistanceKm: number;
  targetDistanceKm: number;
  distanceRatio: number;
  referencePaceSecondsPerKm: number;
  targetTimeSeconds: number;
  targetPaceSecondsPerKm: number;
  targetPaceSecondsPerMi: number;
  paceChangeSecondsPerKm: number;
  targetSpeedKmh: number;
  scenarios: PredictionScenario[];
  popularPredictions: PopularPrediction[];
  quality: ReferenceQuality;
  qualityReasons: string[];
  warnings: RacePredictionWarning[];
}

export interface RacePredictionValidationResult {
  isValid: boolean;
  errors: Partial<Record<RacePredictionField, RacePredictionValidationError>>;
}

export const KM_PER_MILE = 1.609344;
export const CENTRAL_RIEGEL_EXPONENT = 1.06;
export const RACE_PREDICTION_LIMITS = {
  maxDistanceKm: 500,
  maxPredictedTimeSeconds: 10_000 * 3600,
} as const;

export const POPULAR_DISTANCES: PopularDistance[] = [
  { id: "1k", label: "1K", distanceKm: 1 },
  { id: "1mi", label: "1 milla", distanceKm: KM_PER_MILE },
  { id: "5k", label: "5K", distanceKm: 5 },
  { id: "10k", label: "10K", distanceKm: 10 },
  { id: "15k", label: "15K", distanceKm: 15 },
  { id: "half", label: "Medio maratón", distanceKm: 21.0975 },
  { id: "marathon", label: "Maratón", distanceKm: 42.195 },
];

const SCENARIOS = [
  { id: "better_retention", label: "Mejor conservación", exponent: 1.03 },
  { id: "central", label: "Predicción central", exponent: CENTRAL_RIEGEL_EXPONENT },
  { id: "greater_fatigue", label: "Mayor fatiga", exponent: 1.09 },
] as const;

export class RacePredictionCalculationError extends RangeError {
  validation: RacePredictionValidationResult;

  constructor(validation: RacePredictionValidationResult) {
    super("Revisa los datos antes de calcular.");
    this.name = "RacePredictionCalculationError";
    this.validation = validation;
  }
}

export function parseLocalizedNumber(rawValue: string): number | undefined {
  const normalized = rawValue.trim().replace(",", ".");
  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) return undefined;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : undefined;
}

export function combineTimeParts(
  hours: number,
  minutes: number,
  seconds: number,
): number | undefined {
  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    !Number.isInteger(seconds) ||
    hours < 0 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59
  ) {
    return undefined;
  }

  return hours * 3600 + minutes * 60 + seconds;
}

export function convertDistance(
  value: number,
  fromUnit: DistanceUnit,
  toUnit: DistanceUnit,
): number {
  assertPositive(value, "La distancia debe ser mayor que cero.");
  if (fromUnit === toUnit) return value;
  return fromUnit === "km" ? value / KM_PER_MILE : value * KM_PER_MILE;
}

export function validateRacePredictionInput(
  input: RacePredictionInput,
): RacePredictionValidationResult {
  const errors: RacePredictionValidationResult["errors"] = {};
  validateDistance(input.referenceDistance, input.referenceUnit, "referenceDistance", errors);
  validateDistance(input.targetDistance, input.targetUnit, "targetDistance", errors);

  if (!Number.isFinite(input.referenceTimeSeconds)) {
    errors.referenceTime = "required";
  } else if (input.referenceTimeSeconds <= 0) {
    errors.referenceTime = "out_of_range";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function calculateRacePrediction(
  input: RacePredictionInput,
): RacePredictionResult {
  const validation = validateRacePredictionInput(input);
  if (!validation.isValid) throw new RacePredictionCalculationError(validation);

  const referenceDistanceKm = toKm(input.referenceDistance, input.referenceUnit);
  const targetDistanceKm = toKm(input.targetDistance, input.targetUnit);
  const distanceRatio = targetDistanceKm / referenceDistanceKm;
  const referencePaceSecondsPerKm = input.referenceTimeSeconds / referenceDistanceKm;
  const targetTimeSeconds = predictTime(
    input.referenceTimeSeconds,
    referenceDistanceKm,
    targetDistanceKm,
    CENTRAL_RIEGEL_EXPONENT,
  );

  if (
    !Number.isFinite(targetTimeSeconds) ||
    targetTimeSeconds > RACE_PREDICTION_LIMITS.maxPredictedTimeSeconds
  ) {
    throw new RacePredictionCalculationError({
      isValid: false,
      errors: { targetDistance: "out_of_range" },
    });
  }

  const targetPaceSecondsPerKm = targetTimeSeconds / targetDistanceKm;
  const targetPaceSecondsPerMi = targetPaceSecondsPerKm * KM_PER_MILE;
  const warnings = getWarnings(input, referenceDistanceKm, targetDistanceKm, distanceRatio);
  const { quality, reasons } = evaluateReferenceQuality(input, distanceRatio);

  return {
    input: { ...input },
    referenceDistanceKm,
    targetDistanceKm,
    distanceRatio,
    referencePaceSecondsPerKm,
    targetTimeSeconds,
    targetPaceSecondsPerKm,
    targetPaceSecondsPerMi,
    paceChangeSecondsPerKm: targetPaceSecondsPerKm - referencePaceSecondsPerKm,
    targetSpeedKmh: targetDistanceKm / (targetTimeSeconds / 3600),
    scenarios: SCENARIOS.map((scenario) => ({
      ...scenario,
      timeSeconds: predictTime(
        input.referenceTimeSeconds,
        referenceDistanceKm,
        targetDistanceKm,
        scenario.exponent,
      ),
    })),
    popularPredictions: POPULAR_DISTANCES.filter(
      (distance) => !nearlyEqual(distance.distanceKm, referenceDistanceKm),
    ).map((distance) => {
      const timeSeconds = predictTime(
        input.referenceTimeSeconds,
        referenceDistanceKm,
        distance.distanceKm,
        CENTRAL_RIEGEL_EXPONENT,
      );
      const paceSecondsPerKm = timeSeconds / distance.distanceKm;
      return {
        ...distance,
        timeSeconds,
        paceSecondsPerKm,
        paceSecondsPerMi: paceSecondsPerKm * KM_PER_MILE,
        isTarget: nearlyEqual(distance.distanceKm, targetDistanceKm),
      };
    }),
    quality,
    qualityReasons: reasons,
    warnings,
  };
}

export function predictTime(
  referenceTimeSeconds: number,
  referenceDistanceKm: number,
  targetDistanceKm: number,
  exponent = CENTRAL_RIEGEL_EXPONENT,
): number {
  assertPositive(referenceTimeSeconds, "El tiempo debe ser mayor que cero.");
  assertPositive(referenceDistanceKm, "La distancia de referencia debe ser mayor que cero.");
  assertPositive(targetDistanceKm, "La distancia objetivo debe ser mayor que cero.");
  assertPositive(exponent, "El exponente debe ser mayor que cero.");
  return referenceTimeSeconds * Math.pow(targetDistanceKm / referenceDistanceKm, exponent);
}

export function evaluateReferenceQuality(
  input: RacePredictionInput,
  distanceRatio: number,
): { quality: ReferenceQuality; reasons: string[] } {
  const reasons: string[] = [];
  const highUncertainty =
    distanceRatio < 0.25 ||
    distanceRatio > 4 ||
    input.recency === "older" ||
    input.effort === "controlled" ||
    input.comparableConditions === "no";

  if (distanceRatio < 0.25 || distanceRatio > 4) {
    reasons.push("Las distancias están muy separadas.");
  } else if (distanceRatio < 0.5 || distanceRatio > 2) {
    reasons.push("La diferencia entre distancias añade incertidumbre.");
  }
  if (input.recency === "older") reasons.push("La marca tiene más de tres meses.");
  if (input.effort === "controlled") reasons.push("La marca proviene de un entrenamiento controlado.");
  if (input.comparableConditions === "no") reasons.push("Las condiciones no son comparables.");

  const hasUnknownContext =
    input.recency === "unknown" ||
    input.effort === "unknown" ||
    input.comparableConditions === "unknown";
  if (hasUnknownContext) reasons.push("Falta contexto opcional sobre la marca.");

  const isGood =
    distanceRatio >= 0.5 &&
    distanceRatio <= 2 &&
    input.recency === "recent" &&
    input.effort === "race" &&
    input.comparableConditions === "yes";

  if (highUncertainty) return { quality: "high_uncertainty", reasons };
  if (isGood) return { quality: "good", reasons: ["La marca es reciente, exigente y comparable."] };
  if (reasons.length === 0) {
    reasons.push("La marca es útil, aunque no cumple todos los criterios de una referencia ideal.");
  }
  return { quality: "acceptable", reasons };
}

export function formatDuration(totalSeconds: number): string {
  assertNonNegative(totalSeconds, "El tiempo no puede ser negativo.");
  const rounded = Math.round(totalSeconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;
  return hours > 0
    ? `${hours}:${padTwo(minutes)}:${padTwo(seconds)}`
    : `${minutes}:${padTwo(seconds)}`;
}

export function formatPace(totalSeconds: number): string {
  assertPositive(totalSeconds, "El ritmo debe ser mayor que cero.");
  const rounded = Math.round(totalSeconds);
  return `${Math.floor(rounded / 60)}:${padTwo(rounded % 60)}`;
}

export function formatDistance(
  distanceKm: number,
  unit: DistanceUnit,
  maximumFractionDigits = 4,
): string {
  const value = unit === "km" ? distanceKm : distanceKm / KM_PER_MILE;
  return `${new Intl.NumberFormat("es-MX", { maximumFractionDigits }).format(value)} ${unit}`;
}

export function formatPaceChange(secondsPerKm: number): string {
  if (Math.abs(secondsPerKm) < 0.5) return "La distancia objetivo coincide con tu referencia.";
  const seconds = Math.abs(Math.round(secondsPerKm));
  return secondsPerKm > 0
    ? `La predicción añade ${seconds} s/km frente a tu marca.`
    : `La predicción requiere ${seconds} s/km más rápido que tu marca.`;
}

export function buildRacePredictionCopyText(result: RacePredictionResult): string {
  return [
    "Predicción de carrera",
    `Referencia: ${formatDistance(result.referenceDistanceKm, result.input.referenceUnit)} en ${formatDuration(result.input.referenceTimeSeconds)}`,
    `Objetivo: ${formatDistance(result.targetDistanceKm, result.input.targetUnit)}`,
    `Tiempo previsto: ${formatDuration(result.targetTimeSeconds)}`,
    `Ritmo objetivo: ${formatPace(result.targetPaceSecondsPerKm)} min/km (${formatPace(result.targetPaceSecondsPerMi)} min/mi)`,
    `Cambio frente a la referencia: ${formatSignedSeconds(result.paceChangeSecondsPerKm)} s/km`,
    `Calidad de referencia: ${qualityLabel(result.quality)}`,
    "",
    "Estimación mediante fórmula Riegel; el resultado real puede variar.",
    "Calculado en calculadoras.tools",
  ].join("\n");
}

export function qualityLabel(quality: ReferenceQuality): string {
  if (quality === "good") return "Buena referencia";
  if (quality === "high_uncertainty") return "Alta incertidumbre";
  return "Referencia aceptable";
}

function validateDistance(
  value: number,
  unit: DistanceUnit,
  field: "referenceDistance" | "targetDistance",
  errors: RacePredictionValidationResult["errors"],
): void {
  if (!Number.isFinite(value)) {
    errors[field] = "required";
    return;
  }
  const distanceKm = toKm(value, unit);
  if (distanceKm <= 0 || distanceKm > RACE_PREDICTION_LIMITS.maxDistanceKm) {
    errors[field] = "out_of_range";
  }
}

function getWarnings(
  input: RacePredictionInput,
  referenceDistanceKm: number,
  targetDistanceKm: number,
  distanceRatio: number,
): RacePredictionWarning[] {
  const warnings: RacePredictionWarning[] = [];
  if (distanceRatio < 0.25 || distanceRatio > 4) warnings.push("wide_distance_ratio");
  if (input.recency === "older") warnings.push("old_reference");
  if (input.effort === "controlled") warnings.push("controlled_effort");
  if (input.comparableConditions === "no") warnings.push("different_conditions");
  if (nearlyEqual(targetDistanceKm, 42.195) && referenceDistanceKm < 10) {
    warnings.push("marathon_from_short_reference");
  }
  return warnings;
}

function toKm(value: number, unit: DistanceUnit): number {
  return unit === "km" ? value : value * KM_PER_MILE;
}

function formatSignedSeconds(value: number): string {
  const rounded = Math.round(value);
  return rounded > 0 ? `+${rounded}` : String(rounded);
}

function nearlyEqual(left: number, right: number): boolean {
  return Math.abs(left - right) < 1e-9;
}

function padTwo(value: number): string {
  return value.toString().padStart(2, "0");
}

function assertPositive(value: number, message: string): void {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(message);
}

function assertNonNegative(value: number, message: string): void {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(message);
}
