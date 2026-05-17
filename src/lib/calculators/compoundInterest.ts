export type CompoundingFrequency =
  | "annual"
  | "semiannual"
  | "quarterly"
  | "monthly"
  | "biweekly"
  | "weekly"
  | "daily"
  | "continuous";

export type ContributionFrequency = "monthly" | "annual";
export type ContributionTiming = "beginning" | "end";

export type ParseCompoundInputResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative" | "too_many_decimals";
    };

export interface CompoundingFrequencyOption {
  value: CompoundingFrequency;
  label: string;
  periodsPerYear: number | null;
  periodsLabel: string;
}

export interface CompoundInterestInput {
  principal: number;
  annualRate: number;
  durationMonths: number;
  compoundingFrequency: CompoundingFrequency;
  contributionAmount: number;
  contributionFrequency: ContributionFrequency;
  contributionTiming: ContributionTiming;
  inflationRate?: number;
}

export interface ContributionEvent {
  month: number;
  amount: number;
  yearsRemaining: number;
}

export interface InflationAdjustment {
  realValue: number;
  purchasingPowerLoss: number;
  realRate: number;
}

export interface CompoundInterestResult {
  futureValue: number;
  totalContributions: number;
  totalInvested: number;
  interestEarned: number;
  investedMultiplier: number;
  returnOnInvested: number;
  inflation?: InflationAdjustment;
}

export interface AnnualGrowthRow {
  year: number;
  endingMonth: number;
  annualContributions: number;
  totalInvested: number;
  interestEarned: number;
  totalValue: number;
  milestone?: string;
}

export interface CompoundingComparisonRow {
  frequency: CompoundingFrequency;
  label: string;
  periodsLabel: string;
  futureValue: number;
  interestEarned: number;
  differenceVsAnnual: number;
  isBest: boolean;
}

export const COMPOUNDING_FREQUENCIES: CompoundingFrequencyOption[] = [
  {
    value: "annual",
    label: "Anual",
    periodsPerYear: 1,
    periodsLabel: "1",
  },
  {
    value: "semiannual",
    label: "Semestral",
    periodsPerYear: 2,
    periodsLabel: "2",
  },
  {
    value: "quarterly",
    label: "Trimestral",
    periodsPerYear: 4,
    periodsLabel: "4",
  },
  {
    value: "monthly",
    label: "Mensual",
    periodsPerYear: 12,
    periodsLabel: "12",
  },
  {
    value: "biweekly",
    label: "Quincenal",
    periodsPerYear: 24,
    periodsLabel: "24",
  },
  {
    value: "weekly",
    label: "Semanal",
    periodsPerYear: 52,
    periodsLabel: "52",
  },
  {
    value: "daily",
    label: "Diaria",
    periodsPerYear: 365,
    periodsLabel: "365",
  },
  {
    value: "continuous",
    label: "Continua",
    periodsPerYear: null,
    periodsLabel: "∞",
  },
];

const frequencyPeriods: Record<Exclude<CompoundingFrequency, "continuous">, number> =
  {
    annual: 1,
    semiannual: 2,
    quarterly: 4,
    monthly: 12,
    biweekly: 24,
    weekly: 52,
    daily: 365,
  };

const moneyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 2,
});

const oneDecimalFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 1,
});

const percentFormatter = new Intl.NumberFormat("es-MX", {
  maximumFractionDigits: 2,
});

export function calculateGrowthFactor(
  annualRate: number,
  compoundingFrequency: CompoundingFrequency,
  years: number,
): number {
  if (annualRate === 0 || years === 0) {
    return 1;
  }

  const rate = annualRate / 100;

  if (compoundingFrequency === "continuous") {
    return Math.exp(rate * years);
  }

  const periods = frequencyPeriods[compoundingFrequency];

  return Math.pow(1 + rate / periods, periods * years);
}

export function buildContributionEvents({
  durationMonths,
  contributionAmount,
  contributionFrequency,
  contributionTiming,
}: Pick<
  CompoundInterestInput,
  | "durationMonths"
  | "contributionAmount"
  | "contributionFrequency"
  | "contributionTiming"
>): ContributionEvent[] {
  if (durationMonths <= 0 || contributionAmount <= 0) {
    return [];
  }

  const events: ContributionEvent[] = [];
  const step = contributionFrequency === "monthly" ? 1 : 12;
  const firstMonth = contributionTiming === "beginning" ? 0 : step;
  const maxMonth =
    contributionTiming === "beginning" ? durationMonths - 1 : durationMonths;

  for (let month = firstMonth; month <= maxMonth; month += step) {
    events.push({
      month,
      amount: contributionAmount,
      yearsRemaining: (durationMonths - month) / 12,
    });
  }

  return events;
}

