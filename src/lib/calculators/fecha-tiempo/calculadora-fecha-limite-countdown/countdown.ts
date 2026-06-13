import {
  addCalendarDays,
  diffTotalDays,
  formatFullPlainDate,
  isValidDateParts,
  type PlainDateParts,
} from "@lib/calculators/fecha-tiempo/diferencia-entre-fechas/date-difference";

export type CountdownMode = "date-only" | "date-time";

export type CountdownStatus =
  | "date-future"
  | "date-today"
  | "date-past"
  | "datetime-future"
  | "datetime-today"
  | "datetime-soon"
  | "datetime-now"
  | "datetime-past";

export interface ExactDuration {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

export interface CountdownResult {
  mode: CountdownMode;
  status: CountdownStatus;
  calendarDays: number;
  diffMs?: number;
  duration?: ExactDuration;
}

export interface CalculateCountdownInput {
  mode: CountdownMode;
  targetDate: PlainDateParts;
  targetMs?: number;
  nowMs?: number;
}

export interface LocalTargetResult {
  ok: boolean;
  targetMs?: number;
  error?: "date_invalid" | "time_invalid" | "local_time_invalid" | "year_range";
}

export interface SharePayload {
  mode: CountdownMode;
  date?: PlainDateParts;
  targetMs?: number;
  timeZone?: string;
  name?: string;
}

export type ParseShareFragmentResult =
  | { ok: true; value: SharePayload }
  | { ok: false };

export interface BuildCopyTextInput {
  name?: string;
  mode: CountdownMode;
  targetDate: PlainDateParts;
  result: CountdownResult;
  targetMs?: number;
  timeZone?: string;
  locale?: string;
}

export interface BuildCalendarFileInput {
  name?: string;
  mode: CountdownMode;
  targetDate: PlainDateParts;
  targetMs?: number;
  nowMs?: number;
}

export const DEFAULT_LOCALE = "es-MX";
export const MIN_YEAR = 1900;
export const MAX_YEAR = 2100;
export const DEFAULT_TIME = "23:59";
export const MAX_EVENT_NAME_LENGTH = 80;

const millisecondsPerDay = 24 * 60 * 60 * 1000;
const millisecondsPerSecond = 1000;

export function parseDateInput(value: string): PlainDateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());

  if (!match) {
    return null;
  }

  const date = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };

  if (
    date.year < MIN_YEAR ||
    date.year > MAX_YEAR ||
    !isValidDateParts(date)
  ) {
    return null;
  }

  return date;
}

export function formatDateInput(date: PlainDateParts): string {
  assertValidDate(date);

  return [
    String(date.year).padStart(4, "0"),
    String(date.month).padStart(2, "0"),
    String(date.day).padStart(2, "0"),
  ].join("-");
}

export function getLocalDateParts(date = new Date()): PlainDateParts {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

export function createLocalTarget(
  date: PlainDateParts,
  hour: number,
  minute: number,
): LocalTargetResult {
  if (!isValidDateParts(date)) {
    return { ok: false, error: "date_invalid" };
  }

  if (date.year < MIN_YEAR || date.year > MAX_YEAR) {
    return { ok: false, error: "year_range" };
  }

  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return { ok: false, error: "time_invalid" };
  }

  const target = new Date(
    date.year,
    date.month - 1,
    date.day,
    hour,
    minute,
    0,
    0,
  );

  if (
    target.getFullYear() !== date.year ||
    target.getMonth() !== date.month - 1 ||
    target.getDate() !== date.day ||
    target.getHours() !== hour ||
    target.getMinutes() !== minute
  ) {
    return { ok: false, error: "local_time_invalid" };
  }

  return { ok: true, targetMs: target.getTime() };
}

export function calculateCountdown({
  mode,
  targetDate,
  targetMs,
  nowMs = Date.now(),
}: CalculateCountdownInput): CountdownResult {
  assertValidDate(targetDate);

  if (targetDate.year < MIN_YEAR || targetDate.year > MAX_YEAR) {
    throw new RangeError("La fecha queda fuera del rango soportado.");
  }

  const nowDate = getLocalDateParts(new Date(nowMs));
  const calendarDays = diffTotalDays(nowDate, targetDate);

  if (mode === "date-only") {
    return {
      mode,
      calendarDays,
      status:
        calendarDays > 0
          ? "date-future"
          : calendarDays < 0
            ? "date-past"
            : "date-today",
    };
  }

  if (!Number.isFinite(targetMs)) {
    throw new RangeError("Se requiere un instante objetivo válido.");
  }

  const diffMs = Number(targetMs) - nowMs;
  const duration = decomposeDuration(diffMs);
  let status: CountdownStatus;

  if (Math.abs(diffMs) < millisecondsPerSecond) {
    status = "datetime-now";
  } else if (diffMs < 0) {
    status = "datetime-past";
  } else if (calendarDays === 0) {
    status = "datetime-today";
  } else if (diffMs <= millisecondsPerDay) {
    status = "datetime-soon";
  } else {
    status = "datetime-future";
  }

  return {
    mode,
    status,
    calendarDays,
    diffMs,
    duration,
  };
}

