import { describe, expect, it } from "vitest";

import {
  buildCopyText as buildCapRateCopyText,
  calculateCapRate,
} from "./calculadora-cap-rate-rentabilidad/capRate.en";
import {
  CAPACITY_PRESET_LABELS,
  LIMITING_FACTOR_LABELS,
} from "./calculadora-capacidad-compra-vivienda/homeAffordability.en";
import { formatDuration } from "./calculadora-de-hipoteca/mortgage.en";
import {
  COST_TYPE_LABELS,
  RESPONSIBILITY_LABELS,
  SUGGESTED_CLOSING_COSTS,
} from "./calculadora-gastos-escrituracion/closingCosts.en";
import {
  buildCopyText as buildAppreciationCopyText,
  calculateAppreciation,
} from "./calculadora-plusvalia-estimada/appreciation.en";
import {
  SURFACE_TYPE_LABELS,
  buildCopyText as buildPricePerAreaCopyText,
  calculatePricePerArea,
} from "./calculadora-precio-por-metro-cuadrado/pricePerArea.en";
import { formatPercent as formatRentVsBuyPercent } from "./calculadora-renta-vs-compra/rentVsBuy.en";

describe("English real-estate calculator localization", () => {
  it("uses English cap-rate copy", () => {
    const result = calculateCapRate({
      propertyValue: 2_000_000,
      monthlyRent: 20_000,
    });

    expect(buildCapRateCopyText(result)).toContain("Gross yield:");
    expect(buildCapRateCopyText(result)).toContain("Annual NOI:");
  });

  it("uses English affordability labels", () => {
    expect(CAPACITY_PRESET_LABELS.prudent).toBe("Prudent");
    expect(LIMITING_FACTOR_LABELS.initialCash).toBe("Initial cash");
  });

  it("uses English mortgage durations", () => {
    expect(formatDuration(25)).toBe("2 years 1 month");
    expect(formatDuration(Number.POSITIVE_INFINITY)).toBe("Not reachable");
  });

  it("uses English closing-cost labels and suggestions", () => {
    expect(COST_TYPE_LABELS.fixed).toBe("Fixed amount");
    expect(RESPONSIBILITY_LABELS.buyer).toBe("Buyer");
    expect(SUGGESTED_CLOSING_COSTS[0].name).toBe("Transfer tax");
  });

  it("uses English appreciation copy", () => {
    const result = calculateAppreciation({
      currentValue: 2_000_000,
      annualRatePercent: 4,
      years: 10,
    });

    expect(buildAppreciationCopyText(result)).toContain("Current value:");
    expect(buildAppreciationCopyText(result)).toContain("Base future value:");
  });

  it("uses English price-per-area labels and copy", () => {
    const result = calculatePricePerArea({
      mode: "price-per-area",
      totalPrice: 3_000_000,
      area: 120,
      areaUnit: "m2",
      surfaceType: "built",
    });

    expect(SURFACE_TYPE_LABELS.built).toBe("Built");
    expect(buildPricePerAreaCopyText(result)).toContain("Area:");
  });

  it("formats rent-vs-buy percentages with the English locale", () => {
    expect(formatRentVsBuyPercent(12.5)).toBe("12.5%");
  });
});
