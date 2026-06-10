import { describe, expect, it } from "vitest";
import {
  buildMaxHeartRateCopyText,
  calculateClassicMaxHeartRate,
  calculateHeartRateRange,
  calculateMaxHeartRate,
  calculateTanakaMaxHeartRate,
  parseMaxHeartRateAge,
} from "./maxHeartRate";

describe("maximum heart rate formulas", () => {
  it("calculates Tanaka and classic estimates", () => {
    expect(Math.round(calculateTanakaMaxHeartRate(35))).toBe(184);
    expect(calculateClassicMaxHeartRate(35)).toBe(185);
    expect(Math.round(calculateTanakaMaxHeartRate(60))).toBe(166);
    expect(calculateClassicMaxHeartRate(60)).toBe(160);
  });

  it("calculates ranges from the exact Tanaka result before rounding", () => {
    const result = calculateMaxHeartRate(35);

    expect(result.tanakaExact).toBe(183.5);
    expect(result.tanakaBpm).toBe(184);
    expect(result.moderate).toEqual({
      minPercent: 0.5,
      maxPercent: 0.7,
      minBpm: 92,
      maxBpm: 128,
    });
    expect(result.vigorous).toEqual({
      minPercent: 0.7,
      maxPercent: 0.85,
      minBpm: 128,
      maxBpm: 156,
    });
  });

  it("rejects invalid formula inputs", () => {
    expect(() => calculateTanakaMaxHeartRate(17)).toThrow(RangeError);
    expect(() => calculateClassicMaxHeartRate(35.5)).toThrow(RangeError);
    expect(() => calculateHeartRateRange(180, 0.85, 0.7)).toThrow(RangeError);
    expect(() => calculateHeartRateRange(180, Number.NaN, 0.7)).toThrow(
      RangeError,
    );
  });
});

describe("maximum heart rate age parsing", () => {
  it("accepts the supported age boundaries", () => {
    expect(parseMaxHeartRateAge("18")).toEqual({ ok: true, age: 18 });
    expect(parseMaxHeartRateAge("100")).toEqual({ ok: true, age: 100 });
    expect(parseMaxHeartRateAge(" 35 ")).toEqual({ ok: true, age: 35 });
  });

  it("rejects empty, invalid, decimal, and out-of-range ages", () => {
    expect(parseMaxHeartRateAge("")).toEqual({
      ok: false,
      error: "required",
    });
    expect(parseMaxHeartRateAge("edad 35")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseMaxHeartRateAge("-35")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseMaxHeartRateAge("35.5")).toEqual({
      ok: false,
      error: "not_integer",
    });
    expect(parseMaxHeartRateAge("17")).toEqual({
      ok: false,
      error: "out_of_range",
    });
    expect(parseMaxHeartRateAge("101")).toEqual({
      ok: false,
      error: "out_of_range",
    });
  });
});

describe("maximum heart rate copy text", () => {
  it("includes the main estimate, ranges, comparison, and limitation", () => {
    const copyText = buildMaxHeartRateCopyText(calculateMaxHeartRate(35));

    expect(copyText).toContain("FCM estimada con Tanaka: 184 bpm");
    expect(copyText).toContain("Actividad moderada (50%-70%): 92-128 bpm");
    expect(copyText).toContain("Actividad vigorosa (70%-85%): 128-156 bpm");
    expect(copyText).toContain("Fórmula clásica (220 - edad): 185 bpm");
    expect(copyText).toContain("no una prescripción médica");
  });
});
