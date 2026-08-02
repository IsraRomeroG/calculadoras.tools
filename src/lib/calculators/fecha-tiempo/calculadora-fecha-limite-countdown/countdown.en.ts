import * as base from "./countdown";
import { addCalendarDays, formatFullPlainDate } from "../diferencia-entre-fechas/date-difference.en";
import type {
  BuildCalendarFileInput,
  BuildCopyTextInput,
  CountdownResult,
  ExactDuration,
} from "./countdown";

export type {
  BuildCalendarFileInput,
  BuildCopyTextInput,
  CalculateCountdownInput,
  CountdownMode,
  CountdownResult,
  CountdownStatus,
  ExactDuration,
  LocalTargetResult,
  ParseShareFragmentResult,
  SharePayload,
} from "./countdown";

export const DEFAULT_LOCALE = "en-US";
export const MIN_YEAR = base.MIN_YEAR;
export const MAX_YEAR = base.MAX_YEAR;
export const DEFAULT_TIME = base.DEFAULT_TIME;
export const MAX_EVENT_NAME_LENGTH = base.MAX_EVENT_NAME_LENGTH;
export const parseDateInput = base.parseDateInput;
export const formatDateInput = base.formatDateInput;
export const getLocalDateParts = base.getLocalDateParts;
export const createLocalTarget = base.createLocalTarget;
export const calculateCountdown = base.calculateCountdown;
export const decomposeDuration = base.decomposeDuration;
export const formatCountdownClock = base.formatCountdownClock;
export const buildShareFragment = base.buildShareFragment;
export const parseShareFragment = base.parseShareFragment;

export function formatExactDuration(duration: ExactDuration, includeSeconds = false) {
  const parts = [
    duration.days > 0 ? unit(duration.days, "day", "days") : null,
    duration.hours > 0 ? unit(duration.hours, "hour", "hours") : null,
    duration.minutes > 0 ? unit(duration.minutes, "minute", "minutes") : null,
    includeSeconds ? unit(duration.seconds, "second", "seconds") : null,
  ].filter((value): value is string => Boolean(value));
  if (!includeSeconds && !parts.length && duration.totalSeconds > 0) return "less than 1 minute";
  if (!parts.length) return "0 minutes";
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(", ")}, and ${parts.at(-1)}`;
}

export function buildCountdownHeadline(result: CountdownResult, name?: string) {
  const subject = formatSubject(name);
  const days = Math.abs(result.calendarDays);
  switch (result.status) {
    case "date-future": return `${unit(days, "calendar day", "calendar days")} remaining.`;
    case "date-today": return `${subject} is today.`;
    case "date-past": return `${subject} was ${unit(days, "calendar day", "calendar days")} ago.`;
    case "datetime-now": return `${subject} is due now.`;
    case "datetime-past": return `${subject} was due ${formatExactDuration(result.duration!)} ago.`;
    case "datetime-today": return `${subject} is due today.`;
    case "datetime-soon": return `${formatExactDuration(result.duration!)} remaining.`;
    default: return `${unit(days, "calendar day", "calendar days")} remaining.`;
  }
}

export function formatLocalDateTime(targetMs: number, locale = DEFAULT_LOCALE) {
  return base.formatLocalDateTime(targetMs, locale);
}
export function formatDateTimeInTimeZone(targetMs: number, timeZone: string, locale = DEFAULT_LOCALE) {
  return base.formatDateTimeInTimeZone(targetMs, timeZone, locale);
}

export function buildCopyText({ name, mode, targetDate, result, targetMs, timeZone }: BuildCopyTextInput) {
  const lines = [normalizeName(name) || "Deadline"];
  if (mode === "date-only") {
    lines.push(`Date: ${formatFullPlainDate(targetDate)}`);
  } else {
    if (!Number.isFinite(targetMs)) throw new RangeError("A valid target instant is required.");
    lines.push(`Due: ${formatLocalDateTime(Number(targetMs))}`);
    if (timeZone) lines.push(`Time zone: ${timeZone}`);
  }
  lines.push(calendarSummary(result));
  if (result.duration) lines.push(`Exact time: ${formatExactDuration(result.duration)}.`);
  return lines.join("\n");
}

export function buildCalendarFile({ name, mode, targetDate, targetMs, nowMs = Date.now() }: BuildCalendarFileInput) {
  const title = ics(normalizeName(name) || "Deadline");
  const description = ics("Deadline created with calculadoras.tools");
  const uidTarget = mode === "date-only" ? icsDate(targetDate) : Math.trunc(targetMs ?? 0);
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//calculadoras.tools//Deadline//EN",
    "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
    `UID:${uidTarget}@calculadoras.tools`, `DTSTAMP:${icsUtc(nowMs)}`,
    `SUMMARY:${title}`, `DESCRIPTION:${description}`,
  ];
  if (mode === "date-only") {
    lines.push(`DTSTART;VALUE=DATE:${icsDate(targetDate)}`);
    lines.push(`DTEND;VALUE=DATE:${icsDate(addCalendarDays(targetDate, 1))}`);
  } else {
    if (!Number.isFinite(targetMs)) throw new RangeError("A valid target instant is required.");
    lines.push(`DTSTART:${icsUtc(Number(targetMs))}`);
  }
  lines.push("END:VEVENT", "END:VCALENDAR", "");
  return lines.join("\r\n");
}

export function getCalendarFilename(name?: string) {
  const slug = (normalizeName(name) || "deadline").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "").slice(0, 60);
  return `${slug || "deadline"}.ics`;
}
export function getDetectedTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time zone";
}

function calendarSummary(result: CountdownResult) {
  const days = Math.abs(result.calendarDays);
  if (result.calendarDays > 0) return `${unit(days, "calendar day", "calendar days")} remaining.`;
  if (result.calendarDays < 0) return `${unit(days, "calendar day", "calendar days")} have passed.`;
  return "The date is today.";
}
function normalizeName(name?: string) {
  const value = name?.trim() ?? "";
  return value.length <= MAX_EVENT_NAME_LENGTH ? value : "";
}
function formatSubject(name?: string) {
  const subject = normalizeName(name) || "the deadline";
  return `${subject.charAt(0).toUpperCase()}${subject.slice(1)}`;
}
function unit(value: number, singular: string, plural: string) {
  return `${new Intl.NumberFormat(DEFAULT_LOCALE).format(value)} ${value === 1 ? singular : plural}`;
}
function ics(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}
function icsDate(date: {year:number;month:number;day:number}) {
  return `${String(date.year).padStart(4,"0")}${String(date.month).padStart(2,"0")}${String(date.day).padStart(2,"0")}`;
}
function icsUtc(value: number) {
  const d = new Date(value);
  return `${d.getUTCFullYear()}${String(d.getUTCMonth()+1).padStart(2,"0")}${String(d.getUTCDate()).padStart(2,"0")}T${String(d.getUTCHours()).padStart(2,"0")}${String(d.getUTCMinutes()).padStart(2,"0")}${String(d.getUTCSeconds()).padStart(2,"0")}Z`;
}
