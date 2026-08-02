import * as base from "./weight";
import type { WeightUnit } from "./weight";

export {
  WEIGHT_UNITS,
  convertAllWeights,
  convertWeight,
  isWeightUnit,
  parseWeightInput,
} from "./weight";
export type { WeightUnit } from "./weight";

export const WEIGHT_UNIT_METADATA = {
  kg: { ...base.WEIGHT_UNIT_METADATA.kg, label: "Kilograms" },
  lb: { ...base.WEIGHT_UNIT_METADATA.lb, label: "Pounds" },
  g: { ...base.WEIGHT_UNIT_METADATA.g, label: "Grams" },
  oz: { ...base.WEIGHT_UNIT_METADATA.oz, label: "Ounces" },
  st: { ...base.WEIGHT_UNIT_METADATA.st, label: "Stone" },
};

export function formatWeightNumber(value: number, decimals = 2) {
  if (Math.abs(value) >= 1e12 || (Math.abs(value) > 0 && Math.abs(value) < 1e-8)) {
    return value.toExponential(Math.max(0, Math.trunc(decimals)));
  }
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: Math.max(0, Math.trunc(decimals)) }).format(value);
}

export function formatWeight(value: number, unit: WeightUnit, decimals = 2) {
  return `${formatWeightNumber(value, decimals)} ${WEIGHT_UNIT_METADATA[unit].symbol}`;
}

export function formatWeightRate(from: WeightUnit, to: WeightUnit, decimals = 8) {
  return `1 ${from} = ${formatWeightNumber(base.convertWeight(1, from, to), decimals)} ${to}`;
}

export function formatPoundsAndOunces(pounds: number) {
  const whole = Math.floor(pounds);
  return `${formatWeightNumber(whole)} lb ${formatWeightNumber((pounds - whole) * 16)} oz`;
}

export function formatStoneAndPounds(stone: number) {
  const whole = Math.floor(stone);
  return `${formatWeightNumber(whole)} st ${formatWeightNumber((stone - whole) * 14)} lb`;
}

export function buildWeightExplanation(value: number, from: WeightUnit, to: WeightUnit) {
  const formula = base.getWeightFormula(from, to);
  const result = formatWeight(base.convertWeight(value, from, to), to);
  const substitution = `${formatWeightNumber(value)} ${from} = ${result}`;
  return {
    formula,
    substitution,
    result,
    steps: from === to
      ? ["The source and destination units are the same.", `Result: ${result}.`]
      : [`Use the formula: ${formula}.`, `Substitute the value: ${substitution}.`, `Result: approximately ${result}.`],
  };
}
