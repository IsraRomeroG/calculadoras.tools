import type { AttendancePercent } from "./attendance-core";
import {
  PERCENT_SCALE,
  normalizeAttendancePercent,
} from "./attendance-core";

/** Versioned constants are intentionally independent from the page URL. */
export const ATTENDANCE_PHASE2_SCHEMA_VERSION = 1;
export const ATTENDANCE_PHASE2_RULES_VERSION = "attendance-phase-2.1";
export const ATTENDANCE_HISTORY_KEY = "calculadoras.tools.attendance.history.v1";
export const ATTENDANCE_SUBJECTS_KEY = "calculadoras.tools.attendance.subjects.v1";
export const MAX_ATTENDANCE_SUBJECTS = 20;
export const MAX_CALENDAR_EVENTS = 1000;
export const MAX_ATTENDANCE_HISTORY = 50;

export type JustifiedAttendanceRule = "absence" | "exclude" | "credit";
export type AttendanceRounding =
  | "exact"
  | { mode: "half-up"; decimals: 0 | 1 | 2 };

export interface AttendancePolicy {
  justified: JustifiedAttendanceRule;
  /** null disables tardy conversion; otherwise k is in the inclusive range 1..100. */
  tardyConversion: number | null;
  rounding: AttendanceRounding;
}

export const DEFAULT_ATTENDANCE_POLICY: Readonly<AttendancePolicy> = Object.freeze({
  justified: "absence",
  tardyConversion: null,
  rounding: "exact",
});

export type PolicyCurrentStatus = "meets" | "below" | "undefined";
export type PolicyProjectionStatus =
  | "unknown"
  | "undefined"
  | "finished_meets"
  | "finished_below"
  | "impossible"
  | "guaranteed"
  | "possible";

export interface PolicyAttendanceInput {
  totalClasses: number;
  attendedClasses: number;
  justifiedAbsences?: number;
  tardyClasses?: number;
  requiredPercent: AttendancePercent | number;
  remainingClasses?: number | null;
  policy?: Partial<AttendancePolicy>;
}

export interface PolicyAttendanceResult {
  totalClasses: number;
  attendedClasses: number;
  originalAbsences: number;
  justifiedAbsences: number;
  tardyClasses: number;
  requiredPercent: number;
  requiredPercentScaled: number;
  policy: AttendancePolicy;
  effectiveTotalClasses: number;
  effectiveAttendedClasses: number;
  effectiveAbsences: number;
  tardyPenalty: number;
  tardyRemainder: number;
  currentPercent: number | null;
  currentEvaluatedPercent: number | null;
  currentStatus: PolicyCurrentStatus;
  projection: PolicyProjection;
}

export type PolicyProjection =
  | { status: "unknown"; remainingClasses: null }
  | {
      status: "undefined";
      remainingClasses: number;
      finalTotalClasses: 0;
      minimumAttendancesFinal: null;
      maximumFinalAbsences: null;
      availableAbsences: null;
      exceededAbsences: null;
      requiredAttendancesFromRemaining: null;
      maxPossiblePercent: null;
      finalEvaluatedPercent: null;
    }
  | {
      status: Exclude<PolicyProjectionStatus, "unknown" | "undefined">;
      remainingClasses: number;
      finalTotalClasses: number;
      minimumAttendancesFinal: number;
      maximumFinalAbsences: number;
      availableAbsences: number;
      exceededAbsences: number;
      requiredAttendancesFromRemaining: number;
      maxPossiblePercent: number;
      finalEvaluatedPercent: number;
    };

