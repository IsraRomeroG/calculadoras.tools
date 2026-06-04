import { describe, expect, it } from "vitest";
import {
  buildShareText,
  calculateEffectiveTipPercentage,
  calculateRestaurantTip,
  calculateTip,
  calculateTipPerPerson,
  calculateTipTotal,
  formatMoney,
  getCurrencyMinorUnit,
  parseMoneyInput,
  roundTipUp,
  roundTotalUp,
} from "./tip";

describe("restaurant tip formulas", () => {
  it("calculates a tip from consumption and percentage", () => {
    expect(calculateTip(850, 15)).toBe(127.5);
  });

  it("calculates the total with tip", () => {
    expect(calculateTipTotal(850, 127.5)).toBe(977.5);
  });

  it("splits tip and total by people", () => {
    expect(calculateTipPerPerson(977.5, 127.5, 3)).toEqual({
      tipPerPerson: 42.5,
      totalPerPerson: 325.8333333333333,
    });
  });

  it("keeps original total with a zero percent preset", () => {
    const result = calculateRestaurantTip({
      consumption: 850,
      percentage: 0,
      people: 2,
      currency: "MXN",
    });

    expect(result.tip).toBe(0);
    expect(result.total).toBe(850);
    expect(result.totalPerPerson).toBe(425);
  });

  it("does not calculate effective percentage when consumption is zero", () => {
    expect(calculateEffectiveTipPercentage(0, 0)).toBeNull();

    const result = calculateRestaurantTip({
      consumption: 0,
      percentage: 15,
    });

    expect(result.effectivePercentage).toBeNull();
    expect(result.total).toBe(0);
  });

  it("rejects invalid percentages and people", () => {
    expect(() => calculateRestaurantTip({ consumption: 100, percentage: -1 }))
      .toThrow("percentage");
    expect(() =>
      calculateRestaurantTip({ consumption: 100, percentage: 10, people: 0 }),
    ).toThrow("personas");
    expect(() =>
      calculateRestaurantTip({ consumption: 100, percentage: 10, people: 1.5 }),
    ).toThrow("personas");
  });
});

describe("tip rounding", () => {
  it("rounds the tip upward and recalculates effective percentage", () => {
    const result = calculateRestaurantTip({
      consumption: 850,
      percentage: 15,
      rounding: { mode: "tip", increment: 5 },
    });

    expect(roundTipUp(127.5, 5)).toBe(130);
    expect(result.tip).toBe(130);
    expect(result.total).toBe(980);
    expect(result.effectivePercentage).toBeCloseTo(15.294117647);
  });

  it("rounds the final total upward and recalculates the adjusted tip", () => {
    const result = calculateRestaurantTip({
      consumption: 850,
      percentage: 15,
      people: 3,
      rounding: { mode: "total", increment: 10 },
    });

    expect(roundTotalUp(977.5, 10)).toBe(980);
    expect(result.total).toBe(980);
    expect(result.tip).toBe(130);
    expect(result.totalPerPerson).toBeCloseTo(326.666666667);
    expect(result.effectivePercentage).toBeCloseTo(15.294117647);
  });

  it("keeps tip at zero by default when service is already included", () => {
    const result = calculateRestaurantTip({
      consumption: 850,
      percentage: 0,
      serviceIncluded: true,
    });

    expect(result.tip).toBe(0);
    expect(result.total).toBe(850);
    expect(result.serviceIncluded).toBe(true);
  });
});

describe("money parsing and formatting", () => {
  it("parses localized money inputs", () => {
    expect(parseMoneyInput("850")).toEqual({
      ok: true,
      value: 850,
      normalized: "850",
    });
    expect(parseMoneyInput("850,50")).toEqual({
      ok: true,
      value: 850.5,
      normalized: "850.50",
    });
    expect(parseMoneyInput("1,200.50")).toEqual({
      ok: true,
      value: 1200.5,
      normalized: "1200.50",
    });
    expect(parseMoneyInput("1.200,50")).toEqual({
      ok: true,
      value: 1200.5,
      normalized: "1200.50",
    });
    expect(parseMoneyInput("$850 MXN")).toEqual({
      ok: true,
      value: 850,
      normalized: "850",
    });
  });

  it("rejects invalid money inputs", () => {
    expect(parseMoneyInput("")).toEqual({ ok: false, error: "required" });
    expect(parseMoneyInput("-1")).toEqual({ ok: false, error: "negative" });
    expect(parseMoneyInput("abc")).toEqual({ ok: false, error: "invalid" });
    expect(parseMoneyInput("1.12345")).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
  });

  it("formats currencies according to their minimum unit", () => {
    expect(getCurrencyMinorUnit("MXN")).toBe(0.01);
    expect(getCurrencyMinorUnit("CLP")).toBe(1);
    expect(getCurrencyMinorUnit("COP")).toBe(1);
    expect(formatMoney(1234.5, "MXN")).toBe("$1,234.50 MXN");
    expect(formatMoney(1234.5, "CLP")).toBe("$1,235 CLP");
  });
});

describe("share text", () => {
  it("builds copyable text for a regular result", () => {
    const result = calculateRestaurantTip({
      consumption: 850,
      percentage: 15,
      people: 3,
      currency: "MXN",
    });

    expect(buildShareText(result)).toContain("Propina: $127.50 MXN");
    expect(buildShareText(result)).toContain(
      "Total por persona: $325.83 MXN",
    );
  });

  it("builds copyable text for a rounded total", () => {
    const result = calculateRestaurantTip({
      consumption: 850,
      percentage: 15,
      people: 3,
      currency: "MXN",
      rounding: { mode: "total", increment: 10 },
    });

    expect(buildShareText(result)).toContain("Total cerrado: $980.00 MXN");
    expect(buildShareText(result)).toContain("Propina ajustada: $130.00 MXN");
    expect(buildShareText(result)).toContain("Porcentaje efectivo: 15.29%");
  });
});
