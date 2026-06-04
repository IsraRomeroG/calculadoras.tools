import { describe, expect, it } from "vitest";
import {
  applyFuelSafetyMargin,
  applyTripMultiplier,
  buildFuelConsumptionShareText,
  calculateFuelEfficiency,
  calculateFuelNeeded,
  calculateFuelNeededForTrip,
  convertDistanceToKm,
  convertFuelToLiters,
  convertKmPerLiterToLitersPer100Km,
  convertKmPerLiterToMpgUs,
  convertLitersToGallonsUs,
  normalizeEfficiency,
  parseDecimalInput,
} from "./fuelConsumption";

describe("fuel consumption formulas", () => {
  it("calculates fuel efficiency from distance and liters", () => {
    const result = calculateFuelEfficiency(500, 40);

    expect(result.kmPerLiter).toBe(12.5);
    expect(result.rangeWithFuelKm).toBe(500);
  });

  it("converts km/L to L/100 km and mpg US", () => {
    expect(convertKmPerLiterToLitersPer100Km(12.5)).toBe(8);
    expect(convertKmPerLiterToMpgUs(12.5)).toBeCloseTo(29.4018229125);
  });

  it("estimates liters for a trip from known efficiency", () => {
    expect(calculateFuelNeeded(300, 12.5)).toBe(24);
  });

  it("converts liters to US gallons", () => {
    expect(convertLitersToGallonsUs(24)).toBeCloseTo(6.3401292566);
  });

  it("converts exact distance and fuel units", () => {
    expect(convertDistanceToKm(1, "mi")).toBe(1.609344);
    expect(convertFuelToLiters(1, "gal-us")).toBe(3.785411784);
  });

  it("normalizes efficiency formats with a relevant round-trip", () => {
    expect(normalizeEfficiency(8, "l-100-km")).toBe(12.5);
    expect(normalizeEfficiency(29.4018229125, "mpg-us")).toBeCloseTo(12.5);
  });

  it("applies round trip and safety margin", () => {
    expect(applyTripMultiplier(300, "ida-vuelta")).toBe(600);
    expect(applyFuelSafetyMargin(48, 10)).toBe(52.800000000000004);
  });

  it("calculates a complete trip estimate", () => {
    const result = calculateFuelNeededForTrip({
      distance: 300,
      distanceUnit: "km",
      tripType: "ida-vuelta",
      efficiency: 12.5,
      efficiencyUnit: "km-l",
      marginPercent: 10,
    });

    expect(result.totalDistanceKm).toBe(600);
    expect(result.baseLiters).toBe(48);
    expect(result.litersNeeded).toBeCloseTo(52.8);
    expect(result.gallonsUsNeeded).toBeCloseTo(13.9482843645);
  });

  it("rejects zero, negative and non-finite values", () => {
    expect(() => calculateFuelEfficiency(0, 40)).toThrow("distancia");
    expect(() => calculateFuelEfficiency(500, 0)).toThrow("combustible");
    expect(() => normalizeEfficiency(-1, "km-l")).toThrow("rendimiento");
    expect(() => calculateFuelNeeded(Number.POSITIVE_INFINITY, 12.5)).toThrow(
      "distancia",
    );
  });
});

describe("fuel decimal parsing", () => {
  it("accepts point or comma decimal values", () => {
    expect(parseDecimalInput("12.5")).toEqual({
      ok: true,
      value: 12.5,
      normalized: "12.5",
    });
    expect(parseDecimalInput("12,5")).toEqual({
      ok: true,
      value: 12.5,
      normalized: "12.5",
    });
  });

  it("rejects invalid decimal values", () => {
    expect(parseDecimalInput("")).toEqual({ ok: false, error: "required" });
    expect(parseDecimalInput("-1")).toEqual({ ok: false, error: "negative" });
    expect(parseDecimalInput("abc")).toEqual({ ok: false, error: "invalid" });
  });
});

describe("fuel share text", () => {
  it("builds copyable text for efficiency mode", () => {
    const efficiency = calculateFuelEfficiency(500, 40);

    expect(
      buildFuelConsumptionShareText({
        mode: "rendimiento",
        distanceLabel: "500 km",
        fuelLabel: "40 l",
        efficiency,
      }),
    ).toContain("Rendimiento: 12.50 km/L");
  });

  it("builds copyable text for trip mode with margin", () => {
    const estimate = calculateFuelNeededForTrip({
      distance: 300,
      distanceUnit: "km",
      tripType: "ida-vuelta",
      efficiency: 12.5,
      efficiencyUnit: "km-l",
      marginPercent: 10,
    });

    const text = buildFuelConsumptionShareText({
      mode: "trayecto",
      distanceLabel: "600 km",
      efficiencyLabel: "12.5 km/L",
      estimate,
    });

    expect(text).toContain("Margen: 10%");
    expect(text).toContain("Combustible estimado: 52.80 l");
  });
});
