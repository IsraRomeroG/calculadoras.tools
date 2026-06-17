export type GradeScalePreset = "0-10" | "0-100" | "0-4" | "custom";
export type GpaMethod = "linear" | "none";

export interface CourseInput {
  name: string;
  grade: number;
  credits?: number | null;
}

export interface GpaCalculatorInput {
  scaleMax: number;
  courses: CourseInput[];
  passingGrade?: number | null;
  targetAverage?: number | null;
  remainingCredits?: number | null;
  gpaMethod?: GpaMethod;
}

export interface CourseResult {
  name: string;
  grade: number;
  credits: number;
  creditsProvided: boolean;
  passed: boolean | null;
  contribution: number;
  weightPercent: number;
  gapToPassing: number | null;
}

export interface TargetResult {
  targetAverage: number;
  gap: number;
  requiredAverage: number | null;
  status: "met" | "reachable" | "unreachable" | "needs_remaining_credits";
}

export interface GpaCalculatorResult {
  scaleMax: number;
  simpleAverage: number;
  weightedAverage: number;
  gpa: number | null;
  totalCredits: number;
  courseCount: number;
  passedCount: number | null;
  failedCount: number | null;
  hasExplicitCredits: boolean;
  hasMissingCreditsInWeightedMode: boolean;
  courses: CourseResult[];
  bestCourse: CourseResult;
  worstCourse: CourseResult;
  impactCourses: CourseResult[];
  target: TargetResult | null;
  messages: string[];
}

export type ParseGpaNumberResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "zero" | "too_many_decimals";
    };

export const GPA_CANONICAL_PATH =
  "/matematicas/calculadora-promedio-escolar-gpa";

export const GPA_EXAMPLES = [
  {
    id: "secundaria",
    label: "Sin creditos",
    scale: "0-10",
    passingGrade: "6",
    targetAverage: "9",
    remainingCredits: "4",
    courses: [
      { name: "Matematicas", grade: "8.5", credits: "" },
      { name: "Historia", grade: "9", credits: "" },
      { name: "Biologia", grade: "10", credits: "" },
    ],
  },
  {
    id: "universidad",
    label: "Con creditos",
    scale: "0-100",
    passingGrade: "70",
    targetAverage: "88",
    remainingCredits: "9",
    courses: [
      { name: "Calculo", grade: "84", credits: "8" },
      { name: "Fisica", grade: "91", credits: "6" },
      { name: "Redaccion", grade: "96", credits: "4" },
      { name: "Programacion", grade: "89", credits: "7" },
    ],
  },
] as const;

const DEFAULT_DECIMALS = 2;
const MAX_INPUT_DECIMALS = 4;

export function getScaleMaxFromPreset(
  preset: GradeScalePreset,
  customMax?: number | null,
): number {
  if (preset === "0-10") {
    return 10;
  }

  if (preset === "0-100") {
    return 100;
  }

  if (preset === "0-4") {
    return 4;
  }

  if (typeof customMax === "number" && Number.isFinite(customMax) && customMax > 0) {
    return customMax;
  }

  throw new RangeError("La escala personalizada debe ser mayor que cero.");
}

