import { describe, expect, it } from "vitest";
import {
  buildHeartRateZonesCopyText,
  calculateHeartRateZones,
  HeartRateZonesError,
  parseHeartRateInteger,
} from "./heartRateZones";

describe("heart rate zone calculations", () => {
  it("calculates contiguous non-overlapping zones from a known maximum", () => {
    const result = calculateHeartRateZones({
      source: "known",
      method: "max-percent",
      knownMaxHeartRate: 180,
    });

    expect(result.maxHeartRateExact).toBe(180);
    expect(result.zones.map(({ minBpm, maxBpm }) => [minBpm, maxBpm])).toEqual([
      [90, 107],
      [108, 125],
      [126, 143],
      [144, 161],
      [162, 180],
    ]);
  });

  it("uses the exact Tanaka result before rounding zone limits", () => {
    const result = calculateHeartRateZones({
      source: "age",
      method: "max-percent",
      age: 35,
    });

    expect(result.maxHeartRateExact).toBe(183.5);
    expect(result.maxHeartRateBpm).toBe(184);
    expect(result.zones.map(({ minBpm, maxBpm }) => [minBpm, maxBpm])).toEqual([
      [92, 109],
      [110, 127],
      [128, 146],
      [147, 164],
      [165, 184],
    ]);
  });

  it("calculates Karvonen zones from heart rate reserve", () => {
    const result = calculateHeartRateZones({
      source: "known",
      method: "karvonen",
      knownMaxHeartRate: 180,
      restingHeartRate: 60,
    });

    expect(result.reserveExact).toBe(120);
    expect(result.zones.map(({ minBpm, maxBpm }) => [minBpm, maxBpm])).toEqual([
      [120, 131],
      [132, 143],
      [144, 155],
      [156, 167],
      [168, 180],
    ]);
  });

  it("rejects invalid and mathematically indistinct inputs", () => {
    expect(
      captureHeartRateZonesErrorCode(() =>
        calculateHeartRateZones({
          source: "age",
          method: "max-percent",
          age: 17,
        }),
      ),
    ).toBe("age_out_of_range");

    expect(
      captureHeartRateZonesErrorCode(() =>
        calculateHeartRateZones({
          source: "known",
          method: "karvonen",
          knownMaxHeartRate: 120,
        }),
      ),
    ).toBe("resting_required");

    expect(
      captureHeartRateZonesErrorCode(() =>
        calculateHeartRateZones({
          source: "known",
          method: "karvonen",
          knownMaxHeartRate: 100,
          restingHeartRate: 100,
        }),
      ),
    ).toBe("max_not_above_rest");

    expect(
      captureHeartRateZonesErrorCode(() =>
        calculateHeartRateZones({
          source: "known",
          method: "karvonen",
          knownMaxHeartRate: 100,
          restingHeartRate: 95,
        }),
      ),
    ).toBe("limits_not_distinct");

    expect(() =>
      calculateHeartRateZones({
        source: "age",
        method: "max-percent",
        age: 17,
      }),
    ).toThrow(HeartRateZonesError);
  });
});

describe("heart rate input parsing", () => {
  it("accepts valid integers and trims whitespace", () => {
    expect(parseHeartRateInteger(" 35 ", 18, 100)).toEqual({
      ok: true,
      value: 35,
    });
  });

  it("rejects empty, invalid, decimal, and out-of-range values", () => {
    expect(parseHeartRateInteger("", 18, 100)).toEqual({
      ok: false,
      error: "required",
    });
    expect(parseHeartRateInteger("edad 35", 18, 100)).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseHeartRateInteger("35.5", 18, 100)).toEqual({
      ok: false,
      error: "not_integer",
    });
    expect(parseHeartRateInteger("17", 18, 100)).toEqual({
      ok: false,
      error: "out_of_range",
    });
  });
});

describe("heart rate zones copy text", () => {
  it("includes calculation context, all zones, and the limitation", () => {
    const copyText = buildHeartRateZonesCopyText(
      calculateHeartRateZones({
        source: "age",
        method: "karvonen",
        age: 35,
        restingHeartRate: 60,
      }),
    );

    expect(copyText).toContain("estimada con Tanaka para 35 años");
    expect(copyText).toContain("Método: Karvonen");
    expect(copyText).toContain("Reserva cardíaca: 123.5 bpm");
    expect(copyText).toContain("Zona 1");
    expect(copyText).toContain("Zona 5");
    expect(copyText).toContain("no una prescripción médica");
  });
});

function captureHeartRateZonesErrorCode(callback: () => void): string {
  try {
    callback();
  } catch (error) {
    if (error instanceof HeartRateZonesError) {
      return error.code;
    }

    throw error;
  }

  throw new Error("Se esperaba un error de zonas de frecuencia cardíaca.");
}
