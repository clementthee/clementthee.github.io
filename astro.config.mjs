// =========================================================================
// ----------------- CONFIGURACIÓN MAESTRA DE PRODUCCIÓN (RENDER SSR) ------
// =========================================================================
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://clementthee-github-io.onrender.com',
  output: 'server', // Por defecto es servidor para Render
  adapter: node({
    mode: 'standalone',
  }),
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
