// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // site: 'https://ethossoftware.com.br', // será preenchido em Spec 10 (cutover)
  output: 'static',

  integrations: [react()],

  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
