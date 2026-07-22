import { describe, expect, it } from "vitest";
import {
  calculateIncomeTax,
  formatIncomeTaxMoney,
  MEXICO_ISR_PRESET,
  parseIncomeTaxMoneyInput,
} from "./incomeTax";

describe("MVP de ISR México", () => {
  it("calcula la tarifa mensual con cuota fija y excedente", () => {
    const result = calculateIncomeTax({
      mode: "payroll-withholding",
      frequency: "monthly",
      taxableBase: 20_000,
    });

    expect(result.bracket?.lowerBound).toBe(17_533.65);
    expect(result.marginalRate).toBe(21.36);
    expect(result.taxBeforeCredits).toBeCloseTo(2_383.65, 2);
    expect(result.tax).toBeCloseTo(2_383.65, 2);
    expect(result.effectiveRate).toBeCloseTo(0.1191825, 6);
  });

  it("selecciona la tabla oficial de 10 días", () => {
    const result = calculateIncomeTax({
      mode: "payroll-withholding",
      frequency: "every_10_days",
      taxableBase: 5_000,
    });

    expect(result.frequency.tableLabel).toBe("Tabla de 10 días");
    expect(result.bracket?.lowerBound).toBe(4_817.31);
    expect(result.tax).toBeCloseTo(473.24, 2);
  });

  it("calcula el ejercicio anual 2026 con su tarifa anual", () => {
    const result = calculateIncomeTax({
      mode: "annual-estimate",
      frequency: "annual",
      taxableBase: 240_000,
    });

    expect(result.scopeLabel).toBe("ejercicio anual 2026");
    expect(result.bracket?.lowerBound).toBe(210_403.7);
    expect(result.tax).toBeCloseTo(28_603.91, 2);
  });

  it("interpreta la diferencia como saldo a pagar o a favor", () => {
    const due = calculateIncomeTax({
      mode: "payroll-withholding",
      frequency: "monthly",
      taxableBase: 20_000,
      comparableRetention: 2_000,
    });
    const refund = calculateIncomeTax({
      mode: "payroll-withholding",
      frequency: "monthly",
      taxableBase: 20_000,
      comparableRetention: 3_000,
    });

    expect(due.balanceLabel).toBe("a pagar");
    expect(due.balance).toBeCloseTo(383.65, 2);
    expect(refund.balanceLabel).toBe("a favor");
    expect(refund.balance).toBeCloseTo(-616.35, 2);
  });

  it("permite simulación manual y la marca sin fuente oficial", () => {
    const result = calculateIncomeTax({
      mode: "annual-estimate",
      ruleMode: "manual",
      frequency: "annual",
      taxableBase: 100_000,
      manualRate: 10,
    });

    expect(result.status).toBe("manual");
    expect(result.sourceUrl).toBeNull();
    expect(result.tax).toBe(10_000);
    expect(result.bracket).toBeNull();
  });

  it("devuelve cero para una base cero", () => {
    const result = calculateIncomeTax({
      mode: "payroll-withholding",
      frequency: "monthly",
      taxableBase: 0,
    });

    expect(result.tax).toBe(0);
    expect(result.effectiveRate).toBe(0);
    expect(result.marginalRate).toBe(0);
    expect(result.bracket).toBeNull();
  });

  it("rechaza combinaciones de modo y frecuencia incompatibles", () => {
    expect(() =>
      calculateIncomeTax({
        mode: "annual-estimate",
        frequency: "monthly",
        taxableBase: 20_000,
      }),
    ).toThrow("frecuencia anual");

    expect(() =>
      calculateIncomeTax({
        mode: "payroll-withholding",
        frequency: "annual",
        taxableBase: 20_000,
      }),
    ).toThrow("frecuencia de pago");
  });
});

describe("helpers del cálculo de ISR", () => {
  it("acepta separadores mexicanos e internacionales", () => {
    expect(parseIncomeTaxMoneyInput("$20,000.50 MXN")).toEqual({
      ok: true,
      value: 20_000.5,
      normalized: "20000.50",
    });
    expect(parseIncomeTaxMoneyInput("20.000,50")).toEqual({
      ok: true,
      value: 20_000.5,
      normalized: "20000.50",
    });
  });

  it("rechaza negativos y valores no numéricos", () => {
    expect(parseIncomeTaxMoneyInput("-100")).toEqual({ ok: false, error: "negative" });
    expect(parseIncomeTaxMoneyInput("texto")).toEqual({ ok: false, error: "invalid" });
    expect(parseIncomeTaxMoneyInput("")).toEqual({ ok: false, error: "required" });
  });

  it("formatea pesos mexicanos", () => {
    expect(formatIncomeTaxMoney(1_234.5)).toContain("1,234.50");
    expect(MEXICO_ISR_PRESET.sourceName).toContain("Anexo 8");
  });
});
