export type WeightedGradeScalePreset = "0-10" | "0-100" | "custom";
export type WeightedGradeStatus = "graded" | "pending";
export type WeightState = "complete" | "under" | "over";
export type GoalStatus = "reachable" | "unreachable" | "secured";

export interface WeightedGradeEvaluationInput {
  name: string;
  status: WeightedGradeStatus;
  grade?: number | null;
  estimatedGrade?: number | null;
  weightPercent: number;
}

export interface WeightedGradeInput {
  scaleMax: number;
  targetGrade?: number | null;
  evaluations: WeightedGradeEvaluationInput[];
}

export interface WeightedGradeEvaluationResult {
  name: string;
  status: WeightedGradeStatus;
  grade: number | null;
  estimatedGrade: number | null;
  weightPercent: number;
  contribution: number | null;
  projectedContribution: number | null;
  message: string | null;
}

export interface WeightedGradeGoalResult {
  targetGrade: number;
  requiredAverage: number | null;
  status: GoalStatus;
  minimumFinalGrade: number;
  maximumFinalGrade: number;
}

export interface WeightedGradeResult {
  scaleMax: number;
  accumulatedGrade: number;
  evaluatedAverage: number | null;
  projectedGrade: number | null;
  weightAssignedPercent: number;
  weightEvaluatedPercent: number;
  weightPendingAssignedPercent: number;
  weightUnassignedPercent: number;
  weightExcessPercent: number;
  weightRemainingEvaluablePercent: number;
  weightState: WeightState;
  goal: WeightedGradeGoalResult | null;
  evaluations: WeightedGradeEvaluationResult[];
  messages: string[];
}

export type ParseWeightedGradeNumberResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "zero" | "too_many_decimals";
    };

export const WEIGHTED_GRADE_CANONICAL_PATH =
  "/matematicas/calculadora-calificacion-ponderada";

export const WEIGHTED_GRADE_EXAMPLES = [
  {
    id: "curso-completo",
    label: "Curso completo",
    scale: "0-10",
    targetGrade: "8",
    evaluations: [
      { name: "Tareas", status: "graded", grade: "9", estimatedGrade: "", weight: "30" },
      { name: "Examen", status: "graded", grade: "8", estimatedGrade: "", weight: "40" },
      { name: "Proyecto", status: "graded", grade: "10", estimatedGrade: "", weight: "30" },
    ],
  },
  {
    id: "con-pendientes",
    label: "Con pendientes",
    scale: "0-10",
    targetGrade: "8",
    evaluations: [
      { name: "Tareas", status: "graded", grade: "8.5", estimatedGrade: "", weight: "35" },
      { name: "Parcial", status: "graded", grade: "7.8", estimatedGrade: "", weight: "35" },
      { name: "Final", status: "pending", grade: "", estimatedGrade: "8.7", weight: "30" },
    ],
  },
] as const;

const DEFAULT_DECIMALS = 2;
const MAX_INPUT_DECIMALS = 4;
const EPSILON = 1e-9;
const WEIGHT_TOLERANCE = 0.01;

export function getWeightedGradeScaleMaxFromPreset(
  preset: WeightedGradeScalePreset,
  customMax?: number | null,
): number {
  if (preset === "0-10") {
    return 10;
  }

  if (preset === "0-100") {
    return 100;
  }

  if (typeof customMax === "number" && Number.isFinite(customMax) && customMax > 0) {
    return customMax;
  }

  throw new RangeError("La escala personalizada debe ser mayor que cero.");
}

