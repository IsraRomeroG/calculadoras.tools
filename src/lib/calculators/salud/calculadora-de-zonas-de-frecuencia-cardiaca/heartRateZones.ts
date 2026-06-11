import {
  calculateTanakaMaxHeartRate,
  MAX_MAX_HEART_RATE_AGE,
  MIN_MAX_HEART_RATE_AGE,
} from "../calculadora-de-frecuencia-cardiaca-maxima/maxHeartRate";

export const MIN_KNOWN_MAX_HEART_RATE = 80;
export const MAX_KNOWN_MAX_HEART_RATE = 240;
export const MIN_RESTING_HEART_RATE = 35;
export const MAX_RESTING_HEART_RATE = 120;

export type HeartRateSource = "age" | "known";
export type HeartRateZoneMethod = "max-percent" | "karvonen";

export type HeartRateIntegerError =
  | "required"
  | "invalid"
  | "not_integer"
  | "out_of_range";

export type ParseHeartRateIntegerResult =
  | {
      ok: true;
      value: number;
    }
  | {
      ok: false;
      error: HeartRateIntegerError;
    };

export type HeartRateZonesErrorCode =
  | "age_out_of_range"
  | "known_max_out_of_range"
  | "resting_required"
  | "resting_out_of_range"
  | "max_not_above_rest"
  | "limits_not_distinct";

export interface HeartRateZonesInput {
  source: HeartRateSource;
  method: HeartRateZoneMethod;
  age?: number;
  knownMaxHeartRate?: number;
  restingHeartRate?: number;
}

export interface HeartRateZoneDefinition {
  number: number;
  minPercent: number;
  maxPercent: number;
  label: string;
  effort: string;
  talkTest: string;
}

export interface HeartRateZone extends HeartRateZoneDefinition {
  minBpm: number;
  maxBpm: number;
}

export interface HeartRateZonesResult {
  source: HeartRateSource;
  method: HeartRateZoneMethod;
  age?: number;
  maxHeartRateExact: number;
  maxHeartRateBpm: number;
  restingHeartRate?: number;
  reserveExact?: number;
  zones: HeartRateZone[];
}

export const HEART_RATE_ZONE_DEFINITIONS: HeartRateZoneDefinition[] = [
  {
    number: 1,
    minPercent: 50,
    maxPercent: 60,
    label: "Muy fácil",
    effort: "Esfuerzo muy cómodo",
    talkTest: "Conversación cómoda",
  },
  {
    number: 2,
    minPercent: 60,
    maxPercent: 70,
    label: "Fácil",
    effort: "Esfuerzo cómodo y continuo",
    talkTest: "Se puede hablar en frases completas",
  },
  {
    number: 3,
    minPercent: 70,
    maxPercent: 80,
    label: "Sostenida",
    effort: "Esfuerzo perceptible",
    talkTest: "La conversación requiere pausas",
  },
  {
    number: 4,
    minPercent: 80,
    maxPercent: 90,
    label: "Difícil",
    effort: "Esfuerzo alto",
    talkTest: "Solo frases cortas",
  },
  {
    number: 5,
    minPercent: 90,
    maxPercent: 100,
    label: "Esfuerzo muy alto",
    effort: "Esfuerzo muy exigente",
    talkTest: "Hablar resulta difícil",
  },
];

const ZONE_BOUNDARIES = [50, 60, 70, 80, 90, 100];

export class HeartRateZonesError extends RangeError {
  code: HeartRateZonesErrorCode;

  constructor(code: HeartRateZonesErrorCode, message: string) {
    super(message);
    this.name = "HeartRateZonesError";
    this.code = code;
  }
}

export function parseHeartRateInteger(
  rawValue: string,
  min: number,
  max: number,
): ParseHeartRateIntegerResult {
  const value = rawValue.trim();

  if (!value) {
    return { ok: false, error: "required" };
  }

  if (!/^\d+(\.\d+)?$/.test(value)) {
    return { ok: false, error: "invalid" };
  }

  const number = Number(value);

  if (!Number.isInteger(number)) {
    return { ok: false, error: "not_integer" };
  }

  if (number < min || number > max) {
    return { ok: false, error: "out_of_range" };
  }

  return { ok: true, value: number };
}

export function calculateHeartRateZones(
  input: HeartRateZonesInput,
): HeartRateZonesResult {
  const maxHeartRateExact = resolveMaxHeartRate(input);
  const restingHeartRate = resolveRestingHeartRate(input, maxHeartRateExact);
  const reserveExact =
    input.method === "karvonen"
      ? maxHeartRateExact - (restingHeartRate as number)
      : undefined;
  const displayedLimits = ZONE_BOUNDARIES.map((percent) => {
    const ratio = percent / 100;
    const exactLimit =
      input.method === "karvonen"
        ? (restingHeartRate as number) + (reserveExact as number) * ratio
        : maxHeartRateExact * ratio;

    return Math.round(exactLimit);
  });

  assertDistinctLimits(displayedLimits);

  const zones = HEART_RATE_ZONE_DEFINITIONS.map((definition, index) => ({
    ...definition,
    minBpm: displayedLimits[index],
    maxBpm:
      index === HEART_RATE_ZONE_DEFINITIONS.length - 1
        ? displayedLimits[index + 1]
        : displayedLimits[index + 1] - 1,
  }));

  return {
    source: input.source,
    method: input.method,
    age: input.source === "age" ? input.age : undefined,
    maxHeartRateExact,
    maxHeartRateBpm: Math.round(maxHeartRateExact),
    restingHeartRate,
    reserveExact,
    zones,
  };
}

