import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three/examples')) {
            return 'vendor-three-addons';
          }
          if (id.includes('node_modules/three')) {
            return 'vendor-three-core';
          }
          if (id.includes('src/data/themesSolo')) {
            return 'data-themes-solo';
          }
          if (id.includes('src/core/mannequin/poses') || id.includes('src/core/mannequin/couplePoses') || id.includes('src/core/mannequin/solo')) {
            return 'data-poses-catalog';
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api/comfy': {
        target: 'http://127.0.0.1:8188',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/comfy/, ''),
      },
    },
  },
});
