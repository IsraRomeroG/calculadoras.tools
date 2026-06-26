import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const BASE_LAYOUT_PATH = fileURLToPath(
  new URL("../layouts/BaseLayout.astro", import.meta.url),
);

const readBaseLayout = () => readFileSync(BASE_LAYOUT_PATH, "utf8");

function getTitleBlock(content: string): string {
  const titleBlock = content.match(/<title>[\s\S]*?<\/title>/);

  expect(titleBlock).not.toBeNull();

  return titleBlock?.[0] ?? "";
}

describe("base layout title", () => {
  it("renders page titles without the site suffix", () => {
    const content = readBaseLayout();
    const titleBlock = getTitleBlock(content);

    expect(content).not.toContain("`${title} | Calculadoras.Tools`");
    expect(titleBlock).not.toContain("| Calculadoras.Tools");
  });

  it("keeps the default title fallback", () => {
    const content = readBaseLayout();

    expect(content).toContain('title = "calculadoras.tools"');
  });
});
