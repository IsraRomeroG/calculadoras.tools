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
  ParseAttendanceRemainingResult,
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
  parseAttendanceRemaining,
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
    impossible: (remaining, maximum, needed) => `Con las ${remaining} clases restantes no se alcanza el mínimo. Con el total final previsto necesitarías ${needed} asistencias adicionales, pero solo quedan ${remaining} clases. Asistiendo a todas, el máximo final sería ${maximum}.`,
    guaranteed: (minimum, total) => `Ya tienes las asistencias necesarias para cumplir el ${minimum} al final de las ${total} clases registradas.`,
    possibleBelow: (needed, remaining, minimum) => `Necesitas asistir al menos a ${needed} de las ${remaining} clases restantes para cumplir el ${minimum} al final.`,
    possibleAvailable: (available, remaining, needed, minimum) => `Puedes faltar hasta ${available} de las ${remaining} clases restantes si asistes a las otras ${needed}; así cumplirías el ${minimum} al final.`,
    possibleAll: (remaining) => `Debes asistir a las ${remaining} clases restantes para cumplir el mínimo al final.`,
    impossibleNeeded: (remaining) => `No alcanzan las ${remaining} restantes`,
    guaranteeCondition: "Siempre que no cambie el total de clases ni el requisito.",
    temporaryMarginCondition: "Este margen se calcula para el final del curso; tu porcentaje puede bajar temporalmente.",
    unknownRecovery: "No sabemos si quedan suficientes clases.",
    theoreticalRecovery: (remaining) => `Es un cálculo teórico: quedan solo ${remaining} clases.`,
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
    completedClasses: "Clases realizadas",
    attendedClasses: "Asistencias",
    accumulatedAbsences: "Faltas acumuladas",
    remainingClasses: "Clases restantes",
    notProvided: "No indicadas",
    currentAttendance: "Asistencia actual",
    currentSituation: "Situación actual",
    margin: "Margen en puntos porcentuales",
    finalProjection: "Proyección final",
    finalTotal: "Total final",
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
