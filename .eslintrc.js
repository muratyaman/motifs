module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['tsconfig.build.json'],
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    //'@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ["error", { "argsIgnorePattern": "^_" }],
  },
};
