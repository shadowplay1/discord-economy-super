const EconomyError = require('../classes/util/EconomyError')
const errors = require('../structures/errors')

const HistoryItem = require('../classes/HistoryItem')

/**
 * History manager methods class.
 */
class HistoryManager {

    /**
    * History Manager.
    * @param {object} options Economy configuration.
    * @param {string} options.storagePath Full path to a JSON file. Default: './storage.json'.
    * @param {string} options.dateLocale The region (example: 'ru' or 'en') to format date and time. Default: 'en'.
    * @param {boolean} options.savePurchasesHistory If true, the module will save all the purchases history.
    */
    constructor(options = {}, database) {


        /**
         * Economy configuration.
         * @type {EconomyConfiguration}
         * @private
         */
        this.options = options

        /**
         * Full path to a JSON file.
         * @type {string}
         * @private
         */
        this.storagePath = options.storagePath || './storage.json'

        /**
        * Database Manager.
        * @type {DatabaseManager}
        * @private
        */
        this.database = database
    }

    /**
     * Shows the user's purchases history.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {HistoryItem[]} User's purchases history.
     */
    fetch(memberID, guildID) {
        const history = this.database.fetch(`${guildID}.${memberID}.history`) || []

        if (!this.options.savePurchasesHistory) {
            throw new EconomyError(errors.savingHistoryDisabled, 'PURCHASES_HISTORY_DISABLED')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        return history.map(
            historyItem =>
                new HistoryItem(guildID, memberID, this.options, historyItem, this.database)
        )
    }

    /**
    * Shows the user's purchases history.
    *
    * This method is an alias for `HistoryManager.fetch()` method.
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @returns {HistoryItem[]} User's purchases history.
    */
    get(memberID, guildID) {
        return this.fetch(memberID, guildID)
    }

    /**
    * Clears the user's purchases history.
    * @param {string} memberID Member ID.
    * @param {string} guildID Guild ID.
    * @returns {boolean} If cleared: true, else: false.
    */
    clear(memberID, guildID) {
        const history = this.fetch(memberID, guildID)

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        if (!history) return false
        return this.database.delete(`${guildID}.${memberID}.history`)
    }

    /**
     * Adds the item from the shop to the purchases history.
     * @param {string | number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {number} [quantity=1] Quantity of the item.
     * @returns {boolean} If added: true, else: false.
     */
    add(itemID, memberID, guildID, quantity = 1) {
        const shop = this.database.fetch(`${guildID}.shop`) || []
        const history = this.database.fetch(`${guildID}.${memberID}.history`) || []

        const item = shop.find(item => item.id == itemID || item.name == itemID)
        const totalPrice = item.price * quantity

        if (!arguments[3]) {
            this.database.logger.optionalParamNotSpecified(
                'HistoryItem.buy',
                'quantity',
                quantity
            )
        }

        if (typeof itemID !== 'number' && typeof itemID !== 'string') {
            throw new EconomyError(errors.invalidType('itemID', 'string or number', itemID), 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        if (!item) return false

        const result = this.database.push(`${guildID}.${memberID}.history`, {
            id: history.length ? history[history.length - 1].id + 1 : 1,
            memberID,
            guildID,
            name: item.name,
            price: item.price,
            quantity,
            totalPrice,
            role: item.role || null,
            maxAmount: item.maxAmount,
            date: new Date().toLocaleString(this.options.dateLocale || 'en'),
            custom: item.custom || {}
        })

        return result
    }

    /**
     * Removes the specified item from purchases history.
     * @param {string | number} id History item ID.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {boolean} If removed: true, else: false.
     */
    remove(id, memberID, guildID) {
        if (typeof id !== 'number' && typeof id !== 'string') {
            throw new EconomyError(errors.invalidType('id', 'string or number', id), 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const history = this.fetch(memberID, guildID)

        const historyItem = this.findItem(
            historyItem =>
                historyItem.id == id &&
                historyItem.memberID == memberID &&
                historyItem.guildID == guildID
        )

        const historyItemIndex = history.findIndex(histItem => histItem.id == historyItem.id)

        if (!historyItem) return false
        history.splice(historyItemIndex, 1)

        return this.database.set(`${guildID}.${memberID}.history`, history)
    }

    /**
     * Gets the specified item from history.
     * @param {string | number} id History item ID.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {HistoryItem} Purchases history item.
     */
    findItem(id, memberID, guildID) {
        const history = this.fetch(memberID, guildID)

        if (typeof id !== 'number' && typeof id !== 'string') {
            throw new EconomyError(errors.invalidType('id', 'string or number', id), 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }


        const historyItem = history.find(historyItem => historyItem.id == id)
        return new HistoryItem(guildID, memberID, this.options, historyItem) || null
    }

    /**
     * Gets the specified item from history.
     *
     * This method is an alias for `HistoryManager.findItem()` method.
     * @param {string | number} id History item ID.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {HistoryItem} Purchases history item.
     */
    getItem(id, memberID, guildID) {
        return this.findItem(id, memberID, guildID)
    }
}

/**
 * Item data object.
 * @typedef {object} ItemData
 * @property {number} id Item ID.
 * @property {string} name Item name.
 * @property {number} price Item price.
 * @property {string} message The message that will be returned on item use.
 * @property {string} description Item description.
 * @property {string} role ID of Discord Role that will be given to the user on item use.
 * @property {number} maxAmount Max amount of the item that user can hold in their inventory.
 * @property {string} date Date when the item was added in the shop.
 * @property {object} custom Custom item properties object.
 */

/**
 * Inventory data object.
 * @typedef {object} InventoryData
 * @property {number} id Item ID in your inventory.
 * @property {string} name Item name.
 * @property {number} price Item price.
 * @property {string} message The message that will be returned on item use.
 * @property {string} role ID of Discord Role that will be given to user on item use.
 * @property {number} maxAmount Max amount of the item that user can hold in their inventory.
 * @property {string} date Date when the item was bought by a user.
 * @property {object} custom Custom item properties object.
 */

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
 * @property {boolean} [deprecationWarnings=true]
 * If true, the deprecation warnings will be sent in the console. Default: true.
 *
 * @property {boolean} [savePurchasesHistory=true] If true, the module will save all the purchases history.
 *
 * @property {number} [sellingItemPercent=75]
 * Percent of the item's price it will be sold for. Default: 75.
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
 * @property {number} [updateCountdown=1000] Checks for if storage file exists in specified time (in ms). Default: 1000.
 * @property {string} [dateLocale='en'] The region (example: 'ru' or 'en') to format the date and time. Default: 'en'.
 * @property {UpdaterOptions} [updater=UpdaterOptions] Update checker configuration.
 * @property {ErrorHandlerConfiguration} [errorHandler=ErrorHandlerConfiguration] Error handler configuration.

 * @property {CheckerConfiguration} [optionsChecker=CheckerConfiguration]
 * Configuration for an 'Economy.utils.checkConfiguration' method.
 * @property {boolean} [debug=false] Enables or disables the debug mode.
 */

module.exports = HistoryManager
