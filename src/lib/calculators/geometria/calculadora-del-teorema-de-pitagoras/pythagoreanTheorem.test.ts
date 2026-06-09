import { describe, expect, it } from "vitest";
import {
  PYTHAGOREAN_PRESETS,
  buildAreaPerimeterUrl,
  buildPythagoreanExplanation,
  buildPythagoreanShareUrl,
  calculateHypotenuse,
  calculateMissingLeg,
  formatLength,
  parseLengthInput,
  validateHypotenuseAndLeg,
  validatePositiveLength,
} from "./pythagoreanTheorem";

describe("pythagorean theorem formulas", () => {
  it("calculates the hypotenuse from two legs", () => {
    expect(calculateHypotenuse(3, 4)).toBe(5);
    expect(calculateHypotenuse(5, 12)).toBe(13);
  });

  it("calculates the missing leg from the hypotenuse and known leg", () => {
    expect(calculateMissingLeg(13, 5)).toBe(12);
    expect(calculateMissingLeg(5, 4)).toBe(3);
  });

  it("keeps decimal precision before formatting", () => {
    expect(calculateHypotenuse(1.5, 2.5)).toBeCloseTo(
      Math.sqrt(1.5 ** 2 + 2.5 ** 2),
      12,
    );
  });

  it("rejects non-positive and non-finite lengths", () => {
    expect(() => calculateHypotenuse(0, 4)).toThrow(/mayor que cero/);
    expect(() => calculateHypotenuse(-3, 4)).toThrow(/mayor que cero/);
    expect(() => calculateHypotenuse(Number.NaN, 4)).toThrow(/finito/);
    expect(() => calculateHypotenuse(Number.POSITIVE_INFINITY, 4)).toThrow(
      /finito/,
    );
  });

  it("rejects a hypotenuse that is not larger than the known leg", () => {
    expect(validateHypotenuseAndLeg(4, 5)).toEqual({
      ok: false,
      error: "not_larger",
    });
    expect(validateHypotenuseAndLeg(5, 5)).toEqual({
      ok: false,
      error: "not_larger",
    });
    expect(() => calculateMissingLeg(4, 5)).toThrow(/hipotenusa/);
    expect(() => calculateMissingLeg(5, 5)).toThrow(/hipotenusa/);
  });

  it("validates positive lengths", () => {
    expect(validatePositiveLength(7)).toEqual({ ok: true, value: 7 });
    expect(validatePositiveLength(0)).toEqual({
      ok: false,
      error: "non_positive",
    });
  });
});

describe("pythagorean parsing and formatting", () => {
  it("accepts decimal points, comma decimals, and grouping separators", () => {
    expect(parseLengthInput("3.5")).toEqual({
      ok: true,
      value: 3.5,
      normalized: "3.5",
    });
    expect(parseLengthInput("3,5")).toEqual({
      ok: true,
      value: 3.5,
      normalized: "3.5",
    });
    expect(parseLengthInput("1,000")).toEqual({
      ok: true,
      value: 1000,
      normalized: "1000",
    });
    expect(parseLengthInput("1.000,5")).toEqual({
      ok: true,
      value: 1000.5,
      normalized: "1000.5",
    });
  });

  it("formats physical and unitless lengths", () => {
    expect(formatLength(5, "cm", 0)).toBe("5 cm");
    expect(formatLength(5)).toBe("5 unidades");
  });
});

describe("pythagorean explanations", () => {
  it("uses the active formula for hypotenuse mode", () => {
    const explanation = buildPythagoreanExplanation(
      "hypotenuse",
      { a: 3, b: 4 },
      5,
      { unit: "cm", decimals: 0 },
    );

    expect(explanation.formula).toBe("c = √(a² + b²)");
    expect(explanation.substitution).toBe("c = √(3² + 4²)");
    expect(explanation.operation).toBe("c = √25");
    expect(explanation.result).toBe("c = 5 cm");
    expect(explanation.verification.join(" ")).toContain("=");
  });

  it("uses the active formula for missing leg mode", () => {
    const explanation = buildPythagoreanExplanation(
      "leg",
      { c: 13, a: 5 },
      12,
      { unit: "m", decimals: 0 },
    );

    expect(explanation.formula).toBe("b = √(c² - a²)");
    expect(explanation.substitution).toBe("b = √(13² - 5²)");
    expect(explanation.operation).toBe("b = √144");
    expect(explanation.result).toBe("b = 12 m");
  });

  it("marks verification as approximate when the displayed result is rounded", () => {
    const result = Math.sqrt(13);
    const explanation = buildPythagoreanExplanation(
      "hypotenuse",
      { a: 2, b: 3 },
      result,
      { decimals: 2 },
    );

    expect(explanation.isApproximate).toBe(true);
    expect(explanation.verification.join(" ")).toContain("≈");
  });
});

describe("pythagorean URLs and presets", () => {
  it("defines frequent pythagorean triples as presets", () => {
    expect(PYTHAGOREAN_PRESETS).toContainEqual({ a: 3, b: 4, c: 5 });
    expect(PYTHAGOREAN_PRESETS).toContainEqual({ a: 5, b: 12, c: 13 });
  });

  it("builds share URLs with mode, values, unit and decimals", () => {
    expect(
      buildPythagoreanShareUrl({
        mode: "hypotenuse",
        a: 3,
        b: 4,
        unit: "cm",
        decimals: 2,
      }),
    ).toBe(
      "/geometria/calculadora-del-teorema-de-pitagoras/?calcular=hipotenusa&a=3&b=4&unidad=cm&decimales=2",
    );

    expect(
      buildPythagoreanShareUrl({
        mode: "leg",
        c: 13,
        a: 5,
        unit: "m",
      }),
    ).toBe(
      "/geometria/calculadora-del-teorema-de-pitagoras/?calcular=cateto&c=13&a=5&unidad=m",
    );
  });

  it("builds the prefilled area and perimeter URL", () => {
    expect(
      buildAreaPerimeterUrl({
        a: 3,
        b: 4,
        c: 5,
        unit: "cm",
        decimals: 2,
      }),
    ).toBe(
      "/geometria/calculadora-de-area-y-perimetro/?figura=triangulo&modo=tres-lados&a=3&b=4&c=5&unidad=cm&decimales=2",
    );
  });
});
