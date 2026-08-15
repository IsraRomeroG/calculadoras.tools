import { MEXICO_VACATION_PREMIUM_RULE_2023 } from "./rules/mx/2023";

export const VACATION_PREMIUM_CANONICAL_PATH =
  "/legal-impuestos/calculadora-prima-vacacional";

export type VacationPremiumSituation = "active" | "termination";
export type VacationPremiumSalaryFrequency =
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly";

export type VacationPremiumValidationCode =
  | "invalid_reference_date"
  | "unsupported_rule_period"
  | "invalid_days"
  | "days_not_positive"
  | "invalid_salary"
  | "salary_not_positive"
  | "invalid_contractual_rate"
  | "contractual_rate_below_minimum"
  | "invalid_offered_rate"
  | "negative_offered_rate";

export class VacationPremiumValidationError extends Error {
  code: VacationPremiumValidationCode;

  constructor(code: VacationPremiumValidationCode) {
    super(code);
    this.name = "VacationPremiumValidationError";
    this.code = code;
  }
}

export interface VacationPremiumCalculationInput {
  situation: VacationPremiumSituation;
  referenceDate: string;
  vacationDays: number;
  salaryAmount: number;
  salaryFrequency: VacationPremiumSalaryFrequency;
  contractualRatePercent?: number;
  offeredRatePercent?: number;
}

export interface VacationPremiumCalculationResult {
  situation: VacationPremiumSituation;
  referenceDate: string;
  vacationDays: number;
  salaryAmount: number;
  salaryFrequency: VacationPremiumSalaryFrequency;
  salaryDivisor: number;
  dailySalary: number;
  vacationBase: number;
  legalMinimumRate: number;
  applicableRate: number;
  usesContractualRate: boolean;
  minimumPremium: number;
  applicablePremium: number;
  benefitAboveMinimum: number;
  primaryAmount: number;
  terminationVacationComponent?: number;
  offeredRate?: number;
  offeredPremium?: number;
  differenceFromApplicable?: number;
}

export type ParseVacationPremiumNumberResult =
  | { ok: true; value: number; normalized: string }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

const MAX_AMOUNT = 1_000_000_000_000;

export function calculateVacationPremium(
  input: VacationPremiumCalculationInput,
): VacationPremiumCalculationResult {
  validateCivilDate(input.referenceDate);

  const rule = MEXICO_VACATION_PREMIUM_RULE_2023;
  if (
    input.referenceDate < rule.supportedFrom ||
    (rule.supportedTo && input.referenceDate > rule.supportedTo) ||
    rule.status !== "current"
  ) {
    throw new VacationPremiumValidationError("unsupported_rule_period");
  }

  if (!Number.isFinite(input.vacationDays) || input.vacationDays > MAX_AMOUNT) {
    throw new VacationPremiumValidationError("invalid_days");
  }
  if (input.vacationDays <= 0) {
    throw new VacationPremiumValidationError("days_not_positive");
  }

  if (!Number.isFinite(input.salaryAmount) || input.salaryAmount > MAX_AMOUNT) {
    throw new VacationPremiumValidationError("invalid_salary");
  }
  if (input.salaryAmount <= 0) {
    throw new VacationPremiumValidationError("salary_not_positive");
  }

  const legalMinimumPercent = rule.minimumPremiumRate * 100;
  const contractualRatePercent = input.contractualRatePercent;

  if (
    contractualRatePercent !== undefined &&
    (!Number.isFinite(contractualRatePercent) ||
      contractualRatePercent > MAX_AMOUNT)
  ) {
    throw new VacationPremiumValidationError("invalid_contractual_rate");
  }
  if (
    contractualRatePercent !== undefined &&
    contractualRatePercent < legalMinimumPercent
  ) {
    throw new VacationPremiumValidationError(
      "contractual_rate_below_minimum",
    );
  }

  if (
    input.offeredRatePercent !== undefined &&
    (!Number.isFinite(input.offeredRatePercent) ||
      input.offeredRatePercent > MAX_AMOUNT)
  ) {
    throw new VacationPremiumValidationError("invalid_offered_rate");
  }
  if (
    input.offeredRatePercent !== undefined &&
    input.offeredRatePercent < 0
  ) {
    throw new VacationPremiumValidationError("negative_offered_rate");
  }

  const salaryDivisor = rule.salaryDivisors[input.salaryFrequency];
  const dailySalary = input.salaryAmount / salaryDivisor;
  const vacationBase = dailySalary * input.vacationDays;
  const applicableRate =
    contractualRatePercent === undefined
      ? rule.minimumPremiumRate
      : contractualRatePercent / 100;
  const minimumPremium = vacationBase * rule.minimumPremiumRate;
  const applicablePremium = vacationBase * applicableRate;
  const terminationVacationComponent = vacationBase + applicablePremium;
  const result: VacationPremiumCalculationResult = {
    situation: input.situation,
    referenceDate: input.referenceDate,
    vacationDays: input.vacationDays,
    salaryAmount: input.salaryAmount,
    salaryFrequency: input.salaryFrequency,
    salaryDivisor,
    dailySalary,
    vacationBase,
    legalMinimumRate: rule.minimumPremiumRate,
    applicableRate,
    usesContractualRate: contractualRatePercent !== undefined,
    minimumPremium,
    applicablePremium,
    benefitAboveMinimum: Math.max(0, applicablePremium - minimumPremium),
    primaryAmount:
      input.situation === "termination"
        ? terminationVacationComponent
        : applicablePremium,
  };

  if (input.situation === "termination") {
    result.terminationVacationComponent = terminationVacationComponent;
  }

  if (input.offeredRatePercent !== undefined) {
    const offeredRate = input.offeredRatePercent / 100;
    const offeredPremium = vacationBase * offeredRate;
    result.offeredRate = offeredRate;
    result.offeredPremium = offeredPremium;
    result.differenceFromApplicable = applicablePremium - offeredPremium;
  }

  return result;
}

