import { describe, expect, it, vi } from "vitest";
import type { BlogPost } from "./blog";
import {
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
  category: string,
): Pick<BlogPost, "id" | "data"> =>
  ({
    id,
    data: { category },
  }) as Pick<BlogPost, "id" | "data">;

describe("blog route helpers", () => {
  it("builds category URLs without the categoria segment", () => {
    expect(getCategoryUrl("Salud")).toBe("/blog/salud");
    expect(getCategoryPageUrl("Salud", 1)).toBe("/blog/salud");
    expect(getCategoryPageUrl("Salud", 2)).toBe("/blog/salud/pagina/2");
  });

  it("builds article URLs below their category slug", () => {
    expect(
      getBlogPostUrl(
        blogPost("legal-impuestos/como-calcular-iva", "Legal e impuestos"),
      ),
    ).toBe("/blog/legal-e-impuestos/como-calcular-iva");
    expect(
      getBlogPostUrl(blogPost("matematicas/regla-de-tres", "Matemáticas")),
    ).toBe("/blog/matematicas/regla-de-tres");
  });

  it("detects reserved category and article slugs", () => {
    const conflicts = getBlogRouteConflicts([
      blogPost("pagina/articulo", "Pagina"),
      blogPost("salud/pagina", "Salud"),
    ]);

    expect(conflicts.map((conflict) => conflict.route)).toEqual(
      expect.arrayContaining(["/blog/pagina", "/blog/salud/pagina"]),
    );
  });

  it("detects duplicated article URLs within the same category", () => {
    const conflicts = getBlogRouteConflicts([
      blogPost("salud/repetido", "Salud"),
      blogPost("archive/repetido", "Salud"),
    ]);

    expect(conflicts.map((conflict) => conflict.route)).toContain(
      "/blog/salud/repetido",
    );
  });

  it("detects legacy article redirects that collide with category pages", () => {
    const conflicts = getBlogRouteConflicts([
      blogPost("legal-impuestos/salud", "Legal e impuestos"),
      blogPost("salud/articulo", "Salud"),
    ]);

    expect(conflicts.map((conflict) => conflict.route)).toContain(
      "/blog/salud",
    );
  });
});
