import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(import.meta.dirname, 'src/index.ts'),
            name: 'WfLockxyPanel',
            formats: ['es', 'umd'],
            fileName: (format) => (format === 'es' ? 'wf-lockxy-panel.js' : 'wf-lockxy-panel.umd.cjs'),
        },
        sourcemap: true,
    },
});
