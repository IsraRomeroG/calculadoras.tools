import { getCollection } from "astro:content";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BlogPost } from "./blog";
import {
  getBlogPostCategory,
  getBlogPostUrl,
  getBlogRouteConflicts,
  getCategoryPageUrl,
  getCategoryUrl,
  getPublishedBlogPosts,
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

const publishableBlogPost = ({
  categorySlug,
  draft,
  id,
  pubDate,
}: {
  categorySlug: BlogPost["data"]["categorySlug"];
  draft?: boolean;
  id: string;
  pubDate: string;
}): BlogPost =>
  ({
    id,
    data: {
      categorySlug,
      draft,
      pubDate: new Date(pubDate),
    },
  }) as BlogPost;

const mockedGetCollection = vi.mocked(getCollection);

beforeEach(() => {
  mockedGetCollection.mockReset();
});

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

  it("uses publication filtering before blog routes are generated", async () => {
    const entries = [
      publishableBlogPost({
        categorySlug: "salud",
        id: "salud/publicado",
        pubDate: "2026-06-20",
      }),
      publishableBlogPost({
        categorySlug: "salud",
        draft: true,
        id: "salud/borrador",
        pubDate: "2026-06-20",
      }),
      publishableBlogPost({
        categorySlug: "salud",
        id: "salud/futuro",
        pubDate: "2026-06-24",
      }),
    ];

    mockedGetCollection.mockImplementationOnce(
      async (_collection, filter) =>
        entries.filter((entry) =>
          filter?.({ data: entry.data, id: entry.id } as BlogPost),
        ),
    );

    const posts = await getPublishedBlogPosts(
      new Date("2026-06-23T18:00:00.000Z"),
    );

    expect(posts.map(getBlogPostUrl)).toEqual(["/blog/salud/publicado"]);
  });
});
