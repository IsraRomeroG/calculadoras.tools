import { describe, expect, it } from "vitest";
import {
  calculateDebtPlan,
  calculateMinimumOnlyPlan,
  calculateMonthlyBudget,
  compareDebtStrategies,
  type DebtInput,
} from "./debtPayoff";

const debts: DebtInput[] = [
  {
    id: "card",
    name: "Tarjeta",
    balance: 20_000,
    annualRate: 45,
    minimumPayment: 1_000,
  },
  {
    id: "loan",
    name: "Préstamo",
    balance: 50_000,
    annualRate: 24,
    minimumPayment: 2_000,
  },
  {
    id: "months",
    name: "Meses sin intereses",
    balance: 8_000,
    annualRate: 0,
    minimumPayment: 500,
  },
];

describe("debt payoff strategies", () => {
  it("targets the lowest balance with snowball and highest rate with avalanche", () => {
    const snowball = calculateDebtPlan({
      debts,
      budget: 5_500,
      strategy: "snowball",
    });
    const avalanche = calculateDebtPlan({
      debts,
      budget: 5_500,
      strategy: "avalanche",
    });

    expect(snowball.firstTargetId).toBe("months");
    expect(avalanche.firstTargetId).toBe("card");
    expect(avalanche.totalInterest).toBeLessThan(snowball.totalInterest);
  });

  it("keeps the monthly budget constant and rolls surplus in the same month", () => {
    const plan = calculateDebtPlan({
      debts: [
        {
          id: "small",
          name: "Pequeña",
          balance: 100,
          annualRate: 0,
          minimumPayment: 20,
        },
        {
          id: "large",
          name: "Grande",
          balance: 1_000,
          annualRate: 0,
          minimumPayment: 100,
        },
      ],
      budget: 500,
      strategy: "snowball",
    });
    const firstMonth = plan.rows.filter((row) => row.month === 1);

    expect(firstMonth.reduce((total, row) => total + row.totalPayment, 0)).toBe(
      500,
    );
    expect(firstMonth.find((row) => row.debtId === "small")?.totalPayment).toBe(
      100,
    );
    expect(firstMonth.find((row) => row.debtId === "large")?.totalPayment).toBe(
      400,
    );
    expect(plan.months).toBe(3);
  });

  it("uses deterministic tie breakers", () => {
    const plan = calculateDebtPlan({
      debts: [
        {
          id: "low-rate",
          name: "Tasa baja",
          balance: 1_000,
          annualRate: 10,
          minimumPayment: 100,
        },
        {
          id: "high-rate",
          name: "Tasa alta",
          balance: 1_000,
          annualRate: 20,
          minimumPayment: 108.33333333333333,
        },
      ],
      budget: 300,
      strategy: "snowball",
    });

    expect(plan.firstTargetId).toBe("high-rate");
  });

  it("supports a custom order", () => {
    const plan = calculateDebtPlan({
      debts,
      budget: 5_500,
      strategy: "custom",
      customOrder: ["loan", "months", "card"],
    });

    expect(plan.firstTargetId).toBe("loan");
  });

  it("rejects a budget below the required minimum payments", () => {
    const plan = calculateDebtPlan({
      debts,
      budget: 3_000,
      strategy: "avalanche",
    });

    expect(plan.viable).toBe(false);
    expect(plan.rows).toHaveLength(0);
    expect(plan.warnings.join(" ")).toContain("no cubre");
  });
});

describe("minimum-only plan and comparison", () => {
  it("does not reassign a released minimum in the baseline", () => {
    const plan = calculateMinimumOnlyPlan([
      {
        id: "small",
        name: "Pequeña",
        balance: 100,
        annualRate: 0,
        minimumPayment: 100,
      },
      {
        id: "large",
        name: "Grande",
        balance: 1_000,
        annualRate: 0,
        minimumPayment: 100,
      },
    ]);
    const secondMonthTotal = plan.rows
      .filter((row) => row.month === 2)
      .reduce((total, row) => total + row.totalPayment, 0);

    expect(secondMonthTotal).toBe(100);
    expect(plan.months).toBe(10);
  });

  it("marks a plan as nonviable when payments do not cover interest", () => {
    const plan = calculateMinimumOnlyPlan(
      [
        {
          id: "card",
          name: "Tarjeta",
          balance: 10_000,
          annualRate: 120,
          minimumPayment: 500,
        },
      ],
      12,
    );

    expect(plan.viable).toBe(false);
    expect(plan.warnings.join(" ")).toContain("no reduce");
  });

  it("compares avalanche, snowball, and minimum payments", () => {
    const comparison = compareDebtStrategies({
      debts,
      budget: 5_500,
    });

    expect(comparison.recommendedStrategy).toBe("avalanche");
    expect(comparison.avalanche.months).toBeLessThan(comparison.minimums.months);
    expect(comparison.interestDifference).toBeGreaterThan(0);
  });

  it("calculates budget from extra or total capture modes", () => {
    expect(calculateMonthlyBudget(debts, 2_000, "extra")).toBe(5_500);
    expect(calculateMonthlyBudget(debts, 7_500, "total")).toBe(7_500);
  });
});
