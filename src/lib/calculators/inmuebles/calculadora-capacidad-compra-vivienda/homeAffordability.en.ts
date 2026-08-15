export const CAPACITY_PRESETS = ["prudent", "standard", "stretched"] as const;
export const DOWN_PAYMENT_TYPES = ["percent", "amount"] as const;
export const LIMITING_FACTOR_IDS = [
  "income",
  "currentDebts",
  "monthlyHousingCosts",
  "initialCash",
  "financing",
  "none",
] as const;

export type CapacityPreset = (typeof CAPACITY_PRESETS)[number];
export type DownPaymentType = (typeof DOWN_PAYMENT_TYPES)[number];
export type LimitingFactorId = (typeof LIMITING_FACTOR_IDS)[number];

export interface HomeAffordabilityInput {
  monthlyIncome: number;
  monthlyDebts?: number;
  maxDebtToIncomePercent?: number;
  capacityPreset?: CapacityPreset;
  availableCash?: number;
  downPaymentType?: DownPaymentType;
  downPaymentPercent?: number;
  downPaymentAmount?: number;
  maxFinancingPercent?: number;
  annualRatePercent: number;
  years?: number;
  monthlyHousingCosts?: number;
  upfrontCostPercent?: number;
  upfrontCostFixed?: number;
  targetHomePrice?: number;
}

export interface ConstraintResult {
  id: LimitingFactorId;
  label: string;
  value: number;
  applies: boolean;
}

export interface HomeAffordabilityTargetResult {
  homePrice: number;
  status: "within_range" | "above_range";
  mortgagePayment: number;
  loanAmount: number;
  downPayment: number;
  upfrontCosts: number;
  initialCashRequired: number;
  totalDebtToIncomePercent: number;
  monthlyShortfall: number;
  cashShortfall: number;
  priceGap: number;
  requiredMonthlyIncome: number;
}

export interface HomeAffordabilityResult {
  monthlyIncome: number;
  monthlyDebts: number;
  maxDebtToIncomePercent: number;
  capacityPreset: CapacityPreset;
  availableCash: number;
  downPaymentType: DownPaymentType;
  userDownPaymentPercent: number;
  effectiveDownPaymentPercent: number;
  downPaymentAmount: number;
  minimumDownPaymentPercent: number;
  maxFinancingPercent: number;
  annualRatePercent: number;
  years: number;
  monthlyHousingCosts: number;
  upfrontCostPercent: number;
  upfrontCostFixed: number;
  obligationLimit: number;
  totalHousingPaymentAvailable: number;
  mortgagePaymentAvailable: number;
  loanByIncome: number;
  maxHomePrice: number;
  estimatedLoanAmount: number;
  estimatedDownPayment: number;
  estimatedMortgagePayment: number;
  estimatedUpfrontCosts: number;
  initialCashRequired: number;
  currentDebtToIncomePercent: number;
  totalDebtToIncomePercent: number;
  remainingMonthlyIncome: number;
  limitingFactor: ConstraintResult;
  constraints: ConstraintResult[];
  target: HomeAffordabilityTargetResult | null;
  warnings: string[];
}

const MONEY_EPSILON = 0.005;
const INFINITE_LIMIT = Number.POSITIVE_INFINITY;

export const CAPACITY_PRESET_LABELS: Record<CapacityPreset, string> = {
  prudent: "Prudent",
  standard: "Standard",
  stretched: "Stretched",
};

export const CAPACITY_PRESET_RATIOS: Record<CapacityPreset, number> = {
  prudent: 28,
  standard: 35,
  stretched: 45,
};

export const LIMITING_FACTOR_LABELS: Record<LimitingFactorId, string> = {
  income: "Monthly income",
  currentDebts: "Current debts",
  monthlyHousingCosts: "Monthly costs",
  initialCash: "Initial cash",
  financing: "Minimum down payment",
  none: "No clear limiting factor",
};

