import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const calculatorCategoryPages = {
  construction: "construccion",
  converters: "conversores",
  cooking: "cocina",
  "date-time": "fecha-tiempo",
  events: "eventos",
  finance: "finanzas",
  geometry: "geometria",
  health: "salud",
  "legal-tax": "legal-impuestos",
  pets: "mascotas",
  "probability-statistics": "probabilidad-estadistica",
  programming: "programacion",
  "real-estate": "inmuebles",
  restaurants: "restaurantes",
  vehicles: "vehiculos",
} as const;

const blogCategoryPages = {
  converters: "conversores",
  finance: "finanzas",
  health: "salud",
  "legal-tax": "legal-impuestos",
  "real-estate": "inmuebles",
} as const;

describe("static English category pages", () => {
  it("keeps one explicit Astro file for every translated calculator category", () => {
    Object.entries(calculatorCategoryPages).forEach(([slug, categoryId]) => {
      const filePath = join(
        process.cwd(),
        "src",
        "pages",
        "en",
        `${slug}.astro`,
      );

      expect(existsSync(filePath)).toBe(true);
      expect(readFileSync(filePath, "utf8")).toContain(
        `categoryId="${categoryId}"`,
      );
    });
  });

  it("keeps one explicit Astro file for every translated blog category", () => {
    Object.entries(blogCategoryPages).forEach(([slug, categoryId]) => {
      const filePath = join(
        process.cwd(),
        "src",
        "pages",
        "en",
        "blog",
        `${slug}.astro`,
      );

      expect(existsSync(filePath)).toBe(true);
      expect(readFileSync(filePath, "utf8")).toContain(
        `categoryId="${categoryId}"`,
      );
    });
  });

  it("keeps empty English categories linked only to English hubs", () => {
    const blogComponent = readFileSync(
      join(
        process.cwd(),
        "src",
        "components",
        "blog",
        "StaticEnglishBlogCategoryPage.astro",
      ),
      "utf8",
    );

    expect(blogComponent).toContain('href: "/en"');
    expect(blogComponent).not.toContain('href: "/"');
    expect(blogComponent).not.toMatch(/href=["']\/(?!en(?:\/|["']))/);
  });

  it("exposes translated categories from the English home and blog hubs", () => {
    const homePage = readFileSync(
      join(
        process.cwd(),
        "src",
        "components",
        "pages",
        "HomePage.astro",
      ),
      "utf8",
    );
    const blogIndexPage = readFileSync(
      join(
        process.cwd(),
        "src",
        "components",
        "blog",
        "BlogIndexPage.astro",
      ),
      "utf8",
    );

    expect(homePage).toContain('locale === "en"');
    expect(homePage).toContain("CATEGORY_IDS.map");
    Object.values(blogCategoryPages).forEach((categoryId) => {
      expect(blogIndexPage).toContain(`"${categoryId}"`);
    });
  });
});
