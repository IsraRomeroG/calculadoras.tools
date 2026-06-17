import { describe, expect, it } from "vitest";
import {
  buildMinimumGradeSummary,
  calculateMinimumGrade,
  getScaleFromPreset,
  parseMinimumGradeNumber,
} from "./minimumGrade";

describe("minimum grade calculator", () => {
  it("calculates the required grade from evaluated weight", () => {
    const result = calculateMinimumGrade({
      scaleMin: 0,
      scaleMax: 10,
      currentGrade: 7.5,
      weightMode: "evaluated",
      weightPercent: 70,
      targetGrade: 8,
    });

    expect(result.weightPendingPercent).toBeCloseTo(30);
    expect(result.requiredGradeExact).toBeCloseTo(9.166666);
    expect(result.requiredGradeRounded).toBe(9.17);
    expect(result.status).toBe("reachable");
  });

  it("calculates the same required grade from pending weight", () => {
    const result = calculateMinimumGrade({
      scaleMin: 0,
      scaleMax: 10,
      currentGrade: 7.5,
      weightMode: "pending",
      weightPercent: 30,
      targetGrade: 8,
    });

    expect(result.weightEvaluatedPercent).toBeCloseTo(70);
    expect(result.requiredGradeRounded).toBe(9.17);
    expect(result.status).toBe("reachable");
  });

  it("marks impossible when the required grade exceeds the scale", () => {
    const result = calculateMinimumGrade({
      scaleMin: 0,
      scaleMax: 10,
      currentGrade: 5,
      weightMode: "evaluated",
      weightPercent: 80,
      targetGrade: 8,
    });

    expect(result.status).toBe("impossible");
    expect(result.requiredGradeExact).toBeGreaterThan(10);
    expect(result.maximumFinalGrade).toBeCloseTo(6);
  });

  it("marks secured when the required grade is at or below scale minimum", () => {
    const result = calculateMinimumGrade({
      scaleMin: 0,
      scaleMax: 10,
      currentGrade: 9,
      weightMode: "evaluated",
      weightPercent: 90,
      targetGrade: 8,
    });

    expect(result.status).toBe("secured");
    expect(result.recommendedGrade).toBe(0);
    expect(result.minimumFinalGrade).toBeCloseTo(8.1);
  });

  it("marks an exact maximum required grade as reachable", () => {
    const result = calculateMinimumGrade({
      scaleMin: 0,
      scaleMax: 10,
      currentGrade: 7,
      weightMode: "evaluated",
      weightPercent: 50,
      targetGrade: 8.5,
    });

    expect(result.requiredGradeExact).toBe(10);
    expect(result.status).toBe("reachable");
  });

  it("marks exact scale minimum as secured", () => {
    const result = calculateMinimumGrade({
      scaleMin: 0,
      scaleMax: 10,
      currentGrade: 8,
      weightMode: "evaluated",
      weightPercent: 50,
      targetGrade: 4,
    });

    expect(result.requiredGradeExact).toBe(0);
    expect(result.status).toBe("secured");
  });

  it("rejects evaluated weight of 100 percent", () => {
    expect(() =>
      calculateMinimumGrade({
        scaleMin: 0,
        scaleMax: 10,
        currentGrade: 8,
        weightMode: "evaluated",
        weightPercent: 100,
        targetGrade: 8,
      }),
    ).toThrow("El peso ya evaluado");
  });

  it("allows pending weight of 100 percent without current grade", () => {
    const result = calculateMinimumGrade({
      scaleMin: 0,
      scaleMax: 10,
      currentGrade: null,
      weightMode: "pending",
      weightPercent: 100,
      targetGrade: 8,
    });

    expect(result.requiredGradeExact).toBe(8);
    expect(result.status).toBe("reachable");
  });

  it("supports a 0-100 scale", () => {
    const result = calculateMinimumGrade({
      scaleMin: 0,
      scaleMax: 100,
      currentGrade: 75,
      weightMode: "evaluated",
      weightPercent: 70,
      targetGrade: 80,
    });

    expect(result.requiredGradeRounded).toBe(91.67);
  });

  it("supports a custom 0-5 scale", () => {
    const result = calculateMinimumGrade({
      scaleMin: 0,
      scaleMax: 5,
      currentGrade: 3.5,
      weightMode: "evaluated",
      weightPercent: 70,
      targetGrade: 4,
    });

    expect(result.status).toBe("impossible");
    expect(result.requiredGradeExact).toBeGreaterThan(5);
  });

  it("uses scale minimum for secured status in a 1-7 scale", () => {
    const result = calculateMinimumGrade({
      scaleMin: 1,
      scaleMax: 7,
      currentGrade: 6,
      weightMode: "evaluated",
      weightPercent: 80,
      targetGrade: 5,
    });

    expect(result.requiredGradeExact).toBeCloseTo(1);
    expect(result.status).toBe("secured");
    expect(result.recommendedGrade).toBe(1);
  });

  it("rounds up to tenths and integers", () => {
    const tenths = calculateMinimumGrade({
      scaleMin: 0,
      scaleMax: 10,
      currentGrade: 7.5,
      weightMode: "evaluated",
      weightPercent: 70,
      targetGrade: 8,
      roundingMode: "tenths",
    });
    const integers = calculateMinimumGrade({
      scaleMin: 0,
      scaleMax: 10,
      currentGrade: 7.5,
      weightMode: "evaluated",
      weightPercent: 70,
      targetGrade: 8,
      roundingMode: "integers",
    });

    expect(tenths.requiredGradeRounded).toBe(9.2);
    expect(integers.requiredGradeRounded).toBe(10);
  });

  it("builds useful scenarios and a copy summary", () => {
    const result = calculateMinimumGrade({
      scaleMin: 0,
      scaleMax: 10,
      currentGrade: 7.5,
      weightMode: "evaluated",
      weightPercent: 70,
      targetGrade: 8,
    });

    expect(result.scenarios.length).toBe(3);
    expect(buildMinimumGradeSummary(result)).toContain("Necesitas: 9.17");
  });
});

describe("minimum grade parsing and scale helpers", () => {
  it("parses decimal input with comma", () => {
    expect(parseMinimumGradeNumber("7,5")).toMatchObject({
      ok: true,
      value: 7.5,
    });
  });

  it("parses optional empty input as NaN", () => {
    expect(parseMinimumGradeNumber("", { required: false })).toMatchObject({
      ok: true,
      normalized: "",
    });
  });

  it("rejects too many decimals", () => {
    expect(parseMinimumGradeNumber("7.12345")).toMatchObject({
      ok: false,
      error: "too_many_decimals",
    });
  });

  it("gets grade scales from presets", () => {
    expect(getScaleFromPreset("0-10")).toEqual({ min: 0, max: 10 });
    expect(getScaleFromPreset("0-100")).toEqual({ min: 0, max: 100 });
    expect(getScaleFromPreset("custom", 1, 7)).toEqual({ min: 1, max: 7 });
  });
});
