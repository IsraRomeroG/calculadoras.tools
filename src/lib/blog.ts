import { getCollection, type CollectionEntry } from "astro:content";
import { isBlogPostPublishable } from "./blog-publication";
import {
  getCategory,
  getCategoryByLabel,
  getCategoryLegacySlugs,
  type CategorySlug,
} from "./constants/categories";

export type BlogPost = CollectionEntry<"blog">;

export interface BlogCategory {
  label: string;
  slug: CategorySlug;
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

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "long",
  timeZone: "UTC",
});

export const getBlogPostSlug = (post: Pick<BlogPost, "id">) =>
  post.id.split("/").at(-1) ?? post.id;

export const getCategorySlug = (category: string) => {
  const metadata = getCategoryByLabel(category);

  if (!metadata) {
    throw new Error(`Unknown category label "${category}".`);
  }

  return metadata.slug;
};

export const getBlogPostCategorySlug = (post: Pick<BlogPost, "data">) =>
  post.data.categorySlug;

export const getBlogPostCategory = (post: Pick<BlogPost, "data">) =>
  getCategory(getBlogPostCategorySlug(post));

export const getBlogPostUrl = (post: Pick<BlogPost, "id" | "data">) =>
  `/blog/${getBlogPostCategorySlug(post)}/${getBlogPostSlug(post)}`;

export const getCategoryUrl = (categorySlug: CategorySlug) =>
  `/blog/${categorySlug}`;

export const getBlogIndexPageUrl = (page: number) =>
  page <= 1 ? "/blog" : `/blog/pagina/${page}`;

export const getCategoryPageUrl = (categorySlug: CategorySlug, page: number) =>
  page <= 1
    ? getCategoryUrl(categorySlug)
    : `${getCategoryUrl(categorySlug)}/pagina/${page}`;

export const formatBlogDate = (date: Date) => dateFormatter.format(date);

export const sortBlogPosts = (posts: BlogPost[]) =>
  [...posts].sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );

export const getPublishedBlogPosts = async (now = new Date()) => {
  const posts = await getCollection("blog", ({ data }) =>
    isBlogPostPublishable(data, now),
  );

  return sortBlogPosts(posts);
};

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

export const getBlogCategories = (posts: BlogPost[]) => {
  const categories = new Map<CategorySlug, BlogCategory>();

  posts.forEach((post) => {
    const slug = getBlogPostCategorySlug(post);
    const category = categories.get(slug);

    if (category) {
      category.count += 1;
      return;
    }

    const metadata = getCategory(slug);

    categories.set(slug, { label: metadata.label, slug, count: 1 });
  });

  return [...categories.values()].sort((a, b) =>
    a.label.localeCompare(b.label, "es"),
  );
};

export const getBlogPostsByCategorySlug = (
  posts: BlogPost[],
  categorySlug: CategorySlug,
) =>
  posts.filter((post) => getBlogPostCategorySlug(post) === categorySlug);

export interface BlogRouteConflict {
  route: string;
  message: string;
}

const reservedBlogCategorySlugs = new Set(["categoria", "pagina"]);
const reservedBlogArticleSlugs = new Set(["pagina"]);

export const getBlogRouteConflicts = (
  posts: Pick<BlogPost, "id" | "data">[],
): BlogRouteConflict[] => {
  const conflicts: BlogRouteConflict[] = [];
  const categoryLabels = new Map<CategorySlug, string>();
  const articleRoutes = new Set<string>();
  const legacyArticleSlugs = new Set<string>();
  const articleSlugsByCategory = new Map<CategorySlug, Set<string>>();

  posts.forEach((post) => {
    const categorySlug = getBlogPostCategorySlug(post);
    const articleSlug = getBlogPostSlug(post);
    const articleRoute = getBlogPostUrl(post);

    categoryLabels.set(categorySlug, getCategory(categorySlug).label);

    if (reservedBlogArticleSlugs.has(articleSlug)) {
      conflicts.push({
        route: articleRoute,
        message: `Blog article route "${articleRoute}" is reserved for pagination.`,
      });
    }

    const slugsInCategory =
      articleSlugsByCategory.get(categorySlug) ?? new Set<string>();

    if (slugsInCategory.has(articleSlug)) {
      conflicts.push({
        route: articleRoute,
        message: `Blog article route "${articleRoute}" is duplicated within category "${categorySlug}".`,
      });
    }

    slugsInCategory.add(articleSlug);
    articleSlugsByCategory.set(categorySlug, slugsInCategory);

    if (articleRoutes.has(articleRoute)) {
      conflicts.push({
        route: articleRoute,
        message: `Blog route "${articleRoute}" is duplicated.`,
      });
    }

    articleRoutes.add(articleRoute);
    legacyArticleSlugs.add(articleSlug);
  });

  const categoryRouteSlugs = new Map<string, CategorySlug>();

  categoryLabels.forEach((_, categorySlug) => {
    categoryRouteSlugs.set(categorySlug, categorySlug);
    getCategoryLegacySlugs(categorySlug).forEach((legacySlug) => {
      categoryRouteSlugs.set(legacySlug, categorySlug);
    });
  });

  categoryRouteSlugs.forEach((targetCategorySlug, routeSlug) => {
    if (reservedBlogCategorySlugs.has(routeSlug)) {
      conflicts.push({
        route: `/blog/${routeSlug}`,
        message: `Blog category route "/blog/${routeSlug}" is reserved.`,
      });
    }

    if (legacyArticleSlugs.has(routeSlug)) {
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
