import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getMenuItems } from "@lib/constants/menu";
import { percentageCalculatorContent } from "@lib/i18n/calculators/percentage";

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
});
