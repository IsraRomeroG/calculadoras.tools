export type SalaryBasis = "period" | "monthly" | "annual";
export type SalaryFrequency = "weekly" | "biweekly" | "monthly" | "annual";

export interface TaxBracket {
  lowerBound: number;
  upperBound?: number;
  fixedAmount: number;
  marginalRate: number;
}

export interface FrequencyRule {
  id: SalaryFrequency;
  label: string;
  days: number;
  periodsPerYear: number;
  tableKey: string;
}

export interface SalaryInput {
  gross: number;
  salaryBasis: SalaryBasis;
  frequency: SalaryFrequency;
  taxableBonus?: number;
  uniqueBonus?: number;
  taxableBenefits?: number;
  exemptBenefits?: number;
  preTaxDeductions?: number;
  employeeContributions?: number;
  postTaxDeductions?: number;
}

export interface TaxCalculation {
  taxableBase: number;
  taxBeforeCredits: number;
  marginalRate: number;
  bracket: TaxBracket | null;
}

export interface SalaryBreakdownRow {
  id: string;
  label: string;
  value: number;
  tone?: "income" | "tax" | "credit" | "deduction" | "info";
  note?: string;
}

export interface SalaryResult {
  status: "partial" | "manual";
  coverage: "isr-only" | "manual-contributions";
  currency: string;
  locale: string;
  frequency: FrequencyRule;
  salaryBasis: SalaryBasis;
  grossCashPeriod: number;
  taxableBase: number;
  taxBeforeCredits: number;
  taxCredit: number;
  tax: number;
  employeeContributions: number;
  employerContributions: number;
  preTaxDeductions: number;
  postTaxDeductions: number;
  netPeriod: number;
  monthlyEquivalent: number;
  annualGrossProjection: number;
  annualTaxProjection: number;
  annualNetProjection: number;
  effectiveTaxRate: number;
  totalEmployeeBurdenRate: number;
  marginalRate: number;
  breakdown: SalaryBreakdownRow[];
  warnings: string[];
}

export interface SalaryPreset {
  countryCode: string;
  country: string;
  jurisdiction: string;
  regime: string;
  period: string;
  currency: string;
  locale: string;
  effectiveFrom: string;
  sourceName: string;
  sourceUrl: string;
  reviewedAt: string;
  status: "current" | "historical" | "expired" | "draft";
  frequencies: FrequencyRule[];
  employeeContributionsIncluded: boolean;
  employeeContributionNote: string;
  subsidyThresholdMonthly: number;
  subsidyMaximumMonthly: number;
  taxTables: Record<string, TaxBracket[]>;
}

export const MEXICO_FREQUENCIES: FrequencyRule[] = [
  {
    id: "weekly",
    label: "Semanal (7 días)",
    days: 7,
    periodsPerYear: 52,
    tableKey: "weekly",
  },
  {
    id: "biweekly",
    label: "Quincenal (15 días)",
    days: 15,
    periodsPerYear: 24,
    tableKey: "biweekly",
  },
  {
    id: "monthly",
    label: "Mensual",
    days: 30.4,
    periodsPerYear: 12,
    tableKey: "monthly",
  },
  {
    id: "annual",
    label: "Anual",
    days: 365,
    periodsPerYear: 1,
    tableKey: "annual",
  },
];

const WEEKLY_TAX_BRACKETS: TaxBracket[] = [
  { lowerBound: 0.01, upperBound: 194.46, fixedAmount: 0, marginalRate: 1.92 },
  { lowerBound: 194.47, upperBound: 1650.67, fixedAmount: 3.71, marginalRate: 6.4 },
  { lowerBound: 1650.68, upperBound: 2900.87, fixedAmount: 96.95, marginalRate: 10.88 },
  { lowerBound: 2900.88, upperBound: 3372.11, fixedAmount: 232.96, marginalRate: 16 },
  { lowerBound: 3372.12, upperBound: 4037.32, fixedAmount: 308.35, marginalRate: 17.92 },
  { lowerBound: 4037.33, upperBound: 8142.75, fixedAmount: 427.56, marginalRate: 21.36 },
  { lowerBound: 8142.76, upperBound: 12834.08, fixedAmount: 1304.45, marginalRate: 23.52 },
  { lowerBound: 12834.09, upperBound: 24502.45, fixedAmount: 2407.86, marginalRate: 30 },
  { lowerBound: 24502.46, upperBound: 32669.91, fixedAmount: 5908.35, marginalRate: 32 },
  { lowerBound: 32669.92, upperBound: 98009.66, fixedAmount: 8521.94, marginalRate: 34 },
  { lowerBound: 98009.67, fixedAmount: 30737.49, marginalRate: 35 },
];

