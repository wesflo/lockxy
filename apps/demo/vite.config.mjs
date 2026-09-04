import { defineConfig } from 'vite';
import { mockApiPlugin } from '@wesflo/vite-plugin-local-mock-api';

const mockRoots = {
    development: './mock/',
    'missing-manifest': './mock-missing/',
    'invalid-manifest': './mock-invalid/',
};
export default defineConfig(({ mode }) => {
    const mockRoot = new URL(mockRoots[mode] ?? mockRoots.development, import.meta.url);

    return {
        base: '',
        esbuild: {
            supported: {
                'top-level-await': true, //browsers can handle top-level-await features
            },
        },
        build: {
            outDir: 'dist',
        },
        plugins: [mockApiPlugin({ mockRoot, internalPrefix: '/api/' })],
    };
});
