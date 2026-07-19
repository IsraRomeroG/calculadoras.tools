import { describe, expect, it } from "vitest";
import {
  buildVehicleDepreciationCsv,
  buildVehicleDepreciationShareText,
  calculateEquivalentAnnualRate,
  calculateSensitivityScenarios,
  calculateVehicleDepreciation,
  formatDepreciationPercent,
  parseMoneyInput,
} from "./depreciation";

describe("vehicle depreciation formulas", () => {
  it("calculates annual percentage depreciation", () => {
    const result = calculateVehicleDepreciation({
      mode: "porcentaje",
      initialValue: 500000,
      annualRatePercent: 15,
      years: 1,
    });

    expect(result.finalValue).toBe(425000);
    expect(result.accumulatedLoss).toBe(75000);
    expect(result.depreciatedPercent).toBe(15);
    expect(result.rows).toHaveLength(2);
  });

  it("uses a different first-year rate when provided", () => {
    const result = calculateVehicleDepreciation({
      mode: "porcentaje",
      initialValue: 500000,
      firstYearRatePercent: 20,
      annualRatePercent: 10,
      years: 2,
    });

    expect(result.finalValue).toBe(360000);
    expect(result.rows[1].value).toBe(400000);
    expect(result.rows[2].lossThisYear).toBe(40000);
  });

  it("keeps the value unchanged with a zero rate", () => {
    const result = calculateVehicleDepreciation({
      mode: "porcentaje",
      initialValue: 500000,
      annualRatePercent: 0,
      years: 5,
    });

    expect(result.finalValue).toBe(500000);
    expect(result.accumulatedLoss).toBe(0);
    expect(result.equivalentAnnualRate).toBe(0);
  });

  it("calculates linear depreciation down to residual value", () => {
    const result = calculateVehicleDepreciation({
      mode: "lineal",
      initialValue: 500000,
      residualValue: 250000,
      years: 5,
    });

    expect(result.finalValue).toBe(250000);
    expect(result.averageAnnualLoss).toBe(50000);
    expect(result.rows[3].value).toBe(350000);
  });

  it("rejects residual values greater than initial value", () => {
    expect(() =>
      calculateVehicleDepreciation({
        mode: "lineal",
        initialValue: 500000,
        residualValue: 550000,
        years: 5,
      }),
    ).toThrow("valor residual");
  });

  it("derives observed depreciation and equivalent annual rate", () => {
    const result = calculateVehicleDepreciation({
      mode: "valor-observado",
      initialValue: 500000,
      currentValue: 300000,
      years: 5,
    });

    expect(result.finalValue).toBe(300000);
    expect(result.accumulatedLoss).toBe(200000);
    expect(result.depreciatedPercent).toBe(40);
    expect(result.equivalentAnnualRate).toBeCloseTo(0.0971193415);
  });

  it("calculates 100% equivalent annual rate when final value is zero", () => {
    expect(calculateEquivalentAnnualRate(500000, 0, 5)).toBe(1);
  });

  it("builds conservative, base and aggressive sensitivity scenarios", () => {
    const scenarios = calculateSensitivityScenarios(500000, 5, 0.15, 5);

    expect(scenarios).toHaveLength(3);
    expect(scenarios[0].annualRate).toBeCloseTo(0.1);
    expect(scenarios[1].annualRate).toBeCloseTo(0.15);
    expect(scenarios[2].annualRate).toBeCloseTo(0.2);
  });

  it("rejects invalid inputs that would break the model", () => {
    expect(() =>
      calculateVehicleDepreciation({
        mode: "porcentaje",
        initialValue: 0,
        annualRatePercent: 15,
        years: 5,
      }),
    ).toThrow("valor inicial");
    expect(() =>
      calculateVehicleDepreciation({
        mode: "valor-observado",
        initialValue: 500000,
        currentValue: 600000,
        years: 5,
      }),
    ).toThrow("valor actual");
    expect(() =>
      calculateVehicleDepreciation({
        mode: "porcentaje",
        initialValue: 500000,
        annualRatePercent: 101,
        years: 5,
      }),
    ).toThrow("tasa anual");
  });
});

describe("vehicle depreciation parsing and output", () => {
  it("accepts comma, point and grouped money inputs", () => {
    expect(parseMoneyInput("12.5")).toEqual({
      ok: true,
      value: 12.5,
      normalized: "12.5",
    });
    expect(parseMoneyInput("12,5")).toEqual({
      ok: true,
      value: 12.5,
      normalized: "12.5",
    });
    expect(parseMoneyInput("1,000")).toEqual({
      ok: true,
      value: 1000,
      normalized: "1000",
    });
  });

  it("rejects invalid money inputs", () => {
    expect(parseMoneyInput("")).toEqual({ ok: false, error: "required" });
    expect(parseMoneyInput("-1")).toEqual({ ok: false, error: "negative" });
    expect(parseMoneyInput("abc")).toEqual({ ok: false, error: "invalid" });
  });

  it("formats percents with two decimals", () => {
    expect(formatDepreciationPercent(0.0971193415)).toBe("9.71%");
  });

  it("builds copyable text and CSV rows", () => {
    const result = calculateVehicleDepreciation({
      mode: "porcentaje",
      initialValue: 500000,
      annualRatePercent: 15,
      years: 1,
    });
    const text = buildVehicleDepreciationShareText(result);
    const csv = buildVehicleDepreciationCsv(result);

    expect(text).toContain("Valor estimado final: $425,000.00");
    expect(csv).toContain('"Ano","Valor estimado"');
    expect(csv).toContain('"1","425000"');
  });
});
