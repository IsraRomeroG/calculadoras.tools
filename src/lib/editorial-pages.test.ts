import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getFooterLinks } from "./i18n/shell";

const ROOT = process.cwd();
const PAGES_DIR = join(ROOT, "src", "pages");
const COMPONENTS_DIR = join(ROOT, "src", "components");
const PUBLIC_DIR = join(ROOT, "public");

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
    expect(getFooterLinks("en").map((link) => link.href)).toEqual(
      expect.arrayContaining([
        "/en/privacy",
        "/en/contact",
        "/en/about",
        "/en/methodology",
        "/en/editorial-policy",
        "/en/corrections",
      ]),
    );
  });

  it("keeps notice pages discoverable before YMYL migration", () => {
    const methodology = read(join(PAGES_DIR, "metodologia.astro"));

    expect(methodology).toContain('href="/avisos/salud"');
    expect(methodology).toContain('href="/avisos/financiero-fiscal"');

    const englishMethodology = read(
      join(PAGES_DIR, "en", "methodology.astro"),
    );

    expect(englishMethodology).toContain('href="/en/notices/health"');
    expect(englishMethodology).toContain(
      'href="/en/notices/financial-tax"',
    );
  });

  it("serves the localized static 404 page for missing English URLs", () => {
    const englishHtaccess = read(join(PUBLIC_DIR, "en", ".htaccess"));

    expect(englishHtaccess).toContain("ErrorDocument 404 /en/404");
    expect(read(join(PAGES_DIR, "en", "404.astro"))).toContain(
      'locale="en"',
    );
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
