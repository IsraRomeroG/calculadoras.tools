export type DebtStrategy = "snowball" | "avalanche" | "custom";

export interface DebtInput {
  id: string;
  name: string;
  balance: number;
  annualRate: number;
  minimumPayment: number;
}

export interface DebtPaymentRow {
  month: number;
  debtId: string;
  debtName: string;
  beginningBalance: number;
  interest: number;
  minimumPayment: number;
  extraPayment: number;
  totalPayment: number;
  endingBalance: number;
}

export interface DebtMilestone {
  debtId: string;
  debtName: string;
  payoffMonth: number;
  totalInterest: number;
  releasedMinimum: number;
  budgetAfterPayoff: number;
  payoffPosition: number;
}

export interface DebtPlan {
  strategy: DebtStrategy | "minimums";
  viable: boolean;
  budget: number;
  months: number;
  totalInterest: number;
  totalPaid: number;
  remainingBalance: number;
  firstTargetId: string | null;
  rows: DebtPaymentRow[];
  milestones: DebtMilestone[];
  nextPayments: DebtPaymentRow[];
  warnings: string[];
}

export interface DebtPlanComparison {
  snowball: DebtPlan;
  avalanche: DebtPlan;
  minimums: DebtPlan;
  recommendedStrategy: "snowball" | "avalanche" | "tie";
  interestDifference: number;
  firstPayoffMonthDifference: number;
}

export interface DebtPlanOptions {
  debts: DebtInput[];
  budget: number;
  strategy: DebtStrategy;
  customOrder?: string[];
  maxMonths?: number;
}

interface WorkingDebt extends DebtInput {
  originalIndex: number;
  currentBalance: number;
  totalInterest: number;
}

const BALANCE_EPSILON = 0.005;
const DEFAULT_MAX_MONTHS = 600;

export function calculateDebtPlan({
  debts,
  budget,
  strategy,
  customOrder = [],
  maxMonths = DEFAULT_MAX_MONTHS,
}: DebtPlanOptions): DebtPlan {
  const workingDebts = createWorkingDebts(debts);
  const rows: DebtPaymentRow[] = [];
  const milestones: DebtMilestone[] = [];
  const warnings = new Set<string>();
  const minimums = debts.reduce(
    (total, debt) => total + debt.minimumPayment,
    0,
  );
  let targetId: string | null = null;
  let firstTargetId: string | null = null;
  let totalPaid = 0;
  let month = 0;

  if (budget + BALANCE_EPSILON < minimums) {
    return {
      strategy,
      viable: false,
      budget,
      months: 0,
      totalInterest: 0,
      totalPaid: 0,
      remainingBalance: debts.reduce((total, debt) => total + debt.balance, 0),
      firstTargetId: null,
      rows,
      milestones,
      nextPayments: [],
      warnings: ["El presupuesto mensual no cubre todos los pagos mínimos."],
    };
  }

  while (hasActiveDebt(workingDebts) && month < maxMonths) {
    month += 1;
    const activeAtStart = workingDebts.filter(isActive);
    const monthRows = new Map<string, DebtPaymentRow>();
    let remainingBudget = budget;

    activeAtStart.forEach((debt) => {
      const interest = debt.currentBalance * (debt.annualRate / 12 / 100);
      const balanceWithInterest = debt.currentBalance + interest;
      const minimumPayment = Math.min(debt.minimumPayment, balanceWithInterest);
      const endingBalance = normalizeBalance(balanceWithInterest - minimumPayment);

      debt.totalInterest += interest;
      debt.currentBalance = endingBalance;
      remainingBudget -= minimumPayment;
      totalPaid += minimumPayment;
      monthRows.set(debt.id, {
        month,
        debtId: debt.id,
        debtName: debt.name,
        beginningBalance: balanceWithInterest - interest,
        interest,
        minimumPayment,
        extraPayment: 0,
        totalPayment: minimumPayment,
        endingBalance,
      });
    });

    remainingBudget = Math.max(remainingBudget, 0);

    while (remainingBudget > BALANCE_EPSILON && hasActiveDebt(workingDebts)) {
      const currentTarget = workingDebts.find(
        (debt) => debt.id === targetId && isActive(debt),
      );
      const target =
        currentTarget ??
        orderActiveDebts(workingDebts, strategy, customOrder)[0] ??
        null;

      if (!target) {
        break;
      }

      targetId = target.id;
      firstTargetId ??= target.id;
      const extraPayment = Math.min(remainingBudget, target.currentBalance);
      const row = monthRows.get(target.id);

      target.currentBalance = normalizeBalance(target.currentBalance - extraPayment);
      remainingBudget -= extraPayment;
      totalPaid += extraPayment;

      if (row) {
        row.extraPayment += extraPayment;
        row.totalPayment += extraPayment;
        row.endingBalance = target.currentBalance;
      }

      if (!isActive(target)) {
        targetId = null;
      }
    }

    monthRows.forEach((row) => {
      const debt = workingDebts.find((item) => item.id === row.debtId);

      if (!debt) {
        return;
      }

      row.endingBalance = debt.currentBalance;
      rows.push(row);

      if (
        row.endingBalance >= row.beginningBalance - BALANCE_EPSILON &&
        row.endingBalance > BALANCE_EPSILON
      ) {
        warnings.add(
          `${debt.name}: el saldo crece o no disminuye en algunos meses.`,
        );
      }

      if (
        row.endingBalance <= BALANCE_EPSILON &&
        !milestones.some((milestone) => milestone.debtId === debt.id)
      ) {
        milestones.push({
          debtId: debt.id,
          debtName: debt.name,
          payoffMonth: month,
          totalInterest: debt.totalInterest,
          releasedMinimum: debt.minimumPayment,
          budgetAfterPayoff: budget,
          payoffPosition: milestones.length + 1,
        });
      }
    });
  }

  const remainingBalance = workingDebts.reduce(
    (total, debt) => total + debt.currentBalance,
    0,
  );
  const viable = remainingBalance <= BALANCE_EPSILON;

  if (!viable) {
    warnings.add(
      `El plan no liquida todas las deudas dentro de ${maxMonths} meses.`,
    );
  }

  return {
    strategy,
    viable,
    budget,
    months: month,
    totalInterest: workingDebts.reduce(
      (total, debt) => total + debt.totalInterest,
      0,
    ),
    totalPaid,
    remainingBalance,
    firstTargetId,
    rows,
    milestones,
    nextPayments: rows.filter((row) => row.month === 1),
    warnings: [...warnings],
  };
}

