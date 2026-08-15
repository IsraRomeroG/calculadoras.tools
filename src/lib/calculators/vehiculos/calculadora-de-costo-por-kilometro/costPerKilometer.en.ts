export const MILES_TO_KILOMETERS = 1.609344;
export const US_GALLON_TO_LITERS = 3.785411784;
export const KM_PER_LITER_TO_MPG_US = 2.352145833;

export const DISTANCE_UNITS = ["km", "mi"] as const;
export const EFFICIENCY_UNITS = ["km-l", "l-100-km", "mpg-us"] as const;
export const FUEL_PRICE_UNITS = ["l", "gal-us"] as const;
export const TRIP_TYPES = ["ida", "ida-vuelta"] as const;
export const FUEL_MARGINS = [0, 10, 15] as const;
export const ADDITIONAL_COST_MODES = ["total", "duplicar-ida-vuelta"] as const;
export const PROJECTION_PERIODS = ["week", "month"] as const;

export type DistanceUnit = (typeof DISTANCE_UNITS)[number];
export type EfficiencyUnit = (typeof EFFICIENCY_UNITS)[number];
export type FuelPriceUnit = (typeof FUEL_PRICE_UNITS)[number];
export type TripType = (typeof TRIP_TYPES)[number];
export type FuelMargin = (typeof FUEL_MARGINS)[number];
export type AdditionalCostMode = (typeof ADDITIONAL_COST_MODES)[number];
export type ProjectionPeriod = (typeof PROJECTION_PERIODS)[number];

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

export interface AdditionalTripCostInput {
  tolls?: number;
  parking?: number;
  otherCosts?: number;
  tripType?: TripType;
  additionalCostMode?: AdditionalCostMode;
}

export interface AdditionalTripCostResult {
  manualCosts: number;
  multiplier: 1 | 2;
  totalAdditionalCosts: number;
}

export interface VariableTripCostInput extends AdditionalTripCostInput {
  distance: number;
  distanceUnit: DistanceUnit;
  tripType?: TripType;
  efficiency: number;
  efficiencyUnit: EfficiencyUnit;
  fuelPrice: number;
  fuelPriceUnit: FuelPriceUnit;
  fuelMarginPercent?: FuelMargin;
  passengers?: number;
  recurringTrips?: number;
  projectionPeriod?: ProjectionPeriod;
  budget?: number;
  currency?: string;
}

export interface RecurringTripCostResult {
  tripCount: number;
  period: ProjectionPeriod;
  totalCost: number;
  fuelCost: number;
  additionalCosts: number;
}

export interface BudgetComparisonResult {
  budget: number;
  difference: number;
  status: "remaining" | "shortfall" | "exact";
}

export interface VariableTripCostResult {
  distanceKm: number;
  totalDistanceKm: number;
  tripType: TripType;
  kmPerLiter: number;
  fuelPricePerLiter: number;
  fuelMarginPercent: FuelMargin;
  baseLiters: number;
  litersNeeded: number;
  fuelCost: number;
  manualAdditionalCosts: number;
  additionalCostMultiplier: 1 | 2;
  additionalCosts: number;
  totalCost: number;
  fuelCostPerKm: number;
  totalCostPerKm: number;
  passengers: number;
  costPerPassenger: number;
  recurringCost?: RecurringTripCostResult;
  budgetComparison?: BudgetComparisonResult;
  currency: string;
}

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

export function normalizeTripDistance(
  value: number,
  unit: DistanceUnit,
  tripTypeOrRoundTrip: TripType | boolean = "ida",
): number {
  const distanceKm = convertDistanceToKm(value, unit);
  const isRoundTrip =
    typeof tripTypeOrRoundTrip === "boolean"
      ? tripTypeOrRoundTrip
      : tripTypeOrRoundTrip === "ida-vuelta";

  return isRoundTrip ? distanceKm * 2 : distanceKm;
}