export function calculateHomeAffordability(
  input: HomeAffordabilityInput,
): HomeAffordabilityResult {
  const capacityPreset = normalizeCapacityPreset(
    input.capacityPreset ?? "standard",
  );
  const maxDebtToIncomePercent = normalizePercent(
    input.maxDebtToIncomePercent ??
      CAPACITY_PRESET_RATIOS[capacityPreset],
    "The maximum ratio",
    1,
    100,
  );
  const monthlyIncome = normalizePositiveMoney(
    input.monthlyIncome,
    "The monthly income",
  );
  const monthlyDebts = normalizeNonNegativeMoney(
    input.monthlyDebts ?? 0,
    "The monthly debts",
  );
  const availableCash = normalizeNonNegativeMoney(
    input.availableCash ?? 0,
    "The available cash",
  );
  const downPaymentType = normalizeDownPaymentType(
    input.downPaymentType ?? "percent",
  );
  const userDownPaymentPercent = normalizePercent(
    input.downPaymentPercent ?? 20,
    "The down payment",
    0,
    100,
  );
  const downPaymentAmount = normalizeNonNegativeMoney(
    input.downPaymentAmount ?? 0,
    "The down payment",
  );
  const maxFinancingPercent = normalizePercent(
    input.maxFinancingPercent ?? 80,
    "The maximum financing",
    1,
    100,
  );
  const annualRatePercent = normalizePercent(
    input.annualRatePercent,
    "The annual rate",
    0,
    100,
  );
  const years = normalizeYears(input.years ?? 20);
  const monthlyHousingCosts = normalizeNonNegativeMoney(
    input.monthlyHousingCosts ?? 0,
    "The monthly costs",
  );
  const upfrontCostPercent = normalizePercent(
    input.upfrontCostPercent ?? 6,
    "The upfront costs",
    0,
    30,
  );
  const upfrontCostFixed = normalizeNonNegativeMoney(
    input.upfrontCostFixed ?? 0,
    "The fixed upfront costs",
  );
  const targetHomePrice =
    input.targetHomePrice === undefined || input.targetHomePrice === null
      ? null
      : normalizeNonNegativeMoney(
          input.targetHomePrice,
          "The target home price",
        );
  const minimumDownPaymentPercent = Math.max(0, 100 - maxFinancingPercent);
  const effectiveDownPaymentPercent =
    downPaymentType === "percent"
      ? Math.max(userDownPaymentPercent, minimumDownPaymentPercent)
      : minimumDownPaymentPercent;
  const obligationLimit = monthlyIncome * (maxDebtToIncomePercent / 100);
  const totalHousingPaymentAvailable = Math.max(
    0,
    obligationLimit - monthlyDebts,
  );
  const mortgagePaymentAvailable = Math.max(
    0,
    totalHousingPaymentAvailable - monthlyHousingCosts,
  );
  const loanByIncome = calculateLoanAmountFromPayment(
    mortgagePaymentAvailable,
    annualRatePercent,
    years,
  );
  const constraints = buildConstraints({
    downPaymentType,
    loanByIncome,
    availableCash,
    downPaymentAmount,
    minimumDownPaymentPercent,
    effectiveDownPaymentPercent,
    upfrontCostPercent,
    upfrontCostFixed,
  });
  const limitingFactor = chooseLimitingFactor({
    constraints,
    obligationLimit,
    monthlyDebts,
    monthlyHousingCosts,
    mortgagePaymentAvailable,
  });
  const maxHomePrice = roundMoney(
    Math.max(0, finiteMinimum(constraints.filter((item) => item.applies))),
  );
  const estimatedDownPayment = roundMoney(
    calculateDownPaymentForPrice({
      homePrice: maxHomePrice,
      downPaymentType,
      downPaymentAmount,
      downPaymentPercent: userDownPaymentPercent,
      minimumDownPaymentPercent,
    }),
  );
  const estimatedLoanAmount = roundMoney(
    Math.max(0, Math.min(loanByIncome, maxHomePrice - estimatedDownPayment)),
  );
  const estimatedMortgagePayment = roundMoney(
    calculateMonthlyPayment(estimatedLoanAmount, annualRatePercent, years),
  );
  const estimatedUpfrontCosts = roundMoney(
    calculateUpfrontCosts(maxHomePrice, upfrontCostPercent, upfrontCostFixed),
  );
  const initialCashRequired = roundMoney(
    estimatedDownPayment + estimatedUpfrontCosts,
  );
  const currentDebtToIncomePercent = percentage(monthlyDebts, monthlyIncome);
  const totalDebtToIncomePercent = percentage(
    monthlyDebts + monthlyHousingCosts + estimatedMortgagePayment,
    monthlyIncome,
  );
  const remainingMonthlyIncome = roundMoney(
    monthlyIncome -
      monthlyDebts -
      monthlyHousingCosts -
      estimatedMortgagePayment,
  );
  const target =
    targetHomePrice && targetHomePrice > 0
      ? calculateTarget({
          homePrice: targetHomePrice,
          maxHomePrice,
          monthlyIncome,
          monthlyDebts,
          maxDebtToIncomePercent,
          availableCash,
          downPaymentType,
          downPaymentPercent: userDownPaymentPercent,
          downPaymentAmount,
          minimumDownPaymentPercent,
          annualRatePercent,
          years,
          monthlyHousingCosts,
          upfrontCostPercent,
          upfrontCostFixed,
          mortgagePaymentAvailable,
        })
      : null;

  return {
    monthlyIncome,
    monthlyDebts,
    maxDebtToIncomePercent,
    capacityPreset,
    availableCash,
    downPaymentType,
    userDownPaymentPercent,
    effectiveDownPaymentPercent,
    downPaymentAmount,
    minimumDownPaymentPercent,
    maxFinancingPercent,
    annualRatePercent,
    years,
    monthlyHousingCosts,
    upfrontCostPercent,
    upfrontCostFixed,
    obligationLimit: roundMoney(obligationLimit),
    totalHousingPaymentAvailable: roundMoney(totalHousingPaymentAvailable),
    mortgagePaymentAvailable: roundMoney(mortgagePaymentAvailable),
    loanByIncome: roundMoney(loanByIncome),
    maxHomePrice,
    estimatedLoanAmount,
    estimatedDownPayment,
    estimatedMortgagePayment,
    estimatedUpfrontCosts,
    initialCashRequired,
    currentDebtToIncomePercent,
    totalDebtToIncomePercent,
    remainingMonthlyIncome,
    limitingFactor,
    constraints,
    target,
    warnings: buildWarnings({
      maxDebtToIncomePercent,
      monthlyDebts,
      obligationLimit,
      monthlyHousingCosts,
      totalHousingPaymentAvailable,
      mortgagePaymentAvailable,
      availableCash,
      upfrontCostPercent,
      downPaymentType,
      userDownPaymentPercent,
      minimumDownPaymentPercent,
      maxFinancingPercent,
      annualRatePercent,
      maxHomePrice,
      target,
    }),
  };
}

