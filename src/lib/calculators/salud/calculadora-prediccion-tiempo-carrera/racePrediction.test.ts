import { describe, expect, it } from "vitest";
import {
  KM_PER_MILE,
  buildRacePredictionCopyText,
  calculateRacePrediction,
  combineTimeParts,
  convertDistance,
  formatDuration,
  formatPace,
  formatPaceChange,
  parseLocalizedNumber,
  type RacePredictionInput,
} from "./racePrediction";

const baseInput: RacePredictionInput = {
  referenceDistance: 10,
  referenceUnit: "km",
  referenceTimeSeconds: 50 * 60,
  targetDistance: 21.0975,
  targetUnit: "km",
  recency: "unknown",
  effort: "unknown",
  comparableConditions: "unknown",
};

describe("race prediction calculations", () => {
  it("predicts a half marathon from a 10K result", () => {
    const result = calculateRacePrediction(baseInput);

    expect(formatDuration(result.targetTimeSeconds)).toBe("1:50:19");
    expect(formatPace(result.targetPaceSecondsPerKm)).toBe("5:14");
    expect(formatPace(result.targetPaceSecondsPerMi)).toBe("8:25");
    expect(result.targetSpeedKmh).toBeCloseTo(11.47, 2);
  });

  it("returns the same time and pace for the same distance", () => {
    const result = calculateRacePrediction({ ...baseInput, targetDistance: 10 });

    expect(result.targetTimeSeconds).toBe(3000);
    expect(result.paceChangeSecondsPerKm).toBe(0);
    expect(formatPaceChange(result.paceChangeSecondsPerKm)).toContain("coincide");
  });

  it("predicts a faster pace for a shorter target", () => {
    const result = calculateRacePrediction({
      ...baseInput,
      referenceDistance: 10,
      targetDistance: 5,
    });

    expect(result.targetPaceSecondsPerKm).toBeLessThan(result.referencePaceSecondsPerKm);
    expect(formatPaceChange(result.paceChangeSecondsPerKm)).toContain("más rápido");
  });

  it("keeps equivalent km and mile inputs consistent", () => {
    const metric = calculateRacePrediction(baseInput);
    const imperial = calculateRacePrediction({
      ...baseInput,
      referenceDistance: convertDistance(10, "km", "mi"),
      referenceUnit: "mi",
      targetDistance: convertDistance(21.0975, "km", "mi"),
      targetUnit: "mi",
    });

    expect(imperial.targetTimeSeconds).toBeCloseTo(metric.targetTimeSeconds, 10);
  });

  it("inverts scenario time order when predicting a shorter distance", () => {
    const longer = calculateRacePrediction(baseInput);
    const shorter = calculateRacePrediction({ ...baseInput, targetDistance: 5 });

    expect(longer.scenarios[0].timeSeconds).toBeLessThan(longer.scenarios[2].timeSeconds);
    expect(shorter.scenarios[0].timeSeconds).toBeGreaterThan(shorter.scenarios[2].timeSeconds);
    expect(shorter.scenarios.map((scenario) => scenario.id)).toEqual([
      "better_retention",
      "central",
      "greater_fatigue",
    ]);
  });
});

describe("reference quality and warnings", () => {
  it("marks a recent race in comparable conditions as good", () => {
    const result = calculateRacePrediction({
      ...baseInput,
      targetDistance: 15,
      recency: "recent",
      effort: "race",
      comparableConditions: "yes",
    });

    expect(result.quality).toBe("good");
  });

  it("keeps unknown context acceptable without changing the central time", () => {
    const unknown = calculateRacePrediction(baseInput);
    const good = calculateRacePrediction({
      ...baseInput,
      recency: "recent",
      effort: "race",
      comparableConditions: "yes",
    });

    expect(unknown.quality).toBe("acceptable");
    expect(unknown.targetTimeSeconds).toBe(good.targetTimeSeconds);
  });

  it("always explains an acceptable quality result", () => {
    const result = calculateRacePrediction({
      ...baseInput,
      targetDistance: 15,
      recency: "one_to_three_months",
      effort: "race",
      comparableConditions: "yes",
    });

    expect(result.quality).toBe("acceptable");
    expect(result.qualityReasons.length).toBeGreaterThan(0);
  });

  it("marks distant targets and controlled efforts as high uncertainty", () => {
    const result = calculateRacePrediction({
      ...baseInput,
      referenceDistance: 1,
      targetDistance: 10,
      effort: "controlled",
    });

    expect(result.quality).toBe("high_uncertainty");
    expect(result.warnings).toContain("wide_distance_ratio");
    expect(result.warnings).toContain("controlled_effort");
  });

  it("warns when predicting a marathon from less than 10K", () => {
    const result = calculateRacePrediction({
      ...baseInput,
      referenceDistance: 5,
      targetDistance: 42.195,
    });

    expect(result.warnings).toContain("marathon_from_short_reference");
  });
});

describe("race prediction parsing, formatting, and validation", () => {
  it("accepts comma decimals and validates time parts", () => {
    expect(parseLocalizedNumber("21,0975")).toBe(21.0975);
    expect(parseLocalizedNumber("21 km")).toBeUndefined();
    expect(combineTimeParts(0, 50, 0)).toBe(3000);
    expect(combineTimeParts(0, 60, 0)).toBeUndefined();
  });

  it("carries rounded seconds into the next minute", () => {
    expect(formatPace(299.6)).toBe("5:00");
    expect(formatDuration(3599.6)).toBe("1:00:00");
  });

  it("rejects unsafe or empty values", () => {
    expect(() =>
      calculateRacePrediction({ ...baseInput, referenceTimeSeconds: 0 }),
    ).toThrow();
    expect(() =>
      calculateRacePrediction({ ...baseInput, targetDistance: 501 }),
    ).toThrow();
    expect(() =>
      calculateRacePrediction({ ...baseInput, referenceDistance: Number.NaN }),
    ).toThrow();
  });

  it("builds copy text with context and limitation", () => {
    const text = buildRacePredictionCopyText(calculateRacePrediction(baseInput));

    expect(text).toContain("Referencia: 10 km en 50:00");
    expect(text).toContain("Tiempo previsto: 1:50:19");
    expect(text).toContain("5:14 min/km");
    expect(text).toContain("fórmula Riegel");
  });

  it("uses the exact mile conversion", () => {
    expect(convertDistance(1, "mi", "km")).toBe(KM_PER_MILE);
  });
});
