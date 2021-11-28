module.exports = {
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  rules: {
    'semi': ['error', 'never'],
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
    'max-len': ['warn', { 'code': 120 }],
    'dot-notation': 'warn',
    'no-continue': 'warn',
    'no-dupe-else-if': 'error',
    'block-spacing': ['error', 'never'],
    'no-spaced-func': 'error',
    'object-curly-spacing': ['error', 'always'],
    'no-trailing-spaces': ['error', {
      'ignoreComments': true,
    }],
    'quotes': ['error', 'single'],
    'no-return-await': ['error'],
  },
}

