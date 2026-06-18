import { describe, expect, it } from "vitest";
import {
  calculateNormalDistribution,
  calculateZScore,
  convertZToValue,
  formatProbabilityPercentage,
  inverseStandardNormalCdf,
  parseNormalNumber,
  probabilityBetween,
  probabilityOutside,
  standardNormalCdf,
  standardNormalSurvival,
} from "./normalDistribution";

describe("normal distribution calculations", () => {
  it("calculates and reverses a Z-score", () => {
    expect(calculateZScore(85, 70, 10)).toBe(1.5);
    expect(calculateZScore(70, 70, 10)).toBe(0);
    expect(convertZToValue(1.5, 70, 10)).toBe(85);
  });

  it("calculates standard normal CDF and tails accurately", () => {
    expect(standardNormalCdf(0)).toBe(0.5);
    expect(standardNormalCdf(1.96)).toBeCloseTo(0.9750021049, 7);
    expect(standardNormalCdf(-1.96)).toBeCloseTo(0.0249978951, 7);
    expect(standardNormalSurvival(1.96)).toBeCloseTo(0.0249978951, 7);
    expect(standardNormalCdf(-1.25)).toBeCloseTo(
      1 - standardNormalCdf(1.25),
      12,
    );
  });

  it("calculates central and outside probabilities", () => {
    expect(probabilityBetween(-1, 1)).toBeCloseTo(0.6826894921, 7);
    expect(probabilityOutside(-1.96, 1.96)).toBeCloseTo(0.0499957903, 7);
  });

  it("calculates inverse normal values", () => {
    expect(inverseStandardNormalCdf(0.5)).toBe(0);
    expect(inverseStandardNormalCdf(0.975)).toBeCloseTo(1.9599639845, 6);

    [1e-10, 0.01, 0.1, 0.9, 0.99, 1 - 1e-10].forEach((probability) => {
      expect(
        standardNormalCdf(inverseStandardNormalCdf(probability)),
      ).toBeCloseTo(probability, 6);
    });
  });
});

describe("normal distribution input and presentation", () => {
  it("accepts comma decimals and rejects ambiguous or invalid values", () => {
    expect(parseNormalNumber("-1,5")).toEqual({
      ok: true,
      value: -1.5,
      normalized: "-1.5",
    });
    expect(parseNormalNumber("1,234")).toEqual({
      ok: false,
      message: "No uses separadores de miles.",
    });
    expect(parseNormalNumber("Infinity").ok).toBe(false);
  });

  it("validates standard deviation, ordered bounds and percentiles", () => {
    const base = {
      scale: "x" as const,
      value: "85",
      mean: "70",
      standardDeviation: "0",
      lower: "",
      upper: "",
      percentile: "",
      decimals: 4,
    };

    const deviation = calculateNormalDistribution({
      ...base,
      mode: "locate",
      probabilityType: "less",
    });
    expect(deviation.ok).toBe(false);
    if (!deviation.ok) {
      expect(deviation.errors[0].field).toBe("standardDeviation");
    }

    const bounds = calculateNormalDistribution({
      ...base,
      mode: "probability",
      scale: "z",
      standardDeviation: "",
      probabilityType: "between",
      lower: "1",
      upper: "1",
    });
    expect(bounds.ok).toBe(false);

    const percentile = calculateNormalDistribution({
      ...base,
      mode: "inverse",
      standardDeviation: "10",
      probabilityType: "less",
      percentile: "100",
    });
    expect(percentile.ok).toBe(false);
  });

  it("builds locate, interval and inverse results", () => {
    const locate = calculateNormalDistribution({
      mode: "locate",
      scale: "x",
      probabilityType: "less",
      value: "85",
      mean: "70",
      standardDeviation: "10",
      lower: "",
      upper: "",
      percentile: "",
      decimals: 4,
    });
    expect(locate.ok).toBe(true);
    if (locate.ok) {
      expect(locate.calculation.probability).toBeCloseTo(0.9331927987, 7);
      expect(locate.calculation.summary[0]).toEqual({
        label: "Z-score",
        value: "1.5000",
      });
    }

    const interval = calculateNormalDistribution({
      mode: "probability",
      scale: "z",
      probabilityType: "between",
      value: "",
      mean: "",
      standardDeviation: "",
      lower: "-1",
      upper: "1",
      percentile: "",
      decimals: 4,
    });
    expect(interval.ok).toBe(true);
    if (interval.ok) {
      expect(interval.calculation.graph.region).toBe("between");
      expect(interval.calculation.summary).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ label: "Percentil inferior" }),
          expect.objectContaining({ label: "Percentil superior" }),
        ]),
      );
    }

    const inverse = calculateNormalDistribution({
      mode: "inverse",
      scale: "x",
      probabilityType: "less",
      value: "",
      mean: "70",
      standardDeviation: "10",
      lower: "",
      upper: "",
      percentile: "90",
      decimals: 6,
    });
    expect(inverse.ok).toBe(true);
    if (inverse.ok) {
      expect(Number(inverse.calculation.primary)).toBeCloseTo(82.815516, 5);
    }
  });

  it("does not display tiny nonzero probabilities as exact zero or one", () => {
    expect(formatProbabilityPercentage(1e-12, 6)).toBe("< 0.000001%");
    expect(formatProbabilityPercentage(1 - 1e-12, 6)).toBe(
      "> 99.999999%",
    );
  });
});