export function calculateMinimumOnlyPlan(
  debts: DebtInput[],
  maxMonths = DEFAULT_MAX_MONTHS,
): DebtPlan {
  const workingDebts = createWorkingDebts(debts);
  const rows: DebtPaymentRow[] = [];
  const milestones: DebtMilestone[] = [];
  const warnings = new Set<string>();
  let totalPaid = 0;
  let month = 0;

  while (hasActiveDebt(workingDebts) && month < maxMonths) {
    month += 1;

    workingDebts.filter(isActive).forEach((debt) => {
      const beginningBalance = debt.currentBalance;
      const interest = beginningBalance * (debt.annualRate / 12 / 100);
      const balanceWithInterest = beginningBalance + interest;
      const payment = Math.min(debt.minimumPayment, balanceWithInterest);

      debt.totalInterest += interest;
      debt.currentBalance = normalizeBalance(balanceWithInterest - payment);
      totalPaid += payment;
      rows.push({
        month,
        debtId: debt.id,
        debtName: debt.name,
        beginningBalance,
        interest,
        minimumPayment: payment,
        extraPayment: 0,
        totalPayment: payment,
        endingBalance: debt.currentBalance,
      });

      if (
        debt.currentBalance >= beginningBalance - BALANCE_EPSILON &&
        debt.currentBalance > BALANCE_EPSILON
      ) {
        warnings.add(`${debt.name}: el pago mínimo no reduce el saldo.`);
      }

      if (
        !isActive(debt) &&
        !milestones.some((milestone) => milestone.debtId === debt.id)
      ) {
        milestones.push({
          debtId: debt.id,
          debtName: debt.name,
          payoffMonth: month,
          totalInterest: debt.totalInterest,
          releasedMinimum: debt.minimumPayment,
          budgetAfterPayoff: Math.max(
            workingDebts
              .filter(isActive)
              .reduce((total, item) => total + item.minimumPayment, 0),
            0,
          ),
          payoffPosition: milestones.length + 1,
        });
      }
    });
  }

  const remainingBalance = workingDebts.reduce(
    (total, debt) => total + debt.currentBalance,
    0,
  );
  const viable = remainingBalance <= BALANCE_EPSILON;

  if (!viable) {
    warnings.add(
      `Pagar solo mínimos no liquida todas las deudas dentro de ${maxMonths} meses.`,
    );
  }

  return {
    strategy: "minimums",
    viable,
    budget: debts.reduce((total, debt) => total + debt.minimumPayment, 0),
    months: month,
    totalInterest: workingDebts.reduce(
      (total, debt) => total + debt.totalInterest,
      0,
    ),
    totalPaid,
    remainingBalance,
    firstTargetId: null,
    rows,
    milestones,
    nextPayments: rows.filter((row) => row.month === 1),
    warnings: [...warnings],
  };
}

