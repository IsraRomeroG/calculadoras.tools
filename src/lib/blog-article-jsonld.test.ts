import { describe, expect, it } from "vitest";
import { buildBlogArticleJsonLd } from "./blog-article-jsonld";

const siteUrl = "https://calculadoras.tools/";
const baseInput = {
  canonical: "https://calculadoras.tools/blog/salud/articulo",
  description: "Descripción del artículo.",
  headline: "Título del artículo",
  pubDate: new Date("2026-06-20T00:00:00.000Z"),
  siteUrl,
};

describe("blog article JSON-LD", () => {
  it("uses the editorial entity as visible fallback author", () => {
    const jsonLd = buildBlogArticleJsonLd(baseInput);

    expect(jsonLd["@type"]).toBe("BlogPosting");
    expect(jsonLd.author).toMatchObject({
      "@type": "Organization",
      name: "Calculadoras.Tools",
      url: "https://calculadoras.tools/acerca-de",
    });
    expect(jsonLd.publisher).toMatchObject({
      "@type": "Organization",
      name: "Calculadoras.Tools",
    });
  });

  it("uses a provided author as a person and resolves relative URLs", () => {
    const jsonLd = buildBlogArticleJsonLd({
      ...baseInput,
      author: {
        name: "Autora de prueba",
        url: "/acerca-de#autora",
      },
    });

    expect(jsonLd.author).toMatchObject({
      "@type": "Person",
      name: "Autora de prueba",
      url: "https://calculadoras.tools/acerca-de#autora",
    });
  });

  it("uses the English editorial page for English articles", () => {
    const jsonLd = buildBlogArticleJsonLd({
      ...baseInput,
      canonical:
        "https://calculadoras.tools/en/blog/math/how-to-calculate-percentages",
      locale: "en",
    });

    expect(jsonLd.author).toMatchObject({
      "@type": "Organization",
      name: "Calculadoras.Tools",
      url: "https://calculadoras.tools/en/about",
    });
    expect(jsonLd.publisher).toMatchObject({
      "@type": "Organization",
      url: "https://calculadoras.tools/en/about",
    });
  });

  it("uses updatedDate for dateModified and does not emit reviewedBy", () => {
    const jsonLd = buildBlogArticleJsonLd({
      ...baseInput,
      updatedDate: new Date("2026-06-22T00:00:00.000Z"),
    });

    expect(jsonLd.datePublished).toBe("2026-06-20T00:00:00.000Z");
    expect(jsonLd.dateModified).toBe("2026-06-22T00:00:00.000Z");
    expect(jsonLd).not.toHaveProperty("reviewedBy");
  });
});
