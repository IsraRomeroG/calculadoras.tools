export const MILES_TO_KILOMETERS = 1.609344;
export const US_GALLON_TO_LITERS = 3.785411784;
export const KM_PER_LITER_TO_MPG_US = 2.352145833;

export const DISTANCE_UNITS = ["km", "mi"] as const;
export const FUEL_UNITS = ["l", "gal-us"] as const;
export const EFFICIENCY_UNITS = ["km-l", "l-100-km", "mpg-us"] as const;
export const TRIP_TYPES = ["ida", "ida-vuelta"] as const;
export const SAFETY_MARGINS = [0, 10, 15] as const;

export type DistanceUnit = (typeof DISTANCE_UNITS)[number];
export type FuelUnit = (typeof FUEL_UNITS)[number];
export type EfficiencyUnit = (typeof EFFICIENCY_UNITS)[number];
export type TripType = (typeof TRIP_TYPES)[number];
export type SafetyMargin = (typeof SAFETY_MARGINS)[number];

export type ParseDecimalResult =
  | {
      ok: true;
      value: number;
      normalized: string;
    }
  | {
      ok: false;
      error: "required" | "invalid" | "negative";
    };

export interface FuelEfficiencyResult {
  distanceKm: number;
  fuelLiters: number;
  kmPerLiter: number;
  litersPer100Km: number;
  mpgUs: number;
  rangeWithFuelKm: number;
}

export interface FuelNeededInput {
  distance: number;
  distanceUnit: DistanceUnit;
  tripType?: TripType;
  efficiency: number;
  efficiencyUnit: EfficiencyUnit;
  marginPercent?: SafetyMargin;
}

export interface FuelNeededResult {
  distanceKm: number;
  totalDistanceKm: number;
  tripType: TripType;
  kmPerLiter: number;
  marginPercent: SafetyMargin;
  baseLiters: number;
  litersNeeded: number;
  gallonsUsNeeded: number;
}

export type FuelConsumptionShareResult =
  | {
      mode: "rendimiento";
      distanceLabel: string;
      fuelLabel: string;
      efficiency: FuelEfficiencyResult;
    }
  | {
      mode: "trayecto";
      distanceLabel: string;
      efficiencyLabel: string;
      estimate: FuelNeededResult;
    };

export function convertDistanceToKm(value: number, unit: DistanceUnit): number {
  validatePositiveFinite(value, "distance");

  if (unit === "km") {
    return value;
  }

  if (unit === "mi") {
    return value * MILES_TO_KILOMETERS;
  }

  throw new RangeError("Unsupported distance unit.");
}

export function convertFuelToLiters(value: number, unit: FuelUnit): number {
  validatePositiveFinite(value, "fuel");

  if (unit === "l") {
    return value;
  }

  if (unit === "gal-us") {
    return value * US_GALLON_TO_LITERS;
  }

  throw new RangeError("Unsupported fuel unit.");
}

export function calculateFuelEfficiency(
  distanceKm: number,
  fuelLiters: number,
): FuelEfficiencyResult {
  validatePositiveFinite(distanceKm, "distance");
  validatePositiveFinite(fuelLiters, "fuel");

  const kmPerLiter = distanceKm / fuelLiters;

  return {
    distanceKm,
    fuelLiters,
    kmPerLiter,
    litersPer100Km: convertKmPerLiterToLitersPer100Km(kmPerLiter),
    mpgUs: convertKmPerLiterToMpgUs(kmPerLiter),
    rangeWithFuelKm: kmPerLiter * fuelLiters,
  };
}

export function convertKmPerLiterToLitersPer100Km(value: number): number {
  validatePositiveFinite(value, "fuel economy");

  return 100 / value;
}

export function convertKmPerLiterToMpgUs(value: number): number {
  validatePositiveFinite(value, "fuel economy");

  return value * KM_PER_LITER_TO_MPG_US;
}

export function normalizeEfficiency(
  value: number,
  unit: EfficiencyUnit,
): number {
  validatePositiveFinite(value, "fuel economy");

  if (unit === "km-l") {
    return value;
  }

  if (unit === "l-100-km") {
    return 100 / value;
  }

  if (unit === "mpg-us") {
    return value / KM_PER_LITER_TO_MPG_US;
  }

  throw new RangeError("Unsupported fuel economy unit.");
}

export function calculateFuelNeeded(
  distanceKm: number,
  kmPerLiter: number,
): number {
  validatePositiveFinite(distanceKm, "distance");
  validatePositiveFinite(kmPerLiter, "fuel economy");

  return distanceKm / kmPerLiter;
}

export function applyTripMultiplier(
  distanceKm: number,
  tripType: TripType,
): number {
  validatePositiveFinite(distanceKm, "distance");

  if (tripType === "ida") {
    return distanceKm;
  }

  if (tripType === "ida-vuelta") {
    return distanceKm * 2;
  }

  throw new RangeError("Unsupported trip type.");
}

export function applyFuelSafetyMargin(
  liters: number,
  marginPercent: SafetyMargin,
): number {
  validatePositiveFinite(liters, "liters");

  if (!SAFETY_MARGINS.includes(marginPercent)) {
    throw new RangeError("Unsupported safety margin.");
  }

  return liters * (1 + marginPercent / 100);
}

