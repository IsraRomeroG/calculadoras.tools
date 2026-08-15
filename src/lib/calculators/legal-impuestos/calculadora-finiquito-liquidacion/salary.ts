export type SalaryFrequency = "daily" | "weekly" | "biweekly" | "monthly";

const DAILY_DIVISOR_BY_FREQUENCY: Record<SalaryFrequency, number> = {
  daily: 1,
  weekly: 7,
  biweekly: 15,
  monthly: 30,
};

export function normalizeDailySalary(
  salaryBase: number,
  frequency: SalaryFrequency,
): number {
  if (!Number.isFinite(salaryBase) || salaryBase <= 0) {
    throw new RangeError("Salary must be greater than zero");
  }

  return salaryBase / DAILY_DIVISOR_BY_FREQUENCY[frequency];
}
