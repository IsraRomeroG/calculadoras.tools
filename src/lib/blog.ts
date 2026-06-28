import { getCollection, type CollectionEntry } from "astro:content";
import { isBlogPostPublishable } from "./blog-publication";
import {
  CATEGORY_IDS,
  getCategory,
  getCategoryByLabel,
  getCategoryLegacySlugs,
  getCategoryLocale,
  type CategoryId,
  type CategorySlug,
} from "./constants/categories";
import { DEFAULT_LOCALE, LOCALE_CONFIG, type Locale } from "./i18n/config";
import {
  buildAlternateLinks,
  prefixLocalePath,
  type AlternateLink,
} from "./i18n/routing";

export type BlogPost = CollectionEntry<"blog">;

export interface BlogCategory {
  id: CategoryId;
  label: string;
  slug: string;
  count: number;
}

export interface PaginatedItems<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  previousPage: number | null;
  nextPage: number | null;
}

export const BLOG_POSTS_PER_PAGE = 12;

const BLOG_PAGINATION_SEGMENTS: Record<Locale, string> = {
  es: "pagina",
  en: "page",
};

const dateFormatters = new Map<Locale, Intl.DateTimeFormat>();

const getDateFormatter = (locale: Locale) => {
  const existingFormatter = dateFormatters.get(locale);

  if (existingFormatter) {
    return existingFormatter;
  }

  const formatter = new Intl.DateTimeFormat(
    LOCALE_CONFIG[locale].formatLocale,
    {
      dateStyle: "long",
      timeZone: "UTC",
    },
  );

  dateFormatters.set(locale, formatter);
  return formatter;
};

const getFileSlug = (post: Pick<BlogPost, "id">) =>
  post.id.split("/").at(-1) ?? post.id;

export const getBlogPostLocale = (post: Pick<BlogPost, "data">): Locale =>
  post.data.locale ?? DEFAULT_LOCALE;

export const getBlogPostSlug = (post: Pick<BlogPost, "id" | "data">) => {
  const locale = getBlogPostLocale(post);

  if (locale === DEFAULT_LOCALE) {
    return getFileSlug(post);
  }

  if (!post.data.slug) {
    throw new Error(`Missing localized blog slug for "${post.id}".`);
  }

  return post.data.slug;
};

export const getCategorySlug = (category: string) => {
  const metadata = getCategoryByLabel(category);

  if (!metadata) {
    throw new Error(`Unknown category label "${category}".`);
  }

  return metadata.slug;
};

export const getBlogPostCategoryId = (
  post: Pick<BlogPost, "id" | "data">,
): CategoryId => {
  const locale = getBlogPostLocale(post);

  if (locale === DEFAULT_LOCALE) {
    if (!post.data.categorySlug) {
      throw new Error(`Missing Spanish categorySlug for "${post.id}".`);
    }

    return post.data.categorySlug;
  }

  if (!post.data.categoryId) {
    throw new Error(`Missing localized categoryId for "${post.id}".`);
  }

  return post.data.categoryId;
};

export const getBlogPostCategorySlug = (
  post: Pick<BlogPost, "id" | "data">,
) => {
  const locale = getBlogPostLocale(post);
  const categoryId = getBlogPostCategoryId(post);

  if (locale === DEFAULT_LOCALE) {
    return categoryId;
  }

  const category = getCategoryLocale(categoryId, locale);

  if (!category) {
    throw new Error(
      `Missing ${locale} blog category metadata for "${categoryId}".`,
    );
  }

  return category.slug;
};

export const getBlogPostCategory = (post: Pick<BlogPost, "id" | "data">) =>
  getCategory(getBlogPostCategoryId(post), getBlogPostLocale(post));

export const getBlogPostTranslationKey = (
  post: Pick<BlogPost, "data">,
) => post.data.translationKey ?? post.data.contentId ?? null;

export const getBlogPostUrl = (post: Pick<BlogPost, "id" | "data">) =>
  prefixLocalePath(
    getBlogPostLocale(post),
    `/blog/${getBlogPostCategorySlug(post)}/${getBlogPostSlug(post)}`,
  );

export const getBlogCategoryUrl = (
  categoryId: CategoryId,
  locale: Locale = DEFAULT_LOCALE,
) => {
  const category = getCategoryLocale(categoryId, locale);

  if (!category) {
    throw new Error(`Missing ${locale} blog category metadata for "${categoryId}".`);
  }

  return prefixLocalePath(locale, `/blog/${category.slug}`);
};

export const getCategoryUrl = (categorySlug: CategorySlug) =>
  getBlogCategoryUrl(categorySlug, DEFAULT_LOCALE);

