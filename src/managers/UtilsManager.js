const { existsSync } = require('fs')
const { dirname } = require('path')

const fetch = require('node-fetch')

const DefaultConfiguration = require('../structures/DefaultConfiguration')
const errors = require('../structures/errors')
const defaultUserSchema = require('../structures/DefaultUserSchema')

const Logger = require('../classes/util/Logger')
const EconomyUser = require('../classes/EconomyUser')

function unset(object, key) {
    const isObject = item => {
        return !Array.isArray(item)
            && typeof item == 'object'
            && item !== null
    }

    if (!key) return false
    if (typeof key !== 'string') return false

    const keys = key.split('.')
    let tmp = object

    for (let i = 0; i < keys.length; i++) {
        if ((keys.length - 1) == i) {
            delete tmp?.[keys[i]]

        } else if (!isObject(tmp?.[keys[i]])) {
            tmp[keys[i]] = {}
        }

        tmp = tmp[keys[i]]
    }
}


/**
* Utils manager methods class.
*/
class UtilsManager {

    /**
     * Utils Manager.
     * @param {object} options Economy configuration.
     * @param {DatabaseManager} database Database manager.
     */
    constructor(options = {}, database) {

        /**
         * Economy configuration.
         * @type {?EconomyConfiguration}
         * @private
         */
        this.options = options

        /**
         * Economy Logger.
         * @type {Logger}
         * @private
         */
        this._logger = new Logger(options)

        /**
         * Database manager methods class.
         * @type {DatabaseManager}
         * @private
         */
        this.database = database
    }

    /**
    * Checks for the module updates.
    * @returns {Promise<VersionData>} Is the module updated, latest version and installed version.
    */
    async checkUpdates() {
        const version = require('../../package.json').version

        const packageData = await fetch('https://registry.npmjs.com/discord-economy-super')
            .then(text => text.json())

        if (version == packageData['dist-tags'].latest) return {
            updated: true,
            installedVersion: version,
            packageVersion: packageData['dist-tags'].latest
        }

        return {
            updated: false,
            installedVersion: version,
            packageVersion: packageData['dist-tags'].latest
        }
    }

    /**
    * Fetches the entire database.
    * @returns {any} Database contents
    */
    all() {
        return this.database.all()
    }

    /**
     * Clears the database.
     * @returns {boolean} If cleared successfully: true.
     */
    clearDatabase() {
        const keys = this.database.keysList('')

        for (const key of keys) {
            this.database.delete(key)
        }

        return true
    }

    /**
    * Fully removes the guild from database.
    * @param {string} guildID Guild ID
    * @returns {boolean} If cleared successfully: true; else: false
    */
    removeGuild(guildID) {
        const guild = this.database.fetch(guildID)

        if (!guildID) return false
        if (!guild) return false

        this.database.delete(guildID)
        return true
    }

    /**
     * Removes the user from database.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {boolean} If cleared successfully: true; else: false
     */
    removeUser(memberID, guildID) {
        const user = this.database.fetch(`${guildID}.${memberID}`)

        if (!guildID) return false
        if (!memberID) return false

        if (!user) return false

        const result = this.database.delete(`${guildID}.${memberID}`)
        return result
    }

    /**
     * Sets the default user object for the specified member.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {EconomyUser} If reset successfully: new user object.
     */
    resetUser(memberID, guildID) {
        if (!guildID) return null
        if (!memberID) return null

        const defaultObj = defaultUserSchema

        defaultObj.id = memberID
        defaultObj.guildID = guildID


        this.database.set(`${guildID}.${memberID}`, defaultObj)

        const newUser = new EconomyUser(memberID, guildID, this.options, defaultObj, this.database)
        return newUser
    }

