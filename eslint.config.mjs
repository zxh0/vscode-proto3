import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['out/**', 'node_modules/**', '*.js'],
  },
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/prefer-namespace-keyword': 'off',
      'no-console': 'off',
      'no-useless-escape': 'off',
      'no-case-declarations': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'prefer-const': 'warn',
    },
  }
);
