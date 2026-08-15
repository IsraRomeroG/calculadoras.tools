import {
  MEXICO_VACATION_RULE_2023,
  getMexicoLegalVacationDays,
} from "./rules/mx/2023";

export const VACATION_CANONICAL_PATH =
  "/legal-impuestos/calculadora-vacaciones-proporcionales";
export const VACATION_ENGLISH_CANONICAL_PATH =
  "/en/legal-tax/proportional-vacation-calculator";

export type VacationMode = "activeEmployment" | "terminatedEmployment";

export type VacationValidationCode =
  | "invalid_hire_date"
  | "invalid_end_date"
  | "end_before_hire"
  | "unsupported_rule_period"
  | "invalid_number"
  | "negative_number"
  | "contract_below_legal";

export class VacationValidationError extends Error {
  code: VacationValidationCode;

  constructor(code: VacationValidationCode) {
    super(code);
    this.name = "VacationValidationError";
    this.code = code;
  }
}

export interface VacationCalculationInput {
  mode: VacationMode;
  hireDate: string;
  endDate: string;
  priorBalance?: number;
  usedDays?: number;
  lastCompletedEntitlementOverride?: number;
  currentCycleEntitlementOverride?: number;
}

export interface VacationCalculationResult {
  mode: VacationMode;
  hireDate: string;
  endDate: string;
  completedYears: number;
  currentServiceYear: number;
  currentCycleStart: string;
  nextAnniversary: string;
  elapsedCycleDays: number;
  totalCycleDays: number;
  legalLastCompletedEntitlement: number;
  legalCurrentCycleEntitlement: number;
  lastCompletedEntitlement: number;
  currentCycleEntitlement: number;
  priorBalance: number;
  usedDays: number;
  cycleProgress: number;
  acquiredBalanceRaw: number;
  availableDays: number;
  terminationDays: number;
  advancedDays: number;
  mainDays: number;
  usesContractOverride: boolean;
  isFirstServiceYear: boolean;
}

export type ParseDaysInputResult =
  | { ok: true; value: number; normalized: string }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

interface CivilDate {
  year: number;
  month: number;
  day: number;
}

const DAY_MS = 86_400_000;

export function calculateProportionalVacation(
  input: VacationCalculationInput,
): VacationCalculationResult {
  const hireDate = parseCivilDate(input.hireDate, "invalid_hire_date");
  const endDate = parseCivilDate(input.endDate, "invalid_end_date");
  const hireTimestamp = toUtcTimestamp(hireDate);
  const endTimestamp = toUtcTimestamp(endDate);

  if (endTimestamp < hireTimestamp) {
    throw new VacationValidationError("end_before_hire");
  }

  if (input.endDate < MEXICO_VACATION_RULE_2023.effectiveFrom) {
    throw new VacationValidationError("unsupported_rule_period");
  }

  const endExclusive = addDays(endDate, 1);
  const completedYears = countCompletedYears(hireDate, endExclusive);
  const currentCycleStart = addCalendarYearsClamped(hireDate, completedYears);
  const nextAnniversary = addCalendarYearsClamped(
    hireDate,
    completedYears + 1,
  );

  if (
    completedYears > 0 &&
    formatCivilDate(currentCycleStart) < MEXICO_VACATION_RULE_2023.effectiveFrom
  ) {
    throw new VacationValidationError("unsupported_rule_period");
  }

  const elapsedCycleDays = differenceInCalendarDays(
    currentCycleStart,
    endExclusive,
  );
  const totalCycleDays = differenceInCalendarDays(
    currentCycleStart,
    nextAnniversary,
  );
  const currentServiceYear = completedYears + 1;
  const legalLastCompletedEntitlement =
    completedYears > 0 ? getMexicoLegalVacationDays(completedYears) : 0;
  const legalCurrentCycleEntitlement =
    getMexicoLegalVacationDays(currentServiceYear);

  const priorBalance = validateNonNegative(input.priorBalance ?? 0);
  const usedDays = validateNonNegative(input.usedDays ?? 0);
  const lastCompletedEntitlement = resolveEntitlementOverride(
    input.lastCompletedEntitlementOverride,
    legalLastCompletedEntitlement,
  );
  const currentCycleEntitlement = resolveEntitlementOverride(
    input.currentCycleEntitlementOverride,
    legalCurrentCycleEntitlement,
  );
  const cycleProgress =
    (currentCycleEntitlement * elapsedCycleDays) / totalCycleDays;
  const acquiredBalanceRaw =
    priorBalance + lastCompletedEntitlement - usedDays;
  const availableDays = Math.max(0, acquiredBalanceRaw);
  const terminationBalanceRaw = acquiredBalanceRaw + cycleProgress;
  const terminationDays = Math.max(0, terminationBalanceRaw);
  const balanceForMode =
    input.mode === "activeEmployment"
      ? acquiredBalanceRaw
      : terminationBalanceRaw;

  return {
    mode: input.mode,
    hireDate: input.hireDate,
    endDate: input.endDate,
    completedYears,
    currentServiceYear,
    currentCycleStart: formatCivilDate(currentCycleStart),
    nextAnniversary: formatCivilDate(nextAnniversary),
    elapsedCycleDays,
    totalCycleDays,
    legalLastCompletedEntitlement,
    legalCurrentCycleEntitlement,
    lastCompletedEntitlement,
    currentCycleEntitlement,
    priorBalance,
    usedDays,
    cycleProgress,
    acquiredBalanceRaw,
    availableDays,
    terminationDays,
    advancedDays: Math.max(0, -balanceForMode),
    mainDays:
      input.mode === "activeEmployment" ? availableDays : terminationDays,
    usesContractOverride:
      lastCompletedEntitlement !== legalLastCompletedEntitlement ||
      currentCycleEntitlement !== legalCurrentCycleEntitlement,
    isFirstServiceYear: completedYears === 0,
  };
}

