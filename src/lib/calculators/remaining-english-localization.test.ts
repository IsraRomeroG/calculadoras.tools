import { describe, expect, it } from "vitest";

import { COMBINATORICS_EXAMPLES } from "./probabilidad-estadistica/calculadora-combinaciones-permutaciones/combinatorics.en";
import { NORMAL_EXAMPLES } from "./probabilidad-estadistica/calculadora-distribucion-normal-z-score/normalDistribution.en";
import { PROBABILITY_EXAMPLES } from "./probabilidad-estadistica/calculadora-probabilidad-basica/basicProbability.en";
import { getColorErrorMessage } from "./programacion/paleta-hex-rgb-hsl/colorPalette.en";
import { getNumberBaseErrorMessage } from "./programacion/conversor-de-bases-numericas/numberBase.en";
import { calculateRestaurantTip, buildShareText as buildTipShareText } from "./restaurantes/calculadora-de-propina/tip.en";
import { calculateEqualBillSplit, buildShareText as buildBillShareText } from "./restaurantes/dividir-cuenta-en-restaurante/billSplitting.en";
import {
  VEHICLE_ANNUAL_COST_CATEGORY_LABELS,
  VEHICLE_ANNUAL_COST_FREQUENCY_LABELS,
} from "./vehiculos/calculadora-de-gastos-anuales-del-vehiculo/vehicleAnnualCosts.en";
import { buildFuelConsumptionShareText, calculateFuelEfficiency } from "./vehiculos/calculadora-de-consumo-de-gasolina/fuelConsumption.en";

describe("remaining English calculator localization", () => {
  it("uses English probability and statistics examples", () => {
    expect(COMBINATORICS_EXAMPLES[0].label).toBe("Committee");
    expect(NORMAL_EXAMPLES[0].label).toBe("Value 85");
    expect(PROBABILITY_EXAMPLES[0].description).toContain("fair die");
  });

  it("uses English programming validation messages", () => {
    expect(getColorErrorMessage({ ok: false, error: "invalid_hex" })).toContain("HEX");
    expect(getNumberBaseErrorMessage({ error: "invalid_base", base: 40 })).toContain("integer from 2 to 36");
  });

  it("uses English restaurant summaries", () => {
    const tip = calculateRestaurantTip({ consumption: 100, percentage: 15 });
    expect(buildTipShareText(tip)).toContain("Calculated tip:");

    const bill = calculateEqualBillSplit({
      bill: 100,
      people: 2,
      tip: { type: "percentage", value: 0 },
    });
    expect(buildBillShareText(bill)).toContain("Split bill:");
  });

  it("uses English vehicle labels and summaries", () => {
    expect(VEHICLE_ANNUAL_COST_CATEGORY_LABELS.other).toBe("Other");
    expect(VEHICLE_ANNUAL_COST_FREQUENCY_LABELS.monthly).toBe("Monthly");

    const efficiency = calculateFuelEfficiency(500, 40);
    expect(buildFuelConsumptionShareText({ mode: "rendimiento", distanceLabel: "500 km", fuelLabel: "40 L", efficiency })).toContain("Fuel consumption:");
  });
});
