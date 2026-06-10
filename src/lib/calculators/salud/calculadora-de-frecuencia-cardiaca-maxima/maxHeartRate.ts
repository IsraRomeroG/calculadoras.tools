export const MIN_MAX_HEART_RATE_AGE = 18;
export const MAX_MAX_HEART_RATE_AGE = 100;

export type MaxHeartRateAgeError =
  | "required"
  | "invalid"
  | "not_integer"
  | "out_of_range";

export type ParseMaxHeartRateAgeResult =
  | {
      ok: true;
      age: number;
    }
  | {
      ok: false;
      error: MaxHeartRateAgeError;
    };

export interface HeartRateRange {
  minPercent: number;
  maxPercent: number;
  minBpm: number;
  maxBpm: number;
}

export interface MaxHeartRateResult {
  age: number;
  tanakaExact: number;
  tanakaBpm: number;
  classicBpm: number;
  moderate: HeartRateRange;
  vigorous: HeartRateRange;
}

export function parseMaxHeartRateAge(
  rawValue: string,
): ParseMaxHeartRateAgeResult {
  const value = rawValue.trim();

  if (!value) {
    return { ok: false, error: "required" };
  }

  if (!/^\d+(\.\d+)?$/.test(value)) {
    return { ok: false, error: "invalid" };
  }

  const age = Number(value);

  if (!Number.isInteger(age)) {
    return { ok: false, error: "not_integer" };
  }

  if (age < MIN_MAX_HEART_RATE_AGE || age > MAX_MAX_HEART_RATE_AGE) {
    return { ok: false, error: "out_of_range" };
  }

  return { ok: true, age };
}

export function calculateTanakaMaxHeartRate(age: number): number {
  assertValidAge(age);

  return 208 - 0.7 * age;
}

export function calculateClassicMaxHeartRate(age: number): number {
  assertValidAge(age);

  return 220 - age;
}

export function calculateHeartRateRange(
  maxHeartRate: number,
  minPercent: number,
  maxPercent: number,
): HeartRateRange {
  if (
    !Number.isFinite(maxHeartRate) ||
    !Number.isFinite(minPercent) ||
    !Number.isFinite(maxPercent) ||
    maxHeartRate <= 0 ||
    minPercent < 0 ||
    maxPercent > 1 ||
    minPercent >= maxPercent
  ) {
    throw new RangeError("El rango de frecuencia cardíaca no es válido.");
  }

  return {
    minPercent,
    maxPercent,
    minBpm: Math.round(maxHeartRate * minPercent),
    maxBpm: Math.round(maxHeartRate * maxPercent),
  };
}

export function calculateMaxHeartRate(age: number): MaxHeartRateResult {
  const tanakaExact = calculateTanakaMaxHeartRate(age);

  return {
    age,
    tanakaExact,
    tanakaBpm: Math.round(tanakaExact),
    classicBpm: Math.round(calculateClassicMaxHeartRate(age)),
    moderate: calculateHeartRateRange(tanakaExact, 0.5, 0.7),
    vigorous: calculateHeartRateRange(tanakaExact, 0.7, 0.85),
  };
}

export function buildMaxHeartRateCopyText(
  result: MaxHeartRateResult,
): string {
  return [
    "Calculadora de frecuencia cardíaca máxima - calculadoras.tools",
    `Edad: ${result.age} años`,
    `FCM estimada con Tanaka: ${result.tanakaBpm} bpm`,
    `Actividad moderada (50%-70%): ${formatBpmRange(result.moderate)}`,
    `Actividad vigorosa (70%-85%): ${formatBpmRange(result.vigorous)}`,
    `Fórmula clásica (220 - edad): ${result.classicBpm} bpm`,
    "Estas cifras son estimaciones generales, no una prescripción médica.",
  ].join("\n");
}

export function formatBpmRange(range: HeartRateRange): string {
  return `${range.minBpm}-${range.maxBpm} bpm`;
}

function assertValidAge(age: number): void {
  if (
    !Number.isInteger(age) ||
    age < MIN_MAX_HEART_RATE_AGE ||
    age > MAX_MAX_HEART_RATE_AGE
  ) {
    throw new RangeError(
      `La edad debe ser un número entero entre ${MIN_MAX_HEART_RATE_AGE} y ${MAX_MAX_HEART_RATE_AGE}.`,
    );
  }
}
