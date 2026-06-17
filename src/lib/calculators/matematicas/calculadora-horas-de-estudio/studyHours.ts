export type StudyHoursMode = "hoursPerDay" | "estimatedDate";
export type StudyLoadLevel = "completed" | "sustainable" | "moderate" | "demanding" | "very_high";
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface StudyHoursInput {
  mode: StudyHoursMode;
  totalHours: number;
  completedHours?: number | null;
  startDate: string;
  deadlineDate?: string | null;
  dailyHours?: number | null;
  selectedWeekdays: Weekday[];
  sessionMinutes?: number | null;
  referenceDate?: string | null;
}

export interface StudyWeekPlanItem {
  weekday: Weekday;
  shortLabel: string;
  label: string;
  isStudyDay: boolean;
  hours: number;
  hoursLabel: string;
  sessions: number;
}

export interface StudyLoadInfo {
  level: StudyLoadLevel;
  label: string;
  message: string;
}

export interface StudyHoursResult {
  mode: StudyHoursMode;
  totalHours: number;
  completedHours: number;
  pendingHours: number;
  startDate: string;
  deadlineDate: string | null;
  estimatedDate: string | null;
  selectedWeekdays: Weekday[];
  effectiveStudyDays: number;
  hoursPerDay: number;
  sessionsPerDay: number;
  sessionMinutes: number;
  hoursPerWeek: number;
  load: StudyLoadInfo;
  recommendation: string;
  weeklyPlan: StudyWeekPlanItem[];
}

export type ParseStudyHoursNumberResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "zero" | "too_many_decimals";
    };

export const STUDY_HOURS_CANONICAL_PATH =
  "/matematicas/calculadora-horas-de-estudio";

export const STUDY_WEEKDAYS: Array<{
  value: Weekday;
  shortLabel: string;
  label: string;
}> = [
  { value: 1, shortLabel: "L", label: "Lunes" },
  { value: 2, shortLabel: "M", label: "Martes" },
  { value: 3, shortLabel: "X", label: "Miercoles" },
  { value: 4, shortLabel: "J", label: "Jueves" },
  { value: 5, shortLabel: "V", label: "Viernes" },
  { value: 6, shortLabel: "S", label: "Sabado" },
  { value: 0, shortLabel: "D", label: "Domingo" },
];

const DEFAULT_SESSION_MINUTES = 50;
const MAX_INPUT_DECIMALS = 4;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const EPSILON = 1e-9;

export function calculateStudyHours(input: StudyHoursInput): StudyHoursResult {
  const mode = input.mode;
  const totalHours = normalizePositiveNumber(
    input.totalHours,
    "Las horas objetivo deben ser mayores que cero.",
  );
  const completedHours = normalizeNonNegativeNumber(
    input.completedHours ?? 0,
    "Las horas ya estudiadas no pueden ser negativas.",
  );
  const sessionMinutes = normalizeSessionMinutes(input.sessionMinutes);
  const selectedWeekdays = normalizeSelectedWeekdays(input.selectedWeekdays);
  const startDate = normalizeDateInput(input.startDate, "La fecha de inicio no es valida.");

  if (completedHours - totalHours > EPSILON) {
    throw new RangeError("Las horas ya estudiadas no pueden superar las horas objetivo.");
  }

  const pendingHours = roundToDecimals(Math.max(totalHours - completedHours, 0), 4);

  if (pendingHours <= EPSILON) {
    return buildCompletedResult({
      mode,
      totalHours,
      completedHours,
      startDate,
      selectedWeekdays,
      sessionMinutes,
    });
  }

  if (mode === "hoursPerDay") {
    return calculateHoursPerDay({
      totalHours,
      completedHours,
      pendingHours,
      startDate,
      deadlineDate: input.deadlineDate,
      selectedWeekdays,
      sessionMinutes,
      referenceDate: input.referenceDate,
    });
  }

  return calculateEstimatedDate({
    totalHours,
    completedHours,
    pendingHours,
    startDate,
    dailyHours: input.dailyHours,
    selectedWeekdays,
    sessionMinutes,
  });
}

