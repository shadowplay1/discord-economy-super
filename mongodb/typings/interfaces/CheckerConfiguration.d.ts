/**
 * Configuration for an 'Economy.utils.checkConfiguration' method.
 */
declare interface CheckerConfiguration {

    /**
     * Allows the method to ignore the options with invalid types. Default: false.
     */
    ignoreInvalidTypes?: boolean

    /**
     * Allows the method to ignore the unspecified options. Default: true.
     */
    ignoreUnspecifiedOptions?: boolean

    /**
     * Allows the method to ignore the unexisting options. Default: false.
     */
    ignoreInvalidOptions?: boolean

    /**
     * Allows the method to show all the problems in the console. Default: true.
     */
    showProblems?: boolean

    /**
     * Allows the method to send the result in the console. 
     * Requires the 'showProblems' or 'sendLog' options to set. Default: true.
     */
    sendLog?: boolean

    /**
     * Allows the method to send the result if no problems were found. Default: false
     */
    sendSuccessLog?: boolean
}

export = CheckerConfiguration
