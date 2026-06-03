export const AREA_PERIMETER_UNITS = [
  "none",
  "mm",
  "cm",
  "m",
  "km",
  "in",
  "ft",
] as const;

export type MeasurementUnit = (typeof AREA_PERIMETER_UNITS)[number];
export type DecimalSetting = "auto" | number;

export interface MeasurementUnitMetadata {
  label: string;
  symbol: string;
}

export const MEASUREMENT_UNIT_METADATA = {
  none: {
    label: "Sin unidad",
    symbol: "unidades",
  },
  mm: {
    label: "Milímetros",
    symbol: "mm",
  },
  cm: {
    label: "Centímetros",
    symbol: "cm",
  },
  m: {
    label: "Metros",
    symbol: "m",
  },
  km: {
    label: "Kilómetros",
    symbol: "km",
  },
  in: {
    label: "Pulgadas",
    symbol: "in",
  },
  ft: {
    label: "Pies",
    symbol: "ft",
  },
} as const satisfies Record<MeasurementUnit, MeasurementUnitMetadata>;

export type ParseMeasurementResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "empty" | "incomplete" | "invalid" | "unit";
    };

export type MeasurementValidationResult =
  | {
      ok: true;
      value: number;
    }
  | {
      ok: false;
      error: "non_finite" | "non_positive";
    };

export interface AreaPerimeterResult {
  area: number;
  perimeter: number;
}

export interface TriangleBaseHeightResult {
  area: number;
  perimeter: null;
}

export interface CircleResult {
  radius: number;
  area: number;
  circumference: number;
}

export interface RegularPolygonResult extends AreaPerimeterResult {
  apothem: number;
}

const DEFAULT_DECIMALS = 2;
const MAX_DECIMALS = 6;
const SCIENTIFIC_NOTATION_UPPER_THRESHOLD = 1_000_000_000_000;
const SCIENTIFIC_NOTATION_LOWER_THRESHOLD = 0.00000001;
const UNIT_HINT_PATTERN = /\d\s*[\p{L}]/u;

const REGULAR_POLYGON_NAMES: Partial<Record<number, string>> = {
  3: "Triángulo equilátero",
  4: "Cuadrado",
  5: "Pentágono regular",
  6: "Hexágono regular",
  8: "Octágono regular",
};

export function isMeasurementUnit(value: string): value is MeasurementUnit {
  return AREA_PERIMETER_UNITS.includes(value as MeasurementUnit);
}

export function parseMeasurement(rawValue: string): ParseMeasurementResult {
  const trimmed = rawValue.trim().replaceAll("−", "-");

  if (!trimmed) {
    return { ok: false, error: "empty" };
  }

  if (UNIT_HINT_PATTERN.test(trimmed)) {
    return { ok: false, error: "unit" };
  }

  if (isIncompleteMeasurement(trimmed)) {
    return { ok: false, error: "incomplete" };
  }

  const normalized = normalizeLocalizedNumber(trimmed);

  if (!normalized) {
    return { ok: false, error: "invalid" };
  }

  const value = Number(normalized);

  if (!Number.isFinite(value)) {
    return { ok: false, error: "invalid" };
  }

  return {
    ok: true,
    value,
    normalized: String(value),
  };
}

export function validatePositiveMeasurement(
  value: number,
): MeasurementValidationResult {
  if (!Number.isFinite(value)) {
    return { ok: false, error: "non_finite" };
  }

  if (value <= 0) {
    return { ok: false, error: "non_positive" };
  }

  return { ok: true, value };
}

export function calculateSquare(side: number): AreaPerimeterResult {
  assertPositiveMeasurement(side);

  return {
    area: side ** 2,
    perimeter: 4 * side,
  };
}

export function calculateRectangle(
  base: number,
  height: number,
): AreaPerimeterResult {
  assertPositiveMeasurement(base);
  assertPositiveMeasurement(height);

  return {
    area: base * height,
    perimeter: 2 * (base + height),
  };
}

export function calculateTriangleFromSides(
  a: number,
  b: number,
  c: number,
): AreaPerimeterResult {
  assertPositiveMeasurement(a);
  assertPositiveMeasurement(b);
  assertPositiveMeasurement(c);

  if (!isValidTriangle(a, b, c)) {
    throw new RangeError(
      "La suma de dos lados debe ser mayor que el tercer lado.",
    );
  }

  const semiperimeter = (a + b + c) / 2;
  const area = Math.sqrt(
    semiperimeter *
      (semiperimeter - a) *
      (semiperimeter - b) *
      (semiperimeter - c),
  );

  return {
    area,
    perimeter: a + b + c,
  };
}

export function calculateTriangleAreaFromBaseHeight(
  base: number,
  height: number,
): TriangleBaseHeightResult {
  assertPositiveMeasurement(base);
  assertPositiveMeasurement(height);

  return {
    area: (base * height) / 2,
    perimeter: null,
  };
}

export function calculateCircle(radius: number): CircleResult {
  assertPositiveMeasurement(radius);

  return {
    radius,
    area: Math.PI * radius ** 2,
    circumference: 2 * Math.PI * radius,
  };
}

export function calculateCircleFromDiameter(diameter: number): CircleResult {
  assertPositiveMeasurement(diameter);

  return calculateCircle(diameter / 2);
}

export function calculateRegularPolygon(
  sideCount: number,
  sideLength: number,
): RegularPolygonResult {
  assertRegularPolygonSideCount(sideCount);
  assertPositiveMeasurement(sideLength);

  const perimeter = sideCount * sideLength;
  const apothem = sideLength / (2 * Math.tan(Math.PI / sideCount));

  return {
    area: (perimeter * apothem) / 2,
    perimeter,
    apothem,
  };
}

