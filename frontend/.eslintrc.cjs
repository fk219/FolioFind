module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'tailwind.config.js', 'postcss.config.js', 'vite.config.js'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  overrides: [
    {
      files: ['**/*.test.{js,jsx}', '**/__tests__/**/*.{js,jsx}'],
      env: { browser: true, es2020: true, jest: true },
    },
  ],
  rules: {
    'react-refresh/only-export-components': 'off',
    'react/prop-types': 'off',
  },
}
