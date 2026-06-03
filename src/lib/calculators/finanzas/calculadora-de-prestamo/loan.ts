export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  insurance: number;
  remainingBalance: number;
}

export interface LoanInput {
  principal: number;
  annualRate: number;
  months: number;
  extraPayment?: number;
  monthlyInsurance?: number;
}

export interface LoanSummary {
  monthlyPayment: number;
  totalMonthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  totalInsurance: number;
  openingFee: number;
  totalCost: number;
  months: number;
  approximateCat: number | null;
}

export interface LoanScenario {
  label: string;
  principal: number;
  annualRate: number;
  months: number;
  openingFeePercent: number;
}

export interface LoanScenarioComparison extends LoanScenario {
  monthlyPayment: number;
  openingFee: number;
  totalInterest: number;
  totalCost: number;
  approximateCat: number | null;
  isBest: boolean;
}

export interface LoanTypeOption {
  value: string;
  label: string;
  suggestedAnnualRate: number;
  suggestedMonths: number;
  referenceRate: string;
  typicalTerm: string;
}

export interface ExtraPaymentSavings {
  effectiveMonths: number;
  monthsSaved: number;
  interestWithExtra: number;
  interestSaved: number;
  totalPaidSaved: number;
}

export type ParseLoanInputResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

const moneyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 2,
});

const balanceEpsilon = 0.005;

export const LOAN_TYPES: LoanTypeOption[] = [
  {
    value: "personal-bank",
    label: "Crédito personal banco",
    suggestedAnnualRate: 24,
    suggestedMonths: 24,
    referenceRate: "18%-36%",
    typicalTerm: "12-48 meses",
  },
  {
    value: "payroll",
    label: "Préstamo de nómina",
    suggestedAnnualRate: 18,
    suggestedMonths: 18,
    referenceRate: "12%-24%",
    typicalTerm: "6-36 meses",
  },
  {
    value: "auto",
    label: "Financiamiento de auto",
    suggestedAnnualRate: 12,
    suggestedMonths: 48,
    referenceRate: "8%-16%",
    typicalTerm: "24-60 meses",
  },
  {
    value: "credit-card",
    label: "Tarjeta de crédito",
    suggestedAnnualRate: 48,
    suggestedMonths: 12,
    referenceRate: "36%-60%",
    typicalTerm: "1-36 meses",
  },
  {
    value: "private",
    label: "Crédito entre particulares",
    suggestedAnnualRate: 8,
    suggestedMonths: 12,
    referenceRate: "0%-12%",
    typicalTerm: "1-24 meses",
  },
  {
    value: "microcredit",
    label: "Microcrédito / fintech",
    suggestedAnnualRate: 60,
    suggestedMonths: 6,
    referenceRate: "40%-120%",
    typicalTerm: "1-12 meses",
  },
];

export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  months: number,
): number {
  if (principal <= 0 || months <= 0) {
    return Number.NaN;
  }

  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    return principal / months;
  }

  const factor = Math.pow(1 + monthlyRate, months);

  return (principal * monthlyRate * factor) / (factor - 1);
}

export function calculateLoanAmountFromPayment(
  payment: number,
  annualRate: number,
  months: number,
): number {
  if (payment <= 0 || months <= 0) {
    return Number.NaN;
  }

  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    return payment * months;
  }

  const factor = Math.pow(1 + monthlyRate, months);

  return payment * ((factor - 1) / (monthlyRate * factor));
}

export function calculatePayoffMonths(
  principal: number,
  annualRate: number,
  payment: number,
): number {
  if (principal <= 0 || payment <= 0) {
    return Number.NaN;
  }

  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    return principal / payment;
  }

  if (payment <= principal * monthlyRate) {
    return Number.POSITIVE_INFINITY;
  }

  return (
    -Math.log(1 - (principal * monthlyRate) / payment) /
    Math.log(1 + monthlyRate)
  );
}

