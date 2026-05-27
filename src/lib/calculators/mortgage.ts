export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface MortgageInput {
  principal: number;
  annualRate: number;
  years: number;
  extraPayment?: number;
}

export interface MortgageSummary {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  totalPrincipal: number;
  months: number;
  interestShare: number;
  principalShare: number;
}

export interface ExtraPaymentSavings {
  effectiveMonths: number;
  monthsSaved: number;
  interestWithExtra: number;
  interestSaved: number;
  totalPaidSaved: number;
}

export interface MortgageScenario {
  label: string;
  principal: number;
  annualRate: number;
  years: number;
}

export interface MortgageScenarioComparison extends MortgageScenario {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  savingsVsWorst: number;
  isBest: boolean;
}

export type ParseMortgageInputResult =
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

export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  years: number,
): number {
  const months = years * 12;

  if (principal <= 0 || months <= 0 || annualRate < 0) {
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
  years: number,
): number {
  const months = years * 12;

  if (payment <= 0 || months <= 0 || annualRate < 0) {
    return Number.NaN;
  }

  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    return payment * months;
  }

  const factor = Math.pow(1 + monthlyRate, months);

  return payment * ((factor - 1) / (monthlyRate * factor));
}

export function buildAmortizationSchedule({
  principal,
  annualRate,
  years,
  extraPayment = 0,
}: MortgageInput): AmortizationRow[] {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
  const monthlyRate = annualRate / 12 / 100;
  const maxMonths = Math.round(years * 12);
  const rows: AmortizationRow[] = [];
  let balance = principal;

  if (
    !Number.isFinite(monthlyPayment) ||
    monthlyPayment <= 0 ||
    extraPayment < 0 ||
    maxMonths <= 0
  ) {
    return rows;
  }

  for (
    let month = 1;
    month <= maxMonths && balance > balanceEpsilon;
    month += 1
  ) {
    const interest = monthlyRate > 0 ? balance * monthlyRate : 0;
    const plannedPayment = monthlyPayment + extraPayment;
    const principalPayment =
      monthlyRate > 0
        ? Math.min(Math.max(plannedPayment - interest, 0), balance)
        : Math.min(plannedPayment, balance);
    const payment = interest + principalPayment;
    const nextBalance =
      balance - principalPayment < balanceEpsilon
        ? 0
        : balance - principalPayment;

    rows.push({
      month,
      payment,
      principal: principalPayment,
      interest,
      remainingBalance: nextBalance,
    });

    balance = nextBalance;
  }

  return rows;
}

export function calculateMortgageSummary(
  schedule: AmortizationRow[],
  principal: number,
): MortgageSummary {
  const totalPaid = sumRows(schedule, "payment");
  const totalInterest = sumRows(schedule, "interest");
  const totalPrincipal = sumRows(schedule, "principal");
  const monthlyPayment = schedule[0]?.payment ?? 0;

  return {
    monthlyPayment,
    totalPaid,
    totalInterest,
    totalPrincipal:
      Math.abs(totalPrincipal - principal) < balanceEpsilon
        ? principal
        : totalPrincipal,
    months: schedule.length,
    interestShare: totalPaid > 0 ? (totalInterest / totalPaid) * 100 : 0,
    principalShare: totalPaid > 0 ? (principal / totalPaid) * 100 : 0,
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

export function compareMortgageScenarios(
  scenarios: MortgageScenario[],
): MortgageScenarioComparison[] {
  const rows = scenarios.map((scenario) => {
    const monthlyPayment = calculateMonthlyPayment(
      scenario.principal,
      scenario.annualRate,
      scenario.years,
    );
    const schedule = buildAmortizationSchedule(scenario);
    const summary = calculateMortgageSummary(schedule, scenario.principal);

    return {
      ...scenario,
      monthlyPayment,
      totalPaid: summary.totalPaid,
      totalInterest: summary.totalInterest,
      savingsVsWorst: 0,
      isBest: false,
    };
  });
  const bestTotal = Math.min(...rows.map((row) => row.totalPaid));
  const worstTotal = Math.max(...rows.map((row) => row.totalPaid));

  return rows.map((row) => ({
    ...row,
    savingsVsWorst: worstTotal - row.totalPaid,
    isBest: Math.abs(row.totalPaid - bestTotal) < 0.000001,
  }));
}

export function parseMortgageInput(
  value: string,
  options: { maxDecimals?: number; preferDecimal?: boolean } = {},
): ParseMortgageInputResult {
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