export function getRegularPolygonName(sideCount: number): string | undefined {
  return REGULAR_POLYGON_NAMES[sideCount];
}

export function formatLinearMeasurement(
  value: number,
  unit: MeasurementUnit = "none",
  decimals: DecimalSetting = "auto",
): string {
  const symbol = MEASUREMENT_UNIT_METADATA[unit].symbol;

  return `${formatMeasurementNumber(value, decimals)} ${symbol}`;
}

export function formatAreaMeasurement(
  value: number,
  unit: MeasurementUnit = "none",
  decimals: DecimalSetting = "auto",
): string {
  const symbol = MEASUREMENT_UNIT_METADATA[unit].symbol;

  return `${formatMeasurementNumber(value, decimals)} ${symbol}²`;
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
  assertFiniteMeasurement(value);

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

  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: safeDecimals,
  }).format(roundToDecimals(normalizedValue, safeDecimals));
}

function isValidTriangle(a: number, b: number, c: number) {
  return a + b > c && a + c > b && b + c > a;
}

function assertPositiveMeasurement(value: number) {
  const validation = validatePositiveMeasurement(value);

  if (!validation.ok) {
    throw new RangeError(
      validation.error === "non_finite"
        ? "La medida debe ser un número finito."
        : "La medida debe ser mayor que cero.",
    );
  }
}

function assertRegularPolygonSideCount(sideCount: number) {
  if (!Number.isFinite(sideCount) || !Number.isInteger(sideCount)) {
    throw new RangeError("El número de lados debe ser un entero.");
  }

  if (sideCount < 3) {
    throw new RangeError("El polígono regular debe tener al menos 3 lados.");
  }

  if (sideCount > 1000) {
    throw new RangeError("El polígono regular debe tener 1000 lados o menos.");
  }
}

function assertFiniteMeasurement(value: number) {
  if (!Number.isFinite(value)) {
    throw new RangeError("La medida debe ser un número finito.");
  }
}

function isIncompleteMeasurement(value: string) {
  return (
    /^[+-]?$/.test(value) ||
    /^[+-]?[.,]$/.test(value) ||
    /^[+-]?(?:\d[\d.,\s]*|[.,]\d+)[.,]$/.test(value)
  );
}

function normalizeLocalizedNumber(rawValue: string): string | undefined {
  const value = rawValue.replace(/\s+/g, "");
  const sign = value.match(/^[+-]/)?.[0] ?? "";
  const mantissa = sign ? value.slice(1) : value;

  if (!mantissa || /[+-]/.test(mantissa)) {
    return undefined;
  }

  if (/^[.,]\d+$/.test(mantissa)) {
    return `${sign}0.${mantissa.slice(1)}`;
  }

  if (!/^\d[\d.,]*$/.test(mantissa)) {
    return undefined;
  }

  const lastComma = mantissa.lastIndexOf(",");
  const lastDot = mantissa.lastIndexOf(".");
  const hasComma = lastComma !== -1;
  const hasDot = lastDot !== -1;

  if (!hasComma && !hasDot) {
    return `${sign}${mantissa}`;
  }

  if (hasComma && hasDot) {
    return normalizeMixedSeparators(mantissa, sign, lastComma, lastDot);
  }

  return normalizeSingleSeparator(mantissa, sign, hasComma ? "," : ".");
}

function normalizeMixedSeparators(
  mantissa: string,
  sign: string,
  lastComma: number,
  lastDot: number,
): string | undefined {
  const decimalSeparator = lastComma > lastDot ? "," : ".";
  const groupingSeparator = decimalSeparator === "," ? "." : ",";
  const decimalIndex = mantissa.lastIndexOf(decimalSeparator);
  const integerPart = mantissa.slice(0, decimalIndex);
  const decimalPart = mantissa.slice(decimalIndex + 1);

  if (!decimalPart || decimalPart.includes(groupingSeparator)) {
    return undefined;
  }

  if (!isValidGroupedInteger(integerPart, groupingSeparator)) {
    return undefined;
  }

  return `${sign}${stripGrouping(integerPart, groupingSeparator)}.${decimalPart}`;
}

function normalizeSingleSeparator(
  mantissa: string,
  sign: string,
  separator: "," | ".",
): string | undefined {
  const parts = mantissa.split(separator);

  if (parts.length > 2) {
    if (!isValidGroupedInteger(mantissa, separator)) {
      return undefined;
    }

    return `${sign}${stripGrouping(mantissa, separator)}`;
  }

  const [integerPart, decimalPart] = parts;

  if (!decimalPart || !/^\d+$/.test(decimalPart)) {
    return undefined;
  }

  if (
    separator === "," &&
    integerPart &&
    decimalPart.length === 3 &&
    isValidGroupedInteger(mantissa, separator)
  ) {
    return `${sign}${stripGrouping(mantissa, separator)}`;
  }

  if (!integerPart || !/^\d+$/.test(integerPart)) {
    return undefined;
  }

  return `${sign}${integerPart}.${decimalPart}`;
}

function isValidGroupedInteger(value: string, separator: string) {
  const groups = value.split(separator);

  return (
    /^\d{1,3}$/.test(groups[0]) &&
    groups.slice(1).every((group) => /^\d{3}$/.test(group))
  );
}

function stripGrouping(value: string, separator: string) {
  return value.split(separator).join("");
}

function normalizeDecimals(decimals: number) {
  if (!Number.isFinite(decimals)) {
    return DEFAULT_DECIMALS;
  }

  return Math.min(MAX_DECIMALS, Math.max(0, Math.trunc(decimals)));
}

function roundToDecimals(value: number, decimals: number) {
  const factor = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * factor) / factor;
}
