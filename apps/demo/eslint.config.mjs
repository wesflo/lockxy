import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import vitest from 'eslint-plugin-vitest-globals';
import globals from 'globals';

const esLintDefaultConfig = tseslint.config({
    extends: [eslint.configs.recommended, tseslint.configs.recommended],
    rules: {
        '@typescript-eslint/array-type': 2,
        '@typescript-eslint/consistent-type-imports': 2,
        '@typescript-eslint/no-unused-expressions': 1
    },
    languageOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        globals: {
            ...globals.browser,
            ...globals.es2021,
            ...globals.jest,
            ...vitest.environments.env.globals,
            vi: true
        }
    },
    files: ['src/**/*.ts'],
    ignores: ['src/**/*.spec.ts', 'src/**/*.d.ts', 'coverage/**', 'dist/**', 'node_modules/**']
});

export default esLintDefaultConfig;