export function normalizeAttendancePolicy(
  input: Partial<AttendancePolicy> = {},
): AttendancePolicy {
  const justified = input.justified ?? DEFAULT_ATTENDANCE_POLICY.justified;
  if (justified !== "absence" && justified !== "exclude" && justified !== "credit") {
    throw new RangeError("Justified attendance rule must be absence, exclude, or credit.");
  }

  const tardyConversion = input.tardyConversion ?? DEFAULT_ATTENDANCE_POLICY.tardyConversion;
  if (
    tardyConversion !== null &&
    (!Number.isSafeInteger(tardyConversion) || tardyConversion < 1 || tardyConversion > 100)
  ) {
    throw new RangeError("Tardy conversion must be null or an integer from 1 to 100.");
  }

  const rounding = input.rounding ?? DEFAULT_ATTENDANCE_POLICY.rounding;
  if (rounding !== "exact") {
    if (
      rounding.mode !== "half-up" ||
      ![0, 1, 2].includes(rounding.decimals)
    ) {
      throw new RangeError("Rounding must be exact or half-up to 0, 1, or 2 decimals.");
    }
  }

  return { justified, tardyConversion, rounding };
}

export function getRequiredPercentScaled(
  requiredPercent: AttendancePercent | number,
): number {
  return normalizeAttendancePercent(requiredPercent).scaled;
}

/** The exact shared predicate used by current, final, and recovery decisions. */
export function meetsPolicy(
  attended: number,
  total: number,
  requiredPercent: AttendancePercent | number,
  policy: Partial<AttendancePolicy> = {},
): boolean {
  assertRatioCounts(attended, total);
  const normalizedPolicy = normalizeAttendancePolicy(policy);
  const requiredScaled = getRequiredPercentScaled(requiredPercent);
  const a = BigInt(attended);
  const t = BigInt(total);
  const required = BigInt(requiredScaled);
  if (normalizedPolicy.rounding === "exact") {
    return a * BigInt(100 * PERCENT_SCALE) >= t * required;
  }
  const factor = 10n ** BigInt(normalizedPolicy.rounding.decimals);
  const roundedUnits = roundedPercentUnitsBigInt(
    attended,
    total,
    normalizedPolicy.rounding.decimals,
  );
  return roundedUnits * BigInt(PERCENT_SCALE) >= required * factor;
}

export const meetsAttendancePolicy = meetsPolicy;

export function roundedPercentUnits(
  attended: number,
  total: number,
  decimals: 0 | 1 | 2,
): number {
  assertCount(attended, 0, total, "Attended classes");
  assertCount(total, 1, 2_000, "Total classes");
  return Number(roundedPercentUnitsBigInt(attended, total, decimals));
}

function roundedPercentUnitsBigInt(
  attended: number,
  total: number,
  decimals: 0 | 1 | 2,
): bigint {
  const numerator = 2n * BigInt(attended) * 100n * 10n ** BigInt(decimals) + BigInt(total);
  return numerator / (2n * BigInt(total));
}

function assertRatioCounts(attended: number, total: number): void {
  if (
    !Number.isSafeInteger(attended) ||
    !Number.isSafeInteger(total) ||
    attended < 0 ||
    total < 1 ||
    attended > total
  ) {
    throw new RangeError("Attendance counts must be non-negative safe integers with attended no greater than total.");
  }
}

export function minimumAttendancesForPolicy(
  total: number,
  requiredPercent: AttendancePercent | number,
  policy: Partial<AttendancePolicy> = {},
): number {
  assertCount(total, 1, 2_000, "Total classes");
  const normalizedPolicy = normalizeAttendancePolicy(policy);
  const normalizedRequiredPercent = normalizeAttendancePercent(requiredPercent);

  let low = 0;
  let high = total;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (meetsPolicy(middle, total, normalizedRequiredPercent, normalizedPolicy)) {
      high = middle;
    } else {
      low = middle + 1;
    }
  }
  return low;
}