export function calculateCompoundInterest(
  input: CompoundInterestInput,
): CompoundInterestResult {
  const years = input.durationMonths / 12;
  const principalGrowth =
    input.principal *
    calculateGrowthFactor(input.annualRate, input.compoundingFrequency, years);
  const contributionEvents = buildContributionEvents(input);
  const contributionGrowth = contributionEvents.reduce(
    (total, event) =>
      total +
      event.amount *
        calculateGrowthFactor(
          input.annualRate,
          input.compoundingFrequency,
          event.yearsRemaining,
        ),
    0,
  );
  const futureValue = principalGrowth + contributionGrowth;
  const totalContributions = contributionEvents.reduce(
    (total, event) => total + event.amount,
    0,
  );
  const totalInvested = input.principal + totalContributions;
  const interestEarned = futureValue - totalInvested;
  const investedMultiplier =
    totalInvested > 0 ? futureValue / totalInvested : 0;
  const returnOnInvested =
    totalInvested > 0 ? (interestEarned / totalInvested) * 100 : 0;
  const inflation =
    typeof input.inflationRate === "number"
      ? calculateInflationAdjustment(
          futureValue,
          input.inflationRate,
          years,
          input.annualRate,
        )
      : undefined;

  return {
    futureValue,
    totalContributions,
    totalInvested,
    interestEarned,
    investedMultiplier,
    returnOnInvested,
    inflation,
  };
}

export function buildAnnualGrowthRows(
  input: CompoundInterestInput,
): AnnualGrowthRow[] {
  const rows: AnnualGrowthRow[] = [];
  const reachedMilestones = new Set<number>();
  let previousContributions = 0;

  for (let endingMonth = 12; endingMonth < input.durationMonths; endingMonth += 12) {
    rows.push(
      buildAnnualGrowthRow(
        input,
        endingMonth,
        previousContributions,
        reachedMilestones,
      ),
    );
    previousContributions = rows[rows.length - 1].totalInvested - input.principal;
  }

  if (input.durationMonths > 0) {
    rows.push(
      buildAnnualGrowthRow(
        input,
        input.durationMonths,
        previousContributions,
        reachedMilestones,
      ),
    );
  }

  return rows;
}

export function compareCompoundingFrequencies({
  principal,
  annualRate,
  durationMonths,
}: Pick<
  CompoundInterestInput,
  "principal" | "annualRate" | "durationMonths"
>): CompoundingComparisonRow[] {
  const years = durationMonths / 12;
  const annualFutureValue =
    principal * calculateGrowthFactor(annualRate, "annual", years);
  const rows = COMPOUNDING_FREQUENCIES.map((frequency) => {
    const futureValue =
      principal * calculateGrowthFactor(annualRate, frequency.value, years);

    return {
      frequency: frequency.value,
      label: frequency.label,
      periodsLabel: frequency.periodsLabel,
      futureValue,
      interestEarned: futureValue - principal,
      differenceVsAnnual: futureValue - annualFutureValue,
      isBest: false,
    };
  });
  const bestValue = Math.max(...rows.map((row) => row.futureValue));

  return rows.map((row) => ({
    ...row,
    isBest: Math.abs(row.futureValue - bestValue) < 0.000001,
  }));
}

export function calculateInflationAdjustment(
  futureValue: number,
  inflationRate: number,
  years: number,
  annualRate = 0,
): InflationAdjustment {
  const inflation = inflationRate / 100;
  const nominalRate = annualRate / 100;
  const realValue = futureValue / Math.pow(1 + inflation, years);

  return {
    realValue,
    purchasingPowerLoss: futureValue - realValue,
    realRate: (((1 + nominalRate) / (1 + inflation)) - 1) * 100,
  };
}

export function calculateRuleOf72(annualRate: number): number | null {
  return annualRate > 0 ? 72 / annualRate : null;
}

export function calculatePresentValue(
  targetAmount: number,
  annualRate: number,
  durationMonths: number,
  compoundingFrequency: CompoundingFrequency,
): number {
  return (
    targetAmount /
    calculateGrowthFactor(annualRate, compoundingFrequency, durationMonths / 12)
  );
}

