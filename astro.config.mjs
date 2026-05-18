// =========================================================================
// ----------------- CONFIGURACIÓN GLOBAL DE ASTRO (SSR ENGINE) ------------
// =========================================================================
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://clementthee.github.io',
  output: 'server', // <-- CRÍTICO: Activa el renderizado dinámico en servidor
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