import { readdirSync, readFileSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const blogContentDir = join(process.cwd(), "src", "content", "blog");
const markdownExtension = ".md";
const articleLinkPattern = /\/blog\/([a-z0-9-]+)\/?(?=([)#?\s"']))/g;
const categorySlugPattern = /^categorySlug:\s*["']?([^"'\r\n]+)["']?\s*$/m;
const retiredArticleSlugs = [
  "cuanto-debo-pesar-si-mido-150",
  "cuanto-debo-pesar-si-mido-155",
  "cuanto-debo-pesar-si-mido-160",
  "cuanto-debo-pesar-si-mido-165",
  "cuanto-debo-pesar-si-mido-170",
  "cuanto-debo-pesar-si-mido-175",
  "cuanto-debo-pesar-si-mido-180",
  "cuanto-debo-pesar-si-mido-185",
  "tabla-peso-saludable-150-195",
  "hipoteca-1000000-cuanto-pago",
  "hipoteca-1500000-cuanto-pago",
  "hipoteca-2000000-cuanto-pago",
  "hipoteca-3000000-cuanto-pago",
  "prestamo-50000-cuanto-pago",
  "prestamo-100000-cuanto-pago",
];

const getMarkdownFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return getMarkdownFiles(entryPath);
    }

    return entry.isFile() && extname(entry.name) === markdownExtension
      ? [entryPath]
      : [];
  });

const getArticleSlug = (filePath: string) =>
  basename(filePath, markdownExtension);

const getCategorySlug = (content: string, filePath: string) => {
  const categorySlug = content.match(categorySlugPattern)?.[1];

  if (!categorySlug) {
    throw new Error(
      `Missing categorySlug in ${relative(process.cwd(), filePath)}`,
    );
  }

  return categorySlug;
};

describe("blog content links", () => {
  it("uses canonical category URLs for internal article links", () => {
    const markdownFiles = getMarkdownFiles(blogContentDir);
    const canonicalArticleUrls = new Map<string, string>();

    for (const filePath of markdownFiles) {
      const content = readFileSync(filePath, "utf8");
      const articleSlug = getArticleSlug(filePath);
      const categorySlug = getCategorySlug(content, filePath);

      canonicalArticleUrls.set(
        articleSlug,
        `/blog/${categorySlug}/${articleSlug}`,
      );
    }

    const legacyLinks = markdownFiles.flatMap((filePath) => {
      const relativePath = relative(process.cwd(), filePath);
      const content = readFileSync(filePath, "utf8");
      const matches = content.matchAll(articleLinkPattern);

      return Array.from(matches)
        .map((match) => {
          const legacyUrl = `/blog/${match[1]}`;
          const canonicalUrl = canonicalArticleUrls.get(match[1]);

          return canonicalUrl
            ? `${relativePath}: replace ${legacyUrl} with ${canonicalUrl}`
            : undefined;
        })
        .filter((message): message is string => Boolean(message));
    });

    expect(legacyLinks).toEqual([]);
  });

  it("does not link to consolidated article URLs", () => {
    const markdownFiles = getMarkdownFiles(blogContentDir);
    const retiredLinks = markdownFiles.flatMap((filePath) => {
      const relativePath = relative(process.cwd(), filePath);
      const content = readFileSync(filePath, "utf8");

      return retiredArticleSlugs.flatMap((slug) => {
        const retiredLinkPattern = new RegExp(
          `/blog/(?:[a-z0-9-]+/)?${slug}/?(?=([)#?\\s"']))`,
          "g",
        );

        return Array.from(content.matchAll(retiredLinkPattern)).map(
          (match) => `${relativePath}: replace retired link ${match[0]}`,
        );
      });
    });

    expect(retiredLinks).toEqual([]);
  });
});