export function normalizeFuelEfficiency(
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

export function normalizeFuelPrice(
  value: number,
  unit: FuelPriceUnit,
): number {
  validateNonNegativeFinite(value, "price");

  if (unit === "l") {
    return value;
  }

  if (unit === "gal-us") {
    return value / US_GALLON_TO_LITERS;
  }

  throw new RangeError("Unsupported price unit.");
}

export function calculateTripFuelLiters(
  distanceKm: number,
  kmPerLiter: number,
): number {
  validatePositiveFinite(distanceKm, "distance");
  validatePositiveFinite(kmPerLiter, "fuel economy");

  return distanceKm / kmPerLiter;
}

export function applyFuelSafetyMargin(
  liters: number,
  marginPercent: FuelMargin,
): number {
  validatePositiveFinite(liters, "liters");

  if (!FUEL_MARGINS.includes(marginPercent)) {
    throw new RangeError("Unsupported fuel margin.");
  }

  return liters * (1 + marginPercent / 100);
}

export function calculateAdditionalTripCosts(
  input: AdditionalTripCostInput,
): AdditionalTripCostResult {
  const tolls = input.tolls ?? 0;
  const parking = input.parking ?? 0;
  const otherCosts = input.otherCosts ?? 0;
  const tripType = input.tripType ?? "ida";
  const additionalCostMode = input.additionalCostMode ?? "total";

  validateNonNegativeFinite(tolls, "tolls");
  validateNonNegativeFinite(parking, "parking");
  validateNonNegativeFinite(otherCosts, "other expenses");

  if (!TRIP_TYPES.includes(tripType)) {
    throw new RangeError("Unsupported trip type.");
  }

  if (!ADDITIONAL_COST_MODES.includes(additionalCostMode)) {
    throw new RangeError("Tratamiento de gastos no soportado.");
  }

  const manualCosts = tolls + parking + otherCosts;
  const multiplier =
    tripType === "ida-vuelta" && additionalCostMode === "duplicar-ida-vuelta"
      ? 2
      : 1;

  return {
    manualCosts,
    multiplier,
    totalAdditionalCosts: manualCosts * multiplier,
  };
}

export function calculateVariableTripCost(
  input: VariableTripCostInput,
): VariableTripCostResult {
  const tripType = input.tripType ?? "ida";
  const fuelMarginPercent = input.fuelMarginPercent ?? 0;
  const passengers = input.passengers ?? 1;
  const projectionPeriod = input.projectionPeriod ?? "month";
  const currency = input.currency ?? "MXN";

  if (!TRIP_TYPES.includes(tripType)) {
    throw new RangeError("Unsupported trip type.");
  }

  if (!FUEL_MARGINS.includes(fuelMarginPercent)) {
    throw new RangeError("Unsupported fuel margin.");
  }

  validatePositiveInteger(passengers, "passengers");

  const distanceKm = convertDistanceToKm(input.distance, input.distanceUnit);
  const totalDistanceKm = normalizeTripDistance(
    input.distance,
    input.distanceUnit,
    tripType,
  );
  const kmPerLiter = normalizeFuelEfficiency(input.efficiency, input.efficiencyUnit);
  const fuelPricePerLiter = normalizeFuelPrice(input.fuelPrice, input.fuelPriceUnit);
  const baseLiters = calculateTripFuelLiters(totalDistanceKm, kmPerLiter);
  const litersNeeded = applyFuelSafetyMargin(baseLiters, fuelMarginPercent);
  const fuelCost = litersNeeded * fuelPricePerLiter;
  const additionalCostsResult = calculateAdditionalTripCosts({
    tolls: input.tolls,
    parking: input.parking,
    otherCosts: input.otherCosts,
    tripType,
    additionalCostMode: input.additionalCostMode,
  });
  const additionalCosts = additionalCostsResult.totalAdditionalCosts;
  const totalCost = fuelCost + additionalCosts;
  const result: VariableTripCostResult = {
    distanceKm,
    totalDistanceKm,
    tripType,
    kmPerLiter,
    fuelPricePerLiter,
    fuelMarginPercent,
    baseLiters,
    litersNeeded,
    fuelCost,
    manualAdditionalCosts: additionalCostsResult.manualCosts,
    additionalCostMultiplier: additionalCostsResult.multiplier,
    additionalCosts,
    totalCost,
    fuelCostPerKm: fuelCost / totalDistanceKm,
    totalCostPerKm: totalCost / totalDistanceKm,
    passengers,
    costPerPassenger: calculateCostPerPassenger(totalCost, passengers),
    currency,
  };

  if (input.recurringTrips !== undefined) {
    result.recurringCost = calculateRecurringTripCost(
      {
        totalCost,
        fuelCost,
        additionalCosts,
      },
      input.recurringTrips,
      projectionPeriod,
    );
  }

  if (input.budget !== undefined) {
    result.budgetComparison = compareTripCostWithBudget(totalCost, input.budget);
  }

  return result;
}

export function calculateCostPerPassenger(
  total: number,
  passengers: number,
): number {
  validateNonNegativeFinite(total, "total");
  validatePositiveInteger(passengers, "passengers");

  return total / passengers;
}

export function calculateRecurringTripCost(
  costs: number | Pick<VariableTripCostResult, "totalCost" | "fuelCost" | "additionalCosts">,
  tripCount: number,
  period: ProjectionPeriod = "month",
): RecurringTripCostResult {
  validatePositiveInteger(tripCount, "recurring trips");

  if (!PROJECTION_PERIODS.includes(period)) {
    throw new RangeError("Periodo de proyeccion no soportado.");
  }

  const totalCost = typeof costs === "number" ? costs : costs.totalCost;
  const fuelCost = typeof costs === "number" ? 0 : costs.fuelCost;
  const additionalCosts = typeof costs === "number" ? 0 : costs.additionalCosts;

  validateNonNegativeFinite(totalCost, "total");
  validateNonNegativeFinite(fuelCost, "fuel");
  validateNonNegativeFinite(additionalCosts, "additional expenses");

  return {
    tripCount,
    period,
    totalCost: totalCost * tripCount,
    fuelCost: fuelCost * tripCount,
    additionalCosts: additionalCosts * tripCount,
  };
}

export function compareTripCostWithBudget(
  total: number,
  budget: number,
): BudgetComparisonResult {
  validateNonNegativeFinite(total, "total");
  validateNonNegativeFinite(budget, "budget");

  const difference = budget - total;
  const status =
    difference > 0 ? "remaining" : difference < 0 ? "shortfall" : "exact";

  return {
    budget,
    difference,
    status,
  };
}

export function parseMoneyInput(value: string): ParseDecimalResult {
  return parseDecimalInput(value);
}

export function parseDecimalInput(value: string): ParseDecimalResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { ok: false, error: "required" };
  }

  if (/-/.test(trimmed)) {
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

export function formatCostCurrency(value: number, currency = "MXN"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
      style: "currency",
    }).format(value);
  } catch {
    return `${formatCompactNumber(value, 2)} ${currency}`;
  }
}

