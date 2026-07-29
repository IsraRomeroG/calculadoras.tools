import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const sourcePaths = [
  join(process.cwd(), "src", "components"),
  join(process.cwd(), "src", "content"),
  join(process.cwd(), "src", "pages"),
  join(process.cwd(), "src", "lib", "constants", "calculators.ts"),
  join(process.cwd(), "src", "lib", "constants", "menu.ts"),
  join(process.cwd(), "src", "lib", "i18n"),
];

const supportedExtensions = new Set([".astro", ".md", ".ts"]);
const localizedPilotRoutes = [
  "/en",
  "/en/math",
  "/en/math/percentage-calculator",
  "/en/blog",
  "/en/blog/math",
  "/en/blog/math/how-to-calculate-percentages",
  "/en/about",
  "/en/contact",
  "/en/corrections",
  "/en/methodology",
  "/en/editorial-policy",
  "/en/privacy",
  "/en/notices/financial-tax",
  "/en/notices/health",
];
const unpublishedEnglishRoutes = new Set([
  "/en/blog/pagina",
]);
const internalLinkPatterns = [
  /\bhref\s*=\s*["'](\/[^"']*)["']/g,
  /\b(?:href|relatedHref|slug):\s*["'](\/[^"']*)["']/g,
  /\bcanonical\s*[:=]\s*["'](\/[^"']*)["']/g,
  /\]\((\/[^)\s]+)(?:\s+["'][^"']*["'])?\)/g,
  /new URL\(\s*["'](\/[^"']*)["']/g,
];

const getSourceFiles = (path: string): string[] => {
  if (!statSync(path).isDirectory()) {
    return [path];
  }

  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(path, entry.name);

    if (entry.isDirectory()) {
      return getSourceFiles(entryPath);
    }

    return supportedExtensions.has(extname(entry.name)) ? [entryPath] : [];
  });
};

const hasTrailingSlash = (url: string) => {
  const path = url.split(/[?#]/, 1)[0];

  return path !== "/" && path.endsWith("/") && !extname(path);
};

const isUnpublishedEnglishRoute = (url: string) => {
  const path = url.split(/[?#]/, 1)[0];

  return [...unpublishedEnglishRoutes].some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
};

const collectInternalLinks = () =>
  sourcePaths.flatMap(getSourceFiles).flatMap((filePath) => {
    const content = readFileSync(filePath, "utf8");

    return internalLinkPatterns.flatMap((pattern) =>
      Array.from(content.matchAll(pattern)).map((match) => ({
        filePath,
        url: match[1],
      })),
    );
  });

describe("internal links", () => {
  it("points literal page links to URLs without trailing slashes", () => {
    const violations = collectInternalLinks()
      .filter(({ url }) => hasTrailingSlash(url))
      .map(
        ({ filePath, url }) =>
          `${relative(process.cwd(), filePath)}: remove trailing slash from ${url}`,
      );

    expect(violations).toEqual([]);
  });

  it("keeps localized pilot routes canonical without trailing slashes", () => {
    localizedPilotRoutes.forEach((route) => {
      expect(hasTrailingSlash(route)).toBe(false);
    });
  });

  it("does not link to unpublished English routes", () => {
    const violations = collectInternalLinks()
      .filter(({ url }) => isUnpublishedEnglishRoute(url))
      .map(
        ({ filePath, url }) =>
          `${relative(process.cwd(), filePath)}: remove unpublished English link ${url}`,
      );

    expect(violations).toEqual([]);
  });
});