export const getBlogIndexPageUrl = (
  page: number,
  locale: Locale = DEFAULT_LOCALE,
) => {
  const blogRoot = prefixLocalePath(locale, "/blog");

  return page <= 1
    ? blogRoot
    : `${blogRoot}/${BLOG_PAGINATION_SEGMENTS[locale]}/${page}`;
};

export const getBlogCategoryPageUrl = (
  categoryId: CategoryId,
  page: number,
  locale: Locale = DEFAULT_LOCALE,
) =>
  page <= 1
    ? getBlogCategoryUrl(categoryId, locale)
    : `${getBlogCategoryUrl(categoryId, locale)}/${BLOG_PAGINATION_SEGMENTS[locale]}/${page}`;

export const getCategoryPageUrl = (
  categorySlug: CategorySlug,
  page: number,
) => getBlogCategoryPageUrl(categorySlug, page, DEFAULT_LOCALE);

export const getBlogCategoryIdByRouteSlug = (
  routeSlug: string,
  locale: Locale = DEFAULT_LOCALE,
) =>
  CATEGORY_IDS.find(
    (categoryId) => getCategoryLocale(categoryId, locale)?.slug === routeSlug,
  ) ?? null;

export const formatBlogDate = (
  date: Date,
  locale: Locale = DEFAULT_LOCALE,
) => getDateFormatter(locale).format(date);

export const sortBlogPosts = (posts: BlogPost[]) =>
  [...posts].sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );

const getBlogFilePath = (post: Pick<BlogPost, "id" | "data">) =>
  (post as { filePath?: string }).filePath?.replaceAll("\\", "/") ?? null;

const isFilePathInLocale = (
  post: Pick<BlogPost, "id" | "data">,
  locale: Locale,
) => {
  const filePath = getBlogFilePath(post);

  if (!filePath) {
    return true;
  }

  const marker = `/src/content/blog/${locale}/`;

  return filePath.includes(marker) || filePath.startsWith(marker.slice(1));
};

export const isSpanishBlogPost = (post: Pick<BlogPost, "id" | "data">) =>
  getBlogPostLocale(post) === DEFAULT_LOCALE &&
  !(
    getBlogFilePath(post)?.includes("/src/content/blog/en/") ||
    getBlogFilePath(post)?.startsWith("src/content/blog/en/")
  );

export const isBlogPostInLocale = (
  post: Pick<BlogPost, "id" | "data">,
  locale: Locale,
) =>
  locale === DEFAULT_LOCALE
    ? isSpanishBlogPost(post)
    : getBlogPostLocale(post) === locale && isFilePathInLocale(post, locale);

export const getPublishedBlogPostsByLocale = async (
  locale: Locale,
  now = new Date(),
) => {
  const posts = await getCollection("blog", (post) =>
    isBlogPostInLocale(post, locale) &&
    isBlogPostPublishable(post.data, now),
  );

  return sortBlogPosts(posts);
};

export const getPublishedBlogPosts = async (now = new Date()) =>
  getPublishedBlogPostsByLocale(DEFAULT_LOCALE, now);

export const getFeaturedBlogPost = (
  posts: BlogPost[],
): BlogPost | undefined =>
  posts.find((post) => post.data.featured) ?? posts[0];

export const getBlogListingPosts = (
  posts: BlogPost[],
  featuredPost: BlogPost | undefined,
) =>
  featuredPost
    ? posts.filter((post) => post.id !== featuredPost.id)
    : posts;

export const getBlogCategories = (
  posts: BlogPost[],
  locale: Locale = DEFAULT_LOCALE,
) => {
  const categories = new Map<CategoryId, BlogCategory>();

  posts.forEach((post) => {
    const id = getBlogPostCategoryId(post);
    const category = categories.get(id);

    if (category) {
      category.count += 1;
      return;
    }

    const metadata = getCategoryLocale(id, locale);

    if (!metadata) {
      return;
    }

    categories.set(id, {
      id,
      label: metadata.label,
      slug: metadata.slug,
      count: 1,
    });
  });

  return [...categories.values()].sort((a, b) =>
    a.label.localeCompare(b.label, LOCALE_CONFIG[locale].formatLocale),
  );
};

export const getBlogPostsByCategorySlug = (
  posts: BlogPost[],
  categorySlug: string,
) =>
  posts.filter((post) => getBlogPostCategorySlug(post) === categorySlug);

export const getBlogPostsByCategoryId = (
  posts: BlogPost[],
  categoryId: CategoryId,
) => posts.filter((post) => getBlogPostCategoryId(post) === categoryId);

