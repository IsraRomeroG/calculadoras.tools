export interface SavingsGoalBaseInput {
  targetAmount: number;
  currentSavings: number;
  annualRate: number;
  adjustForInflation?: boolean;
  inflationRate?: number;
  startYearMonth?: string;
  maxMonths?: number;
}

export interface RequiredMonthlyInput extends SavingsGoalBaseInput {
  durationMonths: number;
}

export interface TimeToGoalInput extends SavingsGoalBaseInput {
  monthlyContribution: number;
}

export interface SavingsGoalRow {
  month: number;
  date: string;
  beginningBalance: number;
  interest: number;
  contribution: number;
  endingBalance: number;
  targetAmount: number;
  progress: number;
}

export interface SavingsGoalMilestone {
  percent: 25 | 50 | 75 | 100;
  month: number;
  date: string;
  reachedBeforePlan: boolean;
}

export interface SavingsGoalPlan {
  viable: boolean;
  months: number;
  achievedMonth: number | null;
  targetAmount: number;
  finalTargetAmount: number;
  currentSavings: number;
  monthlyContribution: number;
  nextContribution: number;
  lastContribution: number;
  totalFutureContributions: number;
  totalContributed: number;
  interestEarned: number;
  finalBalance: number;
  dependenceOnReturn: number;
  rows: SavingsGoalRow[];
  milestones: SavingsGoalMilestone[];
  warnings: string[];
}

const DEFAULT_MAX_MONTHS = 1200;
const MONEY_EPSILON = 0.005;
const MILESTONES = [25, 50, 75, 100] as const;

export function calculateRequiredMonthlyPlan(
  input: RequiredMonthlyInput,
): SavingsGoalPlan {
  const durationMonths = Math.max(Math.trunc(input.durationMonths), 0);
  const finalTargetAmount = targetAtMonth(input, durationMonths);
  const monthlyRate = input.annualRate / 12 / 100;

  if (input.currentSavings + MONEY_EPSILON >= finalTargetAmount) {
    const completedPlan = {
      ...simulatePlan({
        ...input,
        monthlyContribution: 0,
        maxMonths: durationMonths,
        stopAtGoal: true,
        contributionTargetAmount: finalTargetAmount,
      }),
      viable: true,
      achievedMonth: 0,
      finalTargetAmount,
      monthlyContribution: 0,
    };

    return {
      ...completedPlan,
      warnings: buildWarnings(input, completedPlan),
    };
  }

  let monthlyContribution = calculateRequiredContribution(
    finalTargetAmount,
    input.currentSavings,
    monthlyRate,
    durationMonths,
  );

  monthlyContribution = roundUpCurrency(Math.max(monthlyContribution, 0));

  let plan = simulatePlan({
    ...input,
    monthlyContribution,
    maxMonths: durationMonths,
    stopAtGoal: false,
    contributionTargetAmount: finalTargetAmount,
  });

  while (
    durationMonths > 0 &&
    plan.finalBalance + MONEY_EPSILON < finalTargetAmount
  ) {
    monthlyContribution = roundCurrency(monthlyContribution + 0.01);
    plan = simulatePlan({
      ...input,
      monthlyContribution,
      maxMonths: durationMonths,
      stopAtGoal: false,
      contributionTargetAmount: finalTargetAmount,
    });
  }

  const achievedMonth =
    input.currentSavings + MONEY_EPSILON >= finalTargetAmount
      ? 0
      : plan.rows.find(
          (row) => row.endingBalance + MONEY_EPSILON >= finalTargetAmount,
        )?.month ?? null;
  const normalizedPlan = {
    ...plan,
    viable:
      achievedMonth !== null &&
      plan.finalBalance + MONEY_EPSILON >= finalTargetAmount,
    achievedMonth,
    monthlyContribution,
    finalTargetAmount,
  };

  return {
    ...normalizedPlan,
    warnings: buildWarnings(input, normalizedPlan),
  };
}

