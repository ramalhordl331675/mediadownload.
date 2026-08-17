import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  envDir: '../',
  server: {
    port: 5173,
    // Em dev, o frontend roda na 5173 e a API na 3000.
    // Redireciona as chamadas da API para o mesmo domínio (VITE_API_URL vazio)
    // ou para http://localhost:3000, sem depender de CORS no frontend.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        'como-funciona': resolve(import.meta.dirname, 'como-funciona.html'),
        plataformas: resolve(import.meta.dirname, 'plataformas.html'),
        faq: resolve(import.meta.dirname, 'faq.html'),
        sobre: resolve(import.meta.dirname, 'sobre.html'),
        contato: resolve(import.meta.dirname, 'contato.html'),
        privacidade: resolve(import.meta.dirname, 'privacidade.html'),
        termos: resolve(import.meta.dirname, 'termos.html'),
        cookies: resolve(import.meta.dirname, 'cookies.html'),
        '404': resolve(import.meta.dirname, '404.html'),
      },
    },
  },
});