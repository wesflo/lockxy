import { mockApiPlugin } from '@wesflo/vite-plugin-local-mock-api';
import { defineConfig } from 'vite';

const apiTarget = process.env.PLAYGROUND_API_TARGET;

export default defineConfig(({ command }) => ({
    plugins:
        command === 'serve'
            ? [
                  mockApiPlugin({
                      mockRoot: new URL('./mock/', import.meta.url),
                      requestPrefixes: ['/api/'],
                  }),
              ]
            : [],
    server: {
        port: 5174,
        strictPort: true,
        proxy: apiTarget
            ? {
                  '/api': {
                      target: apiTarget,
                      changeOrigin: true,
                  },
              }
            : undefined,
    },
}));
