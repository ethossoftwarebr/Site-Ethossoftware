// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

import tailwindcss from '@tailwindcss/vite';

import { imagetools } from 'vite-imagetools';

// https://astro.build/config
export default defineConfig({
  site: 'https://ethossoftware.com.br',
  output: 'server',
  adapter: vercel(),

  integrations: [react()],

  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },

  vite: {
    plugins: [tailwindcss(), imagetools()],
  },
});