export function calculateWeightedGrade(
  input: WeightedGradeInput,
): WeightedGradeResult {
  assertPositiveNumber(input.scaleMax, "La escala maxima debe ser mayor que cero.");

  if (input.evaluations.length === 0) {
    throw new RangeError("Debe existir al menos una evaluacion valida.");
  }

  const targetGrade = normalizeOptionalNumber(input.targetGrade);

  if (targetGrade !== null) {
    assertGradeInScale(
      targetGrade,
      input.scaleMax,
      "La calificacion objetivo debe estar dentro de la escala.",
    );
  }

  const evaluations = input.evaluations.map((evaluation, index) =>
    normalizeEvaluation(evaluation, index, input.scaleMax),
  );
  const hasWeightedEvaluation = evaluations.some(
    (evaluation) => evaluation.weightPercent > EPSILON,
  );

  if (!hasWeightedEvaluation) {
    throw new RangeError("Debe existir al menos una evaluacion con peso mayor que cero.");
  }

  const rawWeightAssigned = sum(evaluations, (evaluation) => evaluation.weightPercent);
  const weightAssignedPercent = normalizeHundred(rawWeightAssigned);
  const weightState = getWeightState(rawWeightAssigned);
  const weightUnassignedPercent =
    weightState === "under" ? roundToDecimals(100 - rawWeightAssigned, 6) : 0;
  const weightExcessPercent =
    weightState === "over" ? roundToDecimals(rawWeightAssigned - 100, 6) : 0;
  const weightEvaluatedPercent = sum(
    evaluations,
    (evaluation) => (evaluation.status === "graded" ? evaluation.weightPercent : 0),
  );
  const weightPendingAssignedPercent = sum(
    evaluations,
    (evaluation) => (evaluation.status === "pending" ? evaluation.weightPercent : 0),
  );
  const weightRemainingEvaluablePercent = Math.max(
    0,
    roundToDecimals(100 - weightEvaluatedPercent, 6),
  );
  const accumulatedGrade = sum(evaluations, (evaluation) =>
    evaluation.status === "graded" && evaluation.grade !== null
      ? evaluation.grade * (evaluation.weightPercent / 100)
      : 0,
  );
  const evaluatedAverage =
    weightEvaluatedPercent > EPSILON
      ? sum(evaluations, (evaluation) =>
          evaluation.status === "graded" && evaluation.grade !== null
            ? evaluation.grade * evaluation.weightPercent
            : 0,
        ) / weightEvaluatedPercent
      : null;
  const hasAnyEstimate = evaluations.some(
    (evaluation) =>
      evaluation.status === "pending" && evaluation.estimatedGrade !== null,
  );
  const projectedGrade = hasAnyEstimate
    ? accumulatedGrade +
      sum(evaluations, (evaluation) =>
        evaluation.status === "pending" && evaluation.estimatedGrade !== null
          ? evaluation.estimatedGrade * (evaluation.weightPercent / 100)
          : 0,
      )
    : null;
  const resultEvaluations = evaluations.map((evaluation) =>
    buildEvaluationResult(evaluation),
  );
  const goal =
    targetGrade === null
      ? null
      : buildGoalResult({
          targetGrade,
          accumulatedGrade,
          weightRemainingEvaluablePercent,
          scaleMax: input.scaleMax,
        });

  return {
    scaleMax: input.scaleMax,
    accumulatedGrade,
    evaluatedAverage,
    projectedGrade,
    weightAssignedPercent,
    weightEvaluatedPercent,
    weightPendingAssignedPercent,
    weightUnassignedPercent,
    weightExcessPercent,
    weightRemainingEvaluablePercent,
    weightState,
    goal,
    evaluations: resultEvaluations,
    messages: buildMessages({
      weightState,
      weightUnassignedPercent,
      weightExcessPercent,
      weightEvaluatedPercent,
      hasAnyEstimate,
      hasMissingEstimates: evaluations.some(
        (evaluation) =>
          evaluation.status === "pending" && evaluation.estimatedGrade === null,
      ),
      goal,
    }),
  };
}

export function parseWeightedGradeNumber(
  value: string,
  options: {
    required?: boolean;
    allowZero?: boolean;
    maxDecimals?: number;
  } = {},
): ParseWeightedGradeNumberResult {
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

export function formatWeightedGradeNumber(
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

export function formatFlexibleWeightedGradeNumber(value: number): string {
  assertFiniteNumber(value);

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 4,
  }).format(roundToDecimals(value, 4));
}

export function formatWeightedGradePercent(value: number): string {
  assertFiniteNumber(value);

  return `${new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 2,
  }).format(roundToDecimals(value, 2))}%`;
}

export function getGoalStatusLabel(status: GoalStatus): string {
  if (status === "reachable") {
    return "alcanzable";
  }

  if (status === "secured") {
    return "ya alcanzada";
  }

  return "no alcanzable";
}

