export type Vo2Method = "cooper" | "rockport";
export type DistanceUnit = "m" | "km" | "mi";
export type WeightUnit = "kg" | "lb";
export type FormulaSex = "male" | "female";
export type DataQuality = "good" | "acceptable" | "review";
export type Vo2Warning =
  | "unusual_result"
  | "rockport_fast"
  | "rockport_age_extrapolated"
  | "protocol_incomplete";

export interface ProtocolChecks {
  measuredRoute: boolean;
  exactDurationOrImmediatePulse: boolean;
  noSymptoms: boolean;
}

export interface CooperInput {
  method: "cooper";
  distance: number;
  distanceUnit: DistanceUnit;
  protocol: ProtocolChecks;
}

export interface RockportInput {
  method: "rockport";
  age: number;
  formulaSex: FormulaSex;
  weight: number;
  weightUnit: WeightUnit;
  minutes: number;
  seconds: number;
  finalPulse: number;
  walkedEntireMile: boolean;
  protocol: ProtocolChecks;
}

export type Vo2Input = CooperInput | RockportInput;

export type Vo2Field =
  | "distance"
  | "age"
  | "formulaSex"
  | "weight"
  | "minutes"
  | "seconds"
  | "finalPulse"
  | "walkedEntireMile";

export type Vo2ValidationError =
  | "required"
  | "invalid"
  | "not_integer"
  | "out_of_range"
  | "confirmation_required";

export interface Vo2ValidationResult {
  isValid: boolean;
  errors: Partial<Record<Vo2Field, Vo2ValidationError>>;
}

export interface Vo2Result {
  input: Vo2Input;
  method: Vo2Method;
  vo2Max: number;
  paceMinutesPerKm: number;
  quality: DataQuality;
  warnings: Vo2Warning[];
  summary: string[];
}

export const METERS_PER_MILE = 1609.344;
export const KG_TO_LB = 2.2046226218;
export const VO2_LIMITS = {
  cooperDistanceMeters: { min: 600, max: 5000 },
  rockportAge: { min: 18, max: 100, primaryMin: 30, primaryMax: 69 },
  rockportWeightKg: { min: 20, max: 250 },
  rockportTimeMinutes: { min: 8, max: 30, fastBelow: 10 },
  finalPulse: { min: 60, max: 220 },
  unusualResult: { min: 10, max: 90 },
} as const;

export const QUALITY_LABELS: Record<DataQuality, string> = {
  good: "Buena",
  acceptable: "Aceptable",
  review: "Revisar protocolo",
};

export class Vo2CalculationError extends RangeError {
  validation: Vo2ValidationResult;

  constructor(validation: Vo2ValidationResult) {
    super("Revisa los datos antes de calcular.");
    this.name = "Vo2CalculationError";
    this.validation = validation;
  }
}

export function parseVo2Number(
  rawValue: string,
  options: { integer?: boolean; maxDecimals?: number } = {},
): number | undefined {
  const normalized = rawValue.trim().replace(",", ".");
  const maxDecimals = options.maxDecimals ?? 2;
  const pattern = options.integer
    ? /^\d+$/
    : new RegExp(`^\\d+(?:\\.\\d{1,${maxDecimals}})?$`);

  if (!normalized || !pattern.test(normalized)) return undefined;

  const value = Number(normalized);
  return Number.isFinite(value) ? value : undefined;
}

export function convertDistance(
  value: number,
  fromUnit: DistanceUnit,
  toUnit: DistanceUnit,
): number {
  if (fromUnit === toUnit) return value;
  const meters =
    fromUnit === "m" ? value : fromUnit === "km" ? value * 1000 : value * METERS_PER_MILE;

  return toUnit === "m" ? meters : toUnit === "km" ? meters / 1000 : meters / METERS_PER_MILE;
}

export function convertWeight(
  value: number,
  fromUnit: WeightUnit,
  toUnit: WeightUnit,
): number {
  if (fromUnit === toUnit) return value;
  return fromUnit === "kg" ? value * KG_TO_LB : value / KG_TO_LB;
}