const BIWEEKLY_TAX_BRACKETS: TaxBracket[] = [
  { lowerBound: 0.01, upperBound: 416.7, fixedAmount: 0, marginalRate: 1.92 },
  { lowerBound: 416.71, upperBound: 3537.15, fixedAmount: 7.95, marginalRate: 6.4 },
  { lowerBound: 3537.16, upperBound: 6216.15, fixedAmount: 207.75, marginalRate: 10.88 },
  { lowerBound: 6216.16, upperBound: 7225.95, fixedAmount: 499.2, marginalRate: 16 },
  { lowerBound: 7225.96, upperBound: 8651.4, fixedAmount: 660.75, marginalRate: 17.92 },
  { lowerBound: 8651.41, upperBound: 17448.75, fixedAmount: 916.2, marginalRate: 21.36 },
  { lowerBound: 17448.76, upperBound: 27501.6, fixedAmount: 2795.25, marginalRate: 23.52 },
  { lowerBound: 27501.61, upperBound: 52505.25, fixedAmount: 5159.7, marginalRate: 30 },
  { lowerBound: 52505.26, upperBound: 70006.95, fixedAmount: 12660.75, marginalRate: 32 },
  { lowerBound: 70006.96, upperBound: 210020.7, fixedAmount: 18261.3, marginalRate: 34 },
  { lowerBound: 210020.71, fixedAmount: 65866.05, marginalRate: 35 },
];

const MONTHLY_TAX_BRACKETS: TaxBracket[] = [
  { lowerBound: 0.01, upperBound: 844.59, fixedAmount: 0, marginalRate: 1.92 },
  { lowerBound: 844.6, upperBound: 7168.51, fixedAmount: 16.22, marginalRate: 6.4 },
  { lowerBound: 7168.52, upperBound: 12598.02, fixedAmount: 420.95, marginalRate: 10.88 },
  { lowerBound: 12598.03, upperBound: 14644.64, fixedAmount: 1011.68, marginalRate: 16 },
  { lowerBound: 14644.65, upperBound: 17533.64, fixedAmount: 1339.14, marginalRate: 17.92 },
  { lowerBound: 17533.65, upperBound: 35362.83, fixedAmount: 1856.84, marginalRate: 21.36 },
  { lowerBound: 35362.84, upperBound: 55736.68, fixedAmount: 5665.16, marginalRate: 23.52 },
  { lowerBound: 55736.69, upperBound: 106410.5, fixedAmount: 10457.09, marginalRate: 30 },
  { lowerBound: 106410.51, upperBound: 141880.66, fixedAmount: 25659.23, marginalRate: 32 },
  { lowerBound: 141880.67, upperBound: 425641.99, fixedAmount: 37009.69, marginalRate: 34 },
  { lowerBound: 425642, fixedAmount: 133488.54, marginalRate: 35 },
];