export function parseDaysInput(value: string): ParseDaysInputResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  if (/[-−]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  if (!/^\d+(?:[.,]\d+)?$/.test(trimmed)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = trimmed.replace(",", ".");
  const decimals = normalized.split(".")[1];

  if (decimals && decimals.length > 2) {
    return { ok: false, error: "too_many_decimals" };
  }

  const numericValue = Number(normalized);

  if (!Number.isFinite(numericValue)) {
    return { ok: false, error: "invalid" };
  }

  return { ok: true, value: numericValue, normalized };
}

export function parseOptionalDaysInput(value: string): ParseDaysInputResult {
  if (!value.trim()) {
    return { ok: true, value: 0, normalized: "0" };
  }

  return parseDaysInput(value);
}

export function formatVacationDays(value: number, locale = "es-MX"): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatVacationDate(
  value: string,
  locale = "es-MX",
): string {
  const civilDate = parseCivilDate(value, "invalid_end_date");

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(toUtcTimestamp(civilDate)));
}

function resolveEntitlementOverride(
  override: number | undefined,
  legalMinimum: number,
): number {
  if (override === undefined) {
    return legalMinimum;
  }

  const value = validateNonNegative(override);

  if (value < legalMinimum) {
    throw new VacationValidationError("contract_below_legal");
  }

  return value;
}

function validateNonNegative(value: number): number {
  if (!Number.isFinite(value)) {
    throw new VacationValidationError("invalid_number");
  }

  if (value < 0) {
    throw new VacationValidationError("negative_number");
  }

  return value;
}

function parseCivilDate(
  value: string,
  errorCode: "invalid_hire_date" | "invalid_end_date",
): CivilDate {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    throw new VacationValidationError(errorCode);
  }

  const [, yearText, monthText, dayText] = match;
  const date = {
    year: Number(yearText),
    month: Number(monthText),
    day: Number(dayText),
  };
  const timestamp = toUtcTimestamp(date);
  const parsed = new Date(timestamp);

  if (
    parsed.getUTCFullYear() !== date.year ||
    parsed.getUTCMonth() + 1 !== date.month ||
    parsed.getUTCDate() !== date.day
  ) {
    throw new VacationValidationError(errorCode);
  }

  return date;
}

function countCompletedYears(start: CivilDate, endExclusive: CivilDate): number {
  let years = Math.max(0, endExclusive.year - start.year);

  while (
    years > 0 &&
    toUtcTimestamp(addCalendarYearsClamped(start, years)) >
      toUtcTimestamp(endExclusive)
  ) {
    years -= 1;
  }

  while (
    toUtcTimestamp(addCalendarYearsClamped(start, years + 1)) <=
    toUtcTimestamp(endExclusive)
  ) {
    years += 1;
  }

  return years;
}

function addCalendarYearsClamped(date: CivilDate, years: number): CivilDate {
  const targetYear = date.year + years;
  const lastDay = new Date(Date.UTC(targetYear, date.month, 0)).getUTCDate();

  return {
    year: targetYear,
    month: date.month,
    day: Math.min(date.day, lastDay),
  };
}

function addDays(date: CivilDate, days: number): CivilDate {
  const result = new Date(toUtcTimestamp(date) + days * DAY_MS);

  return {
    year: result.getUTCFullYear(),
    month: result.getUTCMonth() + 1,
    day: result.getUTCDate(),
  };
}

function differenceInCalendarDays(start: CivilDate, end: CivilDate): number {
  return (toUtcTimestamp(end) - toUtcTimestamp(start)) / DAY_MS;
}

function toUtcTimestamp(date: CivilDate): number {
  return Date.UTC(date.year, date.month - 1, date.day);
}

function formatCivilDate(date: CivilDate): string {
  return [
    String(date.year).padStart(4, "0"),
    String(date.month).padStart(2, "0"),
    String(date.day).padStart(2, "0"),
  ].join("-");
}
