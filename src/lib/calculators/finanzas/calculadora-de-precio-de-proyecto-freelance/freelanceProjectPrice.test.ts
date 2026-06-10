import { describe, expect, it } from "vitest";
import {
  analyzeProposedPrice,
  buildPaymentPlan,
  calculateProjectRecommendation,
  formatProjectCurrency,
  formatProjectPercent,
  formatProjectQuantity,
  parseProjectNumber,
  type FreelanceProjectInput,
} from "./freelanceProjectPrice";

const baseInput: FreelanceProjectInput = {
  baseHourlyRate: 600,
  phases: [{ name: "Proyecto", hours: 60 }],
  directExpenses: 3000,
  recommendedContingencyRate: 15,
  conservativeContingencyRate: 25,
  collectionFeeRate: 3,
  targetMarginRate: 20,
  taxRate: 16,
  paymentRates: { deposit: 50, progress: 25, final: 25 },
};

describe("project price recommendation", () => {
  it("calculates the documented recommended scenario", () => {
    const result = calculateProjectRecommendation(baseInput);
    const recommended = result.scenarios.recommended;

    expect(result.estimatedHours).toBe(60);
    expect(result.workCost).toBe(36_000);
    expect(result.weightedHourlyRate).toBe(600);
    expect(recommended.contingencyHours).toBe(9);
    expect(recommended.contingencyCost).toBe(5400);
    expect(recommended.adjustedCost).toBe(44_400);
    expect(recommended.priceBeforeTax).toBeCloseTo(57_662.3377);
    expect(recommended.collectionFeeAmount).toBeCloseTo(1729.8701);
    expect(recommended.achievedMarginRate).toBeCloseTo(20);
    expect(recommended.clientTotal).toBeCloseTo(66_888.3117);
  });

  it("builds base, recommended, and conservative scenarios", () => {
    const result = calculateProjectRecommendation(baseInput);

    expect(result.scenarios.base.contingencyRate).toBe(0);
    expect(result.scenarios.recommended.contingencyRate).toBe(15);
    expect(result.scenarios.conservative.contingencyRate).toBe(25);
    expect(result.scenarios.base.priceBeforeTax).toBeLessThan(
      result.scenarios.recommended.priceBeforeTax,
    );
    expect(result.scenarios.recommended.priceBeforeTax).toBeLessThan(
      result.scenarios.conservative.priceBeforeTax,
    );
  });

  it("does not apply contingency to direct expenses", () => {
    const result = calculateProjectRecommendation(baseInput);

    expect(result.scenarios.recommended.adjustedCost).toBe(
      36_000 + 5400 + 3000,
    );
  });

  it("uses specific phase rates and calculates a weighted rate", () => {
    const result = calculateProjectRecommendation({
      ...baseInput,
      baseHourlyRate: 500,
      phases: [
        { name: "Diseño", hours: 10, hourlyRate: 800 },
        { name: "Desarrollo", hours: 30 },
      ],
    });

    expect(result.workCost).toBe(23_000);
    expect(result.weightedHourlyRate).toBe(575);
    expect(result.phases[0].hourlyRate).toBe(800);
    expect(result.phases[1].hourlyRate).toBe(500);
  });

  it("allows every phase to define its own rate without a base rate", () => {
    const result = calculateProjectRecommendation({
      ...baseInput,
      baseHourlyRate: undefined,
      phases: [{ name: "Consultoría", hours: 8, hourlyRate: 1000 }],
    });

    expect(result.workCost).toBe(8000);
  });

  it("keeps tax outside margin and effective rate", () => {
    const withoutTax = calculateProjectRecommendation({
      ...baseInput,
      taxRate: 0,
    });
    const withTax = calculateProjectRecommendation(baseInput);

    expect(withTax.scenarios.recommended.priceBeforeTax).toBeCloseTo(
      withoutTax.scenarios.recommended.priceBeforeTax,
    );
    expect(withTax.scenarios.recommended.effectiveNetHourlyRate).toBeCloseTo(
      withoutTax.scenarios.recommended.effectiveNetHourlyRate,
    );
    expect(withTax.scenarios.recommended.clientTotal).toBeGreaterThan(
      withoutTax.scenarios.recommended.clientTotal,
    );
  });
});

