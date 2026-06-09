import { describe, expect, it } from "vitest";
import {
  analyzeVolume,
  calculateBreakEven,
  formatCurrency,
  formatPercent,
  formatQuantity,
  parseMoneyInput,
  parsePercentInput,
  parseQuantityInput,
  roundCurrency,
  roundToIncrement,
  type BreakEvenInput,
} from "./breakEven";

const baseInput: BreakEvenInput = {
  price: 250,
  variableCost: 100,
  fixedCosts: 30_000,
  commissionRate: 0,
  increment: 1,
};

describe("break-even calculation", () => {
  it("calculates contribution and exact and practical break even", () => {
    const result = calculateBreakEven(baseInput);

    expect(result.feasible).toBe(true);
    expect(result.contributionPerUnit).toBe(150);
    expect(result.contributionPercent).toBe(60);

    if (!result.feasible) return;

    expect(result.exactBreakEvenUnits).toBe(200);
    expect(result.exactBreakEvenSales).toBe(50_000);
    expect(result.practicalBreakEvenUnits).toBe(200);
    expect(result.practicalBreakEvenSales).toBe(50_000);
    expect(result.practicalAnalysis.profit).toBe(0);
  });

  it("separates exact and practical results", () => {
    const result = calculateBreakEven({
      ...baseInput,
      fixedCosts: 30_001,
    });

    expect(result.feasible).toBe(true);
    if (!result.feasible) return;

    expect(result.exactBreakEvenUnits).toBeCloseTo(200.0066667);
    expect(result.practicalBreakEvenUnits).toBe(201);
    expect(result.practicalAnalysis.profit).toBe(149);
  });

  it("includes percentage commission in every result", () => {
    const result = calculateBreakEven({
      ...baseInput,
      commissionRate: 10,
    });

    expect(result.feasible).toBe(true);
    expect(result.commissionPerUnit).toBe(25);
    expect(result.contributionPerUnit).toBe(125);
    expect(result.contributionPercent).toBe(50);

    if (!result.feasible) return;

    expect(result.exactBreakEvenUnits).toBe(240);
    expect(result.practicalAnalysis.commission).toBe(6000);
  });

  it("returns an infeasible result for zero and negative contribution", () => {
    const zero = calculateBreakEven({
      ...baseInput,
      variableCost: 225,
      commissionRate: 10,
    });
    const negative = calculateBreakEven({
      ...baseInput,
      variableCost: 230,
      commissionRate: 10,
    });

    expect(zero).toMatchObject({
      feasible: false,
      contributionPerUnit: 0,
      lossPerAdditionalUnit: 0,
    });
    expect(negative).toMatchObject({
      feasible: false,
      contributionPerUnit: -5,
      lossPerAdditionalUnit: 5,
    });
  });

  it("handles zero fixed costs without inventing a sale", () => {
    const result = calculateBreakEven({
      ...baseInput,
      fixedCosts: 0,
    });

    expect(result.feasible).toBe(true);
    if (!result.feasible) return;

    expect(result.exactBreakEvenUnits).toBe(0);
    expect(result.practicalBreakEvenUnits).toBe(0);
    expect(result.scenarios).toEqual([]);
  });
});

describe("expected volume and target profit", () => {
  it("shows loss and distance below break even", () => {
    const result = calculateBreakEven({
      ...baseInput,
      expectedUnits: 150,
    });

    expect(result.feasible).toBe(true);
    if (!result.feasible) return;

    expect(result.expected).toMatchObject({
      profit: -7500,
      differenceFromExactUnits: -50,
      differenceFromPracticalUnits: -50,
      differenceFromExactSales: -12_500,
      safetyMarginAmount: -12_500,
      status: "below",
    });
  });

  it("shows profit and safety margin above break even", () => {
    const result = calculateBreakEven({
      ...baseInput,
      expectedUnits: 240,
    });

    expect(result.feasible).toBe(true);
    if (!result.feasible) return;

    expect(result.expected?.profit).toBe(6000);
    expect(result.expected?.differenceFromExactUnits).toBe(40);
    expect(result.expected?.differenceFromPracticalUnits).toBe(40);
    expect(roundCurrency(result.expected?.safetyMarginPercent ?? 0)).toBe(16.67);
    expect(result.expected?.status).toBe("above");
  });

  it("calculates target profit and actual profit after rounding", () => {
    const result = calculateBreakEven({
      ...baseInput,
      targetProfit: 15_000,
    });

    expect(result.feasible).toBe(true);
    if (!result.feasible) return;

    expect(result.target).toEqual({
      targetProfit: 15_000,
      exactUnits: 300,
      practicalUnits: 300,
      practicalSales: 75_000,
      actualProfit: 15_000,
    });
  });

  it("calculates a target when fixed costs are zero", () => {
    const result = calculateBreakEven({
      ...baseInput,
      fixedCosts: 0,
      targetProfit: 1500,
    });

    expect(result.feasible).toBe(true);
    if (!result.feasible) return;

    expect(result.target?.practicalUnits).toBe(10);
  });
});

describe("volume scenarios and increments", () => {
  it("analyzes any volume consistently", () => {
    const analysis = analyzeVolume(
      { ...baseInput, commissionRate: 10 },
      240,
    );

    expect(analysis).toEqual({
      units: 240,
      revenue: 60_000,
      variableCosts: 24_000,
      commission: 6000,
      totalCosts: 60_000,
      profit: 0,
      status: "break_even",
    });
  });

  it("rounds upward to whole and fractional increments", () => {
    expect(roundToIncrement(10.1, 1)).toBe(11);
    expect(roundToIncrement(10.1, 0.5)).toBe(10.5);
    expect(roundToIncrement(10.1, 0.25)).toBe(10.25);
    expect(roundToIncrement(200, 1)).toBe(200);
    expect(roundToIncrement(0.3 / 0.1, 1)).toBe(3);
  });

  it("builds unique scenarios after rounding", () => {
    const result = calculateBreakEven({
      price: 100,
      variableCost: 0,
      fixedCosts: 100,
      commissionRate: 0,
      increment: 1,
    });

    expect(result.feasible).toBe(true);
    if (!result.feasible) return;

    expect(result.scenarios.map((scenario) => scenario.units)).toEqual([1, 2]);
    expect(result.scenarios.map((scenario) => scenario.percentage)).toEqual([
      80, 120,
    ]);
  });
});

describe("validation, parsing, and formatting", () => {
  it("rejects invalid domain values", () => {
    expect(() => calculateBreakEven({ ...baseInput, price: 0 })).toThrow(
      /mayor que cero/i,
    );
    expect(() =>
      calculateBreakEven({ ...baseInput, commissionRate: 100 }),
    ).toThrow(/menor que 100/i);
    expect(() =>
      calculateBreakEven({ ...baseInput, increment: 0 }),
    ).toThrow(/mayor que cero/i);
    expect(() =>
      calculateBreakEven({ ...baseInput, expectedUnits: -1 }),
    ).toThrow(/unidades esperadas/i);
  });

  it("parses common money, percent, and quantity formats", () => {
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
    expect(parseQuantityInput("0,25")).toEqual({
      ok: true,
      value: 0.25,
      normalized: "0.25",
    });
  });

  it("rejects invalid and negative inputs", () => {
    expect(parseMoneyInput("")).toEqual({ ok: false, error: "required" });
    expect(parseMoneyInput("-20")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseQuantityInput("abc")).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("formats values for es-MX", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
    expect(formatPercent(33.333)).toBe("33.33%");
    expect(formatQuantity(10.25)).toBe("10.25");
  });
});
