// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Cuando tengamos el dominio .org.ar, cambiar `site` acá (afecta sitemap, OG y JSON-LD).
export default defineConfig({
  site: 'https://hogar-dr-maradona.vercel.app',
  // Todo se prerenderiza salvo los endpoints de /api (login del CMS).
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
  redirects: {
    '/login': '/admin/',
  },
});
