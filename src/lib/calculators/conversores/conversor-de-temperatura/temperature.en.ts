import * as base from "./temperature";
import type { TemperatureScale } from "./temperature";

export {
  TEMPERATURE_SCALES,
  convertAllTemperatures,
  convertTemperature,
  isTemperatureScale,
  parseTemperatureInput,
} from "./temperature";
export type { TemperatureScale } from "./temperature";

export const TEMPERATURE_SCALE_METADATA = base.TEMPERATURE_SCALE_METADATA;

export function formatTemperatureNumber(value: number, decimals = 2) {
  if (Math.abs(value) >= 1e6) return value.toExponential(Math.max(0, Math.trunc(decimals)));
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: Math.max(0, Math.trunc(decimals)) }).format(value);
}

export function formatTemperature(value: number, scale: TemperatureScale, decimals = 2) {
  return `${formatTemperatureNumber(value, decimals)} ${TEMPERATURE_SCALE_METADATA[scale].symbol}`;
}

export function buildTemperatureExplanation(value: number, from: TemperatureScale, to: TemperatureScale, decimals = 2) {
  const formula = base.getTemperatureFormula(from, to);
  const result = formatTemperature(base.convertTemperature(value, from, to), to, decimals);
  const substitution = `${formatTemperature(value, from, decimals)} = ${result}`;
  return {
    formula,
    substitution,
    result,
    steps: from === to
      ? ["The source and destination scales are the same.", `Result: ${result}.`]
      : [`Use the formula: ${formula}.`, `Substitute the value: ${substitution}.`, `Result: ${result}.`],
  };
}
