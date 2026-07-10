import { describe, expect, it } from "vitest";
import { COOKING_PRESETS } from "./cookingPresets";
import {
  calculateCookingTime,
  convertWeight,
  formatCookingDurationRange,
  formatTimeOfDay,
  formatTimeRange,
  parseCookingNumber,
  parseTimeOfDay,
} from "./cookingTime";

describe("cooking time by weight", () => {
  it("calculates manual active time with extra cooking minutes", () => {
    const result = calculateCookingTime({
      weight: 2.5,
      weightUnit: "kg",
      rate: {
        rateUnit: "min/kg",
        minMinutesPerUnit: 40,
        maxMinutesPerUnit: 40,
      },
      extraCookMinutes: 20,
      restMinutes: 0,
    });

    expect(result.activeMinutes).toEqual({ min: 120, max: 120 });
    expect(result.totalMinutes).toEqual({ min: 120, max: 120 });
    expect(formatCookingDurationRange(result.activeMinutes)).toBe("2 h");
  });

  it("adds rest after active cooking without changing finish cooking time", () => {
    const result = calculateCookingTime({
      weight: 2.5,
      weightUnit: "kg",
      rate: {
        rateUnit: "min/kg",
        minMinutesPerUnit: 40,
        maxMinutesPerUnit: 40,
      },
      extraCookMinutes: 20,
      restMinutes: 15,
      startTimeMinutes: 10 * 60,
    });

    expect(result.activeMinutes).toEqual({ min: 120, max: 120 });
    expect(result.totalMinutes).toEqual({ min: 135, max: 135 });
    expect(result.finishCookingTime).toBeDefined();
    expect(result.serveTime).toBeDefined();
    expect(formatTimeRange(result.finishCookingTime!)).toBe("12:00");
    expect(formatTimeRange(result.serveTime!)).toBe("12:15");
  });

  it("keeps kg/lb conversions equivalent", () => {
    const kgResult = calculateCookingTime({
      weight: 1,
      weightUnit: "kg",
      rate: {
        rateUnit: "min/lb",
        minMinutesPerUnit: 10,
        maxMinutesPerUnit: 10,
      },
    });
    const lbResult = calculateCookingTime({
      weight: convertWeight(1, "kg", "lb"),
      weightUnit: "lb",
      rate: {
        rateUnit: "min/lb",
        minMinutesPerUnit: 10,
        maxMinutesPerUnit: 10,
      },
    });

    expect(kgResult.weightInRateUnit).toBeCloseTo(2.2046226218, 10);
    expect(kgResult.activeMinutes.min).toBeCloseTo(lbResult.activeMinutes.min, 10);
  });

  it("calculates reference ranges and conservative display rounding", () => {
    const result = calculateCookingTime({
      weight: 2.5,
      weightUnit: "kg",
      rate: {
        rateUnit: "min/kg",
        minMinutesPerUnit: 35,
        maxMinutesPerUnit: 45,
      },
      extraCookMinutes: 20,
    });

    expect(result.activeMinutes.min).toBe(107.5);
    expect(result.activeMinutes.max).toBe(132.5);
    expect(formatCookingDurationRange(result.activeMinutes)).toBe(
      "1 h 47 min a 2 h 13 min",
    );
  });

  it("handles cooking finish across midnight", () => {
    const start = parseTimeOfDay("23:30");

    if (!start.ok) {
      throw new Error("Hora invalida");
    }

    const result = calculateCookingTime({
      weight: 1,
      weightUnit: "kg",
      rate: {
        rateUnit: "min/kg",
        minMinutesPerUnit: 90,
        maxMinutesPerUnit: 90,
      },
      startTimeMinutes: start.minutes,
    });

    expect(result.finishCookingTime).toBeDefined();
    expect(formatTimeRange(result.finishCookingTime!)).toBe("01:00 (+1 dia)");
    expect(formatTimeOfDay(result.reviewFromTime!)).toBe("01:00 (+1 dia)");
  });

  it("warns when active cooking exceeds 24 hours", () => {
    const result = calculateCookingTime({
      weight: 40,
      weightUnit: "kg",
      rate: {
        rateUnit: "min/kg",
        minMinutesPerUnit: 40,
        maxMinutesPerUnit: 40,
      },
    });

    expect(result.warning).toBe("active-over-24h");
  });

  it("rejects zero weight and invalid preset ranges", () => {
    expect(() =>
      calculateCookingTime({
        weight: 0,
        weightUnit: "kg",
        rate: {
          rateUnit: "min/kg",
          minMinutesPerUnit: 40,
          maxMinutesPerUnit: 40,
        },
      }),
    ).toThrow("mayor que cero");

    expect(() =>
      calculateCookingTime({
        weight: 1,
        weightUnit: "kg",
        rate: {
          rateUnit: "min/kg",
          minMinutesPerUnit: 45,
          maxMinutesPerUnit: 35,
        },
      }),
    ).toThrow("minima");
  });
});

describe("cooking time parsing and editorial data", () => {
  it("accepts comma decimals", () => {
    expect(parseCookingNumber("2,5")).toEqual({
      ok: true,
      value: 2.5,
      normalized: "2.5",
    });
  });

  it("keeps source metadata on presets", () => {
    expect(COOKING_PRESETS.length).toBeGreaterThanOrEqual(6);

    COOKING_PRESETS.forEach((preset) => {
      expect(preset.minMinutesPerUnit).toBeGreaterThan(0);
      expect(preset.maxMinutesPerUnit).toBeGreaterThanOrEqual(
        preset.minMinutesPerUnit,
      );
      expect(preset.sourceLabel).toBeTruthy();
      expect(preset.sourceUrl).toMatch(/^https:\/\//);
      expect(preset.reviewedAt).toBe("2026-07-10");
    });
  });
});