export function decomposeDuration(diffMs: number): ExactDuration {
  const totalSeconds = Math.floor(Math.abs(diffMs) / millisecondsPerSecond);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalSeconds,
  };
}

export function formatCountdownClock(duration: ExactDuration): string {
  return [
    `${String(duration.days).padStart(2, "0")} d`,
    `${String(duration.hours).padStart(2, "0")} h`,
    `${String(duration.minutes).padStart(2, "0")} min`,
    `${String(duration.seconds).padStart(2, "0")} s`,
  ].join(" · ");
}

export function formatExactDuration(
  duration: ExactDuration,
  includeSeconds = false,
): string {
  const parts = [
    duration.days > 0 ? formatUnit(duration.days, "día", "días") : null,
    duration.hours > 0 ? formatUnit(duration.hours, "hora", "horas") : null,
    duration.minutes > 0 ? formatUnit(duration.minutes, "minuto", "minutos") : null,
    includeSeconds
      ? formatUnit(duration.seconds, "segundo", "segundos")
      : null,
  ].filter((part): part is string => Boolean(part));

  if (!includeSeconds && parts.length === 0 && duration.totalSeconds > 0) {
    return "menos de 1 minuto";
  }

  return joinParts(parts);
}

export function buildCountdownHeadline(
  result: CountdownResult,
  name?: string,
): string {
  const subject = formatSubject(name);
  const absoluteCalendarDays = Math.abs(result.calendarDays);

  switch (result.status) {
    case "date-future":
      return `Faltan ${formatUnit(absoluteCalendarDays, "día calendario", "días calendario")}.`;
    case "date-today":
      return `${subject} es hoy.`;
    case "date-past":
      return `${subject} fue hace ${formatUnit(absoluteCalendarDays, "día calendario", "días calendario")}.`;
    case "datetime-now":
      return `${subject} vence ahora.`;
    case "datetime-past":
      return `${subject} venció hace ${formatExactDuration(result.duration!)}.`;
    case "datetime-today":
      return `${subject} vence hoy.`;
    case "datetime-soon":
      return `Faltan ${formatExactDuration(result.duration!)}.`;
    default:
      return `Faltan ${formatUnit(absoluteCalendarDays, "día calendario", "días calendario")}.`;
  }
}

export function formatLocalDateTime(
  targetMs: number,
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(targetMs));
}

export function formatDateTimeInTimeZone(
  targetMs: number,
  timeZone: string,
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  }).format(new Date(targetMs));
}

export function buildCopyText({
  name,
  mode,
  targetDate,
  result,
  targetMs,
  timeZone,
  locale = DEFAULT_LOCALE,
}: BuildCopyTextInput): string {
  const lines = [normalizeName(name) || "Fecha límite"];

  if (mode === "date-only") {
    lines.push(`Fecha: ${formatFullPlainDate(targetDate, locale)}`);
  } else {
    if (!Number.isFinite(targetMs)) {
      throw new RangeError("Se requiere un instante objetivo válido.");
    }

    lines.push(`Vence: ${formatLocalDateTime(Number(targetMs), locale)}`);

    if (timeZone) {
      lines.push(`Zona horaria: ${timeZone}`);
    }
  }

  lines.push(buildCalendarSummary(result));

  if (result.duration) {
    lines.push(`Tiempo exacto: ${formatExactDuration(result.duration)}.`);
  }

  return lines.join("\n");
}

export function buildShareFragment(
  payload: SharePayload,
  includeName = false,
): string {
  const params = new URLSearchParams();
  params.set("mode", payload.mode);

  if (payload.mode === "date-only") {
    if (!payload.date) {
      throw new RangeError("Se requiere una fecha válida.");
    }

    params.set("date", formatDateInput(payload.date));
  } else {
    if (!Number.isFinite(payload.targetMs) || !isValidTimeZone(payload.timeZone)) {
      throw new RangeError("Se requiere un instante y zona horaria válidos.");
    }

    params.set("target", String(Math.trunc(Number(payload.targetMs))));
    params.set("tz", payload.timeZone!);
  }

  const name = normalizeName(payload.name);

  if (includeName && name) {
    params.set("name", name);
  }

  return `#${params.toString()}`;
}

