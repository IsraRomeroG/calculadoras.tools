import * as base from "./litersGallons";
import type { VolumePrecision, VolumeUnit } from "./litersGallons";

export {
  IMPERIAL_GALLON_DIFFERENCE_PERCENT,
  convertAllVolumes,
  convertVolume,
  isVolumeUnit,
  parseVolumeInput,
} from "./litersGallons";

export const VOLUME_UNIT_METADATA = {
  l: { ...base.VOLUME_UNIT_METADATA.l, label: "Liters", singularLabel: "liter" },
  us_gal: { ...base.VOLUME_UNIT_METADATA.us_gal, label: "US gallons", singularLabel: "US gallon" },
  imp_gal: { ...base.VOLUME_UNIT_METADATA.imp_gal, label: "Imperial gallons", singularLabel: "Imperial gallon" },
};

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

export function formatVolumeRate(from: VolumeUnit, to: VolumeUnit, decimals = 9) {
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
