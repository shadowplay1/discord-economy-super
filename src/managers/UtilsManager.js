/* eslint-disable no-empty */

const { readFileSync, writeFileSync } = require('fs')

const fetch = require('node-fetch')

const FetchManager = require('./FetchManager')
const DatabaseManager = require('./DatabaseManager')

const DefaultOptions = require('../structures/DefaultOptions')
const errors = require('../structures/Errors')
const defaultObject = require('../structures/DefaultObject')

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
     * Economy constructor options object. There's only needed options object properties for this manager to work properly.
     * @param {Object} options Constructor options object.
     * @param {String} options.storagePath Full path to a JSON file. Default: './storage.json'.
     */
    constructor(options = {}) {

        /**
         * Economy constructor options object.
         * @type {?EconomyOptions}
         * @private
         */
        this.options = options

        /**
         * Full path to a JSON file.
         * @private
         * @type {String}
        */
        this.storagePath = options.storagePath || './storage.json'

        /**
         * Fetch manager methods object.
         * @type {FetchManager}
         * @private
         */
        this.fetcher = new FetchManager(options)

        /**
         * Database manager methods object.
         * @type {DatabaseManager}
         * @private
         */
        this.database = new DatabaseManager(options)
    }

    /**
     * Checks for if the module is up to date.
     * @returns {Promise<VersionData>} This method will show is the module updated, latest version and installed version.
     */
    async checkUpdates() {
        const version = require('../../package.json').version
        const packageData = await fetch('https://registry.npmjs.com/discord-economy-super').then(text => text.json())
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
    * @returns {Object} Database contents
    */
    all() {
        return this.fetcher.fetchAll()
    }

    /**
     * Writes the data to file.
     * @param {String} path File path to write.
     * @param {any} data Any data to write
     * @returns {Boolean} If successfully written: true; else: false.
     */
    write(path, data) {
        if (!path) return false
        if (!data) return false

        const fileData = readFileSync(path).toString()
        if (fileData == data) return false

        writeFileSync(this.options.storagePath, JSON.stringify(data, null, '\t'))
        return true
    }

    /**
     * Clears the storage file.
     * @returns {Boolean} If cleared successfully: true; else: false
     */
    clearStorage() {
        const data = this.all()
        const stringData = String(data)

        if (stringData == '{}') return false

        this.write(this.options.storagePath, '{}')
        return true
    }

    /**
    * Fully removes the guild from database.
    * @param {String} guildID Guild ID
    * @returns {Boolean} If cleared successfully: true; else: false
    */
    removeGuild(guildID) {
        const data = this.fetcher.fetchAll()
        const guild = data[guildID]

        if (!guildID) return false
        if (!guild) return false

        this.database.remove(guildID)
        return true
    }

    /**
     * Removes the user from database.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared successfully: true; else: false
     */
    removeUser(memberID, guildID) {
        const data = this.fetcher.fetchAll()

        const guild = data[guildID]
        const user = guild?.[memberID]

        if (!guildID) return false
        if (!guild) return false
        if (!user) return false

        this.database.remove(`${guildID}.${memberID}`)
        return true
    }

    /**
     * Sets the default user object for the specified member.
     * @param {String} memberID Member ID.
     * @param {String} guildID Guild ID.
     * @returns {Boolean} If resetted successfully: true; else: false.
     */
    reset(memberID, guildID) {
        if (!guildID) return false
        if (!memberID) return false

        return this.database.set(`${guildID}.${memberID}`, defaultObject)
    }

    /**
     * Checks the Economy options object, fixes the problems in it and returns the fixed options object.
     * @param {CheckerOptions} options Option checker options.
     * @param {EconomyOptions} ecoOptions Economy options object to check.
     * @returns {EconomyOptions} Fixed economy options object.
     */
    checkOptions(options = {}, ecoOptions) {
        let problems = []
        let output = {}

        const keys = Object.keys(DefaultOptions)
        const optionKeys = Object.keys(ecoOptions || {})

        if (typeof ecoOptions !== 'object' && !Array.isArray(ecoOptions)) {
            problems.push('options is not an object. Received type: ' + typeof ecoOptions)
            output = DefaultOptions
        } else {
            for (let i of keys) {
                if (ecoOptions[i] == undefined) {

                    output[i] = DefaultOptions[i]
                    if (!options.ignoreUnspecifiedOptions) problems.push(`options.${i} is not specified.`)
                }
                else {
                    output[i] = ecoOptions[i]
                }

                for (let y of Object.keys(DefaultOptions[i]).filter(x => isNaN(x))) {

                    if (ecoOptions[i]?.[y] == undefined || output[i]?.[y] == undefined) {
                        try {
                            output[i][y] = DefaultOptions[i][y]
                        } catch (_) { }

                        if (!options.ignoreUnspecifiedOptions) problems.push(`options.${i}.${y} is not specified.`)
                    }

                    else { }
                }

                if (typeof output[i] !== typeof DefaultOptions[i]) {
                    if (!options.ignoreInvalidTypes) {
                        const isRewardOption = i == 'dailyAmount' || i == 'workAmount' || i == 'weeklyAmount'

                        if (isRewardOption) {
                            if (typeof output[i] !== 'number' && !Array.isArray(output[i])) {
                                problems.push(`options.${i} is not a number or array. Received type: ${typeof output[i]}.`)
                                output[i] = DefaultOptions[i]
                            }

                        } else {
                            problems.push(`options.${i} is not a ${typeof DefaultOptions[i]}. Received type: ${typeof output[i]}.`)
                            output[i] = DefaultOptions[i]
                        }
                    }
                }

                else { }

                if (i == 'workAmount' && Array.isArray(output[i]) && output[i].length > 2) {
                    output[i] = output[i].slice(0, 2)
                    problems.push(errors.workAmount.tooManyElements)
                }

                if (i == 'dailyAmount' && Array.isArray(output[i]) && output[i].length > 2) {
                    output[i] = output[i].slice(0, 2)
                    problems.push(errors.workAmount.tooManyElements)
                }


                for (let y of Object.keys(DefaultOptions[i]).filter(x => isNaN(x))) {

                    if (typeof output[i]?.[y] !== typeof DefaultOptions[i][y]) {
                        if (!options.ignoreInvalidTypes) problems.push(`options.${i}.${y} is not a ${typeof DefaultOptions[i][y]}. Received type: ${typeof output[i][y]}.`)
                        output[i][y] = DefaultOptions[i][y]
                    }

                    else { }
                }
            }

            for (let i of optionKeys) {
                const defaultIndex = keys.indexOf(i)
                const objectKeys = Object.keys(ecoOptions[i]).filter(x => isNaN(x))

                for (let y of objectKeys) {
                    const allKeys = Object.keys(DefaultOptions[i])
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
            if (options.showProblems) console.log(`Checked the options: ${problems.length ?
                `${problems.length} problems found:\n\n${problems.join('\n')}` : '0 problems found.'}`)

            if (options.sendSuccessLog && !options.showProblems) console.log(`Checked the options: ${problems.length} ${problems.length == 1 ? 'problem' : 'problems'} found.`)
        }

        if (output == DefaultOptions) return ecoOptions
        else return output
    }
}

/**
* Module update state.
* @typedef {Object} VersionData
* @property {Boolean} updated Is the module updated.
* @property {String} installedVersion Installed version.
* @property {String} packageVersion Avaible version.
*/

/**
 * @typedef {Object} EconomyOptions Default Economy options object.
 * @property {String} [storagePath='./storage.json'] Full path to a JSON file. Default: './storage.json'
 * @property {Boolean} [checkStorage=true] Checks the if database file exists and if it has errors. Default: true
 * @property {Number} [dailyCooldown=86400000] Cooldown for Daily Command (in ms). Default: 24 Hours (60000 * 60 * 24) ms
 * @property {Number} [workCooldown=3600000] Cooldown for Work Command (in ms). Default: 1 Hour (60000 * 60) ms
 * @property {Number | Number[]} [dailyAmount=100] Amount of money for Daily Command. Default: 100.
 * @property {Number} [weeklyCooldown=604800000] Cooldown for Weekly Command (in ms). Default: 7 Days (60000 * 60 * 24 * 7) ms
 * @property {Number | Number[]} [weeklyAmount=100] Amount of money for Weekly Command. Default: 1000.
 * @property {Number | Number[]} [workAmount=[10, 50]] Amount of money for Work Command. Default: [10, 50].
 * @property {Boolean} [subtractOnBuy=true] If true, when someone buys the item, their balance will subtract by item price. Default: false
 * @property {Number} [updateCountdown=1000] Checks for if storage file exists in specified time (in ms). Default: 1000.
 * @property {String} [dateLocale='ru'] The region (example: 'ru'; 'en') to format the date and time. Default: 'ru'.
 * @property {UpdaterOptions} [updater=UpdaterOptions] Update Checker options object.
 * @property {ErrorHandlerOptions} [errorHandler=ErrorHandlerOptions] Error Handler options object.
 * @property {CheckerOptions} [optionsChecker=CheckerOptions] Options object for an 'Economy.utils.checkOptions' method.
 */

/**
 * @typedef {Object} UpdaterOptions Updatee options object.
 * @property {Boolean} [checkUpdates=true] Sends the update state message in console on start. Default: true.
 * @property {Boolean} [upToDateMessage=true] Sends the message in console on start if module is up to date. Default: true.
 */

/**
 * @typedef {Object} ErrorHandlerOptions
 * @property {Boolean} [handleErrors=true] Handles all errors on startup. Default: true.
 * @property {Number} [attempts=5] Amount of attempts to load the module. Use 0 for infinity attempts. Default: 5.
 * @property {Number} [time=3000] Time between every attempt to start the module (in ms). Default: 3000.
 */

/**
 * @typedef {Object} CheckerOptions Options object for an 'Economy.utils.checkOptions' method.
 * @property {Boolean} [ignoreInvalidTypes=false] Allows the method to ignore the options with invalid types. Default: false.
 * @property {Boolean} [ignoreUnspecifiedOptions=false] Allows the method to ignore the unspecified options. Default: false.
 * @property {Boolean} [ignoreInvalidOptions=false] Allows the method to ignore the unexisting options. Default: false.
 * @property {Boolean} [showProblems=false] Allows the method to show all the problems in the console. Default: false. 
 * @property {Boolean} [sendLog=false] Allows the method to send the result in the console. Default: false.
 * @property {Boolean} [sendSuccessLog=false] Allows the method to send the result if no problems were found. Default: false.
 */

/**
 * Utils manager class.
 * @type {UtilsManager}
 */
module.exports = UtilsManager
