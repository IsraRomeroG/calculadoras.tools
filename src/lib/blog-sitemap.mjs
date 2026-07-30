import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, extname, join } from "node:path";

export const BLOG_CONTENT_DIR_MARKDOWN_EXTENSION = ".md";
export const BLOG_PUBLICATION_TIME_ZONE = "America/Mexico_City";

const LOCALIZED_BLOG_CATEGORY_SLUGS = {
  en: {
    finanzas: "finance",
    inmuebles: "real-estate",
    "legal-impuestos": "legal-tax",
    matematicas: "math",
    "probabilidad-estadistica": "probability-statistics",
    programacion: "programming",
    geometria: "geometry",
    salud: "health",
    "fecha-tiempo": "date-time",
    conversores: "converters",
    mascotas: "pets",
    cocina: "cooking",
    eventos: "events",
    restaurantes: "restaurants",
    vehiculos: "vehicles",
    construccion: "construction",
  },
};

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

const getBlogContentLocale = (content, filePath, blogContentDir) => {
  const locale = getFrontmatterValue(content, "locale");

  if (locale) {
    return locale;
  }

  return filePath
    .slice(blogContentDir.length)
    .replace(/^[/\\]+/, "")
    .startsWith("en/")
    ? "en"
    : "es";
};

const getLocalizedCategorySlug = (locale, categoryId) =>
  locale === "es"
    ? categoryId
    : LOCALIZED_BLOG_CATEGORY_SLUGS[locale]?.[categoryId] ?? null;

const getPublishedBlogPathForFile = (blogContentDir, filePath) => {
  const content = readFileSync(filePath, "utf8");
  const locale = getBlogContentLocale(content, filePath, blogContentDir);

  if (locale === "es") {
    const categorySlug = getFrontmatterValue(content, "categorySlug");
    const articleSlug = basename(
      filePath,
      BLOG_CONTENT_DIR_MARKDOWN_EXTENSION,
    );

    return categorySlug ? `/blog/${categorySlug}/${articleSlug}` : null;
  }

  const categoryId = getFrontmatterValue(content, "categoryId");
  const articleSlug =
    getFrontmatterValue(content, "slug") ??
    basename(filePath, BLOG_CONTENT_DIR_MARKDOWN_EXTENSION);
  const categorySlug = categoryId
    ? getLocalizedCategorySlug(locale, categoryId)
    : null;

  return categorySlug
    ? `/${locale}/blog/${categorySlug}/${articleSlug}`
    : null;
};

export const getPublishedBlogArticlePathsForSitemap = (
  blogContentDir,
  now = new Date(),
) =>
  new Set(
    getPublishableBlogFiles(blogContentDir, now)
      .map((filePath) => getPublishedBlogPathForFile(blogContentDir, filePath))
      .filter(Boolean),
  );

export const getLegacyBlogArticleSlugsForSitemap = (
  blogContentDir,
  now = new Date(),
) =>
  new Set(
    getPublishableBlogFiles(blogContentDir, now)
      .filter((filePath) => {
        const content = readFileSync(filePath, "utf8");

        return getBlogContentLocale(content, filePath, blogContentDir) === "es";
      })
      .map((filePath) => basename(filePath, BLOG_CONTENT_DIR_MARKDOWN_EXTENSION)),
  );

export const getPublishedBlogCategorySlugsForSitemap = (
  blogContentDir,
  now = new Date(),
) =>
  new Set(
    getPublishableBlogFiles(blogContentDir, now)
      .map((filePath) => {
        const content = readFileSync(filePath, "utf8");

        return getBlogContentLocale(content, filePath, blogContentDir) === "es"
          ? getFrontmatterValue(content, "categorySlug")
          : null;
      })
      .filter(Boolean),
  );

export const getPublishedBlogCategoryPathsForSitemap = (
  blogContentDir,
  now = new Date(),
) =>
  new Set(
    getPublishableBlogFiles(blogContentDir, now)
      .map((filePath) => {
        const content = readFileSync(filePath, "utf8");
        const locale = getBlogContentLocale(content, filePath, blogContentDir);
        const categoryId =
          locale === "es"
            ? getFrontmatterValue(content, "categorySlug")
            : getFrontmatterValue(content, "categoryId");
        const categorySlug = categoryId
          ? getLocalizedCategorySlug(locale, categoryId)
          : null;

        return categorySlug
          ? `${locale === "es" ? "" : `/${locale}`}/blog/${categorySlug}`
          : null;
      })
      .filter(Boolean),
  );

const getSitemapPath = (page) => {
  const path = new URL(page, "https://calculadoras.tools").pathname.replace(
    /\/$/,
    "",
  );

  return path || "/";
};

export const createSitemapFilter =
  ({
    legacyBlogArticleSlugs,
    publishedBlogArticlePaths,
    publishedBlogCategoryPaths = new Set(),
    publishedBlogCategorySlugs,
    excludedPaths = [],
  }) =>
  {
    const excludedPathSet = new Set([...excludedPaths].map(getSitemapPath));

    return (page) => {
      const path = getSitemapPath(page);

      if (
        excludedPathSet.has(path) ||
        [...excludedPathSet].some((excludedPath) =>
          path.startsWith(`${excludedPath}/`),
        )
      ) {
        return false;
      }

      if (path === "/blog/categoria" || path.startsWith("/blog/categoria/")) {
        return false;
      }

      const blogSegments = path.split("/").filter(Boolean);

      if (blogSegments[0] === "en" && blogSegments[1] === "blog") {
        const hasEnglishBlogContent = [...publishedBlogCategoryPaths].some(
          (categoryPath) => categoryPath.startsWith("/en/blog/"),
        );

        if (!hasEnglishBlogContent) {
          return false;
        }

        if (blogSegments.length === 2) {
          return true;
        }

        if (blogSegments[2] === "page") {
          return true;
        }

        const categoryPath = `/en/blog/${blogSegments[2]}`;

        if (blogSegments.length === 3) {
          return publishedBlogCategoryPaths.has(categoryPath);
        }

        if (blogSegments[3] === "page") {
          return publishedBlogCategoryPaths.has(categoryPath);
        }

        return publishedBlogArticlePaths.has(path);
      }

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
  };
