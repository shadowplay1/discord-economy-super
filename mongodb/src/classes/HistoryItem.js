/**
* History item class.
*/
class HistoryItem {

    /**
     * History item class.
     * @param {string} guildID Guild ID.
     * @param {string} memberID Member ID.
     * @param {EconomyConfiguration} ecoOptions Economy configuration.
     * @param {HistoryData} itemObject User purchases history item object.
     * @param {DatabaseManager} database Database Manager.
     * @param {CacheManager} cache Cache manager.
     */
    constructor(guildID, memberID, ecoOptions, itemObject, database, cache) {

        /**
         * Guild ID.
         * @type {string}
         */
        this.guildID = guildID

        /**
         * Member ID.
         * @type {string}
         */
        this.memberID = memberID

        /**
         * Economy configuration.
         * @type {EconomyConfiguration}
         */
        this.options = ecoOptions

        /**
         * Raw item object.
         * @type {HistoryData}
         */
        this.rawObject = itemObject

        /**
         * Item ID in history.
         * @type {number}
         */
        this.id = itemObject.id

        /**
         * Item name.
         * @type {string}
         */
        this.name = itemObject.name

        /**
         * Item price.
         * @type {number}
         */
        this.price = itemObject.price

        /**
         * The message that will be returned on item use.
         * @type {string}
         */
        this.message = itemObject.message

        /**
        * Date when the item was bought by a user.
        * @type {string}
        */
        this.date = itemObject.date

        /**
         * ID of Discord Role that will be given to the user on item use.
         * @type {string}
         */
        this.role = itemObject.role

        /**
         * Database Manager.
         * @type {DatabaseManager}
         * @private
         */
        this._database = database

        /**
         * Cache Manager.
         * @type {CacheManager}
         * @private
         */
        this.cache = cache

        for (const [key, value] of Object.entries(itemObject || {})) {
            this[key] = value
        }
    }

    /**
     * Removes the item from the history.
     * 
     * This method is an alias for 'HistoryItem.remove()' method.
     * @returns {Promise<boolean>} If removed: true, else: false.
     */
    delete() {
        return this.remove()
    }

    /**
     * Removes the item from the history.
     * @returns {Promise<boolean>} If removed: true, else: false.
     */
    async remove() {
        const id = this.id
        const history = (await this._database.fetch(`${this.guildID}.${this.memberID}.history`)) || []

        const historyItem = history.find(
            historyItem =>
                historyItem.id == id &&
                historyItem.memberID == this.memberID &&
                historyItem.guildID == this.guildID
        )

        const historyItemIndex = history.findIndex(histItem => histItem.id == historyItem.id)

        if (!historyItem) return false
        history.splice(historyItemIndex, 1)

        const result = await this.database.set(`${this.guildID}.${this.memberID}.history`, history)

        this.cache.history.update({
            guildID: this.guildID,
            memberID: this.memberID
        })

        return result
    }

    /**
     * Saves the history item object in database.
     * @returns {Promise<HistoryItem>} History item instance.
     */
    async save() {
        const historyArray = (await this.database.fetch(`${this.guildID}.${this.memberID}.history`)) || []
        const itemIndex = historyArray.findIndex(item => item.id == this.id)

        for (const prop in this.rawObject) {
            this.rawObject[prop] = this[prop]
        }

        historyArray.splice(itemIndex, 1, this.rawObject)
        await this.database.set(`${this.guildID}.${this.memberID}.history`, historyArray)

        this.cache.updateMany(['guilds', 'history'], {
            guildID: this.guildID
        })

        return this
    }

    /**
     * Converts the history item to string.
     * @returns {string} String representation of history item.
     */
    toString() {
        return `History Item ${this.name} (ID in History: ${this.id}) - ${this.price} coins`
    }
}


/**
 * History data object.
 * @typedef {object} HistoryData
 * @property {number} id Item ID in history.
 * @property {string} name Item name.
 * @property {number} price Item price.
 * @property {string} message The message that will be returned on item use.
 * @property {string} role ID of Discord Role that will be given to user on item use.
 * @property {string} date Date when the item was bought by a user.
 * @property {number} quantity Quantity of the item.
 * @property {string} memberID Member ID.
 * @property {string} guildID Guild ID.
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
 * History item class.
 * @type {HistoryItem}
 */
module.exports = HistoryItem
