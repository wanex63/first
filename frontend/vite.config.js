import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.kinopoisk.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/images': {
        target: 'https://st.kp.yandex.net',
        changeOrigin: true
      }
    }
  }
});