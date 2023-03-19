const DatabaseManager = require('../../managers/DatabaseManager')
const SettingsManager = require('../../managers/SettingsManager')

/**
 * Guild Settings.
 */
class Settings {

    /**
     * Guild settings class.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration.
     */
    constructor(guildID, options) {

        /**
         * Guild ID.
         * @type {string}
         * @private
         */
        this.guildID = guildID

        /**
         * Settings Manager.
         * @type {SettingsManager}
         * @private
         */
        this._settings = new SettingsManager(options, new DatabaseManager(options))
    }

    /**
     * Fetches the server's settings object.
     * @returns {SettingsTypes} The server settings object.
     */
    all() {
        return this._settings.all(this.guildID)
    }

    /**
     * Gets the specified setting from the database.
     *
     * Note: If the server don't have any setting specified,
     * the module will take the values from the
     * configuration or default configuration.
     *
     * @param {Settings} key The setting to fetch.
     * @returns {any} The setting from the database.
     */
    get(key) {
        return this._settings.get(key, this.guildID)
    }

    /**
     * Changes the specified setting.
     *
     * Note: If the server don't have any setting specified,
     * the module will take the values from the
     * specified configuration or default configuration.
     *
     * @param {Settings} key The setting to change.
     * @param {any} value The value to set.
     * @returns {SettingsTypes} The server settings object.
     */
    set(key, value) {
        return this._settings.set(key, value, this.guildID)
    }

    /**
     * Removes the specified setting.
     *
     * Note: If the server don't have any setting specified,
     * the module will take the values from the
     * specified configuration or default configuration.
     *
     * @param {Settings} key The setting to remove.
     * @returns {SettingsTypes} The server settings object.
     */
    remove(key) {
        return this._settings.remove(key, this.guildID)
    }

    /**
     * Resets all the settings to setting that are in configuration.
     * @returns {SettingsTypes} The server settings object.
     */
    reset() {
        return this._settings.reset(this.guildID)
    }
}


/**
 * @typedef {object} EconomyConfiguration Default Economy configuration.
 * @property {string} [storagePath='./storage.json'] Full path to a JSON file. Default: './storage.json'
 * @property {boolean} [checkStorage=true] Checks the if database file exists and if it has errors. Default: true
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
 * @property {number} [updateCountdown=1000] Checks for if storage file exists in specified time (in ms). Default: 1000.
 * @property {string} [dateLocale='en'] The region (example: 'ru'; 'en') to format the date and time. Default: 'en'.
 * @property {UpdaterOptions} [updater=UpdaterOptions] Update checker configuration.
 * @property {ErrorHandlerConfiguration} [errorHandler=ErrorHandlerConfiguration] Error handler configuration.

 * @property {CheckerConfiguration} [optionsChecker=CheckerConfiguration]
 * Configuration for an 'Economy.utils.checkConfiguration' method.
 * @property {boolean} [debug=false] Enables or disables the debug mode.
*/

/**
 * @typedef {object} SettingsTypes Settings object.
 * @property {number | number[]} dailyAmount Amount of money for Daily Reward. Default: 100.
 * @property {number} dailyCooldown Cooldown for Daily Reward (in ms). Default: 24 hours (60000 * 60 * 24 ms)
 *
 * @property {number | number[]} workAmount Amount of money for Work Reward. Default: [10, 50].
 * @property {number} workCooldown Cooldown for Work Reward (in ms). Default: 1 hour (60000 * 60 ms)
 *
 * @property {number | number[]} weeklyAmount Amount of money for Weekly Reward. Default: 1000.
 * @property {number} weeklyCooldown Cooldown for Weekly Reward (in ms). Default: 7 days (60000 * 60 * 24 * 7 ms)
 *
 * @property {number | number[]} monthlyAmount Amount of money for Monthly Reward. Default: 10000.
 * @property {number} monthlyCooldown Cooldown for Weekly Reward (in ms). Default: 1 month (2629746000 ms).
 * 
 * @property {number | number[]} [hourlyAmount=20] Amount of money for Hourly Reward. Default: 20.
 * @property {number} [hourlyCooldown=3600000] Cooldown for Hourly Reward (in ms). Default: 1 hour (3600000 ms).
 * *
 * @property {string} dateLocale The region (example: 'ru' or 'en') to format the date and time. Default: 'en'
 * @property {boolean} subtractOnBuy
 * If true, when someone buys the item, their balance will subtract by item price. Default: false.
 *
 * @property {number} sellingItemPercent Percent of the item's price it will be sold for. Default: 75.
 */

/**
 * @typedef {'dailyAmount' | 'dailyCooldown' |
 * 'workAmount' | 'workCooldown' |
 * 'weeklyAmount' | 'weeklyCooldown' |
 * 'monthlyAmount' | 'monthlyCooldown' |
 * 'hourlyAmount' | 'hourlyCooldown' |
 * 'dateLocale' | 'subtractOnBuy' |
 * 'sellingItemPercent' | 'savePurchasesHistory'} Settings
 */

/**
 * Guild Settings.
 * @type {Settings}
 */
module.exports = Settings