export function parseStudyHoursNumber(
  value: string,
  options: {
    required?: boolean;
    allowZero?: boolean;
    maxDecimals?: number;
  } = {},
): ParseStudyHoursNumberResult {
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

export function countStudyDates(
  startDate: string,
  endDate: string,
  selectedWeekdays: Weekday[],
): number {
  const start = parseIsoDate(startDate);
  const end = parseIsoDate(endDate);
  const weekdays = new Set(normalizeSelectedWeekdays(selectedWeekdays));

  if (end.dayIndex < start.dayIndex) {
    return 0;
  }

  let count = 0;

  for (let dayIndex = start.dayIndex; dayIndex <= end.dayIndex; dayIndex += 1) {
    const weekday = getWeekdayFromDayIndex(dayIndex);

    if (weekdays.has(weekday)) {
      count += 1;
    }
  }

  return count;
}

export function advanceStudyDates(
  startDate: string,
  selectedWeekdays: Weekday[],
  studyDaysNeeded: number,
): string {
  const normalizedStart = parseIsoDate(startDate);
  const weekdays = new Set(normalizeSelectedWeekdays(selectedWeekdays));
  const daysNeeded = Math.ceil(
    normalizePositiveNumber(studyDaysNeeded, "Los dias de estudio deben ser mayores que cero."),
  );
  let countedDays = 0;

  for (
    let dayIndex = normalizedStart.dayIndex;
    dayIndex < normalizedStart.dayIndex + 36600;
    dayIndex += 1
  ) {
    const weekday = getWeekdayFromDayIndex(dayIndex);

    if (!weekdays.has(weekday)) {
      continue;
    }

    countedDays += 1;

    if (countedDays === daysNeeded) {
      return formatIsoDateFromDayIndex(dayIndex);
    }
  }

  throw new RangeError("No se pudo estimar una fecha razonable.");
}

export function getStudyLoadInfo(hoursPerDay: number): StudyLoadInfo {
  if (hoursPerDay <= EPSILON) {
    return {
      level: "completed",
      label: "Completado",
      message: "Ya cubriste las horas objetivo.",
    };
  }

  if (hoursPerDay <= 2) {
    return {
      level: "sustainable",
      label: "Sostenible",
      message: "Ritmo ligero y facil de mantener.",
    };
  }

  if (hoursPerDay <= 4) {
    return {
      level: "moderate",
      label: "Moderada",
      message: "Ritmo razonable si mantienes constancia.",
    };
  }

  if (hoursPerDay <= 8) {
    return {
      level: "demanding",
      label: "Exigente",
      message: "Requiere bloques largos y descansos.",
    };
  }

  return {
    level: "very_high",
    label: "Muy alta",
    message: "Conviene cambiar fecha, dias o meta.",
  };
}

export function buildStudyHoursSummary(result: StudyHoursResult): string {
  const lines = [
    "Calculadora de horas de estudio - calculadoras.tools",
    `Horas objetivo: ${formatFlexibleStudyNumber(result.totalHours)} h`,
    `Horas pendientes: ${formatFlexibleStudyNumber(result.pendingHours)} h`,
    `Dias de estudio: ${formatSelectedWeekdays(result.selectedWeekdays)}`,
  ];

  if (result.pendingHours <= EPSILON) {
    lines.push("Estado: meta completada");
    return lines.join("\n");
  }

  if (result.mode === "hoursPerDay") {
    lines.push(
      `Fecha limite: ${formatStudyDate(result.deadlineDate ?? result.startDate)}`,
      `Dias efectivos: ${result.effectiveStudyDays}`,
      `Horas por dia: ${formatStudyDuration(result.hoursPerDay)}`,
    );
  } else {
    lines.push(
      `Horas por dia: ${formatStudyDuration(result.hoursPerDay)}`,
      `Fecha estimada: ${formatStudyDate(result.estimatedDate ?? result.startDate)}`,
      `Dias efectivos: ${result.effectiveStudyDays}`,
    );
  }

  lines.push(
    `Sesiones por dia: ${result.sessionsPerDay} de ${result.sessionMinutes} min`,
    `Horas por semana: ${formatStudyDuration(result.hoursPerWeek)}`,
    `Carga: ${result.load.label}`,
    result.load.message,
    "",
    "Plan semanal:",
    ...result.weeklyPlan.map((item) =>
      item.isStudyDay
        ? `${item.label}: ${item.hoursLabel}, ${item.sessions} sesiones`
        : `${item.label}: descanso`,
    ),
  );

  return lines.join("\n");
}

export function formatStudyDuration(hours: number): string {
  assertFiniteNumber(hours);

  const totalMinutes = Math.max(0, Math.round(hours * 60));
  const wholeHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (wholeHours === 0) {
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${wholeHours} h`;
  }

  return `${wholeHours} h ${minutes} min`;
}

export function formatStudyDate(date: string): string {
  const normalized = parseIsoDate(date);

  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(normalized.time));
}

export function formatFlexibleStudyNumber(value: number): string {
  assertFiniteNumber(value);

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 2,
  }).format(roundToDecimals(value, 2));
}

export function formatSelectedWeekdays(selectedWeekdays: Weekday[]): string {
  const selected = new Set(normalizeSelectedWeekdays(selectedWeekdays));

  return STUDY_WEEKDAYS.filter((weekday) => selected.has(weekday.value))
    .map((weekday) => weekday.shortLabel)
    .join("-");
}

export function getTodayIsoDate(): string {
  return formatIsoDateFromDayIndex(Math.floor(Date.now() / MS_PER_DAY));
}

function calculateHoursPerDay({
  totalHours,
  completedHours,
  pendingHours,
  startDate,
  deadlineDate,
  selectedWeekdays,
  sessionMinutes,
  referenceDate,
}: {
  totalHours: number;
  completedHours: number;
  pendingHours: number;
  startDate: string;
  deadlineDate?: string | null;
  selectedWeekdays: Weekday[];
  sessionMinutes: number;
  referenceDate?: string | null;
}): StudyHoursResult {
  const normalizedDeadline = normalizeDateInput(
    deadlineDate ?? "",
    "La fecha limite es obligatoria.",
  );
  const reference = normalizeDateInput(
    referenceDate ?? getTodayIsoDate(),
    "La fecha de referencia no es valida.",
  );

  if (parseIsoDate(normalizedDeadline).dayIndex <= parseIsoDate(reference).dayIndex) {
    throw new RangeError("La fecha limite debe ser futura.");
  }

  if (parseIsoDate(normalizedDeadline).dayIndex < parseIsoDate(startDate).dayIndex) {
    throw new RangeError("La fecha limite no puede ser anterior al inicio.");
  }

  const effectiveStudyDays = countStudyDates(
    startDate,
    normalizedDeadline,
    selectedWeekdays,
  );

  if (effectiveStudyDays <= 0) {
    throw new RangeError("No hay dias efectivos de estudio en el rango.");
  }

  const hoursPerDay = pendingHours / effectiveStudyDays;

  return buildResult({
    mode: "hoursPerDay",
    totalHours,
    completedHours,
    pendingHours,
    startDate,
    deadlineDate: normalizedDeadline,
    estimatedDate: null,
    selectedWeekdays,
    effectiveStudyDays,
    hoursPerDay,
    sessionMinutes,
  });
}

function calculateEstimatedDate({
  totalHours,
  completedHours,
  pendingHours,
  startDate,
  dailyHours,
  selectedWeekdays,
  sessionMinutes,
}: {
  totalHours: number;
  completedHours: number;
  pendingHours: number;
  startDate: string;
  dailyHours?: number | null;
  selectedWeekdays: Weekday[];
  sessionMinutes: number;
}): StudyHoursResult {
  const hoursPerDay = normalizePositiveNumber(
    dailyHours ?? Number.NaN,
    "Las horas por dia deben ser mayores que cero.",
  );
  const effectiveStudyDays = Math.ceil(pendingHours / hoursPerDay);
  const estimatedDate = advanceStudyDates(
    startDate,
    selectedWeekdays,
    effectiveStudyDays,
  );

  return buildResult({
    mode: "estimatedDate",
    totalHours,
    completedHours,
    pendingHours,
    startDate,
    deadlineDate: null,
    estimatedDate,
    selectedWeekdays,
    effectiveStudyDays,
    hoursPerDay,
    sessionMinutes,
  });
}

function buildResult({
  mode,
  totalHours,
  completedHours,
  pendingHours,
  startDate,
  deadlineDate,
  estimatedDate,
  selectedWeekdays,
  effectiveStudyDays,
  hoursPerDay,
  sessionMinutes,
}: {
  mode: StudyHoursMode;
  totalHours: number;
  completedHours: number;
  pendingHours: number;
  startDate: string;
  deadlineDate: string | null;
  estimatedDate: string | null;
  selectedWeekdays: Weekday[];
  effectiveStudyDays: number;
  hoursPerDay: number;
  sessionMinutes: number;
}): StudyHoursResult {
  const roundedHoursPerDay = roundToDecimals(hoursPerDay, 4);
  const sessionsPerDay = Math.ceil((roundedHoursPerDay * 60) / sessionMinutes);
  const hoursPerWeek = roundedHoursPerDay * selectedWeekdays.length;
  const load = getStudyLoadInfo(roundedHoursPerDay);
  const weeklyPlan = buildWeeklyPlan(
    selectedWeekdays,
    roundedHoursPerDay,
    sessionsPerDay,
  );

  return {
    mode,
    totalHours,
    completedHours,
    pendingHours,
    startDate,
    deadlineDate,
    estimatedDate,
    selectedWeekdays,
    effectiveStudyDays,
    hoursPerDay: roundToDecimals(roundedHoursPerDay, 2),
    sessionsPerDay,
    sessionMinutes,
    hoursPerWeek: roundToDecimals(hoursPerWeek, 2),
    load,
    recommendation: buildRecommendation({
      mode,
      hoursPerDay: roundedHoursPerDay,
      sessionsPerDay,
      sessionMinutes,
      load,
      estimatedDate,
    }),
    weeklyPlan,
  };
}

function buildCompletedResult({
  mode,
  totalHours,
  completedHours,
  startDate,
  selectedWeekdays,
  sessionMinutes,
}: {
  mode: StudyHoursMode;
  totalHours: number;
  completedHours: number;
  startDate: string;
  selectedWeekdays: Weekday[];
  sessionMinutes: number;
}): StudyHoursResult {
  const load = getStudyLoadInfo(0);

  return {
    mode,
    totalHours,
    completedHours,
    pendingHours: 0,
    startDate,
    deadlineDate: null,
    estimatedDate: mode === "estimatedDate" ? startDate : null,
    selectedWeekdays,
    effectiveStudyDays: 0,
    hoursPerDay: 0,
    sessionsPerDay: 0,
    sessionMinutes,
    hoursPerWeek: 0,
    load,
    recommendation: "Ya completaste las horas objetivo.",
    weeklyPlan: buildWeeklyPlan(selectedWeekdays, 0, 0),
  };
}

function buildWeeklyPlan(
  selectedWeekdays: Weekday[],
  hoursPerDay: number,
  sessionsPerDay: number,
): StudyWeekPlanItem[] {
  const selected = new Set(selectedWeekdays);

  return STUDY_WEEKDAYS.map((weekday) => {
    const isStudyDay = selected.has(weekday.value);

    return {
      weekday: weekday.value,
      shortLabel: weekday.shortLabel,
      label: weekday.label,
      isStudyDay,
      hours: isStudyDay ? roundToDecimals(hoursPerDay, 2) : 0,
      hoursLabel: isStudyDay ? formatStudyDuration(hoursPerDay) : "Descanso",
      sessions: isStudyDay ? sessionsPerDay : 0,
    };
  });
}

function buildRecommendation({
  mode,
  hoursPerDay,
  sessionsPerDay,
  sessionMinutes,
  load,
  estimatedDate,
}: {
  mode: StudyHoursMode;
  hoursPerDay: number;
  sessionsPerDay: number;
  sessionMinutes: number;
  load: StudyLoadInfo;
  estimatedDate: string | null;
}) {
  const base = `Estudia ${formatStudyDuration(hoursPerDay)} por dia en ${sessionsPerDay} sesiones de ${sessionMinutes} min.`;

  if (load.level === "very_high") {
    return `${base} Este plan es muy alto; conviene ampliar la fecha, sumar dias o bajar horas pendientes.`;
  }

  if (mode === "estimatedDate" && estimatedDate) {
    return `${base} Terminas alrededor del ${formatStudyDate(estimatedDate)}.`;
  }

  return `${base} ${load.message}`;
}

function normalizeSelectedWeekdays(selectedWeekdays: Weekday[]): Weekday[] {
  if (!Array.isArray(selectedWeekdays)) {
    throw new RangeError("Selecciona al menos un dia de estudio.");
  }

  const unique = Array.from(new Set(selectedWeekdays));
  const valid = unique.every(
    (weekday) =>
      Number.isInteger(weekday) &&
      weekday >= 0 &&
      weekday <= 6,
  );

  if (!valid || unique.length === 0) {
    throw new RangeError("Selecciona al menos un dia de estudio.");
  }

  return STUDY_WEEKDAYS.map((weekday) => weekday.value).filter((weekday) =>
    unique.includes(weekday),
  );
}

function normalizeDateInput(value: string, message: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new RangeError(message);
  }

  try {
    return parseIsoDate(trimmed).isoDate;
  } catch {
    throw new RangeError(message);
  }
}

function parseIsoDate(value: string): {
  isoDate: string;
  time: number;
  dayIndex: number;
} {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());

  if (!match) {
    throw new RangeError("La fecha debe usar formato YYYY-MM-DD.");
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const time = Date.UTC(year, month - 1, day);
  const date = new Date(time);
  const isValid =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  if (!isValid) {
    throw new RangeError("La fecha no es valida.");
  }

  return {
    isoDate: value.trim(),
    time,
    dayIndex: Math.floor(time / MS_PER_DAY),
  };
}

function getWeekdayFromDayIndex(dayIndex: number): Weekday {
  const weekday = new Date(dayIndex * MS_PER_DAY).getUTCDay();

  return weekday as Weekday;
}

function formatIsoDateFromDayIndex(dayIndex: number): string {
  return new Date(dayIndex * MS_PER_DAY).toISOString().slice(0, 10);
}

function normalizePositiveNumber(value: number, message: string): number {
  assertFiniteNumber(value);

  if (value <= 0) {
    throw new RangeError(message);
  }

  return value;
}

function normalizeNonNegativeNumber(value: number, message: string): number {
  assertFiniteNumber(value);

  if (value < 0) {
    throw new RangeError(message);
  }

  return value;
}

function normalizeSessionMinutes(value: number | null | undefined): number {
  const sessionMinutes = value ?? DEFAULT_SESSION_MINUTES;

  assertFiniteNumber(sessionMinutes);

  if (sessionMinutes < 15 || sessionMinutes > 240) {
    throw new RangeError("La duracion de sesion debe estar entre 15 y 240 minutos.");
  }

  return Math.round(sessionMinutes);
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

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** Math.min(4, Math.max(0, Math.trunc(decimals)));

  return normalizeNegativeZero(
    Math.round((value + Number.EPSILON) * factor) / factor,
  );
}

function normalizeNegativeZero(value: number) {
  return Object.is(value, -0) ? 0 : value;
}
