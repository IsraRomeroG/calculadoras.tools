import type { RoundingPolicy } from "../types";

const shift = (value: number, precision: number) => value * 10 ** precision;

export function roundMoney(value: number, policy: RoundingPolicy): number {
  if (!Number.isFinite(value)) {
    throw new RangeError("Money value must be finite.");
  }
  if (!Number.isInteger(policy.precision) || policy.precision < 0 || policy.precision > 8) {
    throw new RangeError("Rounding precision must be an integer from 0 to 8.");
  }
  if (policy.mode === "none") return value;

  const factor = 10 ** policy.precision;
  const scaled = shift(value, policy.precision);
  let rounded: number;

  if (policy.mode === "floor") rounded = Math.floor(scaled);
  else if (policy.mode === "ceil") rounded = Math.ceil(scaled);
  else if (policy.mode === "half-even") {
    const lower = Math.floor(scaled);
    const fraction = scaled - lower;
    rounded = Math.abs(fraction - 0.5) < Number.EPSILON * Math.abs(scaled)
      ? (lower % 2 === 0 ? lower : lower + 1)
      : Math.round(scaled);
  } else {
    rounded = Math.round(scaled + Number.EPSILON * Math.abs(scaled));
  }

  return rounded / factor;
}

export function formatLegalTaxMoney(value: number, locale: string, currency: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
