import { getCollection, type CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export interface BlogCategory {
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

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "long",
  timeZone: "UTC",
});

export const getBlogPostSlug = (post: Pick<BlogPost, "id">) =>
  post.id.split("/").at(-1) ?? post.id;

export const getBlogPostUrl = (post: Pick<BlogPost, "id">) =>
  `/blog/${getBlogPostSlug(post)}`;

export const getCategorySlug = (category: string) =>
  category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getCategoryUrl = (category: string) =>
  `/blog/categoria/${getCategorySlug(category)}`;

export const getBlogIndexPageUrl = (page: number) =>
  page <= 1 ? "/blog" : `/blog/pagina/${page}`;

export const getCategoryPageUrl = (category: string, page: number) =>
  page <= 1
    ? getCategoryUrl(category)
    : `${getCategoryUrl(category)}/pagina/${page}`;

export const formatBlogDate = (date: Date) => dateFormatter.format(date);

export const sortBlogPosts = (posts: BlogPost[]) =>
  [...posts].sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );

export const getPublishedBlogPosts = async () => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

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
  const categories = new Map<string, BlogCategory>();

  posts.forEach((post) => {
    const label = post.data.category;
    const slug = getCategorySlug(label);
    const category = categories.get(slug);

    if (category) {
      category.count += 1;
      return;
    }

    categories.set(slug, { label, slug, count: 1 });
  });

  return [...categories.values()].sort((a, b) =>
    a.label.localeCompare(b.label, "es"),
  );
};

export const getBlogPostsByCategorySlug = (
  posts: BlogPost[],
  categorySlug: string,
) =>
  posts.filter((post) => getCategorySlug(post.data.category) === categorySlug);

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
