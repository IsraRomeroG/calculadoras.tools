import * as base from "./debtPayoff";
import type {
  DebtInput,
  DebtPlan,
  DebtPlanOptions,
} from "./debtPayoff";

export * from "./debtPayoff";

function localizeWarnings(plan: DebtPlan): DebtPlan {
  return {
    ...plan,
    warnings: plan.warnings.map((warning) =>
      warning
        .replace("El presupuesto mensual no cubre todos los pagos mínimos.", "The monthly budget does not cover all minimum payments.")
        .replace(": el saldo crece o no disminuye en algunos meses.", ": the balance grows or does not decrease in some months.")
        .replace("El plan no liquida todas las deudas dentro de", "The plan does not pay off every debt within")
        .replace("Pagar solo mínimos no liquida todas las deudas dentro de", "Paying only the minimums does not pay off every debt within")
        .replace(": el pago mínimo no reduce el saldo.", ": the minimum payment does not reduce the balance.")
        .replace(" meses.", " months."),
    ),
  };
}

export function calculateDebtPlan(options: DebtPlanOptions): DebtPlan {
  return localizeWarnings(base.calculateDebtPlan(options));
}

export function calculateMinimumOnlyPlan(
  debts: DebtInput[],
  maxMonths?: number,
): DebtPlan {
  return localizeWarnings(base.calculateMinimumOnlyPlan(debts, maxMonths));
}

export function compareDebtStrategies(
  options: Omit<DebtPlanOptions, "strategy">,
) {
  const comparison = base.compareDebtStrategies(options);
  return {
    ...comparison,
    snowball: localizeWarnings(comparison.snowball),
    avalanche: localizeWarnings(comparison.avalanche),
    minimums: localizeWarnings(comparison.minimums),
  };
}

export const addMonthsToYearMonth = base.addMonthsToYearMonth;
export const calculateMonthlyBudget = base.calculateMonthlyBudget;
