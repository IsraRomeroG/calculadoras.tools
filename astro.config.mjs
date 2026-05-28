// @ts-check
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import rehypeWrapTables from './src/lib/rehype/wrap-tables.mjs';

import sitemap from '@astrojs/sitemap';

const BLOG_CONTENT_DIR = fileURLToPath(
  new URL('./src/content/blog', import.meta.url),
);
const BLOG_PUBLICATION_TIME_ZONE = 'America/Mexico_City';

const editorialDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: BLOG_PUBLICATION_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const padDatePart = (value) => String(value).padStart(2, '0');

const getBlogPublicationDateKey = (date) =>
  [
    date.getUTCFullYear(),
    padDatePart(date.getUTCMonth() + 1),
    padDatePart(date.getUTCDate()),
  ].join('-');

const getEditorialDateKey = (date) => {
  const parts = editorialDateFormatter.formatToParts(date);
  const values = parts.reduce((result, part) => {
    if (part.type !== 'literal') {
      result[part.type] = part.value;
    }

    return result;
  }, {});

  return `${values.year}-${values.month}-${values.day}`;
};

const getMarkdownFiles = (directory) => {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return getMarkdownFiles(entryPath);
    }

    return entry.isFile() && extname(entry.name) === '.md' ? [entryPath] : [];
  });
};

const getFrontmatterValue = (content, key) => {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!frontmatter) {
    return null;
  }

  const value = new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm').exec(
    frontmatter[1],
  )?.[1];

  return value?.trim().replace(/^['"]|['"]$/g, '') ?? null;
};

const isPublishableBlogContent = (content) => {
  const draft = getFrontmatterValue(content, 'draft') === 'true';
  const pubDate = getFrontmatterValue(content, 'pubDate');

  if (draft || !pubDate) {
    return false;
  }

  return (
    getBlogPublicationDateKey(new Date(pubDate)) <=
    getEditorialDateKey(new Date())
  );
};

const getLegacyBlogArticleSlugsForSitemap = () =>
  new Set(
    getMarkdownFiles(BLOG_CONTENT_DIR)
      .filter((filePath) =>
        isPublishableBlogContent(readFileSync(filePath, 'utf8')),
      )
      .map((filePath) => basename(filePath, extname(filePath))),
  );

const legacyBlogArticleSlugs = getLegacyBlogArticleSlugsForSitemap();

const shouldIncludeInSitemap = (page) => {
  const path = new URL(page).pathname.replace(/\/$/, '');

  if (path === '/blog/categoria' || path.startsWith('/blog/categoria/')) {
    return false;
  }

  const blogSingleSegment = /^\/blog\/([^/]+)$/.exec(path);

  return (
    !blogSingleSegment || !legacyBlogArticleSlugs.has(blogSingleSegment[1])
  );
};

// https://astro.build/config
export default defineConfig({
  site: 'https://calculadoras.tools',

  markdown: {
    rehypePlugins: [rehypeWrapTables],
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap({ filter: shouldIncludeInSitemap })],

  redirects: {
    '/calculadora-deficit-calorico': '/salud/calculadora-deficit-calorico',
    '/calculadora-de-edad': '/fecha-tiempo/calculadora-de-edad',
    '/categoria/fecha-tiempo': '/fecha-tiempo',
    '/categoria/finanzas': '/finanzas',
    '/categoria/inmuebles': '/inmuebles',
    '/categoria/legal-impuestos': '/legal-impuestos',
    '/categoria/matematicas': '/matematicas',
    '/categoria/salud': '/salud',
    '/categoria/legal-e-impuestos': '/legal-impuestos',
    '/categoria/fecha-y-tiempo': '/fecha-tiempo'
  }
});
