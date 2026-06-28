import { getCollection } from "astro:content";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BlogPost } from "./blog";
import {
  getBlogCategoryPageUrl,
  getBlogCategoryUrl,
  getBlogIndexPageUrl,
  getBlogPostAlternatePaths,
  getBlogPostCategory,
  getBlogPostUrl,
  getBlogRouteConflicts,
  getCategoryPageUrl,
  getCategoryUrl,
  getPublishedBlogPostsByLocale,
  isBlogPostInLocale,
  isSpanishBlogPost,
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

const publishableEnglishBlogPost = ({
  draft,
  filePath = "src/content/blog/en/math/how-to-calculate-percentages.md",
  id = "how-to-calculate-percentages",
  pubDate,
  slug = "how-to-calculate-percentages",
  translationKey = "percentage-basics",
}: {
  draft?: boolean;
  filePath?: string;
  id?: string;
  pubDate: string;
  slug?: string;
  translationKey?: string;
}): BlogPost =>
  ({
    id,
    filePath,
    data: {
      categoryId: "matematicas",
      draft,
      locale: "en",
      pubDate: new Date(pubDate),
      slug,
      translationKey,
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

  it("builds localized blog index and category URLs", () => {
    expect(getBlogIndexPageUrl(1, "en")).toBe("/en/blog");
    expect(getBlogIndexPageUrl(2, "en")).toBe("/en/blog/page/2");
    expect(getBlogCategoryUrl("matematicas", "en")).toBe("/en/blog/math");
    expect(getBlogCategoryPageUrl("matematicas", 2, "en")).toBe(
      "/en/blog/math/page/2",
    );
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
    expect(
      getBlogPostUrl(
        publishableEnglishBlogPost({
          pubDate: "2026-06-20",
        }),
      ),
    ).toBe("/en/blog/math/how-to-calculate-percentages");
  });

  it("keeps Spanish blog routes derived from current file id and categorySlug", () => {
    expect(
      getBlogPostUrl({
        id: "matematicas/como-calcular-porcentajes",
        data: {
          categorySlug: "matematicas",
          locale: "es",
          slug: "how-to-calculate-percentages",
          translationKey: "percentage-basics",
        },
      } as Pick<BlogPost, "id" | "data">),
    ).toBe("/blog/matematicas/como-calcular-porcentajes");
  });

  it("detects blog post locale from frontmatter and content root", () => {
    expect(
      isSpanishBlogPost(blogPost("matematicas/porcentajes", "matematicas")),
    ).toBe(true);
    expect(
      isBlogPostInLocale(
        publishableEnglishBlogPost({ pubDate: "2026-06-20" }),
        "en",
      ),
    ).toBe(true);
    expect(
      isSpanishBlogPost({
        id: "matematicas/percentages",
        data: {
          categorySlug: "matematicas",
          locale: "en",
        },
      } as Pick<BlogPost, "id" | "data">),
    ).toBe(false);
    expect(
      isSpanishBlogPost({
        id: "percentages",
        filePath: "src/content/blog/en/math/percentages.md",
        data: {
          categorySlug: "matematicas",
          locale: "es",
        },
      } as Pick<BlogPost, "id" | "data"> & { filePath: string }),
    ).toBe(false);
    expect(
      isBlogPostInLocale(
        {
          id: "math/percentages",
          filePath: "src/content/blog/en/math/percentages.md",
          data: {
            categoryId: "matematicas",
            locale: "en",
            slug: "percentages",
          },
        } as Pick<BlogPost, "id" | "data"> & { filePath: string },
        "en",
      ),
    ).toBe(true);
    expect(
      isBlogPostInLocale(
        {
          id: "wrong-root",
          filePath: "src/content/blog/math/wrong-root.md",
          data: {
            categoryId: "matematicas",
            locale: "en",
            slug: "wrong-root",
          },
        } as Pick<BlogPost, "id" | "data"> & { filePath: string },
        "en",
      ),
    ).toBe(false);
  });

  it("builds alternates from published posts with the same translationKey", () => {
    const spanishPost = {
      id: "matematicas/como-calcular-porcentajes",
      data: {
        categorySlug: "matematicas",
        translationKey: "percentage-basics",
      },
    } as Pick<BlogPost, "id" | "data">;
    const englishPost = publishableEnglishBlogPost({
      pubDate: "2026-06-20",
    });

    expect(
      getBlogPostAlternatePaths(englishPost, [spanishPost, englishPost]),
    ).toEqual({
      es: "/blog/matematicas/como-calcular-porcentajes",
      en: "/en/blog/math/how-to-calculate-percentages",
    });
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
    expect(
      getBlogRouteConflicts([
        publishableEnglishBlogPost({
          pubDate: "2026-06-20",
          slug: "page",
        }),
      ]).map((conflict) => conflict.route),
    ).toEqual(expect.arrayContaining(["/en/blog/math/page"]));
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
      {
        ...publishableBlogPost({
          categorySlug: "salud",
          id: "salud/english-frontmatter",
          pubDate: "2026-06-20",
        }),
        data: {
          ...publishableBlogPost({
            categorySlug: "salud",
            id: "salud/english-frontmatter",
            pubDate: "2026-06-20",
          }).data,
          locale: "en",
        },
      },
      publishableBlogPost({
        categorySlug: "salud",
        id: "en/health/published",
        pubDate: "2026-06-20",
      }) as BlogPost & { filePath: string },
    ];

    (entries.at(-1) as BlogPost & { filePath: string }).filePath =
      "src/content/blog/en/health/published.md";

    mockedGetCollection.mockImplementationOnce(
      async (_collection, filter) =>
        entries.filter((entry) =>
          filter?.(entry as BlogPost),
        ),
    );

    const posts = await getPublishedBlogPosts(
      new Date("2026-06-23T18:00:00.000Z"),
    );

    expect(posts.map(getBlogPostUrl)).toEqual(["/blog/salud/publicado"]);
  });

  it("uses publication filtering before localized blog routes are generated", async () => {
    const entries = [
      publishableEnglishBlogPost({
        pubDate: "2026-06-20",
      }),
      publishableEnglishBlogPost({
        draft: true,
        id: "draft",
        filePath: "src/content/blog/en/math/draft.md",
        pubDate: "2026-06-20",
        slug: "draft",
        translationKey: "draft",
      }),
      publishableEnglishBlogPost({
        id: "future",
        filePath: "src/content/blog/en/math/future.md",
        pubDate: "2026-06-24",
        slug: "future",
        translationKey: "future",
      }),
      publishableEnglishBlogPost({
        id: "wrong-root",
        filePath: "src/content/blog/math/wrong-root.md",
        pubDate: "2026-06-20",
        slug: "wrong-root",
        translationKey: "wrong-root",
      }),
      publishableBlogPost({
        categorySlug: "matematicas",
        id: "matematicas/como-calcular-porcentajes",
        pubDate: "2026-06-20",
      }),
    ];

    mockedGetCollection.mockImplementationOnce(
      async (_collection, filter) =>
        entries.filter((entry) =>
          filter?.(entry as BlogPost),
        ),
    );

    const posts = await getPublishedBlogPostsByLocale(
      "en",
      new Date("2026-06-23T18:00:00.000Z"),
    );

    expect(posts.map(getBlogPostUrl)).toEqual([
      "/en/blog/math/how-to-calculate-percentages",
    ]);
  });
});