export function formatFixedNumber(value: number, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits,
  }).format(value);
}

export function formatCompactNumber(value: number, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value);
}

export function buildCostPerKilometerShareText(
  result: VariableTripCostResult,
): string {
  const currency = result.currency;
  const lines = [
    "Cost per kilometer:",
    `Total distance: ${formatCompactNumber(result.totalDistanceKm)} km`,
    `Estimated fuel: ${formatFixedNumber(result.litersNeeded)} L`,
    `Fuel cost: ${formatCostCurrency(result.fuelCost, currency)}`,
    `Additional expenses: ${formatCostCurrency(result.additionalCosts, currency)}`,
    `Total cost: ${formatCostCurrency(result.totalCost, currency)}`,
    `Fuel cost/km: ${formatCostCurrency(result.fuelCostPerKm, currency)}/km`,
    `Total cost/km: ${formatCostCurrency(result.totalCostPerKm, currency)}/km`,
  ];

  if (result.passengers > 1) {
    lines.push(
      `Pasajeros: ${result.passengers}`,
      `Cost per passenger: ${formatCostCurrency(result.costPerPassenger, currency)}`,
    );
  }

  if (result.recurringCost) {
    lines.push(
      `${result.recurringCost.tripCount} trips per ${result.recurringCost.period}`,
      `Estimated period cost: ${formatCostCurrency( result.recurringCost.totalCost, currency, )}`,
    );
  }

  if (result.budgetComparison) {
    const budgetText = formatCostCurrency(result.budgetComparison.budget, currency);
    const differenceText = formatCostCurrency(
      Math.abs(result.budgetComparison.difference),
      currency,
    );

    lines.push(`Budget: ${budgetText}`);

    if (result.budgetComparison.status === "remaining") {
      lines.push(`Available amount: ${differenceText}`);
    } else if (result.budgetComparison.status === "shortfall") {
      lines.push(`Falta: ${differenceText}`);
    } else {
      lines.push("The cost matches the budget.");
    }
  }

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

function validateNonNegativeFinite(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} must be a finite nonnegative number.`);
  }
}

function validatePositiveInteger(value: number, label: string) {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`${label} must be an integer greater than or equal to one.`);
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
