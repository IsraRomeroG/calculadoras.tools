import { roundMoney } from "./money";
import type { RoundingPolicy } from "../types";

export interface IndirectTaxComponent {
  id: string;
  rate: number;
  calculation: "additive" | "compound";
}

export interface IndirectTaxResult {
  base: number;
  taxes: Array<{ id: string; rate: number; amount: number }>;
  tax: number;
  total: number;
}

function assertInputs(amount: number, components: IndirectTaxComponent[]) {
  if (!Number.isFinite(amount) || amount < 0) throw new RangeError("Amount must be finite and non-negative.");
  if (components.some((component) => !Number.isFinite(component.rate) || component.rate < 0)) {
    throw new RangeError("Tax rates must be finite and non-negative.");
  }
}

export function addIndirectTax(base: number, components: IndirectTaxComponent[], rounding: RoundingPolicy): IndirectTaxResult {
  assertInputs(base, components);
  let runningBase = base;
  const taxes = components.map((component) => {
    const taxableBase = component.calculation === "compound" ? runningBase : base;
    const rawAmount = taxableBase * component.rate;
    const amount = rounding.stage === "component" ? roundMoney(rawAmount, rounding) : rawAmount;
    runningBase += amount;
    return { id: component.id, rate: component.rate, amount };
  });
  const rawTax = taxes.reduce((sum, item) => sum + item.amount, 0);
  const tax = rounding.stage === "total" ? roundMoney(rawTax, rounding) : rawTax;
  return { base, taxes, tax, total: base + tax };
}

export function extractAdditiveIndirectTax(total: number, components: IndirectTaxComponent[], rounding: RoundingPolicy): IndirectTaxResult {
  assertInputs(total, components);
  if (components.some((component) => component.calculation !== "additive")) {
    throw new Error("Included compound taxes require a jurisdiction-specific extraction adapter.");
  }
  const combinedRate = components.reduce((sum, component) => sum + component.rate, 0);
  const base = total / (1 + combinedRate);
  const added = addIndirectTax(base, components, rounding);
  return { ...added, total };
}
