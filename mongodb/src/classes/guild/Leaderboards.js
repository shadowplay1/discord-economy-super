const BalanceManager = require('../../managers/BalanceManager')
const BankManager = require('../../managers/BankManager')


/**
 * Guild leaderboards.
 */
class Leaderboards {

    /**
     * Guild leaderboards class.
     * @param {string} guildID Guild ID.
     * @param {EconomyOptions} options Economy configuration.
     * @param {DatabaseManager} database Database Manager.
     * @param {CacheManager} cache cache Manager.
     */
    constructor(guildID, options, database, cache) {

        /**
        * Guild ID.
        * @type {string}
        * @private
        */
        this.guildID = guildID

        /**
        * Balance Manager.
        * @type {BalanceManager}
        * @private
        */
        this._balance = new BalanceManager(options, database, cache)

        /**
        * Bank Manager.
        * @type {BankManager}
        * @private
        */
        this._bank = new BankManager(options, database, cache)
    }

    /**
     * Gets a money leaderboard for this guild.
     * @returns {Promise<BalanceLeaderboard[]>} Balance leaderboard array.
     */
    money() {
        return this.balance()
    }

    /**
     * Gets a bank balance leaderboard for this guild.
     * @returns {Promise<BankLeaderboard[]>} Bank balance leaderboard array.
     */
    bank() {
        return this._bank.leaderboard(this.guildID)
    }
}

/**
 * Guild leaderboards class.
 * @type {Leaderboards}
 */
module.exports = Leaderboards


/**
 * @typedef {object} EconomyOptions Default Economy configuration.
 * @property {string} [storagePath='./storage.json'] Full path to a JSON file. Default: './storage.json'
 * @property {boolean} [checkStorage=true] Checks the if database file exists and if it has errors. Default: true
 * @property {number} [dailyCooldown=86400000]
 * Cooldown for Daily Command (in ms). Default: 24 hours (60000 * 60 * 24 ms)
 *
 * @property {number} [workCooldown=3600000] Cooldown for Work Command (in ms). Default: 1 hour (60000 * 60 ms)
 * @property {Number | Number[]} [dailyAmount=100] Amount of money for Daily Command. Default: 100.
 * @property {number} [weeklyCooldown=604800000]
 * Cooldown for Weekly Command (in ms). Default: 7 days (60000 * 60 * 24 * 7 ms)
 *
 * @property {Number | Number[]} [weeklyAmount=100] Amount of money for Weekly Command. Default: 1000.
 * @property {Number | Number[]} [workAmount=[10, 50]] Amount of money for Work Command. Default: [10, 50].
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
 * @property {ErrorHandlerOptions} [errorHandler=ErrorHandlerOptions] Error handler configuration.
 * @property {CheckerOptions} [optionsChecker=CheckerOptions] Configuration for an 'Economy.utils.checkOptions' method.
 * @property {boolean} [debug=false] Enables or disables the debug mode.
*/

/**
 * Balance leaderboard object.
 * @typedef {object} BalanceLeaderboard
 * @property {number} index User's place in the leaderboard.
 * @property {string} userID User ID.
 * @property {number} money Amount of money.
 */

/**
 * Bank balance leaderboard object.
 * @typedef {object} BankLeaderboard
 * @property {number} index User's place in the leaderboard.
 * @property {string} userID User ID.
 * @property {number} money Amount of money.
 */
