import { describe, expect, it } from "vitest";
import {
  VAT_COUNTRY_PRESETS,
  calculateVatFromBase,
  calculateVatFromTotal,
  formatMoney,
  formatNumber,
  formatRate,
  parseMoneyInput,
  parseRateInput,
  roundCurrency,
} from "./vat";

describe("vat calculator formulas", () => {
  it("adds VAT to a base price", () => {
    expect(calculateVatFromBase(500, 16)).toEqual({
      base: 500,
      tax: 80,
      total: 580,
      rate: 16,
    });
  });

  it("extracts VAT from a final price", () => {
    const result = calculateVatFromTotal(580, 16);

    expect(result.base).toBeCloseTo(500);
    expect(result.tax).toBeCloseTo(80);
    expect(result.total).toBe(580);
    expect(result.rate).toBe(16);
  });

  it("handles zero prices without errors", () => {
    expect(calculateVatFromBase(0, 16)).toEqual({
      base: 0,
      tax: 0,
      total: 0,
      rate: 16,
    });
    expect(calculateVatFromTotal(0, 16)).toEqual({
      base: 0,
      tax: 0,
      total: 0,
      rate: 16,
    });
  });

  it("handles a zero VAT rate", () => {
    expect(calculateVatFromBase(100, 0)).toEqual({
      base: 100,
      tax: 0,
      total: 100,
      rate: 0,
    });
    expect(calculateVatFromTotal(100, 0)).toEqual({
      base: 100,
      tax: 0,
      total: 100,
      rate: 0,
    });
  });

  it("allows unusually high rates so the UI can show a warning", () => {
    expect(calculateVatFromBase(100, 150)).toEqual({
      base: 100,
      tax: 150,
      total: 250,
      rate: 150,
    });

    const extracted = calculateVatFromTotal(250, 150);
    expect(extracted.base).toBeCloseTo(100);
    expect(extracted.tax).toBeCloseTo(150);
  });

  it("handles decimal rates and amounts", () => {
    const added = calculateVatFromBase(1234.5678, 10.5);
    expect(added.tax).toBeCloseTo(129.629619);
    expect(added.total).toBeCloseTo(1364.197419);

    const extracted = calculateVatFromTotal(1364.197419, 10.5);
    expect(extracted.base).toBeCloseTo(1234.5678);
    expect(extracted.tax).toBeCloseTo(129.629619);
  });
});

describe("money input parsing", () => {
  it("accepts plain money values", () => {
    expect(parseMoneyInput("1000")).toEqual({
      ok: true,
      value: 1000,
      normalized: "1000",
    });
    expect(parseMoneyInput("0")).toEqual({
      ok: true,
      value: 0,
      normalized: "0",
    });
  });

  it("normalizes US-style thousands and decimals", () => {
    expect(parseMoneyInput("1,000.50")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.50",
    });
    expect(parseMoneyInput("$1,000.50 MXN")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.50",
    });
  });

  it("normalizes European and Latin American thousands and decimals", () => {
    expect(parseMoneyInput("1.000,50")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.50",
    });
    expect(parseMoneyInput("€1.000,50")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.50",
    });
  });

  it("accepts known currency symbols and codes", () => {
    expect(parseMoneyInput("S/ 1,000.50")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.50",
    });
    expect(parseMoneyInput("Q 1,000.50 GTQ")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.50",
    });
    expect(parseMoneyInput("₡ 1,000.50 CRC")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.50",
    });
  });

  it("treats a single comma 3-digit group as thousands for money", () => {
    expect(parseMoneyInput("1,000")).toEqual({
      ok: true,
      value: 1000,
      normalized: "1000",
    });
  });

  it("treats a single dot separator as a decimal value for money", () => {
    expect(parseMoneyInput("1.234")).toEqual({
      ok: true,
      value: 1.234,
      normalized: "1.234",
    });
  });

  it("accepts up to four decimal places", () => {
    expect(parseMoneyInput("123.4567")).toEqual({
      ok: true,
      value: 123.4567,
      normalized: "123.4567",
    });
    expect(parseMoneyInput("123.45678")).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
  });

  it("rejects empty, negative, and invalid money values", () => {
    expect(parseMoneyInput("")).toEqual({ ok: false, error: "required" });
    expect(parseMoneyInput("-100")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseMoneyInput("−100")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseMoneyInput("abc")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseMoneyInput("100 pesos")).toEqual({
      ok: false,
      error: "invalid",
    });
  });
});

