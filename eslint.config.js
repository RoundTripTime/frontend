// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  expoConfig,
  {
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/index', '**/index.*'],
              message: 'Barrel imports are not allowed. Import from the source module directly.',
            },
          ],
        },
      ],
    },
  },
  prettierConfig,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*', 'ios/*', 'android/*'],
  },
]);