describe("proposed price analysis", () => {
  it("marks the recommended price as healthy", () => {
    const recommendation = calculateProjectRecommendation(baseInput);
    const analysis = analyzeProposedPrice(
      baseInput,
      recommendation.scenarios.recommended.priceBeforeTax,
    );

    expect(analysis.differenceFromRecommended).toBeCloseTo(0);
    expect(analysis.achievedMarginRate).toBeCloseTo(20);
    expect(analysis.status).toBe("healthy");
  });

  it("marks a price that covers base value but misses margin as tight", () => {
    const analysis = analyzeProposedPrice(baseInput, 50_000);

    expect(analysis.effectiveNetHourlyRate).toBeGreaterThan(600);
    expect(analysis.achievedMarginRate).toBeLessThan(20);
    expect(analysis.status).toBe("tight");
  });

  it("marks a price below the modeled hourly value as below base", () => {
    const analysis = analyzeProposedPrice(baseInput, 40_000);

    expect(analysis.effectiveNetHourlyRate).toBeLessThan(600);
    expect(analysis.additionalHoursAvailable).toBeLessThan(0);
    expect(analysis.status).toBe("below_base");
  });

  it("calculates minimum coverage including collection fee", () => {
    const analysis = analyzeProposedPrice(baseInput, 55_000);

    expect(analysis.minimumCoveragePrice).toBeCloseTo(44_400 / 0.97);
  });
});

describe("payments, validation, warnings, parsing, and formatting", () => {
  it("makes rounded payments add up to the rounded client total", () => {
    const payments = buildPaymentPlan(100.01, {
      deposit: 33.33,
      progress: 33.33,
      final: 33.34,
    });

    expect(
      Math.round(
        payments.reduce((total, payment) => total + payment.amount, 0) * 100,
      ) / 100,
    ).toBe(100.01);
  });

  it("returns non-blocking warnings", () => {
    const result = calculateProjectRecommendation({
      ...baseInput,
      directExpenses: 50_000,
      recommendedContingencyRate: 0,
      conservativeContingencyRate: 0,
      taxRate: 0,
      paymentRates: { deposit: 10, progress: 45, final: 45 },
    });

    expect(result.warnings).toEqual([
      "no_contingency",
      "expenses_exceed_work",
      "no_tax",
      "low_deposit",
    ]);
  });

  it("rejects invalid project assumptions", () => {
    expect(() =>
      calculateProjectRecommendation({
        ...baseInput,
        collectionFeeRate: 30,
        targetMarginRate: 70,
      }),
    ).toThrow(/100% o más/i);
    expect(() =>
      calculateProjectRecommendation({
        ...baseInput,
        conservativeContingencyRate: 10,
      }),
    ).toThrow(/entre 15 y 100/i);
    expect(() =>
      calculateProjectRecommendation({
        ...baseInput,
        paymentRates: { deposit: 50, progress: 20, final: 20 },
      }),
    ).toThrow(/sumar 100%/i);
    expect(() =>
      calculateProjectRecommendation({
        ...baseInput,
        baseHourlyRate: undefined,
      }),
    ).toThrow(/tarifa base o una tarifa específica/i);
  });

  it("parses common es-MX numeric inputs", () => {
    expect(parseProjectNumber("$57,662.34 MXN")).toMatchObject({
      ok: true,
      value: 57_662.34,
    });
    expect(parseProjectNumber("1.000,50")).toMatchObject({
      ok: true,
      value: 1000.5,
    });
    expect(parseProjectNumber("15%")).toMatchObject({
      ok: true,
      value: 15,
    });
  });

  it("rejects invalid and overly precise input", () => {
    expect(parseProjectNumber("")).toEqual({
      ok: false,
      error: "required",
    });
    expect(parseProjectNumber("-20")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseProjectNumber("12.345", 2, true)).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
  });

  it("formats project values for es-MX", () => {
    expect(formatProjectCurrency(1234.5)).toBe("$1,234.50");
    expect(formatProjectQuantity(69)).toBe("69");
    expect(formatProjectPercent(20)).toBe("20%");
  });
});
