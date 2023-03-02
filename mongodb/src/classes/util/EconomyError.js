const errors = require('../../structures/errors')

const errorCodes = [
    'INVALID_TYPE',
    'NO_CACHE_IDENTIFIERS',
    'INVALID_CACHING_IDENTIFIERS',
    'INVALID_CACHE_ITEM_NAME',
    'ITEM_PROPERTY_INVALID',
    'INVALID_INPUT',
    'UNKNOWN_ERROR',
    'PARAMETER_NOT_SPECIFIED',
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
    'NO_CONNECTION_DATA'
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
     * 'INVALID_CACHING_IDENTIFIERS' | 
     * 'INVALID_CACHE_ITEM_NAME' |
     * 'UNKNOWN_ERROR' |
     * 'ITEM_PROPERTY_INVALID' |
     * 'INVALID_INPUT' |
     * 'PARAMETER_NOT_SPECIFIED' |
     * 'OLD_NODE_VERSION' |
     * 'NO_DISCORD_CLIENT' | 
     * 'ROLE_NOT_FOUND' |
     * 'PURCHASES_HISTORY_DISABLED' |
     * 'SETTINGS_KEY_INVALID' |
     * 'READONLY_PROPERTY' |
     * 'INVALID_PROPERTY' |
     * 'CURRENCY_NOT_FOUND' |
     * 'INVALID_ERROR_CODE' |
     * 'MODULE_NOT_READY' |
     * 'NO_CONNECTION_DATA'} code Error code.
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
         * 'INVALID_CACHING_IDENTIFIERS' | 
         * 'INVALID_CACHE_ITEM_NAME' |
         * 'UNKNOWN_ERROR' |
         * 'ITEM_PROPERTY_INVALID' |
         * 'INVALID_INPUT' |
         * 'PARAMETER_NOT_SPECIFIED' |
         * 'OLD_NODE_VERSION' |
         * 'NO_DISCORD_CLIENT' | 
         * 'ROLE_NOT_FOUND' |
         * 'PURCHASES_HISTORY_DISABLED' |
         * 'SETTINGS_KEY_INVALID' |
         * 'READONLY_PROPERTY' |
         * 'INVALID_PROPERTY' |
         * 'CURRENCY_NOT_FOUND' |
         * 'INVALID_ERROR_CODE' |
         * 'MODULE_NOT_READY' |
         * 'NO_CONNECTION_DATA'}
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
