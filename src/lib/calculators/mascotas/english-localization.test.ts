import { describe, expect, it } from "vitest";

import {
  PET_PROFILE_LABELS,
  buildPetCaloriesShareUrl,
  calculatePetCalories,
} from "./calorias-diarias-para-perro-o-gato/petCalories.en";
import {
  DOG_SIZE_TABLE_LABELS,
  PET_SOURCE_LABEL,
  buildPetAgeShareUrl,
  calculatePetHumanAge,
} from "./edad-de-mascota-en-anos-humanos/petAge.en";

describe("English pet calculator localization", () => {
  it("uses English calorie labels, copy and share parameters", () => {
    const result = calculatePetCalories({
      species: "perro",
      weight: 10,
      unit: "kg",
      profile: "esterilizado",
      weightContext: "ideal",
      bodyCondition: "ideal",
    });

    expect(PET_PROFILE_LABELS.esterilizado).toBe("Spayed or neutered");
    expect(result.status).toBe("ok");

    if (result.status === "ok") {
      expect(result.copyText).toContain("Daily calories for your dog");
      expect(result.copyText).toContain("Estimated maintenance:");
    }

    expect(
      buildPetCaloriesShareUrl({
        species: "gato",
        weight: 5,
        unit: "kg",
        profile: "esterilizado",
        weightContext: "actual",
        bodyCondition: "ideal",
      }),
    ).toContain("?species=gato&unit=kg&profile=");
  });

  it("uses English pet-age labels, copy and share parameters", () => {
    const result = calculatePetHumanAge({
      species: "perro",
      dogSize: "mediana",
      years: 7,
      months: 0,
    });

    expect(DOG_SIZE_TABLE_LABELS.mediana).toBe("Medium dog");
    expect(PET_SOURCE_LABEL).toContain("veterinary reference table");
    expect(result.status).toBe("ok");

    if (result.status === "ok") {
      expect(result.copyText).toContain("Pet age in human years");
      expect(result.copyText).toContain("Actual age: 7 years");
    }

    expect(
      buildPetAgeShareUrl({
        species: "perro",
        dogSize: "mediana",
        years: 7,
        months: 0,
      }),
    ).toContain("?species=perro&size=mediana&years=7&months=0");
  });
});
