// =========================================================================
// ----------------- CONFIGURACIÓN GLOBAL DE ASTRO WITH NODE ENGINE --------
// =========================================================================
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node'; // <-- Asegúrate de que esta línea NO esté comentada

export default defineConfig({
  site: 'https://clementthee.github.io',
  output: 'server', 
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