const ANNUAL_TAX_BRACKETS: TaxBracket[] = [
  { lowerBound: 0.01, upperBound: 10135.11, fixedAmount: 0, marginalRate: 1.92 },
  { lowerBound: 10135.12, upperBound: 86022.11, fixedAmount: 194.59, marginalRate: 6.4 },
  { lowerBound: 86022.12, upperBound: 151176.19, fixedAmount: 5051.37, marginalRate: 10.88 },
  { lowerBound: 151176.2, upperBound: 175735.66, fixedAmount: 12140.13, marginalRate: 16 },
  { lowerBound: 175735.67, upperBound: 210403.69, fixedAmount: 16069.64, marginalRate: 17.92 },
  { lowerBound: 210403.7, upperBound: 424353.97, fixedAmount: 22282.14, marginalRate: 21.36 },
  { lowerBound: 424353.98, upperBound: 668840.14, fixedAmount: 67981.92, marginalRate: 23.52 },
  { lowerBound: 668840.15, upperBound: 1276925.98, fixedAmount: 125485.07, marginalRate: 30 },
  { lowerBound: 1276925.99, upperBound: 1702567.97, fixedAmount: 307910.81, marginalRate: 32 },
  { lowerBound: 1702567.98, upperBound: 5107703.92, fixedAmount: 444116.23, marginalRate: 34 },
  { lowerBound: 5107703.93, fixedAmount: 1601862.46, marginalRate: 35 },
];

export const MEXICO_SALARY_PRESET: SalaryPreset = {
  countryCode: "MX",
  country: "México",
  jurisdiction: "Federal",
  regime: "Sueldos y salarios",
  period: "2026",
  currency: "MXN",
  locale: "es-MX",
  effectiveFrom: "2026-01-01",
  sourceName: "SAT / Anexo 8 RMF 2026",
  sourceUrl:
    "https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-8-RMF-2026_DOF-28122025.pdf",
  reviewedAt: "2026-07-21",
  status: "current",
  frequencies: MEXICO_FREQUENCIES,
  employeeContributionsIncluded: false,
  employeeContributionNote:
    "El preset no calcula automáticamente IMSS, INFONAVIT ni otras cuotas sociales. Captura las aportaciones del trabajador de tu nómina para una estimación más completa.",
  subsidyThresholdMonthly: 11492.66,
  subsidyMaximumMonthly: 535.65,
  taxTables: {
    weekly: WEEKLY_TAX_BRACKETS,
    biweekly: BIWEEKLY_TAX_BRACKETS,
    monthly: MONTHLY_TAX_BRACKETS,
    annual: ANNUAL_TAX_BRACKETS,
  },
};

export function calculateProgressiveTax(
  taxableBase: number,
  brackets: TaxBracket[],
): TaxCalculation {
  const normalizedBase = Math.max(0, taxableBase);

  if (normalizedBase === 0) {
    return {
      taxableBase: 0,
      taxBeforeCredits: 0,
      marginalRate: 0,
      bracket: null,
    };
  }

  const bracket = brackets.find(
    (item) =>
      normalizedBase >= item.lowerBound &&
      (item.upperBound === undefined || normalizedBase <= item.upperBound),
  );

  if (!bracket) {
    throw new RangeError("La base gravable no coincide con ningún tramo fiscal.");
  }

  const tax =
    bracket.fixedAmount +
    (normalizedBase - bracket.lowerBound) * (bracket.marginalRate / 100);

  return {
    taxableBase: normalizedBase,
    taxBeforeCredits: Math.max(0, tax),
    marginalRate: bracket.marginalRate,
    bracket,
  };
}

export function getFrequencyRule(frequency: SalaryFrequency): FrequencyRule {
  const rule = MEXICO_FREQUENCIES.find((item) => item.id === frequency);

  if (!rule) {
    throw new RangeError("Frecuencia de pago no compatible.");
  }

  return rule;
}

export function calculateMexicoTax(
  taxableBase: number,
  frequency: SalaryFrequency,
): TaxCalculation {
  const rule = getFrequencyRule(frequency);
  return calculateProgressiveTax(
    taxableBase,
    MEXICO_SALARY_PRESET.taxTables[rule.tableKey],
  );
}

function normalizeOptional(value: number | undefined): number {
  return value ?? 0;
}

