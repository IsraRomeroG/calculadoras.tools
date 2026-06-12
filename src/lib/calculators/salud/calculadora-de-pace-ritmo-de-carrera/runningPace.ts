export type RunningPaceMode = "analyze" | "plan" | "distance";
export type DistanceUnit = "km" | "mi";
export type PaceUnit = "min/km" | "min/mi";
export type SplitInterval = "1km" | "5km" | "1mi";

export interface RunningPaceInput {
  mode: RunningPaceMode;
  distance?: number;
  distanceUnit: DistanceUnit;
  timeSeconds: number;
  paceSeconds?: number;
  paceUnit: PaceUnit;
  splitInterval: SplitInterval;
}

export interface PopularDistance {
  id: "1k" | "5k" | "10k" | "half" | "marathon";
  label: string;
  distanceKm: number;
}

export interface RunningPaceEquivalent extends PopularDistance {
  timeSeconds: number;
}

export interface RunningPaceSplit {
  distanceKm: number;
  timeSeconds: number;
  isPartial: boolean;
}

export interface RunningPaceResult {
  input: RunningPaceInput;
  distanceKm: number;
  distanceMi: number;
  timeSeconds: number;
  paceSecondsPerKm: number;
  paceSecondsPerMi: number;
  speedKmh: number;
  speedMph: number;
  equivalents: RunningPaceEquivalent[];
  splits: RunningPaceSplit[];
  warnings: RunningPaceWarning[];
}

export type RunningPaceWarning = "long_distance";
export type RunningPaceField = "distance" | "time" | "pace";
export type RunningPaceValidationError =
  | "required"
  | "invalid"
  | "out_of_range";

export interface RunningPaceValidationResult {
  isValid: boolean;
  errors: Partial<Record<RunningPaceField, RunningPaceValidationError>>;
}

export const KM_PER_MILE = 1.609344;
export const RUNNING_PACE_LIMITS = {
  maxDistanceKm: 10_000,
  warnDistanceKm: 500,
  maxTimeSeconds: 10_000 * 3600,
} as const;

export const POPULAR_DISTANCES: PopularDistance[] = [
  { id: "1k", label: "1K", distanceKm: 1 },
  { id: "5k", label: "5K", distanceKm: 5 },
  { id: "10k", label: "10K", distanceKm: 10 },
  { id: "half", label: "Medio maratón", distanceKm: 21.0975 },
  { id: "marathon", label: "Maratón", distanceKm: 42.195 },
];

export class RunningPaceCalculationError extends RangeError {
  validation: RunningPaceValidationResult;

  constructor(validation: RunningPaceValidationResult) {
    super("Revisa los datos antes de calcular.");
    this.name = "RunningPaceCalculationError";
    this.validation = validation;
  }
}

export function parseLocalizedNumber(rawValue: string): number | undefined {
  const normalized = rawValue.trim().replace(",", ".");

  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) {
    return undefined;
  }

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

