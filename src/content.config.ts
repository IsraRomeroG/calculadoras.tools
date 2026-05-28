import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { CATEGORY_SLUGS } from "./lib/constants/categories";

const blog = defineCollection({
  loader: glob({
    base: "./src/content/blog",
    pattern: "**/*.{md,mdx}",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    categorySlug: z.enum(CATEGORY_SLUGS),
    tags: z.array(z.string()).default([]),
    readTime: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    relatedCalculator: z
      .object({
        label: z.string(),
        href: z.string(),
      })
      .optional(),
    seoTitle: z.string().optional(),
  }),
});

export const collections = { blog };
