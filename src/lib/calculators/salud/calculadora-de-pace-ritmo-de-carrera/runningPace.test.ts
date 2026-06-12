import { describe, expect, it } from "vitest";
import {
  KM_PER_MILE,
  buildRunningPaceCopyText,
  calculateRunningPace,
  combinePaceParts,
  combineTimeParts,
  convertDistance,
  formatDuration,
  formatPace,
  generateSplits,
  parseLocalizedNumber,
  type RunningPaceInput,
} from "./runningPace";

const analyzeInput: RunningPaceInput = {
  mode: "analyze",
  distance: 10,
  distanceUnit: "km",
  timeSeconds: 50 * 60,
  paceUnit: "min/km",
  splitInterval: "1km",
};

describe("running pace calculations", () => {
  it("calculates pace, speed, and unit equivalents", () => {
    const result = calculateRunningPace(analyzeInput);

    expect(result.paceSecondsPerKm).toBe(300);
    expect(result.paceSecondsPerMi).toBeCloseTo(300 * KM_PER_MILE);
    expect(result.speedKmh).toBe(12);
    expect(formatPace(result.paceSecondsPerMi)).toBe("8:03");
  });

  it("calculates distance from time and a constant pace", () => {
    const result = calculateRunningPace({
      ...analyzeInput,
      mode: "distance",
      timeSeconds: 60 * 60,
      paceSeconds: 6 * 60,
    });

    expect(result.distanceKm).toBe(10);
  });

  it("calculates a planning pace from distance and target time", () => {
    const result = calculateRunningPace({
      ...analyzeInput,
      mode: "plan",
      distance: 21.0975,
      timeSeconds: 105 * 60,
    });

    expect(formatPace(result.paceSecondsPerKm)).toBe("4:59");
  });

  it("calculates distance correctly from a pace in minutes per mile", () => {
    const result = calculateRunningPace({
      ...analyzeInput,
      mode: "distance",
      timeSeconds: 8 * 60,
      paceSeconds: 8 * 60,
      paceUnit: "min/mi",
    });

    expect(result.distanceMi).toBeCloseTo(1, 10);
  });

  it("keeps equivalent km and mile inputs consistent", () => {
    const miles = convertDistance(10, "km", "mi");
    const metric = calculateRunningPace(analyzeInput);
    const imperial = calculateRunningPace({
      ...analyzeInput,
      distance: miles,
      distanceUnit: "mi",
    });

    expect(imperial.distanceKm).toBeCloseTo(metric.distanceKm, 10);
    expect(imperial.paceSecondsPerKm).toBeCloseTo(metric.paceSecondsPerKm, 10);
  });

  it("projects a marathon at five minutes per kilometer", () => {
    const result = calculateRunningPace(analyzeInput);
    const marathon = result.equivalents.find(
      (distance) => distance.id === "marathon",
    );

    expect(formatDuration(marathon!.timeSeconds)).toBe("3:30:59");
  });
});

describe("running pace splits", () => {
  it("adds a partial final split for a half marathon", () => {
    const splits = generateSplits(21.0975, 300, "5km");

    expect(splits).toHaveLength(5);
    expect(splits.at(-1)).toMatchObject({
      distanceKm: 21.0975,
      isPartial: true,
    });
    expect(formatDuration(splits.at(-1)!.timeSeconds)).toBe("1:45:29");
  });

  it("does not duplicate an exact final split", () => {
    const splits = generateSplits(10, 300, "5km");

    expect(splits).toHaveLength(2);
    expect(splits.at(-1)).toMatchObject({ distanceKm: 10, isPartial: false });
  });

  it("does not accumulate rounded split values", () => {
    const pace = 299.6;
    const splits = generateSplits(10, pace, "1km");

    expect(splits.at(-1)!.timeSeconds).toBe(2996);
  });
});

describe("running pace parsing, formatting, and validation", () => {
  it("accepts comma decimals and rejects malformed values", () => {
    expect(parseLocalizedNumber("21,0975")).toBe(21.0975);
    expect(parseLocalizedNumber("21.0975")).toBe(21.0975);
    expect(parseLocalizedNumber("21 km")).toBeUndefined();
  });

  it("validates time and pace parts", () => {
    expect(combineTimeParts(0, 50, 0)).toBe(3000);
    expect(combineTimeParts(0, 60, 0)).toBeUndefined();
    expect(combinePaceParts(5, 0)).toBe(300);
    expect(combinePaceParts(4, 60)).toBeUndefined();
  });

  it("carries rounded seconds into the next minute", () => {
    expect(formatPace(299.6)).toBe("5:00");
    expect(formatDuration(3599.6)).toBe("1:00:00");
  });

  it("warns for unusual long distances and rejects unsafe values", () => {
    const long = calculateRunningPace({
      ...analyzeInput,
      distance: 501,
      timeSeconds: 100 * 3600,
    });

    expect(long.warnings).toContain("long_distance");
    expect(() =>
      calculateRunningPace({ ...analyzeInput, distance: 10_001 }),
    ).toThrow();
    expect(() =>
      calculateRunningPace({ ...analyzeInput, timeSeconds: 0 }),
    ).toThrow();
  });

  it("builds copy text with context and units", () => {
    const text = buildRunningPaceCopyText(calculateRunningPace(analyzeInput));

    expect(text).toContain("10 km en 50:00");
    expect(text).toContain("5:00 min/km");
    expect(text).toContain("8:03 min/mi");
    expect(text).toContain("calculadoras.tools");
  });
});
