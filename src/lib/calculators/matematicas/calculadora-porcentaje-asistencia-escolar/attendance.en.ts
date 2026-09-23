import { createAttendanceAdapter, type AttendanceResult } from "./attendance-presenter";

export type {
  AttendanceInput,
  AttendanceInputMode,
  AttendanceCalendarMode,
  AttendanceCalendarState,
  AttendancePercent,
  AttendanceProjection,
  AttendanceProjectionStatus,
  AttendanceStatus,
  ParseAttendanceIntegerResult,
  ParseAttendancePercentResult,
  ParseAttendanceRemainingResult,
  ParseAttendanceCourseTotalResult,
} from "./attendance-core";
export type { AttendanceResult } from "./attendance-presenter";
export {
  ATTENDANCE_CSV_COLUMNS,
  ATTENDANCE_HISTORY_KEY,
  ATTENDANCE_PHASE2_RULES_VERSION,
  ATTENDANCE_PHASE2_SCHEMA_VERSION,
  ATTENDANCE_SUBJECTS_KEY,
  DEFAULT_ATTENDANCE_POLICY,
  MAX_ATTENDANCE_HISTORY,
  MAX_ATTENDANCE_SUBJECTS,
  MAX_CALENDAR_EVENTS,
  addAttendanceSubject,
  appendAttendanceHistory,
  assertCalendarLimits,
  buildAttendanceCsv,
  calculatePolicyAttendance,
  calculatePolicyRecovery,
  clearAttendanceHistory,
  createAttendanceHistorySnapshot,
  createAttendanceSubject,
  deleteAttendanceHistorySnapshot,
  downloadAttendanceCsv,
  escapeCsvCell,
  isLocalDate,
  isAttendanceHistoryCurrent,
  meetsAttendancePolicy,
  meetsPolicy,
  minimumAttendancesForPolicy,
  normalizeAttendancePolicy,
  normalizeSubjectName,
  policyAttendanceToCsvRow,
  readAttendanceHistory,
  removeAttendanceSubject,
  removeCalendarEvent,
  renameAttendanceSubject,
  roundedPercentUnits,
  serializeAttendancePolicy,
  summarizeCalendar,
  upsertCalendarEvent,
  validateAttendanceHistorySnapshot,
  validateCalendarEvent,
} from "./attendance-phase2";
export type {
  AttendanceCalendarCounts,
  AttendanceCalendarEvent,
  AttendanceCsvRow,
  AttendanceCsvValue,
  AttendanceEventStatus,
  AttendanceHistorySnapshot,
  HistoryReadResult,
  HistorySaveResult,
  AttendancePolicy,
  PolicyProjection as PolicyAttendanceProjection,
  PolicyAttendanceInput,
  PolicyAttendanceResult,
  PolicyCurrentStatus,
  PolicyProjectionStatus,
  AttendanceRounding,
  AttendanceSource,
  AttendanceSubject,
  JustifiedAttendanceRule,
  ManualAttendanceValues,
  StorageLike,
} from "./attendance-phase2";
export {
  ATTENDANCE_RATIO_SCALE,
  MAX_COURSE_TOTAL_CLASSES,
  MAX_ATTENDANCE_CLASSES,
  MAX_PERCENT_DECIMALS,
  PERCENT_SCALE,
  ceilDiv,
  parseAttendanceInteger,
  parseAttendancePercent,
  parseAttendanceRemaining,
  parseAttendanceCourseTotal,
  normalizeAttendanceCalendar,
} from "./attendance-core";

export const ATTENDANCE_CANONICAL_PATH = "/en/math/attendance-percentage-calculator";

export const ATTENDANCE_EXAMPLES = [
  {
    id: "regular",
    label: "Final-course margin",
    values: { totalClasses: "40", mode: "attended", attendedClasses: "34", absences: "6", requiredPercent: "80", remainingClasses: "10" },
  },
  {
    id: "recover",
    label: "Recover",
    values: { totalClasses: "40", mode: "attended", attendedClasses: "30", absences: "10", requiredPercent: "80", remainingClasses: "10" },
  },
  {
    id: "no-margin",
    label: "No absences available",
    values: { totalClasses: "20", mode: "absences", attendedClasses: "16", absences: "4", requiredPercent: "80", remainingClasses: "4" },
  },
  {
    id: "impossible",
    label: "Not enough classes left",
    values: { totalClasses: "40", mode: "attended", attendedClasses: "25", absences: "15", requiredPercent: "80", remainingClasses: "5" },
  },
  {
    id: "unknown",
    label: "Current attendance only",
    values: { totalClasses: "40", mode: "attended", attendedClasses: "34", absences: "6", requiredPercent: "80", remainingClasses: "" },
  },
  {
    id: "course-total",
    label: "Course total",
    values: { totalClasses: "40", mode: "attended", attendedClasses: "34", absences: "6", requiredPercent: "80", remainingClasses: "10", calendarMode: "total", courseTotalClasses: "50" },
  },
] as const;

