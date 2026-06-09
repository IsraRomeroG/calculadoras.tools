import { describe, expect, it } from "vitest";
import {
  buildPetCaloriesShareUrl,
  calculateCurrentPetIntake,
  calculatePetCalories,
  calculatePetMainFoodRange,
  calculatePetMerRange,
  calculatePetRer,
  calculatePetTreatRange,
  comparePetIntakeWithMer,
  convertPetWeightToKg,
  getPetContextWarnings,
  getPetMerFactorRange,
  parsePetCaloriesSearchParams,
  parsePetDecimalInput,
  validatePetCaloriesInput,
  validatePetCurrentIntakeInput,
} from "./petCalories";

describe("pet calorie formulas", () => {
  it("converts pounds to kilograms exactly", () => {
    expect(convertPetWeightToKg(1, "lb")).toBe(0.45359237);
  });

  it("calculates RER with the AAHA formula", () => {
    expect(calculatePetRer(10)).toBeCloseTo(393.64, 2);
  });

  it("calculates a neutered dog MER range", () => {
    const rer = calculatePetRer(10);
    const merRange = calculatePetMerRange(
      rer,
      getPetMerFactorRange("perro", "esterilizado"),
    );

    expect(merRange.min).toBeCloseTo(551.1, 1);
    expect(merRange.max).toBeCloseTo(629.82, 2);
  });

  it("calculates treat and main-food ranges from MER", () => {
    const merRange = { min: 551.1, max: 629.82 };

    expect(calculatePetTreatRange(merRange).min).toBeCloseTo(55.11, 2);
    expect(calculatePetTreatRange(merRange).max).toBeCloseTo(62.98, 2);
    expect(calculatePetMainFoodRange(merRange).min).toBeCloseTo(495.99, 2);
    expect(calculatePetMainFoodRange(merRange).max).toBeCloseTo(566.84, 2);
  });

  it("uses the expected cat factors", () => {
    expect(getPetMerFactorRange("gato", "esterilizado")).toEqual({
      min: 1.2,
      max: 1.4,
    });
    expect(getPetMerFactorRange("gato", "inactivo")).toEqual({
      min: 1,
      max: 1,
    });
  });
});

describe("pet calorie validation", () => {
  it("rejects zero, negative, NaN and Infinity weights", () => {
    const base = {
      species: "perro" as const,
      unit: "kg" as const,
      profile: "esterilizado" as const,
      weightContext: "actual" as const,
      bodyCondition: "no-se" as const,
    };

    expect(validatePetCaloriesInput({ ...base, weight: 0 })).toMatchObject({
      status: "invalid",
    });
    expect(validatePetCaloriesInput({ ...base, weight: -1 })).toMatchObject({
      status: "invalid",
    });
    expect(validatePetCaloriesInput({ ...base, weight: Number.NaN })).toMatchObject({
      status: "invalid",
    });
    expect(validatePetCaloriesInput({ ...base, weight: Infinity })).toMatchObject({
      status: "invalid",
    });
  });

  it("asks to review improbable adult weights", () => {
    const base = {
      unit: "kg" as const,
      profile: "esterilizado" as const,
      weightContext: "actual" as const,
      bodyCondition: "no-se" as const,
    };

    expect(
      validatePetCaloriesInput({ ...base, species: "perro", weight: 151 }),
    ).toMatchObject({ status: "review" });
    expect(
      validatePetCaloriesInput({ ...base, species: "gato", weight: 26 }),
    ).toMatchObject({ status: "review" });
    expect(
      validatePetCaloriesInput({ ...base, species: "gato", weight: 0.4 }),
    ).toMatchObject({ status: "review" });
  });

  it("does not calculate out-of-scope cases", () => {
    expect(
      calculatePetCalories({
        species: "perro",
        weight: 10,
        unit: "kg",
        profile: "esterilizado",
        weightContext: "actual",
        bodyCondition: "ideal",
        specialCases: ["cachorro"],
      }),
    ).toMatchObject({ status: "out-of-scope" });
  });

  it("rejects invalid current intake values", () => {
    expect(
      validatePetCurrentIntakeInput({ foodCalories: -1 }),
    ).toMatchObject({ status: "invalid" });
    expect(
      validatePetCurrentIntakeInput({ treatCalories: Number.NaN }),
    ).toMatchObject({ status: "invalid" });
    expect(
      validatePetCurrentIntakeInput({ foodCalories: Infinity }),
    ).toMatchObject({ status: "invalid" });
  });
});