export function buildHeartRateZonesCopyText(
  result: HeartRateZonesResult,
): string {
  const sourceLine =
    result.source === "age"
      ? `FCM utilizada: ${result.maxHeartRateBpm} bpm, estimada con Tanaka para ${result.age} años`
      : `FCM utilizada: ${result.maxHeartRateBpm} bpm, introducida como FCM conocida`;
  const methodLine =
    result.method === "karvonen"
      ? "Método: Karvonen (% de reserva cardíaca)"
      : "Método: porcentaje directo de FCM";
  const detailLines =
    result.method === "karvonen"
      ? [
          `Frecuencia en reposo: ${result.restingHeartRate} bpm`,
          `Reserva cardíaca: ${formatHeartRateValue(result.reserveExact as number)} bpm`,
        ]
      : [];
  const basis =
    result.method === "karvonen" ? "de reserva cardíaca" : "de FCM";

  return [
    "Calculadora de zonas de frecuencia cardíaca - calculadoras.tools",
    sourceLine,
    methodLine,
    ...detailLines,
    "",
    ...result.zones.map(
      (zone) =>
        `Zona ${zone.number} · ${zone.label} (${zone.minPercent}%-${zone.maxPercent}% ${basis}): ${formatHeartRateZoneRange(zone)}`,
    ),
    "",
    "Estas zonas son estimaciones orientativas, no una prescripción médica.",
  ].join("\n");
}

export function formatHeartRateZoneRange(
  zone: Pick<HeartRateZone, "minBpm" | "maxBpm">,
): string {
  return `${zone.minBpm}-${zone.maxBpm} bpm`;
}

export function formatHeartRateValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function resolveMaxHeartRate(input: HeartRateZonesInput): number {
  if (input.source === "age") {
    if (
      !Number.isInteger(input.age) ||
      (input.age as number) < MIN_MAX_HEART_RATE_AGE ||
      (input.age as number) > MAX_MAX_HEART_RATE_AGE
    ) {
      throw new HeartRateZonesError(
        "age_out_of_range",
        `La edad debe estar entre ${MIN_MAX_HEART_RATE_AGE} y ${MAX_MAX_HEART_RATE_AGE} años.`,
      );
    }

    return calculateTanakaMaxHeartRate(input.age as number);
  }

  if (
    !Number.isInteger(input.knownMaxHeartRate) ||
    (input.knownMaxHeartRate as number) < MIN_KNOWN_MAX_HEART_RATE ||
    (input.knownMaxHeartRate as number) > MAX_KNOWN_MAX_HEART_RATE
  ) {
    throw new HeartRateZonesError(
      "known_max_out_of_range",
      `La FCM conocida debe estar entre ${MIN_KNOWN_MAX_HEART_RATE} y ${MAX_KNOWN_MAX_HEART_RATE} bpm.`,
    );
  }

  return input.knownMaxHeartRate as number;
}

function resolveRestingHeartRate(
  input: HeartRateZonesInput,
  maxHeartRate: number,
): number | undefined {
  if (input.method !== "karvonen") {
    return undefined;
  }

  if (input.restingHeartRate === undefined) {
    throw new HeartRateZonesError(
      "resting_required",
      "Karvonen necesita una frecuencia cardíaca en reposo.",
    );
  }

  if (
    !Number.isInteger(input.restingHeartRate) ||
    input.restingHeartRate < MIN_RESTING_HEART_RATE ||
    input.restingHeartRate > MAX_RESTING_HEART_RATE
  ) {
    throw new HeartRateZonesError(
      "resting_out_of_range",
      `La frecuencia en reposo debe estar entre ${MIN_RESTING_HEART_RATE} y ${MAX_RESTING_HEART_RATE} bpm.`,
    );
  }

  if (maxHeartRate <= input.restingHeartRate) {
    throw new HeartRateZonesError(
      "max_not_above_rest",
      "La frecuencia máxima debe ser mayor que la frecuencia en reposo.",
    );
  }

  return input.restingHeartRate;
}

function assertDistinctLimits(limits: number[]): void {
  const areStrictlyIncreasing = limits.every(
    (limit, index) => index === 0 || limit > limits[index - 1],
  );

  if (!areStrictlyIncreasing) {
    throw new HeartRateZonesError(
      "limits_not_distinct",
      "La diferencia entre la frecuencia máxima y la frecuencia en reposo es demasiado pequeña para mostrar cinco zonas distintas.",
    );
  }
}
