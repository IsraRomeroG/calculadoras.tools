export type AttendanceInputMode = "attended" | "absences";
export type AttendanceViability = "cumple" | "recuperable" | "imposible";
export type AttendanceStatus = "meets" | "below";

export interface AttendanceInput {
  totalClasses: number;
  mode: AttendanceInputMode;
  attendedClasses?: number | null;
  absences?: number | null;
  requiredPercent: number;
  remainingClasses?: number | null;
}

export interface AttendanceResult {
  totalClasses: number;
  attendedClasses: number;
  currentAbsences: number;
  requiredPercent: number;
  remainingClasses: number;
  finalTotalClasses: number;
  currentPercent: number;
  currentStatus: AttendanceStatus;
  viability: AttendanceViability;
  minimumAttendancesFinal: number;
  maximumFinalAbsences: number;
  rawAvailableAbsences: number;
  availableAbsences: number;
  exceededAbsences: number;
  attendancesNeededFromRemaining: number;
  minimumRemainingAttendances: number;
  consecutiveClassesToRecover: number | null;
  recoverySearchLimitExceeded: boolean;
  marginPoints: number;
  maxPossiblePercent: number;
  actionMessage: string;
}

export type ParseAttendanceIntegerResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "zero" | "too_large";
    };

export type ParseAttendancePercentResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error:
        | "required"
        | "invalid"
        | "negative"
        | "too_large"
        | "too_many_decimals";
    };

export const ATTENDANCE_CANONICAL_PATH =
  "/matematicas/calculadora-porcentaje-asistencia-escolar";

export const ATTENDANCE_EXAMPLES = [
  {
    id: "regular",
    label: "40 clases, 80%",
    values: {
      totalClasses: "40",
      mode: "attended",
      attendedClasses: "34",
      absences: "6",
      requiredPercent: "80",
      remainingClasses: "10",
    },
  },
  {
    id: "recover",
    label: "Recuperar",
    values: {
      totalClasses: "40",
      mode: "attended",
      attendedClasses: "30",
      absences: "10",
      requiredPercent: "80",
      remainingClasses: "10",
    },
  },
  {
    id: "no-margin",
    label: "Sin margen",
    values: {
      totalClasses: "20",
      mode: "absences",
      attendedClasses: "16",
      absences: "4",
      requiredPercent: "80",
      remainingClasses: "5",
    },
  },
] as const;

const MAX_CLASSES = 1000;
const MAX_PERCENT_DECIMALS = 4;
const RECOVERY_SEARCH_LIMIT = 1000;
const EPSILON = 1e-9;

export function calculateAttendance(input: AttendanceInput): AttendanceResult {
  const totalClasses = normalizeInteger(
    input.totalClasses,
    1,
    MAX_CLASSES,
    "El total de clases debe estar entre 1 y 1000.",
  );
  const remainingClasses = normalizeInteger(
    input.remainingClasses ?? 0,
    0,
    MAX_CLASSES,
    "Las clases restantes deben estar entre 0 y 1000.",
  );
  const requiredPercent = normalizeRequiredPercent(input.requiredPercent);
  const attendedClasses =
    input.mode === "absences"
      ? totalClasses -
        normalizeInteger(
          input.absences ?? Number.NaN,
          0,
          totalClasses,
          "Las faltas no pueden superar el total de clases.",
        )
      : normalizeInteger(
          input.attendedClasses ?? Number.NaN,
          0,
          totalClasses,
          "Las clases asistidas no pueden superar el total de clases.",
        );
  const currentAbsences = totalClasses - attendedClasses;
  const minimum = requiredPercent / 100;
  const finalTotalClasses = totalClasses + remainingClasses;
  const minimumAttendancesFinal = Math.ceil(finalTotalClasses * minimum - EPSILON);
  const maximumFinalAbsences = finalTotalClasses - minimumAttendancesFinal;
  const rawAvailableAbsences = maximumFinalAbsences - currentAbsences;
  const availableAbsences =
    rawAvailableAbsences < 0
      ? rawAvailableAbsences
      : Math.min(rawAvailableAbsences, remainingClasses);
  const exceededAbsences = Math.max(0, -rawAvailableAbsences);
  const currentPercent = roundToDecimals((attendedClasses / totalClasses) * 100, 2);
  const marginPoints = roundToDecimals(currentPercent - requiredPercent, 2);
  const maxPossiblePercent = roundToDecimals(
    ((attendedClasses + remainingClasses) / finalTotalClasses) * 100,
    2,
  );
  const currentStatus =
    currentPercent + EPSILON >= requiredPercent ? "meets" : "below";
  const attendancesNeededFromRemaining = Math.max(
    0,
    minimumAttendancesFinal - attendedClasses,
  );
  const minimumRemainingAttendances = Math.min(
    attendancesNeededFromRemaining,
    remainingClasses,
  );
  const isPossibleFinal = attendancesNeededFromRemaining <= remainingClasses;
  const viability = getViability(currentStatus, isPossibleFinal);
  const recovery = calculateConsecutiveClassesToRecover({
    attendedClasses,
    totalClasses,
    requiredPercent,
  });
  const resultWithoutMessage = {
    totalClasses,
    attendedClasses,
    currentAbsences,
    requiredPercent,
    remainingClasses,
    finalTotalClasses,
    currentPercent,
    currentStatus,
    viability,
    minimumAttendancesFinal,
    maximumFinalAbsences,
    rawAvailableAbsences,
    availableAbsences,
    exceededAbsences,
    attendancesNeededFromRemaining,
    minimumRemainingAttendances,
    consecutiveClassesToRecover: recovery.value,
    recoverySearchLimitExceeded: recovery.limitExceeded,
    marginPoints,
    maxPossiblePercent,
  };

  return {
    ...resultWithoutMessage,
    actionMessage: buildAttendanceActionMessage(resultWithoutMessage),
  };
}

