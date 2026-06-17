import { describe, expect, it } from "vitest";
import {
  calculateQuadraticEquation,
  formatQuadraticEquation,
  parseQuadraticInput,
} from "./quadratic";

describe("quadratic equation calculator", () => {
  it("calculates two distinct real roots", () => {
    const result = calculateQuadraticEquation({ a: 1, b: -5, c: 6 });

    expect(result.discriminant).toBe(1);
    expect(result.solutionType).toBe("two_real_roots");
    expect(result.roots.map((root) => root.value)).toEqual([2, 3]);
    expect(result.interpretation).toContain("corta el eje X en dos puntos");
  });

  it("calculates a double real root", () => {
    const result = calculateQuadraticEquation({ a: 1, b: 2, c: 1 });

    expect(result.discriminant).toBe(0);
    expect(result.solutionType).toBe("double_real_root");
    expect(result.roots[0].value).toBe(-1);
    expect(result.interpretation).toContain("toca el eje X");
  });

  it("calculates complex roots", () => {
    const result = calculateQuadraticEquation({ a: 1, b: 0, c: 1 });

    expect(result.discriminant).toBe(-4);
    expect(result.solutionType).toBe("complex_roots");
    expect(result.roots[0].display).toBe("i");
    expect(result.roots[1].display).toBe("-i");
    expect(result.interpretation).toContain("no corta el eje X");
  });

  it("rejects a zero quadratic coefficient", () => {
    expect(() => calculateQuadraticEquation({ a: 0, b: 2, c: 1 })).toThrow(
      "El coeficiente a no puede ser cero.",
    );
  });

  it("handles decimal coefficients", () => {
    const result = calculateQuadraticEquation({ a: 0.5, b: -3, c: 4 });

    expect(result.discriminant).toBe(1);
    expect(result.roots.map((root) => root.value)).toEqual([4, 2].sort());
  });

  it("normalizes tiny negative zero values", () => {
    const result = calculateQuadraticEquation({ a: 1, b: 0, c: 0 });

    expect(result.roots[0].display).toBe("0.0000");
    expect(result.vertex.display).toBe("(0.0000, 0.0000)");
    expect(result.copyText).not.toContain("-0");
  });
});

describe("quadratic equation parsing and display", () => {
  it("accepts comma decimals", () => {
    expect(parseQuadraticInput("1,5")).toEqual({
      ok: true,
      value: 1.5,
      normalized: "1.5",
    });
  });

  it("rejects incomplete values", () => {
    expect(parseQuadraticInput("-")).toEqual({
      ok: false,
      error: "incomplete",
    });
    expect(parseQuadraticInput(",")).toEqual({
      ok: false,
      error: "incomplete",
    });
  });

  it("formats equation preview without noisy coefficients", () => {
    expect(formatQuadraticEquation(1, -5, 6)).toBe("x² - 5x + 6 = 0");
    expect(formatQuadraticEquation(-1, 1, 0)).toBe("-x² + x = 0");
  });

  it("returns exact radical form when useful", () => {
    const result = calculateQuadraticEquation({ a: 1, b: 1, c: -1 });

    expect(result.roots.some((root) => root.exact.includes("√5"))).toBe(true);
  });
});
