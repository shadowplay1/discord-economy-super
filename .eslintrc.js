module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended'
  ],
  env: {
    es6: true,
    node: true,
    browser: true,
    amd: true
  },
  globals: {
    $: true,
    require: true,
    process: true
  },
  rules: {
    'semi': ['warn', 'never'],
    'no-plusplus': 'off',
    'implicit-arrow-linebreak': 'off',
    'operator-linebreak': 'off',
    'no-param-reassign': 'off',
    'arrow-body-style': 'off',
    'no-unneeded-ternary': 'error',
    'consistent-return': 'off',
    'function-paren-newline': 'off',
    'max-classes-per-file': 'off',
    'prefer-const': 'warn',
    'camelcase': 'warn',
    'eol-last': 'warn',
    'max-len': ['warn', { 'code': 120 }],
    'dot-notation': 'warn',
    'no-continue': 'warn',
    'no-dupe-else-if': 'error',
    'block-spacing': ['error', 'never'],
    'no-spaced-func': 'error',
    'object-curly-spacing': ['error', 'always'],
    'no-redeclare': 'warn',
    'no-trailing-spaces': ['error', {
      'ignoreComments': true,
    }],
    'quotes': ['error', 'single'],
    'no-return-await': ['error'],
  },
}
