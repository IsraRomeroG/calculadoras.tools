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
  prudent: "Prudente",
  standard: "Estandar",
  stretched: "Ajustado",
};

export const CAPACITY_PRESET_RATIOS: Record<CapacityPreset, number> = {
  prudent: 28,
  standard: 35,
  stretched: 45,
};

export const LIMITING_FACTOR_LABELS: Record<LimitingFactorId, string> = {
  income: "Ingreso mensual",
  currentDebts: "Deudas actuales",
  monthlyHousingCosts: "Costos mensuales",
  initialCash: "Efectivo inicial",
  financing: "Enganche minimo",
  none: "Sin limitante clara",
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
    "El ratio maximo",
    1,
    100,
  );
  const monthlyIncome = normalizePositiveMoney(
    input.monthlyIncome,
    "El ingreso mensual",
  );
  const monthlyDebts = normalizeNonNegativeMoney(
    input.monthlyDebts ?? 0,
    "Las deudas mensuales",
  );
  const availableCash = normalizeNonNegativeMoney(
    input.availableCash ?? 0,
    "El efectivo disponible",
  );
  const downPaymentType = normalizeDownPaymentType(
    input.downPaymentType ?? "percent",
  );
  const userDownPaymentPercent = normalizePercent(
    input.downPaymentPercent ?? 20,
    "El enganche",
    0,
    100,
  );
  const downPaymentAmount = normalizeNonNegativeMoney(
    input.downPaymentAmount ?? 0,
    "El enganche",
  );
  const maxFinancingPercent = normalizePercent(
    input.maxFinancingPercent ?? 80,
    "El financiamiento maximo",
    1,
    100,
  );
  const annualRatePercent = normalizePercent(
    input.annualRatePercent,
    "La tasa anual",
    0,
    100,
  );
  const years = normalizeYears(input.years ?? 20);
  const monthlyHousingCosts = normalizeNonNegativeMoney(
    input.monthlyHousingCosts ?? 0,
    "Los costos mensuales",
  );
  const upfrontCostPercent = normalizePercent(
    input.upfrontCostPercent ?? 6,
    "Los costos iniciales",
    0,
    30,
  );
  const upfrontCostFixed = normalizeNonNegativeMoney(
    input.upfrontCostFixed ?? 0,
    "Los costos iniciales fijos",
  );
  const targetHomePrice =
    input.targetHomePrice === undefined || input.targetHomePrice === null
      ? null
      : normalizeNonNegativeMoney(
          input.targetHomePrice,
          "El precio objetivo",
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
  assertFiniteNumber(loanAmount, "El prestamo");
  assertFiniteNumber(annualRatePercent, "La tasa anual");
  assertFiniteNumber(years, "El plazo");

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
  assertFiniteNumber(payment, "El pago hipotecario");
  assertFiniteNumber(annualRatePercent, "La tasa anual");
  assertFiniteNumber(years, "El plazo");

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

export function formatPercent(value: number): string {
  assertFiniteNumber(value, "El porcentaje");

  return `${new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: Math.abs(value) < 10 ? 2 : 1,
  }).format(value)}%`;
}

export function roundMoney(value: number): number {
  assertFiniteNumber(value, "El importe");

  return Math.round(value * 100) / 100;
}

export function buildInterpretation(result: HomeAffordabilityResult): string {
  if (result.maxHomePrice <= MONEY_EPSILON) {
    return "Con estos datos no queda capacidad estimada para una vivienda.";
  }

  return `Con estos datos, el precio maximo estimado es ${formatCurrency(result.maxHomePrice)}. La principal limitante es ${result.limitingFactor.label.toLowerCase()}.`;
}

export function buildCopyText(result: HomeAffordabilityResult): string {
  const lines = [
    "Calculadora de capacidad de compra de vivienda - calculadoras.tools",
    `Precio maximo estimado: ${formatCurrency(result.maxHomePrice)}`,
    `Pago hipotecario disponible: ${formatCurrency(result.mortgagePaymentAvailable)}`,
    `Prestamo aproximado: ${formatCurrency(result.estimatedLoanAmount)}`,
    `Enganche estimado: ${formatCurrency(result.estimatedDownPayment)}`,
    `Costos iniciales estimados: ${formatCurrency(result.estimatedUpfrontCosts)}`,
    `Efectivo inicial requerido: ${formatCurrency(result.initialCashRequired)}`,
    `Limitante principal: ${result.limitingFactor.label}`,
    `Ingreso mensual: ${formatCurrency(result.monthlyIncome)}`,
    `Deudas mensuales: ${formatCurrency(result.monthlyDebts)}`,
    `Ratio maximo: ${formatPercent(result.maxDebtToIncomePercent)}`,
    `Tasa anual: ${formatPercent(result.annualRatePercent)}`,
    `Plazo: ${result.years} anos`,
  ];

  if (result.target) {
    lines.push(
      "Vivienda objetivo:",
      `Precio objetivo: ${formatCurrency(result.target.homePrice)}`,
      `Estado: ${result.target.status === "within_range" ? "Dentro del rango estimado" : "Por encima del rango estimado"}`,
      `Faltante mensual: ${formatCurrency(result.target.monthlyShortfall)}`,
      `Faltante de efectivo inicial: ${formatCurrency(result.target.cashShortfall)}`,
      `Ingreso requerido aproximado: ${formatCurrency(result.target.requiredMonthlyIncome)}`,
    );
  }

  if (result.warnings.length > 0) {
    lines.push("Notas:", ...result.warnings.map((warning) => `- ${warning}`));
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
      "Un ratio mayor a 50% puede dejar poco margen para otros gastos.",
    );
  }

  if (options.monthlyDebts >= options.obligationLimit - MONEY_EPSILON) {
    warnings.push(
      "Tus deudas actuales consumen el limite elegido; no queda pago hipotecario disponible.",
    );
  } else if (
    options.monthlyHousingCosts >=
    options.totalHousingPaymentAvailable - MONEY_EPSILON
  ) {
    warnings.push(
      "Los costos mensuales de vivienda consumen el espacio disponible antes de la hipoteca.",
    );
  }

  if (
    options.downPaymentType === "percent" &&
    options.userDownPaymentPercent < options.minimumDownPaymentPercent
  ) {
    warnings.push(
      `El enganche se ajusto al minimo de ${formatPercent(options.minimumDownPaymentPercent)} por el financiamiento maximo elegido.`,
    );
  }

  if (options.upfrontCostPercent === 0) {
    warnings.push(
      "No se estan descontando gastos iniciales porcentuales; el precio maximo podria ser optimista.",
    );
  }

  if (options.availableCash <= MONEY_EPSILON) {
    warnings.push(
      "Sin efectivo inicial disponible, el resultado puede quedar limitado por enganche y gastos de compra.",
    );
  }

  if (options.maxFinancingPercent > 95) {
    warnings.push(
      "Un financiamiento mayor a 95% puede no estar disponible para todos los perfiles.",
    );
  }

  if (options.annualRatePercent > 20) {
    warnings.push(
      "Una tasa mayor a 20% anual puede cambiar mucho la capacidad de compra; revisa el supuesto.",
    );
  }

  if (options.maxHomePrice <= MONEY_EPSILON) {
    warnings.push(
      "Con estos datos no queda capacidad estimada para una vivienda.",
    );
  }

  if (options.target && options.target.status === "above_range") {
    warnings.push(
      "La vivienda objetivo queda por encima del rango estimado con estos supuestos.",
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

  throw new RangeError("El perfil de capacidad no es valido.");
}

function normalizeDownPaymentType(value: string): DownPaymentType {
  if (DOWN_PAYMENT_TYPES.includes(value as DownPaymentType)) {
    return value as DownPaymentType;
  }

  throw new RangeError("El tipo de enganche no es valido.");
}

function normalizePositiveMoney(value: number, label: string): number {
  assertFiniteNumber(value, label);

  if (value <= 0) {
    throw new RangeError(`${label} debe ser mayor que cero.`);
  }

  return value;
}

function normalizeNonNegativeMoney(value: number, label: string): number {
  assertFiniteNumber(value, label);

  if (value < 0) {
    throw new RangeError(`${label} no puede ser negativo.`);
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
    throw new RangeError(`${label} debe estar entre ${minimum}% y ${maximum}%.`);
  }

  return value;
}

function normalizeYears(value: number): number {
  assertFiniteNumber(value, "El plazo");

  if (!Number.isInteger(value) || value < 1 || value > 40) {
    throw new RangeError("El plazo debe ser un numero entero entre 1 y 40 anos.");
  }

  return value;
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
