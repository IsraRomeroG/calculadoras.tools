import * as base from "./meetingCost";
import type {
  MeetingCostInput,
  MeetingCostResult,
  MeetingFrequency,
} from "./meetingCost";

export type {
  MeetingCostErrorCode,
  MeetingCostInput,
  MeetingCostResult,
  MeetingFrequency,
  MeetingInsight,
  MeetingInsightCode,
  MeetingRecurrenceResult,
  MeetingRoleInput,
  MeetingRoleResult,
  ParseMeetingNumberResult,
} from "./meetingCost";

export const MeetingCostValidationError = base.MeetingCostValidationError;
export const DEFAULT_LOCALE = "en-US";
export const DEFAULT_CURRENCY = base.DEFAULT_CURRENCY;
export const MAX_ROLES = base.MAX_ROLES;
export const MAX_ROLE_NAME_LENGTH = base.MAX_ROLE_NAME_LENGTH;
export const parseMeetingNumber = base.parseMeetingNumber;

export function calculateMeetingCost(input: MeetingCostInput): MeetingCostResult {
  try {
    const result = base.calculateMeetingCost({
      ...input,
      roles: input.roles.map((role, index) => ({
        ...role,
        name: role.name.trim() || `Role ${index + 1}`,
      })),
    });
    const occurrences = input.frequency === "weekly"
      ? input.occurrencesPerWeek ?? 1
      : input.frequency === "monthly"
        ? input.occurrencesPerMonth ?? 1
        : 1;

    return {
      ...result,
      recurrence: {
        ...result.recurrence,
        occurrencesLabel:
          input.frequency === "weekly"
            ? `${occurrences} ${occurrences === 1 ? "time" : "times"} per week`
            : input.frequency === "monthly"
              ? `${occurrences} ${occurrences === 1 ? "time" : "times"} per month`
              : input.frequency === "biweekly"
                ? "Every two weeks"
                : "Once",
      },
      insights: result.insights.map((insight) => ({
        ...insight,
        label:
          insight.code === "reduce_15_min"
            ? `Reduce by ${insight.minutes} min`
            : insight.code === "remove_person"
              ? `Remove one person from ${insight.roleName}`
              : insight.code === "reduce_repetition"
                ? "Remove one occurrence"
                : "The monetary cost is 0; review the person-hours invested",
      })),
    };
  } catch (error) {
    if (error instanceof base.MeetingCostValidationError) {
      throw new base.MeetingCostValidationError(
        error.code,
        meetingErrorMessage(error, input),
        error.roleIndex,
      );
    }
    throw error;
  }
}

export function formatMeetingCurrency(
  value: number,
  locale = DEFAULT_LOCALE,
  currency = DEFAULT_CURRENCY,
) {
  return base.formatMeetingCurrency(value, locale, currency);
}

export function formatMeetingNumber(value: number, digits = 2, locale = DEFAULT_LOCALE) {
  return base.formatMeetingNumber(value, digits, locale);
}

export const formatMeetingDuration = base.formatMeetingDuration;

export function getFrequencyLabel(frequency: MeetingFrequency) {
  return {
    once: "Once",
    weekly: "Weekly",
    biweekly: "Every two weeks",
    monthly: "Monthly",
  }[frequency];
}

export function buildMeetingSummary(result: MeetingCostResult) {
  const lines = [
    `${result.totalDurationMinutes}-minute meeting with ${result.totalPeople} people:`,
    `- Estimated cost: ${formatMeetingCurrency(result.totalCost)}`,
    `- Person-hours: ${formatMeetingNumber(result.personHours)} h`,
    `- Cost per minute: ${formatMeetingCurrency(result.costPerMinute)}`,
    `- Frequency: ${result.recurrence.occurrencesLabel}`,
  ];
  if (result.recurrence.annualCost !== undefined) {
    lines.push(`- Estimated annual impact: ${formatMeetingCurrency(result.recurrence.annualCost)}`);
  }
  const savings = result.insights.filter((item) => (item.amount ?? 0) > 0);
  if (savings.length) {
    lines.push("", "Potential savings:");
    savings.forEach((item) => lines.push(`- ${item.label}: ${formatMeetingCurrency(item.amount ?? 0)}`));
  }
  lines.push("", "Calculated at calculadoras.tools");
  return lines.join("\n");
}

export function buildMeetingCsv(result: MeetingCostResult) {
  const rows = [
    ["Type", "Item", "People", "Hourly cost", "Person-hours", "Cost"],
    ["Summary", "Total", String(result.totalPeople), "", formatMeetingNumber(result.personHours), formatMeetingNumber(result.totalCost)],
    ...result.roles.map((role) => ["Role", role.name, String(role.people), formatMeetingNumber(role.hourlyRate), formatMeetingNumber(role.personHours), formatMeetingNumber(role.cost)]),
  ];
  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

function meetingErrorMessage(error: InstanceType<typeof base.MeetingCostValidationError>, input: MeetingCostInput) {
  const role = error.roleIndex === undefined ? undefined : input.roles[error.roleIndex];
  const name = role?.name.trim() || `role ${(error.roleIndex ?? 0) + 1}`;
  const messages = {
    invalid_duration: "Duration must be between 1 and 480 minutes.",
    invalid_preparation: "Preparation must be between 0 and 480 minutes.",
    invalid_follow_up: "Follow-up must be between 0 and 480 minutes.",
    no_roles: "Add at least one role or participant.",
    too_many_roles: `A meeting can include up to ${MAX_ROLES} roles.`,
    invalid_role_name: `The name of role ${(error.roleIndex ?? 0) + 1} must be between 1 and ${MAX_ROLE_NAME_LENGTH} characters.`,
    invalid_people: `The number of people for ${name} must be between 1 and 100.`,
    invalid_hourly_rate: `The hourly cost for ${name} must be zero or greater.`,
    invalid_frequency: "Select a valid frequency.",
    invalid_occurrences: "Enter a valid number of occurrences.",
  };
  return messages[error.code];
}

function csvCell(value: string) {
  const escaped = value.replaceAll('"', '""');
  return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}
