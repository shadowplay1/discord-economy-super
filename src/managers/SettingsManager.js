const DatabaseManager = require('./DatabaseManager')
const UtilsManager = require('./UtilsManager')

const EconomyError = require('../classes/EconomyError')

const errors = require('../structures/errors')

const settingsArray = [
    'dailyAmount',
    'dailyCooldown',

    'workAmount',
    'workCooldown',

    'weeklyAmount',
    'weeklyCooldown',

    'dateLocale',
    'subtractOnBuy'
]

function checkValueType(key, value) {
    switch (key) {
        case 'dailyAmount':
            if (typeof value !== 'number') {
                throw new EconomyError(errors.settingsManager.invalidType(key, 'number', typeof value))
            }
            break

        case 'dailyCooldown':
            if (typeof value !== 'number') {
                throw new EconomyError(errors.settingsManager.invalidType(key, 'number', typeof value))
            }
            break


        case 'workAmount':
            if (typeof value !== 'number') {
                throw new EconomyError(errors.settingsManager.invalidType(key, 'number', typeof value))
            }
            break

        case 'workCooldown':
            if (typeof value !== 'number') {
            throw new EconomyError(errors.settingsManager.invalidType(key, 'number', typeof value))
        }
            break


        case 'weeklyAmount':
            if (typeof value !== 'number') {
                throw new EconomyError(errors.settingsManager.invalidType(key, 'number', typeof value))
            }
            break

        case 'weeklyCooldown':
            if (typeof value !== 'number') {
                throw new EconomyError(errors.settingsManager.invalidType(key, 'number', typeof value))
            }
            break


        case 'dateLocale':
            if (typeof value !== 'string') {
                throw new EconomyError(errors.settingsManager.invalidType(key, 'string', typeof value))
            }
            break

        case 'subtractOnBuy':
            if (typeof value !== 'boolean') {
                throw new EconomyError(errors.settingsManager.invalidType(key, 'boolean', typeof value))
            }
            break
    }

    return true
}

/**
 * Settings manager class.
 */
class SettingsManager {

    /**
     * Economy options object.
     * @param {EconomyOptions} options Options object.
     */
    constructor(options) {
        /**
        * Economy options object.
        * @type {EconomyOptions}
        * @private
        */
        this.options = options


        /**
        * Database manager methods object.
        * @type {DatabaseManager}
        * @private
        */
        this.database = new DatabaseManager(options)

        /**
        * Utils manager methods object.
        * @type {UtilsManager}
        * @private
        */
        this.utils = new UtilsManager(options)
    }

    /**
     * Gets the specified setting from the database.
     * 
     * Note: If the server don't have any setting specified,
     * the module will take the values from the
     * options object or default options object.
     * 
     * @param {Settings} key The setting to fetch.
     * @param {String} guildID Guild ID.
     * @returns {any} The setting from the database.
     */
    get(key, guildID) {
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        if (!settingsArray.includes(key)) throw new EconomyError(errors.settingsManager.invalidKey + key)

        const data = this.all(guildID)

        const dbValue = data[key]
        return dbValue
    }

    /**
     * Changes the specified setting.
     * 
     * Note: If the server don't have any setting specified, 
     * the module will take the values from the 
     * options object or default options object.
     * 
     * @param {Settings} key The setting to change.
     * @param {any} value The value to set.`
     * @param {String} guildID Guild ID.
     * @returns {SettingsTypes} The server settings object.
     */
    set(key, value, guildID) {
        if (value == undefined) throw new EconomyError(errors.invalidTypes.value + typeof value)
        if (typeof key !== 'string') throw new EconomyError(errors.databaseManager.invalidTypes.key + typeof key)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)

        if (!settingsArray.includes(key)) throw new EconomyError(errors.settingsManager.invalidKey + key)

        checkValueType(key, value)

        this.database.set(`${guildID}.settings.${key}`, value)
        return this.all(guildID)
    }

    /**
     * Removes the specified setting.
     * 
     * Note: If the server don't have any setting specified, 
     * the module will take the values from the 
     * options object or default options object.
     * 
     * @param {Settings} key The setting to remove.
     * @param {String} guildID Guild ID.
     * @returns {SettingsTypes} The server settings object.
     */
    remove(key, guildID) {
        if (typeof key !== 'string') throw new EconomyError(errors.databaseManager.invalidTypes.key + typeof key)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)

        if (!settingsArray.includes(key)) throw new EconomyError(errors.settingsManager.invalidKey + key)

        this.database.remove(`${guildID}.settings.${key}`)
        return this.all(guildID)
    }

    /**
     * Fetches the server's settings object.
     * @param {String} guildID Guild ID.
     * @returns {SettingsTypes} The server settings object.
     */
    all(guildID) {
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        const settings = this.database.fetch(`${guildID}.settings`)

        return {
            dailyAmount: settings?.dailyAmount == null ? null : settings?.dailyAmount,
            dailyCooldown: settings?.dailyCooldown == null ? null : settings?.dailyCooldown,

            workAmount: settings?.workAmount == null ? null : settings?.workAmount,
            workCooldown: settings?.workCooldown == null ? null : settings?.workCooldown,

            weeklyAmount: settings?.weeklyAmount == null ? null : settings?.weeklyAmount,
            weeklyCooldown: settings?.weeklyCooldown == null ? null : settings?.weeklyCooldown,

            dateLocale: settings?.dateLocale == null ? null : settings?.dateLocale,
            subtractOnBuy: settings?.subtractOnBuy == null ? null : settings?.subtractOnBuy,
        }
    }

    /**
     * Resets all the settings to setting that are in options object.
     * @param {String} guildID Guild ID.
     * @returns {SettingsTypes} The server settings object.
     */
    reset(guildID) {
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)

        const defaultSettings = {
            dailyAmount: this.options.dailyAmount,
            dailyCooldown: this.options.dailyCooldown,

            workAmount: this.options.workAmount,
            workCooldown: this.options.workCooldown,

            weeklyAmount: this.options.weeklyAmount,
            weeklyCooldown: this.options.weeklyCooldown,

            dateLocale: this.options.dateLocale,
            subtractOnBuy: this.options.subtractOnBuy,
        }

        this.database.set(`${guildID}.settings`, defaultSettings)

        return defaultSettings
    }
}

