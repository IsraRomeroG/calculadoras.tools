export const EXPENSE_AMOUNT_MODES = ["monthly", "rent-percent"] as const;
export const DEBT_PAYMENT_PERIODS = ["monthly", "annual"] as const;

export type ExpenseAmountMode = (typeof EXPENSE_AMOUNT_MODES)[number];
export type DebtPaymentPeriod = (typeof DEBT_PAYMENT_PERIODS)[number];

export interface CapRateInput {
  propertyValue: number;
  closingCosts?: number;
  initialImprovements?: number;
  monthlyRent: number;
  otherMonthlyIncome?: number;
  vacancyPercent?: number;
  annualPropertyTax?: number;
  annualInsurance?: number;
  monthlyHoa?: number;
  managementFee?: number;
  managementFeeMode?: ExpenseAmountMode;
  maintenanceReserve?: number;
  maintenanceReserveMode?: ExpenseAmountMode;
  otherAnnualOperatingExpenses?: number;
  downPayment?: number;
  debtPayment?: number;
  debtPaymentPeriod?: DebtPaymentPeriod;
  targetCapRatePercent?: number | null;
}

export interface CapRateResult {
  propertyValue: number;
  grossAnnualIncome: number;
  vacancyLoss: number;
  effectiveIncome: number;
  variableExpensePercent: number;
  variableAnnualExpenses: number;
  fixedAnnualOperatingExpenses: number;
  operatingExpensesAnnual: number;
  noi: number;
  capRatePercent: number;
  grossYieldPercent: number;
  annualDebtPayment: number;
  cashFlowAnnual: number;
  cashFlowMonthly: number;
  initialCapital: number;
  cashOnCashReturnPercent: number | null;
  breakEvenMonthlyRent: number | null;
  maxPriceForTargetCapRate: number | null;
  maxVacancyBeforeNoiZeroPercent: number | null;
  grossToCapRateSpreadPercent: number;
  warnings: string[];
}

