import type {
  DecimalSetting,
  MeasurementUnit,
  MeasurementUnitMetadata,
} from "./areaPerimeter";

export * from "./areaPerimeter";

export const MEASUREMENT_UNIT_METADATA = {
  none: { label: "No unit", symbol: "units" },
  mm: { label: "Millimeters", symbol: "mm" },
  cm: { label: "Centimeters", symbol: "cm" },
  m: { label: "Meters", symbol: "m" },
  km: { label: "Kilometers", symbol: "km" },
  in: { label: "Inches", symbol: "in" },
  ft: { label: "Feet", symbol: "ft" },
} as const satisfies Record<MeasurementUnit, MeasurementUnitMetadata>;

const DEFAULT_DECIMALS = 2;
const MAX_DECIMALS = 6;
const SCIENTIFIC_NOTATION_UPPER_THRESHOLD = 1_000_000_000_000;
const SCIENTIFIC_NOTATION_LOWER_THRESHOLD = 0.00000001;

const REGULAR_POLYGON_NAMES: Partial<Record<number, string>> = {
  3: "Equilateral triangle",
  4: "Square",
  5: "Regular pentagon",
  6: "Regular hexagon",
  8: "Regular octagon",
};

export function getRegularPolygonName(sideCount: number): string | undefined {
  return REGULAR_POLYGON_NAMES[sideCount];
}

export function formatLinearMeasurement(
  value: number,
  unit: MeasurementUnit = "none",
  decimals: DecimalSetting = "auto",
): string {
  return `${formatMeasurementNumber(value, decimals)} ${MEASUREMENT_UNIT_METADATA[unit].symbol}`;
}

export function formatAreaMeasurement(
  value: number,
  unit: MeasurementUnit = "none",
  decimals: DecimalSetting = "auto",
): string {
  return `${formatMeasurementNumber(value, decimals)} ${MEASUREMENT_UNIT_METADATA[unit].symbol}²`;
}

export function formatMeasurementAuto(
  value: number,
  maxDecimals = DEFAULT_DECIMALS,
): string {
  return formatMeasurementNumber(value, normalizeDecimals(maxDecimals));
}

export function formatMeasurementNumber(
  value: number,
  decimals: DecimalSetting = "auto",
): string {
  if (!Number.isFinite(value)) {
    throw new RangeError("The measurement must be a finite number.");
  }

  const normalizedValue = Object.is(value, -0) ? 0 : value;
  const safeDecimals =
    decimals === "auto" ? DEFAULT_DECIMALS : normalizeDecimals(decimals);
  const absoluteValue = Math.abs(normalizedValue);

  if (
    absoluteValue >= SCIENTIFIC_NOTATION_UPPER_THRESHOLD ||
    (absoluteValue > 0 && absoluteValue < SCIENTIFIC_NOTATION_LOWER_THRESHOLD)
  ) {
    return normalizedValue.toExponential(safeDecimals);
  }

  const factor = 10 ** safeDecimals;
  const rounded =
    Math.round((normalizedValue + Number.EPSILON) * factor) / factor;

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: safeDecimals,
  }).format(rounded);
}

function normalizeDecimals(decimals: number) {
  if (!Number.isFinite(decimals)) {
    return DEFAULT_DECIMALS;
  }

  return Math.min(MAX_DECIMALS, Math.max(0, Math.trunc(decimals)));
}
