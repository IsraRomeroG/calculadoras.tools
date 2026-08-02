import * as base from "./workHours";
import type { WorkHoursInput, WorkHoursResult } from "./workHours";

export type {
  ParseWorkNumberResult,
  WorkHoursErrorCode,
  WorkHoursInput,
  WorkHoursPayment,
  WorkHoursResult,
  WorkHoursWarning,
  WorkHoursWarningCode,
  WorkShiftInput,
  WorkShiftResult,
} from "./workHours";

export const WorkHoursValidationError = base.WorkHoursValidationError;
export const MAX_SHIFTS = base.MAX_SHIFTS;
export const MAX_LABEL_LENGTH = base.MAX_LABEL_LENGTH;
export const MINUTES_PER_DAY = base.MINUTES_PER_DAY;
export const DEFAULT_LOCALE = "en-US";
export const DEFAULT_CURRENCY = base.DEFAULT_CURRENCY;
export const parseTimeToMinutes = base.parseTimeToMinutes;
export const parseWorkNumber = base.parseWorkNumber;
export const formatDuration = base.formatDuration;

export function calculateWorkHours(input: WorkHoursInput): WorkHoursResult {
  const translatedInput = {
    ...input,
    shifts: input.shifts.map((shift, index) => ({
      ...shift,
      label: shift.label.trim() || `Shift ${index + 1}`,
    })),
  };
  try {
    return base.calculateWorkHours(translatedInput);
  } catch (error) {
    if (error instanceof base.WorkHoursValidationError) {
      throw new base.WorkHoursValidationError(
        error.code,
        workErrorMessage(error, translatedInput),
        error.shiftIndexes,
      );
    }
    throw error;
  }
}

export function formatDecimalHours(hours: number, locale = DEFAULT_LOCALE) {
  return base.formatDecimalHours(hours, locale);
}

export function formatWorkCurrency(value: number, locale = DEFAULT_LOCALE, currency = DEFAULT_CURRENCY) {
  return base.formatWorkCurrency(value, locale, currency);
}

export function buildWorkHoursSummary(result: WorkHoursResult) {
  const shiftLines = result.shifts.map((shift) =>
    `${shift.label}: ${shift.start}–${shift.end}${shift.crossesMidnight ? " next day" : ""} · break ${shift.breakMinutes} min · net ${formatDuration(shift.netMinutes)}`
  );
  const lines = [
    "Workday summary", "", ...shiftLines, "",
    `Gross time: ${formatDuration(result.grossMinutes)}`,
    `Breaks: ${formatDuration(result.breakMinutes)}`,
    `Total worked: ${formatDuration(result.netMinutes)} (${formatDecimalHours(result.decimalHours)} h)`,
    `Regular hours: ${formatDuration(result.regularMinutes)}`,
    `Estimated overtime: ${formatDuration(result.overtimeMinutes)}`,
  ];
  if (result.payment) lines.push(`Estimated total pay: ${formatWorkCurrency(result.payment.totalPay)}`);
  lines.push("", "Estimate based on the entered settings.", "Calculated at calculadoras.tools");
  return lines.join("\n");
}

function workErrorMessage(error: InstanceType<typeof base.WorkHoursValidationError>, input: WorkHoursInput) {
  const labels = error.shiftIndexes.map((index) => input.shifts[index]?.label).filter(Boolean);
  const subject = labels.join(" and ") || "the shift";
  const messages = {
    no_shifts: "Add at least one complete shift.",
    too_many_shifts: `A workday can include up to ${MAX_SHIFTS} shifts.`,
    label_too_long: `A shift name can have up to ${MAX_LABEL_LENGTH} characters.`,
    invalid_time: `Enter valid times for ${subject}.`,
    equal_times: `The start and end times for ${subject} cannot be the same.`,
    invalid_break: `The break for ${subject} must be a whole number of minutes.`,
    break_too_long: `The break for ${subject} must be shorter than the shift.`,
    overlap: `${subject} overlap. Adjust the times to avoid counting time twice.`,
    invalid_regular_limit: "The regular-hours limit must be between 0 and 24.",
    invalid_overtime_multiplier: "The overtime multiplier must be between 1 and 5.",
    invalid_hourly_rate: "The hourly rate must be zero or greater.",
  };
  return messages[error.code];
}
