// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://cubanrootskitchen.ie",

  vite: {
    plugins: [tailwindcss()]
  },

  redirects: {
    "/menu": "/menu/sandwichs",
  },

  adapter: vercel({
    webAnalytics: {
      enabled: true
    },
  }),
});