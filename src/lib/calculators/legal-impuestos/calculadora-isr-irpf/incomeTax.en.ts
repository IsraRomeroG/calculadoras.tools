import * as base from "./incomeTax";
import type {
  IncomeTaxInput,
  IncomeTaxResult,
  TaxFrequencyRule,
} from "./incomeTax";

export type {
  IncomeTaxFrequency,
  IncomeTaxInput,
  IncomeTaxMode,
  IncomeTaxPreset,
  IncomeTaxRuleMode,
  ParseIncomeTaxMoneyResult,
  TaxBracket,
  TaxFrequencyRule,
} from "./incomeTax";

export type EnglishIncomeTaxResult = Omit<
  IncomeTaxResult,
  "balanceLabel" | "frequency"
> & {
  balanceLabel: "amount due" | "refund" | "no difference" | "no withholding";
  frequency: TaxFrequencyRule;
};

export const ISR_CANONICAL_PATH = "/en/legal-tax/mexico-income-tax-calculator";
export const MEXICO_ISR_FREQUENCIES: TaxFrequencyRule[] =
  base.MEXICO_ISR_FREQUENCIES.map((frequency) => ({
    ...frequency,
    label: {
      daily: "Per day worked",
      weekly: "Weekly (7 days)",
      every_10_days: "Every 10 days",
      biweekly: "Biweekly (15 days)",
      monthly: "Monthly",
      annual: "Annual",
    }[frequency.id],
    tableLabel: {
      daily: "Daily table",
      weekly: "7-day table",
      every_10_days: "10-day table",
      biweekly: "15-day table",
      monthly: "Monthly table",
      annual: "2026 tax year",
    }[frequency.id],
  }));

export const MEXICO_ISR_PRESET = {
  ...base.MEXICO_ISR_PRESET,
  country: "Mexico",
  regime: "Wages and salaries",
  locale: "en-US",
  frequencies: MEXICO_ISR_FREQUENCIES,
};

export const parseIncomeTaxMoneyInput = base.parseIncomeTaxMoneyInput;
export const parseOptionalIncomeTaxMoneyInput =
  base.parseOptionalIncomeTaxMoneyInput;
export const parseIncomeTaxRateInput = base.parseIncomeTaxRateInput;

export function calculateIncomeTax(
  input: IncomeTaxInput,
): EnglishIncomeTaxResult {
  try {
    const result = base.calculateIncomeTax(input);
    const frequency =
      MEXICO_ISR_FREQUENCIES.find((item) => item.id === result.frequency.id) ??
      MEXICO_ISR_FREQUENCIES[0];

    return {
      ...result,
      frequency,
      scopeLabel:
        result.mode === "annual-estimate"
          ? "2026 annual tax year"
          : `${frequency.label.toLowerCase()} withholding`,
      balanceLabel: {
        "a pagar": "amount due",
        "a favor": "refund",
        "sin diferencia": "no difference",
        "sin retención": "no withholding",
      }[result.balanceLabel],
      sourceName:
        result.ruleMode === "manual"
          ? "Manually entered parameters"
          : result.sourceName,
      warnings:
        result.ruleMode === "manual"
          ? [
              "The rate was entered manually and does not represent a current official tax table.",
              "The result is informational and does not replace an official return, withholding calculation, or tax advice.",
            ]
          : [
              "The calculation uses the selected table but excludes personal deductions and other information not entered.",
              "The result is informational and does not replace an official return, withholding calculation, or tax advice.",
            ],
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new RangeError(translateError(error.message));
    }
    throw error;
  }
}

export function formatIncomeTaxMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MXN",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatIncomeTaxPercent(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(value);
}

export function buildIncomeTaxShareText(result: EnglishIncomeTaxResult) {
  const lines = [
    `Estimated income tax (${result.scopeLabel}): ${formatIncomeTaxMoney(result.tax)}`,
    `Taxable base: ${formatIncomeTaxMoney(result.taxableBase)}`,
    `Effective rate: ${formatIncomeTaxPercent(result.effectiveRate)}`,
    `Marginal rate: ${formatIncomeTaxPercent(result.marginalRate / 100)}`,
  ];
  if (result.comparableRetention !== null) {
    lines.push(
      `Comparable withholding: ${formatIncomeTaxMoney(result.comparableRetention)}`,
      `Estimated ${result.balanceLabel}: ${formatIncomeTaxMoney(Math.abs(result.balance))}`,
    );
  }
  lines.push("Informational estimate. Rules: SAT · Annex 8, 2026 Miscellaneous Tax Resolution.");
  return lines.join("\n");
}

function translateError(message: string) {
  return {
    "La base gravable debe ser mayor o igual a cero.":
      "The taxable base must be zero or greater.",
    "La base gravable es demasiado alta para este cálculo.":
      "The taxable base is too high for this calculation.",
    "La retención debe ser mayor o igual a cero.":
      "Withholding must be zero or greater.",
    "El impuesto anual debe usar la frecuencia anual.":
      "The annual estimate must use the annual frequency.",
    "Frecuencia fiscal no compatible.": "Unsupported tax frequency.",
  }[message] ?? message;
}
