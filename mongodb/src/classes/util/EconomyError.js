const errors = require('../../structures/errors')

const errorCodes = {
    INVALID_TYPE: 'INVALID_TYPE',
    NO_CACHE_IDENTIFIERS: 'INVALID_CACHING_IDENTIFIERS',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    PARAMETER_NOT_SPECIFIED: 'PARAMETER_NOT_SPECIFIED',
    OLD_NODE_VERSION: 'OLD_NODE_VERSION',
    NO_DISCORD_CLIENT: 'NO_DISCORD_CLIENT',
    ROLE_NOT_FOUND: 'ROLE_NOT_FOUND',
    PURCHASES_HISTORY_DISABLED: 'PURCHASES_HISTORY_DISABLED',
    SETTINGS_KEY_INVALID: 'SETTINGS_KEY_INVALID',
    INVALID_ERROR_CODE: 'INVALID_ERROR_CODE',
    NO_CONNECTION_DATA: 'NO_CONNECTION_DATA',
}

/**
 * EconomyError class.
 * @extends {Error}
 */
class EconomyError extends Error {

    /**
     * Creates an 'EconomyError' instance.
     * @param {string | Error} message Error message.
     * @param {'INVALID_TYPE' | 
     * 'INVALID_CACHING_IDENTIFIERS' | 
     * 'UNKNOWN_ERROR' | 
     * 'PARAMETER_NOT_SPECIFIED' |
     * 'OLD_NODE_VERSION' |
     * 'NO_DISCORD_CLIENT' | 
     * 'ROLE_NOT_FOUND' |
     * 'PURCHASES_HISTORY_DISABLED' |
     * 'SETTINGS_KEY_INVALID' |
     * 'INVALID_ERROR_CODE' |
     * 'NO_CONNECTION_DATA'} code Error code.
     */
    constructor(message = '', code = '') {
        if (message instanceof Error == 'Error') {
            super(message.message)
            Error.captureStackTrace(this, this.constructor)
        }

        if (typeof message == 'string') {
            super(message || 'Unknown Error')
        }

        if (!message) {
            code = 'UNKNOWN_ERROR'
        }

        if (code && !errorCodes[code]) {
            throw new EconomyError(errors.invalidErrorCode, 'INVALID_ERROR_CODE')
        }

        /**
         * Error code.
         * @type {'INVALID_TYPE' | 
         * 'INVALID_CACHING_IDENTIFIERS' | 
         * 'UNKNOWN_ERROR' | 
         * 'PARAMETER_NOT_SPECIFIED' |
         * 'OLD_NODE_VERSION' |
         * 'NO_DISCORD_CLIENT' | 
         * 'ROLE_NOT_FOUND' |
         * 'PURCHASES_HISTORY_DISABLED' |
         * 'SETTINGS_KEY_INVALID' |
         * 'INVALID_ERROR_CODE' | 
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