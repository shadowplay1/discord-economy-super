import EconomyErrorCodes from '../../interfaces/EconomyErrorCodes'

/**
 * EconomyError class.
 */
declare class EconomyError extends Error {

    /**
    * Creates an 'EconomyError' error instance.
    * @param {string | Error} message Error message.
    */
    public constructor(message: string | Error, code?: EconomyErrorCodes)

    /**
     * Name of the error
     */
    public name: 'EconomyError'

    /**
     * Error code.
     */
    public code: EconomyErrorCodes
}

export = EconomyError