export function calculateMonthlyPayment(
  loanAmount: number,
  annualRatePercent: number,
  years: number,
): number {
  assertFiniteNumber(loanAmount, "The loan");
  assertFiniteNumber(annualRatePercent, "The annual rate");
  assertFiniteNumber(years, "The term");

  if (loanAmount <= 0 || years <= 0) {
    return 0;
  }

  const months = years * 12;
  const monthlyRate = annualRatePercent / 12 / 100;

  if (monthlyRate === 0) {
    return loanAmount / months;
  }

  const factor = Math.pow(1 + monthlyRate, months);

  return (loanAmount * monthlyRate * factor) / (factor - 1);
}

export function calculateLoanAmountFromPayment(
  payment: number,
  annualRatePercent: number,
  years: number,
): number {
  assertFiniteNumber(payment, "The mortgage payment");
  assertFiniteNumber(annualRatePercent, "The annual rate");
  assertFiniteNumber(years, "The term");

  if (payment <= 0 || years <= 0) {
    return 0;
  }

  const months = years * 12;
  const monthlyRate = annualRatePercent / 12 / 100;

  if (monthlyRate === 0) {
    return payment * months;
  }

  const factor = Math.pow(1 + monthlyRate, months);

  return payment * ((factor - 1) / (monthlyRate * factor));
}

