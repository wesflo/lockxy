import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
        exclude: [...configDefaults.exclude, '**/dist/**', '**/dist-iife/**', '**/coverage/**'],
    },
});