export function calculateCapRate(input: CapRateInput): CapRateResult {
  const propertyValue = normalizePositive(input.propertyValue, "The property value");
  const monthlyRent = normalizeNonNegative(input.monthlyRent, "The monthly rent");
  const otherMonthlyIncome = normalizeNonNegative(
    input.otherMonthlyIncome ?? 0,
    "Other monthly income",
  );
  const vacancyPercent = normalizePercent(
    input.vacancyPercent ?? 5,
    "The vacancy rate",
    0,
    100,
  );
  const closingCosts = normalizeNonNegative(
    input.closingCosts ?? 0,
    "The closing costs",
  );
  const initialImprovements = normalizeNonNegative(
    input.initialImprovements ?? 0,
    "The initial renovation",
  );
  const annualPropertyTax = normalizeNonNegative(
    input.annualPropertyTax ?? 0,
    "The annual property tax",
  );
  const annualInsurance = normalizeNonNegative(
    input.annualInsurance ?? 0,
    "The annual insurance",
  );
  const monthlyHoa = normalizeNonNegative(
    input.monthlyHoa ?? 0,
    "The monthly HOA fee",
  );
  const managementFee = normalizeNonNegative(
    input.managementFee ?? 0,
    "The management fee",
  );
  const maintenanceReserve = normalizeNonNegative(
    input.maintenanceReserve ?? 0,
    "The maintenance reserve",
  );
  const otherAnnualOperatingExpenses = normalizeNonNegative(
    input.otherAnnualOperatingExpenses ?? 0,
    "Other operating expenses",
  );
  const downPayment = normalizeNonNegative(
    input.downPayment ?? 0,
    "The down payment",
  );
  const debtPayment = normalizeNonNegative(
    input.debtPayment ?? 0,
    "The debt payment",
  );
  const managementFeeMode = input.managementFeeMode ?? "rent-percent";
  const maintenanceReserveMode = input.maintenanceReserveMode ?? "rent-percent";
  const debtPaymentPeriod = input.debtPaymentPeriod ?? "monthly";
  const targetCapRatePercent = normalizeOptionalTargetCapRate(
    input.targetCapRatePercent,
  );

  assertExpenseMode(managementFeeMode, "The management mode");
  assertExpenseMode(maintenanceReserveMode, "The maintenance mode");
  assertDebtPeriod(debtPaymentPeriod);

  if (managementFeeMode === "rent-percent") {
    normalizePercent(managementFee, "The management fee", 0, 100);
  }

  if (maintenanceReserveMode === "rent-percent") {
    normalizePercent(maintenanceReserve, "The maintenance reserve", 0, 100);
  }

  const grossAnnualIncome = (monthlyRent + otherMonthlyIncome) * 12;
  const vacancyLoss = grossAnnualIncome * (vacancyPercent / 100);
  const effectiveIncome = grossAnnualIncome - vacancyLoss;
  const variableExpensePercent =
    (managementFeeMode === "rent-percent" ? managementFee / 100 : 0) +
    (maintenanceReserveMode === "rent-percent" ? maintenanceReserve / 100 : 0);
  const variableAnnualExpenses = grossAnnualIncome * variableExpensePercent;
  const fixedAnnualOperatingExpenses =
    annualPropertyTax +
    annualInsurance +
    monthlyHoa * 12 +
    (managementFeeMode === "monthly" ? managementFee * 12 : 0) +
    (maintenanceReserveMode === "monthly" ? maintenanceReserve * 12 : 0) +
    otherAnnualOperatingExpenses;
  const operatingExpensesAnnual =
    fixedAnnualOperatingExpenses + variableAnnualExpenses;
  const noi = effectiveIncome - operatingExpensesAnnual;
  const capRatePercent = (noi / propertyValue) * 100;
  const grossYieldPercent = (grossAnnualIncome / propertyValue) * 100;
  const annualDebtPayment =
    debtPaymentPeriod === "monthly" ? debtPayment * 12 : debtPayment;
  const cashFlowAnnual = noi - annualDebtPayment;
  const cashFlowMonthly = cashFlowAnnual / 12;
  const initialCapital =
    (downPayment > 0 ? downPayment : propertyValue) +
    closingCosts +
    initialImprovements;
  const cashOnCashReturnPercent =
    initialCapital > 0 ? (cashFlowAnnual / initialCapital) * 100 : null;
  const breakEvenMonthlyRent = calculateBreakEvenMonthlyRent({
    fixedAnnualOperatingExpenses,
    annualDebtPayment,
    vacancyPercent,
    variableExpensePercent,
    otherMonthlyIncome,
  });
  const maxPriceForTargetCapRate =
    targetCapRatePercent && noi > 0
      ? noi / (targetCapRatePercent / 100)
      : null;
  const maxVacancyBeforeNoiZeroPercent =
    grossAnnualIncome > 0
      ? 100 *
        (1 -
          variableExpensePercent -
          fixedAnnualOperatingExpenses / grossAnnualIncome)
      : null;

  return {
    propertyValue,
    grossAnnualIncome,
    vacancyLoss,
    effectiveIncome,
    variableExpensePercent,
    variableAnnualExpenses,
    fixedAnnualOperatingExpenses,
    operatingExpensesAnnual,
    noi,
    capRatePercent,
    grossYieldPercent,
    annualDebtPayment,
    cashFlowAnnual,
    cashFlowMonthly,
    initialCapital,
    cashOnCashReturnPercent,
    breakEvenMonthlyRent,
    maxPriceForTargetCapRate,
    maxVacancyBeforeNoiZeroPercent,
    grossToCapRateSpreadPercent: grossYieldPercent - capRatePercent,
    warnings: buildWarnings({
      operatingExpensesAnnual,
      vacancyPercent,
      debtPayment,
      downPayment,
      variableExpensePercent,
    }),
  };
}

export function parseLocalizedNumber(value: string): number | null {
  const cleaned = value
    .trim()
    .replace(/\s+/g, "")
    .replace(/MXN|USD|EUR/gi, "")
    .replace(/\$/g, "");

  if (!cleaned || !/^[+-]?\d[\d.,]*$/.test(cleaned)) {
    return null;
  }

  const sign = cleaned.startsWith("-") ? "-" : "";
  const unsigned = cleaned.replace(/^[+-]/, "");
  const normalized = normalizeSeparators(unsigned);

  if (!/^\d+(?:\.\d+)?$/.test(normalized)) {
    return null;
  }

  const parsed = Number(`${sign}${normalized}`);

  return Number.isFinite(parsed) ? parsed : null;
}

