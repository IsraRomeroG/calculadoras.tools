import { describe, expect, it } from "vitest";
import {
  CATEGORIES,
  CATEGORY_DEFINITIONS,
  CATEGORY_SLUGS,
  getCategoryByLabel,
  getCategoryBySlugOrLegacySlug,
} from "./constants/categories";
import { CALCULATOR_DEFINITIONS, CALCULATORS } from "./constants/calculators";
import {
  getCalculatorCategories,
  getCalculatorCategoryUrl,
  getCalculatorUrl,
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
    expect(getCalculatorCategoryUrl("eventos")).toBe("/eventos");
    expect(getCalculatorCategoryUrl("matematicas", "en")).toBe("/en/math");
    expect(getCalculatorCategoryUrl("finanzas", "en")).toBeNull();
  });

  it("keeps the English pilot category URL without a trailing slash", () => {
    expect(getCalculatorCategoryUrl("matematicas", "en")).toBe("/en/math");
  });

  it("keeps the Spanish percentage calculator route and creates the English pilot route", () => {
    const percentageCalculator = CALCULATOR_DEFINITIONS.find(
      (calculator) => calculator.id === "calculadora-de-porcentajes",
    );

    expect(percentageCalculator).toBeDefined();
    expect(getCalculatorUrl(percentageCalculator!, "es")).toBe(
      "/matematicas/calculadora-de-porcentajes",
    );
    expect(getCalculatorUrl(percentageCalculator!, "en")).toBe(
      "/en/math/percentage-calculator",
    );
  });

  it("publishes only reviewed English calculator metadata", () => {
    const englishCalculators = getPublishedCalculators("en");

    expect(englishCalculators).toEqual([
      expect.objectContaining({
        id: "calculadora-de-porcentajes",
        title: "Percentage calculator",
        href: "/en/math/percentage-calculator",
        categoryId: "matematicas",
      }),
    ]);

    expect(
      englishCalculators.map((calculator) => calculator.id),
    ).not.toContain("calculadora-de-regla-de-tres");
  });

  it("groups English calculators only under localized published categories", () => {
    const categories = getCalculatorCategories(
      getPublishedCalculators("en"),
      "en",
    );

    expect(categories).toEqual([
      expect.objectContaining({
        id: "matematicas",
        slug: "math",
        label: "Math",
        count: 1,
      }),
    ]);
    expect(categories.map((category) => category.id)).not.toContain("finanzas");
  });

  it("lists all published legal and tax calculators", () => {
    const legalCalculators = getPublishedCalculators().filter(
      (calculator) => calculator.categoryId === "legal-impuestos",
    );

    expect(legalCalculators.map((calculator) => calculator.id)).toEqual([
      "calculadora-de-iva",
      "calculadora-isr-irpf",
      "calculadora-salario-neto",
    ]);
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
        expect.objectContaining({
          slug: "programacion",
          label: "Programación",
        }),
        expect.objectContaining({
          slug: "eventos",
          label: "Eventos",
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
      "en",
      "pagina",
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

    CALCULATOR_DEFINITIONS.forEach((calculator) => {
      expect("href" in calculator).toBe(false);
      expect(CATEGORIES[calculator.categoryId]).toBeDefined();
      expect(calculator.locales.es?.published).toBe(!calculator.draft);
    });
  });

  it("keeps localized category and calculator slugs unique", () => {
    const reservedSlugs = new Set([
      "404",
      "blog",
      "categoria",
      "contacto",
      "en",
      "pagina",
      "privacidad",
      "robots.txt",
    ]);
    const categorySlugsByLocale = new Map<string, string>();
    const calculatorSlugsByLocaleAndCategory = new Map<string, string>();

    Object.values(CATEGORY_DEFINITIONS).forEach((definition) => {
      Object.entries(definition.locales).forEach(([locale, metadata]) => {
        expect(metadata).toBeDefined();
        expect(reservedSlugs.has(metadata.slug)).toBe(false);

        const key = `${locale}:${metadata.slug}`;
        expect(categorySlugsByLocale.has(key)).toBe(false);
        categorySlugsByLocale.set(key, definition.id);

        metadata.legacySlugs?.forEach((legacySlug) => {
          expect(reservedSlugs.has(legacySlug)).toBe(false);
        });
      });
    });

    CALCULATOR_DEFINITIONS.forEach((definition) => {
      Object.entries(definition.locales).forEach(([locale, metadata]) => {
        expect(metadata).toBeDefined();

        const key = `${locale}:${definition.categoryId}:${metadata.slug}`;
        expect(calculatorSlugsByLocaleAndCategory.has(key)).toBe(false);
        calculatorSlugsByLocaleAndCategory.set(key, definition.id);
      });
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
    expect(getCategoryByLabel("Eventos")?.slug).toBe("eventos");
    expect(getCategoryByLabel("Restaurantes")?.slug).toBe("restaurantes");
    expect(getCategoryByLabel("Probabilidad y estadística")?.slug).toBe(
      "probabilidad-estadistica",
    );
    expect(getCategoryByLabel("Programación")?.slug).toBe("programacion");
    expect(getCategoryBySlugOrLegacySlug("legal-e-impuestos")?.slug).toBe(
      "legal-impuestos",
    );
    expect(getCategoryBySlugOrLegacySlug("fecha-y-tiempo")?.slug).toBe(
      "fecha-tiempo",
    );
    expect(getCategoryBySlugOrLegacySlug("eventos-sociales")?.slug).toBe(
      "eventos",
    );
    expect(getCategoryBySlugOrLegacySlug("math", "en")?.slug).toBe("math");
  });
});
