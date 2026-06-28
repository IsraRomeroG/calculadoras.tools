import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  createSitemapFilter,
  getLegacyBlogArticleSlugsForSitemap,
  getPublishedBlogArticlePathsForSitemap,
  getPublishedBlogCategoryPathsForSitemap,
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

const englishFrontmatter = ({
  categoryId = "matematicas",
  draft,
  pubDate,
  slug = "how-to-calculate-percentages",
  translationKey = "percentage-basics",
}: {
  categoryId?: string;
  draft?: boolean;
  pubDate: string;
  slug?: string;
  translationKey?: string;
}) => `---
title: "Test article"
description: "Test description."
pubDate: ${pubDate}
locale: "en"
categoryId: "${categoryId}"
slug: "${slug}"
translationKey: "${translationKey}"
${draft ? "draft: true\n" : ""}---

Test content.
`;

describe("blog sitemap publication filtering", () => {
  const emptySitemapSets = {
    legacyBlogArticleSlugs: new Set<string>(),
    publishedBlogArticlePaths: new Set<string>(),
    publishedBlogCategoryPaths: new Set<string>(),
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
        publishedBlogCategoryPaths: getPublishedBlogCategoryPathsForSitemap(
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

  it("includes only published English blog paths in the sitemap", () => {
    const contentDir = mkdtempSync(join(tmpdir(), "blog-sitemap-en-"));
    const mathDir = join(contentDir, "en", "math");

    mkdirSync(mathDir, { recursive: true });

    try {
      writeFileSync(
        join(mathDir, "published.md"),
        englishFrontmatter({ pubDate: "2026-06-23" }),
      );
      writeFileSync(
        join(mathDir, "draft.md"),
        englishFrontmatter({
          draft: true,
          pubDate: "2026-06-20",
          slug: "draft",
          translationKey: "draft",
        }),
      );
      writeFileSync(
        join(mathDir, "future.md"),
        englishFrontmatter({
          pubDate: "2026-06-24",
          slug: "future",
          translationKey: "future",
        }),
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
        publishedBlogCategoryPaths: getPublishedBlogCategoryPathsForSitemap(
          contentDir,
          now,
        ),
        publishedBlogCategorySlugs: getPublishedBlogCategorySlugsForSitemap(
          contentDir,
          now,
        ),
      });

      expect(shouldIncludeInSitemap("https://calculadoras.tools/en/blog")).toBe(
        true,
      );
      expect(
        shouldIncludeInSitemap("https://calculadoras.tools/en/blog/math"),
      ).toBe(true);
      expect(
        shouldIncludeInSitemap(
          "https://calculadoras.tools/en/blog/math/how-to-calculate-percentages",
        ),
      ).toBe(true);
      expect(
        shouldIncludeInSitemap("https://calculadoras.tools/en/blog/math/draft"),
      ).toBe(false);
      expect(
        shouldIncludeInSitemap("https://calculadoras.tools/en/blog/math/future"),
      ).toBe(false);
      expect(
        shouldIncludeInSitemap("https://calculadoras.tools/en/blog/pagina"),
      ).toBe(false);
      expect(
        shouldIncludeInSitemap("https://calculadoras.tools/en/blog/math/pagina/2"),
      ).toBe(false);
    } finally {
      rmSync(contentDir, { recursive: true, force: true });
    }
  });

  it("allows published localized pilot routes while blocking unpublished English utility routes", () => {
    const shouldIncludeInSitemap = createSitemapFilter({
      ...emptySitemapSets,
      excludedPaths: new Set(["/en/contact", "/en/privacy"]),
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
      shouldIncludeInSitemap("https://calculadoras.tools/en/contact"),
    ).toBe(false);
    expect(
      shouldIncludeInSitemap("https://calculadoras.tools/en/privacy"),
    ).toBe(false);
  });
});
