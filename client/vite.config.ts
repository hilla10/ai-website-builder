import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';

// const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      // '@/components': resolve(__dirname, 'src/components'),
      // '@pages': resolve(__dirname, 'src/pages'),
      // '@configs': resolve(__dirname, 'src/configs'),
      // '@app': resolve(__dirname, 'src/app'),
      // '@assets': resolve(__dirname, 'src/assets'),
    },
  },
});