export function combinePaceParts(
  minutes: number,
  seconds: number,
): number | undefined {
  if (
    !Number.isInteger(minutes) ||
    !Number.isInteger(seconds) ||
    minutes < 0 ||
    seconds < 0 ||
    seconds > 59
  ) {
    return undefined;
  }

  return minutes * 60 + seconds;
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

export function convertPace(
  secondsPerUnit: number,
  fromUnit: PaceUnit,
  toUnit: PaceUnit,
): number {
  assertPositive(secondsPerUnit, "El ritmo debe ser mayor que cero.");

  if (fromUnit === toUnit) return secondsPerUnit;
  return fromUnit === "min/km"
    ? secondsPerUnit * KM_PER_MILE
    : secondsPerUnit / KM_PER_MILE;
}

export function validateRunningPaceInput(
  input: RunningPaceInput,
): RunningPaceValidationResult {
  const errors: RunningPaceValidationResult["errors"] = {};

  if (input.mode !== "distance") {
    if (!Number.isFinite(input.distance)) {
      errors.distance = "required";
    } else {
      const distanceKm =
        input.distanceUnit === "km"
          ? input.distance
          : input.distance! * KM_PER_MILE;
      if (distanceKm <= 0 || distanceKm > RUNNING_PACE_LIMITS.maxDistanceKm) {
        errors.distance = "out_of_range";
      }
    }
  }

  if (
    !Number.isFinite(input.timeSeconds) ||
    input.timeSeconds <= 0 ||
    input.timeSeconds > RUNNING_PACE_LIMITS.maxTimeSeconds
  ) {
    errors.time = Number.isFinite(input.timeSeconds)
      ? "out_of_range"
      : "required";
  }

  if (input.mode === "distance") {
    if (!Number.isFinite(input.paceSeconds)) {
      errors.pace = "required";
    } else if (input.paceSeconds! <= 0) {
      errors.pace = "out_of_range";
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function calculateRunningPace(
  input: RunningPaceInput,
): RunningPaceResult {
  const validation = validateRunningPaceInput(input);

  if (!validation.isValid) {
    throw new RunningPaceCalculationError(validation);
  }

  let distanceKm: number;
  let paceSecondsPerKm: number;

  if (input.mode === "distance") {
    paceSecondsPerKm = convertPace(
      input.paceSeconds!,
      input.paceUnit,
      "min/km",
    );
    distanceKm = input.timeSeconds / paceSecondsPerKm;

    if (distanceKm > RUNNING_PACE_LIMITS.maxDistanceKm) {
      throw new RunningPaceCalculationError({
        isValid: false,
        errors: { distance: "out_of_range" },
      });
    }
  } else {
    distanceKm =
      input.distanceUnit === "km"
        ? input.distance!
        : input.distance! * KM_PER_MILE;
    paceSecondsPerKm = input.timeSeconds / distanceKm;
  }

  const distanceMi = distanceKm / KM_PER_MILE;
  const paceSecondsPerMi = paceSecondsPerKm * KM_PER_MILE;
  const speedKmh = distanceKm / (input.timeSeconds / 3600);
  const speedMph = distanceMi / (input.timeSeconds / 3600);

  return {
    input: { ...input },
    distanceKm,
    distanceMi,
    timeSeconds: input.timeSeconds,
    paceSecondsPerKm,
    paceSecondsPerMi,
    speedKmh,
    speedMph,
    equivalents: POPULAR_DISTANCES.map((distance) => ({
      ...distance,
      timeSeconds: distance.distanceKm * paceSecondsPerKm,
    })),
    splits: generateSplits(distanceKm, paceSecondsPerKm, input.splitInterval),
    warnings:
      distanceKm > RUNNING_PACE_LIMITS.warnDistanceKm
        ? ["long_distance"]
        : [],
  };
}

export function generateSplits(
  distanceKm: number,
  paceSecondsPerKm: number,
  interval: SplitInterval,
): RunningPaceSplit[] {
  assertPositive(distanceKm, "La distancia debe ser mayor que cero.");
  assertPositive(paceSecondsPerKm, "El ritmo debe ser mayor que cero.");

  const intervalKm =
    interval === "1km" ? 1 : interval === "5km" ? 5 : KM_PER_MILE;
  const splits: RunningPaceSplit[] = [];
  const fullIntervals = Math.floor(distanceKm / intervalKm + 1e-10);

  for (let index = 1; index <= fullIntervals; index += 1) {
    const splitDistance = index * intervalKm;
    splits.push({
      distanceKm: splitDistance,
      timeSeconds: splitDistance * paceSecondsPerKm,
      isPartial: false,
    });
  }

  const lastDistance = splits.at(-1)?.distanceKm ?? 0;
  if (Math.abs(lastDistance - distanceKm) > 1e-9) {
    splits.push({
      distanceKm,
      timeSeconds: distanceKm * paceSecondsPerKm,
      isPartial: true,
    });
  }

  return splits;
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
  return `${new Intl.NumberFormat("es-MX", {
    maximumFractionDigits,
  }).format(value)} ${unit}`;
}

export function formatSpeed(value: number, unit: "km/h" | "mph"): string {
  assertPositive(value, "La velocidad debe ser mayor que cero.");
  return `${new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} ${unit}`;
}

export function buildRunningPaceCopyText(result: RunningPaceResult): string {
  return [
    `${formatDistance(result.distanceKm, "km")} en ${formatDuration(result.timeSeconds)}`,
    `Ritmo: ${formatPace(result.paceSecondsPerKm)} min/km (${formatPace(result.paceSecondsPerMi)} min/mi)`,
    `Velocidad: ${formatSpeed(result.speedKmh, "km/h")}`,
    "Calculado en calculadoras.tools",
  ].join("\n");
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
