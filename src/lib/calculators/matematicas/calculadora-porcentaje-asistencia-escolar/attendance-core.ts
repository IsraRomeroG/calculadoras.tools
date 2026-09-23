export type AttendanceInputMode = "attended" | "absences";
export type AttendanceStatus = "meets" | "below";
export type AttendanceProjectionStatus =
  | "unknown"
  | "finished_meets"
  | "finished_below"
  | "impossible"
  | "guaranteed"
  | "possible";

export interface AttendancePercent {
  value: number;
  /** Percentage scaled to four decimal places: 80.125% => 801250. */
  scaled: number;
  normalized: string;
}

export interface AttendanceInput {
  totalClasses: number;
  mode: AttendanceInputMode;
  attendedClasses?: number | null;
  absences?: number | null;
  requiredPercent: AttendancePercent | number;
  remainingClasses?: number | null;
}

interface KnownProjection {
  status: Exclude<AttendanceProjectionStatus, "unknown">;
  remainingClasses: number;
  finalTotalClasses: number;
  minimumAttendancesFinal: number;
  maximumFinalAbsences: number;
  availableAbsences: number;
  exceededAbsences: number;
  requiredAttendancesFromRemaining: number;
  maxPossiblePercent: number;
}

export type AttendanceProjection =
  | { status: "unknown"; remainingClasses: null }
  | KnownProjection;

export interface AttendanceResult {
  inputMode: AttendanceInputMode;
  totalClasses: number;
  attendedClasses: number;
  currentAbsences: number;
  requiredPercent: number;
  requiredPercentScaled: number;
  requiredPercentText: string;
  currentPercent: number;
  currentStatus: AttendanceStatus;
  marginPoints: number;
  projection: AttendanceProjection;
  consecutiveClassesToRecover: number | null;
}

export type ParseAttendanceIntegerResult =
  | { ok: true; value: number; normalized: string }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "zero" | "too_large";
    };

export type ParseAttendancePercentResult =
  | ({ ok: true } & AttendancePercent)
  | {
      ok: false;
      error:
        | "required"
        | "invalid"
        | "negative"
        | "too_large"
        | "too_many_decimals";
    };

export const MAX_ATTENDANCE_CLASSES = 1000;
export const MAX_PERCENT_DECIMALS = 4;
export const PERCENT_SCALE = 10_000;
export const ATTENDANCE_RATIO_SCALE = 100 * PERCENT_SCALE;

export function calculateAttendanceCore(input: AttendanceInput): AttendanceResult {
  const totalClasses = normalizeInteger(
    input.totalClasses,
    1,
    MAX_ATTENDANCE_CLASSES,
    "Total classes must be an integer between 1 and 1000.",
  );

  if (input.mode !== "attended" && input.mode !== "absences") {
    throw new RangeError("Attendance mode must be attended or absences.");
  }

  const percent = normalizePercent(input.requiredPercent);
  const remainingClasses = normalizeRemaining(input.remainingClasses);
  const attendedClasses =
    input.mode === "absences"
      ? totalClasses -
        normalizeInteger(
          input.absences ?? Number.NaN,
          0,
          totalClasses,
          "Absences must be an integer no greater than total classes.",
        )
      : normalizeInteger(
          input.attendedClasses ?? Number.NaN,
          0,
          totalClasses,
          "Attended classes must be an integer no greater than total classes.",
        );
  const currentAbsences = totalClasses - attendedClasses;
  const currentDelta =
    attendedClasses * ATTENDANCE_RATIO_SCALE - totalClasses * percent.scaled;
  const currentStatus: AttendanceStatus = currentDelta >= 0 ? "meets" : "below";
  const currentPercent = (100 * attendedClasses) / totalClasses;
  const marginPoints =
    (100 * currentDelta) / (totalClasses * ATTENDANCE_RATIO_SCALE);
  const consecutiveClassesToRecover = calculateRecovery({
    totalClasses,
    attendedClasses,
    requiredPercentScaled: percent.scaled,
    currentStatus,
  });

  return {
    inputMode: input.mode,
    totalClasses,
    attendedClasses,
    currentAbsences,
    requiredPercent: percent.value,
    requiredPercentScaled: percent.scaled,
    requiredPercentText: percent.normalized,
    currentPercent,
    currentStatus,
    marginPoints,
    projection:
      remainingClasses === null
        ? { status: "unknown", remainingClasses: null }
        : calculateProjection({
            totalClasses,
            attendedClasses,
            currentAbsences,
            currentStatus,
            remainingClasses,
            requiredPercentScaled: percent.scaled,
          }),
    consecutiveClassesToRecover,
  };
}

