import * as base from "./distance";
import type { DistanceUnit } from "./distance";

export { isDistanceUnit, parseDistanceInput, convertDistance } from "./distance";

export const DISTANCE_UNIT_METADATA = {
  km: { ...base.DISTANCE_UNIT_METADATA.km, label: "Kilometers" },
  mi: { ...base.DISTANCE_UNIT_METADATA.mi, label: "Statute miles" },
};

export function formatDistanceNumber(value: number, decimals = 2) {
  if (Math.abs(value) >= 1e12 || (Math.abs(value) > 0 && Math.abs(value) < 1e-8)) {
    return value.toExponential(Math.max(0, Math.trunc(decimals)));
  }
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: Math.max(0, Math.trunc(decimals)) }).format(value);
}

export function formatDistance(value: number, unit: DistanceUnit, decimals = 2) {
  return `${formatDistanceNumber(value, decimals)} ${DISTANCE_UNIT_METADATA[unit].symbol}`;
}

export function formatDistanceRate(from: DistanceUnit, to: DistanceUnit, decimals = 6) {
  return `1 ${from} = ${formatDistanceNumber(base.convertDistance(1, from, to), decimals)} ${to}`;
}

export function buildDistanceExplanation(value: number, from: DistanceUnit, to: DistanceUnit, decimals = 2) {
  const formula = base.getDistanceFormula(from, to);
  const result = formatDistance(base.convertDistance(value, from, to), to, decimals);
  const substitution = `${formatDistance(value, from, decimals)} = ${result}`;
  return {
    formula,
    substitution,
    result,
    steps: from === to
      ? ["The source and destination units are the same.", `Result: ${result}.`]
      : [`Use the formula: ${formula}.`, `Substitute the value: ${substitution}.`, `Result: ${result}.`],
  };
}