export function parseVacationPremiumNumber(
  value: string,
  options: {
    required?: boolean;
    maximumDecimals?: number;
    allowThousands?: boolean;
  } = {},
): ParseVacationPremiumNumberResult {
  const {
    required = true,
    maximumDecimals = 2,
    allowThousands = true,
  } = options;
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
    .replace(/[$€£¥%\s]/g, "");

  if (!cleaned || /[^0-9.,]/.test(cleaned)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeSeparators(cleaned, allowThousands);
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

export function normalizeVacationPremiumDays(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatVacationPremiumMoney(value: number): string {
  return new Intl.NumberFormat(MEXICO_VACATION_PREMIUM_RULE_2023.locale, {
    style: "currency",
    currency: MEXICO_VACATION_PREMIUM_RULE_2023.currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundCurrency(value));
}

export function formatVacationPremiumNumber(
  value: number,
  maximumFractionDigits = 2,
): string {
  return new Intl.NumberFormat(MEXICO_VACATION_PREMIUM_RULE_2023.locale, {
    maximumFractionDigits,
  }).format(value);
}

export function formatVacationPremiumPercent(value: number): string {
  return new Intl.NumberFormat(MEXICO_VACATION_PREMIUM_RULE_2023.locale, {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(value);
}

function validateCivilDate(value: string): void {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    throw new VacationPremiumValidationError("invalid_reference_date");
  }

  const timestamp = Date.UTC(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );
  const parsed = new Date(timestamp);
  if (
    parsed.getUTCFullYear() !== Number(match[1]) ||
    parsed.getUTCMonth() + 1 !== Number(match[2]) ||
    parsed.getUTCDate() !== Number(match[3])
  ) {
    throw new VacationPremiumValidationError("invalid_reference_date");
  }
}

function normalizeSeparators(value: string, allowThousands: boolean): string {
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
    return normalizeSingleSeparator(value, ",", allowThousands);
  }
  if (lastDot !== -1) {
    return normalizeSingleSeparator(value, ".", allowThousands);
  }
  return value;
}

function normalizeSingleSeparator(
  value: string,
  separator: "," | ".",
  allowThousands: boolean,
) {
  const parts = value.split(separator);

  if (parts.length === 2) {
    const [integerPart, fractionalOrGroup] = parts;
    if (!integerPart || !fractionalOrGroup) return value;
    if (
      allowThousands &&
      fractionalOrGroup.length === 3 &&
      integerPart.length <= 3
    ) {
      return `${integerPart}${fractionalOrGroup}`;
    }
    return `${integerPart}.${fractionalOrGroup}`;
  }

  if (
    allowThousands &&
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
