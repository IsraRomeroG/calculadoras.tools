import { describe, expect, it } from "vitest";
import {
  CATEGORIES,
  CATEGORY_SLUGS,
  getCategoryByLabel,
  getCategoryBySlugOrLegacySlug,
} from "./constants/categories";
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
    expect(getCalculatorCategoryUrl("probabilidad-estadistica")).toBe(
      "/probabilidad-estadistica",
    );
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
        expect.objectContaining({
          slug: "probabilidad-estadistica",
          label: "Probabilidad y estadística",
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

    Object.entries(CATEGORIES).forEach(([slug, metadata]) => {
      expect(metadata.slug).toBe(slug);
      expect(reservedSlugs.has(slug)).toBe(false);
    });

    CALCULATORS.forEach((calculator) => {
      expect(CATEGORIES[calculator.categorySlug]).toBeDefined();
      expect(CATEGORIES[calculator.categorySlug].description).toBeTruthy();
      expect(calculator.href.startsWith(`/${calculator.categorySlug}/`)).toBe(
        true,
      );
    });
  });

  it("keeps shared category labels and legacy slugs coherent", () => {
    const labels = new Set<string>();
    const routeSlugs = new Set<string>();
    const reservedBlogSlugs = new Set(["categoria", "pagina"]);

    CATEGORY_SLUGS.forEach((slug) => {
      const category = CATEGORIES[slug];

      expect(category.slug).toBe(slug);
      expect(labels.has(category.label)).toBe(false);
      labels.add(category.label);

      expect(routeSlugs.has(category.slug)).toBe(false);
      expect(reservedBlogSlugs.has(category.slug)).toBe(false);
      routeSlugs.add(category.slug);

      category.legacySlugs?.forEach((legacySlug) => {
        expect(routeSlugs.has(legacySlug)).toBe(false);
        expect(reservedBlogSlugs.has(legacySlug)).toBe(false);
        routeSlugs.add(legacySlug);
      });
    });

    expect(getCategoryByLabel("Legal e impuestos")?.slug).toBe(
      "legal-impuestos",
    );
    expect(getCategoryByLabel("Fecha y tiempo")?.slug).toBe("fecha-tiempo");
    expect(getCategoryByLabel("Restaurantes")?.slug).toBe("restaurantes");
    expect(getCategoryByLabel("Probabilidad y estadística")?.slug).toBe(
      "probabilidad-estadistica",
    );
    expect(getCategoryBySlugOrLegacySlug("legal-e-impuestos")?.slug).toBe(
      "legal-impuestos",
    );
    expect(getCategoryBySlugOrLegacySlug("fecha-y-tiempo")?.slug).toBe(
      "fecha-tiempo",
    );
    expect(getCategoryBySlugOrLegacySlug("eventos-sociales")?.slug).toBe(
      "restaurantes",
    );
  });
});
