import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getFooterLinks } from "./i18n/shell";

const ROOT = process.cwd();
const PAGES_DIR = join(ROOT, "src", "pages");
const COMPONENTS_DIR = join(ROOT, "src", "components");

const read = (path: string) => readFileSync(path, "utf8");

describe("editorial trust pages", () => {
  it("links institutional trust pages from the footer", () => {
    expect(getFooterLinks("es").map((link) => link.href)).toEqual(
      expect.arrayContaining([
        "/privacidad",
        "/contacto",
        "/acerca-de",
        "/metodologia",
        "/politica-editorial",
        "/correcciones",
      ]),
    );
  });

  it("keeps notice pages discoverable before YMYL migration", () => {
    const methodology = read(join(PAGES_DIR, "metodologia.astro"));

    expect(methodology).toContain('href="/avisos/salud"');
    expect(methodology).toContain('href="/avisos/financiero-fiscal"');
  });

  it("renders article editorial metadata and structured sources from the blog template", () => {
    const articleTemplate = read(
      join(COMPONENTS_DIR, "blog", "BlogArticlePage.astro"),
    );

    expect(articleTemplate).toContain("ArticleEditorialMeta");
    expect(articleTemplate).toContain("ArticleSources");
    expect(articleTemplate).toContain("methodologyNote");
    expect(articleTemplate).toContain("buildBlogArticleJsonLd");
  });
});
