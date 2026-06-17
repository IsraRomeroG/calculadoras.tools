export type GradeScalePreset = "0-10" | "0-100" | "custom";
export type WeightMode = "evaluated" | "pending";
export type RoundingMode = "exact" | "tenths" | "integers";
export type MinimumGradeStatus = "reachable" | "impossible" | "secured";
export type TargetPreset = "pass" | "70" | "80" | "90";

export interface GradeScale {
  min: number;
  max: number;
}

export interface MinimumGradeInput {
  scaleMin: number;
  scaleMax: number;
  currentGrade?: number | null;
  weightMode: WeightMode;
  weightPercent: number;
  targetGrade: number;
  roundingMode?: RoundingMode;
  scenarioGrade?: number | null;
}

export interface GradeScenario {
  grade: number;
  finalGrade: number;
}

export interface MinimumGradeResult {
  scaleMin: number;
  scaleMax: number;
  currentGrade: number;
  targetGrade: number;
  weightMode: WeightMode;
  weightEvaluatedPercent: number;
  weightPendingPercent: number;
  requiredGradeExact: number;
  requiredGradeRounded: number;
  recommendedGrade: number | null;
  minimumFinalGrade: number;
  maximumFinalGrade: number;
  status: MinimumGradeStatus;
  roundingMode: RoundingMode;
  scenarios: GradeScenario[];
}

export type ParseMinimumGradeNumberResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "zero" | "too_many_decimals";
    };

export const MINIMUM_GRADE_CANONICAL_PATH =
  "/matematicas/calculadora-nota-minima-para-aprobar";

const DEFAULT_DECIMALS = 2;
const MAX_INPUT_DECIMALS = 4;
const EPSILON = 1e-9;

export function getScaleFromPreset(
  preset: GradeScalePreset,
  customMin?: number | null,
  customMax?: number | null,
): GradeScale {
  if (preset === "0-10") {
    return { min: 0, max: 10 };
  }

  if (preset === "0-100") {
    return { min: 0, max: 100 };
  }

  const min = normalizeOptionalNumber(customMin) ?? 0;
  const max = normalizeOptionalNumber(customMax);

  if (max === null) {
    throw new RangeError("La escala personalizada necesita un maximo.");
  }

  assertValidScale(min, max);

  return { min, max };
}

export function getTargetPresetValue(
  preset: TargetPreset,
  scale: GradeScale,
): number {
  const range = scale.max - scale.min;

  if (preset === "pass") {
    return scale.min + range * 0.6;
  }

  return scale.min + range * (Number(preset) / 100);
}

export function calculateMinimumGrade(
  input: MinimumGradeInput,
): MinimumGradeResult {
  assertValidScale(input.scaleMin, input.scaleMax);
  assertGradeInScale(input.targetGrade, input.scaleMin, input.scaleMax, "La calificacion objetivo debe estar dentro de la escala.");

  const roundingMode = input.roundingMode ?? "exact";
  const weights = getWeights(input.weightMode, input.weightPercent);
  const currentGrade =
    weights.evaluated > EPSILON
      ? normalizeRequiredGrade(input.currentGrade, input.scaleMin, input.scaleMax)
      : input.currentGrade ?? input.scaleMin;

  if (weights.pending <= EPSILON) {
    throw new RangeError("El peso pendiente debe ser mayor que cero.");
  }

  const requiredGradeExact =
    (input.targetGrade - currentGrade * weights.evaluated) / weights.pending;
  const requiredGradeRounded = roundRequiredGrade(requiredGradeExact, roundingMode);
  const minimumFinalGrade =
    currentGrade * weights.evaluated + input.scaleMin * weights.pending;
  const maximumFinalGrade =
    currentGrade * weights.evaluated + input.scaleMax * weights.pending;
  const status = getMinimumGradeStatus(
    requiredGradeExact,
    input.scaleMin,
    input.scaleMax,
  );
  const recommendedGrade =
    status === "reachable"
      ? clamp(requiredGradeRounded, input.scaleMin, input.scaleMax)
      : status === "secured"
        ? input.scaleMin
        : null;

  return {
    scaleMin: input.scaleMin,
    scaleMax: input.scaleMax,
    currentGrade,
    targetGrade: input.targetGrade,
    weightMode: input.weightMode,
    weightEvaluatedPercent: weights.evaluated * 100,
    weightPendingPercent: weights.pending * 100,
    requiredGradeExact,
    requiredGradeRounded,
    recommendedGrade,
    minimumFinalGrade,
    maximumFinalGrade,
    status,
    roundingMode,
    scenarios: buildScenarios({
      currentGrade,
      weightEvaluated: weights.evaluated,
      weightPending: weights.pending,
      scaleMin: input.scaleMin,
      scaleMax: input.scaleMax,
      recommendedGrade,
      scenarioGrade: input.scenarioGrade,
    }),
  };
}

