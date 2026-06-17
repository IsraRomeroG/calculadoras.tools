import { describe, expect, it } from "vitest";
import {
  buildWeightedGradeCsv,
  buildWeightedGradeSummary,
  calculateWeightedGrade,
  getWeightedGradeScaleMaxFromPreset,
  parseWeightedGradeNumber,
} from "./weightedGrade";

describe("weighted grade calculator", () => {
  it("calculates a complete weighted grade", () => {
    const result = calculateWeightedGrade({
      scaleMax: 10,
      evaluations: [
        { name: "Tareas", status: "graded", grade: 9, weightPercent: 30 },
        { name: "Examen", status: "graded", grade: 8, weightPercent: 40 },
        { name: "Proyecto", status: "graded", grade: 10, weightPercent: 30 },
      ],
    });

    expect(result.accumulatedGrade).toBeCloseTo(8.9);
    expect(result.evaluatedAverage).toBeCloseTo(8.9);
    expect(result.weightState).toBe("complete");
    expect(result.weightAssignedPercent).toBe(100);
  });

  it("shows unassigned weight when total weight is under 100 percent", () => {
    const result = calculateWeightedGrade({
      scaleMax: 10,
      evaluations: [
        { name: "Tareas", status: "graded", grade: 9, weightPercent: 30 },
        { name: "Examen", status: "graded", grade: 8, weightPercent: 50 },
      ],
    });

    expect(result.weightState).toBe("under");
    expect(result.weightUnassignedPercent).toBeCloseTo(20);
    expect(result.messages[0]).toContain("Falta asignar 20%");
  });

  it("shows excess weight when total weight is over 100 percent", () => {
    const result = calculateWeightedGrade({
      scaleMax: 10,
      evaluations: [
        { name: "Tareas", status: "graded", grade: 9, weightPercent: 60 },
        { name: "Examen", status: "graded", grade: 8, weightPercent: 60 },
      ],
    });

    expect(result.weightState).toBe("over");
    expect(result.weightExcessPercent).toBeCloseTo(20);
  });

  it("calculates evaluated average when only part of the course is graded", () => {
    const result = calculateWeightedGrade({
      scaleMax: 10,
      evaluations: [
        { name: "Tareas", status: "graded", grade: 9, weightPercent: 30 },
        { name: "Final", status: "pending", weightPercent: 70 },
      ],
    });

    expect(result.accumulatedGrade).toBeCloseTo(2.7);
    expect(result.evaluatedAverage).toBeCloseTo(9);
    expect(result.weightEvaluatedPercent).toBe(30);
    expect(result.weightRemainingEvaluablePercent).toBe(70);
  });

  it("calculates projected grade from pending estimates", () => {
    const result = calculateWeightedGrade({
      scaleMax: 10,
      evaluations: [
        { name: "Tareas", status: "graded", grade: 8, weightPercent: 50 },
        {
          name: "Proyecto",
          status: "pending",
          estimatedGrade: 9,
          weightPercent: 50,
        },
      ],
    });

    expect(result.projectedGrade).toBeCloseTo(8.5);
    expect(result.evaluations[1].projectedContribution).toBeCloseTo(4.5);
  });

  it("calculates required average for a target grade", () => {
    const result = calculateWeightedGrade({
      scaleMax: 10,
      targetGrade: 8,
      evaluations: [
        { name: "Evaluado", status: "graded", grade: 8.125, weightPercent: 80 },
        { name: "Pendiente", status: "pending", weightPercent: 20 },
      ],
    });

    expect(result.accumulatedGrade).toBeCloseTo(6.5);
    expect(result.goal?.requiredAverage).toBeCloseTo(7.5);
    expect(result.goal?.status).toBe("reachable");
  });

  it("marks a target as unreachable when required average exceeds the scale", () => {
    const result = calculateWeightedGrade({
      scaleMax: 10,
      targetGrade: 9.5,
      evaluations: [
        { name: "Evaluado", status: "graded", grade: 7, weightPercent: 80 },
        { name: "Pendiente", status: "pending", weightPercent: 20 },
      ],
    });

    expect(result.goal?.status).toBe("unreachable");
    expect(result.goal?.requiredAverage).toBeGreaterThan(10);
  });

  it("marks a target as secured when current accumulated grade is enough", () => {
    const result = calculateWeightedGrade({
      scaleMax: 10,
      targetGrade: 7,
      evaluations: [
        { name: "Evaluado", status: "graded", grade: 9, weightPercent: 90 },
        { name: "Pendiente", status: "pending", weightPercent: 10 },
      ],
    });

    expect(result.goal?.status).toBe("secured");
    expect(result.goal?.requiredAverage).toBeLessThanOrEqual(0);
  });

  it("treats 33.33 + 33.33 + 33.34 as complete", () => {
    const result = calculateWeightedGrade({
      scaleMax: 10,
      evaluations: [
        { name: "A", status: "graded", grade: 8, weightPercent: 33.33 },
        { name: "B", status: "graded", grade: 9, weightPercent: 33.33 },
        { name: "C", status: "graded", grade: 10, weightPercent: 33.34 },
      ],
    });

    expect(result.weightState).toBe("complete");
    expect(result.weightAssignedPercent).toBe(100);
  });

  it("rejects a grade outside the selected scale", () => {
    expect(() =>
      calculateWeightedGrade({
        scaleMax: 10,
        evaluations: [
          { name: "Tareas", status: "graded", grade: 12, weightPercent: 50 },
        ],
      }),
    ).toThrow("La calificacion debe estar dentro de la escala.");
  });

  it("allows zero weight but reports it on the evaluation", () => {
    const result = calculateWeightedGrade({
      scaleMax: 10,
      evaluations: [
        { name: "Diagnostico", status: "graded", grade: 10, weightPercent: 0 },
        { name: "Final", status: "graded", grade: 8, weightPercent: 100 },
      ],
    });

    expect(result.evaluations[0].message).toContain("peso es 0%");
    expect(result.accumulatedGrade).toBe(8);
  });

  it("builds copy summary and CSV", () => {
    const result = calculateWeightedGrade({
      scaleMax: 10,
      targetGrade: 8,
      evaluations: [
        { name: "Tareas", status: "graded", grade: 9, weightPercent: 30 },
        { name: "Final", status: "pending", estimatedGrade: 8, weightPercent: 70 },
      ],
    });

    expect(buildWeightedGradeSummary(result)).toContain(
      "Calificacion acumulada: 2.70",
    );
    expect(buildWeightedGradeCsv(result)).toContain(
      "evaluacion,estado,calificacion,estimada,peso,aporte",
    );
    expect(buildWeightedGradeCsv(result)).toContain("Tareas,calificada,9,,30%,2.7");
  });
});

describe("weighted grade parsing and helpers", () => {
  it("parses decimal input with comma", () => {
    expect(parseWeightedGradeNumber("8,75")).toMatchObject({
      ok: true,
      value: 8.75,
    });
  });

  it("parses optional empty input as NaN", () => {
    expect(parseWeightedGradeNumber("", { required: false })).toMatchObject({
      ok: true,
      normalized: "",
    });
  });

  it("rejects too many decimals", () => {
    expect(parseWeightedGradeNumber("8.12345")).toMatchObject({
      ok: false,
      error: "too_many_decimals",
    });
  });

  it("gets scale max from presets", () => {
    expect(getWeightedGradeScaleMaxFromPreset("0-10")).toBe(10);
    expect(getWeightedGradeScaleMaxFromPreset("0-100")).toBe(100);
    expect(getWeightedGradeScaleMaxFromPreset("custom", 20)).toBe(20);
  });
});