const adapter = createAttendanceAdapter({
  locale: "en-US",
  canonicalPath: ATTENDANCE_CANONICAL_PATH,
  examples: ATTENDANCE_EXAMPLES,
  classWord: ["class", "classes"],
  absenceWord: ["absence", "absences"],
  currentMeets: "Currently meets the minimum",
  currentBelow: "Below the current minimum",
  projectionLabels: {
    unknown: "Projection pending",
    finished_meets: "Course finished: minimum reached",
    finished_below: "Course finished: minimum not reached",
    impossible: "Not possible within the schedule",
    guaranteed: "Final requirement secured",
    possible: "Final requirement is possible",
  },
  messages: {
    unknown: (actual) => `Your current attendance is ${actual}. Enter how many classes remain to estimate the final result.`,
    pendingProjection: "Pending remaining classes",
    finishedMeets: (minimum) => `The course is finished and you meet the ${minimum} minimum.`,
    finishedBelow: (minimum) => `The course is finished and you are below the ${minimum} minimum.`,
    impossible: (remaining, maximum, needed) => `The minimum cannot be reached with ${remaining.formatted} remaining ${remaining.value === 1 ? "class" : "classes"}. The planned final total would require ${needed.formatted} additional ${needed.value === 1 ? "attendance" : "attendances"}, but only ${remaining.formatted} ${remaining.value === 1 ? "class remains" : "classes remain"}. Attending ${remaining.value === 1 ? "it" : "all of them"} would produce a maximum final attendance of ${maximum}.`,
    guaranteed: (minimum, total) => `You already have enough attendances to meet ${minimum} at the end of the ${total.formatted} entered ${total.value === 1 ? "class" : "classes"}.`,
    possibleBelow: (needed, remaining, minimum) => remaining.value === 1 && needed.value === 1 ? `You need to attend the remaining class to meet ${minimum} at the end.` : `You need to attend at least ${needed.formatted} of the ${remaining.formatted} remaining classes to meet ${minimum} at the end.`,
    possibleAvailable: (available, remaining, minimum) => `You can miss up to ${available.formatted} of the ${remaining.formatted} remaining classes if you attend the others; that would meet ${minimum} at the end.`,
    possibleAll: (remaining) => remaining.value === 1 ? "You must attend the remaining class to meet the final minimum." : `You must attend all ${remaining.formatted} remaining classes to meet the final minimum.`,
    impossibleNeeded: (remaining) => remaining.value === 1 ? "The remaining class is not enough" : `The ${remaining.formatted} remaining classes are not enough`,
    exceededAbsences: (exceeded) => `You exceed the course limit by ${exceeded.formatted} ${exceeded.value === 1 ? "absence" : "absences"}`,
    guaranteeCondition: "This holds only if the total number of classes and the requirement do not change.",
    temporaryMarginCondition: "This margin is calculated for the end of the course; your percentage may fall temporarily.",
    unknownRecovery: "We do not know whether enough classes remain.",
    theoreticalRecovery: (remaining) => `This is theoretical: only ${remaining.formatted} ${remaining.value === 1 ? "class remains" : "classes remain"}.`,
    finishedRecovery: "This is a hypothetical scenario outside the finished course.",
    alreadyRecovered: "You already meet the current minimum",
    impossibleRecovery: "With recorded absences, 100% cannot be recovered by attending more classes",
    roundingBelow: (minimum) => `Below ${minimum} before rounding.`,
    smallDeficit: "Deficit below 0.01 percentage points",
    smallMargin: "Positive margin below 0.01 percentage points",
  },
  copy: {
    heading: "School attendance calculator - calculadoras.tools",
    inputMode: "Input mode",
    attendedMode: "Attendances",
    absencesMode: "Absences",
    requiredMinimum: "Required minimum",
    completedClasses: "Classes held so far",
    attendedClasses: "Attendances",
    accumulatedAbsences: "Accumulated absences",
    remainingClasses: "Remaining classes",
    notProvided: "Not provided",
    currentAttendance: "Current attendance",
    currentSituation: "Current situation",
    margin: "Margin in percentage points",
    finalProjection: "Final projection",
    finalTotal: "Total classes in the course",
    maximumFinalAbsences: "Maximum total absences",
    futureAbsencesAvailable: "Future absences available",
    exceededAbsences: "Excess absences",
    requiredRemainingAttendances: "Required attendances among remaining classes",
    maximumFinalPercentage: "Maximum possible final percentage",
    theoreticalRecovery: "Consecutive classes to reach the current minimum",
    impossible: "Not possible",
  },
});

export const calculateAttendance = adapter.calculateAttendance;
export const buildAttendanceSummary = adapter.buildAttendanceSummary;
export const formatAttendanceNumber = adapter.formatAttendanceNumber;
export const formatAttendancePercent = adapter.formatAttendancePercent;
export const formatRequiredAttendancePercent = adapter.formatRequiredAttendancePercent;
export const formatSignedAttendanceNumber = adapter.formatSignedAttendanceNumber;
export const formatAttendanceCount = adapter.formatAttendanceCount;

export function pluralizeClasses(value: number, singular = "class"): string {
  return Math.abs(value) === 1 ? singular : `${singular}s`;
}

export function getAttendancePresentation(result: AttendanceResult) {
  return result.presentation;
}
