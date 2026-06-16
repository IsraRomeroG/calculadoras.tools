export type MeetingFrequency = "once" | "weekly" | "biweekly" | "monthly";

export interface MeetingRoleInput {
  name: string;
  people: number;
  hourlyRate: number;
}

export interface MeetingCostInput {
  durationMinutes: number;
  preparationMinutes?: number;
  followUpMinutes?: number;
  roles: MeetingRoleInput[];
  frequency: MeetingFrequency;
  occurrencesPerWeek?: number;
  occurrencesPerMonth?: number;
}

export interface MeetingRoleResult extends MeetingRoleInput {
  cost: number;
  personHours: number;
  costPerPerson: number;
}

export interface MeetingRecurrenceResult {
  frequency: MeetingFrequency;
  occurrencesLabel: string;
  weeklyCost?: number;
  monthlyCost?: number;
  annualCost?: number;
}

export type MeetingInsightCode =
  | "reduce_15_min"
  | "remove_person"
  | "reduce_repetition"
  | "zero_money_cost";

export interface MeetingInsight {
  code: MeetingInsightCode;
  label: string;
  amount?: number;
  roleName?: string;
  minutes?: number;
}

export interface MeetingCostResult {
  durationMinutes: number;
  preparationMinutes: number;
  followUpMinutes: number;
  totalDurationMinutes: number;
  totalDurationHours: number;
  totalPeople: number;
  totalCost: number;
  costPerMinute: number;
  personHours: number;
  roles: MeetingRoleResult[];
  recurrence: MeetingRecurrenceResult;
  insights: MeetingInsight[];
  isZeroCost: boolean;
}

export type MeetingCostErrorCode =
  | "invalid_duration"
  | "invalid_preparation"
  | "invalid_follow_up"
  | "no_roles"
  | "too_many_roles"
  | "invalid_role_name"
  | "invalid_people"
  | "invalid_hourly_rate"
  | "invalid_frequency"
  | "invalid_occurrences";

export type ParseMeetingNumberResult =
  | { ok: true; value: number; normalized: string }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

export class MeetingCostValidationError extends RangeError {
  code: MeetingCostErrorCode;
  roleIndex?: number;

  constructor(
    code: MeetingCostErrorCode,
    message: string,
    roleIndex?: number,
  ) {
    super(message);
    this.name = "MeetingCostValidationError";
    this.code = code;
    this.roleIndex = roleIndex;
  }
}

export const DEFAULT_LOCALE = "es-MX";
export const DEFAULT_CURRENCY = "MXN";
export const MAX_ROLES = 20;
export const MAX_ROLE_NAME_LENGTH = 50;

export function calculateMeetingCost(
  input: MeetingCostInput,
): MeetingCostResult {
  validateInput(input);

  const preparationMinutes = input.preparationMinutes ?? 0;
  const followUpMinutes = input.followUpMinutes ?? 0;
  const totalDurationMinutes =
    input.durationMinutes + preparationMinutes + followUpMinutes;
  const totalDurationHours = totalDurationMinutes / 60;
  const roles = input.roles.map((role, index) =>
    buildRoleResult(role, index, totalDurationHours),
  );
  const totalPeople = sum(roles.map((role) => role.people));
  const totalCost = sum(roles.map((role) => role.cost));
  const personHours = sum(roles.map((role) => role.personHours));
  const recurrence = buildRecurrence(input, totalCost);
  const isZeroCost = totalCost === 0;

  return {
    durationMinutes: input.durationMinutes,
    preparationMinutes,
    followUpMinutes,
    totalDurationMinutes,
    totalDurationHours,
    totalPeople,
    totalCost,
    costPerMinute: totalCost / totalDurationMinutes,
    personHours,
    roles,
    recurrence,
    insights: buildInsights(input.frequency, totalDurationMinutes, roles, totalCost),
    isZeroCost,
  };
}

export function parseMeetingNumber(
  value: string,
  options: { integer?: boolean; optional?: boolean; maxDecimals?: number } = {},
): ParseMeetingNumberResult {
  const { integer = false, optional = false, maxDecimals = 2 } = options;
  const trimmed = value.trim();

  if (!trimmed) {
    return optional
      ? { ok: true, value: 0, normalized: "" }
      : { ok: false, error: "required" };
  }

  if (/[-−]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const cleaned = normalizeNumericText(trimmed);

  if (!/^\d+(\.\d+)?$/.test(cleaned)) {
    return { ok: false, error: "invalid" };
  }

  const decimalPlaces = cleaned.split(".")[1]?.length ?? 0;

  if ((integer && decimalPlaces > 0) || decimalPlaces > maxDecimals) {
    return { ok: false, error: "too_many_decimals" };
  }

  const numericValue = Number(cleaned);

  if (!Number.isFinite(numericValue)) {
    return { ok: false, error: "invalid" };
  }

  return { ok: true, value: numericValue, normalized: cleaned };
}

export function formatMeetingCurrency(
  value: number,
  locale = DEFAULT_LOCALE,
  currency = DEFAULT_CURRENCY,
): string {
  assertFinite(value, "importe");

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundToPrecision(value, 2));
}