    /**
     * Checks the Economy configuration, fixes the problems and returns it.
     * @param {CheckerConfiguration} options Option checker options.
     * @param {EconomyConfiguration} ecoOptions Economy configuration to check.
     * @returns {EconomyConfiguration} Fixed Economy configuration.
     */
    checkConfiguration(options = {}, ecoOptions) {
        this._logger.debug('Debug mode is enabled.', 'lightcyan')
        this._logger.debug('Checking the configuration...')

        const filePathArray = require.main.filename.replaceAll('\\', '/').split('/')
        const fileName = filePathArray[filePathArray.length - 1]

        const isTSFileAllowed = fileName.endsWith('.ts')
        const dirName = dirname(require.main.filename).replace('/' + fileName, '').replace('\\' + fileName, '')

        let fileExtension = isTSFileAllowed ? 'ts' : 'js'
        let optionsFileExists = existsSync(`./economy.config.${fileExtension}`)

        const slash = dirName.includes('\\') ? '\\' : '/'

        if (!optionsFileExists && fileExtension == 'ts' && isTSFileAllowed) {
            fileExtension = 'js'
            optionsFileExists = existsSync(`./economy.config.${fileExtension}`)
        }

        if (optionsFileExists) {
            this._logger.debug(
                `Using configuration file in ${dirName}${slash}economy.config.${fileExtension}...`, 'cyan'
            )

            try {
                const rawOptionsObject = require(`${dirName}/economy.config.${fileExtension}`)
                const optionsObject = rawOptionsObject.default ? rawOptionsObject.default : rawOptionsObject

                options = optionsObject.optionsChecker
                ecoOptions = optionsObject
            } catch (err) {
                this._logger.error(`Failed to open the configuration file:\n${err.stack}`)
                this._logger.debug('Using the configuration specified in a constructor...', 'cyan')
            }
        } else this._logger.debug('Using the configuration specified in a constructor...', 'cyan')

        const problems = []
        let output = {}

        const keys = Object.keys(DefaultConfiguration)
        const optionKeys = Object.keys(ecoOptions || {})

        if (!options.ignoreUnspecifiedOptions) options.ignoreUnspecifiedOptions = true
        if (!options.sendLog) options.sendLog = true
        if (!options.showProblems) options.showProblems = true

        if (typeof ecoOptions !== 'object' && !Array.isArray(ecoOptions)) {
            problems.push('options is not an object. Received type: ' + typeof ecoOptions)
            output = DefaultConfiguration
        } else {
            for (const i of keys) {
                if (ecoOptions[i] == undefined) {
                    output[i] = DefaultConfiguration[i]
                    if (!options.ignoreUnspecifiedOptions) problems.push(`options.${i} is not specified.`)
                }

                else {
                    output[i] = ecoOptions[i]
                }

                for (const y of Object.keys(DefaultConfiguration[i] || {}).filter(key => isNaN(key))) {
                    if (ecoOptions[i]?.[y] == undefined || output[i]?.[y] == undefined) {
                        try {
                            output[i][y] = DefaultConfiguration[i][y]
                        } catch (_) {
                            null
                        }

                        if (!options.ignoreUnspecifiedOptions) {
                            problems.push(`options.${i}.${y} is not specified.`)
                        }
                    }

                    else {
                        null
                    }
                }

                if (typeof output[i] !== typeof DefaultConfiguration[i]) {
                    if (!options.ignoreInvalidTypes) {
                        const isRewardOption = i == 'dailyAmount' || i == 'workAmount' ||
                            i == 'weeklyAmount' || i == 'hourlyAmount' ||
                            i == 'monthlyAmount'

                        if (isRewardOption) {
                            if (typeof output[i] !== 'number' && !Array.isArray(output[i])) {
                                problems.push(
                                    `options.${i} is not a number or array.` +
                                    `Received type: ${typeof output[i]}.`
                                )
                                output[i] = DefaultConfiguration[i]
                            }

                        } else {
                            problems.push(
                                `options.${i} is not a ${typeof DefaultConfiguration[i]}. ` +
                                `Received type: ${typeof output[i]}.`
                            )

                            output[i] = DefaultConfiguration[i]
                        }
                    }
                }

                else {
                    null
                }

                if (i == 'workAmount' && Array.isArray(output[i]) && output[i].length > 2) {
                    output[i] = output[i].slice(0, 2)
                    problems.push(errors.workAmount.tooManyElements)
                }

                if (i == 'dailyAmount' && Array.isArray(output[i]) && output[i].length > 2) {
                    output[i] = output[i].slice(0, 2)
                    problems.push(errors.workAmount.tooManyElements)
                }

                for (const y of Object.keys(DefaultConfiguration[i] || {}).filter(key => isNaN(key))) {
                    if (typeof output[i]?.[y] !== typeof DefaultConfiguration[i][y]) {
                        if (!options.ignoreInvalidTypes) {
                            problems.push(
                                `options.${i}.${y} is not a ${typeof DefaultConfiguration[i][y]}. ` +
                                `Received type: ${typeof output[i][y]}.`
                            )
                        }
                        output[i][y] = DefaultConfiguration[i][y]
                    }

                    else {
                        null
                    }
                }
            }

            for (const i of optionKeys) {
                const defaultIndex = keys.indexOf(i)
                const objectKeys = Object.keys(ecoOptions[i]).filter(key => isNaN(key))

                for (const y of objectKeys) {
                    const allKeys = Object.keys(DefaultConfiguration[i] || {})
                    const index = allKeys.indexOf(y)

                    if (!allKeys[index]) {
                        problems.push(`options.${i}.${y} is an invalid option.`)
                        unset(output, `${i}.${y}`)
                    }
                }

                if (!keys[defaultIndex]) {
                    unset(output, i)
                    problems.push(`options.${i} is an invalid option.`)
                }

            }
        }

        if (options.sendLog) {
            if (options.showProblems && problems.length) {
                console.log(`Checked the configuration: ${problems.length ?
                    `${problems.length} problems found:\n\n${problems.join('\n')}` :
                    '0 problems found.'}`)

                console.log(
                    'Configuration from ' +
                    `${optionsFileExists ?
                        `${dirName}${slash}economy.config.${fileExtension}` :
                        'the constructor'}`
                )
            }

            if (options.sendSuccessLog && !options.showProblems) {
                console.log(
                    `Checked the configuration: ${problems.length} ` +
                    `${problems.length == 1 ? 'problem' : 'problems'} found.`
                )

                console.log(
                    'Configuration from ' +
                    `${optionsFileExists ?
                        `${dirName}${slash}economy.config.${fileExtension}` :
                        'the constructor'}`
                )
            }
        }

        if (output == DefaultConfiguration) {
            return ecoOptions
        }

        else {
            return output
        }
    }
}

