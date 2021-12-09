const FetchManager = require('./FetchManager')
const DatabaseManager = require('./DatabaseManager')

const EconomyError = require('../classes/EconomyError')
const errors = require('../structures/errors')


class HistoryManager {

    /**
    * History Manager.
    * 
    * @param {Object} options Economy constructor options object.
    * There's only needed options object properties for this manager to work properly.
    * 
    * @param {String} options.storagePath Full path to a JSON file. Default: './storage.json'.
    * @param {String} options.dateLocale The region (example: 'ru' or 'en') to format date and time. Default: 'en'.
    * @param {Boolean} options.savePurchasesHistory If true, the module will save all the purchases history.
    */
    constructor(options = {}) {

        /**
         * Economy constructor options object.
         * @type {EconomyOptions}
         * @private
         */
        this.options = options

        /**
         * Full path to a JSON file.
         * @type {String}
         * @private
         */
        this.storagePath = options.storagePath || './storage.json'

        /**
         * Fetch Manager.
         * @type {FetchManager}
         * @private
         */
        this.fetcher = new FetchManager(options)

        /**
        * Database Manager.
        * @type {DatabaseManager}
        * @private
        */
        this.database = new DatabaseManager(options)
    }

    /**
     * Shows the user's purchase history.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {HistoryData[]} User's purchase history.
     */
    fetch(memberID, guildID) {
        const history = this.fetcher.fetchHistory(memberID, guildID)

        if (!this.options.savePurchasesHistory) {
            throw new EconomyError(errors.savingHistoryDisabled)
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        }

        return history
    }

    /**
    * Clears the user's purchases history.
    * @param {String} memberID Member ID.
    * @param {String} guildID Guild ID.
    * @returns {Boolean} If cleared: true, else: false.
    */
    clear(memberID, guildID) {
        const history = this.fetch(memberID, guildID)

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        }

        if (!history) return false
        return this.database.remove(`${guildID}.${memberID}.history`)
    }

    /**
     * Adds the item from the shop to the purchases history.
     * @param {String | Number} itemID Item ID or name.
     * @param {String} memberID Member ID.
     * @param {String} guildID Guild ID.
     * @returns {Boolean} If added: true, else: false.
     */
    add(itemID, memberID, guildID) {
        const shop = this.fetcher.fetchShop(guildID)
        const history = this.fetcher.fetchHistory(memberID, guildID)

        const item = shop.find(x => x.id == itemID || x.itemName == itemID)


        if (typeof itemID !== 'number' && typeof itemID !== 'string') {
            throw new EconomyError(errors.invalidTypes.editItemArgs.itemID + typeof itemID)
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        }

        if (!item) return false

        return this.database.push(`${guildID}.${memberID}.history`, {
            id: history.length ? history[history.length - 1].id + 1 : 1,
            memberID,
            guildID,
            itemName: item.itemName,
            price: item.price,
            role: item.role || null,
            maxAmount: item.maxAmount,
            date: new Date().toLocaleString(this.options.dateLocale || 'en')
        })
    }

    /**
     * Removes the specified item from history.
     * @param {String | Number} id History item ID.
     * @param {String} memberID Member ID.
     * @param {String} guildID Guild ID.
     * @returns {Boolean} If removed: true, else: false.
     */
    remove(id, memberID, guildID) {
        if (typeof id !== 'number' && typeof id !== 'string') {
            throw new EconomyError(errors.invalidTypes.id + typeof id)
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        }

        const history = this.fetch(memberID, guildID)
        const historyItem = this.find(id, memberID, guildID)

        const historyItemIndex = history.findIndex(x => x.id == historyItem.id)

        if (!historyItem) return false
        history.splice(historyItemIndex, 1)

        return this.database.set(`${guildID}.${memberID}.history`, history)
    }

    /**
     * Searches for the specified item from history.
     * @param {String | Number} id History item ID.
     * @param {String} memberID Member ID.
     * @param {String} guildID Guild ID.
     * @returns {HistoryData} If removed: true, else: false.
     */
    find(id, memberID, guildID) {
        const history = this.fetch(memberID, guildID)

        if (typeof id !== 'number' && typeof id !== 'string') {
            throw new EconomyError(errors.invalidTypes.id + typeof id)
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        }


        const historyItem = history.find(x => x.id == id)
        return historyItem || null
    }

    /**
     * Searches for the specified item from history.
     * 
     * This method is an alias for the `HistoryManager.find()` method.
     * @param {String | Number} id History item ID.
     * @param {String} memberID Member ID.
     * @param {String} guildID Guild ID.
     * @returns {HistoryData} If removed: true, else: false.
     */
    search(id, memberID, guildID) {
        if (typeof id !== 'number' && typeof id !== 'string') {
            throw new EconomyError(errors.invalidTypes.id + typeof id)
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        }


        const historyItem = this.find(id, memberID, guildID)
        return historyItem
    }
}

/**
 * History data object.
 * @typedef {Object} HistoryData
 * @property {Number} id Item ID in history.
 * @property {String} itemName Item name.
 * @property {Number} price Item price.
 * @property {String} message The message that will be returned on item use.
 * @property {String} role ID of Discord Role that will be given to user on item use.
 * @property {String} date Date when the item was bought.
 * @property {String} memberID Member ID.
 * @property {String} guildID Guild ID.
 */

/**
 * Item data object.
 * @typedef {Object} ItemData
 * @property {Number} id Item ID.
 * @property {String} itemName Item name.
 * @property {Number} price Item price.
 * @property {String} message The message that will be returned on item use.
 * @property {String} description Item description.
 * @property {String} role ID of Discord Role that will be given to Wuser on item use.
 * @property {Number} maxAmount Max amount of the item that user can hold in his inventory.
 * @property {String} date Date when the item was added in the shop.
 */

/**
 * Inventory data object.
 * @typedef {Object} InventoryData
 * @property {Number} id Item ID in your inventory.
 * @property {String} itemName Item name.
 * @property {Number} price Item price.
 * @property {String} message The message that will be returned on item use.
 * @property {String} role ID of Discord Role that will be given to user on item use.
 * @property {Number} maxAmount Max amount of the item that user can hold in his inventory.
 * @property {String} date Date when the item was bought.
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
 * @property {Boolean} [deprecationWarnings=true]
 * If true, the deprecation warnings will be sent in the console. Default: true.
 *
 * @property {Boolean} [savePurchasesHistory=true] If true, the module will save all the purchases history.
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

module.exports = HistoryManager