export function parseMinimumGradeNumber(
  value: string,
  options: {
    required?: boolean;
    allowZero?: boolean;
    maxDecimals?: number;
  } = {},
): ParseMinimumGradeNumberResult {
  const required = options.required ?? true;
  const allowZero = options.allowZero ?? true;
  const maxDecimals = options.maxDecimals ?? MAX_INPUT_DECIMALS;
  const trimmed = value.trim();

  if (!trimmed) {
    return required
      ? { ok: false, error: "required" }
      : { ok: true, value: Number.NaN, normalized: "" };
  }

  if (/[-\u2212]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const cleaned = trimmed.replace(/[%\s]/g, "");

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

  if (!allowZero && numericValue === 0) {
    return { ok: false, error: "zero" };
  }

  return {
    ok: true,
    value: numericValue,
    normalized,
  };
}

export function formatGradeNumber(
  value: number,
  decimals = DEFAULT_DECIMALS,
): string {
  assertFiniteNumber(value);

  const safeDecimals = normalizeDecimals(decimals);

  return new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: safeDecimals,
    maximumFractionDigits: safeDecimals,
  }).format(roundToDecimals(value, safeDecimals));
}

export function formatFlexibleGradeNumber(value: number): string {
  assertFiniteNumber(value);

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 4,
  }).format(roundToDecimals(value, 4));
}

export function formatGradePercent(value: number): string {
  assertFiniteNumber(value);

  return `${new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 2,
  }).format(roundToDecimals(value, 2))}%`;
}

export function buildMinimumGradeSummary(result: MinimumGradeResult): string {
  const lines = [
    "Calculadora de nota minima para aprobar - calculadoras.tools",
    `Estado: ${getStatusLabel(result.status)}`,
    `Objetivo: ${formatGradeNumber(result.targetGrade)}`,
    `Peso evaluado: ${formatGradePercent(result.weightEvaluatedPercent)}`,
    `Peso pendiente: ${formatGradePercent(result.weightPendingPercent)}`,
  ];

  if (result.status === "reachable" && result.recommendedGrade !== null) {
    lines.push(
      `Necesitas: ${formatGradeNumber(result.recommendedGrade)} en lo pendiente`,
      `Resultado exacto: ${formatGradeNumber(result.requiredGradeExact)}`,
    );
  }

  if (result.status === "impossible") {
    lines.push(
      `Aunque obtengas ${formatGradeNumber(result.scaleMax)}, llegarias a ${formatGradeNumber(result.maximumFinalGrade)}.`,
    );
  }

  if (result.status === "secured") {
    lines.push(
      `Incluso con ${formatGradeNumber(result.scaleMin)}, mantendrias ${formatGradeNumber(result.minimumFinalGrade)}.`,
    );
  }

  lines.push(
    `Nota final minima posible: ${formatGradeNumber(result.minimumFinalGrade)}`,
    `Nota final maxima posible: ${formatGradeNumber(result.maximumFinalGrade)}`,
    "",
    "Escenarios:",
    ...result.scenarios.map(
      (scenario) =>
        `Si obtienes ${formatGradeNumber(scenario.grade)}, terminas con ${formatGradeNumber(scenario.finalGrade)}.`,
    ),
  );

  return lines.join("\n");
}

export function getStatusLabel(status: MinimumGradeStatus): string {
  if (status === "reachable") {
    return "alcanzable";
  }

  if (status === "impossible") {
    return "imposible";
  }

  return "ya asegurado";
}

