import { MEXICO_ANNUAL_BONUS_RULE_2026 } from "./rules/mx/2026";

export const ANNUAL_BONUS_CANONICAL_PATH =
  "/legal-impuestos/calculadora-aguinaldo-proporcional";

export type EmploymentStatus = "active" | "terminated";
export type SalaryFrequency = "daily" | "weekly" | "biweekly" | "monthly";

export type AnnualBonusValidationCode =
  | "invalid_hire_date"
  | "invalid_end_date"
  | "invalid_today"
  | "end_before_hire"
  | "end_in_future"
  | "unsupported_rule_period"
  | "invalid_salary"
  | "salary_not_positive"
  | "invalid_annual_days"
  | "below_legal_minimum"
  | "invalid_non_eligible_days"
  | "non_eligible_days_not_integer"
  | "non_eligible_days_exceed_period"
  | "invalid_received_amount"
  | "negative_received_amount"
  | "projection_unavailable";

export class AnnualBonusValidationError extends Error {
  code: AnnualBonusValidationCode;

  constructor(code: AnnualBonusValidationCode) {
    super(code);
    this.name = "AnnualBonusValidationError";
    this.code = code;
  }
}

export interface AnnualBonusCalculationInput {
  employmentStatus: EmploymentStatus;
  hireDate: string;
  endDate: string;
  today: string;
  salaryAmount: number;
  salaryFrequency: SalaryFrequency;
  annualBonusDays?: number;
  nonEligibleDays?: number;
  projectToYearEnd?: boolean;
  receivedAmount?: number;
}

export interface AnnualBonusCalculationResult {
  employmentStatus: EmploymentStatus;
  year: number;
  periodStart: string;
  periodEnd: string;
  effectiveStart: string;
  effectiveEnd: string;
  inclusiveDays: number;
  basisDays: number;
  nonEligibleDays: number;
  eligibleDays: number;
  generatedProportion: number;
  salaryAmount: number;
  salaryFrequency: SalaryFrequency;
  salaryDivisor: number;
  dailySalary: number;
  legalMinimumDays: number;
  annualBonusDays: number;
  usesContractBenefit: boolean;
  annualEquivalent: number;
  generatedAmount: number;
  projectedEligibleDays?: number;
  projectedProportion?: number;
  projectedAmount?: number;
  receivedAmount?: number;
  differenceFromEstimate?: number;
}

export type ParseLocalizedNumberResult =
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
const MAX_AMOUNT = 1_000_000_000_000;

