export interface FreelanceProjectPhase {
  name: string;
  hours: number;
  hourlyRate?: number;
}

export interface ProjectPaymentRates {
  deposit: number;
  progress: number;
  final: number;
}

export interface FreelanceProjectInput {
  phases: FreelanceProjectPhase[];
  baseHourlyRate?: number;
  directExpenses: number;
  recommendedContingencyRate: number;
  conservativeContingencyRate: number;
  collectionFeeRate: number;
  targetMarginRate: number;
  taxRate: number;
  paymentRates: ProjectPaymentRates;
}

export type ProjectScenarioKind = "base" | "recommended" | "conservative";
export type ProposedPriceStatus =
  | "healthy"
  | "tight"
  | "below_base";

export type ProjectWarning =
  | "no_contingency"
  | "high_contingency"
  | "expenses_exceed_work"
  | "no_tax"
  | "low_deposit";

export interface ProjectPhaseResult extends Required<FreelanceProjectPhase> {
  cost: number;
}

export interface ProjectScenario {
  kind: ProjectScenarioKind;
  contingencyRate: number;
  contingencyHours: number;
  contingencyCost: number;
  adjustedHours: number;
  adjustedCost: number;
  priceBeforeTax: number;
  collectionFeeAmount: number;
  marginAmount: number;
  achievedMarginRate: number;
  taxAmount: number;
  clientTotal: number;
  effectiveNetHourlyRate: number;
}

export interface ProjectPayment {
  key: keyof ProjectPaymentRates;
  rate: number;
  amount: number;
}

export interface ProjectRecommendation {
  phases: ProjectPhaseResult[];
  estimatedHours: number;
  workCost: number;
  weightedHourlyRate: number;
  scenarios: {
    base: ProjectScenario;
    recommended: ProjectScenario;
    conservative: ProjectScenario;
  };
  payments: ProjectPayment[];
  warnings: ProjectWarning[];
}

export interface ProposedPriceAnalysis {
  proposedPriceBeforeTax: number;
  collectionFeeAmount: number;
  commercialResult: number;
  achievedMarginRate: number;
  incomeAvailableForWork: number;
  effectiveNetHourlyRate: number;
  financedHours: number;
  additionalHoursAvailable: number;
  differenceFromRecommended: number;
  minimumCoveragePrice: number;
  taxAmount: number;
  clientTotal: number;
  status: ProposedPriceStatus;
  payments: ProjectPayment[];
}

