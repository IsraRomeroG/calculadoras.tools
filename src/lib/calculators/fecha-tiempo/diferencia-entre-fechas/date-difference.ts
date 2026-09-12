export interface PlainDateParts {
  year: number;
  month: number;
  day: number;
}

export interface CalendarDuration {
  years: number;
  months: number;
  days: number;
}

export interface WeekDuration {
  weeks: number;
  days: number;
}

export type CountMode = "standard" | "inclusive";
export type DayCountType = "calendar" | "business";
export type DateOperation = "add" | "subtract";
export type DateUnit = "days" | "businessDays" | "weeks" | "months" | "years";

export interface DateDifferenceResult {
  sign: 1 | -1 | 0;
  totalDays: number;
  calendar: CalendarDuration;
  weeks: WeekDuration;
  businessDays: number;
  weekendDays: number;
  startWeekday: string;
  endWeekday: string;
  startIsWeekend: boolean;
  endIsWeekend: boolean;
  nextBusinessDayAfterEnd?: PlainDateParts;
}

export interface AddDateResult {
  date: PlainDateParts;
  weekday: string;
  dayOfYear: number;
  isoWeek: number;
  quarter: 1 | 2 | 3 | 4;
  isWeekend: boolean;
  nextBusinessDay?: PlainDateParts;
}

export type ParseDatePartsResult =
  | {
      ok: true;
      value: PlainDateParts;
    }
  | {
      ok: false;
      error:
        | "required"
        | "invalid"
        | "year_four_digits"
        | "date_invalid"
        | "year_range";
    };

export interface ParseDatePartsInput {
  day: string;
  month: string;
  year: string;
  minYear?: number;
  maxYear?: number;
}

export interface DateOperationInput {
  startDate: PlainDateParts;
  operation: DateOperation;
  amount: number;
  unit: DateUnit;
  locale?: string;
  minYear?: number;
  maxYear?: number;
}

export interface DateDifferenceInput {
  startDate: PlainDateParts;
  endDate: PlainDateParts;
  countMode?: CountMode;
  locale?: string;
}

export interface DateDifferenceCopyInput extends DateDifferenceInput {
  result: DateDifferenceResult;
}

export const DEFAULT_LOCALE = "es-MX";
export const MIN_YEAR = 1900;
export const MAX_YEAR = 2100;
export const MAX_AMOUNT = 36500;
export const DEFAULT_COUNT_MODE: CountMode = "standard";
export const DEFAULT_DAY_COUNT_TYPE: DayCountType = "calendar";

const millisecondsPerDay = 24 * 60 * 60 * 1000;

export function parseDateParts({
  day,
  month,
  year,
  minYear,
  maxYear,
}: ParseDatePartsInput): ParseDatePartsResult {
  const dayText = day.trim();
  const monthText = month.trim();
  const yearText = year.trim();

  if (!dayText || !monthText || !yearText) {
    return { ok: false, error: "required" };
  }

  if (!/^\d{4}$/.test(yearText)) {
    return { ok: false, error: "year_four_digits" };
  }

  if (!/^\d{1,2}$/.test(dayText) || !/^\d{1,2}$/.test(monthText)) {
    return { ok: false, error: "invalid" };
  }

  const value = {
    year: Number(yearText),
    month: Number(monthText),
    day: Number(dayText),
  };

  if (
    (typeof minYear === "number" && value.year < minYear) ||
    (typeof maxYear === "number" && value.year > maxYear)
  ) {
    return { ok: false, error: "year_range" };
  }

  if (!isValidDateParts(value)) {
    return { ok: false, error: "date_invalid" };
  }

  return {
    ok: true,
    value,
  };
}

export function isValidDateParts(date: PlainDateParts): boolean {
  return (
    Number.isInteger(date.year) &&
    Number.isInteger(date.month) &&
    Number.isInteger(date.day) &&
    date.year >= 1 &&
    date.month >= 1 &&
    date.month <= 12 &&
    date.day >= 1 &&
    date.day <= daysInMonth(date.year, date.month)
  );
}

export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function daysInMonth(year: number, month: number): number {
  if (month < 1 || month > 12) {
    return 0;
  }

  return [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ][month - 1];
}