export function parseLocalizedNumber(value: string): number | null {
  const cleaned = value
    .trim()
    .replace(/\s+/g, "")
    .replace(/MXN|USD|EUR/gi, "")
    .replace(/[$%]/g, "");

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

export function formatPercent(value: number): string {
  assertFiniteNumber(value, "The percentage");

  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: Math.abs(value) < 10 ? 2 : 1,
  }).format(value)}%`;
}

export function roundMoney(value: number): number {
  assertFiniteNumber(value, "The amount");

  return Math.round(value * 100) / 100;
}

export function buildInterpretation(result: HomeAffordabilityResult): string {
  if (result.maxHomePrice <= MONEY_EPSILON) {
    return "These inputs leave no estimated home-buying capacity.";
  }

  return `With these inputs, the estimated maximum home price is ${formatCurrency(result.maxHomePrice)}. The main limiting factor is ${result.limitingFactor.label.toLowerCase()}.`;
}

export function buildCopyText(result: HomeAffordabilityResult): string {
  const lines = [
    "Home affordability calculator - calculadoras.tools",
    `Estimated maximum home price: ${formatCurrency(result.maxHomePrice)}`,
    `Available mortgage payment: ${formatCurrency(result.mortgagePaymentAvailable)}`,
    `Approximate loan: ${formatCurrency(result.estimatedLoanAmount)}`,
    `Estimated down payment: ${formatCurrency(result.estimatedDownPayment)}`,
    `Estimated upfront costs: ${formatCurrency(result.estimatedUpfrontCosts)}`,
    `Initial cash required: ${formatCurrency(result.initialCashRequired)}`,
    `Main limiting factor: ${result.limitingFactor.label}`,
    `Monthly income: ${formatCurrency(result.monthlyIncome)}`,
    `Monthly debts: ${formatCurrency(result.monthlyDebts)}`,
    `Maximum ratio: ${formatPercent(result.maxDebtToIncomePercent)}`,
    `Annual rate: ${formatPercent(result.annualRatePercent)}`,
    `Term: ${result.years} years`,
  ];

  if (result.target) {
    lines.push(
      "Target home:",
      `Target home price: ${formatCurrency(result.target.homePrice)}`,
      `Status: ${result.target.status === "within_range" ? "Within the estimated range" : "Above the estimated range"}`,
      `Monthly shortfall: ${formatCurrency(result.target.monthlyShortfall)}`,
      `Initial cash shortfall: ${formatCurrency(result.target.cashShortfall)}`,
      `Approximate required income: ${formatCurrency(result.target.requiredMonthlyIncome)}`,
    );
  }

  if (result.warnings.length > 0) {
    lines.push("Notes:", ...result.warnings.map((warning) => `- ${warning}`));
  }

  return lines.join("\n");
}

function buildConstraints(options: {
  downPaymentType: DownPaymentType;
  loanByIncome: number;
  availableCash: number;
  downPaymentAmount: number;
  minimumDownPaymentPercent: number;
  effectiveDownPaymentPercent: number;
  upfrontCostPercent: number;
  upfrontCostFixed: number;
}): ConstraintResult[] {
  if (options.downPaymentType === "percent") {
    const incomeDenominator = 1 - options.effectiveDownPaymentPercent / 100;
    const initialCashDenominator =
      (options.effectiveDownPaymentPercent + options.upfrontCostPercent) / 100;

    return [
      makeConstraint(
        "income",
        divideConstraint(options.loanByIncome, incomeDenominator),
      ),
      makeConstraint(
        "initialCash",
        divideConstraint(
          options.availableCash - options.upfrontCostFixed,
          initialCashDenominator,
        ),
      ),
    ];
  }

  return [
    makeConstraint("income", options.loanByIncome + options.downPaymentAmount),
    makeConstraint(
      "initialCash",
      divideConstraint(
        options.availableCash -
          options.downPaymentAmount -
          options.upfrontCostFixed,
        options.upfrontCostPercent / 100,
      ),
    ),
    makeConstraint(
      "financing",
      divideConstraint(
        options.downPaymentAmount,
        options.minimumDownPaymentPercent / 100,
      ),
      options.minimumDownPaymentPercent > 0,
    ),
  ];
}

function makeConstraint(
  id: LimitingFactorId,
  value: number,
  applies = true,
): ConstraintResult {
  return {
    id,
    label: LIMITING_FACTOR_LABELS[id],
    value: roundConstraint(value),
    applies,
  };
}

function chooseLimitingFactor(options: {
  constraints: ConstraintResult[];
  obligationLimit: number;
  monthlyDebts: number;
  monthlyHousingCosts: number;
  mortgagePaymentAvailable: number;
}): ConstraintResult {
  if (options.monthlyDebts >= options.obligationLimit - MONEY_EPSILON) {
    return makeConstraint("currentDebts", 0);
  }

  if (
    options.mortgagePaymentAvailable <= MONEY_EPSILON &&
    options.monthlyHousingCosts > 0
  ) {
    return makeConstraint("monthlyHousingCosts", 0);
  }

  const applicable = options.constraints.filter((constraint) =>
    Number.isFinite(constraint.value) && constraint.applies,
  );

  if (applicable.length === 0) {
    return makeConstraint("none", INFINITE_LIMIT, false);
  }

  return applicable.reduce((lowest, current) =>
    current.value < lowest.value ? current : lowest,
  );
}

function calculateTarget(options: {
  homePrice: number;
  maxHomePrice: number;
  monthlyIncome: number;
  monthlyDebts: number;
  maxDebtToIncomePercent: number;
  availableCash: number;
  downPaymentType: DownPaymentType;
  downPaymentPercent: number;
  downPaymentAmount: number;
  minimumDownPaymentPercent: number;
  annualRatePercent: number;
  years: number;
  monthlyHousingCosts: number;
  upfrontCostPercent: number;
  upfrontCostFixed: number;
  mortgagePaymentAvailable: number;
}): HomeAffordabilityTargetResult {
  const downPayment = roundMoney(
    calculateDownPaymentForPrice({
      homePrice: options.homePrice,
      downPaymentType: options.downPaymentType,
      downPaymentAmount: options.downPaymentAmount,
      downPaymentPercent: options.downPaymentPercent,
      minimumDownPaymentPercent: options.minimumDownPaymentPercent,
    }),
  );
  const loanAmount = roundMoney(Math.max(0, options.homePrice - downPayment));
  const mortgagePayment = roundMoney(
    calculateMonthlyPayment(loanAmount, options.annualRatePercent, options.years),
  );
  const upfrontCosts = roundMoney(
    calculateUpfrontCosts(
      options.homePrice,
      options.upfrontCostPercent,
      options.upfrontCostFixed,
    ),
  );
  const initialCashRequired = roundMoney(downPayment + upfrontCosts);
  const totalDebtToIncomePercent = percentage(
    options.monthlyDebts + options.monthlyHousingCosts + mortgagePayment,
    options.monthlyIncome,
  );
  const monthlyShortfall = roundMoney(
    Math.max(0, mortgagePayment - options.mortgagePaymentAvailable),
  );
  const cashShortfall = roundMoney(
    Math.max(0, initialCashRequired - options.availableCash),
  );
  const priceGap = roundMoney(Math.max(0, options.homePrice - options.maxHomePrice));
  const requiredMonthlyIncome = roundMoney(
    (options.monthlyDebts + options.monthlyHousingCosts + mortgagePayment) /
      (options.maxDebtToIncomePercent / 100),
  );

  return {
    homePrice: options.homePrice,
    status:
      options.homePrice <= options.maxHomePrice + MONEY_EPSILON
        ? "within_range"
        : "above_range",
    mortgagePayment,
    loanAmount,
    downPayment,
    upfrontCosts,
    initialCashRequired,
    totalDebtToIncomePercent,
    monthlyShortfall,
    cashShortfall,
    priceGap,
    requiredMonthlyIncome,
  };
}

function calculateDownPaymentForPrice(options: {
  homePrice: number;
  downPaymentType: DownPaymentType;
  downPaymentAmount: number;
  downPaymentPercent: number;
  minimumDownPaymentPercent: number;
}): number {
  if (options.homePrice <= 0) {
    return 0;
  }

  if (options.downPaymentType === "percent") {
    const effectivePercent = Math.max(
      options.downPaymentPercent,
      options.minimumDownPaymentPercent,
    );

    return options.homePrice * (effectivePercent / 100);
  }

  const minimumDownPayment =
    options.homePrice * (options.minimumDownPaymentPercent / 100);

  return Math.min(
    options.homePrice,
    Math.max(options.downPaymentAmount, minimumDownPayment),
  );
}

function calculateUpfrontCosts(
  homePrice: number,
  upfrontCostPercent: number,
  upfrontCostFixed: number,
): number {
  return homePrice * (upfrontCostPercent / 100) + upfrontCostFixed;
}

function buildWarnings(options: {
  maxDebtToIncomePercent: number;
  monthlyDebts: number;
  obligationLimit: number;
  monthlyHousingCosts: number;
  totalHousingPaymentAvailable: number;
  mortgagePaymentAvailable: number;
  availableCash: number;
  upfrontCostPercent: number;
  downPaymentType: DownPaymentType;
  userDownPaymentPercent: number;
  minimumDownPaymentPercent: number;
  maxFinancingPercent: number;
  annualRatePercent: number;
  maxHomePrice: number;
  target: HomeAffordabilityTargetResult | null;
}): string[] {
  const warnings: string[] = [];

  if (options.maxDebtToIncomePercent > 50) {
    warnings.push(
      "A ratio above 50% may leave little room for other expenses.",
    );
  }

  if (options.monthlyDebts >= options.obligationLimit - MONEY_EPSILON) {
    warnings.push(
      "Your current debts consume the selected limit, leaving no room for a mortgage payment.",
    );
  } else if (
    options.monthlyHousingCosts >=
    options.totalHousingPaymentAvailable - MONEY_EPSILON
  ) {
    warnings.push(
      "Monthly housing costs consume the available room before the mortgage payment.",
    );
  }

  if (
    options.downPaymentType === "percent" &&
    options.userDownPaymentPercent < options.minimumDownPaymentPercent
  ) {
    warnings.push(
      `The down payment was adjusted to the ${formatPercent(options.minimumDownPaymentPercent)} minimum required by the selected financing limit.`,
    );
  }

  if (options.upfrontCostPercent === 0) {
    warnings.push(
      "Percentage-based upfront costs are not being deducted, so the maximum price may be optimistic.",
    );
  }

  if (options.availableCash <= MONEY_EPSILON) {
    warnings.push(
      "With no initial cash available, the result may be limited by the down payment and purchase costs.",
    );
  }

  if (options.maxFinancingPercent > 95) {
    warnings.push(
      "Financing above 95% may not be available to every borrower.",
    );
  }

  if (options.annualRatePercent > 20) {
    warnings.push(
      "An annual rate above 20% can substantially change affordability; review this assumption.",
    );
  }

  if (options.maxHomePrice <= MONEY_EPSILON) {
    warnings.push(
      "These inputs leave no estimated home-buying capacity.",
    );
  }

  if (options.target && options.target.status === "above_range") {
    warnings.push(
      "The target home is above the estimated range under these assumptions.",
    );
  }

  return warnings;
}

function finiteMinimum(constraints: ConstraintResult[]): number {
  const values = constraints
    .filter((constraint) => constraint.applies)
    .map((constraint) => constraint.value);

  if (values.length === 0) {
    return 0;
  }

  return values.reduce((lowest, current) =>
    current < lowest ? current : lowest,
  );
}

function divideConstraint(numerator: number, denominator: number): number {
  if (denominator <= 0) {
    return numerator >= 0 ? INFINITE_LIMIT : 0;
  }

  if (numerator <= 0) {
    return 0;
  }

  return numerator / denominator;
}

function roundConstraint(value: number): number {
  if (!Number.isFinite(value)) {
    return value;
  }

  return roundMoney(Math.max(0, value));
}

function percentage(value: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return Math.round((value / total) * 10000) / 100;
}

function normalizeCapacityPreset(value: string): CapacityPreset {
  if (CAPACITY_PRESETS.includes(value as CapacityPreset)) {
    return value as CapacityPreset;
  }

  throw new RangeError("The affordability profile is invalid.");
}

function normalizeDownPaymentType(value: string): DownPaymentType {
  if (DOWN_PAYMENT_TYPES.includes(value as DownPaymentType)) {
    return value as DownPaymentType;
  }

  throw new RangeError("The down payment type is invalid.");
}

function normalizePositiveMoney(value: number, label: string): number {
  assertFiniteNumber(value, label);

  if (value <= 0) {
    throw new RangeError(`${label} must be greater than zero.`);
  }

  return value;
}

function normalizeNonNegativeMoney(value: number, label: string): number {
  assertFiniteNumber(value, label);

  if (value < 0) {
    throw new RangeError(`${label} cannot be negative.`);
  }

  return value;
}

function normalizePercent(
  value: number,
  label: string,
  minimum: number,
  maximum: number,
): number {
  assertFiniteNumber(value, label);

  if (value < minimum || value > maximum) {
    throw new RangeError(`${label} must be between ${minimum}% and ${maximum}%.`);
  }

  return value;
}

function normalizeYears(value: number): number {
  assertFiniteNumber(value, "The term");

  if (!Number.isInteger(value) || value < 1 || value > 40) {
    throw new RangeError("The term must be a whole number between 1 and 40 years.");
  }

  return value;
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
