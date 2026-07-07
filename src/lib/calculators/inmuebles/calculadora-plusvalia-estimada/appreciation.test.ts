import { describe, expect, it } from "vitest";
import {
  buildCopyText,
  buildInterpretation,
  calculateAppreciation,
  formatCurrency,
  parseLocalizedNumber,
} from "./appreciation";

describe("estimated appreciation calculator", () => {
  it("projects future value with compound appreciation", () => {
    const result = calculateAppreciation({
      currentValue: 2_000_000,
      annualRatePercent: 4,
      years: 10,
    });

    expect(result.baseScenario.futureValue).toBeCloseTo(2_960_488.57, 2);
    expect(result.baseScenario.nominalGain).toBeCloseTo(960_488.57, 2);
    expect(result.baseScenario.accumulatedAppreciationPercent).toBeCloseTo(
      48.0244,
      4,
    );
    expect(formatCurrency(result.baseScenario.futureValue)).toBe(
      "$2,960,488.57",
    );
  });

  it("keeps value unchanged when the annual rate is zero", () => {
    const result = calculateAppreciation({
      currentValue: 1_500_000,
      annualRatePercent: 0,
      years: 5,
    });

    expect(result.baseScenario.futureValue).toBe(1_500_000);
    expect(result.baseScenario.nominalGain).toBe(0);
  });

  it("allows negative appreciation and returns a lower future value", () => {
    const result = calculateAppreciation({
      currentValue: 1_000_000,
      annualRatePercent: -5,
      years: 3,
    });

    expect(result.baseScenario.futureValue).toBeCloseTo(857_375, 2);
    expect(result.baseScenario.nominalGain).toBeLessThan(0);
    expect(buildInterpretation(result)).toContain("disminuir");
  });

  it("adds improvements to the projected base", () => {
    const result = calculateAppreciation({
      currentValue: 2_000_000,
      improvements: 200_000,
      annualRatePercent: 4,
      years: 10,
    });

    expect(result.baseAmount).toBe(2_200_000);
    expect(result.baseScenario.futureValue).toBeCloseTo(3_256_537.43, 2);
  });

  it("builds conservative, base and optimistic scenarios", () => {
    const result = calculateAppreciation({
      currentValue: 2_000_000,
      annualRatePercent: 4,
      years: 10,
    });

    expect(result.scenarios.map((scenario) => scenario.annualRatePercent)).toEqual(
      [2, 4, 6],
    );
    expect(result.scenarios[0].futureValue).toBeLessThan(
      result.baseScenario.futureValue,
    );
    expect(result.scenarios[2].futureValue).toBeGreaterThan(
      result.baseScenario.futureValue,
    );
  });

  it("does not allow the conservative scenario to drop below -99%", () => {
    const result = calculateAppreciation({
      currentValue: 1_000_000,
      annualRatePercent: -99,
      years: 2,
    });

    expect(result.scenarios[0].annualRatePercent).toBe(-99);
  });

  it("generates annual rows for all scenarios", () => {
    const result = calculateAppreciation({
      currentValue: 1_000_000,
      annualRatePercent: 10,
      years: 3,
    });

    expect(result.annualRows).toHaveLength(3);
    expect(result.annualRows[2]).toEqual(
      expect.objectContaining({
        year: 3,
        baseValue: expect.closeTo(1_331_000, 2),
        conservativeValue: expect.closeTo(1_259_712, 2),
        optimisticValue: expect.closeTo(1_404_928, 2),
      }),
    );
  });

  it("validates input ranges", () => {
    expect(() =>
      calculateAppreciation({
        currentValue: 0,
        annualRatePercent: 4,
        years: 10,
      }),
    ).toThrow("valor actual");
    expect(() =>
      calculateAppreciation({
        currentValue: 1_000_000,
        annualRatePercent: -100,
        years: 10,
      }),
    ).toThrow("-100%");
    expect(() =>
      calculateAppreciation({
        currentValue: 1_000_000,
        annualRatePercent: 4,
        years: 10.5,
      }),
    ).toThrow("entero");
    expect(() =>
      calculateAppreciation({
        currentValue: 1_000_000,
        annualRatePercent: 4,
        years: 101,
      }),
    ).toThrow("100");
  });

  it("warns for optimistic assumptions and unusually large improvements", () => {
    const result = calculateAppreciation({
      currentValue: 1_000_000,
      improvements: 600_000,
      annualRatePercent: 21,
      years: 31,
    });

    expect(result.warnings).toHaveLength(3);
    expect(result.warnings.join(" ")).toContain("20%");
    expect(result.warnings.join(" ")).toContain("30 años");
    expect(result.warnings.join(" ")).toContain("50%");
  });

  it("parses localized numbers and percentages", () => {
    expect(parseLocalizedNumber("$2,000,000")).toBe(2_000_000);
    expect(parseLocalizedNumber("2.000.000")).toBe(2_000_000);
    expect(parseLocalizedNumber("4,5%")).toBe(4.5);
    expect(parseLocalizedNumber("-5%")).toBe(-5);
    expect(parseLocalizedNumber("MXN 1,234.56")).toBe(1_234.56);
    expect(parseLocalizedNumber("abc")).toBeNull();
  });

  it("builds copy-ready summaries", () => {
    const result = calculateAppreciation({
      currentValue: 2_000_000,
      annualRatePercent: 4,
      years: 10,
    });

    expect(buildInterpretation(result)).toContain("podría aumentar");
    expect(buildCopyText(result)).toContain("Valor futuro base");
  });
});