export function comparePlainDates(
  left: PlainDateParts,
  right: PlainDateParts,
): number {
  if (left.year !== right.year) {
    return Math.sign(left.year - right.year);
  }

  if (left.month !== right.month) {
    return Math.sign(left.month - right.month);
  }

  return Math.sign(left.day - right.day);
}

export function todayInLocalTimeZone(): PlainDateParts {
  const now = new Date();

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

export function addCalendarDays(
  date: PlainDateParts,
  days: number,
): PlainDateParts {
  const result = toUtcDate(date);
  result.setUTCDate(result.getUTCDate() + days);

  return fromUtcDate(result);
}

export function addBusinessDays(
  date: PlainDateParts,
  days: number,
): PlainDateParts {
  if (!Number.isInteger(days)) {
    throw new RangeError("La cantidad de días hábiles debe ser entera.");
  }

  if (days === 0) {
    return date;
  }

  const direction = days > 0 ? 1 : -1;
  let remaining = Math.abs(days);
  let current = date;

  while (remaining > 0) {
    current = addCalendarDays(current, direction);

    if (!isWeekend(current)) {
      remaining -= 1;
    }
  }

  return current;
}

export function addCalendarMonths(
  date: PlainDateParts,
  months: number,
): PlainDateParts {
  if (!Number.isInteger(months)) {
    throw new RangeError("La cantidad de meses debe ser entera.");
  }

  const totalMonths = date.year * 12 + (date.month - 1) + months;
  const year = Math.floor(totalMonths / 12);
  const month = positiveModulo(totalMonths, 12) + 1;

  return {
    year,
    month,
    day: Math.min(date.day, daysInMonth(year, month)),
  };
}

export function addCalendarYears(
  date: PlainDateParts,
  years: number,
): PlainDateParts {
  if (!Number.isInteger(years)) {
    throw new RangeError("La cantidad de años debe ser entera.");
  }

  const targetYear = date.year + years;

  return {
    year: targetYear,
    month: date.month,
    day: Math.min(date.day, daysInMonth(targetYear, date.month)),
  };
}

export function diffTotalDays(
  start: PlainDateParts,
  end: PlainDateParts,
  countMode: CountMode = DEFAULT_COUNT_MODE,
): number {
  assertValidDate(start);
  assertValidDate(end);

  const difference = rawDiffTotalDays(start, end);

  if (countMode === "standard") {
    return difference;
  }

  if (difference === 0) {
    return 1;
  }

  return difference > 0 ? difference + 1 : difference - 1;
}

export function diffCalendarParts(
  start: PlainDateParts,
  end: PlainDateParts,
): CalendarDuration {
  assertValidDate(start);
  assertValidDate(end);

  const [earlier, later] =
    comparePlainDates(start, end) <= 0 ? [start, end] : [end, start];

  let years = later.year - earlier.year;
  let yearAnchor = addCalendarYears(earlier, years);

  if (comparePlainDates(yearAnchor, later) > 0) {
    years -= 1;
    yearAnchor = addCalendarYears(earlier, years);
  }

  let months = 0;

  while (
    months < 11 &&
    comparePlainDates(addCalendarMonths(yearAnchor, months + 1), later) <= 0
  ) {
    months += 1;
  }

  const monthAnchor = addCalendarMonths(yearAnchor, months);

  return {
    years,
    months,
    days: rawDiffTotalDays(monthAnchor, later),
  };
}

export function countBusinessDays(
  start: PlainDateParts,
  end: PlainDateParts,
  countMode: CountMode = DEFAULT_COUNT_MODE,
): number {
  return countDaysByPredicate(start, end, countMode, (date) => !isWeekend(date));
}

export function countWeekendDays(
  start: PlainDateParts,
  end: PlainDateParts,
  countMode: CountMode = DEFAULT_COUNT_MODE,
): number {
  return countDaysByPredicate(start, end, countMode, isWeekend);
}

export function calculateDateDifference({
  startDate,
  endDate,
  countMode = DEFAULT_COUNT_MODE,
  locale = DEFAULT_LOCALE,
}: DateDifferenceInput): DateDifferenceResult {
  assertValidDate(startDate);
  assertValidDate(endDate);

  const rawDifference = rawDiffTotalDays(startDate, endDate);
  const sign = rawDifference === 0 ? 0 : rawDifference > 0 ? 1 : -1;
  const totalDays = Math.abs(diffTotalDays(startDate, endDate, countMode));
  const businessDays = Math.abs(
    countBusinessDays(startDate, endDate, countMode),
  );
  const weekendDays = Math.abs(countWeekendDays(startDate, endDate, countMode));
  const [earlier, later] =
    comparePlainDates(startDate, endDate) <= 0
      ? [startDate, endDate]
      : [endDate, startDate];
  const endIsWeekend = isWeekend(endDate);

  return {
    sign,
    totalDays,
    calendar: diffCalendarParts(earlier, later),
    weeks: toWeekDuration(totalDays),
    businessDays,
    weekendDays,
    startWeekday: formatWeekday(startDate, locale),
    endWeekday: formatWeekday(endDate, locale),
    startIsWeekend: isWeekend(startDate),
    endIsWeekend,
    nextBusinessDayAfterEnd: endIsWeekend
      ? getNextBusinessDay(endDate)
      : undefined,
  };
}

export function calculateDateOperation({
  startDate,
  operation,
  amount,
  unit,
  locale = DEFAULT_LOCALE,
  minYear = MIN_YEAR,
  maxYear = MAX_YEAR,
}: DateOperationInput): AddDateResult {
  assertValidDate(startDate);

  if (!Number.isInteger(amount) || amount <= 0 || amount > MAX_AMOUNT) {
    throw new RangeError("La cantidad debe ser un entero positivo permitido.");
  }

  const signedAmount = operation === "add" ? amount : -amount;
  let date: PlainDateParts;

  if (unit === "businessDays") {
    date = addBusinessDays(startDate, signedAmount);
  } else if (unit === "weeks") {
    date = addCalendarDays(startDate, signedAmount * 7);
  } else if (unit === "months") {
    date = addCalendarMonths(startDate, signedAmount);
  } else if (unit === "years") {
    date = addCalendarYears(startDate, signedAmount);
  } else {
    date = addCalendarDays(startDate, signedAmount);
  }

  if (date.year < minYear || date.year > maxYear) {
    throw new RangeError("La fecha calculada queda fuera del rango soportado.");
  }

  const isResultWeekend = isWeekend(date);

  return {
    date,
    weekday: formatWeekday(date, locale),
    dayOfYear: getDayOfYear(date),
    isoWeek: getIsoWeek(date),
    quarter: getQuarter(date),
    isWeekend: isResultWeekend,
    nextBusinessDay: isResultWeekend ? getNextBusinessDay(date) : undefined,
  };
}

export function isWeekend(date: PlainDateParts): boolean {
  const day = toUtcDate(date).getUTCDay();

  return day === 0 || day === 6;
}

export function getNextBusinessDay(date: PlainDateParts): PlainDateParts {
  let current = date;

  do {
    current = addCalendarDays(current, 1);
  } while (isWeekend(current));

  return current;
}

export function getDayOfYear(date: PlainDateParts): number {
  return rawDiffTotalDays({ year: date.year, month: 1, day: 1 }, date) + 1;
}

export function getIsoWeek(date: PlainDateParts): number {
  const utcDate = toUtcDate(date);
  const dayOfWeek = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayOfWeek);

  const yearStart = Date.UTC(utcDate.getUTCFullYear(), 0, 1);

  return Math.ceil(((utcDate.getTime() - yearStart) / millisecondsPerDay + 1) / 7);
}