export function convertLitersToGallonsUs(value: number): number {
  validatePositiveFinite(value, "liters");

  return value / US_GALLON_TO_LITERS;
}

export function calculateFuelNeededForTrip(
  input: FuelNeededInput,
): FuelNeededResult {
  const tripType = input.tripType ?? "ida";
  const marginPercent = input.marginPercent ?? 0;
  const distanceKm = convertDistanceToKm(input.distance, input.distanceUnit);
  const totalDistanceKm = applyTripMultiplier(distanceKm, tripType);
  const kmPerLiter = normalizeEfficiency(input.efficiency, input.efficiencyUnit);
  const baseLiters = calculateFuelNeeded(totalDistanceKm, kmPerLiter);
  const litersNeeded = applyFuelSafetyMargin(baseLiters, marginPercent);

  return {
    distanceKm,
    totalDistanceKm,
    tripType,
    kmPerLiter,
    marginPercent,
    baseLiters,
    litersNeeded,
    gallonsUsNeeded: convertLitersToGallonsUs(litersNeeded),
  };
}

export function parseDecimalInput(value: string): ParseDecimalResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  if (/[-−]/.test(trimmed)) {
    return { ok: false, error: "negative" };
  }

  const compact = trimmed.replace(/\s+/g, "");

  if (/[^0-9.,]/.test(compact)) {
    return { ok: false, error: "invalid" };
  }

  const normalized = normalizeDecimalSeparators(compact);

  if (!normalized || !/^\d+(\.\d+)?$/.test(normalized)) {
    return { ok: false, error: "invalid" };
  }

  const numericValue = Number(normalized);

  if (!Number.isFinite(numericValue)) {
    return { ok: false, error: "invalid" };
  }

  return {
    ok: true,
    value: numericValue,
    normalized,
  };
}

export function formatFuelNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits,
  }).format(value);
}

export function formatCompactNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value);
}

export function buildFuelConsumptionShareText(
  result: FuelConsumptionShareResult,
): string {
  if (result.mode === "rendimiento") {
    return [
      "Fuel consumption:",
      `Distance: ${result.distanceLabel}`,
      `Fuel: ${result.fuelLabel}`,
      `Fuel economy: ${formatFuelNumber(result.efficiency.kmPerLiter)} km/L`,
      `Consumption: ${formatFuelNumber(result.efficiency.litersPer100Km)} L/100 km`,
      `Equivalent: ${formatFuelNumber(result.efficiency.mpgUs)} mpg US`,
    ].join("\n");
  }

  const lines = [
    "Fuel for trip:",
    `Total distance: ${result.distanceLabel}`,
    `Fuel economy: ${result.efficiencyLabel}`,
  ];

  if (result.estimate.marginPercent > 0) {
    lines.push(
      `Base fuel: ${formatFuelNumber(result.estimate.baseLiters)} L`,
      `Margin: ${result.estimate.marginPercent}%`,
    );
  }

  lines.push(
    `Estimated fuel: ${formatFuelNumber(result.estimate.litersNeeded)} L`,
    `Equivalent: ${formatFuelNumber(result.estimate.gallonsUsNeeded)} gal US`,
  );

  return lines.join("\n");
}

function normalizeDecimalSeparators(value: string): string | undefined {
  const lastComma = value.lastIndexOf(",");
  const lastDot = value.lastIndexOf(".");

  if (lastComma !== -1 && lastDot !== -1) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const groupingSeparator = decimalSeparator === "," ? "." : ",";
    const decimalIndex = value.lastIndexOf(decimalSeparator);
    const integerPart = value.slice(0, decimalIndex);
    const decimalPart = value.slice(decimalIndex + 1);

    if (
      !decimalPart ||
      decimalPart.includes(groupingSeparator) ||
      !isValidGroupedInteger(integerPart, groupingSeparator)
    ) {
      return undefined;
    }

    return `${stripGrouping(integerPart, groupingSeparator)}.${decimalPart}`;
  }

  if (lastComma !== -1) {
    return normalizeSingleSeparator(value, ",");
  }

  if (lastDot !== -1) {
    return normalizeSingleSeparator(value, ".");
  }

  return value;
}

function normalizeSingleSeparator(
  value: string,
  separator: "," | ".",
): string | undefined {
  const parts = value.split(separator);

  if (parts.length === 2) {
    const [integerPart, decimalOrGroupPart] = parts;

    if (!integerPart || !decimalOrGroupPart) {
      return undefined;
    }

    if (
      decimalOrGroupPart.length === 3 &&
      integerPart.length <= 3 &&
      /^\d{1,3}$/.test(integerPart)
    ) {
      return `${integerPart}${decimalOrGroupPart}`;
    }

    return `${integerPart}.${decimalOrGroupPart}`;
  }

  if (
    parts.length > 2 &&
    parts.every(Boolean) &&
    parts.slice(1).every((part) => part.length === 3)
  ) {
    return parts.join("");
  }

  return undefined;
}

function validatePositiveFinite(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} must be a finite number greater than zero.`);
  }
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