export function parseShareFragment(fragment: string): ParseShareFragmentResult {
  const rawFragment = fragment.startsWith("#") ? fragment.slice(1) : fragment;

  if (!rawFragment) {
    return { ok: false };
  }

  const params = new URLSearchParams(rawFragment);
  const mode = params.get("mode");
  const rawName = params.get("name") ?? undefined;
  const normalizedName = normalizeName(rawName);
  const name = normalizedName || undefined;

  if (rawName && !normalizedName) {
    return { ok: false };
  }

  if (mode === "date-only") {
    const date = parseDateInput(params.get("date") ?? "");

    return date
      ? { ok: true, value: { mode, date, name } }
      : { ok: false };
  }

  if (mode === "date-time") {
    const rawTarget = params.get("target") ?? "";
    const targetMs = Number(rawTarget);
    const timeZone = params.get("tz") ?? "";
    const targetDate = getLocalDateParts(new Date(targetMs));

    if (
      !/^-?\d+$/.test(rawTarget) ||
      !Number.isSafeInteger(targetMs) ||
      !isValidTimeZone(timeZone) ||
      targetDate.year < MIN_YEAR ||
      targetDate.year > MAX_YEAR
    ) {
      return { ok: false };
    }

    return {
      ok: true,
      value: { mode, targetMs, timeZone, name },
    };
  }

  return { ok: false };
}

export function buildCalendarFile({
  name,
  mode,
  targetDate,
  targetMs,
  nowMs = Date.now(),
}: BuildCalendarFileInput): string {
  assertValidDate(targetDate);

  const title = escapeIcsText(normalizeName(name) || "Fecha límite");
  const description = escapeIcsText(
    "Fecha límite creada con calculadoras.tools",
  );
  const uidTarget =
    mode === "date-only" ? formatIcsDate(targetDate) : Math.trunc(targetMs ?? 0);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//calculadoras.tools//Fecha limite//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uidTarget}@calculadoras.tools`,
    `DTSTAMP:${formatIcsUtc(nowMs)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
  ];

  if (mode === "date-only") {
    lines.push(`DTSTART;VALUE=DATE:${formatIcsDate(targetDate)}`);
    lines.push(`DTEND;VALUE=DATE:${formatIcsDate(addCalendarDays(targetDate, 1))}`);
  } else {
    if (!Number.isFinite(targetMs)) {
      throw new RangeError("Se requiere un instante objetivo válido.");
    }

    lines.push(`DTSTART:${formatIcsUtc(Number(targetMs))}`);
  }

  lines.push("END:VEVENT", "END:VCALENDAR", "");

  return lines.join("\r\n");
}

export function getCalendarFilename(name?: string): string {
  const slug = (normalizeName(name) || "fecha-limite")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${slug || "fecha-limite"}.ics`;
}

export function getDetectedTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "Zona horaria local";
}

function buildCalendarSummary(result: CountdownResult): string {
  const days = Math.abs(result.calendarDays);

  if (result.calendarDays > 0) {
    return `Faltan ${formatUnit(days, "día calendario", "días calendario")}.`;
  }

  if (result.calendarDays < 0) {
    return `Han pasado ${formatUnit(days, "día calendario", "días calendario")}.`;
  }

  return "La fecha es hoy.";
}

function normalizeName(name?: string): string {
  const normalized = name?.trim() ?? "";

  return normalized.length <= MAX_EVENT_NAME_LENGTH ? normalized : "";
}

function formatSubject(name?: string): string {
  const normalized = normalizeName(name);
  const subject = normalized || "la fecha límite";

  return `${subject.charAt(0).toUpperCase()}${subject.slice(1)}`;
}

function formatUnit(value: number, singular: string, plural: string): string {
  return `${new Intl.NumberFormat(DEFAULT_LOCALE).format(value)} ${
    value === 1 ? singular : plural
  }`;
}

function joinParts(parts: string[]): string {
  if (parts.length === 0) {
    return "0 minutos";
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return `${parts.slice(0, -1).join(", ")} y ${parts.at(-1)}`;
}

function isValidTimeZone(timeZone?: string): boolean {
  if (!timeZone || timeZone.length > 100) {
    return false;
  }

  try {
    new Intl.DateTimeFormat("en", { timeZone }).format();
    return true;
  } catch {
    return false;
  }
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function formatIcsDate(date: PlainDateParts): string {
  return formatDateInput(date).replace(/-/g, "");
}

function formatIcsUtc(timestamp: number): string {
  return new Date(timestamp)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function assertValidDate(date: PlainDateParts): void {
  if (!isValidDateParts(date)) {
    throw new RangeError("La fecha debe ser válida.");
  }
}
