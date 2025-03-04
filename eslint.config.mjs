// eslint.config.js (flat config example)
import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  // 1) Base config for JS
  {
    files: ['**/*.js'],
    rules: {
      semi: 'error',
      // etc.
    }
  },
  // 2) TypeScript config
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser
    },
    plugins: {
      '@typescript-eslint': ts
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error'
      // etc.
    }
  }
];