export function buildWeightedGradeSummary(result: WeightedGradeResult): string {
  const lines = [
    "Calculadora de calificacion ponderada - calculadoras.tools",
    `Calificacion acumulada: ${formatWeightedGradeNumber(result.accumulatedGrade)}`,
    `Peso evaluado: ${formatWeightedGradePercent(result.weightEvaluatedPercent)}`,
    `Peso asignado: ${formatWeightedGradePercent(result.weightAssignedPercent)}`,
  ];

  if (result.evaluatedAverage !== null) {
    lines.push(
      `Promedio del peso evaluado: ${formatWeightedGradeNumber(result.evaluatedAverage)}`,
    );
  }

  if (result.projectedGrade !== null) {
    lines.push(
      `Calificacion proyectada: ${formatWeightedGradeNumber(result.projectedGrade)}`,
    );
  }

  if (result.goal) {
    lines.push(
      `Meta: ${formatWeightedGradeNumber(result.goal.targetGrade)}`,
      `Estado de meta: ${getGoalStatusLabel(result.goal.status)}`,
    );

    if (result.goal.requiredAverage !== null) {
      lines.push(
        `Necesitas promedio de ${formatWeightedGradeNumber(result.goal.requiredAverage)} en el peso restante.`,
      );
    }
  }

  if (result.messages.length > 0) {
    lines.push("", "Notas:", ...result.messages);
  }

  lines.push(
    "",
    "Evaluaciones:",
    ...result.evaluations.map((evaluation) => {
      const grade =
        evaluation.status === "graded"
          ? formatOptionalNumber(evaluation.grade)
          : formatOptionalNumber(evaluation.estimatedGrade);
      const contribution =
        evaluation.status === "graded"
          ? formatOptionalNumber(evaluation.contribution)
          : formatOptionalNumber(evaluation.projectedContribution);

      return `${evaluation.name}: ${evaluation.status === "graded" ? "calificada" : "pendiente"}, nota ${grade}, peso ${formatWeightedGradePercent(evaluation.weightPercent)}, aporte ${contribution}`;
    }),
  );

  return lines.join("\n");
}

export function buildWeightedGradeCsv(result: WeightedGradeResult): string {
  return [
    "evaluacion,estado,calificacion,estimada,peso,aporte",
    ...result.evaluations.map((evaluation) =>
      [
        escapeCsv(evaluation.name),
        evaluation.status === "graded" ? "calificada" : "pendiente",
        formatOptionalNumber(evaluation.grade),
        formatOptionalNumber(evaluation.estimatedGrade),
        formatWeightedGradePercent(evaluation.weightPercent),
        formatOptionalNumber(
          evaluation.status === "graded"
            ? evaluation.contribution
            : evaluation.projectedContribution,
        ),
      ].join(","),
    ),
  ].join("\n");
}

function normalizeEvaluation(
  evaluation: WeightedGradeEvaluationInput,
  index: number,
  scaleMax: number,
) {
  const name = evaluation.name.trim() || `Evaluacion ${index + 1}`;
  const grade = normalizeOptionalNumber(evaluation.grade);
  const estimatedGrade = normalizeOptionalNumber(evaluation.estimatedGrade);

  assertFiniteNumber(evaluation.weightPercent);

  if (evaluation.weightPercent < 0 || evaluation.weightPercent > 100) {
    throw new RangeError("El peso debe estar entre 0 y 100.");
  }

  if (evaluation.status === "graded") {
    if (grade === null) {
      throw new RangeError("La calificacion es obligatoria para evaluaciones calificadas.");
    }

    assertGradeInScale(
      grade,
      scaleMax,
      "La calificacion debe estar dentro de la escala.",
    );
  }

  if (estimatedGrade !== null) {
    assertGradeInScale(
      estimatedGrade,
      scaleMax,
      "La calificacion estimada debe estar dentro de la escala.",
    );
  }

  return {
    name,
    status: evaluation.status,
    grade: evaluation.status === "graded" ? grade : null,
    estimatedGrade: evaluation.status === "pending" ? estimatedGrade : null,
    weightPercent: evaluation.weightPercent,
  };
}

function buildEvaluationResult(
  evaluation: ReturnType<typeof normalizeEvaluation>,
): WeightedGradeEvaluationResult {
  const contribution =
    evaluation.status === "graded" && evaluation.grade !== null
      ? evaluation.grade * (evaluation.weightPercent / 100)
      : null;
  const projectedContribution =
    evaluation.status === "pending" && evaluation.estimatedGrade !== null
      ? evaluation.estimatedGrade * (evaluation.weightPercent / 100)
      : null;

  return {
    ...evaluation,
    contribution,
    projectedContribution,
    message:
      evaluation.weightPercent === 0
        ? "Esta evaluacion no afecta el resultado porque su peso es 0%."
        : null,
  };
}

