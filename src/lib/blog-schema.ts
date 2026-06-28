import { z } from "astro/zod";
import { CATEGORY_IDS, CATEGORY_SLUGS } from "./constants/categories";
import { LOCALES } from "./i18n/config";

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
    categorySlug: z.enum(CATEGORY_SLUGS).optional(),
    tags: z.array(z.string()).default([]),
    readTime: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    translationKey: z.string().optional(),
    contentId: z.string().optional(),
    locale: z.enum(LOCALES).optional(),
    categoryId: z.enum(CATEGORY_IDS).optional(),
    slug: z.string().optional(),
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
    const locale = data.locale ?? "es";

    if (locale === "es" && !data.categorySlug) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "categorySlug is required for Spanish blog posts.",
        path: ["categorySlug"],
      });
    }

    if (
      locale === "es" &&
      data.categoryId &&
      data.categorySlug &&
      data.categoryId !== data.categorySlug
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "categoryId must match categorySlug for Spanish blog posts.",
        path: ["categoryId"],
      });
    }

    if (locale !== "es") {
      if (!data.translationKey?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "translationKey is required for localized blog posts.",
          path: ["translationKey"],
        });
      }

      if (!data.categoryId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "categoryId is required for localized blog posts.",
          path: ["categoryId"],
        });
      }

      if (!data.slug?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "slug is required for localized blog posts.",
          path: ["slug"],
        });
      }
    }

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
