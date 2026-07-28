// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Cuando tengamos el dominio .org.ar, cambiar `site` acá (afecta sitemap, OG y JSON-LD).
export default defineConfig({
  site: 'https://hogar-dr-maradona.vercel.app',
  output: 'static',
  integrations: [sitemap()],
});
