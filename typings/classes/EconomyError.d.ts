/**
 * EconomyError class.
 */
declare class EconomyError extends Error {
    /**
     * Name of the error
     */
    public name: 'EconomyError'

    /**
    * Creates an 'EconomyError' error instance.
    * @param {String | Error} message Error message.
    */
    constructor(message: string | Error)
}

export = EconomyError