export const getBlogPostAlternatePaths = (
  post: Pick<BlogPost, "id" | "data">,
  posts: Pick<BlogPost, "id" | "data">[],
) => {
  const translationKey = getBlogPostTranslationKey(post);

  if (!translationKey) {
    return {
      [getBlogPostLocale(post)]: getBlogPostUrl(post),
    } satisfies Partial<Record<Locale, string>>;
  }

  return posts.reduce<Partial<Record<Locale, string>>>((paths, candidate) => {
    if (getBlogPostTranslationKey(candidate) !== translationKey) {
      return paths;
    }

    paths[getBlogPostLocale(candidate)] = getBlogPostUrl(candidate);
    return paths;
  }, {});
};

export const buildBlogPostAlternateLinks = (
  post: Pick<BlogPost, "id" | "data">,
  posts: Pick<BlogPost, "id" | "data">[],
  site: URL | string,
): AlternateLink[] =>
  buildAlternateLinks(getBlogPostAlternatePaths(post, posts), site);

export interface BlogRouteConflict {
  route: string;
  message: string;
}

const reservedBlogCategorySlugs = new Set(["categoria", "pagina", "page"]);
const reservedBlogArticleSlugs = new Set(["pagina", "page"]);

export const getBlogRouteConflicts = (
  posts: Pick<BlogPost, "id" | "data">[],
): BlogRouteConflict[] => {
  const conflicts: BlogRouteConflict[] = [];
  const articleRoutes = new Set<string>();
  const articleSlugsByCategory = new Map<string, Set<string>>();
  const spanishLegacyArticleSlugs = new Set<string>();
  const spanishCategoryRouteSlugs = new Map<string, CategorySlug>();

  posts.forEach((post) => {
    const locale = getBlogPostLocale(post);
    const categoryId = getBlogPostCategoryId(post);
    const categorySlug = getBlogPostCategorySlug(post);
    const articleSlug = getBlogPostSlug(post);
    const articleRoute = getBlogPostUrl(post);
    const categoryKey = `${locale}:${categorySlug}`;

    if (reservedBlogArticleSlugs.has(articleSlug)) {
      conflicts.push({
        route: articleRoute,
        message: `Blog article route "${articleRoute}" is reserved for pagination.`,
      });
    }

    const slugsInCategory =
      articleSlugsByCategory.get(categoryKey) ?? new Set<string>();

    if (slugsInCategory.has(articleSlug)) {
      conflicts.push({
        route: articleRoute,
        message: `Blog article route "${articleRoute}" is duplicated within category "${categorySlug}".`,
      });
    }

    slugsInCategory.add(articleSlug);
    articleSlugsByCategory.set(categoryKey, slugsInCategory);

    if (articleRoutes.has(articleRoute)) {
      conflicts.push({
        route: articleRoute,
        message: `Blog route "${articleRoute}" is duplicated.`,
      });
    }

    articleRoutes.add(articleRoute);

    if (locale === DEFAULT_LOCALE) {
      spanishLegacyArticleSlugs.add(articleSlug);
      spanishCategoryRouteSlugs.set(categorySlug, categoryId);
      getCategoryLegacySlugs(categoryId).forEach((legacySlug) => {
        spanishCategoryRouteSlugs.set(legacySlug, categoryId);
      });
    }
  });

  spanishCategoryRouteSlugs.forEach((targetCategorySlug, routeSlug) => {
    if (reservedBlogCategorySlugs.has(routeSlug)) {
      conflicts.push({
        route: `/blog/${routeSlug}`,
        message: `Blog category route "/blog/${routeSlug}" is reserved.`,
      });
    }

    if (spanishLegacyArticleSlugs.has(routeSlug)) {
      conflicts.push({
        route: `/blog/${routeSlug}`,
        message: `Legacy blog article redirect "/blog/${routeSlug}" conflicts with category route "${getCategoryUrl(targetCategorySlug)}".`,
      });
    }
  });

  return conflicts;
};

export const assertNoBlogRouteConflicts = (
  posts: Pick<BlogPost, "id" | "data">[],
) => {
  const conflicts = getBlogRouteConflicts(posts);

  if (conflicts.length > 0) {
    throw new Error(conflicts.map((conflict) => conflict.message).join("\n"));
  }
};

export const paginateItems = <T>(
  items: T[],
  currentPage: number,
  pageSize = BLOG_POSTS_PER_PAGE,
): PaginatedItems<T> => {
  if (pageSize < 1) {
    throw new Error("pageSize must be greater than 0");
  }

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = items.slice(startIndex, startIndex + pageSize);

  return {
    items: pageItems,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    previousPage: currentPage > 1 ? currentPage - 1 : null,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
  };
};