export function parseAttendanceInteger(
  value: string,
  options: {
    required?: boolean;
    allowZero?: boolean;
    max?: number;
  } = {},
): ParseAttendanceIntegerResult {
  const required = options.required ?? true;
  const allowZero = options.allowZero ?? true;
  const max = options.max ?? MAX_CLASSES;
  const trimmed = value.trim();

  if (!trimmed) {
    return required
      ? { ok: false, error: "required" }
      : { ok: true, value: 0, normalized: "" };
  }

  if (/[-\u2212]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const normalized = normalizeIntegerText(trimmed);

  if (!normalized) {
    return { ok: false, error: "invalid" };
  }

  const parsed = Number(normalized);

  if (!Number.isSafeInteger(parsed)) {
    return { ok: false, error: "invalid" };
  }

  if (!allowZero && parsed === 0) {
    return { ok: false, error: "zero" };
  }

  if (parsed > max) {
    return { ok: false, error: "too_large" };
  }

  return { ok: true, value: parsed, normalized };
}

export function parseAttendancePercent(
  value: string,
  options: {
    required?: boolean;
  } = {},
): ParseAttendancePercentResult {
  const required = options.required ?? true;
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

  const normalized = normalizeDecimalSeparators(cleaned);

  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const decimalPart = normalized.split(".")[1];

  if (decimalPart && decimalPart.length > MAX_PERCENT_DECIMALS) {
    return { ok: false, error: "too_many_decimals" };
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    return { ok: false, error: "invalid" };
  }

  if (parsed > 100) {
    return { ok: false, error: "too_large" };
  }

  return { ok: true, value: parsed, normalized };
}

export function buildAttendanceSummary(result: AttendanceResult): string {
  return [
    "Calculadora de asistencia escolar - calculadoras.tools",
    `Porcentaje actual: ${formatAttendancePercent(result.currentPercent)}`,
    `Estado: ${result.currentStatus === "meets" ? "cumple" : "por debajo"}`,
    `Minimo requerido: ${formatAttendancePercent(result.requiredPercent)}`,
    `Clases realizadas: ${result.totalClasses}`,
    `Asistencias: ${result.attendedClasses}`,
    `Faltas acumuladas: ${result.currentAbsences}`,
    `Clases restantes: ${result.remainingClasses}`,
    `Faltas disponibles: ${formatAttendanceCount(result.availableAbsences)}`,
    `Clases necesarias de las restantes: ${result.minimumRemainingAttendances}`,
    `Viabilidad: ${result.viability}`,
    result.actionMessage,
  ].join("\n");
}

export function formatAttendancePercent(value: number): string {
  return `${formatAttendanceNumber(value)}%`;
}

export function formatAttendanceNumber(value: number): string {
  assertFiniteNumber(value);

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 2,
  }).format(roundToDecimals(value, 2));
}

export function formatSignedAttendanceNumber(value: number): string {
  assertFiniteNumber(value);

  if (Math.abs(value) <= EPSILON) {
    return "0";
  }

  return `${value > 0 ? "+" : ""}${formatAttendanceNumber(value)}`;
}

