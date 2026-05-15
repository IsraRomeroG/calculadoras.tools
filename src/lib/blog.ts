import { getCollection, type CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export interface BlogCategory {
  label: string;
  slug: string;
  count: number;
}

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "long",
  timeZone: "UTC",
});

export const getBlogPostUrl = (post: Pick<BlogPost, "id">) =>
  `/blog/${post.id}`;

export const getCategorySlug = (category: string) =>
  category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getCategoryUrl = (category: string) =>
  `/blog/categoria/${getCategorySlug(category)}`;

export const formatBlogDate = (date: Date) => dateFormatter.format(date);

export const sortBlogPosts = (posts: BlogPost[]) =>
  [...posts].sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );

export const getPublishedBlogPosts = async () => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  return sortBlogPosts(posts);
};

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
