import { describe, expect, it } from "vitest";
import {
  buildPetAgeShareUrl,
  calculateAgeInCompleteMonthsFromBirthDate,
  calculatePetHumanAge,
  getPetHumanAge,
  parsePetAgeSearchParams,
  validatePetAgeInput,
} from "./petAge";

describe("pet human age tables", () => {
  it("calculates cat anchor ages", () => {
    expect(getPetHumanAge("gato", 6)).toMatchObject({
      status: "ok",
      humanAge: 10,
    });
    expect(getPetHumanAge("gato", 12)).toMatchObject({
      status: "ok",
      humanAge: 15,
    });
    expect(getPetHumanAge("gato", 24)).toMatchObject({
      status: "ok",
      humanAge: 24,
    });
  });

  it("interpolates cat ages between published anchors", () => {
    expect(getPetHumanAge("gato", 30)).toMatchObject({
      status: "ok",
      humanAge: 26,
      interpolated: true,
    });
  });

  it("calculates dog anchor ages by adult size", () => {
    expect(getPetHumanAge("perro", 84, "pequena")).toMatchObject({
      status: "ok",
      humanAge: 44,
    });
    expect(getPetHumanAge("perro", 84, "mediana")).toMatchObject({
      status: "ok",
      humanAge: 47,
    });
    expect(getPetHumanAge("perro", 84, "grande")).toMatchObject({
      status: "ok",
      humanAge: 50,
    });
    expect(getPetHumanAge("perro", 84, "muy-grande")).toMatchObject({
      status: "ok",
      humanAge: 56,
    });
  });

  it("interpolates dog ages between anchors", () => {
    expect(getPetHumanAge("perro", 90, "mediana")).toMatchObject({
      status: "ok",
      humanAge: 49,
      lowerAnchor: { ageInMonths: 84, humanAge: 47 },
      upperAnchor: { ageInMonths: 96, humanAge: 51 },
    });
  });

  it("does not extrapolate beyond the published table", () => {
    expect(getPetHumanAge("gato", 253)).toMatchObject({
      status: "above-range",
    });
    expect(getPetHumanAge("perro", 192, "muy-grande")).toMatchObject({
      status: "ok",
      humanAge: 123,
    });
    expect(getPetHumanAge("perro", 204, "muy-grande")).toMatchObject({
      status: "above-range",
      nearestAnchor: { ageInMonths: 192, humanAge: 123 },
    });
  });

  it("does not calculate below the first published anchor", () => {
    expect(getPetHumanAge("gato", 5)).toMatchObject({
      status: "below-range",
    });
    expect(getPetHumanAge("perro", 11, "mediana")).toMatchObject({
      status: "below-range",
    });
  });
});

describe("pet age validation", () => {
  it("rejects invalid months and years", () => {
    expect(validatePetAgeInput({ species: "gato", years: -1, months: 0 })).toEqual(
      {
        ok: false,
        status: "invalid",
        message: "Los años deben ser un entero igual o mayor que 0.",
      },
    );
    expect(validatePetAgeInput({ species: "gato", years: 1, months: 12 })).toEqual(
      {
        ok: false,
        status: "invalid",
        message: "Los meses deben ser un entero entre 0 y 11.",
      },
    );
  });

  it("asks for dog size before calculating dogs", () => {
    expect(getPetHumanAge("perro", 84)).toMatchObject({
      status: "missing-dog-size",
    });
    expect(getPetHumanAge("perro", 84, "no-se")).toMatchObject({
      status: "unknown-dog-size",
    });
  });

  it("converts a birth date to complete months", () => {
    expect(
      calculateAgeInCompleteMonthsFromBirthDate(
        { year: 2020, month: 4, day: 15 },
        { year: 2026, month: 6, day: 3 },
      ),
    ).toBe(73);
    expect(
      calculateAgeInCompleteMonthsFromBirthDate(
        { year: 2020, month: 4, day: 15 },
        { year: 2026, month: 6, day: 15 },
      ),
    ).toBe(74);
  });

  it("rejects a future birth date", () => {
    expect(
      calculatePetHumanAge({
        species: "gato",
        birthDate: { year: 2026, month: 6, day: 4 },
        today: { year: 2026, month: 6, day: 3 },
      }),
    ).toMatchObject({
      status: "invalid",
    });
  });
});

describe("pet age share params", () => {
  it("parses valid query params", () => {
    const parsed = parsePetAgeSearchParams(
      new URLSearchParams(
        "especie=perro&talla=mediana&anos=7&meses=6",
      ),
    );

    expect(parsed).toMatchObject({
      species: "perro",
      dogSize: "mediana",
      years: 7,
      months: 6,
      method: "edad",
      hadInvalidParams: false,
    });
  });

  it("prioritizes a valid birth date over years and months", () => {
    const parsed = parsePetAgeSearchParams(
      new URLSearchParams("especie=gato&fecha=2020-04-15&anos=7&meses=0"),
      { year: 2026, month: 6, day: 3 },
    );

    expect(parsed).toMatchObject({
      species: "gato",
      birthDate: { year: 2020, month: 4, day: 15 },
      method: "fecha",
      hadInvalidParams: false,
    });
  });

  it("flags invalid query params without throwing", () => {
    const parsed = parsePetAgeSearchParams(
      new URLSearchParams("especie=ave&talla=gigante&anos=dos&meses=99"),
    );

    expect(parsed).toMatchObject({
      species: "perro",
      dogSize: "",
      years: undefined,
      months: 99,
      hadInvalidParams: true,
    });
  });

  it("builds share URLs with valid params", () => {
    expect(
      buildPetAgeShareUrl({
        species: "perro",
        dogSize: "mediana",
        years: 7,
        months: 6,
      }),
    ).toBe(
      "/mascotas/edad-de-mascota-en-anos-humanos/?especie=perro&talla=mediana&anos=7&meses=6",
    );
    expect(
      buildPetAgeShareUrl({
        species: "gato",
        birthDate: { year: 2020, month: 4, day: 15 },
      }),
    ).toBe(
      "/mascotas/edad-de-mascota-en-anos-humanos/?especie=gato&fecha=2020-04-15",
    );
  });
});