export function getQuarter(date: PlainDateParts): 1 | 2 | 3 | 4 {
  return Math.ceil(date.month / 3) as 1 | 2 | 3 | 4;
}

export function formatPlainDate(
  date: PlainDateParts,
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(toUtcDate(date));
}

export function formatFullPlainDate(
  date: PlainDateParts,
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(toUtcDate(date));
}

export function formatWeekday(
  date: PlainDateParts,
  locale = DEFAULT_LOCALE,
): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    timeZone: "UTC",
  }).format(toUtcDate(date));
}

export function formatNumber(value: number, locale = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactDuration(duration: CalendarDuration): string {
  const parts = [
    duration.years > 0 ? formatUnit(duration.years, "año", "años") : null,
    duration.months > 0 ? formatUnit(duration.months, "mes", "meses") : null,
    duration.days > 0 ? formatUnit(duration.days, "día", "días") : null,
  ].filter((part): part is string => Boolean(part));

  return joinUnitParts(parts);
}

export function formatWeekDuration(duration: WeekDuration): string {
  const parts = [
    duration.weeks > 0
      ? formatUnit(duration.weeks, "semana", "semanas")
      : null,
    duration.days > 0 ? formatUnit(duration.days, "día", "días") : null,
  ].filter((part): part is string => Boolean(part));

  return joinUnitParts(parts);
}

export function buildDateDifferenceCopyText({
  startDate,
  endDate,
  countMode = DEFAULT_COUNT_MODE,
  result,
  locale = DEFAULT_LOCALE,
}: DateDifferenceCopyInput): string {
  const countLabel = countMode === "inclusive" ? "inclusivo" : "estándar";

  return [
    "Calculadora de diferencia entre fechas - calculadoras.tools",
    `Desde: ${formatFullPlainDate(startDate, locale)}`,
    `Hasta: ${formatFullPlainDate(endDate, locale)}`,
    `Conteo: ${countMode === "inclusive" ? "inclusivo" : "estándar"}`,
    `Dirección: ${
      result.sign > 0
        ? "la fecha final es posterior a la fecha inicial"
        : result.sign < 0
          ? "la fecha final es anterior a la fecha inicial"
          : "las fechas son iguales"
    }`,
    `Días naturales (${countLabel}): ${formatUnit(result.totalDays, "día", "días")}`,
    `Desglose de calendario (conteo estándar): ${formatCompactDuration(result.calendar)}`,
    `Semanas y días naturales (${countLabel}): ${formatWeekDuration(result.weeks)}`,
    `Días hábiles sin festivos (${countLabel}): ${formatNumber(result.businessDays, locale)}`,
    `Fines de semana (${countLabel}): ${formatNumber(result.weekendDays, locale)}`,
  ].join("\n");
}

function countDaysByPredicate(
  start: PlainDateParts,
  end: PlainDateParts,
  countMode: CountMode,
  predicate: (date: PlainDateParts) => boolean,
): number {
  assertValidDate(start);
  assertValidDate(end);

  const comparison = comparePlainDates(start, end);

  if (comparison === 0) {
    return countMode === "inclusive" && predicate(start) ? 1 : 0;
  }

  const direction = comparison < 0 ? 1 : -1;
  const earlier = direction === 1 ? start : end;
  const later = direction === 1 ? end : start;
  let current = countMode === "inclusive" ? earlier : addCalendarDays(earlier, 1);
  let count = 0;

  while (comparePlainDates(current, later) <= 0) {
    if (predicate(current)) {
      count += 1;
    }

    current = addCalendarDays(current, 1);
  }

  return direction * count;
}

function toWeekDuration(totalDays: number): WeekDuration {
  return {
    weeks: Math.floor(totalDays / 7),
    days: totalDays % 7,
  };
}

function assertValidDate(date: PlainDateParts) {
  if (!isValidDateParts(date)) {
    throw new RangeError("La fecha debe ser válida.");
  }
}

function rawDiffTotalDays(start: PlainDateParts, end: PlainDateParts): number {
  return Math.round((toUtcTime(end) - toUtcTime(start)) / millisecondsPerDay);
}

function formatUnit(value: number, singular: string, plural: string): string {
  return `${formatNumber(value)} ${value === 1 ? singular : plural}`;
}

function joinUnitParts(parts: string[]): string {
  if (parts.length === 0) {
    return "0 días";
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return `${parts.slice(0, -1).join(", ")} y ${parts[parts.length - 1]}`;
}

function toUtcDate(date: PlainDateParts): Date {
  return new Date(toUtcTime(date));
}

function toUtcTime(date: PlainDateParts): number {
  return Date.UTC(date.year, date.month - 1, date.day);
}

function fromUtcDate(date: Date): PlainDateParts {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

function positiveModulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}
