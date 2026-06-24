import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, extname, join } from "node:path";

export const BLOG_CONTENT_DIR_MARKDOWN_EXTENSION = ".md";
export const BLOG_PUBLICATION_TIME_ZONE = "America/Mexico_City";

const editorialDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: BLOG_PUBLICATION_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const padDatePart = (value) => String(value).padStart(2, "0");

export const getBlogPublicationDateKey = (date) =>
  [
    date.getUTCFullYear(),
    padDatePart(date.getUTCMonth() + 1),
    padDatePart(date.getUTCDate()),
  ].join("-");

export const getEditorialDateKey = (date) => {
  const parts = editorialDateFormatter.formatToParts(date);
  const values = parts.reduce((result, part) => {
    if (part.type !== "literal") {
      result[part.type] = part.value;
    }

    return result;
  }, {});

  return `${values.year}-${values.month}-${values.day}`;
};

export const getMarkdownFiles = (directory) => {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return getMarkdownFiles(entryPath);
    }

    return entry.isFile() &&
      extname(entry.name) === BLOG_CONTENT_DIR_MARKDOWN_EXTENSION
      ? [entryPath]
      : [];
  });
};

export const getFrontmatterValue = (content, key) => {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!frontmatter) {
    return null;
  }

  const value = new RegExp(`^${key}:\\s*(.+?)\\s*$`, "m").exec(
    frontmatter[1],
  )?.[1];

  return value?.trim().replace(/^['"]|['"]$/g, "") ?? null;
};

export const isPublishableBlogContent = (content, now = new Date()) => {
  const draft = getFrontmatterValue(content, "draft") === "true";
  const pubDate = getFrontmatterValue(content, "pubDate");

  if (draft || !pubDate) {
    return false;
  }

  return (
    getBlogPublicationDateKey(new Date(pubDate)) <= getEditorialDateKey(now)
  );
};

const getPublishableBlogFiles = (blogContentDir, now = new Date()) =>
  getMarkdownFiles(blogContentDir).filter((filePath) =>
    isPublishableBlogContent(readFileSync(filePath, "utf8"), now),
  );

export const getPublishedBlogArticlePathsForSitemap = (
  blogContentDir,
  now = new Date(),
) =>
  new Set(
    getPublishableBlogFiles(blogContentDir, now).map((filePath) => {
      const content = readFileSync(filePath, "utf8");
      const categorySlug = getFrontmatterValue(content, "categorySlug");
      const articleSlug = basename(
        filePath,
        BLOG_CONTENT_DIR_MARKDOWN_EXTENSION,
      );

      return categorySlug ? `/blog/${categorySlug}/${articleSlug}` : null;
    }).filter(Boolean),
  );

export const getLegacyBlogArticleSlugsForSitemap = (
  blogContentDir,
  now = new Date(),
) =>
  new Set(
    getPublishableBlogFiles(blogContentDir, now).map((filePath) =>
      basename(filePath, BLOG_CONTENT_DIR_MARKDOWN_EXTENSION),
    ),
  );

export const getPublishedBlogCategorySlugsForSitemap = (
  blogContentDir,
  now = new Date(),
) =>
  new Set(
    getPublishableBlogFiles(blogContentDir, now)
      .map((filePath) => {
        const content = readFileSync(filePath, "utf8");

        return getFrontmatterValue(content, "categorySlug");
      })
      .filter(Boolean),
  );

export const createSitemapFilter =
  ({
    legacyBlogArticleSlugs,
    publishedBlogArticlePaths,
    publishedBlogCategorySlugs,
  }) =>
  (page) => {
    const path = new URL(page).pathname.replace(/\/$/, "");

    if (path === "/blog/categoria" || path.startsWith("/blog/categoria/")) {
      return false;
    }

    const blogSegments = path.split("/").filter(Boolean);

    if (blogSegments[0] !== "blog" || blogSegments.length === 1) {
      return true;
    }

    if (blogSegments[1] === "pagina") {
      return true;
    }

    if (
      blogSegments.length === 2 &&
      legacyBlogArticleSlugs.has(blogSegments[1])
    ) {
      return false;
    }

    if (blogSegments.length === 2) {
      return publishedBlogCategorySlugs.has(blogSegments[1]);
    }

    if (blogSegments[2] === "pagina") {
      return publishedBlogCategorySlugs.has(blogSegments[1]);
    }

    return publishedBlogArticlePaths.has(path);
  };
