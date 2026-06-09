import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const sourcePaths = [
  join(process.cwd(), "src", "components"),
  join(process.cwd(), "src", "content"),
  join(process.cwd(), "src", "pages"),
  join(process.cwd(), "src", "lib", "constants", "calculators.ts"),
  join(process.cwd(), "src", "lib", "constants", "menu.ts"),
];

const supportedExtensions = new Set([".astro", ".md", ".ts"]);
const internalLinkPatterns = [
  /\bhref\s*=\s*["'](\/[^"']*)["']/g,
  /\b(?:href|relatedHref|slug):\s*["'](\/[^"']*)["']/g,
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

const needsTrailingSlash = (url: string) => {
  const path = url.split(/[?#]/, 1)[0];

  return path !== "/" && !path.endsWith("/") && !extname(path);
};

describe("internal links", () => {
  it("points literal page links to URLs with trailing slashes", () => {
    const violations = sourcePaths
      .flatMap(getSourceFiles)
      .flatMap((filePath) => {
        const content = readFileSync(filePath, "utf8");

        return internalLinkPatterns.flatMap((pattern) =>
          Array.from(content.matchAll(pattern))
            .map((match) => match[1])
            .filter(needsTrailingSlash)
            .map(
              (url) =>
                `${relative(process.cwd(), filePath)}: add trailing slash to ${url}`,
            ),
        );
      });

    expect(violations).toEqual([]);
  });
});
