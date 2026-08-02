import * as base from "./volume";
import type { VolumePrecision, VolumeUnit } from "./volume";

export {
  VOLUME_UNITS,
  convertAllVolumes,
  convertVolume,
  isVolumeUnit,
  parseVolumeInput,
} from "./volume";
export type { VolumeUnit } from "./volume";

const labels: Record<VolumeUnit, [string, string, string]> = {
  ml: ["Milliliters", "milliliter", "metric"],
  l: ["Liters", "liter", "metric"],
  cm3: ["Cubic centimeters", "cubic centimeter", "metric"],
  m3: ["Cubic meters", "cubic meter", "metric"],
  us_fl_oz: ["US fluid ounces", "US fluid ounce", "US liquid"],
  us_pt: ["US pints", "US pint", "US liquid"],
  us_qt: ["US quarts", "US quart", "US liquid"],
  us_gal: ["US gallons", "US gallon", "US liquid"],
  imp_fl_oz: ["Imperial fluid ounces", "Imperial fluid ounce", "Imperial"],
  imp_pt: ["Imperial pints", "Imperial pint", "Imperial"],
  imp_qt: ["Imperial quarts", "Imperial quart", "Imperial"],
  imp_gal: ["Imperial gallons", "Imperial gallon", "Imperial"],
};

export const VOLUME_UNIT_METADATA = Object.fromEntries(
  base.VOLUME_UNITS.map((unit) => [
    unit,
    {
      ...base.VOLUME_UNIT_METADATA[unit],
      label: labels[unit][0],
      singularLabel: labels[unit][1],
      systemLabel: labels[unit][2],
    },
  ]),
) as Record<VolumeUnit, (typeof base.VOLUME_UNIT_METADATA)[VolumeUnit]>;

export const VOLUME_UNIT_GROUPS = [
  { id: "metric", label: "Metric", units: ["ml", "l", "cm3", "m3"] },
  { id: "us", label: "US liquid", units: ["us_fl_oz", "us_pt", "us_qt", "us_gal"] },
  { id: "imperial", label: "Imperial", units: ["imp_fl_oz", "imp_pt", "imp_qt", "imp_gal"] },
] as const;

export function formatVolumeNumber(value: number, precision: VolumePrecision = "auto") {
  const digits = precision === "auto" ? 4 : Math.max(0, Math.trunc(precision));
  if (Math.abs(value) >= 1e12 || (Math.abs(value) > 0 && Math.abs(value) < 1e-8)) return value.toExponential(digits);
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    ...(precision === "auto" ? {} : { minimumFractionDigits: digits }),
  }).format(value);
}

export function formatVolume(value: number, unit: VolumeUnit, precision: VolumePrecision = "auto") {
  return `${formatVolumeNumber(value, precision)} ${VOLUME_UNIT_METADATA[unit].symbol}`;
}

export function formatVolumeRate(from: VolumeUnit, to: VolumeUnit, decimals = 13) {
  return `1 ${VOLUME_UNIT_METADATA[from].symbol} = ${formatVolumeNumber(base.convertVolume(1, from, to), decimals)} ${VOLUME_UNIT_METADATA[to].symbol}`;
}

export function buildVolumeExplanation(value: number, from: VolumeUnit, to: VolumeUnit, precision: VolumePrecision = "auto") {
  const formula = base.getVolumeFormula(from, to);
  const result = formatVolume(base.convertVolume(value, from, to), to, precision);
  const substitution = `${formatVolume(value, from, precision)} = ${result}`;
  return {
    formula,
    substitution,
    result,
    steps: from === to
      ? ["The source and destination units are the same.", `Result: ${result}.`]
      : [`Use the formula: ${formula}.`, `Substitute the value: ${substitution}.`, `Result: ${result}.`],
  };
}
