const prettierConfig = require('./.prettierrc.js')

module.exports = {
  extends: ['standard-with-typescript', 'eslint-config-prettier'],
  plugins: ['prettier'],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    'prettier/prettier': ['error', prettierConfig]
  }
}
