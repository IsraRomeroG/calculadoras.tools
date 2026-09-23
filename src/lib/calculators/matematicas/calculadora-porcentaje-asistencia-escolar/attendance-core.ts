export type AttendanceInputMode = "attended" | "absences";
export type AttendanceCalendarMode = "remaining" | "total";
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

export type ParseAttendanceRemainingResult =
  | { ok: true; value: number | null; normalized: string }
  | {
      ok: false;
      error: "invalid" | "negative" | "too_large";
    };

export type ParseAttendanceCourseTotalResult =
  | { ok: true; value: number | null; normalized: string }
  | {
      ok: false;
      error: "invalid" | "negative" | "zero" | "too_large" | "too_small" | "too_many_remaining";
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
export const MAX_COURSE_TOTAL_CLASSES = 2000;
export const MAX_PERCENT_DECIMALS = 4;
export const PERCENT_SCALE = 10_000;
export const ATTENDANCE_RATIO_SCALE = 100 * PERCENT_SCALE;

export interface AttendanceCalendarState {
  calendarMode: AttendanceCalendarMode;
  remainingClasses: number | null;
  courseTotalClasses: number | null;
}

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

  const percent = normalizeAttendancePercent(input.requiredPercent);
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
  options: { allowZero?: boolean; max?: number } = {},
): ParseAttendanceIntegerResult {
  const allowZero = options.allowZero ?? true;
  const max = options.max ?? MAX_ATTENDANCE_CLASSES;
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }
  if (/^[-\u2212]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const normalized = normalizeIntegerText(trimmed);
  if (normalized === null) {
    return { ok: false, error: "invalid" };
  }

  const significantDigits = normalized.replace(/^0+/, "") || "0";
  const maxText = String(max);
  if (
    significantDigits.length > maxText.length ||
    (significantDigits.length === maxText.length && significantDigits > maxText)
  ) {
    return { ok: false, error: "too_large" };
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

export function parseAttendanceRemaining(
  value: string,
): ParseAttendanceRemainingResult {
  if (!value.trim()) {
    return { ok: true, value: null, normalized: "" };
  }

  const parsed = parseAttendanceInteger(value, {
    allowZero: true,
    max: MAX_ATTENDANCE_CLASSES,
  });
  if (!parsed.ok) {
    return {
      ok: false,
      error:
        parsed.error === "required" || parsed.error === "zero"
          ? "invalid"
          : parsed.error,
    };
  }
  return parsed;
}

export function parseAttendanceCourseTotal(
  value: string,
  totalClasses?: number,
): ParseAttendanceCourseTotalResult {
  if (!value.trim()) return { ok: true, value: null, normalized: "" };
  const parsed = parseAttendanceInteger(value, {
    allowZero: true,
    max: MAX_COURSE_TOTAL_CLASSES,
  });
  if (!parsed.ok) {
    return {
      ok: false,
      error:
        parsed.error === "negative"
          ? "negative"
          : parsed.error === "too_large"
            ? "too_large"
            : "invalid",
    };
  }
  if (parsed.value === 0) return { ok: false, error: "zero" };
  if (totalClasses !== undefined) {
    if (!Number.isSafeInteger(totalClasses) || totalClasses < 1 || totalClasses > MAX_ATTENDANCE_CLASSES) {
      throw new RangeError("Total classes must be an integer between 1 and 1000.");
    }
    if (parsed.value < totalClasses) return { ok: false, error: "too_small" };
    if (parsed.value - totalClasses > MAX_ATTENDANCE_CLASSES) {
      return { ok: false, error: "too_many_remaining" };
    }
  }
  return parsed;
}

export function normalizeAttendanceCalendar(input: {
  totalClasses: number;
  calendarMode: AttendanceCalendarMode;
  remainingClasses?: number | null;
  courseTotalClasses?: number | null;
}): AttendanceCalendarState {
  if (input.calendarMode !== "remaining" && input.calendarMode !== "total") {
    throw new RangeError("Calendar mode must be remaining or total.");
  }
  if (!Number.isSafeInteger(input.totalClasses) || input.totalClasses < 1 || input.totalClasses > MAX_ATTENDANCE_CLASSES) {
    throw new RangeError("Total classes must be an integer between 1 and 1000.");
  }
  if (input.calendarMode === "remaining") {
    const remaining = input.remainingClasses ?? null;
    if (remaining !== null && (!Number.isSafeInteger(remaining) || remaining < 0 || remaining > MAX_ATTENDANCE_CLASSES)) {
      throw new RangeError("Remaining classes must be an integer between 0 and 1000 or null.");
    }
    return {
      calendarMode: input.calendarMode,
      remainingClasses: remaining,
      courseTotalClasses: remaining === null ? null : input.totalClasses + remaining,
    };
  }
  const courseTotal = input.courseTotalClasses ?? null;
  if (courseTotal === null) {
    return { calendarMode: input.calendarMode, remainingClasses: null, courseTotalClasses: null };
  }
  if (!Number.isSafeInteger(courseTotal) || courseTotal < input.totalClasses || courseTotal > input.totalClasses + MAX_ATTENDANCE_CLASSES) {
    throw new RangeError("Course total must be at least the classes held so far and no more than 1000 remaining classes.");
  }
  return {
    calendarMode: input.calendarMode,
    remainingClasses: courseTotal - input.totalClasses,
    courseTotalClasses: courseTotal,
  };
}

export function parseAttendancePercent(
  value: string,
): ParseAttendancePercentResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }
  if (/^[-\u2212]/.test(trimmed)) {
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
  const significantIntegerPart = integerPart.replace(/^0+/, "") || "0";
  if (
    significantIntegerPart.length > 3 ||
    Number(significantIntegerPart) > 100 ||
    (Number(significantIntegerPart) === 100 && /[1-9]/.test(fractionPart))
  ) {
    return { ok: false, error: "too_large" };
  }
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
  const quotient = Math.floor(numerator / denominator);
  return quotient + (numerator % denominator === 0 ? 0 : 1);
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

export function normalizeAttendancePercent(
  value: AttendancePercent | number,
): AttendancePercent {
  if (typeof value !== "number") {
    if (
      typeof value !== "object" ||
      value === null ||
      typeof value.normalized !== "string"
    ) {
      throw new RangeError("Required percent must be between 0 and 100 with up to 4 decimals.");
    }
    const parsed = parseAttendancePercent(value.normalized);
    if (
      !Number.isFinite(value.value) ||
      !Number.isSafeInteger(value.scaled) ||
      value.scaled < 0 ||
      value.scaled > ATTENDANCE_RATIO_SCALE ||
      !parsed.ok ||
      parsed.scaled !== value.scaled ||
      parsed.value !== value.value ||
      parsed.normalized !== value.normalized
    ) {
      throw new RangeError("Required percent must be between 0 and 100 with up to 4 decimals.");
    }
    return parsed;
  }

  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError("Required percent must be between 0 and 100 with up to 4 decimals.");
  }
  const normalizedValue = Number(value.toFixed(MAX_PERCENT_DECIMALS));
  if (normalizedValue !== value) {
    throw new RangeError("Required percent must have no more than 4 decimals.");
  }
  const scaled = normalizedValue * PERCENT_SCALE;
  if (!Number.isSafeInteger(scaled)) {
    throw new RangeError("Required percent must have no more than 4 decimals.");
  }
  const parsed = parseAttendancePercent(normalizedValue.toFixed(MAX_PERCENT_DECIMALS));
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
