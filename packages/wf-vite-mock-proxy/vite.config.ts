import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(import.meta.dirname, 'src/index.ts'),
            name: 'WfViteMockProxy',
            formats: ['es', 'umd'],
            fileName: (format) => (format === 'es' ? 'wf-vite-mock-proxy.js' : 'wf-vite-mock-proxy.umd.cjs'),
        },
        sourcemap: true,
    },
});