export function calculatePolicyAttendance(input: PolicyAttendanceInput): PolicyAttendanceResult {
  assertCount(input.totalClasses, 1, 1_000, "Total classes");
  assertCount(input.attendedClasses, 0, input.totalClasses, "Attended classes");
  const originalAbsences = input.totalClasses - input.attendedClasses;
  const justifiedAbsences = input.justifiedAbsences ?? 0;
  const tardyClasses = input.tardyClasses ?? 0;
  assertCount(justifiedAbsences, 0, originalAbsences, "Justified absences");
  assertCount(tardyClasses, 0, input.attendedClasses, "Tardy classes");
  if (input.remainingClasses !== undefined && input.remainingClasses !== null) {
    assertCount(input.remainingClasses, 0, 1_000, "Remaining classes");
  }

  const policy = normalizeAttendancePolicy(input.policy);
  const requiredPercent = normalizeAttendancePercent(input.requiredPercent);
  const requiredPercentScaled = requiredPercent.scaled;
  const effectiveTotalClasses =
    policy.justified === "exclude"
      ? input.totalClasses - justifiedAbsences
      : input.totalClasses;
  const creditedAttendances = policy.justified === "credit" ? justifiedAbsences : 0;
  const tardyPenalty = policy.tardyConversion
    ? Math.floor(tardyClasses / policy.tardyConversion)
    : 0;
  const effectiveAttendedClasses = Math.max(
    0,
    input.attendedClasses + creditedAttendances - tardyPenalty,
  );
  const effectiveAbsences = Math.max(
    0,
    effectiveTotalClasses - effectiveAttendedClasses,
  );
  const currentPercent =
    effectiveTotalClasses === 0
      ? null
      : (100 * effectiveAttendedClasses) / effectiveTotalClasses;
  const currentEvaluatedPercent =
    currentPercent === null
      ? null
      : evaluatePercent(effectiveAttendedClasses, effectiveTotalClasses, policy.rounding);
  const currentStatus: PolicyCurrentStatus =
    effectiveTotalClasses === 0
      ? "undefined"
      : meetsPolicy(effectiveAttendedClasses, effectiveTotalClasses, requiredPercent, policy)
        ? "meets"
        : "below";

  const remainingClasses = input.remainingClasses;
  let projection: PolicyProjection;
  if (remainingClasses === undefined || remainingClasses === null) {
    projection = { status: "unknown", remainingClasses: null };
  } else if (effectiveTotalClasses + remainingClasses === 0) {
    projection = {
      status: "undefined",
      remainingClasses,
      finalTotalClasses: 0,
      minimumAttendancesFinal: null,
      maximumFinalAbsences: null,
      availableAbsences: null,
      exceededAbsences: null,
      requiredAttendancesFromRemaining: null,
      maxPossiblePercent: null,
      finalEvaluatedPercent: null,
    };
  } else {
    const finalTotalClasses = effectiveTotalClasses + remainingClasses;
    const minimumAttendancesFinal = minimumAttendancesForPolicy(
      finalTotalClasses,
      requiredPercent,
      policy,
    );
    const maximumFinalAbsences = finalTotalClasses - minimumAttendancesFinal;
    const rawAvailableAbsences = maximumFinalAbsences - effectiveAbsences;
    const availableAbsences = Math.max(0, Math.min(remainingClasses, rawAvailableAbsences));
    const exceededAbsences = Math.max(0, -rawAvailableAbsences);
    const requiredAttendancesFromRemaining = Math.max(
      0,
      minimumAttendancesFinal - effectiveAttendedClasses,
    );
    const maximumFinalMeets = meetsPolicy(
      effectiveAttendedClasses + remainingClasses,
      finalTotalClasses,
      requiredPercent,
      policy,
    );
    const maxPossiblePercent =
      (100 * (effectiveAttendedClasses + remainingClasses)) / finalTotalClasses;
    let status: Exclude<PolicyProjectionStatus, "unknown" | "undefined">;
    if (remainingClasses === 0) {
      status = currentStatus === "meets" ? "finished_meets" : "finished_below";
    } else if (!maximumFinalMeets) {
      status = "impossible";
    } else if (requiredAttendancesFromRemaining === 0) {
      status = "guaranteed";
    } else {
      status = "possible";
    }
    projection = {
      status,
      remainingClasses,
      finalTotalClasses,
      minimumAttendancesFinal,
      maximumFinalAbsences,
      availableAbsences,
      exceededAbsences,
      requiredAttendancesFromRemaining,
      maxPossiblePercent,
      finalEvaluatedPercent: evaluatePercent(
        effectiveAttendedClasses + remainingClasses,
        finalTotalClasses,
        policy.rounding,
      ),
    };
  }

  return {
    totalClasses: input.totalClasses,
    attendedClasses: input.attendedClasses,
    originalAbsences,
    justifiedAbsences,
    tardyClasses,
    requiredPercent: requiredPercent.value,
    requiredPercentScaled,
    policy,
    effectiveTotalClasses,
    effectiveAttendedClasses,
    effectiveAbsences,
    tardyPenalty,
    tardyRemainder: policy.tardyConversion
      ? tardyClasses % policy.tardyConversion
      : tardyClasses,
    currentPercent,
    currentEvaluatedPercent,
    currentStatus,
    projection,
  };
}