export function calculateProportionalAnnualBonus(
  input: AnnualBonusCalculationInput,
): AnnualBonusCalculationResult {
  const hireDate = parseCivilDate(input.hireDate, "invalid_hire_date");
  const endDate = parseCivilDate(input.endDate, "invalid_end_date");
  const today = parseCivilDate(input.today, "invalid_today");
  const hireTimestamp = toUtcTimestamp(hireDate);
  const endTimestamp = toUtcTimestamp(endDate);

  if (endTimestamp < hireTimestamp) {
    throw new AnnualBonusValidationError("end_before_hire");
  }

  if (endTimestamp > toUtcTimestamp(today)) {
    throw new AnnualBonusValidationError("end_in_future");
  }

  if (
    input.endDate < MEXICO_ANNUAL_BONUS_RULE_2026.effectiveFrom ||
    (MEXICO_ANNUAL_BONUS_RULE_2026.effectiveTo &&
      input.endDate > MEXICO_ANNUAL_BONUS_RULE_2026.effectiveTo) ||
    MEXICO_ANNUAL_BONUS_RULE_2026.status !== "current"
  ) {
    throw new AnnualBonusValidationError("unsupported_rule_period");
  }

  const salaryAmount = validateAmount(
    input.salaryAmount,
    "invalid_salary",
  );

  if (salaryAmount <= 0) {
    throw new AnnualBonusValidationError("salary_not_positive");
  }

  const annualBonusDays = input.annualBonusDays ??
    MEXICO_ANNUAL_BONUS_RULE_2026.minimumDays;

  if (!Number.isFinite(annualBonusDays) || annualBonusDays > 365) {
    throw new AnnualBonusValidationError("invalid_annual_days");
  }

  if (annualBonusDays < MEXICO_ANNUAL_BONUS_RULE_2026.minimumDays) {
    throw new AnnualBonusValidationError("below_legal_minimum");
  }

  const nonEligibleDays = input.nonEligibleDays ?? 0;

  if (!Number.isFinite(nonEligibleDays) || nonEligibleDays < 0) {
    throw new AnnualBonusValidationError("invalid_non_eligible_days");
  }

  if (!Number.isInteger(nonEligibleDays)) {
    throw new AnnualBonusValidationError("non_eligible_days_not_integer");
  }

  const year = endDate.year;
  const periodStart: CivilDate = { year, month: 1, day: 1 };
  const periodEnd: CivilDate = { year, month: 12, day: 31 };
  const effectiveStart =
    hireTimestamp > toUtcTimestamp(periodStart) ? hireDate : periodStart;
  const effectiveEnd = endDate;
  const inclusiveDays = differenceInCalendarDays(
    effectiveStart,
    addDays(effectiveEnd, 1),
  );
  const basisDays = differenceInCalendarDays(
    periodStart,
    addDays(periodEnd, 1),
  );

  if (nonEligibleDays > inclusiveDays) {
    throw new AnnualBonusValidationError("non_eligible_days_exceed_period");
  }

  const salaryDivisor =
    MEXICO_ANNUAL_BONUS_RULE_2026.salaryDivisors[input.salaryFrequency];
  const dailySalary = salaryAmount / salaryDivisor;
  const eligibleDays = Math.max(0, inclusiveDays - nonEligibleDays);
  const generatedProportion = Math.min(1, eligibleDays / basisDays);
  const annualEquivalent = dailySalary * annualBonusDays;
  const generatedAmount = annualEquivalent * generatedProportion;
  const result: AnnualBonusCalculationResult = {
    employmentStatus: input.employmentStatus,
    year,
    periodStart: formatCivilDate(periodStart),
    periodEnd: formatCivilDate(periodEnd),
    effectiveStart: formatCivilDate(effectiveStart),
    effectiveEnd: formatCivilDate(effectiveEnd),
    inclusiveDays,
    basisDays,
    nonEligibleDays,
    eligibleDays,
    generatedProportion,
    salaryAmount,
    salaryFrequency: input.salaryFrequency,
    salaryDivisor,
    dailySalary,
    legalMinimumDays: MEXICO_ANNUAL_BONUS_RULE_2026.minimumDays,
    annualBonusDays,
    usesContractBenefit:
      annualBonusDays > MEXICO_ANNUAL_BONUS_RULE_2026.minimumDays,
    annualEquivalent,
    generatedAmount,
  };

  if (input.projectToYearEnd) {
    const currentYear = today.year;

    if (
      input.employmentStatus !== "active" ||
      year !== currentYear ||
      endTimestamp >= toUtcTimestamp(periodEnd)
    ) {
      throw new AnnualBonusValidationError("projection_unavailable");
    }

    const remainingDays = differenceInCalendarDays(
      addDays(endDate, 1),
      addDays(periodEnd, 1),
    );
    const projectedEligibleDays = Math.min(
      basisDays,
      eligibleDays + remainingDays,
    );
    const projectedProportion = projectedEligibleDays / basisDays;

    result.projectedEligibleDays = projectedEligibleDays;
    result.projectedProportion = projectedProportion;
    result.projectedAmount = annualEquivalent * projectedProportion;
  }

  if (input.receivedAmount !== undefined) {
    const receivedAmount = validateAmount(
      input.receivedAmount,
      "invalid_received_amount",
    );

    if (receivedAmount < 0) {
      throw new AnnualBonusValidationError("negative_received_amount");
    }

    result.receivedAmount = receivedAmount;
    result.differenceFromEstimate = receivedAmount - generatedAmount;
  }

  return result;
}

