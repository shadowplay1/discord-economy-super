/**
* Economy logger.
* @private
*/
class Logger {

    /**
     * Logger constructor.
     * @param {LoggerOptions} options Logger configuration.
    */
    constructor(options) {

        /**
         * Logger configuration.
         * @type {LoggerOptions}
         */
        this.options = options

        /**
         * Logger colors object.
         * @type {LoggerColors}
        */
        this.colors = {
            black: '\x1b[30m',
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
            magenta: '\x1b[35m',
            cyan: '\x1b[36m',
            lightgray: '\x1b[37m',
            default: '\x1b[39m',
            darkgray: '\x1b[90m',
            lightred: '\x1b[91m',
            lightgreen: '\x1b[92m',
            lightyellow: '\x1b[93m',
            lightblue: '\x1b[94m',
            lightmagenta: '\x1b[95m',
            lightcyan: '\x1b[96m',
            white: '\x1b[97m',
            reset: '\x1b[0m',
        }
    }

    /**
     * Sends an info message to the console.
     * @param {string} message A message to send.
     * @param {string} [color='red'] Message color to use.
     * @returns {void}
     */
    info(message, color = 'cyan') {
        console.log(`${this.colors[color]}[Economy] ${message}${this.colors.reset}`)
    }

    /**
     * Sends an error message to the console.
     * @param {string} message A message to send.
     * @param {string} [color='red'] Message color to use.
     * @returns {void}
     */
    error(message, color = 'red') {
        console.error(`${this.colors[color]}[Economy - Error] ${message}${this.colors.reset}`)
    }

    /**
     * Sends a debug message to the console.
     * @param {string} message A message to send.
     * @param {string} [color='yellow'] Message color to use.
     * @returns {void}
     */
    debug(message, color = 'yellow') {
        if (!this.options.debug) return
        console.log(`${this.colors[color]}[Economy] ${message}${this.colors.reset}`)
    }

    /**
     * Sends a warning message to the console.
     * @param {string} message A message to send.
     * @param {string} [color='lightyellow'] Message color to use.
     * @returns {void}
     */
    warn(message, color = 'lightyellow') {
        console.log(`${this.colors[color]}[Economy - Warning] ${message}${this.colors.reset}`)
    }

    /**
     * Sends a debug log for the optional parameter in method not specified.
     * @param {string} method The method (e.g. "ShopItem.use") to set.
     * @param {string} parameterName Parameter name to set.
     * @param {any} defaultValue Default value to set.
     * @returns {void}
     */
    optionalParamNotSpecified(method, parameterName, defaultValue) {
        this.debug(
            `${method} - "${parameterName}" optional parameter is not specified - defaulting to "${defaultValue}".`,
            'lightcyan'
        )
    }
}


/**
 * The Logger class.
 * @type {Logger}
 */
module.exports = Logger


/**
 * @typedef {object} LoggerOptions
 * @property {boolean} debug Is the debug mode enabled.
 */

/**
 * @typedef {object} LoggerColors
 * @property {string} red Red color.
 * @property {string} green Green color.
 * @property {string} yellow Yellow color.
 * @property {string} blue Blue color.
 * @property {string} magenta Magenta color.
 * @property {string} cyan Cyan color.
 * @property {string} white White color.
 * @property {string} reset Reset color.
 * @property {string} black Black color.
 * @property {string} lightgray Light gray color.
 * @property {string} darkgray Dark gray color.
 * @property {string} lightred Light red color.
 * @property {string} lightgreen Light green color.
 * @property {string} lightyellow Light yellow color.
 * @property {string} lightblue Light blue color.
 * @property {string} lightmagenta Light magenta color.
 * @property {string} lightcyan Light cyan color.
 */
