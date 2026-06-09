import { describe, expect, it } from "vitest";
import {
  addMonthsToYearMonth,
  calculateConservativePlan,
  calculateRequiredMonthlyPlan,
  calculateTimeToGoalPlan,
  monthsBetweenInclusive,
} from "./savingsGoal";

describe("required monthly savings plan", () => {
  it("calculates 1000 per month for a 12000 goal over 12 months", () => {
    const plan = calculateRequiredMonthlyPlan({
      targetAmount: 12_000,
      currentSavings: 0,
      annualRate: 0,
      durationMonths: 12,
      startYearMonth: "2026-06",
    });

    expect(plan.monthlyContribution).toBe(1_000);
    expect(plan.rows).toHaveLength(12);
    expect(plan.finalBalance).toBe(12_000);
    expect(plan.milestones.map((milestone) => milestone.percent)).toEqual([
      25, 50, 75, 100,
    ]);
  });

  it("rounds the required contribution upward and reaches the target", () => {
    const plan = calculateRequiredMonthlyPlan({
      targetAmount: 10_000,
      currentSavings: 0,
      annualRate: 0,
      durationMonths: 3,
    });

    expect(plan.monthlyContribution).toBe(3_333.34);
    expect(plan.finalBalance).toBeGreaterThanOrEqual(10_000);
    expect(plan.lastContribution).toBe(3_333.32);
  });

  it("reduces the required contribution when a return is included", () => {
    const withReturn = calculateRequiredMonthlyPlan({
      targetAmount: 100_000,
      currentSavings: 20_000,
      annualRate: 6,
      durationMonths: 60,
    });
    const conservative = calculateConservativePlan({
      targetAmount: 100_000,
      currentSavings: 20_000,
      annualRate: 6,
      durationMonths: 60,
    });

    expect(withReturn.monthlyContribution).toBeLessThan(
      conservative.monthlyContribution,
    );
    expect(withReturn.interestEarned).toBeGreaterThan(0);
  });

  it("adjusts a fixed-date target for inflation", () => {
    const plan = calculateRequiredMonthlyPlan({
      targetAmount: 100_000,
      currentSavings: 0,
      annualRate: 0,
      durationMonths: 24,
      adjustForInflation: true,
      inflationRate: 4,
    });

    expect(plan.finalTargetAmount).toBeGreaterThan(100_000);
    expect(plan.monthlyContribution).toBeGreaterThan(100_000 / 24);
  });

  it("shows a completed goal without future contributions", () => {
    const plan = calculateRequiredMonthlyPlan({
      targetAmount: 50_000,
      currentSavings: 60_000,
      annualRate: 5,
      durationMonths: 12,
    });

    expect(plan.monthlyContribution).toBe(0);
    expect(plan.nextContribution).toBe(0);
    expect(plan.viable).toBe(true);
    expect(plan.rows).toHaveLength(0);
    expect(plan.interestEarned).toBe(0);
  });

  it("does not mark the original amount as completed when inflation raises the future target", () => {
    const plan = calculateRequiredMonthlyPlan({
      targetAmount: 50_000,
      currentSavings: 50_000,
      annualRate: 0,
      durationMonths: 24,
      adjustForInflation: true,
      inflationRate: 4,
    });

    expect(plan.finalTargetAmount).toBeGreaterThan(50_000);
    expect(plan.achievedMonth).not.toBe(0);
    expect(plan.monthlyContribution).toBeGreaterThan(0);
    expect(plan.rows[0].contribution).toBe(plan.monthlyContribution);
  });
});

describe("time to savings goal", () => {
  it("reaches a zero-return goal in the expected month", () => {
    const plan = calculateTimeToGoalPlan({
      targetAmount: 12_000,
      currentSavings: 0,
      annualRate: 0,
      monthlyContribution: 1_000,
      startYearMonth: "2026-06",
    });

    expect(plan.months).toBe(12);
    expect(plan.achievedMonth).toBe(12);
    expect(plan.rows.at(-1)?.date).toBe("mayo de 2027");
  });

  it("adjusts the last contribution instead of oversaving", () => {
    const plan = calculateTimeToGoalPlan({
      targetAmount: 10_000,
      currentSavings: 0,
      annualRate: 0,
      monthlyContribution: 3_000,
    });

    expect(plan.months).toBe(4);
    expect(plan.lastContribution).toBe(1_000);
    expect(plan.finalBalance).toBe(10_000);
  });

  it("can fail to catch an inflation-adjusted target within the horizon", () => {
    const plan = calculateTimeToGoalPlan({
      targetAmount: 100_000,
      currentSavings: 0,
      annualRate: 0,
      monthlyContribution: 100,
      adjustForInflation: true,
      inflationRate: 10,
      maxMonths: 24,
    });

    expect(plan.viable).toBe(false);
    expect(plan.months).toBe(24);
    expect(plan.warnings.join(" ")).toContain("no se alcanza");
  });
});

describe("year-month helpers", () => {
  it("counts the current closing month as the first contribution", () => {
    expect(monthsBetweenInclusive("2026-06", "2026-06")).toBe(1);
    expect(monthsBetweenInclusive("2026-06", "2027-05")).toBe(12);
  });

  it("formats contribution months", () => {
    expect(addMonthsToYearMonth("2026-06", 1)).toBe("junio de 2026");
    expect(addMonthsToYearMonth("2026-06", 12)).toBe("mayo de 2027");
  });
});
