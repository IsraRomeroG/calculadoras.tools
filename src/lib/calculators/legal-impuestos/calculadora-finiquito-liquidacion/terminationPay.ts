import {
  calculateProportionalVacation,
  VacationValidationError,
  type VacationCalculationResult,
} from "@lib/calculators/legal-impuestos/calculadora-vacaciones-proporcionales/proportionalVacation";
import {
  getMexicoTerminationRule,
  type MinimumWageArea,
  type TerminationRuleSet,
} from "./rules/mx/2026";
import {
  normalizeDailySalary,
  type SalaryFrequency,
} from "./salary";

export type { SalaryFrequency } from "./salary";
export { normalizeDailySalary } from "./salary";

export const TERMINATION_CANONICAL_PATH =
  "/legal-impuestos/calculadora-finiquito-liquidacion";
export const TERMINATION_ENGLISH_CANONICAL_PATH =
  "/en/legal-tax/termination-pay-calculator";

export type TerminationSituation =
  | "resignation"
  | "dismissal"
  | "workerCause"
  | "contractEnd"
  | "agreement"
  | "other";
export type ContractType =
  | "indefinite"
  | "fixed-under-year"
  | "fixed-year-or-more"
  | "unknown";

export interface AdditionalConcept {
  name: string;
  amount: number;
}

export interface ReceivedPayment {
  amount: number;
  concept?: string;
}

export interface TerminationCalculationInput {
  situation: TerminationSituation;
  hireDate: string;
  endDate: string;
  contractType: ContractType;
  salaryBase: number;
  frequency: SalaryFrequency;
  unpaidDays?: number;
  unpaidAmountOverride?: number;
  annualBonusDays?: number;
  ineligibleBonusDays?: number;
  priorVacationBalance?: number;
  usedVacationDays?: number;
  lastVacationEntitlementOverride?: number;
  currentVacationEntitlementOverride?: number;
  vacationPremiumRate?: number;
  plantWorker?: boolean;
  minimumWageArea?: MinimumWageArea;
  otherIntegratedDailyAmount?: number;
  integratedSalaryOverride?: number;
  includeSeniorityPremium?: boolean;
  includeConstitutionalIndemnity?: boolean;
  includeTwentyDaysIndemnity?: boolean;
  additionalConcepts?: AdditionalConcept[];
  receivedPayments?: ReceivedPayment[];
  ruleSet?: TerminationRuleSet;
}

export type TerminationValidationCode =
  | "invalid_hire_date"
  | "invalid_end_date"
  | "end_before_hire"
  | "unsupported_rule_period"
  | "invalid_number"
  | "negative_number"
  | "negative_number"
  | "zero_salary"
  | "contract_below_legal"
  | "invalid_rate"
  | "salary_integrated_required";

export class TerminationValidationError extends Error {
  code: TerminationValidationCode;

  constructor(code: TerminationValidationCode) {
    super(code);
    this.name = "TerminationValidationError";
    this.code = code;
  }
}

export interface TerminationCalculationResult {
  situation: TerminationSituation;
  hireDate: string;
  endDate: string;
  contractType: ContractType;
  salaryFrequency: SalaryFrequency;
  salaryBase: number;
  ordinaryDailySalary: number;
  integratedDailySalary: number;
  usedIntegratedOverride: boolean;
  annualBonusDays: number;
  ineligibleBonusDays: number;
  annualBonusPeriodDays: number;
  annualBonusEligibleDays: number;
  annualBonusBaseDays: number;
  annualBonusAmount: number;
  vacation: VacationCalculationResult;
  vacationPay: number;
  vacationPremiumRate: number;
  vacationPremiumAmount: number;
  unpaidDays: number;
  unpaidSalaryAmount: number;
  usedUnpaidAmountOverride: boolean;
  additionalConcepts: AdditionalConcept[];
  additionalAmount: number;
  receivedPayments: ReceivedPayment[];
  receivedPaymentsTotal: number;
  finiquitoGross: number;
  finiquitoPending: number;
  receivedExcess: number;
  yearsOfService: number;
  seniorityEligible: boolean;
  seniorityReason: string;
  seniorityBaseSalary: number;
  seniorityAmount: number;
  constitutionalIndemnityAmount: number;
  twentyDaysIndemnityAmount: number;
  conditionalTotal: number;
  totalScenario: number;
  minimumWageArea: MinimumWageArea;
  minimumWageUsed: number;
  usesContractOverrides: boolean;
  ruleSet: TerminationRuleSet;
}