export function formatMeetingNumber(
  value: number,
  digits = 2,
  locale = DEFAULT_LOCALE,
): string {
  assertFinite(value, "numero");

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(roundToPrecision(value, digits));
}

export function formatMeetingDuration(minutes: number): string {
  assertFinite(minutes, "duracion");

  if (minutes < 0) {
    throw new RangeError("La duracion debe ser no negativa.");
  }

  const roundedMinutes = Math.round(minutes);
  const hours = Math.floor(roundedMinutes / 60);
  const remainingMinutes = roundedMinutes % 60;

  if (hours === 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours} h`;

  return `${hours} h ${String(remainingMinutes).padStart(2, "0")} min`;
}

export function getFrequencyLabel(frequency: MeetingFrequency): string {
  const labels: Record<MeetingFrequency, string> = {
    once: "Una vez",
    weekly: "Semanal",
    biweekly: "Quincenal",
    monthly: "Mensual",
  };

  return labels[frequency];
}

export function buildMeetingSummary(result: MeetingCostResult): string {
  const lines = [
    `Reunion de ${result.totalDurationMinutes} min con ${result.totalPeople} personas:`,
    `- Costo estimado: ${formatMeetingCurrency(result.totalCost)}`,
    `- Horas-persona: ${formatMeetingNumber(result.personHours)} h`,
    `- Costo por minuto: ${formatMeetingCurrency(result.costPerMinute)}`,
    `- Frecuencia: ${result.recurrence.occurrencesLabel}`,
  ];

  if (result.recurrence.annualCost !== undefined) {
    lines.push(
      `- Impacto anual estimado: ${formatMeetingCurrency(result.recurrence.annualCost)}`,
    );
  }

  if (result.insights.length) {
    lines.push("", "Ahorro potencial:");
    result.insights
      .filter((insight) => insight.amount !== undefined && insight.amount > 0)
      .forEach((insight) => {
        lines.push(`- ${insight.label}: ${formatMeetingCurrency(insight.amount ?? 0)}`);
      });
  }

  lines.push("", "Calculado en calculadoras.tools");

  return lines.join("\n");
}

export function buildMeetingCsv(result: MeetingCostResult): string {
  const rows = [
    ["Tipo", "Concepto", "Personas", "Costo por hora", "Horas-persona", "Costo"],
    [
      "Resumen",
      "Total",
      String(result.totalPeople),
      "",
      formatMeetingNumber(result.personHours),
      formatMeetingNumber(result.totalCost),
    ],
    ...result.roles.map((role) => [
      "Rol",
      role.name,
      String(role.people),
      formatMeetingNumber(role.hourlyRate),
      formatMeetingNumber(role.personHours),
      formatMeetingNumber(role.cost),
    ]),
  ];

  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

function validateInput(input: MeetingCostInput): void {
  validateIntegerRange(
    input.durationMinutes,
    1,
    480,
    "invalid_duration",
    "La duracion debe estar entre 1 y 480 minutos.",
  );
  validateIntegerRange(
    input.preparationMinutes ?? 0,
    0,
    480,
    "invalid_preparation",
    "La preparacion debe estar entre 0 y 480 minutos.",
  );
  validateIntegerRange(
    input.followUpMinutes ?? 0,
    0,
    480,
    "invalid_follow_up",
    "El seguimiento debe estar entre 0 y 480 minutos.",
  );

  if (!input.roles.length) {
    throw new MeetingCostValidationError(
      "no_roles",
      "Agrega al menos un rol o participante.",
    );
  }

  if (input.roles.length > MAX_ROLES) {
    throw new MeetingCostValidationError(
      "too_many_roles",
      `La reunion admite un maximo de ${MAX_ROLES} roles.`,
    );
  }

  input.roles.forEach(validateRole);

  if (!["once", "weekly", "biweekly", "monthly"].includes(input.frequency)) {
    throw new MeetingCostValidationError(
      "invalid_frequency",
      "Selecciona una frecuencia valida.",
    );
  }

  if (input.frequency === "weekly") {
    validateIntegerRange(
      input.occurrencesPerWeek,
      1,
      7,
      "invalid_occurrences",
      "Las veces por semana deben estar entre 1 y 7.",
    );
  }

  if (input.frequency === "monthly") {
    validateIntegerRange(
      input.occurrencesPerMonth,
      1,
      31,
      "invalid_occurrences",
      "Las veces por mes deben estar entre 1 y 31.",
    );
  }
}

function validateRole(role: MeetingRoleInput, index: number): void {
  const name = role.name.trim();

  if (!name || name.length > MAX_ROLE_NAME_LENGTH) {
    throw new MeetingCostValidationError(
      "invalid_role_name",
      `El nombre del rol ${index + 1} debe tener entre 1 y ${MAX_ROLE_NAME_LENGTH} caracteres.`,
      index,
    );
  }

  if (!Number.isInteger(role.people) || role.people < 1 || role.people > 100) {
    throw new MeetingCostValidationError(
      "invalid_people",
      `La cantidad de personas de ${name} debe estar entre 1 y 100.`,
      index,
    );
  }

  if (!Number.isFinite(role.hourlyRate) || role.hourlyRate < 0) {
    throw new MeetingCostValidationError(
      "invalid_hourly_rate",
      `El costo por hora de ${name} debe ser igual o mayor que cero.`,
      index,
    );
  }
}

function buildRoleResult(
  role: MeetingRoleInput,
  index: number,
  totalDurationHours: number,
): MeetingRoleResult {
  const name = role.name.trim() || `Rol ${index + 1}`;
  const personHours = role.people * totalDurationHours;
  const costPerPerson = role.hourlyRate * totalDurationHours;

  return {
    name,
    people: role.people,
    hourlyRate: role.hourlyRate,
    personHours,
    costPerPerson,
    cost: personHours * role.hourlyRate,
  };
}

function buildRecurrence(
  input: MeetingCostInput,
  totalCost: number,
): MeetingRecurrenceResult {
  if (input.frequency === "weekly") {
    const occurrences = input.occurrencesPerWeek ?? 1;
    const weeklyCost = totalCost * occurrences;

    return {
      frequency: input.frequency,
      occurrencesLabel: `${occurrences} ${occurrences === 1 ? "vez" : "veces"} por semana`,
      weeklyCost,
      monthlyCost: (weeklyCost * 52) / 12,
      annualCost: weeklyCost * 52,
    };
  }

  if (input.frequency === "biweekly") {
    return {
      frequency: input.frequency,
      occurrencesLabel: "Cada quincena",
      weeklyCost: totalCost / 2,
      monthlyCost: (totalCost * 26) / 12,
      annualCost: totalCost * 26,
    };
  }

  if (input.frequency === "monthly") {
    const occurrences = input.occurrencesPerMonth ?? 1;
    const monthlyCost = totalCost * occurrences;

    return {
      frequency: input.frequency,
      occurrencesLabel: `${occurrences} ${occurrences === 1 ? "vez" : "veces"} por mes`,
      weeklyCost: (monthlyCost * 12) / 52,
      monthlyCost,
      annualCost: monthlyCost * 12,
    };
  }

  return {
    frequency: input.frequency,
    occurrencesLabel: "Una vez",
  };
}

function buildInsights(
  frequency: MeetingFrequency,
  totalDurationMinutes: number,
  roles: MeetingRoleResult[],
  totalCost: number,
): MeetingInsight[] {
  const insights: MeetingInsight[] = [];
  const minutes = Math.min(15, totalDurationMinutes);
  const reduceMinutesAmount =
    totalDurationMinutes > 0 ? totalCost * (minutes / totalDurationMinutes) : 0;
  const topRole = roles
    .filter((role) => role.costPerPerson > 0)
    .sort((left, right) => right.costPerPerson - left.costPerPerson)[0];

  if (reduceMinutesAmount > 0) {
    insights.push({
      code: "reduce_15_min",
      label: `Reducir ${minutes} min`,
      amount: reduceMinutesAmount,
      minutes,
    });
  }

  if (topRole) {
    insights.push({
      code: "remove_person",
      label: `Quitar una persona de ${topRole.name}`,
      amount: topRole.costPerPerson,
      roleName: topRole.name,
    });
  }

  if (frequency !== "once" && totalCost > 0) {
    insights.push({
      code: "reduce_repetition",
      label: "Reducir una repeticion",
      amount: totalCost,
    });
  }

  if (totalCost === 0) {
    insights.push({
      code: "zero_money_cost",
      label: "El costo monetario es 0; revisa horas-persona invertidas",
    });
  }

  return insights;
}

function normalizeNumericText(value: string): string {
  const withoutSymbols = value.replace(/[$\s]/g, "");
  const lastComma = withoutSymbols.lastIndexOf(",");
  const lastDot = withoutSymbols.lastIndexOf(".");

  if (lastComma > lastDot) {
    return withoutSymbols.replace(/\./g, "").replace(",", ".");
  }

  return withoutSymbols.replace(/,/g, "");
}

function validateIntegerRange(
  value: unknown,
  min: number,
  max: number,
  code: MeetingCostErrorCode,
  message: string,
): asserts value is number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < min ||
    value > max
  ) {
    throw new MeetingCostValidationError(code, message);
  }
}

function csvCell(value: string): string {
  const escaped = value.replaceAll('"', '""');

  return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

function assertFinite(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`El ${label} debe ser finito.`);
  }
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function roundToPrecision(value: number, decimals: number): number {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}
