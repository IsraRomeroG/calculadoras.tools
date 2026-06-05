import { describe, expect, it } from "vitest";
import {
  applyFuelSafetyMargin,
  buildCostPerKilometerShareText,
  calculateAdditionalTripCosts,
  calculateCostPerPassenger,
  calculateRecurringTripCost,
  calculateTripFuelLiters,
  calculateVariableTripCost,
  compareTripCostWithBudget,
  normalizeFuelEfficiency,
  normalizeFuelPrice,
  normalizeTripDistance,
  parseMoneyInput,
} from "./costPerKilometer";

describe("cost per kilometer formulas", () => {
  it("calculates fuel liters, fuel cost, total and cost per kilometer", () => {
    const result = calculateVariableTripCost({
      distance: 300,
      distanceUnit: "km",
      tripType: "ida",
      efficiency: 12.5,
      efficiencyUnit: "km-l",
      fuelPrice: 24,
      fuelPriceUnit: "l",
      tolls: 250,
    });

    expect(result.litersNeeded).toBe(24);
    expect(result.fuelCost).toBe(576);
    expect(result.additionalCosts).toBe(250);
    expect(result.totalCost).toBe(826);
    expect(result.fuelCostPerKm).toBe(1.92);
    expect(result.totalCostPerKm).toBeCloseTo(2.7533333333);
  });

  it("normalizes trip distance, efficiency and fuel price units", () => {
    expect(normalizeTripDistance(1, "mi", false)).toBe(1.609344);
    expect(normalizeTripDistance(300, "km", "ida-vuelta")).toBe(600);
    expect(normalizeFuelEfficiency(8, "l-100-km")).toBe(12.5);
    expect(normalizeFuelEfficiency(29.4018229125, "mpg-us")).toBeCloseTo(12.5);
    expect(normalizeFuelPrice(90, "gal-us")).toBeCloseTo(23.7754851503);
  });

  it("calculates trip fuel and applies margin", () => {
    expect(calculateTripFuelLiters(300, 12.5)).toBe(24);
    expect(applyFuelSafetyMargin(24, 10)).toBeCloseTo(26.4);
  });

  it("duplicates distance and fuel on round trip without duplicating costs by default", () => {
    const result = calculateVariableTripCost({
      distance: 300,
      distanceUnit: "km",
      tripType: "ida-vuelta",
      efficiency: 12.5,
      efficiencyUnit: "km-l",
      fuelPrice: 24,
      fuelPriceUnit: "l",
      tolls: 250,
    });

    expect(result.totalDistanceKm).toBe(600);
    expect(result.litersNeeded).toBe(48);
    expect(result.fuelCost).toBe(1152);
    expect(result.additionalCosts).toBe(250);
  });

  it("duplicates manual costs only when requested", () => {
    const costs = calculateAdditionalTripCosts({
      tolls: 200,
      parking: 30,
      otherCosts: 20,
      tripType: "ida-vuelta",
      additionalCostMode: "duplicar-ida-vuelta",
    });

    expect(costs.manualCosts).toBe(250);
    expect(costs.multiplier).toBe(2);
    expect(costs.totalAdditionalCosts).toBe(500);
  });

  it("allows zero fuel price and non-negative optional costs", () => {
    const result = calculateVariableTripCost({
      distance: 100,
      distanceUnit: "km",
      efficiency: 10,
      efficiencyUnit: "km-l",
      fuelPrice: 0,
      fuelPriceUnit: "l",
      parking: 20,
    });

    expect(result.fuelCost).toBe(0);
    expect(result.totalCost).toBe(20);
    expect(result.totalCostPerKm).toBe(0.2);
  });

  it("divides total cost between passengers", () => {
    expect(calculateCostPerPassenger(826, 4)).toBe(206.5);

    const result = calculateVariableTripCost({
      distance: 300,
      distanceUnit: "km",
      efficiency: 12.5,
      efficiencyUnit: "km-l",
      fuelPrice: 24,
      fuelPriceUnit: "l",
      tolls: 250,
      passengers: 4,
    });

    expect(result.costPerPassenger).toBe(206.5);
  });

  it("projects recurring costs by period", () => {
    const projection = calculateRecurringTripCost(
      {
        totalCost: 826,
        fuelCost: 576,
        additionalCosts: 250,
      },
      20,
      "mes",
    );

    expect(projection.totalCost).toBe(16520);
    expect(projection.fuelCost).toBe(11520);
    expect(projection.additionalCosts).toBe(5000);
  });

  it("compares total cost with a budget", () => {
    expect(compareTripCostWithBudget(826, 900)).toEqual({
      budget: 900,
      difference: 74,
      status: "remaining",
    });
    expect(compareTripCostWithBudget(826, 800).status).toBe("shortfall");
    expect(compareTripCostWithBudget(826, 826).status).toBe("exact");
  });

  it("includes recurring and budget details in a complete result", () => {
    const result = calculateVariableTripCost({
      distance: 300,
      distanceUnit: "km",
      efficiency: 12.5,
      efficiencyUnit: "km-l",
      fuelPrice: 24,
      fuelPriceUnit: "l",
      tolls: 250,
      recurringTrips: 20,
      projectionPeriod: "mes",
      budget: 900,
    });

    expect(result.recurringCost?.totalCost).toBe(16520);
    expect(result.budgetComparison?.difference).toBe(74);
  });

  it("builds copyable text with the main breakdown", () => {
    const result = calculateVariableTripCost({
      distance: 300,
      distanceUnit: "km",
      efficiency: 12.5,
      efficiencyUnit: "km-l",
      fuelPrice: 24,
      fuelPriceUnit: "l",
      tolls: 250,
      passengers: 4,
    });

    const text = buildCostPerKilometerShareText(result);

    expect(text).toContain("Costo total: $826.00");
    expect(text).toContain("Costo total/km: $2.75/km");
    expect(text).toContain("Costo por pasajero: $206.50");
  });

  it("rejects zero where it would produce invalid division", () => {
    expect(() => calculateTripFuelLiters(0, 12.5)).toThrow("distancia");
    expect(() => calculateTripFuelLiters(300, 0)).toThrow("rendimiento");
    expect(() =>
      calculateVariableTripCost({
        distance: 300,
        distanceUnit: "km",
        efficiency: 0,
        efficiencyUnit: "km-l",
        fuelPrice: 24,
        fuelPriceUnit: "l",
      }),
    ).toThrow("rendimiento");
  });

  it("rejects negatives, non-finite values and invalid integers", () => {
    expect(() => normalizeFuelPrice(-1, "l")).toThrow("precio");
    expect(() => calculateCostPerPassenger(100, 1.5)).toThrow("pasajeros");
    expect(() => calculateRecurringTripCost(100, 0)).toThrow(
      "viajes recurrentes",
    );
    expect(() => compareTripCostWithBudget(100, Number.NaN)).toThrow(
      "presupuesto",
    );
  });
});

describe("cost decimal parsing", () => {
  it("accepts point, comma and grouped money inputs", () => {
    expect(parseMoneyInput("12.5")).toEqual({
      ok: true,
      value: 12.5,
      normalized: "12.5",
    });
    expect(parseMoneyInput("12,5")).toEqual({
      ok: true,
      value: 12.5,
      normalized: "12.5",
    });
    expect(parseMoneyInput("1,000")).toEqual({
      ok: true,
      value: 1000,
      normalized: "1000",
    });
  });

  it("rejects invalid money inputs", () => {
    expect(parseMoneyInput("")).toEqual({ ok: false, error: "required" });
    expect(parseMoneyInput("-1")).toEqual({ ok: false, error: "negative" });
    expect(parseMoneyInput("abc")).toEqual({ ok: false, error: "invalid" });
  });
});
