export const AREA_UNITS = ["m2", "ft2", "ha", "acre"] as const;

export const SURFACE_TYPES = [
  "built",
  "land",
  "rentable",
  "other",
] as const;

export const CALCULATION_MODES = [
  "price-per-area",
  "total-price",
] as const;

export type AreaUnit = (typeof AREA_UNITS)[number];
export type SurfaceType = (typeof SURFACE_TYPES)[number];
export type CalculationMode = (typeof CALCULATION_MODES)[number];

export interface PricePerAreaInput {
  mode: CalculationMode;
  area: number;
  areaUnit: AreaUnit;
  surfaceType?: SurfaceType;
  totalPrice?: number;
  pricePerM2?: number;
  additionalCosts?: number;
}

export interface AreaConversions {
  m2: number;
  ft2: number;
  ha: number;
  acre: number;
}

export interface PricePerAreaResult {
  mode: CalculationMode;
  area: number;
  areaUnit: AreaUnit;
  surfaceType: SurfaceType;
  areaM2: number;
  areaConversions: AreaConversions;
  totalPrice: number;
  additionalCosts: number;
  effectiveTotal: number;
  basePricePerM2: number;
  effectivePricePerM2: number;
  effectivePricePerFt2: number;
}

export interface PropertyComparisonInput {
  id?: string;
  name?: string;
  totalPrice: number;
  area: number;
  areaUnit: AreaUnit;
  surfaceType?: SurfaceType;
  additionalCosts?: number;
  note?: string;
}

export interface ComparedProperty extends PricePerAreaResult {
  id: string;
  name: string;
  note: string;
  rank: number;
  isCheapest: boolean;
  differenceAbsolute: number;
  differencePercent: number;
}

export interface PropertyComparisonResult {
  items: ComparedProperty[];
  cheapest: ComparedProperty;
  hasMixedSurfaceTypes: boolean;
  warning?: string;
}

export const AREA_UNIT_LABELS: Record<AreaUnit, string> = {
  m2: "m2",
  ft2: "ft2",
  ha: "ha",
  acre: "acre",
};

export const SURFACE_TYPE_LABELS: Record<SurfaceType, string> = {
  built: "Built",
  land: "Land",
  rentable: "Rentable",
  other: "Other",
};

const M2_PER_FT2 = 0.09290304;
const M2_PER_HA = 10_000;
const M2_PER_ACRE = 4_046.8564224;

const M2_FACTORS: Record<AreaUnit, number> = {
  m2: 1,
  ft2: M2_PER_FT2,
  ha: M2_PER_HA,
  acre: M2_PER_ACRE,
};

export function parseLocalizedNumber(value: string): number | null {
  const cleaned = value
    .trim()
    .replace(/\s+/g, "")
    .replace(/MXN|USD|EUR/gi, "")
    .replace(/\$/g, "");

  if (!cleaned || !/^[+-]?\d[\d.,]*$/.test(cleaned)) {
    return null;
  }

  const sign = cleaned.startsWith("-") ? "-" : "";
  const unsigned = cleaned.replace(/^[+-]/, "");
  const normalized = normalizeSeparators(unsigned);

  if (!/^\d+(?:\.\d+)?$/.test(normalized)) {
    return null;
  }

  const parsed = Number(`${sign}${normalized}`);

  return Number.isFinite(parsed) ? parsed : null;
}

export function isAreaUnit(unit: string): unit is AreaUnit {
  return AREA_UNITS.includes(unit as AreaUnit);
}

export function isSurfaceType(type: string): type is SurfaceType {
  return SURFACE_TYPES.includes(type as SurfaceType);
}

export function convertAreaToM2(value: number, unit: AreaUnit): number {
  assertPositiveFinite(value, "The area");

  return value * M2_FACTORS[unit];
}

export function convertM2ToArea(value: number, unit: AreaUnit): number {
  assertPositiveFinite(value, "The area");

  return value / M2_FACTORS[unit];
}

export function buildAreaConversions(areaM2: number): AreaConversions {
  assertPositiveFinite(areaM2, "The area");

  return {
    m2: areaM2,
    ft2: convertM2ToArea(areaM2, "ft2"),
    ha: convertM2ToArea(areaM2, "ha"),
    acre: convertM2ToArea(areaM2, "acre"),
  };
}

export function calculatePricePerArea(
  input: PricePerAreaInput,
): PricePerAreaResult {
  const areaM2 = convertAreaToM2(input.area, input.areaUnit);
  const additionalCosts = normalizeAdditionalCosts(input.additionalCosts ?? 0);
  const surfaceType = input.surfaceType ?? "built";
  const totalPrice =
    input.mode === "price-per-area"
      ? normalizePositiveMoney(input.totalPrice, "The total price")
      : areaM2 * normalizePositiveMoney(input.pricePerM2, "The price per m²");
  const basePricePerM2 = totalPrice / areaM2;
  const effectiveTotal = totalPrice + additionalCosts;
  const effectivePricePerM2 = effectiveTotal / areaM2;
  const areaConversions = buildAreaConversions(areaM2);

  return {
    mode: input.mode,
    area: input.area,
    areaUnit: input.areaUnit,
    surfaceType,
    areaM2,
    areaConversions,
    totalPrice,
    additionalCosts,
    effectiveTotal,
    basePricePerM2,
    effectivePricePerM2,
    effectivePricePerFt2: effectiveTotal / areaConversions.ft2,
  };
}

