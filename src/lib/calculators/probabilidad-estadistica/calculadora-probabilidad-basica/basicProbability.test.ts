import { describe, expect, it } from "vitest";
import {
  BASIC_PROBABILITY_CANONICAL_PATH,
  calculateBasicProbabilityFromInput,
  formatProbabilityDecimal,
  formatProbabilityPercentage,
  parseProbabilityInput,
  type BasicProbabilityRawInput,
} from "./basicProbability";

const baseInput: BasicProbabilityRawInput = {
  mode: "simple",
  format: "percent",
  unionRelation: "general",
  intersectionMethod: "independent",
  favorableCases: "",
  possibleCases: "",
  probabilityA: "",
  probabilityB: "",
  intersection: "",
  conditionalA: "",
};

function calculate(
  input: Partial<BasicProbabilityRawInput>,
) {
  return calculateBasicProbabilityFromInput({ ...baseInput, ...input });
}

describe("probability input parsing", () => {
  it("accepts percentage, percent signs and decimal comma", () => {
    expect(parseProbabilityInput("25", "percent")).toMatchObject({
      ok: true,
      parsed: { value: 0.25 },
    });
    expect(parseProbabilityInput("25%", "percent")).toMatchObject({
      ok: true,
      parsed: { value: 0.25 },
    });
    expect(parseProbabilityInput("0,25", "decimal")).toMatchObject({
      ok: true,
      parsed: { value: 0.25 },
    });
  });

  it("rejects ambiguous and out-of-range values", () => {
    expect(parseProbabilityInput("25%", "decimal")).toMatchObject({
      ok: false,
    });
    expect(parseProbabilityInput("1,000.5", "percent")).toMatchObject({
      ok: false,
    });
    expect(parseProbabilityInput("101", "percent")).toMatchObject({
      ok: false,
    });
    expect(parseProbabilityInput("1.01", "decimal")).toMatchObject({
      ok: false,
    });
    expect(parseProbabilityInput("0.1234567", "decimal")).toMatchObject({
      ok: false,
    });
  });
});

describe("simple probability and complement", () => {
  it("calculates and simplifies 3 of 12", () => {
    const result = calculate({
      mode: "simple",
      favorableCases: "3",
      possibleCases: "12",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.calculation.percentage).toBe("25%");
      expect(result.calculation.decimal).toBe("0.25");
      expect(result.calculation.fraction).toBe("1/4");
      expect(result.calculation.interpretation).toContain("1 de cada 4");
    }
  });

  it("supports zero, certainty and thirds", () => {
    const zero = calculate({
      mode: "simple",
      favorableCases: "0",
      possibleCases: "12",
    });
    const certainty = calculate({
      mode: "simple",
      favorableCases: "12",
      possibleCases: "12",
    });
    const third = calculate({
      mode: "simple",
      favorableCases: "1",
      possibleCases: "3",
    });

    expect(zero.ok && zero.calculation.fraction).toBe("0/1");
    expect(certainty.ok && certainty.calculation.fraction).toBe("1/1");
    expect(third.ok && third.calculation.fraction).toBe("1/3");
    expect(third.ok && third.calculation.percentage).toBe("33.33%");
  });

  it("keeps the exact simple fraction even with a large denominator", () => {
    const result = calculate({
      mode: "simple",
      favorableCases: "1",
      possibleCases: "10001",
    });

    expect(result.ok && result.calculation.fraction).toBe("1/10001");
  });

  it("validates possible and favorable cases", () => {
    expect(
      calculate({
        mode: "simple",
        favorableCases: "4",
        possibleCases: "3",
      }),
    ).toMatchObject({
      ok: false,
      errors: [{ field: "favorableCases" }],
    });
    expect(
      calculate({
        mode: "simple",
        favorableCases: "1.5",
        possibleCases: "0",
      }),
    ).toMatchObject({ ok: false });
  });

  it("calculates a complement", () => {
    const result = calculate({
      mode: "complement",
      probabilityA: "25",
    });

    expect(result.ok && result.calculation).toMatchObject({
      percentage: "75%",
      decimal: "0.75",
      fraction: "3/4",
    });
  });
});

