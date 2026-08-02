import * as base from "./netSalary";
import type { SalaryInput } from "./netSalary";

export type {
  FrequencyRule,
  ParseMoneyResult,
  SalaryBasis,
  SalaryBreakdownRow,
  SalaryFrequency,
  SalaryInput,
  SalaryPreset,
  SalaryResult,
  TaxBracket,
  TaxCalculation,
} from "./netSalary";

const employeeContributionNote =
  "This preset does not automatically calculate IMSS, INFONAVIT, or other social-security contributions. Enter the employee contributions from your payslip for a more complete estimate.";

export const MEXICO_FREQUENCIES = base.MEXICO_FREQUENCIES.map((frequency) => ({
  ...frequency,
  label: {
    weekly: "Weekly (7 days)",
    biweekly: "Biweekly (15 days)",
    monthly: "Monthly",
    annual: "Annual",
  }[frequency.id],
}));

export const MEXICO_SALARY_PRESET = {
  ...base.MEXICO_SALARY_PRESET,
  country: "Mexico",
  regime: "Wages and salaries",
  locale: "en-US",
  frequencies: MEXICO_FREQUENCIES,
  employeeContributionNote,
};

export const parseMoneyInput = base.parseMoneyInput;
export const parseOptionalMoneyInput = base.parseOptionalMoneyInput;

export function calculateNetSalary(input: SalaryInput) {
  try {
    const result = base.calculateNetSalary(input);
    const frequency =
      MEXICO_FREQUENCIES.find((item) => item.id === result.frequency.id) ??
      MEXICO_FREQUENCIES[0];
    const labels: Record<string, string> = {
      gross: "Cash income",
      "taxable-base": "Taxable base for income tax",
      "tax-before-credits": "Income tax before credits",
      "tax-credit": "Employment subsidy applied",
      tax: "Estimated income tax",
      "employee-contributions": "Employee contributions",
      "pre-tax": "Pre-tax deductions",
      "post-tax": "Other deductions",
      net: "Estimated net pay",
    };
    return {
      ...result,
      frequency,
      locale: "en-US",
      breakdown: result.breakdown.map((row) => ({
        ...row,
        label: labels[row.id] ?? row.label,
        note:
          row.id === "employee-contributions"
            ? employeeContributionNote
            : row.note,
      })),
      warnings: [employeeContributionNote],
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new RangeError(translateError(error.message));
    }
    throw error;
  }
}

export function formatMoney(
  value: number,
  locale = "en-US",
  currency = "MXN",
) {
  return base.formatMoney(value, locale, currency);
}

export function formatPercent(value: number, locale = "en-US") {
  return base.formatPercent(value, locale);
}

function translateError(message: string) {
  return {
    "La base gravable no coincide con ningún tramo fiscal.":
      "The taxable base does not match a tax bracket.",
    "Frecuencia de pago no compatible.": "Unsupported pay frequency.",
    "El salario bruto debe ser mayor que cero.":
      "Gross salary must be greater than zero.",
    "Los importes no pueden ser negativos ni inválidos.":
      "Amounts cannot be negative or invalid.",
  }[message] ?? message;
}
