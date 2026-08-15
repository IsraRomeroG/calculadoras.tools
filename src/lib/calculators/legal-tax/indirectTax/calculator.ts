import { addIndirectTax, extractAdditiveIndirectTax } from "../core/indirectTax";
import type { CalculationResult, Coverage } from "../types";
import { INDIRECT_TAX_RULE_SETS } from "./rules";

export interface IndirectTaxCalculationInput {
  ruleSetId: string;
  rateId: string;
  mode: "add" | "extract";
  amount: number;
  manualAdditionalRatePercent?: number;
}

export interface IndirectTaxCalculationResult extends CalculationResult {
  mode: "add" | "extract";
  base: number;
  tax: number;
  total: number;
  components: Array<{ id: string; label: string; rate: number; amount: number; status: "calculated" | "manual" }>;
}

export function calculateIndirectTax(input: IndirectTaxCalculationInput): IndirectTaxCalculationResult {
  if (!Number.isFinite(input.amount) || input.amount < 0) throw new RangeError("Amount must be finite and non-negative.");
  const ruleSet = INDIRECT_TAX_RULE_SETS.find((item) => item.id === input.ruleSetId);
  if (!ruleSet || ruleSet.status !== "current") throw new Error("Indirect-tax rule set is not available.");

  const selected = ruleSet.rules.components.flatMap((component) =>
    component.rates.filter((item) => item.id === input.rateId).map((item) => ({ component, rate: item })),
  )[0];
  if (!selected) throw new Error("Select a supported tax rate.");

  const components = [{ id: selected.component.id, rate: selected.rate.value, calculation: selected.component.calculation }];
  let manualRate = 0;
  if (input.manualAdditionalRatePercent !== undefined) {
    if (!ruleSet.rules.allowManualAdditionalRate) throw new Error("This jurisdiction does not accept a manual additional rate.");
    if (!Number.isFinite(input.manualAdditionalRatePercent) || input.manualAdditionalRatePercent < 0 || input.manualAdditionalRatePercent > 100) {
      throw new RangeError("Manual additional rate must be between 0 and 100.");
    }
    manualRate = input.manualAdditionalRatePercent / 100;
    if (manualRate > 0) components.push({ id: "manual-additional", rate: manualRate, calculation: "additive" });
  }

  const arithmetic = input.mode === "add"
    ? addIndirectTax(input.amount, components, ruleSet.rounding)
    : extractAdditiveIndirectTax(input.amount, components, ruleSet.rounding);
  const outputComponents = arithmetic.taxes.map((tax) => ({
    ...tax,
    label: tax.id === "manual-additional" ? "Manual district/local rate" : selected.component.label,
    status: tax.id === "manual-additional" ? "manual" as const : "calculated" as const,
  }));
  const coverage: Coverage = manualRate > 0 ? "partial" : ruleSet.coverage;

  return {
    ruleSetId: ruleSet.id,
    marketId: ruleSet.marketId,
    jurisdictionCode: ruleSet.jurisdictionCode,
    periodId: ruleSet.periodId,
    currency: ruleSet.currency,
    coverage,
    mode: input.mode,
    base: arithmetic.base,
    tax: arithmetic.tax,
    total: arithmetic.total,
    components: outputComponents,
    rows: [
      { id: "base", amount: arithmetic.base, status: "calculated", ruleRefs: [selected.rate.id] },
      ...outputComponents.map((component) => ({ id: component.id, amount: component.amount, status: component.status, ruleRefs: component.status === "manual" ? [] : selected.rate.sourceRefs })),
      { id: "total", amount: arithmetic.total, status: "calculated", ruleRefs: [selected.rate.id] },
    ],
    warnings: [
      "Arithmetic estimate only; item classification and legal obligations are not determined.",
      ...(manualRate > 0 ? ["The district/local component is a manual simulation and has no official status."] : []),
    ],
    missingConcepts: ruleSet.missingConcepts,
  };
}