describe("union validation and calculation", () => {
  it("calculates a general union", () => {
    const result = calculate({
      mode: "union",
      probabilityA: "40",
      probabilityB: "50",
      intersection: "20",
    });

    expect(result.ok && result.calculation).toMatchObject({
      percentage: "70%",
      decimal: "0.7",
      fraction: "7/10",
    });
  });

  it("calculates mutually exclusive events", () => {
    const result = calculate({
      mode: "union",
      unionRelation: "exclusive",
      probabilityA: "40",
      probabilityB: "50",
    });

    expect(result.ok && result.calculation.percentage).toBe("90%");
  });

  it("rejects impossible lower and upper intersections", () => {
    const belowMinimum = calculate({
      mode: "union",
      probabilityA: "80",
      probabilityB: "70",
      intersection: "40",
    });
    const aboveMaximum = calculate({
      mode: "union",
      probabilityA: "40",
      probabilityB: "50",
      intersection: "45",
    });

    expect(belowMinimum).toMatchObject({
      ok: false,
      errors: [{ field: "intersection" }],
    });
    expect(aboveMaximum).toMatchObject({
      ok: false,
      errors: [{ field: "intersection" }],
    });
  });

  it("rejects exclusive events whose probabilities exceed one", () => {
    expect(
      calculate({
        mode: "union",
        unionRelation: "exclusive",
        probabilityA: "60",
        probabilityB: "50",
      }),
    ).toMatchObject({
      ok: false,
      errors: [{ field: "probabilityB" }],
    });
  });
});

describe("intersection and conditional probability", () => {
  it("calculates independent intersection", () => {
    const result = calculate({
      mode: "intersection",
      probabilityA: "40",
      probabilityB: "50",
    });

    expect(result.ok && result.calculation).toMatchObject({
      percentage: "20%",
      fraction: "1/5",
    });
  });

  it("calculates intersection from conditional probability", () => {
    const result = calculate({
      mode: "intersection",
      intersectionMethod: "conditional",
      probabilityB: "50",
      conditionalA: "40",
    });

    expect(result.ok && result.calculation.percentage).toBe("20%");
  });

  it("blocks a conditional intersection when P(B) is zero", () => {
    expect(
      calculate({
        mode: "intersection",
        intersectionMethod: "conditional",
        probabilityB: "0",
        conditionalA: "40",
      }),
    ).toMatchObject({
      ok: false,
      errors: [{ field: "probabilityB" }],
    });
  });

  it("calculates conditional probability and validates its subset", () => {
    const valid = calculate({
      mode: "conditional",
      probabilityB: "50",
      intersection: "20",
    });
    const impossible = calculate({
      mode: "conditional",
      probabilityB: "30",
      intersection: "40",
    });

    expect(valid.ok && valid.calculation.percentage).toBe("40%");
    expect(impossible).toMatchObject({
      ok: false,
      errors: [{ field: "intersection" }],
    });
  });

  it("blocks division by zero", () => {
    expect(
      calculate({
        mode: "conditional",
        probabilityB: "0",
        intersection: "0",
      }),
    ).toMatchObject({
      ok: false,
      errors: [{ field: "probabilityB" }],
    });
  });
});

describe("formatting and canonical metadata", () => {
  it("does not render tiny positive values as zero", () => {
    expect(formatProbabilityPercentage(0.000001)).toBe("< 0.01%");
    expect(formatProbabilityDecimal(1 / 3)).toBe("0.333333");
  });

  it("keeps copy text educational and finite", () => {
    const result = calculate({
      mode: "simple",
      favorableCases: "1",
      possibleCases: "3",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.calculation.copyText).toContain("Fórmula:");
      expect(result.calculation.copyText).not.toMatch(/NaN|Infinity|-0/);
    }
  });

  it("uses the probability and statistics canonical path", () => {
    expect(BASIC_PROBABILITY_CANONICAL_PATH).toBe(
      "/probabilidad-estadistica/calculadora-probabilidad-basica",
    );
  });
});
