import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Reemplaza con tu usuario de GitHub y el nombre exacto de tu repositorio
  site: 'https://clementthee.github.io',
  base: '/mi-proyecto', 
  vite: {
    plugins: [tailwindcss()],
  },
});