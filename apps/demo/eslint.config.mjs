import { esLintDefaultConfig } from '@electronicpartnerio/ui-utils/config/eslint.config.mjs';

export default [
    {
        ignores: ['coverage/**', 'dist/**', 'node_modules/**']
    },
    ...esLintDefaultConfig.map((config) => ({
        ...config,
        files: ['src/**/*.ts']
    }))
];
