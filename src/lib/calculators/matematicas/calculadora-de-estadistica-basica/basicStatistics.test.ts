import { describe, expect, it } from "vitest";
import {
  buildCalculationSteps,
  buildFrequencyTable,
  buildFrequencyTableText,
  buildShareableStatisticsUrl,
  buildStatisticsInterpretation,
  buildStatisticsSummary,
  calculateBasicStatistics,
  calculateMean,
  calculateMedian,
  calculateModes,
  calculateRange,
  formatStatistic,
  parseStatisticsInput,
  shouldShowRoundingNote,
} from "./basicStatistics";

describe("basic statistics calculations", () => {
  it("calculates mean, median, no mode, and range", () => {
    const result = calculateBasicStatistics([2, 4, 6]);

    expect(result.mean).toBe(4);
    expect(result.median).toBe(4);
    expect(result.hasMode).toBe(false);
    expect(result.modes).toEqual([]);
    expect(result.range).toBe(4);
  });

  it("calculates a single mode", () => {
    expect(calculateModes([1, 2, 2, 3])).toEqual({
      modes: [2],
      hasMode: true,
      maxFrequency: 2,
    });
  });

  it("calculates multiple modes", () => {
    expect(calculateModes([1, 1, 2, 2, 3])).toEqual({
      modes: [1, 2],
      hasMode: true,
      maxFrequency: 2,
    });
  });

  it("calculates median for even lists", () => {
    expect(calculateMedian([1, 2, 3, 4])).toBe(2.5);
  });

  it("handles negative values", () => {
    expect(calculateMean([-5, 0, 5])).toBe(0);
    expect(calculateMedian([-5, 0, 5])).toBe(0);
    expect(calculateRange([-5, 0, 5])).toBe(10);
  });

  it("handles a single value as mode", () => {
    const result = calculateBasicStatistics([7]);

    expect(result.mean).toBe(7);
    expect(result.median).toBe(7);
    expect(result.modes).toEqual([7]);
    expect(result.range).toBe(0);
  });

  it("counts numerically equivalent values together", () => {
    const table = buildFrequencyTable([2, 2.0, 2.0]);

    expect(table).toEqual([{ value: 2, frequency: 3, percentage: 100 }]);
  });

  it("keeps close but different values separate", () => {
    const result = calculateBasicStatistics([2, 2.0001]);

    expect(result.frequencyTable).toHaveLength(2);
    expect(result.hasMode).toBe(false);
  });
});

describe("basic statistics parsing", () => {
  it("accepts spaces", () => {
    expect(parseStatisticsInput("1 2 3 4")).toMatchObject({
      ok: true,
      values: [1, 2, 3, 4],
    });
  });

  it("accepts line breaks", () => {
    expect(parseStatisticsInput("1\n2\n3\n4")).toMatchObject({
      ok: true,
      values: [1, 2, 3, 4],
    });
  });

  it("accepts semicolons", () => {
    expect(parseStatisticsInput("1; 2; 3; 4")).toMatchObject({
      ok: true,
      values: [1, 2, 3, 4],
    });
  });

  it("accepts comma followed by space as list separator", () => {
    expect(parseStatisticsInput("1, 2, 3, 4")).toMatchObject({
      ok: true,
      values: [1, 2, 3, 4],
    });
  });

  it("accepts comma decimals separated by semicolon", () => {
    expect(parseStatisticsInput("1,5; 2,5; 3,75")).toMatchObject({
      ok: true,
      values: [1.5, 2.5, 3.75],
    });
  });

  it("rejects ambiguous comma lists", () => {
    expect(parseStatisticsInput("1,2,3")).toMatchObject({
      ok: false,
      error: "ambiguous_list",
    });
  });

  it("rejects apparent thousands separators", () => {
    expect(parseStatisticsInput("1,500")).toMatchObject({
      ok: false,
      error: "thousands_separator",
    });
  });

  it("rejects unknown tokens, NaN, and Infinity", () => {
    expect(parseStatisticsInput("12; abc; 15")).toMatchObject({
      ok: false,
      error: "invalid_token",
      token: "abc",
    });
    expect(parseStatisticsInput("NaN")).toMatchObject({
      ok: false,
      error: "invalid_number",
    });
    expect(parseStatisticsInput("Infinity")).toMatchObject({
      ok: false,
      error: "invalid_number",
    });
  });

  it("rejects lists above the value limit", () => {
    const list = Array.from({ length: 1001 }, (_, index) => index + 1).join(";");

    expect(parseStatisticsInput(list)).toMatchObject({
      ok: false,
      error: "too_many_values",
    });
  });
});

describe("basic statistics formatting and sharing", () => {
  it("rounds only for display", () => {
    expect(calculateMean([1, 2])).toBe(1.5);
    expect(formatStatistic(1.5, 0)).toBe("2");
  });

  it("respects visible decimals", () => {
    expect(formatStatistic(16.6, 2)).toBe("16.60");
    expect(formatStatistic(16.6, 0)).toBe("17");
  });

  it("detects rounding notes", () => {
    expect(shouldShowRoundingNote([2, 2.0001], 2)).toBe(true);
    expect(shouldShowRoundingNote([2, 3], 2)).toBe(false);
  });

  it("shares short lists and omits long lists", () => {
    expect(buildShareableStatisticsUrl([12, 15, 18, 18, 20])).toBe(
      "/matematicas/calculadora-de-estadistica-basica?datos=12%3B15%3B18%3B18%3B20",
    );
    expect(buildShareableStatisticsUrl(Array.from({ length: 51 }, () => 1))).toBeNull();
  });

  it("builds copy text", () => {
    const statistics = calculateBasicStatistics([12, 15, 18, 18, 20]);

    expect(buildStatisticsSummary([12, 15, 18, 18, 20], statistics)).toContain(
      "Media: 16.60",
    );
    expect(buildFrequencyTableText(statistics.frequencyTable)).toContain(
      "18.00\t2\t40%",
    );
  });
});

describe("basic statistics interpretation and steps", () => {
  it("builds no-mode interpretation", () => {
    const statistics = calculateBasicStatistics([2, 4, 6, 8]);

    expect(buildStatisticsInterpretation(statistics)).toBe(
      "No hay moda porque todos los valores aparecen una sola vez.",
    );
  });

  it("builds single-mode interpretation", () => {
    const statistics = calculateBasicStatistics([12, 15, 18, 18, 20]);

    expect(buildStatisticsInterpretation(statistics)).toContain(
      "El valor mas frecuente es 18.00",
    );
  });

  it("builds multimodal interpretation", () => {
    const statistics = calculateBasicStatistics([1, 1, 2, 2, 3]);

    expect(buildStatisticsInterpretation(statistics)).toBe(
      "Hay 2 modas y cada una aparece 2 veces.",
    );
  });

  it("builds note for one value", () => {
    const statistics = calculateBasicStatistics([7]);

    expect(buildStatisticsInterpretation(statistics)).toBe(
      "Con un solo valor, media, mediana y moda coinciden.",
    );
  });

  it("builds calculation steps with user data", () => {
    const statistics = calculateBasicStatistics([2, 4, 6, 8]);
    const steps = buildCalculationSteps([2, 4, 6, 8], statistics);

    expect(steps.mean).toBe("20 / 4 = 5.00.");
    expect(steps.median).toContain("Los dos valores centrales son 4 y 6");
    expect(steps.range).toBe("8 - 2 = 6.00.");
  });
});