export function buildAmortizationSchedule({
  principal,
  annualRate,
  months,
  extraPayment = 0,
  monthlyInsurance = 0,
}: LoanInput): AmortizationRow[] {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, months);
  const monthlyRate = annualRate / 12 / 100;
  const rows: AmortizationRow[] = [];
  let balance = principal;

  if (!Number.isFinite(monthlyPayment) || monthlyPayment <= 0) {
    return rows;
  }

  for (let month = 1; month <= months && balance > balanceEpsilon; month += 1) {
    const interest = monthlyRate > 0 ? balance * monthlyRate : 0;
    const plannedPrincipalAndInterest = monthlyPayment + extraPayment;
    const principalPayment =
      monthlyRate > 0
        ? Math.min(
            Math.max(plannedPrincipalAndInterest - interest, 0),
            balance,
          )
        : Math.min(plannedPrincipalAndInterest, balance);
    const principalAndInterestPayment = interest + principalPayment;
    const nextBalance =
      balance - principalPayment < balanceEpsilon
        ? 0
        : balance - principalPayment;

    rows.push({
      month,
      payment: principalAndInterestPayment + monthlyInsurance,
      principal: principalPayment,
      interest,
      insurance: monthlyInsurance,
      remainingBalance: nextBalance,
    });

    balance = nextBalance;
  }

  return rows;
}

export function calculateLoanSummary({
  schedule,
  principal,
  monthlyPayment,
  openingFee = 0,
  monthlyInsurance = 0,
  extraPayment = 0,
}: {
  schedule: AmortizationRow[];
  principal: number;
  monthlyPayment: number;
  openingFee?: number;
  monthlyInsurance?: number;
  extraPayment?: number;
}): LoanSummary {
  const totalPaid = schedule.reduce((total, row) => total + row.payment, 0);
  const totalInterest = schedule.reduce((total, row) => total + row.interest, 0);
  const totalInsurance = schedule.reduce(
    (total, row) => total + row.insurance,
    0,
  );
  const totalCost = totalPaid + openingFee;

  return {
    monthlyPayment,
    totalMonthlyPayment: monthlyPayment + monthlyInsurance + extraPayment,
    totalPaid,
    totalInterest,
    totalInsurance,
    openingFee,
    totalCost,
    months: schedule.length,
    approximateCat: calculateApproximateCat({
      principal,
      openingFee,
      schedule,
    }),
  };
}

export function calculateExtraPaymentSavings(
  baseSchedule: AmortizationRow[],
  extraSchedule: AmortizationRow[],
): ExtraPaymentSavings {
  const baseInterest = sumRows(baseSchedule, "interest");
  const extraInterest = sumRows(extraSchedule, "interest");
  const basePaid = sumRows(baseSchedule, "payment");
  const extraPaid = sumRows(extraSchedule, "payment");

  return {
    effectiveMonths: extraSchedule.length,
    monthsSaved: Math.max(baseSchedule.length - extraSchedule.length, 0),
    interestWithExtra: extraInterest,
    interestSaved: baseInterest - extraInterest,
    totalPaidSaved: basePaid - extraPaid,
  };
}

export function calculateApproximateCat({
  principal,
  openingFee = 0,
  schedule,
}: {
  principal: number;
  openingFee?: number;
  schedule: AmortizationRow[];
}): number | null {
  const netReceived = principal - openingFee;

  if (netReceived <= 0 || schedule.length === 0) {
    return null;
  }

  const payments = schedule.map((row) => row.payment);
  const presentValueAtZero = payments.reduce((total, payment) => total + payment, 0);

  if (Math.abs(presentValueAtZero - netReceived) < 0.000001) {
    return 0;
  }

  if (presentValueAtZero < netReceived) {
    return null;
  }

  let low = 0;
  let high = 1;

  while (presentValue(payments, high) > netReceived && high < 100) {
    high *= 2;
  }

  if (high >= 100 && presentValue(payments, high) > netReceived) {
    return null;
  }

  for (let iteration = 0; iteration < 120; iteration += 1) {
    const mid = (low + high) / 2;
    const currentValue = presentValue(payments, mid);

    if (Math.abs(currentValue - netReceived) < 0.000001) {
      low = mid;
      high = mid;
      break;
    }

    if (currentValue > netReceived) {
      low = mid;
    } else {
      high = mid;
    }
  }

  const monthlyIrr = (low + high) / 2;
  const annualized = (Math.pow(1 + monthlyIrr, 12) - 1) * 100;

  return Number.isFinite(annualized) ? annualized : null;
}

