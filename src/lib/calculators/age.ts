export type LeapDayRule = "feb-28" | "mar-01";

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

export interface AgeDifference extends CalendarDuration {
  totalDays: number;
}

export interface AlternativeAgeUnits {
  completeYears: number;
  completeMonths: number;
  completeWeeks: number;
  days: number;
  approximateHours: number;
  approximateMinutes: number;
  approximateSeconds: number;
}

export interface NextAnniversaryResult {
  date: PlainDateParts;
  daysUntil: number;
  calendarUntil: CalendarDuration;
  weekday: string;
  turningYears?: number;
}

export interface AgeCalculationResult {
  age: AgeDifference;
  alternativeUnits: AlternativeAgeUnits;
  nextAnniversary: NextAnniversaryResult;
  warnings: string[];
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

export const DEFAULT_LOCALE = "es-MX";
export const MIN_PERSON_YEAR = 1900;
export const MIN_EVENT_YEAR = 1800;
export const MAX_PERSON_AGE = 150;
export const UNUSUAL_PERSON_AGE = 120;
export const DEFAULT_LEAP_DAY_RULE: LeapDayRule = "feb-28";

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

export function addYears(
  date: PlainDateParts,
  years: number,
  leapDayRule: LeapDayRule = DEFAULT_LEAP_DAY_RULE,
): PlainDateParts {
  const targetYear = date.year + years;

  if (date.month === 2 && date.day === 29 && !isLeapYear(targetYear)) {
    if (leapDayRule === "mar-01") {
      return { year: targetYear, month: 3, day: 1 };
    }

    return { year: targetYear, month: 2, day: 28 };
  }

  return {
    year: targetYear,
    month: date.month,
    day: Math.min(date.day, daysInMonth(targetYear, date.month)),
  };
}

export function addMonths(date: PlainDateParts, months: number): PlainDateParts {
  const totalMonths = date.year * 12 + (date.month - 1) + months;
  const year = Math.floor(totalMonths / 12);
  const month = (totalMonths % 12) + 1;

  return {
    year,
    month,
    day: Math.min(date.day, daysInMonth(year, month)),
  };
}

export function diffTotalDays(
  start: PlainDateParts,
  end: PlainDateParts,
): number {
  assertValidDateRange(start, end);

  return Math.round((toUtcTime(end) - toUtcTime(start)) / millisecondsPerDay);
}

export function diffCalendarDates(
  start: PlainDateParts,
  end: PlainDateParts,
  leapDayRule: LeapDayRule = DEFAULT_LEAP_DAY_RULE,
): CalendarDuration {
  assertValidDateRange(start, end);

  let years = end.year - start.year;
  let yearAnchor = addYears(start, years, leapDayRule);

  if (comparePlainDates(yearAnchor, end) > 0) {
    years -= 1;
    yearAnchor = addYears(start, years, leapDayRule);
  }

  let months = 0;

  while (
    months < 11 &&
    comparePlainDates(addMonths(yearAnchor, months + 1), end) <= 0
  ) {
    months += 1;
  }

  const monthAnchor = addMonths(yearAnchor, months);
  const days = diffTotalDays(monthAnchor, end);

  return {
    years,
    months,
    days,
  };
}

export function calculateAge({
  birthDate,
  referenceDate,
  leapDayRule = DEFAULT_LEAP_DAY_RULE,
}: {
  birthDate: PlainDateParts;
  referenceDate: PlainDateParts;
  leapDayRule?: LeapDayRule;
}): AgeDifference {
  const duration = diffCalendarDates(birthDate, referenceDate, leapDayRule);
  const totalDays = diffTotalDays(birthDate, referenceDate);

  return {
    ...duration,
    totalDays,
  };
}

export function calculateAlternativeUnits(
  totalDays: number,
  duration: CalendarDuration,
): AlternativeAgeUnits {
  const completeMonths = duration.years * 12 + duration.months;
  const approximateHours = totalDays * 24;
  const approximateMinutes = approximateHours * 60;
  const approximateSeconds = approximateMinutes * 60;

  return {
    completeYears: duration.years,
    completeMonths,
    completeWeeks: Math.floor(totalDays / 7),
    days: totalDays,
    approximateHours,
    approximateMinutes,
    approximateSeconds,
  };
}

export function calculateNextAnniversary({
  date,
  referenceDate,
  leapDayRule = DEFAULT_LEAP_DAY_RULE,
  locale = DEFAULT_LOCALE,
}: {
  date: PlainDateParts;
  referenceDate: PlainDateParts;
  leapDayRule?: LeapDayRule;
  locale?: string;
}): NextAnniversaryResult {
  assertValidDateRange(date, referenceDate);

  let yearsOffset = referenceDate.year - date.year;
  let nextDate = addYears(date, yearsOffset, leapDayRule);

  if (comparePlainDates(nextDate, referenceDate) < 0) {
    yearsOffset += 1;
    nextDate = addYears(date, yearsOffset, leapDayRule);
  }

  const daysUntil = diffTotalDays(referenceDate, nextDate);
  const calendarUntil = diffCalendarDates(referenceDate, nextDate, leapDayRule);
  const ageAtAnniversary = calculateAge({
    birthDate: date,
    referenceDate: nextDate,
    leapDayRule,
  });

  return {
    date: nextDate,
    daysUntil,
    calendarUntil,
    weekday: formatWeekday(nextDate, locale),
    turningYears: ageAtAnniversary.years,
  };
}

export function calculateAgeResult({
  birthDate,
  referenceDate,
  today = todayInLocalTimeZone(),
  leapDayRule = DEFAULT_LEAP_DAY_RULE,
  locale = DEFAULT_LOCALE,
}: {
  birthDate: PlainDateParts;
  referenceDate: PlainDateParts;
  today?: PlainDateParts;
  leapDayRule?: LeapDayRule;
  locale?: string;
}): AgeCalculationResult {
  if (comparePlainDates(birthDate, referenceDate) > 0) {
    throw new RangeError("La fecha de referencia es anterior al nacimiento.");
  }

  const age = calculateAge({ birthDate, referenceDate, leapDayRule });

  return {
    age,
    alternativeUnits: calculateAlternativeUnits(age.totalDays, age),
    nextAnniversary: calculateNextAnniversary({
      date: birthDate,
      referenceDate,
      leapDayRule,
      locale,
    }),
    warnings: buildAgeWarnings({ age, birthDate, today }),
  };
}

export function calculateTargetAgeDate({
  birthDate,
  targetAge,
  leapDayRule = DEFAULT_LEAP_DAY_RULE,
}: {
  birthDate: PlainDateParts;
  targetAge: number;
  leapDayRule?: LeapDayRule;
}): PlainDateParts {
  if (!Number.isInteger(targetAge) || targetAge < 0) {
    throw new RangeError("La edad objetivo debe ser un entero positivo.");
  }

  return addYears(birthDate, targetAge, leapDayRule);
}

export function calculateAgeDifferenceBetweenPeople(
  dateA: PlainDateParts,
  dateB: PlainDateParts,
  leapDayRule: LeapDayRule = DEFAULT_LEAP_DAY_RULE,
): {
  older: "a" | "b" | "same";
  difference: AgeDifference;
} {
  const comparison = comparePlainDates(dateA, dateB);

  if (comparison === 0) {
    return {
      older: "same",
      difference: {
        years: 0,
        months: 0,
        days: 0,
        totalDays: 0,
      },
    };
  }

  const start = comparison < 0 ? dateA : dateB;
  const end = comparison < 0 ? dateB : dateA;

  return {
    older: comparison < 0 ? "a" : "b",
    difference: calculateAge({
      birthDate: start,
      referenceDate: end,
      leapDayRule,
    }),
  };
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

export function formatAgeDifference(duration: CalendarDuration): string {
  return `${formatUnit(duration.years, "año", "años")}, ${formatUnit(
    duration.months,
    "mes",
    "meses",
  )} y ${formatUnit(duration.days, "día", "días")}`;
}

export function formatCompactDuration(duration: CalendarDuration): string {
  const parts = [
    duration.years > 0 ? formatUnit(duration.years, "año", "años") : null,
    duration.months > 0 ? formatUnit(duration.months, "mes", "meses") : null,
    duration.days > 0 ? formatUnit(duration.days, "día", "días") : null,
  ].filter((part): part is string => Boolean(part));

  if (parts.length === 0) {
    return "0 días";
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return `${parts.slice(0, -1).join(", ")} y ${parts[parts.length - 1]}`;
}

export function buildAgeCopyText({
  birthDate,
  referenceDate,
  result,
  locale = DEFAULT_LOCALE,
}: {
  birthDate: PlainDateParts;
  referenceDate: PlainDateParts;
  result: AgeCalculationResult;
  locale?: string;
}): string {
  return [
    "Calculadora de Edad - calculadoras.tools",
    `Fecha de nacimiento: ${formatPlainDate(birthDate, locale)}`,
    `Fecha de referencia: ${formatPlainDate(referenceDate, locale)}`,
    `Edad: ${formatAgeDifference(result.age)}`,
    `Días vividos: ${formatNumber(result.age.totalDays, locale)}`,
    `Próximo cumpleaños: ${formatPlainDate(result.nextAnniversary.date, locale)}`,
  ].join("\n");
}

function buildAgeWarnings({
  age,
  birthDate,
  today,
}: {
  age: AgeDifference;
  birthDate: PlainDateParts;
  today: PlainDateParts;
}): string[] {
  const warnings: string[] = [];

  if (age.years > UNUSUAL_PERSON_AGE) {
    warnings.push(
      "Revisa la fecha ingresada. Las edades superiores a 120 años son poco comunes.",
    );
  }

  if (birthDate.month === 2 && birthDate.day === 29) {
    warnings.push(
      "Para nacidos el 29 de febrero usamos una regla configurable en años no bisiestos.",
    );
  }

  if (comparePlainDates(birthDate, today) > 0) {
    warnings.push("La fecha de nacimiento está en el futuro.");
  }

  return warnings;
}

function assertValidDateRange(start: PlainDateParts, end: PlainDateParts) {
  if (!isValidDateParts(start) || !isValidDateParts(end)) {
    throw new RangeError("Las fechas deben ser válidas.");
  }

  if (comparePlainDates(start, end) > 0) {
    throw new RangeError("La fecha final debe ser igual o posterior.");
  }
}

function formatUnit(value: number, singular: string, plural: string): string {
  return `${formatNumber(value)} ${value === 1 ? singular : plural}`;
}

function toUtcDate(date: PlainDateParts): Date {
  return new Date(toUtcTime(date));
}

function toUtcTime(date: PlainDateParts): number {
  return Date.UTC(date.year, date.month - 1, date.day);
}