export function calculateGpa(input: GpaCalculatorInput): GpaCalculatorResult {
  assertValidGpaInput(input);

  const courses = input.courses.map((course, index) =>
    normalizeCourse(course, index),
  );
  const hasExplicitCredits = courses.some((course) => course.creditsProvided);
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  const simpleAverage =
    courses.reduce((sum, course) => sum + course.grade, 0) / courses.length;
  const weightedAverage =
    courses.reduce(
      (sum, course) => sum + course.grade * course.credits,
      0,
    ) / totalCredits;
  const gpa =
    input.gpaMethod === "none"
      ? null
      : clamp((weightedAverage / input.scaleMax) * 4, 0, 4);
  const passingGrade = normalizeOptionalNumber(input.passingGrade);
  const resultCourses = courses.map((course) =>
    buildCourseResult(course, totalCredits, passingGrade),
  );
  const sortedByGrade = [...resultCourses].sort((a, b) => b.grade - a.grade);
  const impactCourses = [...resultCourses]
    .sort((a, b) => b.weightPercent - a.weightPercent || b.grade - a.grade)
    .slice(0, 3);
  const target = buildTargetResult({
    targetAverage: normalizeOptionalNumber(input.targetAverage),
    remainingCredits: normalizeOptionalNumber(input.remainingCredits),
    weightedAverage,
    totalCredits,
    scaleMax: input.scaleMax,
  });
  const hasMissingCreditsInWeightedMode =
    hasExplicitCredits && resultCourses.some((course) => !course.creditsProvided);
  const messages = buildMessages({
    hasExplicitCredits,
    hasMissingCreditsInWeightedMode,
    gpa,
    target,
  });

  return {
    scaleMax: input.scaleMax,
    simpleAverage,
    weightedAverage,
    gpa,
    totalCredits,
    courseCount: resultCourses.length,
    passedCount:
      passingGrade === null
        ? null
        : resultCourses.filter((course) => course.passed).length,
    failedCount:
      passingGrade === null
        ? null
        : resultCourses.filter((course) => course.passed === false).length,
    hasExplicitCredits,
    hasMissingCreditsInWeightedMode,
    courses: resultCourses,
    bestCourse: sortedByGrade[0],
    worstCourse: sortedByGrade[sortedByGrade.length - 1],
    impactCourses,
    target,
    messages,
  };
}

export function parseGpaNumber(
  value: string,
  options: {
    required?: boolean;
    allowZero?: boolean;
    maxDecimals?: number;
  } = {},
): ParseGpaNumberResult {
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

export function formatGpaNumber(
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

export function formatFlexibleGpaNumber(value: number): string {
  assertFiniteNumber(value);

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 4,
  }).format(roundToDecimals(value, 4));
}

export function formatPercent(value: number): string {
  assertFiniteNumber(value);

  return `${new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 1,
  }).format(roundToDecimals(value, 1))}%`;
}

export function buildGpaSummary(result: GpaCalculatorResult): string {
  const lines = [
    "Calculadora de promedio escolar y GPA",
    `Promedio simple: ${formatGpaNumber(result.simpleAverage)}`,
    `Promedio ponderado: ${formatGpaNumber(result.weightedAverage)}`,
    `GPA aproximado: ${
      result.gpa === null ? "No calculado" : formatGpaNumber(result.gpa)
    }`,
    `Creditos totales: ${formatFlexibleGpaNumber(result.totalCredits)}`,
  ];

  if (result.passedCount !== null && result.failedCount !== null) {
    lines.push(
      `Aprobadas: ${result.passedCount}`,
      `Reprobadas: ${result.failedCount}`,
    );
  }

  if (result.target) {
    lines.push(`Meta: ${formatGpaNumber(result.target.targetAverage)}`);
    lines.push(`Brecha: ${formatSignedNumber(result.target.gap)}`);

    if (result.target.requiredAverage !== null) {
      lines.push(
        `Calificacion necesaria: ${formatGpaNumber(
          result.target.requiredAverage,
        )}`,
      );
    }
  }

  lines.push(
    "",
    "Materias:",
    ...result.courses.map((course) => {
      const status =
        course.passed === null ? "" : course.passed ? " - aprobada" : " - reprobada";

      return `${course.name}: ${formatFlexibleGpaNumber(
        course.grade,
      )} (${formatFlexibleGpaNumber(course.credits)} creditos${status})`;
    }),
  );

  return lines.join("\n");
}

export function buildGpaCsv(result: GpaCalculatorResult): string {
  return [
    "materia,calificacion,creditos,estado,impacto",
    ...result.courses.map((course) =>
      [
        escapeCsv(course.name),
        formatFlexibleGpaNumber(course.grade),
        formatFlexibleGpaNumber(course.credits),
        course.passed === null
          ? "sin nota minima"
          : course.passed
            ? "aprobada"
            : "reprobada",
        formatPercent(course.weightPercent),
      ].join(","),
    ),
  ].join("\n");
}

export function formatSignedNumber(value: number): string {
  assertFiniteNumber(value);

  const formatted = formatGpaNumber(Math.abs(value));

  if (value > 0) {
    return `+${formatted}`;
  }

  if (value < 0) {
    return `-${formatted}`;
  }

  return formatted;
}

