// =========================================================================
// ----------------- CONFIGURACIÓN ADAPTATIVA GITHUB (STATIC) VS RENDER (SSR) 
// =========================================================================
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

// Detectamos si el proceso corre dentro de GitHub Actions
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  // Si está en GitHub usa la URL estática, si no, usa el servidor de Render
  site: isGitHubActions 
    ? 'https://clementthee.github.io' 
    : 'https://clementthee-github-io.onrender.com',
  
  // Cambia dinámicamente: estático para GitHub Pages, servidor para Render
  output: isGitHubActions ? 'static' : 'server',
  
  // Solo aplicamos el adaptador de Node si no estamos en GitHub Actions
  adapter: isGitHubActions ? undefined : node({
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