export function formatCurrency(
  value: number,
  currency = "MXN",
  locale = "en-US",
): string {
  assertFiniteNumber(value, "The amount");

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactCurrency(
  value: number,
  currency = "MXN",
  locale = "en-US",
): string {
  assertFiniteNumber(value, "The amount");

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number | null): string {
  if (value === null) {
    return "-";
  }

  assertFiniteNumber(value, "The percentage");

  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}%`;
}

export function roundMoney(value: number): number {
  assertFiniteNumber(value, "The amount");

  return Math.round(value * 100) / 100;
}

export function buildCopyText(result: CapRateResult): string {
  return [
    "Cap rate calculator - calculadoras.tools",
    `Cap rate: ${formatPercent(result.capRatePercent)}`,
    `Gross yield: ${formatPercent(result.grossYieldPercent)}`,
    `Annual NOI: ${formatCurrency(result.noi)}`,
    `Monthly cash flow after debt: ${formatCurrency(result.cashFlowMonthly)}`,
    `Annual cash flow after debt: ${formatCurrency(result.cashFlowAnnual)}`,
    `Cash-on-cash: ${formatPercent(result.cashOnCashReturnPercent)}`,
    `Annual gross income: ${formatCurrency(result.grossAnnualIncome)}`,
    `Annual operating expenses: ${formatCurrency(result.operatingExpensesAnnual)}`,
    `Annual debt payment: ${formatCurrency(result.annualDebtPayment)}`,
  ].join("\n");
}

function calculateBreakEvenMonthlyRent(options: {
  fixedAnnualOperatingExpenses: number;
  annualDebtPayment: number;
  vacancyPercent: number;
  variableExpensePercent: number;
  otherMonthlyIncome: number;
}): number | null {
  const factorIncomeNet =
    1 - options.vacancyPercent / 100 - options.variableExpensePercent;

  if (factorIncomeNet <= 0) {
    return null;
  }

  const grossMonthlyBreakEven =
    (options.fixedAnnualOperatingExpenses + options.annualDebtPayment) /
    (12 * factorIncomeNet);

  return grossMonthlyBreakEven - options.otherMonthlyIncome;
}

function buildWarnings(options: {
  operatingExpensesAnnual: number;
  vacancyPercent: number;
  debtPayment: number;
  downPayment: number;
  variableExpensePercent: number;
}): string[] {
  const warnings: string[] = [];

  if (options.operatingExpensesAnnual === 0) {
    warnings.push(
      "A property usually has operating expenses. Add an estimate for a more realistic result.",
    );
  }

  if (options.vacancyPercent === 0) {
    warnings.push(
      "A zero vacancy rate may be optimistic if the property is not occupied all the time.",
    );
  }

  if (options.debtPayment > 0 && options.downPayment === 0) {
    warnings.push(
      "If there is debt, enter the down payment or initial equity to interpret cash-on-cash return.",
    );
  }

  if (options.variableExpensePercent >= 1) {
    warnings.push(
      "Variable expenses consume all or more of gross income; review the percentages.",
    );
  }

  return warnings;
}

function normalizeOptionalTargetCapRate(value: number | null | undefined): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  return normalizePositive(value, "The target cap rate");
}

function normalizePositive(value: number, label: string): number {
  assertFiniteNumber(value, label);

  if (value <= 0) {
    throw new RangeError(`${label} must be greater than zero.`);
  }

  return value;
}

function normalizeNonNegative(value: number, label: string): number {
  assertFiniteNumber(value, label);

  if (value < 0) {
    throw new RangeError(`${label} cannot be negative.`);
  }

  return value;
}

function normalizePercent(
  value: number,
  label: string,
  min: number,
  max: number,
): number {
  assertFiniteNumber(value, label);

  if (value < min || value > max) {
    throw new RangeError(`${label} must be between ${min}% and ${max}%.`);
  }

  return value;
}

function assertExpenseMode(
  mode: string,
  label: string,
): asserts mode is ExpenseAmountMode {
  if (!EXPENSE_AMOUNT_MODES.includes(mode as ExpenseAmountMode)) {
    throw new RangeError(`${label} is not valid.`);
  }
}

function assertDebtPeriod(
  period: string,
): asserts period is DebtPaymentPeriod {
  if (!DEBT_PAYMENT_PERIODS.includes(period as DebtPaymentPeriod)) {
    throw new RangeError("The debt payment period is invalid.");
  }
}

function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${label} must be a valid number.`);
  }
}

function normalizeSeparators(value: string): string {
  const commaCount = countOccurrences(value, ",");
  const dotCount = countOccurrences(value, ".");

  if (commaCount > 0 && dotCount > 0) {
    const decimalSeparator =
      value.lastIndexOf(",") > value.lastIndexOf(".") ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";

    return value
      .replaceAll(thousandsSeparator, "")
      .replace(decimalSeparator, ".");
  }

  if (commaCount > 0) {
    return normalizeSingleSeparator(value, ",");
  }

  if (dotCount > 0) {
    return normalizeSingleSeparator(value, ".");
  }

  return value;
}

function normalizeSingleSeparator(value: string, separator: "," | "."): string {
  if (countOccurrences(value, separator) > 1) {
    return value.replaceAll(separator, "");
  }

  const [integerPart, fractionalPart] = value.split(separator);

  if (!fractionalPart) {
    return integerPart;
  }

  const looksLikeThousands =
    integerPart.length <= 3 &&
    fractionalPart.length === 3 &&
    /^\d{1,3}$/.test(integerPart);

  return looksLikeThousands
    ? `${integerPart}${fractionalPart}`
    : `${integerPart}.${fractionalPart}`;
}

function countOccurrences(value: string, character: string): number {
  return value.split(character).length - 1;
}
