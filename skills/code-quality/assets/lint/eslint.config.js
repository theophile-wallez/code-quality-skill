// The same rules as .oxlintrc.json, for a project on ESLint.
// Dependencies: eslint @eslint/js typescript-eslint eslint-plugin-import-x eslint-plugin-unicorn

import js from '@eslint/js';
import { importX } from 'eslint-plugin-import-x';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['dist/**', 'coverage/**', 'playwright-report/**', 'test-results/**']),
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    // A rule that's wrong somewhere is changed here, with a reason, never in a comment.
    linterOptions: { noInlineConfig: true, reportUnusedDisableDirectives: 'error' },
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    plugins: { 'import-x': importX, unicorn },
    rules: {
      complexity: ['error', { max: 15 }],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'id-length': [
        'error',
        { min: 2, properties: 'never', exceptions: ['i', 'j', 'k', 'x', 'y', 'z', '_', 'T', 'K'] },
      ],
      'max-depth': ['error', { max: 4 }],
      'max-lines': ['error', { max: 250, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': [
        'error',
        { max: 60, skipBlankLines: true, skipComments: true, IIFEs: true },
      ],
      'max-params': ['error', { max: 4 }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-else-return': 'error',
      'no-nested-ternary': 'error',
      'no-param-reassign': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*', '../**'],
              message: 'Import from another folder through a path alias.',
            },
          ],
        },
      ],
      'no-var': 'error',
      'prefer-const': 'error',
      'import-x/no-cycle': 'error',
      'import-x/no-default-export': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/no-self-import': 'error',
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'has', 'can', 'should', 'was', 'will'],
        },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'unicorn/no-for-each': 'error',
      'unicorn/prefer-node-protocol': 'error',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', 'tests/**'],
    rules: {
      'max-lines': ['error', { max: 400, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    files: ['scripts/**', '*.config.ts'],
    rules: { 'no-console': 'off' },
  },
  {
    files: ['*.config.ts', '*.config.js'],
    rules: { 'import-x/no-default-export': 'off' },
  },
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
