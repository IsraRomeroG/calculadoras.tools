// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import {
  createSitemapFilter,
  getLegacyBlogArticleSlugsForSitemap,
  getPublishedBlogArticlePathsForSitemap,
  getPublishedBlogCategoryPathsForSitemap,
  getPublishedBlogCategorySlugsForSitemap,
} from './src/lib/blog-sitemap.mjs';
import rehypeWrapTables from './src/lib/rehype/wrap-tables.mjs';

import sitemap from '@astrojs/sitemap';

const BLOG_CONTENT_DIR = fileURLToPath(
  new URL('./src/content/blog', import.meta.url),
);
const legacyBlogArticleSlugs =
  getLegacyBlogArticleSlugsForSitemap(BLOG_CONTENT_DIR);
const publishedBlogArticlePaths =
  getPublishedBlogArticlePathsForSitemap(BLOG_CONTENT_DIR);
const publishedBlogCategoryPaths =
  getPublishedBlogCategoryPathsForSitemap(BLOG_CONTENT_DIR);
const publishedBlogCategorySlugs =
  getPublishedBlogCategorySlugsForSitemap(BLOG_CONTENT_DIR);
const unpublishedLocalizedPaths = new Set([
  '/en/contact',
  '/en/privacy',
]);

const shouldIncludeInSitemap = createSitemapFilter({
  legacyBlogArticleSlugs,
  publishedBlogArticlePaths,
  publishedBlogCategoryPaths,
  publishedBlogCategorySlugs,
  excludedPaths: unpublishedLocalizedPaths,
});

// https://astro.build/config
export default defineConfig({
  site: 'https://calculadoras.tools',
  trailingSlash: 'never',

  markdown: {
    rehypePlugins: [rehypeWrapTables],
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap({ filter: shouldIncludeInSitemap })],
});
