import { describe, expect, it } from "vitest";
import {
  buildVo2CopyText,
  calculateCooperVo2,
  calculateRockportVo2,
  calculateVo2Result,
  convertDistance,
  convertWeight,
  distanceFromLaps,
  formatPace,
  parseVo2Number,
  validateVo2Input,
  type CooperInput,
  type RockportInput,
} from "./vo2Max";

const protocol = {
  measuredRoute: true,
  exactDurationOrImmediatePulse: true,
  noSymptoms: true,
};

const cooperInput: CooperInput = {
  method: "cooper",
  distance: 2400,
  distanceUnit: "m",
  protocol,
};

const rockportInput: RockportInput = {
  method: "rockport",
  age: 30,
  formulaSex: "male",
  weight: 70,
  weightUnit: "kg",
  minutes: 15,
  seconds: 0,
  finalPulse: 140,
  walkedEntireMile: true,
  protocol,
};

describe("VO2 formulas and conversion", () => {
  it("calculates the documented Cooper example", () => {
    expect(calculateCooperVo2(2400)).toBeCloseTo(42.37, 2);
    expect(calculateVo2Result(cooperInput).vo2Max).toBeCloseTo(42.37, 2);
  });

  it("keeps distance and weight equivalent through conversion", () => {
    expect(convertDistance(2.4, "km", "m")).toBe(2400);
    expect(convertDistance(convertDistance(2.4, "km", "mi"), "mi", "km")).toBeCloseTo(2.4, 10);
    expect(convertWeight(convertWeight(70, "kg", "lb"), "lb", "kg")).toBeCloseTo(70, 10);
  });

  it("calculates distance from track laps", () => {
    expect(distanceFromLaps(6, 0)).toBe(2400);
    expect(distanceFromLaps(5, 175)).toBe(2175);
    expect(() => distanceFromLaps(5, 400)).toThrow(RangeError);
    expect(() => distanceFromLaps(13, 0)).toThrow(RangeError);
  });

  it("uses decimal minutes in Rockport", () => {
    const atFifteen = calculateRockportVo2(rockportInput);
    const atFifteenThirty = calculateRockportVo2({ ...rockportInput, seconds: 30 });

    expect(atFifteen).toBeCloseTo(44.786, 3);
    expect(atFifteenThirty).toBeCloseTo(atFifteen - 3.2649 * 0.5, 8);
  });

  it("formats pace without rolling seconds to 60", () => {
    expect(formatPace(5)).toBe("5:00 min/km");
    expect(formatPace(4.999)).toBe("5:00 min/km");
  });
});

describe("VO2 validation, warnings, and quality", () => {
  it("rejects Cooper outside the usable range", () => {
    expect(validateVo2Input({ ...cooperInput, distance: 599 }).errors.distance).toBe("out_of_range");
    expect(validateVo2Input({ ...cooperInput, distance: 5001 }).errors.distance).toBe("out_of_range");
  });

  it("requires Rockport to be walked and validates time and pulse", () => {
    const validation = validateVo2Input({
      ...rockportInput,
      seconds: 60,
      finalPulse: 221,
      walkedEntireMile: false,
    });

    expect(validation.errors.seconds).toBe("out_of_range");
    expect(validation.errors.finalPulse).toBe("out_of_range");
    expect(validation.errors.walkedEntireMile).toBe("confirmation_required");
  });

  it("warns for fast Rockport and extrapolated age", () => {
    const result = calculateVo2Result({
      ...rockportInput,
      age: 25,
      minutes: 9,
    });

    expect(result.warnings).toContain("rockport_fast");
    expect(result.warnings).toContain("rockport_age_extrapolated");
    expect(result.quality).toBe("review");
  });

  it("uses acceptable quality when optional protocol checks are incomplete", () => {
    const result = calculateVo2Result({
      ...cooperInput,
      protocol: { ...protocol, measuredRoute: false },
    });

    expect(result.quality).toBe("acceptable");
    expect(result.warnings).toContain("protocol_incomplete");
  });

  it("rejects a non-positive result", () => {
    expect(() =>
      calculateVo2Result({
        ...rockportInput,
        age: 100,
        weight: 250,
        minutes: 30,
        finalPulse: 220,
      }),
    ).toThrow("no es utilizable");
  });
});

describe("VO2 parsing and copy", () => {
  it("accepts comma and point but rejects mixed text and too many decimals", () => {
    expect(parseVo2Number("70,5")).toBe(70.5);
    expect(parseVo2Number("70.5")).toBe(70.5);
    expect(parseVo2Number("70.555")).toBeUndefined();
    expect(parseVo2Number("70 kg")).toBeUndefined();
    expect(parseVo2Number("15.5", { integer: true })).toBeUndefined();
  });

  it("includes useful result context and comparison in copy text", () => {
    const text = buildVo2CopyText(calculateVo2Result(cooperInput), 1.4);

    expect(text).toContain("42.4 ml/kg/min");
    expect(text).toContain("Cooper de 12 minutos");
    expect(text).toContain("Calidad del dato: Buena");
    expect(text).toContain("+1.4 ml/kg/min");
    expect(text).toContain("no sustituye");
  });
});
