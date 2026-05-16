// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import rehypeWrapTables from './src/lib/rehype/wrap-tables.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://calculadoras.tools',
  markdown: {
    rehypePlugins: [rehypeWrapTables],
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
