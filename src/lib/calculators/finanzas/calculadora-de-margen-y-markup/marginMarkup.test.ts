import { describe, expect, it } from "vitest";
import {
  analyzeSale,
  buildMarginScenarios,
  calculatePriceForMargin,
  calculatePriceForMarkup,
  formatCurrency,
  formatExactPrice,
  formatPercent,
  parseMoneyInput,
  parsePercentInput,
  roundCommercialPrice,
  roundCurrency,
  type SaleCosts,
} from "./marginMarkup";

const baseCosts: SaleCosts = {
  baseCost: 300,
  shipping: 0,
  packaging: 0,
  fixedFee: 0,
  otherCosts: 0,
  commissionRate: 0,
};

describe("sale analysis", () => {
  it("calculates profit, margin, markup, and break even", () => {
    const result = analyzeSale(baseCosts, 500);

    expect(result.profit).toBe(200);
    expect(result.marginPercent).toBe(40);
    expect(roundCurrency(result.markupPercent ?? 0)).toBe(66.67);
    expect(result.breakEvenPrice).toBe(300);
    expect(result.maxDiscountAmount).toBe(200);
    expect(result.maxDiscountPercent).toBe(40);
    expect(result.status).toBe("gain");
  });

  it("includes percentage commission in every metric", () => {
    const result = analyzeSale({ ...baseCosts, commissionRate: 10 }, 500);

    expect(result.commissionAmount).toBe(50);
    expect(result.effectiveCost).toBe(350);
    expect(result.profit).toBe(150);
    expect(result.marginPercent).toBe(30);
    expect(roundCurrency(result.markupPercent ?? 0)).toBe(42.86);
    expect(result.breakEvenPrice).toBe(333.34);
  });

  it("sums every fixed cost once", () => {
    const result = analyzeSale(
      {
        baseCost: 300,
        shipping: 30,
        packaging: 15,
        fixedFee: 5,
        otherCosts: 10,
        commissionRate: 10,
      },
      600,
    );

    expect(result.fixedCosts).toBe(360);
    expect(result.commissionAmount).toBe(60);
    expect(result.effectiveCost).toBe(420);
    expect(result.profit).toBe(180);
  });

  it("detects break even and loss without hiding negative values", () => {
    expect(analyzeSale(baseCosts, 300).status).toBe("break_even");

    const loss = analyzeSale(baseCosts, 250);
    expect(loss.status).toBe("loss");
    expect(loss.profit).toBe(-50);
    expect(loss.maxDiscountAmount).toBe(0);
  });

  it("returns unavailable markup when effective cost is zero", () => {
    const result = analyzeSale({ ...baseCosts, baseCost: 0 }, 100);

    expect(result.markupPercent).toBeNull();
    expect(result.marginPercent).toBe(100);
  });
});

describe("target prices", () => {
  it("calculates price for a target margin", () => {
    const result = calculatePriceForMargin(baseCosts, 40, "cent");

    expect(result.exactPrice).toBe(500);
    expect(result.commercialPrice).toBe(500);
    expect(result.analysis.marginPercent).toBe(40);
  });

  it("calculates target margin with a percentage commission", () => {
    const result = calculatePriceForMargin(
      { ...baseCosts, commissionRate: 10 },
      30,
      "cent",
    );

    expect(result.exactPrice).toBeCloseTo(500);
    expect(result.analysis.marginPercent).toBeCloseTo(30);
  });

  it("calculates markup over the effective cost including commission", () => {
    const result = calculatePriceForMarkup(
      { ...baseCosts, commissionRate: 10 },
      50,
      "cent",
    );

    expect(roundCurrency(result.exactPrice)).toBe(529.41);
    expect(result.commercialPrice).toBe(529.42);
    expect(roundCurrency(result.analysis.markupPercent ?? 0)).toBe(50);
  });

  it("rejects impossible targets and target calculations without costs", () => {
    expect(() =>
      calculatePriceForMargin(
        { ...baseCosts, commissionRate: 70 },
        30,
        "cent",
      ),
    ).toThrow(/no existe un precio/i);
    expect(() =>
      calculatePriceForMarkup(
        { ...baseCosts, commissionRate: 50 },
        100,
        "cent",
      ),
    ).toThrow(/no existe un precio/i);
    expect(() =>
      calculatePriceForMargin({ ...baseCosts, baseCost: 0 }, 30, "cent"),
    ).toThrow(/al menos un costo/i);
    expect(() =>
      analyzeSale({ ...baseCosts, commissionRate: 100 }, 500),
    ).toThrow(/menor que 100/i);
  });

  it("uses a zero margin or markup target as the break-even price", () => {
    const costs = { ...baseCosts, commissionRate: 10 };
    const marginResult = calculatePriceForMargin(costs, 0, "cent");
    const markupResult = calculatePriceForMarkup(costs, 0, "cent");

    expect(marginResult.commercialPrice).toBe(333.34);
    expect(markupResult.commercialPrice).toBe(333.34);
    expect(marginResult.analysis.profit).toBeGreaterThanOrEqual(0);
    expect(markupResult.analysis.profit).toBeGreaterThanOrEqual(0);
  });

  it("builds only mathematically possible scenarios", () => {
    const scenarios = buildMarginScenarios(
      { ...baseCosts, commissionRate: 60 },
      "integer",
    );

    expect(scenarios.map((scenario) => scenario.targetMargin)).toEqual([20, 30]);
    expect(scenarios.every((scenario) => scenario.commercialPrice >= scenario.exactPrice)).toBe(true);
  });
});

describe("rounding, parsing, and formatting", () => {
  it("always rounds commercial prices upward", () => {
    expect(roundCommercialPrice(529.4118, "cent")).toBe(529.42);
    expect(roundCommercialPrice(483.27, "integer")).toBe(484);
    expect(roundCommercialPrice(483.27, "multiple_5")).toBe(485);
    expect(roundCommercialPrice(483.27, "ending_99")).toBe(483.99);
    expect(roundCommercialPrice(484, "ending_99")).toBe(484.99);
  });

  it("parses common money and percent formats", () => {
    expect(parseMoneyInput("$1,000.50 MXN")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.50",
    });
    expect(parseMoneyInput("1.000,50")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.50",
    });
    expect(parsePercentInput("12,5%")).toEqual({
      ok: true,
      value: 12.5,
      normalized: "12.5",
    });
  });

  it("rejects invalid and negative inputs", () => {
    expect(parseMoneyInput("")).toEqual({ ok: false, error: "required" });
    expect(parseMoneyInput("-20")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parsePercentInput("abc")).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("formats values for es-MX", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
    expect(formatExactPrice(529.411764)).toBe("$529.4118");
    expect(formatPercent(33.333)).toBe("33.33%");
  });
});