function evaluatePercent(
  attended: number,
  total: number,
  rounding: AttendanceRounding,
): number {
  if (rounding === "exact") return (100 * attended) / total;
  return roundedPercentUnits(attended, total, rounding.decimals) / 10 ** rounding.decimals;
}

function assertCount(value: number, minimum: number, maximum: number, label: string): void {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new RangeError(`${label} must be an integer between ${minimum} and ${maximum}.`);
  }
}

export function serializeAttendancePolicy(policy: AttendancePolicy): string {
  const normalized = normalizeAttendancePolicy(policy);
  return JSON.stringify(normalized);
}

export type AttendanceEventStatus =
  | "attended"
  | "absence"
  | "justified"
  | "tardy"
  | "scheduled"
  | "cancelled";

export interface AttendanceCalendarEvent {
  id: string;
  date: string;
  label: string;
  status: AttendanceEventStatus;
}

export interface AttendanceCalendarCounts {
  completedClasses: number;
  attendedClasses: number;
  absences: number;
  justifiedAbsences: number;
  tardyClasses: number;
  remainingClasses: number | null;
  activeScheduledClasses: number;
}

export function validateCalendarEvent(event: AttendanceCalendarEvent): AttendanceCalendarEvent {
  if (!event || typeof event.id !== "string" || !event.id.trim() || event.id.length > 120) {
    throw new RangeError("Calendar event ID is required.");
  }
  if (!isLocalDate(event.date)) throw new RangeError("Calendar dates must use YYYY-MM-DD.");
  if (![
    "attended",
    "absence",
    "justified",
    "tardy",
    "scheduled",
    "cancelled",
  ].includes(event.status)) {
    throw new RangeError("Calendar event status is invalid.");
  }
  if (typeof event.label !== "string" || event.label.length > 200) {
    throw new RangeError("Calendar event label is invalid.");
  }
  return {
    id: event.id.trim(),
    date: event.date,
    label: event.label,
    status: event.status,
  };
}

export function isLocalDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function upsertCalendarEvent(
  events: readonly AttendanceCalendarEvent[],
  event: AttendanceCalendarEvent,
): AttendanceCalendarEvent[] {
  const next = validateCalendarEvent(event);
  const index = events.findIndex((item) => item.id === next.id);
  const result = [...events];
  if (index === -1) result.push(next);
  else result[index] = next;
  assertCalendarLimits(result);
  return result;
}

export function removeCalendarEvent(
  events: readonly AttendanceCalendarEvent[],
  id: string,
): AttendanceCalendarEvent[] {
  return events.filter((event) => event.id !== id);
}

export function assertCalendarLimits(events: readonly AttendanceCalendarEvent[]): void {
  const completed = events.filter(
    (event) => event.status !== "scheduled" && event.status !== "cancelled",
  ).length;
  const scheduled = events.filter((event) => event.status === "scheduled").length;
  if (completed > MAX_CALENDAR_EVENTS) {
    throw new RangeError("The calendar cannot contain more than 1000 completed classes.");
  }
  if (scheduled > MAX_CALENDAR_EVENTS) {
    throw new RangeError("The calendar cannot contain more than 1000 active scheduled classes.");
  }
}

