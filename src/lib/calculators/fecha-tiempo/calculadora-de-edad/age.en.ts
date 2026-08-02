import * as base from "./age";
import type {
  AgeCalculationResult,
  CalendarDuration,
  PlainDateParts,
} from "./age";

export type {
  AgeCalculationResult,
  AgeDifference,
  AlternativeAgeUnits,
  CalendarDuration,
  LeapDayRule,
  NextAnniversaryResult,
  ParseDatePartsInput,
  ParseDatePartsResult,
  PlainDateParts,
} from "./age";

export const DEFAULT_LOCALE = "en-US";
export const MIN_PERSON_YEAR = base.MIN_PERSON_YEAR;
export const MIN_EVENT_YEAR = base.MIN_EVENT_YEAR;
export const MAX_PERSON_AGE = base.MAX_PERSON_AGE;
export const UNUSUAL_PERSON_AGE = base.UNUSUAL_PERSON_AGE;
export const DEFAULT_LEAP_DAY_RULE = base.DEFAULT_LEAP_DAY_RULE;
export const parseDateParts = base.parseDateParts;
export const comparePlainDates = base.comparePlainDates;
export const todayInLocalTimeZone = base.todayInLocalTimeZone;

export function calculateAgeResult(
  input: Parameters<typeof base.calculateAgeResult>[0],
): AgeCalculationResult {
  try {
    const result = base.calculateAgeResult({ ...input, locale: DEFAULT_LOCALE });
    return {
      ...result,
      warnings: result.warnings.map(translateAgeWarning),
      nextAnniversary: {
        ...result.nextAnniversary,
        weekday: base.formatWeekday(result.nextAnniversary.date, DEFAULT_LOCALE),
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new RangeError(translateAgeError(error.message));
    }
    throw error;
  }
}

export function formatPlainDate(date: PlainDateParts, locale = DEFAULT_LOCALE) {
  return base.formatPlainDate(date, locale);
}

export function formatNumber(value: number, locale = DEFAULT_LOCALE) {
  return base.formatNumber(value, locale);
}

export function formatAgeDifference(duration: CalendarDuration) {
  return `${unit(duration.years, "year", "years")}, ${unit(duration.months, "month", "months")}, and ${unit(duration.days, "day", "days")}`;
}

export function formatCompactDuration(duration: CalendarDuration) {
  const parts = [
    duration.years > 0 ? unit(duration.years, "year", "years") : null,
    duration.months > 0 ? unit(duration.months, "month", "months") : null,
    duration.days > 0 ? unit(duration.days, "day", "days") : null,
  ].filter((value): value is string => Boolean(value));
  if (!parts.length) return "0 days";
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(", ")}, and ${parts.at(-1)}`;
}

export function buildAgeCopyText({
  birthDate,
  referenceDate,
  result,
}: {
  birthDate: PlainDateParts;
  referenceDate: PlainDateParts;
  result: AgeCalculationResult;
}) {
  return [
    "Age calculator — calculadoras.tools",
    `Date of birth: ${formatPlainDate(birthDate)}`,
    `Reference date: ${formatPlainDate(referenceDate)}`,
    `Age: ${formatAgeDifference(result.age)}`,
    `Days lived: ${formatNumber(result.age.totalDays)}`,
    `Next birthday: ${formatPlainDate(result.nextAnniversary.date)}`,
  ].join("\n");
}

function unit(value: number, singular: string, plural: string) {
  return `${formatNumber(value)} ${value === 1 ? singular : plural}`;
}

function translateAgeWarning(message: string) {
  if (message.includes("120 años")) return "Check the entered date. Ages over 120 are uncommon.";
  if (message.includes("29 de febrero")) return "For February 29 births, a configurable rule is used in non-leap years.";
  return "The date of birth is in the future.";
}

function translateAgeError(message: string) {
  return {
    "La fecha de referencia es anterior al nacimiento.": "The reference date is before the date of birth.",
    "Las fechas deben ser válidas.": "Dates must be valid.",
    "La fecha final debe ser igual o posterior.": "The end date must be the same or later.",
  }[message] ?? message;
}
