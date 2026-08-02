import * as base from "./area";
import type { AreaUnit, LinearUnit } from "./area";

export {
  AREA_UNITS,
  LINEAR_UNITS,
  MAX_LINEAR_INPUT,
  calculateRectangleArea,
  convertAllAreas,
  convertArea,
  isAreaUnit,
  isLinearUnit,
  parseAreaInput,
  parseNumericInput,
} from "./area";

export const AREA_UNIT_METADATA = {
  m2: { ...base.AREA_UNIT_METADATA.m2, label: "Square meters", singularLabel: "square meter" },
  ft2: { ...base.AREA_UNIT_METADATA.ft2, label: "Square feet", singularLabel: "square foot" },
  ha: { ...base.AREA_UNIT_METADATA.ha, label: "Hectares", singularLabel: "hectare" },
  acre: { ...base.AREA_UNIT_METADATA.acre, label: "Acres", singularLabel: "acre" },
};

export const LINEAR_UNIT_METADATA = {
  m: { ...base.LINEAR_UNIT_METADATA.m, label: "Meters", singularLabel: "meter" },
  ft: { ...base.LINEAR_UNIT_METADATA.ft, label: "Feet", singularLabel: "foot" },
};

export function formatAreaNumber(value: number, decimals = 4) {
  return formatNumber(value, decimals);
}

export function formatArea(value: number, unit: AreaUnit, decimals = 4) {
  return `${formatAreaNumber(value, decimals)} ${AREA_UNIT_METADATA[unit].symbol}`;
}

export function formatAreaRate(from: AreaUnit, to: AreaUnit, decimals = 4) {
  return `1 ${AREA_UNIT_METADATA[from].symbol} = ${formatAreaNumber(base.convertArea(1, from, to), decimals)} ${AREA_UNIT_METADATA[to].symbol}`;
}

export function buildAreaExplanation(value: number, from: AreaUnit, to: AreaUnit, decimals = 4) {
  const formula = base.getAreaFormula(from, to);
  const result = formatArea(base.convertArea(value, from, to), to, decimals);
  const source = formatAreaNumber(value, decimals);
  const substitution = `${source} ${AREA_UNIT_METADATA[from].symbol} = ${result}`;
  return {
    formula,
    substitution,
    result,
    steps: from === to
      ? ["The source and destination units are the same.", `Result: ${result}.`]
      : [`Use the formula: ${formula}.`, `Substitute the value: ${substitution}.`, `Result: ${result}.`],
  };
}

function formatNumber(value: number, decimals: number) {
  if (Math.abs(value) >= 1e12 || (Math.abs(value) > 0 && Math.abs(value) < 1e-8)) {
    return value.toExponential(Math.max(0, Math.trunc(decimals)));
  }
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: Math.max(0, Math.trunc(decimals)) }).format(value);
}
