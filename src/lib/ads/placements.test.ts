import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CALCULATORS } from "../constants/calculators";

const PAGES_DIR = fileURLToPath(new URL("../../pages/", import.meta.url));

function read(path: string): string {
  return readFileSync(path, "utf8");
}

const getCalculatorPagePath = (href: string) => {
  const segments = href.replace(/^\//, "").split("/");

  return join(PAGES_DIR, ...segments) + ".astro";
};

describe("advertising placements", () => {
  it("keeps ads off navigational listing pages", () => {
    [
      ["index.astro"],
      ["[category].astro"],
      ["blog.astro"],
      ["blog", "[category].astro"],
      ["blog", "pagina", "[page].astro"],
      ["blog", "[category]", "pagina", "[page].astro"],
    ].forEach((pageSegments) => {
      const page = join(PAGES_DIR, ...pageSegments);

      expect(read(page), pageSegments.join("/")).not.toContain("<AdSlot");
    });
  });

  it("allows at most one after-tool ad on published calculator pages", () => {
    CALCULATORS.filter((calculator) => !calculator.draft).forEach(
      (calculator) => {
        const page = getCalculatorPagePath(calculator.href);
        const content = read(page);
        const placements = content.match(/<AdSlot\b/g) ?? [];

        expect(placements.length, calculator.href).toBeLessThanOrEqual(1);
        expect(content, calculator.href).not.toContain(
          'placement="calculator-before-faq"',
        );

        if (placements.length > 0) {
          expect(content, calculator.href).toContain(
            'placement="calculator-after-tool"',
          );
        }
      },
    );
  });

  it("uses at most one placement on blog posts", () => {
    const postTemplate = read(
      join(PAGES_DIR, "..", "components", "blog", "BlogArticlePage.astro"),
    );
    const placements = postTemplate.match(/<AdSlot\b/g) ?? [];

    expect(placements).toHaveLength(1);
    expect(postTemplate).not.toContain('placement="blog-post-after-header"');
    expect(postTemplate).toContain('placement="blog-post-sidebar"');
    expect(postTemplate).toContain('variant="rectangle"');
    expect(postTemplate).toContain('const shouldRenderAds = locale === "es"');
  });

  it("keeps ads off utility and trust pages", () => {
    [
      ["privacidad.astro"],
      ["contacto.astro"],
      ["404.astro"],
      ["acerca-de.astro"],
      ["metodologia.astro"],
      ["politica-editorial.astro"],
      ["correcciones.astro"],
      ["avisos", "salud.astro"],
      ["avisos", "financiero-fiscal.astro"],
    ].forEach((pageSegments) => {
      const page = join(PAGES_DIR, ...pageSegments);

      expect(read(page), pageSegments.join("/")).not.toContain("<AdSlot");
    });
  });
});
