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
  const propertyValue = normalizePositive(input.propertyValue, "El valor de la propiedad");
  const monthlyRent = normalizeNonNegative(input.monthlyRent, "La renta mensual");
  const otherMonthlyIncome = normalizeNonNegative(
    input.otherMonthlyIncome ?? 0,
    "Otros ingresos mensuales",
  );
  const vacancyPercent = normalizePercent(
    input.vacancyPercent ?? 5,
    "La vacancia",
    0,
    100,
  );
  const closingCosts = normalizeNonNegative(
    input.closingCosts ?? 0,
    "Los costos de cierre",
  );
  const initialImprovements = normalizeNonNegative(
    input.initialImprovements ?? 0,
    "La remodelacion inicial",
  );
  const annualPropertyTax = normalizeNonNegative(
    input.annualPropertyTax ?? 0,
    "El predial anual",
  );
  const annualInsurance = normalizeNonNegative(
    input.annualInsurance ?? 0,
    "El seguro anual",
  );
  const monthlyHoa = normalizeNonNegative(
    input.monthlyHoa ?? 0,
    "La cuota mensual",
  );
  const managementFee = normalizeNonNegative(
    input.managementFee ?? 0,
    "La administracion",
  );
  const maintenanceReserve = normalizeNonNegative(
    input.maintenanceReserve ?? 0,
    "La reserva de mantenimiento",
  );
  const otherAnnualOperatingExpenses = normalizeNonNegative(
    input.otherAnnualOperatingExpenses ?? 0,
    "Otros gastos operativos",
  );
  const downPayment = normalizeNonNegative(
    input.downPayment ?? 0,
    "El enganche",
  );
  const debtPayment = normalizeNonNegative(
    input.debtPayment ?? 0,
    "El pago de deuda",
  );
  const managementFeeMode = input.managementFeeMode ?? "rent-percent";
  const maintenanceReserveMode = input.maintenanceReserveMode ?? "rent-percent";
  const debtPaymentPeriod = input.debtPaymentPeriod ?? "monthly";
  const targetCapRatePercent = normalizeOptionalTargetCapRate(
    input.targetCapRatePercent,
  );

  assertExpenseMode(managementFeeMode, "El modo de administracion");
  assertExpenseMode(maintenanceReserveMode, "El modo de mantenimiento");
  assertDebtPeriod(debtPaymentPeriod);

  if (managementFeeMode === "rent-percent") {
    normalizePercent(managementFee, "La administracion", 0, 100);
  }

  if (maintenanceReserveMode === "rent-percent") {
    normalizePercent(maintenanceReserve, "La reserva de mantenimiento", 0, 100);
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
  locale = "es-MX",
): string {
  assertFiniteNumber(value, "El importe");

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactCurrency(
  value: number,
  currency = "MXN",
  locale = "es-MX",
): string {
  assertFiniteNumber(value, "El importe");

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

  assertFiniteNumber(value, "El porcentaje");

  return `${new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}%`;
}

export function roundMoney(value: number): number {
  assertFiniteNumber(value, "El importe");

  return Math.round(value * 100) / 100;
}

export function buildCopyText(result: CapRateResult): string {
  return [
    "Calculadora de cap rate - calculadoras.tools",
    `Cap rate: ${formatPercent(result.capRatePercent)}`,
    `Rendimiento bruto: ${formatPercent(result.grossYieldPercent)}`,
    `NOI anual: ${formatCurrency(result.noi)}`,
    `Flujo mensual despues de deuda: ${formatCurrency(result.cashFlowMonthly)}`,
    `Flujo anual despues de deuda: ${formatCurrency(result.cashFlowAnnual)}`,
    `Cash-on-cash: ${formatPercent(result.cashOnCashReturnPercent)}`,
    `Ingreso bruto anual: ${formatCurrency(result.grossAnnualIncome)}`,
    `Gastos operativos anuales: ${formatCurrency(result.operatingExpensesAnnual)}`,
    `Pago anual de deuda: ${formatCurrency(result.annualDebtPayment)}`,
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
      "Una propiedad suele tener gastos operativos. Agrega una estimacion para un resultado mas realista.",
    );
  }

  if (options.vacancyPercent === 0) {
    warnings.push(
      "La vacancia en cero puede ser optimista si la propiedad no esta ocupada todo el tiempo.",
    );
  }

  if (options.debtPayment > 0 && options.downPayment === 0) {
    warnings.push(
      "Si hay deuda, captura el enganche o capital inicial para interpretar mejor el cash-on-cash.",
    );
  }

  if (options.variableExpensePercent >= 1) {
    warnings.push(
      "Los gastos variables consumen todo o mas que el ingreso bruto; revisa los porcentajes.",
    );
  }

  return warnings;
}

function normalizeOptionalTargetCapRate(value: number | null | undefined): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  return normalizePositive(value, "El cap rate objetivo");
}

function normalizePositive(value: number, label: string): number {
  assertFiniteNumber(value, label);

  if (value <= 0) {
    throw new RangeError(`${label} debe ser mayor que cero.`);
  }

  return value;
}

function normalizeNonNegative(value: number, label: string): number {
  assertFiniteNumber(value, label);

  if (value < 0) {
    throw new RangeError(`${label} no puede ser negativo.`);
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
    throw new RangeError(`${label} debe estar entre ${min}% y ${max}%.`);
  }

  return value;
}

function assertExpenseMode(
  mode: string,
  label: string,
): asserts mode is ExpenseAmountMode {
  if (!EXPENSE_AMOUNT_MODES.includes(mode as ExpenseAmountMode)) {
    throw new RangeError(`${label} no es valido.`);
  }
}

function assertDebtPeriod(
  period: string,
): asserts period is DebtPaymentPeriod {
  if (!DEBT_PAYMENT_PERIODS.includes(period as DebtPaymentPeriod)) {
    throw new RangeError("El periodo de deuda no es valido.");
  }
}

function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${label} debe ser un numero valido.`);
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
