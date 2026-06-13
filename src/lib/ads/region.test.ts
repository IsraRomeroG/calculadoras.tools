import { describe, expect, it } from "vitest";
import { getConsentRequirementFromRegion } from "./region";

describe("regional advertising consent", () => {
  it("requires consent for European visitors", () => {
    expect(getConsentRequirementFromRegion({ continent_code: "EU" })).toBe(
      "required",
    );
  });

  it.each(["NA", "SA", "AS", "AF", "OC", "AN"])(
    "does not require consent for continent %s",
    (continentCode) => {
      expect(
        getConsentRequirementFromRegion({ continent_code: continentCode }),
      ).toBe("not-required");
    },
  );

  it("requires consent when the regional response is invalid", () => {
    expect(getConsentRequirementFromRegion({})).toBe("required");
  });
});
