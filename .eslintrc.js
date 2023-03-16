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
        'no-plusplus': 'off',

        'implicit-arrow-linebreak': 'off',
        'operator-linebreak': 'off',
        'no-param-reassign': 'off',
        'arrow-body-style': 'off',

        'consistent-return': 'off',
        'function-paren-newline': 'off',
        'max-classes-per-file': 'off',

        'semi': [
            'warn',
            'never'
        ],

        indent: [
            'warn',
            4
        ],

        'max-len': [
            'warn', {
                'code': 120
            }
        ],

        'prefer-const': 'warn',
        'camelcase': 'warn',
        'eol-last': 'warn',

        'dot-notation': 'warn',
        'no-continue': 'warn',
        'no-redeclare': 'warn',

        'block-spacing': [
            'error',
            'never'
        ],

        'no-unneeded-ternary': 'error',
        'no-spaced-func': 'error',
        'no-dupe-else-if': 'error',

        'object-curly-spacing': [
            'error',
            'always'
        ],

        'no-trailing-spaces': [
            'error', {
                'ignoreComments': true,
            }
        ],

        'quotes': [
            'error',
            'single'
        ],

        'no-return-await': [
            'error'
        ],
    },
}