export function compareLoanScenarios(
  scenarios: LoanScenario[],
): LoanScenarioComparison[] {
  const rows = scenarios.map((scenario) => {
    const openingFee = scenario.principal * (scenario.openingFeePercent / 100);
    const monthlyPayment = calculateMonthlyPayment(
      scenario.principal,
      scenario.annualRate,
      scenario.months,
    );
    const schedule = buildAmortizationSchedule(scenario);
    const summary = calculateLoanSummary({
      schedule,
      principal: scenario.principal,
      monthlyPayment,
      openingFee,
    });

    return {
      ...scenario,
      monthlyPayment,
      openingFee,
      totalInterest: summary.totalInterest,
      totalCost: summary.totalCost,
      approximateCat: summary.approximateCat,
      isBest: false,
    };
  });
  const bestCost = Math.min(...rows.map((row) => row.totalCost));

  return rows.map((row) => ({
    ...row,
    isBest: Math.abs(row.totalCost - bestCost) < 0.000001,
  }));
}

export function parseLoanInput(
  value: string,
  options: { maxDecimals?: number; preferDecimal?: boolean } = {},
): ParseLoanInputResult {
  const trimmed = value.trim();
  const maxDecimals = options.maxDecimals ?? 2;
  const preferDecimal = options.preferDecimal ?? false;

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  if (/[-\u2212]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const cleaned = removeKnownAffixes(trimmed);

  if (!cleaned || /[^0-9.,]/.test(cleaned)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeSeparators(cleaned, preferDecimal);

  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const decimalPart = normalized.split(".")[1];

  if (decimalPart && decimalPart.length > maxDecimals) {
    return { ok: false, error: "too_many_decimals" };
  }

  const numericValue = Number(normalized);

  if (!Number.isFinite(numericValue)) {
    return { ok: false, error: "invalid" };
  }

  return {
    ok: true,
    value: numericValue,
    normalized,
  };
}

export function formatCurrency(value: number): string {
  return moneyFormatter.format(roundCurrency(value));
}

export function formatPercent(value: number): string {
  return `${percentFormatter.format(roundCurrency(value))}%`;
}

export function formatDuration(months: number): string {
  if (!Number.isFinite(months)) {
    return "No alcanzable";
  }

  const roundedMonths = Math.max(Math.round(months), 0);
  const years = Math.floor(roundedMonths / 12);
  const remainingMonths = roundedMonths % 12;
  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "año" : "años"}`);
  }

  if (remainingMonths > 0 || parts.length === 0) {
    parts.push(
      `${remainingMonths} ${remainingMonths === 1 ? "mes" : "meses"}`,
    );
  }

  return parts.join(" ");
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function sumRows(rows: AmortizationRow[], key: keyof AmortizationRow): number {
  return rows.reduce((total, row) => total + row[key], 0);
}

function presentValue(payments: number[], monthlyRate: number): number {
  return payments.reduce(
    (total, payment, index) =>
      total + payment / Math.pow(1 + monthlyRate, index + 1),
    0,
  );
}

function removeKnownAffixes(value: string): string {
  return value
    .replace(/\b(MXN|USD|EUR|ARS|COP|CLP|PEN|GTQ|CRC|UYU)\b/gi, "")
    .replace(/S\/|[$%\s]/gi, "");
}

function normalizeSeparators(value: string, preferDecimal: boolean): string {
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
    return normalizeSingleSeparator(value, ",", preferDecimal);
  }

  if (lastDot !== -1) {
    return normalizeSingleSeparator(value, ".", preferDecimal);
  }

  return value;
}

function normalizeSingleSeparator(
  value: string,
  separator: "," | ".",
  preferDecimal: boolean,
): string {
  const parts = value.split(separator);

  if (parts.length === 2) {
    const [integerPart, fractionalOrGroup] = parts;

    if (!integerPart || !fractionalOrGroup) {
      return value;
    }

    if (
      !preferDecimal &&
      separator === "," &&
      fractionalOrGroup.length === 3 &&
      integerPart.length <= 3
    ) {
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