export function parseLocalizedNumber(
  value: string,
  options: { required?: boolean; maximumDecimals?: number } = {},
): ParseLocalizedNumberResult {
  const { required = true, maximumDecimals = 4 } = options;
  const trimmed = value.trim();

  if (!trimmed) {
    return required
      ? { ok: false, error: "required" }
      : { ok: true, value: 0, normalized: "0" };
  }

  if (/[-−]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const cleaned = trimmed
    .replace(/\bMXN\b/gi, "")
    .replace(/[$€£¥\s]/g, "");

  if (!cleaned || /[^0-9.,]/.test(cleaned)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeSeparators(cleaned);

  if (!/^\d+(?:\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const decimalPart = normalized.split(".")[1];

  if (decimalPart && decimalPart.length > maximumDecimals) {
    return { ok: false, error: "too_many_decimals" };
  }

  const numericValue = Number(normalized);

  if (!Number.isFinite(numericValue) || numericValue > MAX_AMOUNT) {
    return { ok: false, error: "invalid" };
  }

  return { ok: true, value: numericValue, normalized };
}

export function formatAnnualBonusMoney(value: number): string {
  return new Intl.NumberFormat(MEXICO_ANNUAL_BONUS_RULE_2026.locale, {
    style: "currency",
    currency: MEXICO_ANNUAL_BONUS_RULE_2026.currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundCurrency(value));
}

export function formatAnnualBonusNumber(
  value: number,
  maximumFractionDigits = 2,
): string {
  return new Intl.NumberFormat(MEXICO_ANNUAL_BONUS_RULE_2026.locale, {
    maximumFractionDigits,
  }).format(value);
}

export function formatAnnualBonusPercent(value: number): string {
  return new Intl.NumberFormat(MEXICO_ANNUAL_BONUS_RULE_2026.locale, {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatAnnualBonusDate(value: string): string {
  const civilDate = parseCivilDate(value, "invalid_end_date");

  return new Intl.DateTimeFormat(MEXICO_ANNUAL_BONUS_RULE_2026.locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(toUtcTimestamp(civilDate)));
}

function validateAmount(
  value: number,
  code: "invalid_salary" | "invalid_received_amount",
): number {
  if (!Number.isFinite(value) || Math.abs(value) > MAX_AMOUNT) {
    throw new AnnualBonusValidationError(code);
  }

  return value;
}

function parseCivilDate(
  value: string,
  code: "invalid_hire_date" | "invalid_end_date" | "invalid_today",
): CivilDate {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    throw new AnnualBonusValidationError(code);
  }

  const date = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
  const parsed = new Date(toUtcTimestamp(date));

  if (
    parsed.getUTCFullYear() !== date.year ||
    parsed.getUTCMonth() + 1 !== date.month ||
    parsed.getUTCDate() !== date.day
  ) {
    throw new AnnualBonusValidationError(code);
  }

  return date;
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

function normalizeSeparators(value: string): string {
  const lastComma = value.lastIndexOf(",");
  const lastDot = value.lastIndexOf(".");

  if (lastComma !== -1 && lastDot !== -1) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";

    return value
      .replaceAll(thousandsSeparator, "")
      .replace(decimalSeparator, ".");
  }

  if (lastComma !== -1) {
    return normalizeSingleSeparator(value, ",");
  }

  if (lastDot !== -1) {
    return normalizeSingleSeparator(value, ".");
  }

  return value;
}

function normalizeSingleSeparator(value: string, separator: "," | "."): string {
  const parts = value.split(separator);

  if (parts.length === 2) {
    const [integerPart, fractionalOrGroup] = parts;

    if (!integerPart || !fractionalOrGroup) {
      return value;
    }

    if (fractionalOrGroup.length === 3 && integerPart.length <= 3) {
      return `${integerPart}${fractionalOrGroup}`;
    }

    return `${integerPart}.${fractionalOrGroup}`;
  }

  if (
    parts.length > 2 &&
    parts.every(Boolean) &&
    parts.slice(1).every((part) => part.length === 3)
  ) {
    return parts.join("");
  }

  return value;
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
