import { describe, expect, it } from "vitest";
import { LOCALES } from "@lib/i18n/config";
import { percentageCalculatorContent } from "./percentage";

describe("localized percentage calculator content", () => {
  it("keeps required content sections for every locale", () => {
    const requiredSections = [
      "seo",
      "hero",
      "breadcrumbs",
      "tabs",
      "fields",
      "client",
      "faq",
      "examples",
      "relatedGuides",
      "quickReference",
    ];

    LOCALES.forEach((locale) => {
      const content = percentageCalculatorContent[locale];

      requiredSections.forEach((section) => {
        expect(content).toHaveProperty(section);
      });
      expect(content.faq.length).toBeGreaterThan(0);
      expect(content.examples.length).toBeGreaterThan(0);
      expect(content.quickReference.length).toBeGreaterThan(0);
    });
  });

  it("does not link English related content to Spanish blog routes", () => {
    const englishContent = percentageCalculatorContent.en;
    const englishGuideUrls = englishContent.relatedGuides
      .filter((guide) => guide.published)
      .map((guide) => guide.href);
    const englishExampleUrls = englishContent.examples.flatMap((example) =>
      example.href ? [example.href] : [],
    );

    [...englishGuideUrls, ...englishExampleUrls].forEach((url) => {
      expect(url).not.toMatch(/^\/blog\//);
    });
  });
});
