import { describe, expect, it } from "vitest";
import { blogSchema } from "./blog-schema";

const basePost = {
  title: "Artículo de prueba",
  description: "Descripción breve para validar el schema.",
  pubDate: "2026-06-20",
  categorySlug: "salud",
};

describe("blog frontmatter schema", () => {
  it("accepts a post with author and sources", () => {
    const result = blogSchema.parse({
      ...basePost,
      author: {
        name: "Autora de prueba",
        url: "/acerca-de",
      },
      sources: [
        {
          label: "Fuente oficial",
          url: "https://example.com/source",
          publisher: "Example",
          accessedDate: "2026-06-21",
        },
      ],
    });

    expect(result.author?.name).toBe("Autora de prueba");
    expect(result.sources).toHaveLength(1);
    expect(result.sources[0]?.accessedDate).toBeInstanceOf(Date);
  });

  it("keeps author optional and defaults sources to an empty list", () => {
    const result = blogSchema.parse(basePost);

    expect(result.author).toBeUndefined();
    expect(result.sources).toEqual([]);
  });

  it("accepts future i18n metadata without requiring route changes", () => {
    const result = blogSchema.parse({
      ...basePost,
      translationKey: "healthy-weight-basics",
      contentId: "healthy-weight-basics",
      locale: "es",
      categoryId: "salud",
      slug: "healthy-weight-basics",
    });

    expect(result.translationKey).toBe("healthy-weight-basics");
    expect(result.contentId).toBe("healthy-weight-basics");
    expect(result.locale).toBe("es");
    expect(result.categoryId).toBe("salud");
    expect(result.slug).toBe("healthy-weight-basics");
  });

  it("accepts a published English post with localized route metadata", () => {
    const result = blogSchema.parse({
      title: "How to calculate percentages",
      description: "A short English guide.",
      pubDate: "2026-06-20",
      locale: "en",
      categoryId: "matematicas",
      slug: "how-to-calculate-percentages",
      translationKey: "percentage-basics",
    });

    expect(result.categorySlug).toBeUndefined();
    expect(result.locale).toBe("en");
    expect(result.categoryId).toBe("matematicas");
    expect(result.slug).toBe("how-to-calculate-percentages");
  });

  it("rejects Spanish posts without categorySlug", () => {
    expect(() =>
      blogSchema.parse({
        title: "Articulo sin categoria",
        description: "Descripcion breve.",
        pubDate: "2026-06-20",
      }),
    ).toThrow(/categorySlug is required/);
  });

  it("rejects localized posts without required route metadata", () => {
    expect(() =>
      blogSchema.parse({
        title: "Localized draft",
        description: "Description.",
        pubDate: "2026-06-20",
        locale: "en",
      }),
    ).toThrow(/translationKey is required/);
  });

  it("accepts a reviewer with reviewedDate", () => {
    const result = blogSchema.parse({
      ...basePost,
      reviewer: {
        name: "Revisora real",
        role: "Revisión editorial",
      },
      reviewedDate: "2026-06-22",
    });

    expect(result.reviewer?.name).toBe("Revisora real");
    expect(result.reviewedDate).toBeInstanceOf(Date);
  });

  it("accepts reviewNote with reviewedDate without inventing a reviewer", () => {
    const result = blogSchema.parse({
      ...basePost,
      reviewNote: "Revisión editorial interna de fuentes y fechas.",
      reviewedDate: "2026-06-22",
    });

    expect(result.reviewer).toBeUndefined();
    expect(result.reviewNote).toContain("Revisión editorial");
  });

  it("rejects reviewedDate without reviewer or reviewNote", () => {
    expect(() =>
      blogSchema.parse({
        ...basePost,
        reviewedDate: "2026-06-22",
      }),
    ).toThrow(/reviewedDate requires reviewer or reviewNote/);
  });

  it("rejects updatedDate earlier than pubDate", () => {
    expect(() =>
      blogSchema.parse({
        ...basePost,
        updatedDate: "2026-06-19",
      }),
    ).toThrow(/updatedDate cannot be earlier than pubDate/);
  });
});
