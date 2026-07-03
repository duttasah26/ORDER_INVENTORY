import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': path.resolve(dirname, 'src/app'),
      '@shared': path.resolve(dirname, 'src/shared'),
      '@features': path.resolve(dirname, 'src/features'),
      '@stores': path.resolve(dirname, 'src/stores'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Bare json-server mounts collections at root (e.g. /products), not
      // under /api/v1, so strip the prefix before forwarding.
      '/api/v1': {
        target: 'http://localhost:4100',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, ''),
      },
    },
  },
});