function assertValidInput(input: SalaryInput): void {
  const values = [
    input.gross,
    input.taxableBonus,
    input.uniqueBonus,
    input.taxableBenefits,
    input.exemptBenefits,
    input.preTaxDeductions,
    input.employeeContributions,
    input.postTaxDeductions,
  ];

  if (!Number.isFinite(input.gross) || input.gross <= 0) {
    throw new RangeError("El salario bruto debe ser mayor que cero.");
  }

  if (values.some((value) => value !== undefined && (!Number.isFinite(value) || value < 0))) {
    throw new RangeError("Los importes no pueden ser negativos ni inválidos.");
  }
}

function getAnnualBase(gross: number, basis: SalaryBasis, frequency: FrequencyRule): number {
  if (basis === "annual") {
    return gross;
  }

  if (basis === "monthly") {
    return gross * 12;
  }

  return gross * frequency.periodsPerYear;
}

function getMonthlyEquivalent(
  amount: number,
  frequency: FrequencyRule,
): number {
  if (frequency.id === "monthly") {
    return amount;
  }

  if (frequency.id === "annual") {
    return amount / 12;
  }

  return (amount * 30.4) / frequency.days;
}

function calculateMexicoSubsidy(
  taxableBase: number,
  frequency: FrequencyRule,
): number {
  if (frequency.id === "annual") {
    return 0;
  }

  const monthlyEquivalent = getMonthlyEquivalent(taxableBase, frequency);

  if (monthlyEquivalent > MEXICO_SALARY_PRESET.subsidyThresholdMonthly) {
    return 0;
  }

  const maximum = MEXICO_SALARY_PRESET.subsidyMaximumMonthly;

  if (frequency.id === "monthly") {
    return maximum;
  }

  return Math.min(maximum, (maximum / 30.4) * frequency.days);
}

function calculateTaxWithCredit(
  taxableBase: number,
  frequency: SalaryFrequency,
): { taxBeforeCredits: number; taxCredit: number; tax: number; marginalRate: number } {
  const calculation = calculateMexicoTax(taxableBase, frequency);
  const potentialCredit = calculateMexicoSubsidy(
    taxableBase,
    getFrequencyRule(frequency),
  );
  const taxCredit = Math.min(calculation.taxBeforeCredits, potentialCredit);

  return {
    taxBeforeCredits: calculation.taxBeforeCredits,
    taxCredit,
    tax: Math.max(0, calculation.taxBeforeCredits - taxCredit),
    marginalRate: calculation.marginalRate,
  };
}

