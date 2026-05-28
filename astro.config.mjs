// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import rehypeWrapTables from './src/lib/rehype/wrap-tables.mjs';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://calculadoras.tools',

  markdown: {
    rehypePlugins: [rehypeWrapTables],
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()],

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
