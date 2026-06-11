import { describe, expect, it } from "vitest";
import {
  buildOneRepMaxCopyText,
  calculateBrzyckiOneRepMax,
  calculateEpleyOneRepMax,
  calculateOneRepMaxResult,
  calculateTargetRepetitionLoad,
  convertWeight,
  parseWeightInput,
  roundToAvailableIncrement,
  validateOneRepMaxInput,
  type OneRepMaxInput,
} from "./oneRepMax";

const validInput: OneRepMaxInput = {
  weight: 80,
  unit: "kg",
  repetitions: 5,
  rir: 0,
  increment: 2.5,
  primaryFormula: "epley",
};

describe("one rep max formulas", () => {
  it("calculates the documented Epley and Brzycki example", () => {
    const result = calculateOneRepMaxResult(validInput);

    expect(result.estimate.epley).toBeCloseTo(93.333333);
    expect(result.estimate.brzycki).toBe(90);
    expect(result.estimate.primary).toBe(result.estimate.epley);
    expect(result.quality).toBe("better");
  });

  it("uses the lifted weight for one repetition at RIR zero", () => {
    const result = calculateOneRepMaxResult({
      ...validInput,
      repetitions: 1,
    });

    expect(result.estimate.epley).toBe(80);
    expect(result.estimate.brzycki).toBe(80);
    expect(result.quality).toBe("lifted");
  });

  it("adds known RIR to effective repetitions", () => {
    const result = calculateOneRepMaxResult({ ...validInput, rir: 2 });

    expect(result.effectiveRepetitions).toBe(7);
    expect(result.estimate.epley).toBe(
      calculateEpleyOneRepMax(validInput.weight, 7),
    );
    expect(result.quality).toBe("orientation");
  });

  it("does not add an arbitrary value for unknown or 3+ RIR", () => {
    expect(
      calculateOneRepMaxResult({ ...validInput, rir: "unknown" })
        .effectiveRepetitions,
    ).toBe(5);
    expect(
      calculateOneRepMaxResult({ ...validInput, rir: "3+" })
        .effectiveRepetitions,
    ).toBe(5);
  });

  it("changes the primary estimate without changing formula estimates", () => {
    const epley = calculateOneRepMaxResult(validInput);
    const brzycki = calculateOneRepMaxResult({
      ...validInput,
      primaryFormula: "brzycki",
    });

    expect(brzycki.estimate.epley).toBe(epley.estimate.epley);
    expect(brzycki.estimate.brzycki).toBe(epley.estimate.brzycki);
    expect(brzycki.estimate.primary).toBe(brzycki.estimate.brzycki);
  });

  it("rejects Brzycki at 37 effective repetitions", () => {
    expect(() => calculateBrzyckiOneRepMax(80, 37)).toThrow(RangeError);
  });
});

describe("one rep max planning and quality", () => {
  it("marks uncertain and high-repetition estimates as low quality", () => {
    expect(
      calculateOneRepMaxResult({ ...validInput, rir: "unknown" }).quality,
    ).toBe("low");
    expect(
      calculateOneRepMaxResult({ ...validInput, repetitions: 12 }).quality,
    ).toBe("low");
  });

  it("rounds practical loads and exposes a conservative lower option", () => {
    expect(roundToAvailableIncrement(76.8, 2.5)).toEqual({
      exact: 76.8,
      nearest: 77.5,
      lower: 75,
      nearestRoundsUp: true,
    });
    expect(roundToAvailableIncrement(75, 2.5).nearest).toBe(75);
  });

  it("uses the corresponding inverse formula for target repetitions", () => {
    const epley = calculateTargetRepetitionLoad(100, 8, "epley", 2.5);
    const brzycki = calculateTargetRepetitionLoad(100, 8, "brzycki", 2.5);

    expect(epley.exact).toBeCloseTo(78.947);
    expect(brzycki.exact).toBeCloseTo(80.556);
    expect(calculateTargetRepetitionLoad(100, 1, "epley", 2.5).exact).toBe(
      100,
    );
  });
});

describe("one rep max parsing, conversion, and validation", () => {
  it("accepts decimal comma and point", () => {
    expect(parseWeightInput("80")).toBe(80);
    expect(parseWeightInput("80.5")).toBe(80.5);
    expect(parseWeightInput("80,5")).toBe(80.5);
    expect(parseWeightInput("80 kg")).toBeUndefined();
  });

  it("keeps equivalence through unit conversion", () => {
    const pounds = convertWeight(80, "kg", "lb");
    expect(convertWeight(pounds, "lb", "kg")).toBeCloseTo(80, 10);
  });

  it("rejects invalid input ranges", () => {
    const validation = validateOneRepMaxInput({
      ...validInput,
      weight: 0,
      repetitions: 16,
      increment: 0,
    });

    expect(validation.errors.weight).toBe("out_of_range");
    expect(validation.errors.repetitions).toBe("out_of_range");
    expect(validation.errors.increment).toBe("out_of_range");
  });
});

describe("one rep max copy text", () => {
  it("includes formulas, range, quality, planner, and limitation", () => {
    const result = calculateOneRepMaxResult(validInput);
    const text = buildOneRepMaxCopyText(result, {
      mode: "repetitions",
      target: 8,
      load: calculateTargetRepetitionLoad(
        result.estimate.primary,
        8,
        result.input.primaryFormula,
        result.input.increment,
      ),
    });

    expect(text).toContain("Epley");
    expect(text).toContain("Brzycki");
    expect(text).toContain("Rango entre fórmulas");
    expect(text).toContain("Mejor base de estimación");
    expect(text).toContain("Próxima carga para 8 repeticiones");
    expect(text).toContain("no garantiza");
  });
});