export function compareDebtStrategies({
  debts,
  budget,
  customOrder = [],
  maxMonths = DEFAULT_MAX_MONTHS,
}: Omit<DebtPlanOptions, "strategy">): DebtPlanComparison {
  const snowball = calculateDebtPlan({
    debts,
    budget,
    strategy: "snowball",
    customOrder,
    maxMonths,
  });
  const avalanche = calculateDebtPlan({
    debts,
    budget,
    strategy: "avalanche",
    customOrder,
    maxMonths,
  });
  const minimums = calculateMinimumOnlyPlan(debts, maxMonths);
  const difference = snowball.totalInterest - avalanche.totalInterest;
  const recommendedStrategy =
    Math.abs(difference) < BALANCE_EPSILON
      ? "tie"
      : difference > 0
        ? "avalanche"
        : "snowball";

  return {
    snowball,
    avalanche,
    minimums,
    recommendedStrategy,
    interestDifference: Math.abs(difference),
    firstPayoffMonthDifference: Math.abs(
      (snowball.milestones[0]?.payoffMonth ?? snowball.months) -
        (avalanche.milestones[0]?.payoffMonth ?? avalanche.months),
    ),
  };
}

export function calculateMonthlyBudget(
  debts: DebtInput[],
  amount: number,
  captureMode: "extra" | "total",
): number {
  const minimums = debts.reduce(
    (total, debt) => total + debt.minimumPayment,
    0,
  );

  return captureMode === "extra" ? minimums + amount : amount;
}

export function addMonthsToYearMonth(yearMonth: string, months: number): string {
  const [year, month] = yearMonth.split("-").map(Number);

  if (!year || !month || month < 1 || month > 12) {
    return yearMonth;
  }

  const date = new Date(Date.UTC(year, month - 1 + Math.max(months - 1, 0), 1));

  return new Intl.DateTimeFormat("es-MX", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function createWorkingDebts(debts: DebtInput[]): WorkingDebt[] {
  return debts.map((debt, originalIndex) => ({
    ...debt,
    originalIndex,
    currentBalance: debt.balance,
    totalInterest: 0,
  }));
}

function orderActiveDebts(
  debts: WorkingDebt[],
  strategy: DebtStrategy,
  customOrder: string[],
): WorkingDebt[] {
  const customPositions = new Map(
    customOrder.map((debtId, index) => [debtId, index]),
  );

  return debts.filter(isActive).sort((a, b) => {
    if (strategy === "custom") {
      return (
        (customPositions.get(a.id) ?? a.originalIndex) -
        (customPositions.get(b.id) ?? b.originalIndex)
      );
    }

    if (strategy === "snowball") {
      return (
        a.currentBalance - b.currentBalance ||
        b.annualRate - a.annualRate ||
        a.originalIndex - b.originalIndex
      );
    }

    return (
      b.annualRate - a.annualRate ||
      a.currentBalance - b.currentBalance ||
      a.originalIndex - b.originalIndex
    );
  });
}

function hasActiveDebt(debts: WorkingDebt[]): boolean {
  return debts.some(isActive);
}

function isActive(debt: WorkingDebt): boolean {
  return debt.currentBalance > BALANCE_EPSILON;
}

function normalizeBalance(balance: number): number {
  return balance <= BALANCE_EPSILON ? 0 : balance;
}