export function summarizeCalendar(
  events: readonly AttendanceCalendarEvent[],
  calendarComplete: boolean,
): AttendanceCalendarCounts {
  assertCalendarLimits(events);
  let attendedClasses = 0;
  let absences = 0;
  let justifiedAbsences = 0;
  let tardyClasses = 0;
  let activeScheduledClasses = 0;
  for (const event of events) {
    if (event.status === "scheduled") activeScheduledClasses += 1;
    if (event.status === "attended") attendedClasses += 1;
    if (event.status === "tardy") {
      attendedClasses += 1;
      tardyClasses += 1;
    }
    if (event.status === "absence") absences += 1;
    if (event.status === "justified") {
      absences += 1;
      justifiedAbsences += 1;
    }
  }
  return {
    completedClasses: attendedClasses + absences,
    attendedClasses,
    absences,
    justifiedAbsences,
    tardyClasses,
    remainingClasses: calendarComplete ? activeScheduledClasses : null,
    activeScheduledClasses,
  };
}

export type AttendanceSource = "manual" | "calendar";

export interface ManualAttendanceValues {
  totalClasses: string;
  mode: "attended" | "absences";
  attendedClasses: string;
  absences: string;
  requiredPercent: string;
  remainingClasses: string;
  calendarMode?: "remaining" | "total";
  courseTotalClasses?: string;
}

export interface AttendanceSubject {
  id: string;
  name: string;
  source: AttendanceSource;
  manual: ManualAttendanceValues;
  events: AttendanceCalendarEvent[];
  calendarComplete: boolean;
  policy: AttendancePolicy;
}

export function createAttendanceSubject(name = "Subject 1", id = createStableId("subject")): AttendanceSubject {
  return {
    id,
    name: normalizeSubjectName(name),
    source: "manual",
    manual: {
      totalClasses: "",
      mode: "attended",
      attendedClasses: "",
      absences: "",
      requiredPercent: "80",
      remainingClasses: "",
      calendarMode: "remaining",
      courseTotalClasses: "",
    },
    events: [],
    calendarComplete: false,
    policy: { ...DEFAULT_ATTENDANCE_POLICY },
  };
}

export function normalizeSubjectName(name: string): string {
  const normalized = name.trim();
  if (!normalized) throw new RangeError("Subject name is required.");
  if (normalized.length > 100) throw new RangeError("Subject name cannot exceed 100 characters.");
  return normalized;
}

export function addAttendanceSubject(
  subjects: readonly AttendanceSubject[],
  name: string,
): AttendanceSubject[] {
  if (subjects.length >= MAX_ATTENDANCE_SUBJECTS) {
    throw new RangeError("You can have at most 20 subjects in this session.");
  }
  return [...subjects, createAttendanceSubject(name)];
}

export function renameAttendanceSubject(
  subjects: readonly AttendanceSubject[],
  id: string,
  name: string,
): AttendanceSubject[] {
  const normalizedName = normalizeSubjectName(name);
  let found = false;
  const result = subjects.map((subject) => {
    if (subject.id !== id) return subject;
    found = true;
    return { ...subject, name: normalizedName };
  });
  if (!found) throw new RangeError("Subject not found.");
  return result;
}

export function removeAttendanceSubject(
  subjects: readonly AttendanceSubject[],
  id: string,
): AttendanceSubject[] {
  return subjects.filter((subject) => subject.id !== id);
}

