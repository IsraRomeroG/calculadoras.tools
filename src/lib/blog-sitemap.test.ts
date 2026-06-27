import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  createSitemapFilter,
  getLegacyBlogArticleSlugsForSitemap,
  getPublishedBlogArticlePathsForSitemap,
  getPublishedBlogCategorySlugsForSitemap,
  isPublishableBlogContent,
} from "./blog-sitemap.mjs";

const frontmatter = ({
  categorySlug = "salud",
  draft,
  pubDate,
}: {
  categorySlug?: string;
  draft?: boolean;
  pubDate: string;
}) => `---
title: "Articulo de prueba"
description: "Descripcion de prueba."
pubDate: ${pubDate}
${draft ? "draft: true\n" : ""}categorySlug: "${categorySlug}"
---

Contenido de prueba.
`;

describe("blog sitemap publication filtering", () => {
  const emptySitemapSets = {
    legacyBlogArticleSlugs: new Set<string>(),
    publishedBlogArticlePaths: new Set<string>(),
    publishedBlogCategorySlugs: new Set<string>(),
  };

  it("uses the same draft and future-date publication rules as blog content", () => {
    const now = new Date("2026-06-23T18:00:00.000Z");

    expect(
      isPublishableBlogContent(frontmatter({ pubDate: "2026-06-23" }), now),
    ).toBe(true);
    expect(
      isPublishableBlogContent(
        frontmatter({ draft: true, pubDate: "2026-06-20" }),
        now,
      ),
    ).toBe(false);
    expect(
      isPublishableBlogContent(frontmatter({ pubDate: "2026-06-24" }), now),
    ).toBe(false);
  });

  it("includes only exact published article paths in the sitemap", () => {
    const contentDir = mkdtempSync(join(tmpdir(), "blog-sitemap-"));
    const saludDir = join(contentDir, "salud");

    mkdirSync(saludDir);

    try {
      writeFileSync(
        join(saludDir, "publicado.md"),
        frontmatter({ pubDate: "2026-06-23" }),
      );
      writeFileSync(
        join(saludDir, "borrador.md"),
        frontmatter({ draft: true, pubDate: "2026-06-20" }),
      );
      writeFileSync(
        join(saludDir, "futuro.md"),
        frontmatter({ pubDate: "2026-06-24" }),
      );
      writeFileSync(
        join(saludDir, "peso-saludable-segun-estatura.md"),
        frontmatter({ pubDate: "2026-06-23" }),
      );

      const now = new Date("2026-06-23T18:00:00.000Z");
      const shouldIncludeInSitemap = createSitemapFilter({
        legacyBlogArticleSlugs: getLegacyBlogArticleSlugsForSitemap(
          contentDir,
          now,
        ),
        publishedBlogArticlePaths: getPublishedBlogArticlePathsForSitemap(
          contentDir,
          now,
        ),
        publishedBlogCategorySlugs: getPublishedBlogCategorySlugsForSitemap(
          contentDir,
          now,
        ),
      });

      expect(
        shouldIncludeInSitemap("https://calculadoras.tools/blog/salud"),
      ).toBe(true);
      expect(
        shouldIncludeInSitemap(
          "https://calculadoras.tools/blog/salud/publicado",
        ),
      ).toBe(true);
      expect(
        shouldIncludeInSitemap(
          "https://calculadoras.tools/blog/salud/peso-saludable-segun-estatura",
        ),
      ).toBe(true);
      expect(
        shouldIncludeInSitemap(
          "https://calculadoras.tools/blog/salud/borrador",
        ),
      ).toBe(false);
      expect(
        shouldIncludeInSitemap("https://calculadoras.tools/blog/salud/futuro"),
      ).toBe(false);
      expect(
        shouldIncludeInSitemap("https://calculadoras.tools/blog/publicado"),
      ).toBe(false);
      expect(
        shouldIncludeInSitemap(
          "https://calculadoras.tools/blog/salud/cuanto-debo-pesar-si-mido-170",
        ),
      ).toBe(false);
      expect(
        shouldIncludeInSitemap(
          "https://calculadoras.tools/blog/salud/tabla-peso-saludable-150-195",
        ),
      ).toBe(false);
    } finally {
      rmSync(contentDir, { recursive: true, force: true });
    }
  });

  it("allows published localized pilot routes while blocking unpublished English routes", () => {
    const shouldIncludeInSitemap = createSitemapFilter({
      ...emptySitemapSets,
      excludedPaths: new Set(["/en/blog", "/en/contact", "/en/privacy"]),
    });

    expect(shouldIncludeInSitemap("https://calculadoras.tools/en")).toBe(true);
    expect(shouldIncludeInSitemap("https://calculadoras.tools/en/math")).toBe(
      true,
    );
    expect(
      shouldIncludeInSitemap(
        "https://calculadoras.tools/en/math/percentage-calculator",
      ),
    ).toBe(true);
    expect(shouldIncludeInSitemap("https://calculadoras.tools/en/blog")).toBe(
      false,
    );
    expect(
      shouldIncludeInSitemap("https://calculadoras.tools/en/blog/"),
    ).toBe(false);
    expect(
      shouldIncludeInSitemap("https://calculadoras.tools/en/blog/post"),
    ).toBe(false);
    expect(
      shouldIncludeInSitemap("https://calculadoras.tools/en/contact"),
    ).toBe(false);
    expect(
      shouldIncludeInSitemap("https://calculadoras.tools/en/privacy"),
    ).toBe(false);
  });
});
