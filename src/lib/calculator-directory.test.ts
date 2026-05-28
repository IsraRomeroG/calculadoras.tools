import { describe, expect, it } from "vitest";
import { CALCULATOR_CATEGORIES } from "./constants/calculator-categories";
import { CALCULATORS } from "./constants/calculators";
import {
  getCalculatorCategories,
  getCalculatorCategoryUrl,
  getPublishedCalculators,
} from "./calculator-directory";

describe("calculator category directory", () => {
  it("uses explicit canonical slugs for category URLs", () => {
    expect(getCalculatorCategoryUrl("legal-impuestos")).toBe(
      "/legal-impuestos",
    );
    expect(getCalculatorCategoryUrl("fecha-tiempo")).toBe("/fecha-tiempo");
  });

  it("keeps display labels separate from canonical slugs", () => {
    const categories = getCalculatorCategories(getPublishedCalculators());

    expect(categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: "legal-impuestos",
          label: "Legal e impuestos",
        }),
        expect.objectContaining({
          slug: "fecha-tiempo",
          label: "Fecha y tiempo",
        }),
      ]),
    );
    expect(categories.map((category) => category.slug)).not.toContain(
      "legal-e-impuestos",
    );
    expect(categories.map((category) => category.slug)).not.toContain(
      "fecha-y-tiempo",
    );
  });

  it("declares coherent category metadata and calculator routes", () => {
    const reservedSlugs = new Set([
      "404",
      "blog",
      "calculadora-de-edad",
      "calculadora-deficit-calorico",
      "categoria",
      "contacto",
      "privacidad",
      "robots.txt",
    ]);

    Object.entries(CALCULATOR_CATEGORIES).forEach(([slug, metadata]) => {
      expect(metadata.slug).toBe(slug);
      expect(reservedSlugs.has(slug)).toBe(false);
    });

    CALCULATORS.forEach((calculator) => {
      expect(CALCULATOR_CATEGORIES[calculator.categorySlug]).toBeDefined();
      expect(calculator.href.startsWith(`/${calculator.categorySlug}/`)).toBe(
        true,
      );
    });
  });
});
