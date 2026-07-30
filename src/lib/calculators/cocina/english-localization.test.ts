import { describe, expect, it } from "vitest";
import {
  formatCookingDurationRange,
  formatCookingNumber,
  formatTimeOfDay,
} from "./calculadora-tiempo-coccion-por-peso/cookingTime";
import { COOKING_PRESETS_EN } from "./calculadora-tiempo-coccion-por-peso/cookingPresets.en";
import {
  COOKING_MEASURE_UNIT_METADATA_EN,
  buildCookingMeasureFormula,
  convertCookingMeasure,
  formatCookingMeasure,
  parseCookingMeasureInput,
} from "./conversor-de-medidas-culinarias/cookingMeasures";
import {
  OVEN_TEMPERATURE_UNIT_METADATA_EN,
  formatGasMark,
  formatOvenTemperature,
  getOvenRangeWarning,
} from "./conversor-de-temperatura-de-horno/ovenTemperature";
import { SAFE_TEMPERATURES_EN } from "./conversor-de-temperatura-de-horno/safeTemperatures.en";
import {
  detectPracticalWarnings,
  parsePastedIngredients,
  validateRecipeIngredient,
} from "./escalar-receta-por-porciones/recipeScaling";

describe("English cooking calculator localization", () => {
  it("formats cooking times and presets in English", () => {
    expect(
      formatCookingDurationRange({ min: 60, max: 90 }, "en"),
    ).toBe("1 h to 1 h 30 min");
    expect(
      formatTimeOfDay({ minutesOfDay: 60, dayOffset: 1 }, "en"),
    ).toBe("01:00 (+1 day)");
    expect(formatCookingNumber(1234.5, 2, "en")).toBe("1,234.5");
    expect(COOKING_PRESETS_EN[0].label).toBe("Whole roasted chicken");
  });

  it("formats cooking measurements and formulas in English", () => {
    const conversion = convertCookingMeasure(1, "cup", "ml", "metric");
    const formula = buildCookingMeasureFormula(conversion, 2, "en");

    expect(COOKING_MEASURE_UNIT_METADATA_EN.cup.label).toBe("Cup");
    expect(formatCookingMeasure(1, "cup", 2, "metric", "en")).toBe(
      "1 metric cup",
    );
    expect(parseCookingMeasureInput("1,234", "en")).toMatchObject({
      ok: true,
      interpretation: "Interpreted as 1234",
    });
    expect(formula.steps).toContain(
      "Use the formula: result = value x sourceFactor / destinationFactor.",
    );
  });

  it("formats oven data and food-safety references in English", () => {
    expect(OVEN_TEMPERATURE_UNIT_METADATA_EN.gas.label).toBe("Gas mark");
    expect(formatOvenTemperature(180, "c", 0, "en")).toBe("180 °C");
    expect(formatGasMark(null, "en")).toBe("no nearby gas mark");
    expect(
      getOvenRangeWarning({ unit: "c", value: 400 }, "en"),
    ).toContain("outside the usual range");
    expect(SAFE_TEMPERATURES_EN[0].food).toBe("Poultry");
  });

  it("parses and validates English recipe ingredients", () => {
    const parsed = parsePastedIngredients(
      "2 cups flour\nsalt to taste",
      50,
      "en",
    );

    expect(parsed.ingredients).toEqual([
      { quantity: "2", unit: "cups", name: "flour" },
      { quantity: "", unit: "to taste", name: "salt" },
    ]);
    expect(
      validateRecipeIngredient(
        { quantity: "", unit: "", name: "" },
        "en",
      ).errors,
    ).toEqual([
      "Enter the ingredient.",
      "Enter an amount or mark the row as to taste.",
    ]);
    expect(
      detectPracticalWarnings(
        { quantity: "2", unit: "", name: "eggs" },
        "en",
      )[0]?.message,
    ).toContain("before rounding eggs");
  });
});