export function createStableId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export interface AttendanceHistorySnapshot {
  id: string;
  savedAt: string;
  schemaVersion: number;
  rulesVersion: string;
  subject: { id: string; name: string };
  input: ManualAttendanceValues | { events: AttendanceCalendarEvent[]; calendarComplete: boolean };
  policy: AttendancePolicy;
  source: AttendanceSource;
  result: unknown;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type HistoryReadResult =
  | { ok: true; snapshots: AttendanceHistorySnapshot[] }
  | { ok: false; snapshots: []; reason: "unavailable" | "corrupt" };

export type HistorySaveResult =
  | { ok: true; snapshots: AttendanceHistorySnapshot[] }
  | { ok: false; reason: "unavailable" | "full" | "serialization"; snapshots: AttendanceHistorySnapshot[] };

export function readAttendanceHistory(storage: StorageLike | null | undefined): HistoryReadResult {
  if (!storage) return { ok: false, snapshots: [], reason: "unavailable" };
  let raw: string | null;
  try {
    raw = storage.getItem(ATTENDANCE_HISTORY_KEY);
  } catch {
    return { ok: false, snapshots: [], reason: "unavailable" };
  }
  if (!raw) return { ok: true, snapshots: [] };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length > MAX_ATTENDANCE_HISTORY) {
      return { ok: false, snapshots: [], reason: "corrupt" };
    }
    const snapshots = parsed.map(parseHistorySnapshot);
    return { ok: true, snapshots };
  } catch {
    return { ok: false, snapshots: [], reason: "corrupt" };
  }
}

export function appendAttendanceHistory(
  storage: StorageLike | null | undefined,
  snapshot: AttendanceHistorySnapshot,
): HistorySaveResult {
  const read = readAttendanceHistory(storage);
  if (!read.ok) {
    return { ok: false, reason: read.reason, snapshots: [] };
  }
  if (read.snapshots.length >= MAX_ATTENDANCE_HISTORY) {
    return { ok: false, reason: "full", snapshots: read.snapshots };
  }
  const validated = parseHistorySnapshot(snapshot);
  const snapshots = [validated, ...read.snapshots];
  try {
    storage?.setItem(ATTENDANCE_HISTORY_KEY, JSON.stringify(snapshots));
  } catch {
    return { ok: false, reason: "unavailable", snapshots: read.snapshots };
  }
  return { ok: true, snapshots };
}

export function deleteAttendanceHistorySnapshot(
  storage: StorageLike | null | undefined,
  id: string,
): HistoryReadResult {
  const read = readAttendanceHistory(storage);
  if (!read.ok) return read;
  const snapshots = read.snapshots.filter((snapshot) => snapshot.id !== id);
  try {
    if (!storage) return { ok: false, snapshots: [], reason: "unavailable" };
    if (snapshots.length) storage.setItem(ATTENDANCE_HISTORY_KEY, JSON.stringify(snapshots));
    else storage.removeItem(ATTENDANCE_HISTORY_KEY);
  } catch {
    return { ok: false, snapshots: read.snapshots, reason: "unavailable" };
  }
  return { ok: true, snapshots };
}

export function clearAttendanceHistory(storage: StorageLike | null | undefined): HistoryReadResult {
  if (!storage) return { ok: false, snapshots: [], reason: "unavailable" };
  try {
    storage.removeItem(ATTENDANCE_HISTORY_KEY);
    return { ok: true, snapshots: [] };
  } catch {
    return { ok: false, snapshots: [], reason: "unavailable" };
  }
}

export function createAttendanceHistorySnapshot(
  snapshot: Omit<AttendanceHistorySnapshot, "id" | "savedAt" | "schemaVersion" | "rulesVersion">,
): AttendanceHistorySnapshot {
  return {
    ...snapshot,
    id: createStableId("history"),
    savedAt: new Date().toISOString(),
    schemaVersion: ATTENDANCE_PHASE2_SCHEMA_VERSION,
    rulesVersion: ATTENDANCE_PHASE2_RULES_VERSION,
  };
}

