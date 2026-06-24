import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();
const PAGES_DIR = join(ROOT, "src", "pages");

const read = (path: string) => readFileSync(path, "utf8");

describe("editorial trust pages", () => {
  it("links institutional trust pages from the footer", () => {
    const footer = read(join(ROOT, "src", "components", "template", "Footer.astro"));

    [
      "/acerca-de",
      "/metodologia",
      "/politica-editorial",
      "/correcciones",
    ].forEach((href) => {
      expect(footer).toContain(`href="${href}"`);
    });
  });

  it("keeps notice pages discoverable before YMYL migration", () => {
    const methodology = read(join(PAGES_DIR, "metodologia.astro"));

    expect(methodology).toContain('href="/avisos/salud"');
    expect(methodology).toContain('href="/avisos/financiero-fiscal"');
  });

  it("renders article editorial metadata and structured sources from the blog template", () => {
    const articleTemplate = read(
      join(PAGES_DIR, "blog", "[category]", "[slug].astro"),
    );

    expect(articleTemplate).toContain("ArticleEditorialMeta");
    expect(articleTemplate).toContain("ArticleSources");
    expect(articleTemplate).toContain("methodologyNote");
    expect(articleTemplate).toContain("buildBlogArticleJsonLd");
  });
});