function buildGoalResult({
  targetGrade,
  accumulatedGrade,
  weightRemainingEvaluablePercent,
  scaleMax,
}: {
  targetGrade: number;
  accumulatedGrade: number;
  weightRemainingEvaluablePercent: number;
  scaleMax: number;
}): WeightedGradeGoalResult {
  const minimumFinalGrade = accumulatedGrade;
  const maximumFinalGrade =
    accumulatedGrade + scaleMax * (weightRemainingEvaluablePercent / 100);

  if (weightRemainingEvaluablePercent <= EPSILON) {
    return {
      targetGrade,
      requiredAverage: null,
      minimumFinalGrade,
      maximumFinalGrade,
      status: accumulatedGrade >= targetGrade - EPSILON ? "secured" : "unreachable",
    };
  }

  const requiredAverage =
    (targetGrade - accumulatedGrade) / (weightRemainingEvaluablePercent / 100);

  if (requiredAverage <= EPSILON) {
    return {
      targetGrade,
      requiredAverage,
      minimumFinalGrade,
      maximumFinalGrade,
      status: "secured",
    };
  }

  return {
    targetGrade,
    requiredAverage,
    minimumFinalGrade,
    maximumFinalGrade,
    status: requiredAverage <= scaleMax + EPSILON ? "reachable" : "unreachable",
  };
}

function buildMessages({
  weightState,
  weightUnassignedPercent,
  weightExcessPercent,
  weightEvaluatedPercent,
  hasAnyEstimate,
  hasMissingEstimates,
  goal,
}: {
  weightState: WeightState;
  weightUnassignedPercent: number;
  weightExcessPercent: number;
  weightEvaluatedPercent: number;
  hasAnyEstimate: boolean;
  hasMissingEstimates: boolean;
  goal: WeightedGradeGoalResult | null;
}) {
  const messages: string[] = [];

  if (weightState === "under") {
    messages.push(
      `Falta asignar ${formatWeightedGradePercent(weightUnassignedPercent)} del curso.`,
    );
  }

  if (weightState === "over") {
    messages.push(
      `Los pesos exceden 100% por ${formatWeightedGradePercent(weightExcessPercent)}.`,
    );
  }

  if (weightEvaluatedPercent <= EPSILON) {
    messages.push("Aun no hay evaluaciones calificadas.");
  }

  if (hasAnyEstimate && hasMissingEstimates) {
    messages.push("La proyeccion solo usa pendientes con estimacion capturada.");
  }

  if (goal?.status === "unreachable") {
    messages.push("La meta no es alcanzable con el peso restante y la escala actual.");
  }

  if (goal?.status === "secured") {
    messages.push("La meta ya esta alcanzada con lo evaluado.");
  }

  return messages;
}

function getWeightState(weightAssignedPercent: number): WeightState {
  if (Math.abs(weightAssignedPercent - 100) <= WEIGHT_TOLERANCE) {
    return "complete";
  }

  return weightAssignedPercent > 100 ? "over" : "under";
}

function normalizeHundred(value: number) {
  return Math.abs(value - 100) <= WEIGHT_TOLERANCE ? 100 : value;
}

function formatOptionalNumber(value: number | null): string {
  return value === null ? "" : formatFlexibleWeightedGradeNumber(value);
}

function assertGradeInScale(value: number, scaleMax: number, message: string) {
  assertFiniteNumber(value);

  if (value < 0 || value > scaleMax) {
    throw new RangeError(message);
  }
}

function assertPositiveNumber(value: number, message: string) {
  assertFiniteNumber(value);

  if (value <= 0) {
    throw new RangeError(message);
  }
}

function assertFiniteNumber(value: number) {
  if (!Number.isFinite(value)) {
    throw new RangeError("Todos los valores deben ser numeros finitos.");
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

function sum<T>(items: T[], callback: (item: T) => number): number {
  return items.reduce((total, item) => total + callback(item), 0);
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

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** normalizeDecimals(decimals);

  return normalizeNegativeZero(
    Math.round((value + Number.EPSILON) * factor) / factor,
  );
}

function normalizeNegativeZero(value: number) {
  return Object.is(value, -0) ? 0 : value;
}

function escapeCsv(value: string) {
  if (!/[",\n\r]/.test(value)) {
    return value;
  }

  return `"${value.replaceAll('"', '""')}"`;
}
