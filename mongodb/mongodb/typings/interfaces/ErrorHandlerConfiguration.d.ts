/**
 * Error handler configuration.
 */
declare interface ErrorHandlerConfiguration {

    /**
     * Handles all errors on startup. Default: true.
     */
    handleErrors?: boolean

    /**
     * Amount of attempts to load the module. Use 0 for infinity attempts. Default: 5.
     */
    attempts?: number

    /**
     * Time between every attempt to start the module (in ms). Default: 3000.
     */
    time?: number
}

export = ErrorHandlerConfiguration
