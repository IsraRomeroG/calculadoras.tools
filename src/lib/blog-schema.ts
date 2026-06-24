import { z } from "astro/zod";
import { CATEGORY_SLUGS } from "./constants/categories";

export const editorialEntitySchema = z.object({
  name: z.string(),
  url: z.string().optional(),
});

export const reviewerSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
  role: z.string().optional(),
});

export const sourceSchema = z.object({
  label: z.string(),
  url: z.string().url(),
  publisher: z.string().optional(),
  accessedDate: z.coerce.date().optional(),
});

export const relatedCalculatorSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const blogSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    categorySlug: z.enum(CATEGORY_SLUGS),
    tags: z.array(z.string()).default([]),
    readTime: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    relatedCalculator: relatedCalculatorSchema.optional(),
    seoTitle: z.string().optional(),
    author: editorialEntitySchema.optional(),
    reviewer: reviewerSchema.optional(),
    reviewedDate: z.coerce.date().optional(),
    reviewNote: z.string().optional(),
    sources: z.array(sourceSchema).default([]),
    methodologyNote: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.reviewedDate &&
      !data.reviewer &&
      !data.reviewNote?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "reviewedDate requires reviewer or reviewNote so the visible review can be verified.",
        path: ["reviewedDate"],
      });
    }

    if (
      data.updatedDate &&
      data.updatedDate.getTime() < data.pubDate.getTime()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "updatedDate cannot be earlier than pubDate.",
        path: ["updatedDate"],
      });
    }
  });

export type BlogFrontmatter = z.infer<typeof blogSchema>;
export type BlogSource = z.infer<typeof sourceSchema>;