describe("rate input parsing", () => {
  it("accepts rates with percent signs and spaces", () => {
    expect(parseRateInput("16%")).toEqual({
      ok: true,
      value: 16,
      normalized: "16",
    });
    expect(parseRateInput(" 10.5 % ")).toEqual({
      ok: true,
      value: 10.5,
      normalized: "10.5",
    });
  });

  it("treats single separators as decimals for rates", () => {
    expect(parseRateInput("10,5")).toEqual({
      ok: true,
      value: 10.5,
      normalized: "10.5",
    });
    expect(parseRateInput("1,000")).toEqual({
      ok: true,
      value: 1,
      normalized: "1.000",
    });
  });

  it("allows zero, one hundred, and over-one-hundred rates", () => {
    expect(parseRateInput("0")).toEqual({
      ok: true,
      value: 0,
      normalized: "0",
    });
    expect(parseRateInput("100")).toEqual({
      ok: true,
      value: 100,
      normalized: "100",
    });
    expect(parseRateInput("150")).toEqual({
      ok: true,
      value: 150,
      normalized: "150",
    });
  });

  it("accepts up to four decimal places and rejects more", () => {
    expect(parseRateInput("16.1234")).toEqual({
      ok: true,
      value: 16.1234,
      normalized: "16.1234",
    });
    expect(parseRateInput("16.12345")).toEqual({
      ok: false,
      error: "too_many_decimals",
    });
  });

  it("rejects empty, negative, and invalid rates", () => {
    expect(parseRateInput("")).toEqual({ ok: false, error: "required" });
    expect(parseRateInput("-16")).toEqual({
      ok: false,
      error: "negative",
    });
    expect(parseRateInput("dieciseis")).toEqual({
      ok: false,
      error: "invalid",
    });
  });
});

describe("vat formatting helpers", () => {
  it("rounds currency values to two decimals", () => {
    expect(roundCurrency(1.005)).toBe(1.01);
    expect(roundCurrency(1234.567)).toBe(1234.57);
  });

  it("formats money with the selected locale and currency", () => {
    expect(formatMoney(1234.5, "es-MX", "MXN")).toBe("$1,234.50");
    expect(formatMoney(1234.5, "en-US", "USD")).toBe("$1,234.50");
  });

  it("formats numbers and rates with the selected locale", () => {
    expect(formatNumber(1234.56789, "es-MX")).toBe("1,234.5679");
    expect(formatRate(10.5, "es-MX")).toBe("10.5%");
    expect(formatRate(10.5, "es-ES")).toBe("10,5%");
  });
});

describe("vat country presets", () => {
  it("includes the required default countries", () => {
    const countryIds = VAT_COUNTRY_PRESETS.map((country) => country.id);

    expect(countryIds).toEqual(
      expect.arrayContaining([
        "mexico",
        "espana",
        "argentina",
        "colombia",
        "chile",
        "peru",
        "ecuador",
        "guatemala",
        "costa-rica",
        "uruguay",
        "estados-unidos",
      ]),
    );
  });

  it("has enough data to drive the UI for every preset", () => {
    VAT_COUNTRY_PRESETS.forEach((country) => {
      expect(country.id).toBeTruthy();
      expect(country.label).toBeTruthy();
      expect(country.locale).toBeTruthy();
      expect(country.currency).toBeTruthy();
      expect(country.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  it("keeps the United States as manual sales tax input", () => {
    const unitedStates = VAT_COUNTRY_PRESETS.find(
      (country) => country.id === "estados-unidos",
    );

    expect(unitedStates?.defaultRate).toBeNull();
    expect(unitedStates?.rates).toEqual([]);
  });
});
