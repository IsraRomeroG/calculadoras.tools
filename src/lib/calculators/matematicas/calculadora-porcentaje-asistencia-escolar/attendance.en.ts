import { createAttendanceAdapter, type AttendanceResult } from "./attendance-presenter";

export type {
  AttendanceInput,
  AttendanceInputMode,
  AttendancePercent,
  AttendanceProjection,
  AttendanceProjectionStatus,
  AttendanceStatus,
  ParseAttendanceIntegerResult,
  ParseAttendancePercentResult,
} from "./attendance-core";
export type { AttendanceResult } from "./attendance-presenter";
export {
  ATTENDANCE_RATIO_SCALE,
  MAX_ATTENDANCE_CLASSES,
  MAX_PERCENT_DECIMALS,
  PERCENT_SCALE,
  ceilDiv,
  parseAttendanceInteger,
  parseAttendancePercent,
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
    impossible: (remaining, maximum, needed) => `The minimum cannot be reached with the ${remaining} remaining classes. The planned final total would require ${needed} additional attendances, but only ${remaining} classes remain. Attending all of them would produce a maximum final attendance of ${maximum}.`,
    guaranteed: (minimum, total) => `You already have enough attendances to meet ${minimum} at the end of the ${total} entered classes.`,
    possibleBelow: (needed, remaining, minimum) => `You need to attend at least ${needed} of the ${remaining} remaining classes to meet ${minimum} at the end.`,
    possibleAvailable: (available, remaining, needed, minimum) => `You can miss up to ${available} of the ${remaining} remaining classes if you attend the other ${needed}; that would meet ${minimum} at the end.`,
    possibleAll: (remaining) => `You must attend all ${remaining} remaining classes to meet the final minimum.`,
    impossibleNeeded: (remaining) => `The ${remaining} remaining classes are not enough`,
    guaranteeCondition: "This holds only if the total number of classes and the requirement do not change.",
    temporaryMarginCondition: "This margin is calculated for the end of the course; your percentage may fall temporarily.",
    unknownRecovery: "We do not know whether enough classes remain.",
    theoreticalRecovery: (remaining) => `This is theoretical: only ${remaining} classes remain.`,
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
    completedClasses: "Completed classes",
    attendedClasses: "Attendances",
    accumulatedAbsences: "Accumulated absences",
    remainingClasses: "Remaining classes",
    notProvided: "Not provided",
    currentAttendance: "Current attendance",
    currentSituation: "Current situation",
    margin: "Margin in percentage points",
    finalProjection: "Final projection",
    finalTotal: "Final total",
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