export function calculateNetSalary(input: SalaryInput): SalaryResult {
  assertValidInput(input);

  const frequency = getFrequencyRule(input.frequency);
  const taxableBonus = normalizeOptional(input.taxableBonus);
  const uniqueBonus = normalizeOptional(input.uniqueBonus);
  const taxableBenefits = normalizeOptional(input.taxableBenefits);
  const exemptBenefits = normalizeOptional(input.exemptBenefits);
  const preTaxDeductions = normalizeOptional(input.preTaxDeductions);
  const employeeContributions = normalizeOptional(input.employeeContributions);
  const postTaxDeductions = normalizeOptional(input.postTaxDeductions);
  const annualBase = getAnnualBase(input.gross, input.salaryBasis, frequency);
  const salaryPeriod = annualBase / frequency.periodsPerYear;
  const grossCashPeriod =
    salaryPeriod +
    taxableBonus +
    uniqueBonus +
    taxableBenefits +
    exemptBenefits;
  const recurringTaxableBase = Math.max(
    0,
    salaryPeriod + taxableBonus + taxableBenefits - preTaxDeductions,
  );
  const taxableBase = Math.max(0, recurringTaxableBase + uniqueBonus);
  const taxWithCredit = calculateTaxWithCredit(taxableBase, input.frequency);
  const recurringTax = calculateTaxWithCredit(
    recurringTaxableBase,
    input.frequency,
  );
  const annualTaxProjection =
    recurringTax.tax * frequency.periodsPerYear +
    (taxWithCredit.tax - recurringTax.tax);
  const netPeriod = Math.max(
    0,
    grossCashPeriod -
      preTaxDeductions -
      taxWithCredit.tax -
      employeeContributions -
      postTaxDeductions,
  );
  const annualGrossProjection =
    annualBase +
    (taxableBonus + taxableBenefits + exemptBenefits) * frequency.periodsPerYear +
    uniqueBonus;
  const annualNetProjection = Math.max(
    0,
    annualGrossProjection -
      preTaxDeductions * frequency.periodsPerYear -
      annualTaxProjection -
      employeeContributions * frequency.periodsPerYear -
      postTaxDeductions * frequency.periodsPerYear,
  );
  const totalEmployeeDeductions =
    preTaxDeductions +
    taxWithCredit.tax +
    employeeContributions +
    postTaxDeductions;

  return {
    status: employeeContributions > 0 ? "manual" : "partial",
    coverage: employeeContributions > 0 ? "manual-contributions" : "isr-only",
    currency: MEXICO_SALARY_PRESET.currency,
    locale: MEXICO_SALARY_PRESET.locale,
    frequency,
    salaryBasis: input.salaryBasis,
    grossCashPeriod,
    taxableBase,
    taxBeforeCredits: taxWithCredit.taxBeforeCredits,
    taxCredit: taxWithCredit.taxCredit,
    tax: taxWithCredit.tax,
    employeeContributions,
    employerContributions: 0,
    preTaxDeductions,
    postTaxDeductions,
    netPeriod,
    monthlyEquivalent: annualNetProjection / 12,
    annualGrossProjection,
    annualTaxProjection,
    annualNetProjection,
    effectiveTaxRate:
      taxableBase > 0 ? taxWithCredit.tax / taxableBase : 0,
    totalEmployeeBurdenRate:
      grossCashPeriod > 0 ? totalEmployeeDeductions / grossCashPeriod : 0,
    marginalRate: taxWithCredit.marginalRate,
    breakdown: [
      { id: "gross", label: "Ingreso efectivo", value: grossCashPeriod, tone: "income" },
      { id: "taxable-base", label: "Base gravable para ISR", value: taxableBase, tone: "info" },
      { id: "tax-before-credits", label: "ISR antes de créditos", value: taxWithCredit.taxBeforeCredits, tone: "tax" },
      { id: "tax-credit", label: "Subsidio para el empleo aplicado", value: taxWithCredit.taxCredit, tone: "credit" },
      { id: "tax", label: "ISR estimado", value: taxWithCredit.tax, tone: "tax" },
      {
        id: "employee-contributions",
        label: "Aportaciones del trabajador",
        value: employeeContributions,
        tone: "deduction",
        note: MEXICO_SALARY_PRESET.employeeContributionNote,
      },
      { id: "pre-tax", label: "Deducciones pre-fiscales", value: preTaxDeductions, tone: "deduction" },
      { id: "post-tax", label: "Otras deducciones", value: postTaxDeductions, tone: "deduction" },
      { id: "net", label: "Neto estimado por pago", value: netPeriod, tone: "income" },
    ],
    warnings: [MEXICO_SALARY_PRESET.employeeContributionNote],
  };
}

export type ParseMoneyResult =
  | { ok: true; value: number; normalized: string }
  | { ok: false; error: "required" | "invalid" | "negative" | "too_many_decimals" };

export function parseMoneyInput(value: string): ParseMoneyResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
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

  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const decimalPart = normalized.split(".")[1];

  if (decimalPart && decimalPart.length > 4) {
    return { ok: false, error: "too_many_decimals" };
  }

  const numericValue = Number(normalized);

  if (!Number.isFinite(numericValue) || numericValue > 1_000_000_000_000) {
    return { ok: false, error: "invalid" };
  }

  return { ok: true, value: numericValue, normalized };
}

export function parseOptionalMoneyInput(value: string): ParseMoneyResult {
  return value.trim() ? parseMoneyInput(value) : { ok: true, value: 0, normalized: "0" };
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

export function formatMoney(
  value: number,
  locale = MEXICO_SALARY_PRESET.locale,
  currency = MEXICO_SALARY_PRESET.currency,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundCurrency(value));
}

export function formatPercent(value: number, locale = MEXICO_SALARY_PRESET.locale): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(value);
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