export function parseAttendanceInteger(
  value: string,
  options: { required?: boolean; allowZero?: boolean; max?: number } = {},
): ParseAttendanceIntegerResult {
  const required = options.required ?? true;
  const allowZero = options.allowZero ?? true;
  const max = options.max ?? MAX_ATTENDANCE_CLASSES;
  const trimmed = value.trim();

  if (!trimmed) {
    return required
      ? { ok: false, error: "required" }
      : { ok: true, value: 0, normalized: "" };
  }
  if (/[-+\u2212]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const normalized = normalizeIntegerText(trimmed);
  if (normalized === null) {
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
  options: { required?: boolean } = {},
): ParseAttendancePercentResult {
  const required = options.required ?? true;
  const trimmed = value.trim();

  if (!trimmed) {
    return required
      ? { ok: false, error: "required" }
      : { ok: false, error: "required" };
  }
  if (/[-+\u2212]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const precisionMatch = trimmed.match(/^\d+[.,](\d+)(?: %|%)?$/);
  if (precisionMatch && precisionMatch[1].length > MAX_PERCENT_DECIMALS) {
    return { ok: false, error: "too_many_decimals" };
  }

  const match = trimmed.match(/^(\d+)(?:[.,](\d{1,4}))?(?: %|%)?$/);
  if (!match) {
    return { ok: false, error: "invalid" };
  }

  const integerPart = match[1];
  const fractionPart = match[2] ?? "";
  const scaled =
    Number(integerPart) * PERCENT_SCALE +
    Number(fractionPart.padEnd(MAX_PERCENT_DECIMALS, "0") || "0");

  if (!Number.isSafeInteger(scaled)) {
    return { ok: false, error: "invalid" };
  }
  if (scaled > ATTENDANCE_RATIO_SCALE) {
    return { ok: false, error: "too_large" };
  }

  const normalizedFraction = fractionPart.replace(/0+$/, "");
  const normalized = normalizedFraction
    ? `${Number(integerPart)}.${normalizedFraction}`
    : String(Number(integerPart));
  return { ok: true, value: scaled / PERCENT_SCALE, scaled, normalized };
}

export function ceilDiv(numerator: number, denominator: number): number {
  if (!Number.isSafeInteger(numerator) || numerator < 0) {
    throw new RangeError("The numerator must be a non-negative safe integer.");
  }
  if (!Number.isSafeInteger(denominator) || denominator <= 0) {
    throw new RangeError("The denominator must be a positive safe integer.");
  }
  return Math.floor((numerator + denominator - 1) / denominator);
}

function calculateProjection({
  totalClasses,
  attendedClasses,
  currentAbsences,
  currentStatus,
  remainingClasses,
  requiredPercentScaled,
}: {
  totalClasses: number;
  attendedClasses: number;
  currentAbsences: number;
  currentStatus: AttendanceStatus;
  remainingClasses: number;
  requiredPercentScaled: number;
}): KnownProjection {
  const finalTotalClasses = totalClasses + remainingClasses;
  const minimumAttendancesFinal = ceilDiv(
    finalTotalClasses * requiredPercentScaled,
    ATTENDANCE_RATIO_SCALE,
  );
  const maximumFinalAbsences = finalTotalClasses - minimumAttendancesFinal;
  const rawAvailableAbsences = maximumFinalAbsences - currentAbsences;
  const availableAbsences = Math.max(
    0,
    Math.min(remainingClasses, rawAvailableAbsences),
  );
  const exceededAbsences = Math.max(0, -rawAvailableAbsences);
  const requiredAttendancesFromRemaining = Math.max(
    0,
    minimumAttendancesFinal - attendedClasses,
  );
  const maxPossiblePercent =
    (100 * (attendedClasses + remainingClasses)) / finalTotalClasses;

  let status: KnownProjection["status"];
  if (remainingClasses === 0) {
    status = currentStatus === "meets" ? "finished_meets" : "finished_below";
  } else if (requiredAttendancesFromRemaining > remainingClasses) {
    status = "impossible";
  } else if (requiredAttendancesFromRemaining === 0) {
    status = "guaranteed";
  } else {
    status = "possible";
  }

  return {
    status,
    remainingClasses,
    finalTotalClasses,
    minimumAttendancesFinal,
    maximumFinalAbsences,
    availableAbsences,
    exceededAbsences,
    requiredAttendancesFromRemaining,
    maxPossiblePercent,
  };
}

function calculateRecovery({
  totalClasses,
  attendedClasses,
  requiredPercentScaled,
  currentStatus,
}: {
  totalClasses: number;
  attendedClasses: number;
  requiredPercentScaled: number;
  currentStatus: AttendanceStatus;
}): number | null {
  if (currentStatus === "meets") {
    return 0;
  }
  if (requiredPercentScaled === ATTENDANCE_RATIO_SCALE) {
    return null;
  }
  return ceilDiv(
    totalClasses * requiredPercentScaled -
      attendedClasses * ATTENDANCE_RATIO_SCALE,
    ATTENDANCE_RATIO_SCALE - requiredPercentScaled,
  );
}

function normalizePercent(value: AttendancePercent | number): AttendancePercent {
  if (typeof value !== "number") {
    const parsed = parseAttendancePercent(value.normalized);
    if (
      !Number.isFinite(value.value) ||
      !Number.isSafeInteger(value.scaled) ||
      value.scaled < 0 ||
      value.scaled > ATTENDANCE_RATIO_SCALE ||
      value.value !== value.scaled / PERCENT_SCALE ||
      !parsed.ok ||
      parsed.scaled !== value.scaled
    ) {
      throw new RangeError("Required percent must be between 0 and 100 with up to 4 decimals.");
    }
    return parsed;
  }

  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError("Required percent must be between 0 and 100 with up to 4 decimals.");
  }
  const scaled = Math.round(value * PERCENT_SCALE);
  if (Math.abs(value - scaled / PERCENT_SCALE) > Number.EPSILON * 100) {
    throw new RangeError("Required percent must have no more than 4 decimals.");
  }
  const parsed = parseAttendancePercent((scaled / PERCENT_SCALE).toFixed(4));
  if (!parsed.ok) {
    throw new RangeError("Required percent must be valid.");
  }
  return parsed;
}

function normalizeRemaining(value: number | null | undefined): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  return normalizeInteger(
    value,
    0,
    MAX_ATTENDANCE_CLASSES,
    "Remaining classes must be an integer between 0 and 1000 or null.",
  );
}

function normalizeInteger(
  value: number,
  min: number,
  max: number,
  message: string,
): number {
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(message);
  }
  return value;
}

function normalizeIntegerText(value: string): string | null {
  if (/^\d+$/.test(value)) {
    return value;
  }
  if (/^\d{1,3}(?:[,.]\d{3})+$/.test(value)) {
    const separator = value.includes(",") ? "," : ".";
    if (value.includes(separator === "," ? "." : ",")) {
      return null;
    }
    return value.replaceAll(separator, "");
  }
  return null;
}
