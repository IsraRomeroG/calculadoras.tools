import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getMenuItems } from "@lib/constants/menu";
import { percentageCalculatorContent } from "@lib/i18n/calculators/percentage";
import { isPublishableBlogContent } from "./blog-sitemap.mjs";

const dynamicHoistedRouteFiles = [
  ["src", "pages", "[category].astro"],
  ["src", "pages", "en", "[category].astro"],
  ["src", "pages", "blog", "[category].astro"],
  ["src", "pages", "blog", "pagina", "[page].astro"],
  ["src", "pages", "blog", "[category]", "[slug].astro"],
  ["src", "pages", "blog", "[category]", "pagina", "[page].astro"],
  ["src", "pages", "en", "blog", "[category].astro"],
  ["src", "pages", "en", "blog", "page", "[page].astro"],
  ["src", "pages", "en", "blog", "[category]", "[slug].astro"],
  ["src", "pages", "en", "blog", "[category]", "page", "[page].astro"],
];

const contentConfigPath = join(process.cwd(), "src", "content.config.ts");
const englishPercentageClusterFiles = [
  ["src", "content", "blog", "en", "math", "how-to-calculate-percentages.md"],
  ["src", "content", "blog", "en", "math", "percentage-increase.md"],
  [
    "src",
    "content",
    "blog",
    "en",
    "math",
    "what-percentage-is-one-number-of-another.md",
  ],
];

describe("blog i18n architecture guardrails", () => {
  it("does not create prefixed Spanish blog routes or content roots", () => {
    expect(existsSync(join(process.cwd(), "src", "pages", "blog", "es"))).toBe(
      false,
    );
    expect(existsSync(join(process.cwd(), "src", "pages", "blog", "en"))).toBe(
      false,
    );
    expect(
      existsSync(join(process.cwd(), "src", "content", "blog", "es")),
    ).toBe(false);
  });

  it("publishes English blog routes only under the English prefix", () => {
    expect(
      existsSync(join(process.cwd(), "src", "content", "blog", "en")),
    ).toBe(true);
    expect(
      existsSync(join(process.cwd(), "src", "pages", "en", "blog.astro")),
    ).toBe(true);
    expect(getMenuItems("en")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "blog", slug: "/en/blog" }),
      ]),
    );
  });

  it("keeps English calculator guides detached from Spanish blog URLs", () => {
    percentageCalculatorContent.en.relatedGuides
      .filter((guide) => guide.published)
      .forEach((guide) => {
        expect(guide.href).not.toMatch(/^\/blog\//);
      });
  });

  it("keeps the initial English percentage cluster present and publishable", () => {
    const now = new Date("2026-06-28T18:00:00.000Z");

    englishPercentageClusterFiles.forEach((fileSegments) => {
      const filePath = join(process.cwd(), ...fileSegments);
      const source = readFileSync(filePath, "utf8");

      expect(source).toContain('locale: "en"');
      expect(isPublishableBlogContent(source, now)).toBe(true);
    });
  });

  it("keeps blog content IDs based on file paths instead of public slugs", () => {
    const source = readFileSync(contentConfigPath, "utf8");

    expect(source).toContain("generateId: getBlogEntryId");
    expect(source).not.toContain("generateId: ({ data })");
  });

  it("keeps getStaticPaths self-contained for Astro route hoisting", () => {
    dynamicHoistedRouteFiles.forEach((routeFileSegments) => {
      const routeFilePath = join(process.cwd(), ...routeFileSegments);
      const source = readFileSync(routeFilePath, "utf8");
      const staticPathsBlock = source.match(
        /export (?:async )?function getStaticPaths\(\) \{[\s\S]*?\r?\n\}\r?\n\r?\ninterface Props/,
      );

      expect(staticPathsBlock).not.toBeNull();
      expect(staticPathsBlock?.[0]).not.toMatch(/\blocale\b/);
    });
  });
});