export function isAttendanceHistoryCurrent(snapshot: AttendanceHistorySnapshot): boolean {
  return snapshot.schemaVersion === ATTENDANCE_PHASE2_SCHEMA_VERSION &&
    snapshot.rulesVersion === ATTENDANCE_PHASE2_RULES_VERSION;
}

function parseHistorySnapshot(value: unknown): AttendanceHistorySnapshot {
  if (!isRecord(value)) throw new TypeError("History snapshot must be an object.");
  if (
    typeof value.id !== "string" ||
    typeof value.savedAt !== "string" ||
    value.schemaVersion !== ATTENDANCE_PHASE2_SCHEMA_VERSION ||
    typeof value.rulesVersion !== "string" ||
    !isRecord(value.subject) ||
    typeof value.subject.id !== "string" ||
    typeof value.subject.name !== "string" ||
    (value.source !== "manual" && value.source !== "calendar") ||
    !isRecord(value.policy)
  ) {
    throw new TypeError("History snapshot has an incompatible shape.");
  }
  if (!("result" in value)) throw new TypeError("History snapshot result is missing.");
  const policy = normalizeAttendancePolicy(value.policy as Partial<AttendancePolicy>);
  const input = value.input;
  if (!isRecord(input)) throw new TypeError("History input is invalid.");
  if (value.source === "manual") {
    const manualKeys = [
      "totalClasses",
      "mode",
      "attendedClasses",
      "absences",
      "requiredPercent",
      "remainingClasses",
    ] as const;
    if (
      manualKeys.some((key) => typeof input[key] !== "string") ||
      (input.mode !== "attended" && input.mode !== "absences") ||
      (input.calendarMode !== undefined && input.calendarMode !== "remaining" && input.calendarMode !== "total") ||
      (input.courseTotalClasses !== undefined && typeof input.courseTotalClasses !== "string")
    ) {
      throw new TypeError("History manual input is invalid.");
    }
  } else if (
    !Array.isArray(input.events) ||
    typeof input.calendarComplete !== "boolean"
  ) {
    throw new TypeError("History calendar input is invalid.");
  } else {
    input.events = input.events.map((event) => validateCalendarEvent(event as AttendanceCalendarEvent));
  }
  return {
    id: value.id,
    savedAt: value.savedAt,
    schemaVersion: value.schemaVersion,
    rulesVersion: value.rulesVersion,
    subject: { id: value.subject.id, name: value.subject.name },
    input: input as AttendanceHistorySnapshot["input"],
    policy,
    source: value.source,
    result: value.result,
  };
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const ATTENDANCE_CSV_COLUMNS = [
  "schema_version",
  "exported_at",
  "subject",
  "origin",
  "total_original",
  "attended_original",
  "absences_original",
  "minimum",
  "remaining",
  "policy",
  "total_effective",
  "attended_effective",
  "current_percentage",
  "current_status",
  "final_status",
  "final_total",
  "required_remaining_attendances",
  "available_future_absences",
  "exceeded_absences",
  "maximum_final_percentage",
  "recovery_classes",
  "recovery_status",
] as const;

export type AttendanceCsvValue = string | number | null | undefined;
export type AttendanceCsvRow = Partial<Record<(typeof ATTENDANCE_CSV_COLUMNS)[number], AttendanceCsvValue>>;

const CSV_TEXT_COLUMNS = new Set([
  "subject",
  "origin",
  "policy",
  "current_status",
  "final_status",
  "recovery_status",
]);

export function neutralizeCsvText(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

export function escapeCsvCell(value: AttendanceCsvValue, text = false): string {
  if (value === null || value === undefined) return "";
  const normalized = text ? neutralizeCsvText(String(value)) : String(value);
  return /[",\r\n]/.test(normalized)
    ? `"${normalized.replaceAll('"', '""')}"`
    : normalized;
}

export function buildAttendanceCsv(rows: readonly AttendanceCsvRow[]): string {
  const header = ATTENDANCE_CSV_COLUMNS.join(",");
  const body = rows.map((row) =>
    ATTENDANCE_CSV_COLUMNS.map((column) =>
      escapeCsvCell(row[column], CSV_TEXT_COLUMNS.has(column)),
    ).join(","),
  );
  return [header, ...body].join("\r\n") + "\r\n";
}

export function policyAttendanceToCsvRow(
  subject: string,
  origin: AttendanceSource,
  result: PolicyAttendanceResult,
  exportedAt = new Date().toISOString(),
): AttendanceCsvRow {
  const projection = result.projection;
  const recovery = calculatePolicyRecovery(result);
  return {
    schema_version: ATTENDANCE_PHASE2_SCHEMA_VERSION,
    exported_at: exportedAt,
    subject,
    origin,
    total_original: result.totalClasses,
    attended_original: result.attendedClasses,
    absences_original: result.originalAbsences,
    minimum: result.requiredPercent,
    remaining: projection.status === "unknown" ? null : projection.remainingClasses,
    policy: serializeAttendancePolicy(result.policy),
    total_effective: result.effectiveTotalClasses,
    attended_effective: result.effectiveAttendedClasses,
    current_percentage: result.currentPercent,
    current_status: result.currentStatus,
    final_status: projection.status,
    final_total: projection.status === "unknown" || projection.status === "undefined" ? null : projection.finalTotalClasses,
    required_remaining_attendances:
      projection.status === "unknown" || projection.status === "undefined"
        ? null
        : projection.requiredAttendancesFromRemaining,
    available_future_absences:
      projection.status === "unknown" || projection.status === "undefined"
        ? null
        : projection.availableAbsences,
    exceeded_absences:
      projection.status === "unknown" || projection.status === "undefined"
        ? null
        : projection.exceededAbsences,
    maximum_final_percentage:
      projection.status === "unknown" || projection.status === "undefined"
        ? null
        : projection.maxPossiblePercent,
    recovery_classes: recovery.classes,
    recovery_status: recovery.status,
  };
}

export function calculatePolicyRecovery(result: PolicyAttendanceResult): {
  classes: number | null;
  status: "available" | "already_meets" | "impossible" | "undefined";
} {
  if (result.effectiveTotalClasses === 0) return { classes: null, status: "undefined" };
  const requiredPercent = normalizeAttendancePercent(result.requiredPercent);
  if (requiredPercent.scaled !== result.requiredPercentScaled) {
    throw new RangeError("Attendance result has an inconsistent required percentage.");
  }
  const policy = normalizeAttendancePolicy(result.policy);
  const meetsAt = (additionalClasses: number) =>
    meetsPolicy(
      result.effectiveAttendedClasses + additionalClasses,
      result.effectiveTotalClasses + additionalClasses,
      requiredPercent,
      policy,
    );

  if (meetsAt(0)) return { classes: 0, status: "already_meets" };
  if (policy.rounding === "exact" && requiredPercent.scaled === 100 * PERCENT_SCALE) {
    return { classes: null, status: "impossible" };
  }

  let low = 0;
  let high = 1;
  const maxAdditionalClasses = Number.MAX_SAFE_INTEGER - result.effectiveTotalClasses;
  while (!meetsAt(high)) {
    low = high;
    if (high >= maxAdditionalClasses) {
      throw new RangeError("Recovery exceeds the safe integer range.");
    }
    high = high > Math.floor(maxAdditionalClasses / 2)
      ? maxAdditionalClasses
      : high * 2;
  }

  while (low + 1 < high) {
    const middle = low + Math.floor((high - low) / 2);
    if (meetsAt(middle)) high = middle;
    else low = middle;
  }
  return { classes: high, status: "available" };
}

export function downloadAttendanceCsv(
  csv: string,
  filename: string,
  documentLike: Document = document,
  urlLike: Pick<typeof URL, "createObjectURL" | "revokeObjectURL"> = URL,
): void {
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
  const url = urlLike.createObjectURL(blob);
  const link = documentLike.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  urlLike.revokeObjectURL(url);
}
