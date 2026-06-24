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
