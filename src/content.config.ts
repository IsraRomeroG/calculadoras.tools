import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { blogSchema } from "./lib/blog-schema";

const getBlogEntryId = ({ entry }: { entry: string }) =>
  entry.replaceAll("\\", "/").replace(/\.(md|mdx)$/i, "");

const blog = defineCollection({
  loader: glob({
    base: "./src/content/blog",
    pattern: "**/*.{md,mdx}",
    generateId: getBlogEntryId,
  }),
  schema: blogSchema,
});

export const collections = { blog };
