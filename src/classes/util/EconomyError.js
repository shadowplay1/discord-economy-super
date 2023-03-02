const errors = require('../../structures/errors')

const errorCodes = [
    'INVALID_TYPE',
    'UNKNOWN_ERROR',
    'PARAMETER_NOT_SPECIFIED',
    'ITEM_PROPERTY_INVALID',
    'INVALID_INPUT',
    'OLD_NODE_VERSION',
    'NO_DISCORD_CLIENT',
    'ROLE_NOT_FOUND',
    'PURCHASES_HISTORY_DISABLED',
    'SETTINGS_KEY_INVALID',
    'READONLY_PROPERTY',
    'INVALID_PROPERTY',
    'CURRENCY_NOT_FOUND',
    'INVALID_ERROR_CODE',
    'MODULE_NOT_READY',
    'STORAGE_FILE_ERROR'
]

/**
 * EconomyError class.
 * @extends {Error}
 */
class EconomyError extends Error {

    /**
     * Creates an 'EconomyError' instance.
     * @param {string | Error} errorMessage Error message.
     * @param {'INVALID_TYPE' |
     * 'UNKNOWN_ERROR' |
     * 'PARAMETER_NOT_SPECIFIED' |
     * 'OLD_NODE_VERSION' |
     * 'ITEM_PROPERTY_INVALID' |
     * 'INVALID_INPUT' |
     * 'NO_DISCORD_CLIENT' |
     * 'ROLE_NOT_FOUND' |
     * 'PURCHASES_HISTORY_DISABLED' |
     * 'SETTINGS_KEY_INVALID' |
     * 'READONLY_PROPERTY' |
     * 'INVALID_PROPERTY' |
     * 'CURRENCY_NOT_FOUND' |
     * 'INVALID_ERROR_CODE' |
     * 'MODULE_NOT_READY' |
     * 'STORAGE_FILE_ERROR'} code Error code.
     */
    constructor(errorMessage = '', code = '') {
        if (errorMessage instanceof Error == 'Error') {
            super(errorMessage.errorMessage)
            Error.captureStackTrace(this, this.constructor)
        }

        else if (typeof errorMessage == 'string') {
            super(errorMessage || 'Unknown Error.')
        }

        else {
            code = 'UNKNOWN_ERROR'
            super('Unknown Error.')
        }

        if (!errorMessage) {
            code = 'UNKNOWN_ERROR'
        }

        if (code && !errorCodes.includes(code)) {
            throw new EconomyError(errors.invalidErrorCode, 'INVALID_ERROR_CODE')
        }

        /**
         * Error code.
         * @type {'INVALID_TYPE' |
         * 'UNKNOWN_ERROR' |
         * 'PARAMETER_NOT_SPECIFIED' |
         * 'OLD_NODE_VERSION' |
         * 'ITEM_PROPERTY_INVALID' |
         * 'INVALID_INPUT' |
         * 'NO_DISCORD_CLIENT' |
         * 'ROLE_NOT_FOUND' |
         * 'PURCHASES_HISTORY_DISABLED' |
         * 'SETTINGS_KEY_INVALID' |
         * 'READONLY_PROPERTY' |
         * 'INVALID_PROPERTY' |
         * 'CURRENCY_NOT_FOUND' |
         * 'INVALID_ERROR_CODE' |
         * 'MODULE_NOT_READY' |
         * 'STORAGE_FILE_ERROR'}
         */
        this.code = code

        /**
         * Error name.
         * @type {string}
         */
        this.name = `EconomyError${code ? ` [${code}]` : ''}`

    }
}

/**
 * EconomyError class.
 * @type {EconomyError}
 */
module.exports = EconomyError
