import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const eslintConfig = tseslint.config(
    {
        ignores: ['src/**/*.spec.ts', 'src/**/*.d.ts', 'coverage/**', 'dist/**', 'node_modules/**'],
    },
    {
        extends: [eslint.configs.recommended, tseslint.configs.recommended],
        files: ['src/**/*.ts'],
        languageOptions: {
            ecmaVersion: 2022,
            globals: {
                ...globals.es2021,
                ...globals.node,
            },
            sourceType: 'module',
        },
        rules: {
            '@typescript-eslint/array-type': 'error',
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/no-unused-expressions': 'warn',
        },
    }
);

export default eslintConfig;