function getWeights(weightMode: WeightMode, weightPercent: number) {
  assertFiniteNumber(weightPercent);

  if (weightMode === "evaluated") {
    if (weightPercent < 0 || weightPercent >= 100) {
      throw new RangeError("El peso ya evaluado debe ser mayor o igual que 0 y menor que 100.");
    }

    const evaluated = weightPercent / 100;

    return {
      evaluated,
      pending: 1 - evaluated,
    };
  }

  if (weightPercent <= 0 || weightPercent > 100) {
    throw new RangeError("El peso pendiente debe ser mayor que 0 y menor o igual que 100.");
  }

  const pending = weightPercent / 100;

  return {
    evaluated: 1 - pending,
    pending,
  };
}

function normalizeRequiredGrade(
  value: number | null | undefined,
  scaleMin: number,
  scaleMax: number,
) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new RangeError("La calificacion actual es obligatoria cuando ya hay peso evaluado.");
  }

  assertGradeInScale(value, scaleMin, scaleMax, "La calificacion actual debe estar dentro de la escala.");

  return value;
}

function getMinimumGradeStatus(
  requiredGrade: number,
  scaleMin: number,
  scaleMax: number,
): MinimumGradeStatus {
  if (requiredGrade <= scaleMin + EPSILON) {
    return "secured";
  }

  if (requiredGrade <= scaleMax + EPSILON) {
    return "reachable";
  }

  return "impossible";
}

function roundRequiredGrade(value: number, mode: RoundingMode) {
  if (mode === "tenths") {
    return ceilToDecimals(value, 1);
  }

  if (mode === "integers") {
    return ceilToDecimals(value, 0);
  }

  return roundToDecimals(value, DEFAULT_DECIMALS);
}

function buildScenarios({
  currentGrade,
  weightEvaluated,
  weightPending,
  scaleMin,
  scaleMax,
  recommendedGrade,
  scenarioGrade,
}: {
  currentGrade: number;
  weightEvaluated: number;
  weightPending: number;
  scaleMin: number;
  scaleMax: number;
  recommendedGrade: number | null;
  scenarioGrade?: number | null;
}): GradeScenario[] {
  const range = scaleMax - scaleMin;
  const candidates = [
    normalizeOptionalNumber(scenarioGrade),
    recommendedGrade,
    scaleMin + range * 0.8,
    scaleMin + range * 0.9,
    scaleMax,
  ];
  const uniqueGrades: number[] = [];

  candidates.forEach((candidate) => {
    if (candidate === null || candidate < scaleMin || candidate > scaleMax) {
      return;
    }

    const normalized = roundToDecimals(candidate, 4);
    const alreadyAdded = uniqueGrades.some(
      (grade) => Math.abs(grade - normalized) < EPSILON,
    );

    if (!alreadyAdded) {
      uniqueGrades.push(normalized);
    }
  });

  return uniqueGrades.slice(0, 3).map((grade) => ({
    grade,
    finalGrade: currentGrade * weightEvaluated + grade * weightPending,
  }));
}

function assertValidScale(min: number, max: number) {
  assertFiniteNumber(min);
  assertFiniteNumber(max);

  if (min >= max) {
    throw new RangeError("El minimo de la escala debe ser menor que el maximo.");
  }
}

function assertGradeInScale(
  value: number,
  scaleMin: number,
  scaleMax: number,
  message: string,
) {
  assertFiniteNumber(value);

  if (value < scaleMin || value > scaleMax) {
    throw new RangeError(message);
  }
}

function normalizeOptionalNumber(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  if (!Number.isFinite(value)) {
    throw new RangeError("El valor opcional debe ser finito.");
  }

  return value;
}

function assertFiniteNumber(value: number) {
  if (!Number.isFinite(value)) {
    throw new RangeError("Todos los valores deben ser numeros finitos.");
  }
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

function normalizeDecimals(decimals = DEFAULT_DECIMALS) {
  if (!Number.isFinite(decimals)) {
    return DEFAULT_DECIMALS;
  }

  return Math.min(4, Math.max(0, Math.trunc(decimals)));
}

function ceilToDecimals(value: number, decimals: number) {
  const factor = 10 ** normalizeDecimals(decimals);

  return normalizeNegativeZero(Math.ceil((value - EPSILON) * factor) / factor);
}

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** normalizeDecimals(decimals);

  return normalizeNegativeZero(
    Math.round((value + Number.EPSILON) * factor) / factor,
  );
}

function normalizeNegativeZero(value: number) {
  return Object.is(value, -0) ? 0 : value;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