function normalizeCourse(course: CourseInput, index: number) {
  const name = course.name.trim() || `Materia ${index + 1}`;
  const creditsProvided =
    typeof course.credits === "number" && Number.isFinite(course.credits);

  return {
    name,
    grade: course.grade,
    credits: creditsProvided ? Number(course.credits) : 1,
    creditsProvided,
  };
}

function buildCourseResult(
  course: ReturnType<typeof normalizeCourse>,
  totalCredits: number,
  passingGrade: number | null,
): CourseResult {
  const weightPercent = (course.credits / totalCredits) * 100;
  const passed = passingGrade === null ? null : course.grade >= passingGrade;

  return {
    ...course,
    passed,
    contribution: (course.grade * course.credits) / totalCredits,
    weightPercent,
    gapToPassing:
      passingGrade === null ? null : roundToDecimals(course.grade - passingGrade, 6),
  };
}

function buildTargetResult({
  targetAverage,
  remainingCredits,
  weightedAverage,
  totalCredits,
  scaleMax,
}: {
  targetAverage: number | null;
  remainingCredits: number | null;
  weightedAverage: number;
  totalCredits: number;
  scaleMax: number;
}): TargetResult | null {
  if (targetAverage === null) {
    return null;
  }

  const gap = targetAverage - weightedAverage;

  if (gap <= 0) {
    return {
      targetAverage,
      gap,
      requiredAverage: null,
      status: "met",
    };
  }

  if (remainingCredits === null) {
    return {
      targetAverage,
      gap,
      requiredAverage: null,
      status: "needs_remaining_credits",
    };
  }

  const requiredAverage =
    (targetAverage * (totalCredits + remainingCredits) -
      weightedAverage * totalCredits) /
    remainingCredits;

  return {
    targetAverage,
    gap,
    requiredAverage,
    status: requiredAverage <= scaleMax ? "reachable" : "unreachable",
  };
}

function buildMessages({
  hasExplicitCredits,
  hasMissingCreditsInWeightedMode,
  gpa,
  target,
}: {
  hasExplicitCredits: boolean;
  hasMissingCreditsInWeightedMode: boolean;
  gpa: number | null;
  target: TargetResult | null;
}) {
  const messages: string[] = [];

  if (!hasExplicitCredits) {
    messages.push(
      "Como no capturaste creditos, el promedio ponderado coincide con el promedio simple.",
    );
  }

  if (hasMissingCreditsInWeightedMode) {
    messages.push("Las materias sin creditos se toman con peso 1.");
  }

  if (gpa !== null) {
    messages.push(
      "El GPA es aproximado: usa una conversion lineal a escala 4.0 y puede variar por escuela.",
    );
  }

  if (target?.status === "unreachable") {
    messages.push(
      "Con los creditos restantes capturados, la calificacion necesaria supera la escala maxima.",
    );
  }

  return messages;
}

function assertValidGpaInput(input: GpaCalculatorInput) {
  assertPositiveNumber(input.scaleMax, "La escala maxima debe ser mayor que cero.");

  if (input.courses.length === 0) {
    throw new RangeError("Debe existir al menos una materia valida.");
  }

  input.courses.forEach((course) => {
    assertFiniteNumber(course.grade);

    if (course.grade < 0 || course.grade > input.scaleMax) {
      throw new RangeError("La calificacion debe estar dentro de la escala.");
    }

    if (course.credits !== null && course.credits !== undefined) {
      assertPositiveNumber(
        course.credits,
        "Los creditos deben ser mayores que cero.",
      );
    }
  });

  const optionalValues = [
    ["La nota minima debe estar dentro de la escala.", input.passingGrade],
    ["El promedio meta debe estar dentro de la escala.", input.targetAverage],
  ] as const;

  optionalValues.forEach(([message, value]) => {
    const normalized = normalizeOptionalNumber(value);

    if (normalized !== null && (normalized < 0 || normalized > input.scaleMax)) {
      throw new RangeError(message);
    }
  });

  const remainingCredits = normalizeOptionalNumber(input.remainingCredits);

  if (remainingCredits !== null) {
    assertPositiveNumber(
      remainingCredits,
      "Los creditos restantes deben ser mayores que cero.",
    );
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
  const factor = 10 ** decimals;

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

function escapeCsv(value: string) {
  if (!/[",\n\r]/.test(value)) {
    return value;
  }

  return `"${value.replaceAll('"', '""')}"`;
}
