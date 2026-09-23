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

export const ATTENDANCE_CANONICAL_PATH =
  "/matematicas/calculadora-porcentaje-asistencia-escolar";

export const ATTENDANCE_EXAMPLES = [
  {
    id: "regular",
    label: "Con margen al final",
    values: { totalClasses: "40", mode: "attended", attendedClasses: "34", absences: "6", requiredPercent: "80", remainingClasses: "10" },
  },
  {
    id: "recover",
    label: "Recuperar el mínimo",
    values: { totalClasses: "40", mode: "attended", attendedClasses: "30", absences: "10", requiredPercent: "80", remainingClasses: "10" },
  },
  {
    id: "no-margin",
    label: "Sin faltas disponibles",
    values: { totalClasses: "20", mode: "absences", attendedClasses: "16", absences: "4", requiredPercent: "80", remainingClasses: "4" },
  },
  {
    id: "impossible",
    label: "No alcanzan las restantes",
    values: { totalClasses: "40", mode: "attended", attendedClasses: "25", absences: "15", requiredPercent: "80", remainingClasses: "5" },
  },
  {
    id: "unknown",
    label: "Solo asistencia actual",
    values: { totalClasses: "40", mode: "attended", attendedClasses: "34", absences: "6", requiredPercent: "80", remainingClasses: "" },
  },
  {
    id: "course-total",
    label: "Total del curso",
    values: { totalClasses: "40", mode: "attended", attendedClasses: "34", absences: "6", requiredPercent: "80", remainingClasses: "10", calendarMode: "total", courseTotalClasses: "50" },
  },
] as const;

const adapter = createAttendanceAdapter({
  locale: "es-MX",
  canonicalPath: ATTENDANCE_CANONICAL_PATH,
  examples: ATTENDANCE_EXAMPLES,
  classWord: ["clase", "clases"],
  absenceWord: ["falta", "faltas"],
  currentMeets: "Cumples actualmente",
  currentBelow: "Por debajo del mínimo actual",
  projectionLabels: {
    unknown: "Proyección pendiente",
    finished_meets: "Curso terminado: mínimo alcanzado",
    finished_below: "Curso terminado: mínimo no alcanzado",
    impossible: "No es posible dentro del calendario",
    guaranteed: "Cumplimiento final asegurado",
    possible: "Cumplimiento final posible",
  },
  messages: {
    unknown: (actual) => `Tu asistencia actual es ${actual}. Indica cuántas clases quedan para estimar el resultado final.`,
    pendingProjection: "Pendiente de clases restantes",
    finishedMeets: (minimum) => `El curso terminó y cumples el mínimo de ${minimum}.`,
    finishedBelow: (minimum) => `El curso terminó y quedaste por debajo del mínimo de ${minimum}.`,
    impossible: (remaining, maximum, needed) => `Con ${remaining.formatted} ${remaining.value === 1 ? "clase restante" : "clases restantes"} no se alcanza el mínimo. Con el total del curso previsto necesitarías ${needed.formatted} ${needed.value === 1 ? "asistencia adicional" : "asistencias adicionales"}, pero solo ${remaining.value === 1 ? "queda" : "quedan"} ${remaining.formatted}. Asistiendo a ${remaining.value === 1 ? "esa clase" : "todas"}, el máximo final sería ${maximum}.`,
    guaranteed: (minimum, total) => `Ya tienes las asistencias necesarias para cumplir el ${minimum} al final de ${total.formatted} ${total.value === 1 ? "clase registrada" : "clases registradas"}.`,
    possibleBelow: (needed, remaining, minimum) => remaining.value === 1 && needed.value === 1 ? `Necesitas asistir a la clase restante para cumplir el ${minimum} al final.` : `Necesitas asistir al menos a ${needed.formatted} de las ${remaining.formatted} clases restantes para cumplir el ${minimum} al final.`,
    possibleAvailable: (available, remaining, minimum) => `Puedes faltar hasta ${available.formatted} de las ${remaining.formatted} clases restantes si asistes a las demás; así cumplirías el ${minimum} al final.`,
    possibleAll: (remaining) => remaining.value === 1 ? "Debes asistir a la clase restante para cumplir el mínimo al final." : `Debes asistir a las ${remaining.formatted} clases restantes para cumplir el mínimo al final.`,
    impossibleNeeded: (remaining) => remaining.value === 1 ? "La clase restante no alcanza" : `No alcanzan las ${remaining.formatted} restantes`,
    exceededAbsences: (exceeded) => `Excedes en ${exceeded.formatted} ${exceeded.value === 1 ? "falta" : "faltas"} el límite del curso`,
    guaranteeCondition: "Siempre que no cambie el total de clases ni el requisito.",
    temporaryMarginCondition: "Este margen se calcula para el final del curso; tu porcentaje puede bajar temporalmente.",
    unknownRecovery: "No sabemos si quedan suficientes clases.",
    theoreticalRecovery: (remaining) => `Es un cálculo teórico: ${remaining.value === 1 ? "queda solo" : "quedan solo"} ${remaining.formatted} ${remaining.value === 1 ? "clase" : "clases"}.`,
    finishedRecovery: "Es un escenario hipotético fuera del curso terminado.",
    alreadyRecovered: "Ya alcanzas el mínimo actual",
    impossibleRecovery: "Con faltas registradas no se puede recuperar el 100% asistiendo a más clases",
    roundingBelow: (minimum) => `Por debajo de ${minimum} antes de redondear.`,
    smallDeficit: "Déficit menor de 0.01 puntos porcentuales",
    smallMargin: "Margen positivo menor de 0.01 puntos porcentuales",
  },
  copy: {
    heading: "Calculadora de asistencia escolar - calculadoras.tools",
    inputMode: "Modo de captura",
    attendedMode: "Asistencias",
    absencesMode: "Faltas",
    requiredMinimum: "Mínimo requerido",
    completedClasses: "Clases impartidas hasta hoy",
    attendedClasses: "Asistencias",
    accumulatedAbsences: "Faltas acumuladas",
    remainingClasses: "Clases restantes",
    notProvided: "No indicadas",
    currentAttendance: "Asistencia actual",
    currentSituation: "Situación actual",
    margin: "Margen en puntos porcentuales",
    finalProjection: "Proyección final",
    finalTotal: "Total del curso",
    maximumFinalAbsences: "Faltas máximas totales",
    futureAbsencesAvailable: "Faltas futuras disponibles",
    exceededAbsences: "Excedente de faltas",
    requiredRemainingAttendances: "Asistencias necesarias de las restantes",
    maximumFinalPercentage: "Máximo final posible",
    theoreticalRecovery: "Clases seguidas para alcanzar el mínimo actual",
    impossible: "No es posible",
  },
});

export const calculateAttendance = adapter.calculateAttendance;
export const buildAttendanceSummary = adapter.buildAttendanceSummary;
export const formatAttendanceNumber = adapter.formatAttendanceNumber;
export const formatAttendancePercent = adapter.formatAttendancePercent;
export const formatRequiredAttendancePercent = adapter.formatRequiredAttendancePercent;
export const formatSignedAttendanceNumber = adapter.formatSignedAttendanceNumber;
export const formatAttendanceCount = adapter.formatAttendanceCount;

export function pluralizeClasses(value: number, singular = "clase"): string {
  return Math.abs(value) === 1 ? singular : `${singular}s`;
}

export function getAttendancePresentation(result: AttendanceResult) {
  return result.presentation;
}
