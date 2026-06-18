import { describe, expect, it } from "vitest";
import {
  calculateLinearSystem2x2,
  formatLinearEquation,
  formatLinearSystemNumber,
  parseLinearSystemInput,
} from "./linearSystem2x2";

describe("linear system 2x2 calculation", () => {
  it("solves a system with one solution using Cramer determinants", () => {
    const result = calculateLinearSystem2x2({
      a1: 2,
      b1: 3,
      c1: 13,
      a2: 1,
      b2: -1,
      c2: 1,
      decimals: 4,
    });

    expect(result.status).toBe("unique_solution");
    expect(result.determinants).toEqual({ d: -5, dx: -16, dy: -11 });
    expect(result.solution?.x).toBeCloseTo(3.2);
    expect(result.solution?.y).toBeCloseTo(2.2);
    expect(result.solution?.xExact).toBe("16/5");
    expect(result.solution?.yExact).toBe("11/5");
    expect(result.verification).toContain(
      "Primera ecuacion: 2(3.2) + 3(2.2) = 13.",
    );
  });

  it("detects infinite solutions for equivalent equations", () => {
    const result = calculateLinearSystem2x2({
      a1: 1,
      b1: 1,
      c1: 2,
      a2: 2,
      b2: 2,
      c2: 4,
    });

    expect(result.status).toBe("infinite_solutions");
    expect(result.solution).toBeNull();
    expect(result.detail).toBe("same_line");
  });

  it("detects no solution for parallel lines", () => {
    const result = calculateLinearSystem2x2({
      a1: 1,
      b1: 1,
      c1: 2,
      a2: 2,
      b2: 2,
      c2: 5,
    });

    expect(result.status).toBe("no_solution");
    expect(result.solution).toBeNull();
    expect(result.detail).toBe("parallel_lines");
  });

  it("handles a true identity equation paired with a valid line", () => {
    const result = calculateLinearSystem2x2({
      a1: 1,
      b1: 1,
      c1: 2,
      a2: 0,
      b2: 0,
      c2: 0,
    });

    expect(result.status).toBe("infinite_solutions");
    expect(result.detail).toBe("second_equation_identity");
    expect(result.interpretation).toContain("todos los puntos de la otra recta");
  });

  it("handles an impossible degenerate equation", () => {
    const result = calculateLinearSystem2x2({
      a1: 1,
      b1: 1,
      c1: 2,
      a2: 0,
      b2: 0,
      c2: 5,
    });

    expect(result.status).toBe("no_solution");
    expect(result.detail).toBe("degenerate_impossible_equation");
    expect(result.steps).toContain(
      "Como al menos una ecuacion exige 0 = c con c distinto de 0, la condicion es imposible.",
    );
  });

  it("handles both equations as identities", () => {
    const result = calculateLinearSystem2x2({
      a1: 0,
      b1: 0,
      c1: 0,
      a2: 0,
      b2: 0,
      c2: 0,
    });

    expect(result.status).toBe("infinite_solutions");
    expect(result.detail).toBe("both_equations_identity");
    expect(result.interpretation).toContain("todo el plano");
  });

  it("handles both equations as impossible", () => {
    const result = calculateLinearSystem2x2({
      a1: 0,
      b1: 0,
      c1: 1,
      a2: 0,
      b2: 0,
      c2: 2,
    });

    expect(result.status).toBe("no_solution");
    expect(result.detail).toBe("degenerate_impossible_equation");
  });

  it("uses epsilon to avoid negative zero in near-zero results", () => {
    const result = calculateLinearSystem2x2({
      a1: 1,
      b1: 1,
      c1: 1,
      a2: 1,
      b2: -1,
      c2: 1,
      decimals: 4,
    });

    expect(result.solution?.y).toBe(0);
    expect(result.solution?.yDisplay).toBe("0.0000");
    expect(result.solution?.yDisplay).not.toContain("-");
  });
});

describe("linear system 2x2 parsing", () => {
  it("accepts negatives, decimal commas and grouped values", () => {
    expect(parseLinearSystemInput("-3,5")).toEqual({
      ok: true,
      value: -3.5,
      normalized: "-3.5",
    });
    expect(parseLinearSystemInput("1.000,25")).toEqual({
      ok: true,
      value: 1000.25,
      normalized: "1000.25",
    });
    expect(parseLinearSystemInput("+7")).toEqual({
      ok: true,
      value: 7,
      normalized: "+7",
    });
  });

  it("rejects empty, incomplete and invalid values", () => {
    expect(parseLinearSystemInput("")).toEqual({
      ok: false,
      error: "required",
    });
    expect(parseLinearSystemInput("-")).toEqual({
      ok: false,
      error: "incomplete",
    });
    expect(parseLinearSystemInput("x")).toEqual({
      ok: false,
      error: "invalid",
    });
  });
});

describe("linear system 2x2 formatting and copy", () => {
  it("formats equations and numbers", () => {
    expect(formatLinearEquation(2, -1, 3)).toBe("2x - y = 3");
    expect(formatLinearEquation(0, 0, 5)).toBe("0 = 5");
    expect(formatLinearSystemNumber(1234.567, 2)).toBe("1,234.57");
  });

  it("copy text includes the system, determinants, verification and procedure", () => {
    const result = calculateLinearSystem2x2({
      a1: 2,
      b1: 3,
      c1: 13,
      a2: 1,
      b2: -1,
      c2: 1,
    });

    expect(result.copyText).toContain("Sistema:");
    expect(result.copyText).toContain("D = -5");
    expect(result.copyText).toContain("Comprobacion:");
    expect(result.copyText).toContain("Procedimiento:");
  });
});
