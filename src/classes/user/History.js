const EconomyError = require('../util/EconomyError')
const errors = require('../../structures/errors')

const DatabaseManager = require('../../managers/DatabaseManager')
const FetchManager = require('../../managers/FetchManager')

const BaseManager = require('../../managers/BaseManager')

const HistoryItem = require('../HistoryItem')


/**
 * User purchases history class.
 * @extends {BaseManager}
 */
class History extends BaseManager {

    /**
     * History constructor.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration.
     */
    constructor(memberID, guildID, options) {
        super(options, memberID, guildID, HistoryItem)

        /**
        * Member ID.
        * @type {string}
        */
        this.memberID = memberID

        /**
         * Guild ID.
         * @type {string}
         */
        this.guildID = guildID

        /**
         * Fetch Manager.
         * @type {FetchManager}
         * @private
         */
        this._fetcher = new FetchManager(options)

        /**
         * Database Manager.
         * @type {DatabaseManager}
         * @private
         */
        this.database = new DatabaseManager(options)
    }

    /**
    * Gets all the items in user's purchases history.
    *
    * This method is an alias for `History.all()` method.
    * @returns {HistoryItem[]} User's history item.
    */
    get() {
        return this.all()
    }

    /**
     * Gets all the items in user's purchases history.
     * @returns {HistoryItem[]} User's purchases history.
     */
    all() {
        const results = this.database.fetch(`${this.guildID}.${this.memberID}.history`) || []
        return results.map(historyItem => new HistoryItem(this.guildID, this.memberID, this.options, historyItem))
    }

    /**
     * Adds the item from the shop to the purchases history.
     * @param {string | number} itemID Shop item ID.
     * @returns {boolean} If added: true, else: false.
     */
    add(itemID) {
        const shop = this.database.fetch(`${this.guildID}.shop`)
        const history = this.database.fetch(`${this.guildID}.${this.memberID}.history`)

        const item = shop.find(item => item.id == itemID || item.name == itemID)


        if (typeof itemID !== 'number' && typeof itemID !== 'string') {
            throw new EconomyError(errors.invalidType('itemID', 'string or number', itemID), 'INVALID_TYPE')
        }

        if (!item) return false

        return this.database.push(`${this.guildID}.${this.memberID}.history`, {
            id: history.length ? history[history.length - 1].id + 1 : 1,
            memberID: this.memberID,
            guildID: this.guildID,
            name: item.name,
            price: item.price,
            role: item.role || null,
            maxAmount: item.maxAmount,
            date: new Date().toLocaleString(this.options.dateLocale || 'en')
        })
    }

    /**
     * Removes the specified item from purchases history.
     * @param {string | number} id History item ID.
     * @returns {boolean} If removed: true, else: false.
     */
    remove(id) {
        if (typeof id !== 'number' && typeof id !== 'string') {
            throw new EconomyError(errors.invalidType('id', 'string or number', id), 'INVALID_TYPE')
        }

        const history = this.fetch(this.memberID, this.guildID)

        const historyItem = this.find(
            historyItem =>
                historyItem.id == id &&
                historyItem.memberID == this.memberID &&
                historyItem.guildID == this.guildID
        )

        const historyItemIndex = history.findIndex(histItem => histItem.id == historyItem.id)

        if (!historyItem) return false
        history.splice(historyItemIndex, 1)

        return this.database.set(`${this.guildID}.${this.memberID}.history`, history)
    }

    /**
     * Removes the specified item from purchases history.
     *
     * This method is an alias for `History.remove()` method.
     * @param {string | number} id History item ID.
     * @returns {boolean} If removed: true, else: false.
     */
    delete(id) {
        return this.remove(id)
    }

    /**
     * Clears the user's purchases history.
     * @returns {boolean} If cleared: true, else: false.
     */
    clear() {
        const history = this.all()
        if (!history) return false

        return this.database.delete(`${this.guildID}.${this.memberID}.history`)
    }

    /**
    * Gets the item from user's purchases history.
    * @param {string | number} id History item ID.
    * @returns {HistoryItem} User's history item.
    */
    getItem(id) {
        const allHistory = this.all()
        return allHistory.find(item => item.id == id)
    }

    /**
     * Gets the specified item from history.
     *
     * This method is an alias for `History.getItem()` method.
     * @param {string | number} id History item ID.
     * @returns {HistoryItem} Purchases history item.
     */
    findItem(id) {
        return this.getItem(id)
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
 * @property {number} [updateCountdown=1000] Checks for if storage file exists in specified time (in ms). Default: 1000.
 * @property {string} [dateLocale='en'] The region (example: 'ru'; 'en') to format the date and time. Default: 'en'.
 * @property {UpdaterOptions} [updater=UpdaterOptions] Update checker configuration.
 * @property {ErrorHandlerConfiguration} [errorHandler=ErrorHandlerConfiguration] Error handler configuration.

 * @property {CheckerConfiguration} [optionsChecker=CheckerConfiguration]
 * Configuration for an 'Economy.utils.checkConfiguration' method.
 * @property {boolean} [debug=false] Enables or disables the debug mode.
 */

/**
 * User's purchases history class.
 * @type {History}
 */
module.exports = History
