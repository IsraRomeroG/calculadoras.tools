import * as base from "./date-difference";
import type {
  CalendarDuration,
  DateDifferenceCopyInput,
  PlainDateParts,
  WeekDuration,
} from "./date-difference";

export type {
  AddDateResult,
  CalendarDuration,
  CountMode,
  DateDifferenceCopyInput,
  DateDifferenceInput,
  DateDifferenceResult,
  DateOperation,
  DateOperationInput,
  DateUnit,
  DayCountType,
  ParseDatePartsInput,
  ParseDatePartsResult,
  PlainDateParts,
  WeekDuration,
} from "./date-difference";

export const DEFAULT_LOCALE = "en-US";
export const MIN_YEAR = base.MIN_YEAR;
export const MAX_YEAR = base.MAX_YEAR;
export const MAX_AMOUNT = base.MAX_AMOUNT;
export const DEFAULT_COUNT_MODE = base.DEFAULT_COUNT_MODE;
export const DEFAULT_DAY_COUNT_TYPE = base.DEFAULT_DAY_COUNT_TYPE;
export const parseDateParts = base.parseDateParts;
export const isValidDateParts = base.isValidDateParts;
export const isLeapYear = base.isLeapYear;
export const daysInMonth = base.daysInMonth;
export const comparePlainDates = base.comparePlainDates;
export const todayInLocalTimeZone = base.todayInLocalTimeZone;
export const addCalendarDays = base.addCalendarDays;
export const addBusinessDays = base.addBusinessDays;
export const addCalendarMonths = base.addCalendarMonths;
export const addCalendarYears = base.addCalendarYears;
export const diffTotalDays = base.diffTotalDays;
export const diffCalendarParts = base.diffCalendarParts;
export const countBusinessDays = base.countBusinessDays;
export const countWeekendDays = base.countWeekendDays;
export const isWeekend = base.isWeekend;
export const getNextBusinessDay = base.getNextBusinessDay;
export const getDayOfYear = base.getDayOfYear;
export const getIsoWeek = base.getIsoWeek;
export const getQuarter = base.getQuarter;

export function calculateDateDifference(
  input: Parameters<typeof base.calculateDateDifference>[0],
) {
  return base.calculateDateDifference({ ...input, locale: DEFAULT_LOCALE });
}

export function calculateDateOperation(
  input: Parameters<typeof base.calculateDateOperation>[0],
) {
  return base.calculateDateOperation({ ...input, locale: DEFAULT_LOCALE });
}

export function formatPlainDate(date: PlainDateParts, locale = DEFAULT_LOCALE) {
  return base.formatPlainDate(date, locale);
}
export function formatFullPlainDate(date: PlainDateParts, locale = DEFAULT_LOCALE) {
  return base.formatFullPlainDate(date, locale);
}
export function formatWeekday(date: PlainDateParts, locale = DEFAULT_LOCALE) {
  return base.formatWeekday(date, locale);
}
export function formatNumber(value: number, locale = DEFAULT_LOCALE) {
  return base.formatNumber(value, locale);
}

export function formatCompactDuration(duration: CalendarDuration) {
  return join([
    duration.years > 0 ? unit(duration.years, "year", "years") : null,
    duration.months > 0 ? unit(duration.months, "month", "months") : null,
    duration.days > 0 ? unit(duration.days, "day", "days") : null,
  ]);
}

export function formatWeekDuration(duration: WeekDuration) {
  return join([
    duration.weeks > 0 ? unit(duration.weeks, "week", "weeks") : null,
    duration.days > 0 ? unit(duration.days, "day", "days") : null,
  ]);
}

export function buildDateDifferenceCopyText({
  startDate,
  endDate,
  countMode = DEFAULT_COUNT_MODE,
  result,
}: DateDifferenceCopyInput) {
  const countLabel = countMode === "inclusive" ? "inclusive" : "standard";

  return [
    "Date difference calculator — calculadoras.tools",
    `From: ${formatFullPlainDate(startDate)}`,
    `To: ${formatFullPlainDate(endDate)}`,
    `Counting: ${countLabel}`,
    `Calendar days (${countLabel}): ${unit(result.totalDays, "day", "days")}`,
    `Calendar breakdown (standard count): ${formatCompactDuration(result.calendar)}`,
    `Weeks and calendar days (${countLabel}): ${formatWeekDuration(result.weeks)}`,
    `Weekdays (holidays not excluded; ${countLabel}): ${formatNumber(result.businessDays)}`,
    `Weekend days (${countLabel}): ${formatNumber(result.weekendDays)}`,
  ].join("\n");
}

function unit(value: number, singular: string, plural: string) {
  return `${formatNumber(value)} ${Math.abs(value) === 1 ? singular : plural}`;
}
function join(values: Array<string | null>) {
  const parts = values.filter((value): value is string => Boolean(value));
  if (!parts.length) return "0 days";
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(", ")}, and ${parts.at(-1)}`;
}
