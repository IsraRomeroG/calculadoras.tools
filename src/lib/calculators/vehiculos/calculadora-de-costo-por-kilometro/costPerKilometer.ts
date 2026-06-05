export const MILES_TO_KILOMETERS = 1.609344;
export const US_GALLON_TO_LITERS = 3.785411784;
export const KM_PER_LITER_TO_MPG_US = 2.352145833;

export const DISTANCE_UNITS = ["km", "mi"] as const;
export const EFFICIENCY_UNITS = ["km-l", "l-100-km", "mpg-us"] as const;
export const FUEL_PRICE_UNITS = ["l", "gal-us"] as const;
export const TRIP_TYPES = ["ida", "ida-vuelta"] as const;
export const FUEL_MARGINS = [0, 10, 15] as const;
export const ADDITIONAL_COST_MODES = ["total", "duplicar-ida-vuelta"] as const;
export const PROJECTION_PERIODS = ["semana", "mes"] as const;

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
  validatePositiveFinite(value, "distancia");

  if (unit === "km") {
    return value;
  }

  if (unit === "mi") {
    return value * MILES_TO_KILOMETERS;
  }

  throw new RangeError("Unidad de distancia no soportada.");
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
  validatePositiveFinite(value, "rendimiento");

  if (unit === "km-l") {
    return value;
  }

  if (unit === "l-100-km") {
    return 100 / value;
  }

  if (unit === "mpg-us") {
    return value / KM_PER_LITER_TO_MPG_US;
  }

  throw new RangeError("Unidad de rendimiento no soportada.");
}

export function normalizeFuelPrice(
  value: number,
  unit: FuelPriceUnit,
): number {
  validateNonNegativeFinite(value, "precio");

  if (unit === "l") {
    return value;
  }

  if (unit === "gal-us") {
    return value / US_GALLON_TO_LITERS;
  }

  throw new RangeError("Unidad de precio no soportada.");
}

export function calculateTripFuelLiters(
  distanceKm: number,
  kmPerLiter: number,
): number {
  validatePositiveFinite(distanceKm, "distancia");
  validatePositiveFinite(kmPerLiter, "rendimiento");

  return distanceKm / kmPerLiter;
}

export function applyFuelSafetyMargin(
  liters: number,
  marginPercent: FuelMargin,
): number {
  validatePositiveFinite(liters, "litros");

  if (!FUEL_MARGINS.includes(marginPercent)) {
    throw new RangeError("Margen de consumo no soportado.");
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

  validateNonNegativeFinite(tolls, "casetas");
  validateNonNegativeFinite(parking, "estacionamiento");
  validateNonNegativeFinite(otherCosts, "otros gastos");

  if (!TRIP_TYPES.includes(tripType)) {
    throw new RangeError("Tipo de trayecto no soportado.");
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
  const projectionPeriod = input.projectionPeriod ?? "mes";
  const currency = input.currency ?? "MXN";

  if (!TRIP_TYPES.includes(tripType)) {
    throw new RangeError("Tipo de trayecto no soportado.");
  }

  if (!FUEL_MARGINS.includes(fuelMarginPercent)) {
    throw new RangeError("Margen de consumo no soportado.");
  }

  validatePositiveInteger(passengers, "pasajeros");

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
  validatePositiveInteger(passengers, "pasajeros");

  return total / passengers;
}

export function calculateRecurringTripCost(
  costs: number | Pick<VariableTripCostResult, "totalCost" | "fuelCost" | "additionalCosts">,
  tripCount: number,
  period: ProjectionPeriod = "mes",
): RecurringTripCostResult {
  validatePositiveInteger(tripCount, "viajes recurrentes");

  if (!PROJECTION_PERIODS.includes(period)) {
    throw new RangeError("Periodo de proyeccion no soportado.");
  }

  const totalCost = typeof costs === "number" ? costs : costs.totalCost;
  const fuelCost = typeof costs === "number" ? 0 : costs.fuelCost;
  const additionalCosts = typeof costs === "number" ? 0 : costs.additionalCosts;

  validateNonNegativeFinite(totalCost, "total");
  validateNonNegativeFinite(fuelCost, "combustible");
  validateNonNegativeFinite(additionalCosts, "gastos adicionales");

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
  validateNonNegativeFinite(budget, "presupuesto");

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
    return new Intl.NumberFormat("es-MX", {
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
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits,
  }).format(value);
}

export function formatCompactNumber(value: number, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits,
  }).format(value);
}

export function buildCostPerKilometerShareText(
  result: VariableTripCostResult,
): string {
  const currency = result.currency;
  const lines = [
    "Costo por kilometro:",
    `Distancia total: ${formatCompactNumber(result.totalDistanceKm)} km`,
    `Combustible estimado: ${formatFixedNumber(result.litersNeeded)} l`,
    `Costo de combustible: ${formatCostCurrency(result.fuelCost, currency)}`,
    `Gastos adicionales: ${formatCostCurrency(result.additionalCosts, currency)}`,
    `Costo total: ${formatCostCurrency(result.totalCost, currency)}`,
    `Costo combustible/km: ${formatCostCurrency(result.fuelCostPerKm, currency)}/km`,
    `Costo total/km: ${formatCostCurrency(result.totalCostPerKm, currency)}/km`,
  ];

  if (result.passengers > 1) {
    lines.push(
      `Pasajeros: ${result.passengers}`,
      `Costo por pasajero: ${formatCostCurrency(result.costPerPassenger, currency)}`,
    );
  }

  if (result.recurringCost) {
    lines.push(
      `${result.recurringCost.tripCount} viajes al ${result.recurringCost.period}`,
      `Costo estimado del periodo: ${formatCostCurrency(
        result.recurringCost.totalCost,
        currency,
      )}`,
    );
  }

  if (result.budgetComparison) {
    const budgetText = formatCostCurrency(result.budgetComparison.budget, currency);
    const differenceText = formatCostCurrency(
      Math.abs(result.budgetComparison.difference),
      currency,
    );

    lines.push(`Presupuesto: ${budgetText}`);

    if (result.budgetComparison.status === "remaining") {
      lines.push(`Queda disponible: ${differenceText}`);
    } else if (result.budgetComparison.status === "shortfall") {
      lines.push(`Falta: ${differenceText}`);
    } else {
      lines.push("El costo coincide con el presupuesto.");
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
    throw new RangeError(`${label} debe ser un numero finito mayor a cero.`);
  }
}

function validateNonNegativeFinite(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} debe ser un numero finito no negativo.`);
  }
}

function validatePositiveInteger(value: number, label: string) {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`${label} debe ser un entero mayor o igual a uno.`);
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