export function calculateRequiredRate({
  presentValue,
  targetAmount,
  durationMonths,
  compoundingFrequency,
}: {
  presentValue: number;
  targetAmount: number;
  durationMonths: number;
  compoundingFrequency: CompoundingFrequency;
}): number {
  const years = durationMonths / 12;

  if (presentValue <= 0 || targetAmount <= 0 || years <= 0) {
    return Number.NaN;
  }

  if (compoundingFrequency === "continuous") {
    return (Math.log(targetAmount / presentValue) / years) * 100;
  }

  const periods = frequencyPeriods[compoundingFrequency];

  return (
    periods *
    (Math.pow(targetAmount / presentValue, 1 / (periods * years)) - 1) *
    100
  );
}

export function calculateTimeToTarget({
  presentValue,
  targetAmount,
  annualRate,
  compoundingFrequency,
}: {
  presentValue: number;
  targetAmount: number;
  annualRate: number;
  compoundingFrequency: CompoundingFrequency;
}): number {
  if (presentValue >= targetAmount) {
    return 0;
  }

  if (presentValue <= 0 || targetAmount <= 0 || annualRate <= 0) {
    return Number.POSITIVE_INFINITY;
  }

  const rate = annualRate / 100;
  const years =
    compoundingFrequency === "continuous"
      ? Math.log(targetAmount / presentValue) / rate
      : Math.log(targetAmount / presentValue) /
        (frequencyPeriods[compoundingFrequency] *
          Math.log(1 + rate / frequencyPeriods[compoundingFrequency]));

  return Math.round(years * 12);
}

export function parseMoneyInput(value: string): ParseCompoundInputResult {
  return parseNumericInput(value, {
    maxDecimals: 2,
    preferDecimal: false,
  });
}

export function parseRateInput(value: string): ParseCompoundInputResult {
  return parseNumericInput(value, {
    maxDecimals: 4,
    preferDecimal: true,
  });
}

export function parseDurationInput(value: string): ParseCompoundInputResult {
  return parseNumericInput(value, {
    maxDecimals: 2,
    preferDecimal: true,
  });
}

export function formatCurrency(value: number): string {
  return moneyFormatter.format(roundCurrency(value));
}

export function formatNumber(value: number): string {
  return numberFormatter.format(roundCurrency(value));
}

export function formatPercent(value: number): string {
  return `${percentFormatter.format(roundCurrency(value))}%`;
}

export function formatMultiplier(value: number): string {
  return `${oneDecimalFormatter.format(roundToOne(value))}×`;
}

export function formatDuration(months: number): string {
  if (!Number.isFinite(months)) {
    return "No alcanzable";
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "año" : "años"}`);
  }

  if (remainingMonths > 0 || parts.length === 0) {
    parts.push(
      `${remainingMonths} ${remainingMonths === 1 ? "mes" : "meses"}`,
    );
  }

  return parts.join(" y ");
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function buildAnnualGrowthRow(
  input: CompoundInterestInput,
  endingMonth: number,
  previousContributions: number,
  reachedMilestones: Set<number>,
): AnnualGrowthRow {
  const result = calculateCompoundInterest({
    ...input,
    durationMonths: endingMonth,
  });
  const contributionTotal = result.totalInvested - input.principal;
  const milestone = findMilestone(result.investedMultiplier, reachedMilestones);

  return {
    year: Math.ceil(endingMonth / 12),
    endingMonth,
    annualContributions: contributionTotal - previousContributions,
    totalInvested: result.totalInvested,
    interestEarned: result.interestEarned,
    totalValue: result.futureValue,
    milestone,
  };
}

function findMilestone(
  multiplier: number,
  reachedMilestones: Set<number>,
): string | undefined {
  const nextMilestone = [2, 3, 5].find(
    (milestone) => multiplier >= milestone && !reachedMilestones.has(milestone),
  );

  if (!nextMilestone) {
    return undefined;
  }

  reachedMilestones.add(nextMilestone);

  return `${nextMilestone}×`;
}

function roundToOne(value: number): number {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

function parseNumericInput(
  value: string,
  options: { maxDecimals: number; preferDecimal: boolean },
): ParseCompoundInputResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  if (/[-−]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const cleaned = removeKnownAffixes(trimmed);

  if (!cleaned || /[^0-9.,]/.test(cleaned)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeSeparators(cleaned, options.preferDecimal);

  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const decimalPart = normalized.split(".")[1];

  if (decimalPart && decimalPart.length > options.maxDecimals) {
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

function removeKnownAffixes(value: string): string {
  return value
    .replace(/\b(MXN|USD|EUR|ARS|COP|CLP|PEN|GTQ|CRC|UYU)\b/gi, "")
    .replace(/S\/|[$€₡Q%\s]/gi, "");
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