export type ParseProjectNumberResult =
  | { ok: true; value: number; normalized: string }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const quantityFormatter = new Intl.NumberFormat("es-MX", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("es-MX", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const PAYMENT_TOLERANCE = 0.01;
const STATUS_TOLERANCE = 1e-9;

export function calculateProjectRecommendation(
  input: FreelanceProjectInput,
): ProjectRecommendation {
  const phases = validateAndBuildPhases(input);
  validateProjectInput(input);

  const estimatedHours = phases.reduce((total, phase) => total + phase.hours, 0);
  const workCost = phases.reduce((total, phase) => total + phase.cost, 0);
  const weightedHourlyRate = workCost / estimatedHours;
  const build = (kind: ProjectScenarioKind, contingencyRate: number) =>
    buildScenario(input, kind, contingencyRate, estimatedHours, workCost);

  const scenarios = {
    base: build("base", 0),
    recommended: build(
      "recommended",
      input.recommendedContingencyRate,
    ),
    conservative: build(
      "conservative",
      input.conservativeContingencyRate,
    ),
  };

  return {
    phases,
    estimatedHours,
    workCost,
    weightedHourlyRate,
    scenarios,
    payments: buildPaymentPlan(
      scenarios.recommended.clientTotal,
      input.paymentRates,
    ),
    warnings: buildWarnings(input, workCost),
  };
}

export function analyzeProposedPrice(
  input: FreelanceProjectInput,
  proposedPriceBeforeTax: number,
): ProposedPriceAnalysis {
  validatePositiveFinite(proposedPriceBeforeTax, "precio propuesto");

  const recommendation = calculateProjectRecommendation(input);
  const recommended = recommendation.scenarios.recommended;
  const collectionFeeAmount =
    proposedPriceBeforeTax * (input.collectionFeeRate / 100);
  const commercialResult =
    proposedPriceBeforeTax - recommended.adjustedCost - collectionFeeAmount;
  const achievedMarginRate =
    (commercialResult / proposedPriceBeforeTax) * 100;
  const incomeAvailableForWork =
    proposedPriceBeforeTax - input.directExpenses - collectionFeeAmount;
  const effectiveNetHourlyRate =
    incomeAvailableForWork / recommended.adjustedHours;
  const financedHours =
    incomeAvailableForWork / recommendation.weightedHourlyRate;
  const additionalHoursAvailable =
    financedHours - recommendation.estimatedHours;
  const minimumCoveragePrice =
    recommended.adjustedCost / (1 - input.collectionFeeRate / 100);
  const taxAmount = proposedPriceBeforeTax * (input.taxRate / 100);
  const clientTotal = proposedPriceBeforeTax + taxAmount;

  return {
    proposedPriceBeforeTax,
    collectionFeeAmount,
    commercialResult,
    achievedMarginRate,
    incomeAvailableForWork,
    effectiveNetHourlyRate,
    financedHours,
    additionalHoursAvailable,
    differenceFromRecommended:
      proposedPriceBeforeTax - recommended.priceBeforeTax,
    minimumCoveragePrice,
    taxAmount,
    clientTotal,
    status: getProposedPriceStatus(
      effectiveNetHourlyRate,
      recommendation.weightedHourlyRate,
      achievedMarginRate,
      input.targetMarginRate,
    ),
    payments: buildPaymentPlan(clientTotal, input.paymentRates),
  };
}

export function buildPaymentPlan(
  clientTotal: number,
  rates: ProjectPaymentRates,
): ProjectPayment[] {
  validatePositiveFinite(clientTotal, "total del cliente");
  validatePaymentRates(rates);

  const roundedTotal = roundCurrency(clientTotal);
  const deposit = roundCurrency(roundedTotal * (rates.deposit / 100));
  const progress = roundCurrency(roundedTotal * (rates.progress / 100));
  const final = roundCurrency(roundedTotal - deposit - progress);

  return [
    { key: "deposit", rate: rates.deposit, amount: deposit },
    { key: "progress", rate: rates.progress, amount: progress },
    { key: "final", rate: rates.final, amount: final },
  ];
}

export function parseProjectNumber(
  value: string,
  maxDecimals = 2,
  preferDecimal = false,
): ParseProjectNumberResult {
  const trimmed = value.trim();

  if (!trimmed) return { ok: false, error: "required" };
  if (/^[-−]/.test(trimmed)) return { ok: false, error: "negative" };

  const cleaned = trimmed
    .replace(/\b(MXN|USD|EUR|ARS|COP|CLP|PEN|GTQ|CRC|UYU|BRL)\b/gi, "")
    .replace(/S\/|[$€₡Q%\s]/gi, "");

  if (!cleaned || /[^0-9.,]/.test(cleaned)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeSeparators(cleaned, preferDecimal);

  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const decimals = normalized.split(".")[1];

  if (decimals && decimals.length > maxDecimals) {
    return { ok: false, error: "too_many_decimals" };
  }

  const numericValue = Number(normalized);

  if (!Number.isFinite(numericValue)) {
    return { ok: false, error: "invalid" };
  }

  return { ok: true, value: numericValue, normalized };
}

export function formatProjectCurrency(value: number): string {
  return currencyFormatter.format(roundCurrency(value));
}

export function formatProjectQuantity(value: number): string {
  return quantityFormatter.format(value);
}

export function formatProjectPercent(value: number): string {
  return `${percentFormatter.format(value)}%`;
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function buildScenario(
  input: FreelanceProjectInput,
  kind: ProjectScenarioKind,
  contingencyRate: number,
  estimatedHours: number,
  workCost: number,
): ProjectScenario {
  const contingencyFactor = contingencyRate / 100;
  const collectionFeeFactor = input.collectionFeeRate / 100;
  const marginFactor = input.targetMarginRate / 100;
  const contingencyHours = estimatedHours * contingencyFactor;
  const contingencyCost = workCost * contingencyFactor;
  const adjustedHours = estimatedHours + contingencyHours;
  const adjustedCost = workCost + contingencyCost + input.directExpenses;
  const priceBeforeTax =
    adjustedCost / (1 - collectionFeeFactor - marginFactor);
  const collectionFeeAmount = priceBeforeTax * collectionFeeFactor;
  const marginAmount =
    priceBeforeTax - adjustedCost - collectionFeeAmount;
  const taxAmount = priceBeforeTax * (input.taxRate / 100);

  return {
    kind,
    contingencyRate,
    contingencyHours,
    contingencyCost,
    adjustedHours,
    adjustedCost,
    priceBeforeTax,
    collectionFeeAmount,
    marginAmount,
    achievedMarginRate: (marginAmount / priceBeforeTax) * 100,
    taxAmount,
    clientTotal: priceBeforeTax + taxAmount,
    effectiveNetHourlyRate:
      (priceBeforeTax - input.directExpenses - collectionFeeAmount) /
      adjustedHours,
  };
}

function validateAndBuildPhases(
  input: FreelanceProjectInput,
): ProjectPhaseResult[] {
  if (!Array.isArray(input.phases) || input.phases.length === 0) {
    throw new RangeError("Agrega al menos una fase válida.");
  }

  if (input.phases.length > 20) {
    throw new RangeError("El proyecto admite un máximo de 20 fases.");
  }

  if (input.baseHourlyRate !== undefined) {
    validatePositiveFinite(input.baseHourlyRate, "tarifa base");
  }

  return input.phases.map((phase, index) => {
    const name = phase.name.trim();

    if (!name || name.length > 60) {
      throw new RangeError(
        `La fase ${index + 1} necesita un nombre de 1 a 60 caracteres.`,
      );
    }

    validatePositiveFinite(phase.hours, `horas de ${name}`);

    if (phase.hourlyRate !== undefined) {
      validatePositiveFinite(phase.hourlyRate, `tarifa de ${name}`);
    }

    const hourlyRate = phase.hourlyRate ?? input.baseHourlyRate;

    if (hourlyRate === undefined) {
      throw new RangeError(
        `Agrega una tarifa base o una tarifa específica para ${name}.`,
      );
    }

    return {
      name,
      hours: phase.hours,
      hourlyRate,
      cost: phase.hours * hourlyRate,
    };
  });
}

function validateProjectInput(input: FreelanceProjectInput): void {
  validateNonNegativeFinite(input.directExpenses, "gastos directos");
  validateRange(
    input.recommendedContingencyRate,
    0,
    100,
    "contingencia recomendada",
  );
  validateRange(
    input.conservativeContingencyRate,
    input.recommendedContingencyRate,
    100,
    "contingencia conservadora",
  );
  validateRange(input.collectionFeeRate, 0, 50, "comisión sobre cobros");
  validateRange(input.targetMarginRate, 0, 80, "margen objetivo");
  validateRange(input.taxRate, 0, 99.99, "impuesto agregado");
  validatePaymentRates(input.paymentRates);

  if (input.collectionFeeRate + input.targetMarginRate >= 100) {
    throw new RangeError(
      "La comisión y el margen suman 100% o más; no existe un precio que alcance ese objetivo.",
    );
  }
}

function validatePaymentRates(rates: ProjectPaymentRates): void {
  validateRange(rates.deposit, 0, 100, "anticipo");
  validateRange(rates.progress, 0, 100, "pago de avance");
  validateRange(rates.final, 0, 100, "pago final");

  const total = rates.deposit + rates.progress + rates.final;

  if (Math.abs(total - 100) > PAYMENT_TOLERANCE) {
    throw new RangeError("Los porcentajes del plan de pagos deben sumar 100%.");
  }
}

function buildWarnings(
  input: FreelanceProjectInput,
  workCost: number,
): ProjectWarning[] {
  const warnings: ProjectWarning[] = [];

  if (input.recommendedContingencyRate === 0) {
    warnings.push("no_contingency");
  }
  if (input.recommendedContingencyRate > 50) {
    warnings.push("high_contingency");
  }
  if (input.directExpenses > workCost) {
    warnings.push("expenses_exceed_work");
  }
  if (input.taxRate === 0) warnings.push("no_tax");
  if (input.paymentRates.deposit < 20) warnings.push("low_deposit");

  return warnings;
}

function getProposedPriceStatus(
  effectiveRate: number,
  weightedRate: number,
  achievedMargin: number,
  targetMargin: number,
): ProposedPriceStatus {
  if (effectiveRate + STATUS_TOLERANCE < weightedRate) {
    return "below_base";
  }

  if (achievedMargin + STATUS_TOLERANCE < targetMargin) {
    return "tight";
  }

  return "healthy";
}

function validateRange(
  value: number,
  minimum: number,
  maximum: number,
  label: string,
): void {
  if (!Number.isFinite(value) || value < minimum || value > maximum) {
    throw new RangeError(
      `${label} debe estar entre ${minimum} y ${maximum}.`,
    );
  }
}

function validatePositiveFinite(value: number, label: string): void {
  validateNonNegativeFinite(value, label);

  if (value <= 0) {
    throw new RangeError(`${label} debe ser mayor que cero.`);
  }
}

function validateNonNegativeFinite(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`Revisa el valor de ${label}.`);
  }
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

  const separator = lastComma !== -1 ? "," : lastDot !== -1 ? "." : null;

  if (!separator) return value;

  const parts = value.split(separator);

  if (
    parts.length > 2 &&
    parts.every(Boolean) &&
    parts.slice(1).every((part) => part.length === 3)
  ) {
    return parts.join("");
  }

  if (parts.length !== 2 || !parts[0] || !parts[1]) return value;

  if (!preferDecimal && parts[1].length === 3 && parts[0].length <= 3) {
    return parts.join("");
  }

  return `${parts[0]}.${parts[1]}`;
}
