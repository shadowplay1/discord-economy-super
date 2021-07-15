/**
 * EconomyError class.
 */
class EconomyError extends Error {
    /**
     * Creates an 'EconomyError' instance.
     * @param {String | Error} message Error message.
     */
    constructor(message) {
        if (message instanceof Error == 'Error') {
            super(message.message)
            Error.captureStackTrace(this, this.constructor)
        }
        if (typeof message == 'string') super(message)
        /**
         * Error name.
         * @type {String}
         */
        this.name = 'EconomyError'
    }
}

/**
 * EconomyError class.
 * @type {EconomyError}
 */
module.exports = EconomyError