export function calculateTimeToGoalPlan(input: TimeToGoalInput): SavingsGoalPlan {
  const plan = simulatePlan({
    ...input,
    maxMonths: input.maxMonths ?? DEFAULT_MAX_MONTHS,
    stopAtGoal: true,
  });

  return {
    ...plan,
    warnings: buildWarnings(input, plan),
  };
}

export function calculateConservativePlan(
  input: RequiredMonthlyInput | TimeToGoalInput,
): SavingsGoalPlan {
  return "durationMonths" in input
    ? calculateRequiredMonthlyPlan({ ...input, annualRate: 0 })
    : calculateTimeToGoalPlan({ ...input, annualRate: 0 });
}

export function monthsBetweenInclusive(
  startYearMonth: string,
  targetYearMonth: string,
): number {
  const start = parseYearMonth(startYearMonth);
  const target = parseYearMonth(targetYearMonth);

  if (!start || !target) {
    return Number.NaN;
  }

  return (target.year - start.year) * 12 + target.month - start.month + 1;
}

export function addMonthsToYearMonth(
  startYearMonth: string,
  contributionMonth: number,
): string {
  const parsed = parseYearMonth(startYearMonth);

  if (!parsed) {
    return startYearMonth;
  }

  const date = new Date(
    Date.UTC(parsed.year, parsed.month - 1 + Math.max(contributionMonth - 1, 0), 1),
  );

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function addMonthsToYearMonthValue(
  startYearMonth: string,
  monthsToAdd: number,
): string {
  const parsed = parseYearMonth(startYearMonth);

  if (!parsed) {
    return startYearMonth;
  }

  const date = new Date(
    Date.UTC(parsed.year, parsed.month - 1 + monthsToAdd, 1),
  );

  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function roundCurrency(value: number): number {
  const rounded = Math.round((value + Number.EPSILON) * 100) / 100;

  return Object.is(rounded, -0) ? 0 : rounded;
}

export function roundUpCurrency(value: number): number {
  const rounded = Math.ceil((value - Number.EPSILON) * 100) / 100;

  return Object.is(rounded, -0) ? 0 : rounded;
}

function simulatePlan({
  targetAmount,
  currentSavings,
  annualRate,
  monthlyContribution,
  adjustForInflation = false,
  inflationRate = 0,
  startYearMonth = "2026-01",
  maxMonths = DEFAULT_MAX_MONTHS,
  stopAtGoal,
  contributionTargetAmount,
}: SavingsGoalBaseInput & {
  monthlyContribution: number;
  stopAtGoal: boolean;
  contributionTargetAmount?: number;
}): SavingsGoalPlan {
  const rows: SavingsGoalRow[] = [];
  const milestones: SavingsGoalMilestone[] = [];
  const monthlyRate = annualRate / 12 / 100;
  let balance = currentSavings;
  let achievedMonth: number | null =
    currentSavings + MONEY_EPSILON >= targetAmount ? 0 : null;
  let totalFutureContributions = 0;
  let month = 0;

  MILESTONES.forEach((percent) => {
    if (currentSavings + MONEY_EPSILON >= targetAmount * (percent / 100)) {
      milestones.push({
        percent,
        month: 0,
        date: "At the start",
        reachedBeforePlan: true,
      });
    }
  });

  while (month < maxMonths && (!stopAtGoal || achievedMonth === null)) {
    month += 1;
    const beginningBalance = balance;
    const interest = beginningBalance * monthlyRate;
    const balanceAfterInterest = beginningBalance + interest;
    const monthlyTarget = targetAtMonth(
      { targetAmount, adjustForInflation, inflationRate },
      month,
    );
    const contributionGoal = contributionTargetAmount ?? monthlyTarget;
    const contribution = roundCurrency(
      Math.min(
        monthlyContribution,
        Math.max(contributionGoal - balanceAfterInterest, 0),
      ),
    );

    balance = balanceAfterInterest + contribution;
    totalFutureContributions += contribution;

    const row: SavingsGoalRow = {
      month,
      date: addMonthsToYearMonth(startYearMonth, month),
      beginningBalance,
      interest,
      contribution,
      endingBalance: balance,
      targetAmount: monthlyTarget,
      progress: monthlyTarget > 0 ? Math.min((balance / monthlyTarget) * 100, 100) : 100,
    };

    rows.push(row);
    addReachedMilestones(milestones, row);

    if (balance + MONEY_EPSILON >= monthlyTarget && achievedMonth === null) {
      achievedMonth = month;
    }
  }

  const finalTargetAmount = targetAtMonth(
    { targetAmount, adjustForInflation, inflationRate },
    month,
  );
  const totalContributed = currentSavings + totalFutureContributions;
  const interestEarned = balance - totalContributed;
  const viable = achievedMonth !== null;

  return {
    viable,
    months: month,
    achievedMonth,
    targetAmount,
    finalTargetAmount,
    currentSavings,
    monthlyContribution,
    nextContribution: rows[0]?.contribution ?? 0,
    lastContribution: rows.at(-1)?.contribution ?? 0,
    totalFutureContributions,
    totalContributed,
    interestEarned,
    finalBalance: balance,
    dependenceOnReturn: balance > 0 ? Math.max((interestEarned / balance) * 100, 0) : 0,
    rows,
    milestones,
    warnings: [],
  };
}

function calculateRequiredContribution(
  targetAmount: number,
  currentSavings: number,
  monthlyRate: number,
  durationMonths: number,
): number {
  if (durationMonths <= 0 || currentSavings >= targetAmount) {
    return 0;
  }

  if (monthlyRate === 0) {
    return (targetAmount - currentSavings) / durationMonths;
  }

  const growth = Math.pow(1 + monthlyRate, durationMonths);

  return ((targetAmount - currentSavings * growth) * monthlyRate) / (growth - 1);
}

function targetAtMonth(
  {
    targetAmount,
    adjustForInflation = false,
    inflationRate = 0,
  }: Pick<
    SavingsGoalBaseInput,
    "targetAmount" | "adjustForInflation" | "inflationRate"
  >,
  month: number,
): number {
  if (!adjustForInflation || inflationRate === 0 || month <= 0) {
    return targetAmount;
  }

  return targetAmount * Math.pow(1 + inflationRate / 12 / 100, month);
}

function addReachedMilestones(
  milestones: SavingsGoalMilestone[],
  row: SavingsGoalRow,
): void {
  MILESTONES.forEach((percent) => {
    if (
      !milestones.some((milestone) => milestone.percent === percent) &&
      row.endingBalance + MONEY_EPSILON >= row.targetAmount * (percent / 100)
    ) {
      milestones.push({
        percent,
        month: row.month,
        date: row.date,
        reachedBeforePlan: false,
      });
    }
  });
}

function buildWarnings(
  input: SavingsGoalBaseInput & Partial<RequiredMonthlyInput>,
  plan: SavingsGoalPlan,
): string[] {
  const warnings: string[] = [];

  if (input.annualRate > 15) {
    warnings.push(
      "The return rate is optimistic and may not be sustained for the full term.",
    );
  }

  if (
    input.adjustForInflation &&
    (input.inflationRate ?? 0) >= input.annualRate
  ) {
    warnings.push(
      "Estimated inflation equals or exceeds the return; the goal grows as fast as or faster than investment gains.",
    );
  }

  if (!input.adjustForInflation && (input.durationMonths ?? plan.months) > 24) {
    warnings.push(
      "For terms over 24 months, inflation may increase the goal's future cost.",
    );
  }

  if ((input.durationMonths ?? Number.POSITIVE_INFINITY) < 3) {
    warnings.push(
      "A short term concentrates the goal into few contributions and increases required monthly savings.",
    );
  }

  if (plan.dependenceOnReturn > 25) {
    warnings.push(
      "More than 25% of the ending balance depends on an estimated return that is not guaranteed.",
    );
  }

  if (!plan.viable) {
    warnings.push(
      `The goal is not reached within ${input.maxMonths ?? DEFAULT_MAX_MONTHS} months with these inputs.`,
    );
  }

  return warnings;
}

function parseYearMonth(value: string): { year: number; month: number } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);

  return month >= 1 && month <= 12 ? { year, month } : null;
}

