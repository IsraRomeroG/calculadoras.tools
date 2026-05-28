import { describe, expect, it, vi } from "vitest";
import type { BlogPost } from "./blog";
import {
  getBlogPostCategory,
  getBlogPostUrl,
  getBlogRouteConflicts,
  getCategoryPageUrl,
  getCategoryUrl,
} from "./blog";

vi.mock("astro:content", () => ({
  getCollection: vi.fn(),
}));

const blogPost = (
  id: string,
  categorySlug: BlogPost["data"]["categorySlug"],
): Pick<BlogPost, "id" | "data"> =>
  ({
    id,
    data: { categorySlug },
  }) as Pick<BlogPost, "id" | "data">;

describe("blog route helpers", () => {
  it("builds category URLs without the categoria segment", () => {
    expect(getCategoryUrl("salud")).toBe("/blog/salud");
    expect(getCategoryPageUrl("salud", 1)).toBe("/blog/salud");
    expect(getCategoryPageUrl("salud", 2)).toBe("/blog/salud/pagina/2");
    expect(getCategoryUrl("legal-impuestos")).toBe("/blog/legal-impuestos");
    expect(getCategoryUrl("fecha-tiempo")).toBe("/blog/fecha-tiempo");
  });

  it("builds article URLs below their category slug", () => {
    expect(
      getBlogPostUrl(
        blogPost("legal-impuestos/como-calcular-iva", "legal-impuestos"),
      ),
    ).toBe("/blog/legal-impuestos/como-calcular-iva");
    expect(
      getBlogPostUrl(blogPost("matematicas/regla-de-tres", "matematicas")),
    ).toBe("/blog/matematicas/regla-de-tres");
  });

  it("gets visible category labels from shared metadata", () => {
    expect(
      getBlogPostCategory(
        blogPost("legal-impuestos/como-calcular-iva", "legal-impuestos"),
      ).label,
    ).toBe("Legal e impuestos");
    expect(
      getBlogPostCategory(blogPost("fecha-tiempo/calendario", "fecha-tiempo"))
        .label,
    ).toBe("Fecha y tiempo");
  });

  it("detects reserved category and article slugs", () => {
    const conflicts = getBlogRouteConflicts([
      blogPost("salud/pagina", "salud"),
    ]);

    expect(conflicts.map((conflict) => conflict.route)).toEqual(
      expect.arrayContaining(["/blog/salud/pagina"]),
    );
  });

  it("detects duplicated article URLs within the same category", () => {
    const conflicts = getBlogRouteConflicts([
      blogPost("salud/repetido", "salud"),
      blogPost("archive/repetido", "salud"),
    ]);

    expect(conflicts.map((conflict) => conflict.route)).toContain(
      "/blog/salud/repetido",
    );
  });

  it("detects legacy article redirects that collide with category pages", () => {
    const conflicts = getBlogRouteConflicts([
      blogPost("legal-impuestos/salud", "legal-impuestos"),
      blogPost("salud/articulo", "salud"),
    ]);

    expect(conflicts.map((conflict) => conflict.route)).toContain(
      "/blog/salud",
    );
  });

  it("detects legacy article redirects that collide with category aliases", () => {
    const conflicts = getBlogRouteConflicts([
      blogPost("legal-impuestos/legal-e-impuestos", "finanzas"),
      blogPost("legal-impuestos/como-calcular-iva", "legal-impuestos"),
    ]);

    expect(conflicts.map((conflict) => conflict.route)).toContain(
      "/blog/legal-e-impuestos",
    );
  });
});
