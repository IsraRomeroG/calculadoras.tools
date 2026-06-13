import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const PAGES_DIR = fileURLToPath(new URL("../../pages/", import.meta.url));

function getAstroPages(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return getAstroPages(path);
    }

    return entry.isFile() && entry.name.endsWith(".astro") ? [path] : [];
  });
}

function read(path: string): string {
  return readFileSync(path, "utf8");
}

describe("advertising placements", () => {
  const pages = getAstroPages(PAGES_DIR);
  const calculatorPages = pages.filter((page) =>
    read(page).includes("@lib/calculators/"),
  );

  it("places one or two ads on every calculator page", () => {
    calculatorPages.forEach((page) => {
      const placements = read(page).match(/<AdSlot\b/g) ?? [];
      expect(placements.length, page).toBeGreaterThanOrEqual(1);
      expect(placements.length, page).toBeLessThanOrEqual(2);
      expect(read(page), page).toContain('placement="calculator-after-tool"');
    });
  });

  it("keeps ads off utility pages", () => {
    ["privacidad.astro", "contacto.astro", "404.astro"].forEach((page) => {
      expect(read(join(PAGES_DIR, page)), page).not.toContain("<AdSlot");
    });
  });

  it("uses exactly two placements on blog posts", () => {
    const postTemplate = read(
      join(PAGES_DIR, "blog", "[category]", "[slug].astro"),
    );

    expect(postTemplate.match(/<AdSlot\b/g)).toHaveLength(2);
    expect(postTemplate).toContain('variant="rectangle"');
  });
});
