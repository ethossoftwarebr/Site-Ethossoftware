// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

import tailwindcss from '@tailwindcss/vite';

import { imagetools } from 'vite-imagetools';

// https://astro.build/config
export default defineConfig({
  site: 'https://ethossoftware.com.br',
  output: 'static',
  adapter: vercel(),

  integrations: [react(), sitemap()],

  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },

  vite: {
    plugins: [tailwindcss(), imagetools()],
  },
});