describe("pet intake comparison", () => {
  it("sums optional current intake fields", () => {
    expect(calculateCurrentPetIntake()).toBeUndefined();
    expect(calculateCurrentPetIntake(500)).toBe(500);
    expect(calculateCurrentPetIntake(undefined, 50)).toBe(50);
    expect(calculateCurrentPetIntake(500, 50)).toBe(550);
  });

  it("classifies current intake against MER", () => {
    const merRange = { min: 551, max: 630 };

    expect(comparePetIntakeWithMer(500, merRange)).toBe("below-range");
    expect(comparePetIntakeWithMer(600, merRange)).toBe("within-range");
    expect(comparePetIntakeWithMer(720, merRange)).toBe("above-range");
  });

  it("includes comparison in the full result", () => {
    const result = calculatePetCalories({
      species: "perro",
      weight: 10,
      unit: "kg",
      profile: "esterilizado",
      weightContext: "actual",
      bodyCondition: "ideal",
      foodCalories: 680,
      treatCalories: 40,
    });

    expect(result).toMatchObject({
      status: "ok",
      intakeComparison: {
        totalCalories: 720,
        status: "above-range",
      },
    });
  });
});

describe("pet calorie parsing and share params", () => {
  it("accepts point and comma decimals", () => {
    expect(parsePetDecimalInput("4.5")).toBe(4.5);
    expect(parsePetDecimalInput("4,5")).toBe(4.5);
    expect(parsePetDecimalInput("abc")).toBeNaN();
  });

  it("parses valid query params", () => {
    const parsed = parsePetCaloriesSearchParams(
      new URLSearchParams(
        "especie=gato&peso=4,5&unidad=kg&perfil=inactivo&tipoPeso=ideal&condicion=sobrepeso&caloriasAlimento=180&caloriasPremios=20",
      ),
    );

    expect(parsed).toMatchObject({
      species: "gato",
      weight: 4.5,
      unit: "kg",
      profile: "inactivo",
      weightContext: "ideal",
      bodyCondition: "sobrepeso",
      foodCalories: 180,
      treatCalories: 20,
      hadInvalidParams: false,
    });
  });

  it("flags invalid query params without throwing", () => {
    const parsed = parsePetCaloriesSearchParams(
      new URLSearchParams(
        "especie=ave&peso=no&unidad=oz&perfil=alto&tipoPeso=raro&condicion=otra&casoEspecial=otro",
      ),
    );

    expect(parsed).toMatchObject({
      species: "perro",
      weight: undefined,
      unit: "kg",
      profile: "esterilizado",
      weightContext: "actual",
      bodyCondition: "no-se",
      specialCases: [],
      hadInvalidParams: true,
    });
  });

  it("builds share URLs with valid params", () => {
    expect(
      buildPetCaloriesShareUrl({
        species: "perro",
        weight: 10,
        unit: "kg",
        profile: "esterilizado",
        weightContext: "actual",
        bodyCondition: "no-se",
      }),
    ).toBe(
      "/mascotas/calorias-diarias-para-perro-o-gato/?especie=perro&unidad=kg&perfil=esterilizado&tipoPeso=actual&condicion=no-se&peso=10",
    );
  });
});

describe("pet calorie contextual warnings", () => {
  it("generates warnings for weight context and body condition", () => {
    const warnings = getPetContextWarnings({
      species: "gato",
      weight: 4,
      unit: "kg",
      profile: "inactivo",
      weightContext: "ideal",
      bodyCondition: "sobrepeso",
    });

    expect(warnings).toEqual(
      expect.arrayContaining([
        expect.stringContaining("peso ideal"),
        expect.stringContaining("perdida de peso"),
        expect.stringContaining("extremo bajo"),
      ]),
    );
  });
});