export function buildPropertyComparison(
  options: readonly PropertyComparisonInput[],
): PropertyComparisonResult {
  if (options.length < 2 || options.length > 5) {
    throw new RangeError("Compare between 2 and 5 options.");
  }

  const calculated = options.map((option, index) => {
    const result = calculatePricePerArea({
      mode: "price-per-area",
      totalPrice: option.totalPrice,
      area: option.area,
      areaUnit: option.areaUnit,
      surfaceType: option.surfaceType ?? "built",
      additionalCosts: option.additionalCosts ?? 0,
    });

    return {
      ...result,
      id: option.id ?? `option-${index + 1}`,
      name: option.name?.trim() || `Opcion ${index + 1}`,
      note: option.note?.trim() ?? "",
      rank: 0,
      isCheapest: false,
      differenceAbsolute: 0,
      differencePercent: 0,
    } satisfies ComparedProperty;
  });
  const sorted = [...calculated].sort(
    (a, b) => a.effectivePricePerM2 - b.effectivePricePerM2,
  );
  const cheapest = sorted[0];
  const ranked = calculated.map((item) => {
    const rank = sorted.findIndex((candidate) => candidate.id === item.id) + 1;
    const differenceAbsolute =
      item.effectivePricePerM2 - cheapest.effectivePricePerM2;
    const differencePercent =
      differenceAbsolute / cheapest.effectivePricePerM2 * 100;

    return {
      ...item,
      rank,
      isCheapest: item.id === cheapest.id,
      differenceAbsolute,
      differencePercent,
    };
  });
  const surfaceTypes = new Set(ranked.map((item) => item.surfaceType));
  const hasMixedSurfaceTypes = surfaceTypes.size > 1;
  const rankedCheapest =
    ranked.find((item) => item.id === cheapest.id) ?? ranked[0];

  return {
    items: ranked,
    cheapest: rankedCheapest,
    hasMixedSurfaceTypes,
    warning: hasMixedSurfaceTypes
      ? "These options mix surface types; compare the result carefully."
      : undefined,
  };
}

export function formatCurrency(
  value: number,
  currency = "MXN",
  locale = "en-US",
): string {
  assertFinite(value, "The amount");

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatArea(value: number, unit: AreaUnit = "m2"): string {
  assertFinite(value, "The area");

  const maximumFractionDigits = unit === "m2" || unit === "ft2" ? 2 : 4;

  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value)} ${AREA_UNIT_LABELS[unit]}`;
}

export function formatPercent(value: number): string {
  assertFinite(value, "The percentage");

  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: Math.abs(value) < 10 ? 2 : 1,
  }).format(value)}%`;
}

export function buildCopyText(result: PricePerAreaResult): string {
  return [
    "Price per area calculator - calculadoras.tools",
    `Surface type: ${SURFACE_TYPE_LABELS[result.surfaceType]}`,
    `Area: ${formatArea(result.areaM2, "m2")}`,
    `Base price per m²: ${formatCurrency(result.basePricePerM2)}`,
    `Effective price per m²: ${formatCurrency(result.effectivePricePerM2)}`,
    `Total price: ${formatCurrency(result.totalPrice)}`,
    `Additional costs: ${formatCurrency(result.additionalCosts)}`,
  ].join("\n");
}

export function buildComparisonCopyText(
  comparison: PropertyComparisonResult,
): string {
  return [
    "Price per area comparison - calculadoras.tools",
    `Lowest effective price per m²: ${comparison.cheapest.name}`,
    ...comparison.items
      .slice()
      .sort((a, b) => a.rank - b.rank)
      .map(
        (item) =>
          `${item.rank}. ${item.name}: ${formatCurrency(item.effectivePricePerM2)}/m2 effective (${formatCurrency(item.differenceAbsolute)} above lowest, ${formatPercent(item.differencePercent)})`,
      ),
    comparison.warning ?? "",
  ]
    .filter(Boolean)
    .join("\n");
}

function normalizeSeparators(value: string): string {
  const commaCount = countOccurrences(value, ",");
  const dotCount = countOccurrences(value, ".");

  if (commaCount > 0 && dotCount > 0) {
    const decimalSeparator =
      value.lastIndexOf(",") > value.lastIndexOf(".") ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";

    return value
      .replaceAll(thousandsSeparator, "")
      .replace(decimalSeparator, ".");
  }

  if (commaCount > 0) {
    return normalizeSingleSeparator(value, ",");
  }

  if (dotCount > 0) {
    return normalizeSingleSeparator(value, ".");
  }

  return value;
}

function normalizeSingleSeparator(value: string, separator: "," | "."): string {
  if (countOccurrences(value, separator) > 1) {
    return value.replaceAll(separator, "");
  }

  const [integerPart, fractionalPart] = value.split(separator);

  if (!fractionalPart) {
    return integerPart;
  }

  const looksLikeThousands =
    integerPart.length <= 3 &&
    fractionalPart.length === 3 &&
    /^\d{1,3}$/.test(integerPart);

  return looksLikeThousands
    ? `${integerPart}${fractionalPart}`
    : `${integerPart}.${fractionalPart}`;
}

function countOccurrences(value: string, character: string): number {
  return value.split(character).length - 1;
}

function normalizePositiveMoney(
  value: number | undefined,
  label: string,
): number {
  if (value === undefined) {
    throw new RangeError(`${label} must be greater than zero.`);
  }

  assertPositiveFinite(value, label);

  return value;
}

function normalizeAdditionalCosts(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError("Additional costs must be greater than or equal to zero.");
  }

  return value;
}

function assertPositiveFinite(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} must be greater than zero.`);
  }
}

function assertFinite(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${label} must be a valid number.`);
  }
}
