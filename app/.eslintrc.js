module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-undef': 'warn',
    '@typescript-eslint/no-var-requires': 'off',
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  globals: {
    utools: 'readonly',
  },
};