/**
 * @typedef {Object} SettingsTypes Settings object.
 * @property {Number | Number[]} dailyAmount Amount of money for Daily Command. Default: 100.
 * @property {Number} dailyCooldown Cooldown for Daily Command (in ms). Default: 24 Hours (60000 * 60 * 24) ms
 * 
 * @property {Number | Number[]} workAmount Amount of money for Work Command. Default: [10, 50].
 * @property {Number} workCooldown Cooldown for Work Command (in ms). Default: 1 Hour (60000 * 60) ms
 * 
 * @property {Number | Number[]} weeklyAmount Amount of money for Weekly Command. Default: 1000.
 * @property {Number} weeklyCooldown Cooldown for Weekly Command (in ms). Default: 7 Days (60000 * 60 * 24 * 7) ms
 * 
 * @property {String} dateLocale The region (example: 'ru' or 'en') to format the date and time. Default: 'en'
 * @property {Boolean} subtractOnBuy 
 * If true, when someone buys the item, their balance will subtract by item price. Default: false.
 */

/**
 * @typedef {Object} EconomyOptions Default Economy options object.
 * @property {String} [storagePath='./storage.json'] Full path to a JSON file. Default: './storage.json'
 * @property {Boolean} [checkStorage=true] Checks the if database file exists and if it has errors. Default: true
 * @property {Number} [dailyCooldown=86400000] 
 * Cooldown for Daily Command (in ms). Default: 24 Hours (60000 * 60 * 24) ms
 * 
 * @property {Number} [workCooldown=3600000] Cooldown for Work Command (in ms). Default: 1 Hour (60000 * 60) ms
 * @property {Number | Number[]} [dailyAmount=100] Amount of money for Daily Command. Default: 100.
 * @property {Number} [weeklyCooldown=604800000] 
 * Cooldown for Weekly Command (in ms). Default: 7 Days (60000 * 60 * 24 * 7) ms
 * 
 * @property {Boolean} deprecationWarnings 
 * If true, the deprecation warnings will be sent in the console. Default: true.
 *
 * @property {Number} [sellingItemPercent=75] 
 * Percent of the item's price it will be sold for. Default: 75.
 * 
 * @property {Number | Number[]} [weeklyAmount=100] Amount of money for Weekly Command. Default: 1000.
 * @property {Number | Number[]} [workAmount=[10, 50]] Amount of money for Work Command. Default: [10, 50].
 * @property {Boolean} [subtractOnBuy=true] 
 * If true, when someone buys the item, their balance will subtract by item price. Default: false
 * 
 * @property {Number} [updateCountdown=1000] Checks for if storage file exists in specified time (in ms). Default: 1000.
 * @property {String} [dateLocale='en'] The region (example: 'ru' or 'en') to format the date and time. Default: 'en'.
 * @property {UpdaterOptions} [updater=UpdaterOptions] Update Checker options object.
 * @property {ErrorHandlerOptions} [errorHandler=ErrorHandlerOptions] Error Handler options object.
 * @property {CheckerOptions} [optionsChecker=CheckerOptions] Options object for an 'Economy.utils.checkOptions' method.
 */

/**
 * @typedef {Object} UpdaterOptions Updatee options object.
 * @property {Boolean} [checkUpdates=true] Sends the update state message in console on start. Default: true.
 * 
 * @property {Boolean} [upToDateMessage=true] 
 * Sends the message in console on start if module is up to date. Default: true.
 */

/**
 * @typedef {Object} ErrorHandlerOptions
 * @property {Boolean} [handleErrors=true] Handles all errors on startup. Default: true.
 * @property {Number} [attempts=5] Amount of attempts to load the module. Use 0 for infinity attempts. Default: 5.
 * @property {Number} [time=3000] Time between every attempt to start the module (in ms). Default: 3000.
 */

/**
 * @typedef {Object} CheckerOptions Options object for an 'Economy.utils.checkOptions' method.
 * @property {Boolean} [ignoreInvalidTypes=false] 
 * Allows the method to ignore the options with invalid types. Default: false.
 * 
 * @property {Boolean} [ignoreUnspecifiedOptions=false] 
 * Allows the method to ignore the unspecified options. Default: false.
 * 
 * @property {Boolean} [ignoreInvalidOptions=false] Allows the method to ignore the unexisting options. Default: false.
 * @property {Boolean} [showProblems=false] Allows the method to show all the problems in the console. Default: false. 
 * @property {Boolean} [sendLog=false] Allows the method to send the result in the console. Default: false.
 * @property {Boolean} [sendSuccessLog=false] 
 * Allows the method to send the result if no problems were found. Default: false.
 */

/**
 * @typedef {'dailyAmount' | 'dailyCooldown' | 
 * 'workAmount' | 'workCooldown' | 
 * 'weeklyAmount' | 'weeklyCooldown' | 
 * 'dateLocale' | 'subtractOnBuy'} Settings
 */

/**
 * Settings Manager.
 * @type {SettingsManager}
 */
module.exports = SettingsManager