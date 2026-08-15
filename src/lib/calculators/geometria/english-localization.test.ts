import { describe, expect, it } from "vitest";
import {
  MEASUREMENT_UNIT_METADATA,
  formatAreaMeasurement,
  getRegularPolygonName,
} from "./calculadora-de-area-y-perimetro/areaPerimeter.en";
import {
  AREA_PERIMETER_TRIANGLE_URL,
  PYTHAGOREAN_CANONICAL,
  buildAreaPerimeterUrl,
  buildPythagoreanExplanation,
  buildPythagoreanShareUrl,
} from "./calculadora-del-teorema-de-pitagoras/pythagoreanTheorem.en";

describe("English geometry calculator localization", () => {
  it("uses English measurement labels and number formatting", () => {
    expect(MEASUREMENT_UNIT_METADATA.none.label).toBe("No unit");
    expect(MEASUREMENT_UNIT_METADATA.in.label).toBe("Inches");
    expect(formatAreaMeasurement(1234.5, "ft", 1)).toBe("1,234.5 ft²");
    expect(getRegularPolygonName(6)).toBe("Regular hexagon");
  });

  it("builds English Pythagorean explanations", () => {
    const explanation = buildPythagoreanExplanation(
      "hypotenuse",
      { a: 3, b: 4 },
      5,
      { unit: "cm", decimals: 2 },
    );

    expect(explanation.resultLabel).toBe("Hypotenuse");
    expect(explanation.verification[0]).toContain("Check:");
    expect(explanation.copyText).toContain("Pythagorean theorem");
  });

  it("keeps shared links inside the English geometry routes", () => {
    expect(PYTHAGOREAN_CANONICAL).toBe(
      "/en/geometry/pythagorean-theorem-calculator",
    );
    expect(AREA_PERIMETER_TRIANGLE_URL).toBe(
      "/en/geometry/area-perimeter-calculator",
    );
    expect(
      buildPythagoreanShareUrl({ mode: "hypotenuse", a: 3, b: 4 }),
    ).toBe(
      "/en/geometry/pythagorean-theorem-calculator?calculate=hypotenuse&a=3&b=4",
    );
    expect(buildAreaPerimeterUrl({ a: 3, b: 4, c: 5 })).toBe(
      "/en/geometry/area-perimeter-calculator?shape=triangle&mode=three-sides&a=3&b=4&c=5",
    );
  });
});
