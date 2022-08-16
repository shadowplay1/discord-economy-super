const errors = require('../../structures/errors')

const errorCodes = [
    'INVALID_TYPE',
    'UNKNOWN_ERROR',
    'PARAMETER_NOT_SPECIFIED',
    'OLD_NODE_VERSION',
    'NO_DISCORD_CLIENT',
    'ROLE_NOT_FOUND',
    'PURCHASES_HISTORY_DISABLED',
    'SETTINGS_KEY_INVALID',
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
     * @param {string | Error} message Error message.
     * @param {'INVALID_TYPE' |
     * 'UNKNOWN_ERROR' | 
     * 'PARAMETER_NOT_SPECIFIED' |
     * 'OLD_NODE_VERSION' |
     * 'NO_DISCORD_CLIENT' | 
     * 'ROLE_NOT_FOUND' |
     * 'PURCHASES_HISTORY_DISABLED' |
     * 'SETTINGS_KEY_INVALID' |
     * 'INVALID_ERROR_CODE' |
     * 'MODULE_NOT_READY' |
     * 'STORAGE_FILE_ERROR'} code Error code.
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

        if (code && !errorCodes.includes(code)) {
            throw new EconomyError(errors.invalidErrorCode, 'INVALID_ERROR_CODE')
        }

        /**
         * Error code.
         * @type {'INVALID_TYPE' |
         * 'UNKNOWN_ERROR' | 
         * 'PARAMETER_NOT_SPECIFIED' |
         * 'OLD_NODE_VERSION' |
         * 'NO_DISCORD_CLIENT' | 
         * 'ROLE_NOT_FOUND' |
         * 'PURCHASES_HISTORY_DISABLED' |
         * 'SETTINGS_KEY_INVALID' |
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
