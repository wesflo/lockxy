import { defineConfig } from 'vite';
import lockxy from '@wesflo/vite-plugin-lockxy';

const mockRoots = {
    development: './mock/',
    'missing-manifest': './mock-missing/',
    'invalid-manifest': './mock-invalid/',
};
export default defineConfig(({ command, mode }) => {
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
        plugins: command === 'serve' ? [lockxy({ mockRoot, requestPrefixes: '/api/' })] : [],
    };
});
