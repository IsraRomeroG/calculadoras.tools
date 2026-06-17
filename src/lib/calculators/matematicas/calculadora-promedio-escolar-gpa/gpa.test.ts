import { describe, expect, it } from "vitest";
import {
  buildGpaCsv,
  buildGpaSummary,
  calculateGpa,
  getScaleMaxFromPreset,
  parseGpaNumber,
} from "./gpa";

describe("school GPA calculations", () => {
  it("calculates a simple average for grades without credits", () => {
    const result = calculateGpa({
      scaleMax: 10,
      courses: [
        { name: "A", grade: 8 },
        { name: "B", grade: 9 },
        { name: "C", grade: 10 },
      ],
    });

    expect(result.simpleAverage).toBe(9);
    expect(result.weightedAverage).toBe(9);
    expect(result.totalCredits).toBe(3);
    expect(result.hasExplicitCredits).toBe(false);
    expect(result.messages[0]).toContain("no capturaste creditos");
  });

  it("calculates a weighted average when credits are present", () => {
    const result = calculateGpa({
      scaleMax: 100,
      courses: [
        { name: "Calculo", grade: 80, credits: 6 },
        { name: "Historia", grade: 100, credits: 2 },
      ],
    });

    expect(result.simpleAverage).toBe(90);
    expect(result.weightedAverage).toBe(85);
    expect(result.totalCredits).toBe(8);
    expect(result.bestCourse.name).toBe("Historia");
    expect(result.worstCourse.name).toBe("Calculo");
    expect(result.impactCourses[0].name).toBe("Calculo");
  });

  it("treats missing credits as one in weighted mode", () => {
    const result = calculateGpa({
      scaleMax: 10,
      courses: [
        { name: "A", grade: 10, credits: 3 },
        { name: "B", grade: 7 },
      ],
    });

    expect(result.weightedAverage).toBe(9.25);
    expect(result.hasMissingCreditsInWeightedMode).toBe(true);
    expect(result.messages).toContain("Las materias sin creditos se toman con peso 1.");
  });

  it("converts a 0-100 scale to approximate GPA", () => {
    const result = calculateGpa({
      scaleMax: 100,
      courses: [{ name: "A", grade: 90 }],
    });

    expect(result.gpa).toBe(3.6);
  });

  it("can omit GPA when requested", () => {
    const result = calculateGpa({
      scaleMax: 10,
      gpaMethod: "none",
      courses: [{ name: "A", grade: 9 }],
    });

    expect(result.gpa).toBeNull();
  });

  it("counts passing and failing courses when a passing grade exists", () => {
    const result = calculateGpa({
      scaleMax: 10,
      passingGrade: 6,
      courses: [
        { name: "A", grade: 5.9 },
        { name: "B", grade: 7 },
      ],
    });

    expect(result.passedCount).toBe(1);
    expect(result.failedCount).toBe(1);
    expect(result.courses[0].passed).toBe(false);
    expect(result.courses[0].gapToPassing).toBeCloseTo(-0.1);
  });

  it("calculates the gap against a target average", () => {
    const result = calculateGpa({
      scaleMax: 10,
      targetAverage: 9,
      courses: [
        { name: "A", grade: 8 },
        { name: "B", grade: 9 },
      ],
    });

    expect(result.target).toMatchObject({
      targetAverage: 9,
      gap: 0.5,
      requiredAverage: null,
      status: "needs_remaining_credits",
    });
  });

  it("calculates the required grade for remaining credits", () => {
    const result = calculateGpa({
      scaleMax: 10,
      targetAverage: 9,
      remainingCredits: 2,
      courses: [
        { name: "A", grade: 8, credits: 2 },
        { name: "B", grade: 9, credits: 2 },
      ],
    });

    expect(result.target?.requiredAverage).toBe(10);
    expect(result.target?.status).toBe("reachable");
  });

  it("marks a target as unreachable when required grade exceeds the scale", () => {
    const result = calculateGpa({
      scaleMax: 10,
      targetAverage: 9.5,
      remainingCredits: 1,
      courses: [
        { name: "A", grade: 7, credits: 2 },
        { name: "B", grade: 8, credits: 2 },
      ],
    });

    expect(result.target?.status).toBe("unreachable");
    expect(result.target?.requiredAverage).toBeGreaterThan(10);
  });

  it("marks target as met when current average already reaches it", () => {
    const result = calculateGpa({
      scaleMax: 10,
      targetAverage: 8,
      remainingCredits: 1,
      courses: [{ name: "A", grade: 9 }],
    });

    expect(result.target?.status).toBe("met");
    expect(result.target?.requiredAverage).toBeNull();
  });

  it("rejects grades outside the selected scale", () => {
    expect(() =>
      calculateGpa({
        scaleMax: 10,
        courses: [{ name: "A", grade: 12 }],
      }),
    ).toThrow("La calificacion debe estar dentro de la escala.");
  });

  it("rejects zero credits", () => {
    expect(() =>
      calculateGpa({
        scaleMax: 10,
        courses: [{ name: "A", grade: 8, credits: 0 }],
      }),
    ).toThrow("Los creditos deben ser mayores que cero.");
  });
});

describe("school GPA parsing and helpers", () => {
  it("parses decimal input with comma", () => {
    expect(parseGpaNumber("8,75")).toMatchObject({
      ok: true,
      value: 8.75,
    });
  });

  it("parses optional empty input as NaN", () => {
    expect(parseGpaNumber("", { required: false })).toMatchObject({
      ok: true,
      normalized: "",
    });
  });

  it("rejects too many decimals", () => {
    expect(parseGpaNumber("8.12345")).toMatchObject({
      ok: false,
      error: "too_many_decimals",
    });
  });

  it("gets scale max from presets", () => {
    expect(getScaleMaxFromPreset("0-10")).toBe(10);
    expect(getScaleMaxFromPreset("0-100")).toBe(100);
    expect(getScaleMaxFromPreset("0-4")).toBe(4);
    expect(getScaleMaxFromPreset("custom", 20)).toBe(20);
  });

  it("builds copy summary and CSV", () => {
    const result = calculateGpa({
      scaleMax: 10,
      passingGrade: 6,
      courses: [{ name: "Matematicas", grade: 9, credits: 3 }],
    });

    expect(buildGpaSummary(result)).toContain("Promedio ponderado: 9.00");
    expect(buildGpaCsv(result)).toContain("materia,calificacion,creditos,estado,impacto");
    expect(buildGpaCsv(result)).toContain("Matematicas,9,3,aprobada,100%");
  });
});