export function distanceFromLaps(laps: number, additionalMeters: number): number {
  if (!Number.isInteger(laps) || !Number.isInteger(additionalMeters)) {
    throw new RangeError("Las vueltas y metros adicionales deben ser enteros.");
  }
  if (laps < 0 || laps > 12 || additionalMeters < 0 || additionalMeters > 399) {
    throw new RangeError("Usa 0-12 vueltas y 0-399 metros adicionales.");
  }
  return laps * 400 + additionalMeters;
}

export function calculateCooperVo2(distanceMeters: number): number {
  return (distanceMeters - 504.9) / 44.73;
}

export function calculateRockportVo2(input: Omit<RockportInput, "method" | "protocol" | "walkedEntireMile">): number {
  const weightLb = convertWeight(input.weight, input.weightUnit, "lb");
  const timeMinutes = input.minutes + input.seconds / 60;
  const sex = input.formulaSex === "male" ? 1 : 0;

  return (
    132.853 -
    0.0769 * weightLb -
    0.3877 * input.age +
    6.315 * sex -
    3.2649 * timeMinutes -
    0.1565 * input.finalPulse
  );
}

export function validateVo2Input(input: Vo2Input): Vo2ValidationResult {
  const errors: Vo2ValidationResult["errors"] = {};

  if (input.method === "cooper") {
    const distanceMeters = convertDistance(input.distance, input.distanceUnit, "m");
    if (!Number.isFinite(input.distance)) errors.distance = "required";
    else if (
      distanceMeters < VO2_LIMITS.cooperDistanceMeters.min ||
      distanceMeters > VO2_LIMITS.cooperDistanceMeters.max
    ) {
      errors.distance = "out_of_range";
    }
  } else {
    const weightKg = convertWeight(input.weight, input.weightUnit, "kg");
    const timeMinutes = input.minutes + input.seconds / 60;

    validateIntegerRange(input.age, VO2_LIMITS.rockportAge.min, VO2_LIMITS.rockportAge.max, "age", errors);
    if (!["male", "female"].includes(input.formulaSex)) errors.formulaSex = "required";
    if (!Number.isFinite(input.weight)) errors.weight = "required";
    else if (
      weightKg < VO2_LIMITS.rockportWeightKg.min ||
      weightKg > VO2_LIMITS.rockportWeightKg.max
    ) {
      errors.weight = "out_of_range";
    }
    validateIntegerRange(input.minutes, 0, 30, "minutes", errors);
    validateIntegerRange(input.seconds, 0, 59, "seconds", errors);
    if (
      !errors.minutes &&
      !errors.seconds &&
      (timeMinutes < VO2_LIMITS.rockportTimeMinutes.min ||
        timeMinutes > VO2_LIMITS.rockportTimeMinutes.max)
    ) {
      errors.minutes = "out_of_range";
    }
    validateIntegerRange(
      input.finalPulse,
      VO2_LIMITS.finalPulse.min,
      VO2_LIMITS.finalPulse.max,
      "finalPulse",
      errors,
    );
    if (!input.walkedEntireMile) errors.walkedEntireMile = "confirmation_required";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function calculateVo2Result(input: Vo2Input): Vo2Result {
  const validation = validateVo2Input(input);
  if (!validation.isValid) throw new Vo2CalculationError(validation);

  const warnings: Vo2Warning[] = [];
  let vo2Max: number;
  let paceMinutesPerKm: number;
  let summary: string[];

  if (input.method === "cooper") {
    const distanceMeters = convertDistance(input.distance, input.distanceUnit, "m");
    vo2Max = calculateCooperVo2(distanceMeters);
    paceMinutesPerKm = 12 / (distanceMeters / 1000);
    summary = [`Distancia: ${formatDistance(distanceMeters)}`, "Duración: 12:00"];
  } else {
    const timeMinutes = input.minutes + input.seconds / 60;
    vo2Max = calculateRockportVo2(input);
    paceMinutesPerKm = timeMinutes / (METERS_PER_MILE / 1000);
    summary = [
      `Edad: ${input.age} años`,
      `Peso: ${formatWeight(input.weight, input.weightUnit)}`,
      `Tiempo: ${formatTime(timeMinutes)}`,
      `Pulso final: ${input.finalPulse} bpm`,
    ];
    if (timeMinutes < VO2_LIMITS.rockportTimeMinutes.fastBelow) warnings.push("rockport_fast");
    if (
      input.age < VO2_LIMITS.rockportAge.primaryMin ||
      input.age > VO2_LIMITS.rockportAge.primaryMax
    ) {
      warnings.push("rockport_age_extrapolated");
    }
  }

  if (!Number.isFinite(vo2Max) || vo2Max <= 0) {
    throw new RangeError("El resultado no es utilizable. Revisa los datos.");
  }
  if (vo2Max < VO2_LIMITS.unusualResult.min || vo2Max > VO2_LIMITS.unusualResult.max) {
    warnings.push("unusual_result");
  }

  const protocolComplete = Object.values(input.protocol).every(Boolean);
  if (!protocolComplete) warnings.push("protocol_incomplete");
  const quality: DataQuality =
    warnings.some((warning) => warning !== "protocol_incomplete")
      ? "review"
      : protocolComplete
        ? "good"
        : "acceptable";

  return { input: structuredClone(input), method: input.method, vo2Max, paceMinutesPerKm, quality, warnings, summary };
}

export function formatVo2(value: number): string {
  return `${formatNumber(value, 1, 1)} ml/kg/min`;
}

export function formatPace(value: number): string {
  return `${formatTime(value)} min/km`;
}

export function formatDistance(meters: number): string {
  return `${formatNumber(meters, 0)} m`;
}

export function formatWeight(value: number, unit: WeightUnit): string {
  return `${formatNumber(value, 0, 1)} ${unit}`;
}

export function formatTime(totalMinutes: number): string {
  let minutes = Math.floor(totalMinutes);
  let seconds = Math.round((totalMinutes - minutes) * 60);
  if (seconds === 60) {
    minutes += 1;
    seconds = 0;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function buildVo2CopyText(result: Vo2Result, comparison?: number): string {
  const lines = [
    "Calculadora de VO2 máx - calculadoras.tools",
    `VO2 máx estimado: ${formatVo2(result.vo2Max)}`,
    `Método: ${result.method === "cooper" ? "Cooper de 12 minutos" : "Rockport de caminata"}`,
    `Calidad del dato: ${QUALITY_LABELS[result.quality]}`,
    `Ritmo medio: ${formatPace(result.paceMinutesPerKm)}`,
    ...result.summary,
  ];

  if (comparison !== undefined) {
    lines.push(`Diferencia frente al resultado anterior del mismo método: ${formatSignedVo2(comparison)}`);
  }

  if (result.warnings.length > 0) lines.push("El resultado incluye advertencias de revisión.");
  lines.push("Estimación de campo orientativa; no sustituye una prueba de laboratorio ni evaluación profesional.");
  return lines.join("\n");
}

export function formatSignedVo2(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value, 1, 1)} ml/kg/min`;
}

function validateIntegerRange(
  value: number,
  min: number,
  max: number,
  field: Vo2Field,
  errors: Vo2ValidationResult["errors"],
): void {
  if (!Number.isFinite(value)) errors[field] = "required";
  else if (!Number.isInteger(value)) errors[field] = "not_integer";
  else if (value < min || value > max) errors[field] = "out_of_range";
}

function formatNumber(value: number, minimumFractionDigits: number, maximumFractionDigits = minimumFractionDigits): string {
  return new Intl.NumberFormat("es-MX", { minimumFractionDigits, maximumFractionDigits }).format(value);
}
