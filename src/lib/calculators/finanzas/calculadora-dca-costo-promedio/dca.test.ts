import { describe, expect, it } from "vitest";
import {
  calculateDca,
  formatDcaCurrency,
  formatDcaNumber,
  parseDcaNumber,
  simulateNextPurchase,
} from "./dca";

describe("DCA calculations", () => {
  it("calculates a weighted average from purchases at different prices", () => {
    const result = calculateDca([
      { amount: 1000, price: 50, fee: 0 },
      { amount: 1000, price: 40, fee: 0 },
      { amount: 1000, price: 60, fee: 0 },
    ]);

    expect(result.totalUnits).toBeCloseTo(61.6666666667);
    expect(result.averagePurchasePrice).toBeCloseTo(48.6486486486);
    expect(result.effectiveCostPerUnit).toBeCloseTo(result.averagePurchasePrice);
  });

  it("keeps purchase price and effective cost distinct when there are fees", () => {
    const result = calculateDca([{ amount: 1000, price: 50, fee: 10 }], 50);

    expect(result.totalUnits).toBe(20);
    expect(result.averagePurchasePrice).toBe(50);
    expect(result.effectiveCostPerUnit).toBe(50.5);
    expect(result.market?.unrealizedProfit).toBe(-10);
    expect(result.market?.status).toBe("loss");
  });

  it("calculates gain, loss, and distance to break even", () => {
    const loss = calculateDca([{ amount: 1000, price: 50, fee: 0 }], 40);
    const gain = calculateDca([{ amount: 1000, price: 50, fee: 0 }], 60);

    expect(loss.market?.returnPercent).toBe(-20);
    expect(loss.market?.breakEvenPercent).toBe(25);
    expect(gain.market?.returnPercent).toBe(20);
    expect(gain.market?.breakEvenPercent).toBeCloseTo(16.6666666667);
  });

  it("treats floating point noise around the outlay as break even", () => {
    const result = calculateDca(
      [
        { amount: 1000, price: 3, fee: 0 },
        { amount: 1000, price: 6, fee: 0 },
      ],
      4,
    );

    expect(result.market?.status).toBe("break_even");
    expect(result.market?.breakEvenPercent).toBe(0);
  });
});

describe("next purchase simulation", () => {
  it("reduces the average below the current average and raises it above", () => {
    const current = calculateDca([{ amount: 1000, price: 50, fee: 0 }]);
    const lower = simulateNextPurchase(current, {
      amount: 1000,
      price: 40,
      fee: 0,
    });
    const higher = simulateNextPurchase(current, {
      amount: 1000,
      price: 60,
      fee: 0,
    });

    expect(lower.averagePriceChange).toBeLessThan(0);
    expect(higher.averagePriceChange).toBeGreaterThan(0);
  });

  it("includes the next fee in the effective cost without mutating current", () => {
    const current = calculateDca([{ amount: 1000, price: 50, fee: 0 }]);
    const simulation = simulateNextPurchase(current, {
      amount: 1000,
      price: 50,
      fee: 20,
    });

    expect(simulation.averagePurchasePrice).toBe(50);
    expect(simulation.effectiveCostPerUnit).toBe(50.5);
    expect(current.totalFees).toBe(0);
  });
});

describe("input and formatting", () => {
  it("parses common formats and preserves small values", () => {
    expect(parseDcaNumber("$1,000.50 MXN")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.50",
    });
    expect(parseDcaNumber("0.000000012345")).toEqual({
      ok: true,
      value: 0.000000012345,
      normalized: "0.000000012345",
    });
  });

  it("rejects negative, empty, and overly precise values", () => {
    expect(parseDcaNumber("")).toEqual({ ok: false, error: "required" });
    expect(parseDcaNumber("-1")).toEqual({ ok: false, error: "negative" });
    expect(parseDcaNumber("0.0000000000001")).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
  });

  it("formats currencies and units", () => {
    expect(formatDcaCurrency(1234.5)).toBe("$1,234.50");
    expect(formatDcaNumber(1.234567891, 8)).toBe("1.23456789");
  });
});
