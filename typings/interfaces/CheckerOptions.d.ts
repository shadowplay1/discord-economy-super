/**
 * Options object for an 'Economy.utils.checkOptions' method.
 */
declare class CheckerOptions {
    /**
     * Allows the method to ignore the options with invalid types. Default: false.
     */
    ignoreInvalidTypes: boolean

    /**
     * Allows the method to ignore the unspecified options. Default: false.
     */
    ignoreUnspecifiedOptions: boolean

    /**
     * Allows the method to ignore the unexisting options. Default: false.
     */
    ignoreInvalidOptions: boolean

    /**
     * Allows the method to show all the problems in the console. Default: false.
     */
    showProblems: boolean

    /**
     * Allows the method to send the result in the console. Default: false.
     */
    sendLog: boolean
    
    /**
     * Allows the method to send the result if no problems were found. Default: false
     */
    sendSuccessLog: boolean
}

export = CheckerOptions