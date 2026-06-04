import { describe, expect, it } from "vitest";
import {
  approximateCookingFraction,
  calculateRecipeScaleFactor,
  detectPracticalWarnings,
  formatRecipeQuantity,
  parsePastedIngredientLine,
  parsePastedIngredients,
  parseRecipeQuantity,
  scaleIngredientQuantity,
  validateRecipeIngredient,
} from "./recipeScaling";

describe("recipe scaling factor", () => {
  it("calculates the expected factor", () => {
    expect(calculateRecipeScaleFactor(4, 10)).toBe(2.5);
    expect(calculateRecipeScaleFactor(8, 4)).toBe(0.5);
  });

  it("rejects invalid servings", () => {
    expect(() => calculateRecipeScaleFactor(0, 4)).toThrow("positivo");
    expect(() => calculateRecipeScaleFactor(-1, 4)).toThrow("positivo");
    expect(() => calculateRecipeScaleFactor(Number.NaN, 4)).toThrow("positivo");
    expect(() => calculateRecipeScaleFactor(Number.POSITIVE_INFINITY, 4)).toThrow(
      "positivo",
    );
  });
});

describe("recipe quantity parsing", () => {
  it("accepts integers, decimals, commas, fractions and mixed numbers", () => {
    expect(parseRecipeQuantity("2")).toEqual({
      ok: true,
      value: 2,
      normalized: "2",
    });
    expect(parseRecipeQuantity("2.5")).toEqual({
      ok: true,
      value: 2.5,
      normalized: "2.5",
    });
    expect(parseRecipeQuantity("2,5")).toEqual({
      ok: true,
      value: 2.5,
      normalized: "2.5",
    });
    expect(parseRecipeQuantity("1/2")).toEqual({
      ok: true,
      value: 0.5,
      normalized: "0.5",
    });
    expect(parseRecipeQuantity("1 / 2")).toEqual({
      ok: true,
      value: 0.5,
      normalized: "0.5",
    });
    expect(parseRecipeQuantity("1 1/2")).toEqual({
      ok: true,
      value: 1.5,
      normalized: "1.5",
    });
  });

  it("rejects invalid quantities", () => {
    expect(parseRecipeQuantity("")).toEqual({ ok: false, error: "empty" });
    expect(parseRecipeQuantity("2,")).toEqual({
      ok: false,
      error: "incomplete",
    });
    expect(parseRecipeQuantity("-1")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseRecipeQuantity("1/0")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseRecipeQuantity("NaN")).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(parseRecipeQuantity("Infinity")).toEqual({
      ok: false,
      error: "invalid",
    });
  });
});

describe("recipe quantity scaling and formatting", () => {
  it("scales fractions and mixed numbers", () => {
    expect(scaleIngredientQuantity("1/2", 3)).toBe(1.5);
    expect(scaleIngredientQuantity("1 1/2", 2)).toBe(3);
  });

  it("formats practical cooking fractions", () => {
    expect(formatRecipeQuantity(1.5, "fraction")).toBe("1 1/2");
    expect(formatRecipeQuantity(1.5, "decimal")).toBe("1.5");
    expect(formatRecipeQuantity(1.5, "both")).toBe("1.5 (1 1/2)");
    expect(approximateCookingFraction(2 / 3)?.text).toBe("2/3");
    expect(approximateCookingFraction(1 / 6)?.text).toBe("1/6");
    expect(approximateCookingFraction(5 / 12)?.text).toBe("5/12");
  });
});

describe("recipe ingredient validation", () => {
  it("preserves taste-only rows", () => {
    expect(
      validateRecipeIngredient({
        quantity: "",
        unit: "al gusto",
        name: "sal",
      }),
    ).toEqual({
      valid: true,
      errors: [],
      isTasteOnly: true,
    });
  });

  it("does not silently round eggs", () => {
    expect(formatRecipeQuantity(scaleIngredientQuantity("1", 1.5))).toBe(
      "1 1/2",
    );
  });

  it("marks empty ingredient names invalid without blocking editing", () => {
    const validation = validateRecipeIngredient({
      quantity: "1",
      unit: "taza",
      name: "",
    });

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain("Escribe el ingrediente.");
  });
});

describe("pasted ingredients", () => {
  it("parses simple pasted lines", () => {
    expect(parsePastedIngredientLine("2 tazas harina")).toEqual({
      quantity: "2",
      unit: "tazas",
      name: "harina",
    });
    expect(parsePastedIngredientLine("2 tazas de harina")).toEqual({
      quantity: "2",
      unit: "tazas",
      name: "harina",
    });
    expect(parsePastedIngredientLine("1/2 cucharadita sal")).toEqual({
      quantity: "1/2",
      unit: "cucharadita",
      name: "sal",
    });
    expect(parsePastedIngredientLine("3 huevos")).toEqual({
      quantity: "3",
      unit: "",
      name: "huevos",
    });
    expect(parsePastedIngredientLine("sal al gusto")).toEqual({
      quantity: "",
      unit: "al gusto",
      name: "sal",
    });
  });

  it("keeps unrecognized pasted lines editable", () => {
    expect(parsePastedIngredientLine("para la salsa")).toEqual({
      quantity: "",
      unit: "",
      name: "para la salsa",
    });
  });

  it("respects pasted ingredient limits", () => {
    const result = parsePastedIngredients(
      ["1 taza harina", "2 huevos", "sal al gusto"].join("\n"),
      2,
    );

    expect(result.ingredients).toHaveLength(2);
    expect(result.truncatedCount).toBe(1);
  });
});

describe("practical warnings", () => {
  it("detects practical warnings without changing quantities", () => {
    expect(detectPracticalWarnings("2 huevos")).toEqual([
      {
        term: "huevo",
        message: "Revisa antes de redondear huevos o piezas enteras.",
      },
    ]);
    expect(detectPracticalWarnings("1 cucharadita sal")[0]?.term).toBe("sal");
  });
});