export function calculateTerminationPay(
  input: TerminationCalculationInput,
): TerminationCalculationResult {
  validateCivilDate(input.hireDate, "invalid_hire_date");
  validateCivilDate(input.endDate, "invalid_end_date");
  let rules: TerminationRuleSet;
  try {
    rules = input.ruleSet ?? getMexicoTerminationRule(input.endDate);
  } catch {
    throw new TerminationValidationError("unsupported_rule_period");
  }
  if (input.endDate < input.hireDate) {
    throw new TerminationValidationError("end_before_hire");
  }
  if (input.endDate < rules.effectiveFrom) {
    throw new TerminationValidationError("unsupported_rule_period");
  }

  const salaryBase = validateSalary(input.salaryBase);
  const ordinaryDailySalary = normalizeDailySalary(
    salaryBase,
    input.frequency,
  );
  const annualBonusDays = validateAtLeast(
    input.annualBonusDays ?? rules.annualBonusMinimumDays,
    rules.annualBonusMinimumDays,
  );
  const ineligibleBonusDays = validateNonNegative(
    input.ineligibleBonusDays ?? 0,
  );
  const annualBonusBaseDays = daysInCalendarYear(input.endDate);
  const annualBonusPeriodDays = inclusiveDays(
    maxDate(input.hireDate, `${input.endDate.slice(0, 4)}-01-01`),
    input.endDate,
  );
  if (ineligibleBonusDays > annualBonusPeriodDays) {
    throw new TerminationValidationError("invalid_number");
  }
  const annualBonusEligibleDays = Math.max(
    0,
    annualBonusPeriodDays - ineligibleBonusDays,
  );
  const annualBonusAmount =
    ordinaryDailySalary *
    annualBonusDays *
    (annualBonusEligibleDays / annualBonusBaseDays);

  let vacation: VacationCalculationResult;
  try {
    vacation = calculateProportionalVacation({
      mode: "terminatedEmployment",
      hireDate: input.hireDate,
      endDate: input.endDate,
      priorBalance: validateNonNegative(input.priorVacationBalance ?? 0),
      usedDays: validateNonNegative(input.usedVacationDays ?? 0),
      ...(input.lastVacationEntitlementOverride === undefined
        ? {}
        : {
            lastCompletedEntitlementOverride: validateNonNegative(
              input.lastVacationEntitlementOverride,
            ),
          }),
      ...(input.currentVacationEntitlementOverride === undefined
        ? {}
        : {
            currentCycleEntitlementOverride: validateNonNegative(
              input.currentVacationEntitlementOverride,
            ),
          }),
    });
  } catch (error) {
    if (error instanceof VacationValidationError) {
      throw new TerminationValidationError(error.code);
    }
    throw error;
  }
  const vacationPremiumRate = validateRate(
    input.vacationPremiumRate ?? rules.vacationPremiumMinimumRate,
    rules.vacationPremiumMinimumRate,
  );
  const vacationPay = ordinaryDailySalary * vacation.mainDays;
  const vacationPremiumAmount = vacationPay * vacationPremiumRate;

  const unpaidDays = validateNonNegative(input.unpaidDays ?? 0);
  const unpaidAmountOverride = input.unpaidAmountOverride;
  if (unpaidAmountOverride !== undefined) {
    validateNonNegative(unpaidAmountOverride);
  }
  const unpaidSalaryAmount =
    unpaidAmountOverride ?? unpaidDays * ordinaryDailySalary;

  const additionalConcepts = normalizeConcepts(input.additionalConcepts);
  const additionalAmount = additionalConcepts.reduce(
    (total, concept) => total + concept.amount,
    0,
  );
  const receivedPayments = normalizePayments(input.receivedPayments);
  const receivedPaymentsTotal = receivedPayments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );

  const finiquitoGross =
    unpaidSalaryAmount +
    annualBonusAmount +
    vacationPay +
    vacationPremiumAmount +
    additionalAmount;
  const finiquitoPending = Math.max(
    0,
    finiquitoGross - receivedPaymentsTotal,
  );
  const receivedExcess = Math.max(0, receivedPaymentsTotal - finiquitoGross);

  const integratedDailySalary = resolveIntegratedSalary({
    input,
    ordinaryDailySalary,
    annualBonusDays,
    vacation,
    vacationPremiumRate,
    annualBonusBaseDays,
  });
  const usedIntegratedOverride = input.integratedSalaryOverride !== undefined;
  const yearsOfService = calculateYearsOfService(vacation);
  const minimumWageArea = input.minimumWageArea ?? "general";
  const minimumWageUsed = rules.minimumWageByArea[minimumWageArea];
  const seniority = calculateSeniority({
    input,
    rules,
    yearsOfService,
    ordinaryDailySalary,
    minimumWageUsed,
  });
  const constitutionalIndemnityAmount = input.includeConstitutionalIndemnity
    ? integratedDailySalary * 90
    : 0;
  const twentyDaysIndemnityAmount = input.includeTwentyDaysIndemnity
    ? integratedDailySalary * 20 * yearsOfService
    : 0;
  const conditionalTotal =
    seniority.amount +
    constitutionalIndemnityAmount +
    twentyDaysIndemnityAmount;

  return {
    situation: input.situation,
    hireDate: input.hireDate,
    endDate: input.endDate,
    contractType: input.contractType,
    salaryFrequency: input.frequency,
    salaryBase,
    ordinaryDailySalary,
    integratedDailySalary,
    usedIntegratedOverride,
    annualBonusDays,
    ineligibleBonusDays,
    annualBonusPeriodDays,
    annualBonusEligibleDays,
    annualBonusBaseDays,
    annualBonusAmount,
    vacation,
    vacationPay,
    vacationPremiumRate,
    vacationPremiumAmount,
    unpaidDays,
    unpaidSalaryAmount,
    usedUnpaidAmountOverride: unpaidAmountOverride !== undefined,
    additionalConcepts,
    additionalAmount,
    receivedPayments,
    receivedPaymentsTotal,
    finiquitoGross,
    finiquitoPending,
    receivedExcess,
    yearsOfService,
    seniorityEligible: seniority.eligible,
    seniorityReason: seniority.reason,
    seniorityBaseSalary: seniority.baseSalary,
    seniorityAmount: input.includeSeniorityPremium ? seniority.amount : 0,
    constitutionalIndemnityAmount,
    twentyDaysIndemnityAmount,
    conditionalTotal:
      (input.includeSeniorityPremium ? seniority.amount : 0) +
      constitutionalIndemnityAmount +
      twentyDaysIndemnityAmount,
    totalScenario:
      finiquitoPending +
      (input.includeSeniorityPremium ? seniority.amount : 0) +
      constitutionalIndemnityAmount +
      twentyDaysIndemnityAmount,
    minimumWageArea,
    minimumWageUsed,
    usesContractOverrides:
      input.annualBonusDays !== undefined ||
      input.vacationPremiumRate !== undefined ||
      input.lastVacationEntitlementOverride !== undefined ||
      input.currentVacationEntitlementOverride !== undefined,
    ruleSet: rules,
  };
}