/**
* Module update state.
* @typedef {object} VersionData
* @property {boolean} updated Is the module updated.
* @property {string} installedVersion Installed version.
* @property {string} packageVersion Avaible version.
*/

/**
 * @typedef {object} EconomyConfiguration Default Economy configuration.
 * @property {number} [dailyCooldown=86400000]
 * Cooldown for Daily Reward (in ms). Default: 24 hours (60000 * 60 * 24 ms)
 *
 * @property {number} [workCooldown=3600000] Cooldown for Work Reward (in ms). Default: 1 hour (60000 * 60 ms)
 * @property {number | number[]} [dailyAmount=100] Amount of money for Daily Reward. Default: 100.
 * @property {number} [weeklyCooldown=604800000]
 * Cooldown for Weekly Reward (in ms). Default: 7 days (60000 * 60 * 24 * 7 ms)
 *
 * @property {number | number[]} [weeklyAmount=100] Amount of money for Weekly Reward. Default: 1000.
 * @property {number | number[]} [workAmount=[10, 50]] Amount of money for Work Reward. Default: [10, 50].
 *
 * @property {number | number[]} [monthlyAmount=10000] Amount of money for Monthly Reward. Default: 10000.
 * @property {number} [monthlyCooldown=2629746000] Cooldown for Weekly Reward (in ms). Default: 1 month (2629746000 ms).
 * 
 * @property {number | number[]} [hourlyAmount=20] Amount of money for Hourly Reward. Default: 20.
 * @property {number} [hourlyCooldown=3600000] Cooldown for Hourly Reward (in ms). Default: 1 hour (3600000 ms).
 *
 * @property {boolean} [subtractOnBuy=true]
 * If true, when someone buys the item, their balance will subtract by item price. Default: false
 *
 * @property {number} [sellingItemPercent=75]
 * Percent of the item's price it will be sold for. Default: 75.
 *
 * @property {boolean} [deprecationWarnings=true]
 * If true, the deprecation warnings will be sent in the console. Default: true.
 *
 * @property {boolean} [savePurchasesHistory=true] If true, the module will save all the purchases history.
 *
 * @property {string} [dateLocale='en'] The region (example: 'ru'; 'en') to format the date and time. Default: 'en'.
 * @property {UpdaterOptions} [updater=UpdaterOptions] Update checker configuration.
 * @property {ErrorHandlerConfiguration} [errorHandler=ErrorHandlerConfiguration] Error handler configuration.

 * @property {CheckerConfiguration} [optionsChecker=CheckerConfiguration]
 * Configuration for an 'Economy.utils.checkConfiguration' method.
 * @property {boolean} [debug=false] Enables or disables the debug mode.
 */

/**
 * @typedef {object} UpdaterOptions Update checker configuration.
 * @property {boolean} [checkUpdates=true] Sends the update state message in console on start. Default: true.
 * @property {boolean} [upToDateMessage=true]
 * Sends the message in console on start if module is up to date. Default: true.
 */

/**
 * @typedef {object} ErrorHandlerConfiguration
 * @property {boolean} [handleErrors=true] Handles all errors on startup. Default: true.
 * @property {number} [attempts=5] Amount of attempts to load the module. Use 0 for infinity attempts. Default: 5.
 * @property {number} [time=3000] Time between every attempt to start the module (in ms). Default: 3000.
 */

/**
 * @typedef {object} CheckerConfiguration Configuration for an 'Economy.utils.checkConfiguration' method.
 * @property {boolean} [ignoreInvalidTypes=false]
 * Allows the method to ignore the options with invalid types. Default: false.
 *
 * @property {boolean} [ignoreUnspecifiedOptions=true]
 * Allows the method to ignore the unspecified options. Default: true.
 *
 * @property {boolean} [ignoreInvalidOptions=false] Allows the method to ignore the unexisting options. Default: false.
 * @property {boolean} [showProblems=true] Allows the method to show all the problems in the console. Default: true.
 *
 * @property {boolean} [sendLog=true] Allows the method to send the result in the console.
 * Requires the 'showProblems' or 'sendLog' options to set. Default: true.
 *
 * @property {boolean} [sendSuccessLog=false]
 * Allows the method to send the result if no problems were found. Default: false.
 */

/**
 * Utils manager class.
 * @type {UtilsManager}
 */
module.exports = UtilsManager