export function formatAttendanceCount(value: number): string {
  assertFiniteNumber(value);

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 0,
  }).format(Math.trunc(value));
}

export function pluralizeClasses(value: number, singular = "clase"): string {
  return Math.abs(value) === 1 ? singular : `${singular}s`;
}

function getViability(
  currentStatus: AttendanceStatus,
  isPossibleFinal: boolean,
): AttendanceViability {
  if (currentStatus === "meets") {
    return "cumple";
  }

  return isPossibleFinal ? "recuperable" : "imposible";
}

function buildAttendanceActionMessage(
  result: Omit<AttendanceResult, "actionMessage">,
): string {
  if (result.currentStatus === "meets" && result.availableAbsences > 0) {
    return `Puedes faltar ${formatAttendanceCount(result.availableAbsences)} ${pluralizeClasses(
      result.availableAbsences,
    )} mas y seguir cumpliendo el ${formatAttendancePercent(
      result.requiredPercent,
    )} requerido.`;
  }

  if (result.currentStatus === "meets") {
    return "Cumples el minimo, pero no tienes faltas disponibles con las clases restantes capturadas.";
  }

  if (result.viability === "recuperable") {
    return `Necesitas asistir al menos ${formatAttendanceCount(
      result.minimumRemainingAttendances,
    )} de las ${formatAttendanceCount(
      result.remainingClasses,
    )} clases restantes para llegar al minimo.`;
  }

  if (result.remainingClasses === 0) {
    return "Con las clases registradas estas por debajo del minimo requerido.";
  }

  return `Aunque asistas a todas las clases restantes, llegarias a ${formatAttendancePercent(
    result.maxPossiblePercent,
  )}.`;
}

function calculateConsecutiveClassesToRecover({
  attendedClasses,
  totalClasses,
  requiredPercent,
}: {
  attendedClasses: number;
  totalClasses: number;
  requiredPercent: number;
}): { value: number | null; limitExceeded: boolean } {
  if (requiredPercent <= 0) {
    return { value: 0, limitExceeded: false };
  }

  const minimum = requiredPercent / 100;
  const currentPercent = (attendedClasses / totalClasses) * 100;

  if (currentPercent + EPSILON >= requiredPercent) {
    return { value: 0, limitExceeded: false };
  }

  if (minimum >= 1) {
    return { value: null, limitExceeded: false };
  }

  const requiredClasses = Math.ceil(
    (minimum * totalClasses - attendedClasses) / (1 - minimum) - EPSILON,
  );

  if (requiredClasses > RECOVERY_SEARCH_LIMIT) {
    return { value: null, limitExceeded: true };
  }

  return { value: Math.max(0, requiredClasses), limitExceeded: false };
}

function normalizeRequiredPercent(value: number): number {
  assertFiniteNumber(value);

  if (value < 0 || value > 100) {
    throw new RangeError("El minimo requerido debe estar entre 0 y 100.");
  }

  return value;
}

function normalizeInteger(
  value: number,
  min: number,
  max: number,
  message: string,
): number {
  assertFiniteNumber(value);

  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(message);
  }

  return value;
}

function normalizeIntegerText(value: string): string | null {
  const compact = value.replace(/\s/g, "");

  if (/^\d+$/.test(compact)) {
    return compact;
  }

  if (/^\d{1,3}([,.]\d{3})+$/.test(compact)) {
    return compact.replace(/[,.]/g, "");
  }

  return null;
}

function normalizeDecimalSeparators(value: string): string {
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
    return normalizeSingleDecimalSeparator(value, ",");
  }

  if (lastDot !== -1) {
    return normalizeSingleDecimalSeparator(value, ".");
  }

  return value;
}

function normalizeSingleDecimalSeparator(
  value: string,
  separator: "," | ".",
): string {
  const parts = value.split(separator);

  if (parts.length === 2) {
    const [integerPart, fractionalOrGroup] = parts;

    if (!integerPart || !fractionalOrGroup) {
      return value;
    }

    if (fractionalOrGroup.length === 3 && integerPart.length <= 3) {
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

function roundToDecimals(value: number, decimals: number): number {
  const factor = 10 ** Math.max(0, Math.trunc(decimals));

  return normalizeNegativeZero(
    Math.round((value + Number.EPSILON) * factor) / factor,
  );
}

function normalizeNegativeZero(value: number): number {
  return Object.is(value, -0) ? 0 : value;
}

function assertFiniteNumber(value: number): void {
  if (!Number.isFinite(value)) {
    throw new RangeError("Todos los valores deben ser numeros finitos.");
  }
}