export function parseAmountInput(value: string): number | null {
  const compact = value.trim().replace(/\s/g, "");
  if (!compact || !/^[\d.,]+$/.test(compact)) {
    return null;
  }
  const separators = [...compact].filter((character) => character === "," || character === ".");
  let normalized = compact;
  if (separators.length > 0) {
    const lastComma = compact.lastIndexOf(",");
    const lastDot = compact.lastIndexOf(".");
    const lastSeparator = Math.max(lastComma, lastDot);
    const fractionalDigits = compact.length - lastSeparator - 1;
    const hasBothSeparators = lastComma >= 0 && lastDot >= 0;
    const isThousandsGrouping = !hasBothSeparators && fractionalDigits === 3;
    if (!hasBothSeparators && separators.length > 1 && !isThousandsGrouping) {
      return null;
    }
    if (isThousandsGrouping) {
      normalized = compact.replace(/[.,]/g, "");
    } else {
      normalized = `${compact.slice(0, lastSeparator).replace(/[.,]/g, "")}.${compact.slice(lastSeparator + 1)}`;
    }
  }
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) {
    return null;
  }
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}

export function formatTerminationCurrency(
  value: number,
  locale = "es-MX",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatTerminationDate(
  value: string,
  locale = "es-MX",
): string {
  validateCivilDate(value, "invalid_end_date");
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function calculateSeniority(args: {
  input: TerminationCalculationInput;
  rules: TerminationRuleSet;
  yearsOfService: number;
  ordinaryDailySalary: number;
  minimumWageUsed: number;
}) {
  const { input, rules, yearsOfService, ordinaryDailySalary, minimumWageUsed } =
    args;
  if (!input.plantWorker) {
    return {
      eligible: false,
      reason: "Confirma que eras una persona trabajadora de planta.",
      baseSalary: 0,
      amount: 0,
    };
  }

  const eligible =
    input.situation === "dismissal" ||
    input.situation === "workerCause" ||
    (input.situation === "resignation" &&
      yearsOfService >= rules.seniorityVoluntaryMinimumYears);
  if (!eligible) {
    return {
      eligible: false,
      reason:
        input.situation === "resignation"
          ? `La renuncia voluntaria requiere ${rules.seniorityVoluntaryMinimumYears} años o más en este escenario.`
          : "La procedencia depende de la causa y de la documentación del caso.",
      baseSalary: 0,
      amount: 0,
    };
  }

  const baseSalary = Math.min(
    Math.max(ordinaryDailySalary, minimumWageUsed),
    minimumWageUsed * 2,
  );
  return {
    eligible: true,
    reason: "Escenario compatible con los datos declarados; requiere revisión.",
    baseSalary,
    amount: rules.seniorityPremiumDaysPerYear * yearsOfService * baseSalary,
  };
}

function resolveIntegratedSalary(args: {
  input: TerminationCalculationInput;
  ordinaryDailySalary: number;
  annualBonusDays: number;
  vacation: VacationCalculationResult;
  vacationPremiumRate: number;
  annualBonusBaseDays: number;
}): number {
  const override = args.input.integratedSalaryOverride;
  if (override !== undefined) {
    if (!Number.isFinite(override) || override <= 0) {
      throw new TerminationValidationError("salary_integrated_required");
    }
    return override;
  }

  const otherDaily = validateNonNegative(
    args.input.otherIntegratedDailyAmount ?? 0,
  );
  return (
    args.ordinaryDailySalary *
      (1 +
        args.annualBonusDays / args.annualBonusBaseDays +
        (args.vacation.currentCycleEntitlement * args.vacationPremiumRate) /
          args.annualBonusBaseDays) +
    otherDaily
  );
}

function calculateYearsOfService(vacation: VacationCalculationResult): number {
  return (
    vacation.completedYears +
    vacation.elapsedCycleDays / Math.max(1, vacation.totalCycleDays)
  );
}

function normalizeConcepts(concepts: AdditionalConcept[] | undefined) {
  return (concepts ?? []).map((concept) => ({
    name: concept.name.trim() || "Otro concepto",
    amount: validateNonNegative(concept.amount),
  }));
}

function normalizePayments(payments: ReceivedPayment[] | undefined) {
  return (payments ?? []).map((payment) => ({
    amount: validateNonNegative(payment.amount),
    ...(payment.concept?.trim() ? { concept: payment.concept.trim() } : {}),
  }));
}

function validateSalary(value: number): number {
  if (!Number.isFinite(value)) {
    throw new TerminationValidationError("invalid_number");
  }
  if (value <= 0) {
    throw new TerminationValidationError("zero_salary");
  }
  return value;
}

function validateNonNegative(value: number): number {
  if (!Number.isFinite(value)) {
    throw new TerminationValidationError("invalid_number");
  }
  if (value < 0) {
    throw new TerminationValidationError("negative_number");
  }
  return value;
}

function validateAtLeast(value: number, minimum: number): number {
  validateNonNegative(value);
  if (value < minimum) {
    throw new TerminationValidationError("contract_below_legal");
  }
  return value;
}

function validateRate(value: number, minimum: number): number {
  if (!Number.isFinite(value) || value < minimum) {
    throw new TerminationValidationError("contract_below_legal");
  }
  if (value > 10) {
    throw new TerminationValidationError("invalid_rate");
  }
  return value;
}

function validateCivilDate(
  value: string,
  code: "invalid_hire_date" | "invalid_end_date",
): void {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    throw new TerminationValidationError(code);
  }
  const date = new Date(`${value}T00:00:00Z`);
  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new TerminationValidationError(code);
  }
}

function inclusiveDays(start: string, end: string): number {
  return Math.round(
    (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) /
      86_400_000,
  ) + 1;
}

function daysInCalendarYear(date: string): number {
  const year = Number(date.slice(0, 4));
  return new Date(Date.UTC(year, 1, 29)).getUTCDate() === 29 ? 366 : 365;
}

function maxDate(first: string, second: string): string {
  return first > second ? first : second;
}
