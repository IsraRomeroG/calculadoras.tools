import { describe, expect, it } from "vitest";
import {
  buildShareText,
  calculateEqualBillSplit,
  calculateExactCentAdjustment,
  calculateRoundingDifference,
  calculateTipAmount,
  formatMoney,
  getCurrencyMinorUnit,
  parseMoneyInput,
  roundIndividualPaymentUp,
} from "./billSplitting";

describe("bill splitting formulas", () => {
  it("splits a bill with percentage tip evenly", () => {
    const result = calculateEqualBillSplit({
      bill: 1200,
      people: 4,
      tip: { type: "percentage", value: 10 },
      currency: "MXN",
    });

    expect(result.tipAmount).toBe(120);
    expect(result.total).toBe(1320);
    expect(result.exactIndividualPayment).toBe(330);
    expect(result.exactAdjustment?.payments).toEqual([
      { count: 4, amount: 330 },
    ]);
  });

  it("keeps the exact individual value before display rounding", () => {
    const result = calculateEqualBillSplit({
      bill: 1000,
      people: 3,
      tip: { type: "percentage", value: 0 },
      currency: "MXN",
    });

    expect(result.exactIndividualPayment).toBeCloseTo(333.333333333);
  });

  it("adds fixed tip and additional charges once before splitting", () => {
    const result = calculateEqualBillSplit({
      bill: 900,
      people: 3,
      tip: { type: "fixed", value: 90 },
      additionalCharges: 60,
      currency: "MXN",
    });

    expect(result.tipAmount).toBe(90);
    expect(result.additionalCharges).toBe(60);
    expect(result.total).toBe(1050);
    expect(result.exactIndividualPayment).toBe(350);
    expect(result.tipPerPerson).toBe(30);
    expect(result.chargesPerPerson).toBe(20);
  });

  it("calculates tip amount by percentage or fixed amount", () => {
    expect(calculateTipAmount(850, { type: "percentage", value: 15 })).toBe(
      127.5,
    );
    expect(calculateTipAmount(850, { type: "fixed", value: 100 })).toBe(100);
  });

  it("rejects invalid people and negative values", () => {
    expect(() =>
      calculateEqualBillSplit({
        bill: 100,
        people: 0,
        tip: { type: "percentage", value: 0 },
      }),
    ).toThrow("personas");
    expect(() =>
      calculateEqualBillSplit({
        bill: -1,
        people: 2,
        tip: { type: "percentage", value: 0 },
      }),
    ).toThrow("bill");
    expect(() => calculateTipAmount(100, { type: "fixed", value: Number.NaN }))
      .toThrow("tip");
  });
});

describe("exact cent adjustment", () => {
  it("closes a three-person split without collecting extra money", () => {
    const adjustment = calculateExactCentAdjustment(1000, 3, 0.01);

    expect(adjustment.payments).toEqual([
      { count: 2, amount: 333.33 },
      { count: 1, amount: 333.34 },
    ]);
    expect(adjustment.totalCollected).toBe(1000);
    expect(adjustment.difference).toBe(0);
  });

  it("uses whole units for currencies without cents", () => {
    const adjustment = calculateExactCentAdjustment(1000, 3, 1);

    expect(adjustment.payments).toEqual([
      { count: 2, amount: 333 },
      { count: 1, amount: 334 },
    ]);
    expect(adjustment.totalCollected).toBe(1000);
  });
});

describe("rounding", () => {
  it("rounds an individual payment upward", () => {
    expect(roundIndividualPaymentUp(326.67, 10)).toBe(330);
  });

  it("calculates the difference collected after rounding", () => {
    expect(calculateRoundingDifference(980, 330, 3)).toBe(10);
  });

  it("includes rounding information in the full result", () => {
    const result = calculateEqualBillSplit({
      bill: 980,
      people: 3,
      tip: { type: "percentage", value: 0 },
      currency: "MXN",
      rounding: { enabled: true, increment: 10 },
    });

    expect(result.rounding).toEqual({
      increment: 10,
      roundedPayment: 330,
      totalCollected: 990,
      difference: 10,
    });
  });
});

describe("money parsing and formatting", () => {
  it("parses localized money inputs", () => {
    expect(parseMoneyInput("1200,50")).toEqual({
      ok: true,
      value: 1200.5,
      normalized: "1200.50",
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
    expect(parseMoneyInput("$1,200 MXN")).toEqual({
      ok: true,
      value: 1200,
      normalized: "1200",
    });
  });

  it("rejects empty, negative, invalid and over-precise inputs", () => {
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
  it("builds copyable text for a normal result", () => {
    const result = calculateEqualBillSplit({
      bill: 1200,
      people: 4,
      tip: { type: "percentage", value: 10 },
      currency: "MXN",
    });

    expect(buildShareText(result)).toContain("Cada persona paga: $330.00 MXN");
    expect(buildShareText(result)).toContain("Propina incluida: $120.00 MXN");
  });

  it("builds copyable text for exact adjustment", () => {
    const result = calculateEqualBillSplit({
      bill: 1000,
      people: 3,
      tip: { type: "percentage", value: 0 },
      currency: "MXN",
    });

    expect(buildShareText(result)).toContain("2 personas pagan: $333.33 MXN");
    expect(buildShareText(result)).toContain("1 persona paga: $333.34 MXN");
  });

  it("builds copyable text for rounded payments", () => {
    const result = calculateEqualBillSplit({
      bill: 980,
      people: 3,
      tip: { type: "percentage", value: 0 },
      currency: "MXN",
      rounding: { enabled: true, increment: 10 },
    });

    expect(buildShareText(result)).toContain("Cada persona paga: $330.00 MXN");
    expect(buildShareText(result)).toContain("Sobra por redondeo: $10.00 MXN");
  });
});
