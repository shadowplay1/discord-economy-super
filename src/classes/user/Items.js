const ShopManager = require('../../managers/ShopManager')
const InventoryManager = require('../../managers/InventoryManager')
const DatabaseManager = require('../../managers/DatabaseManager')


/**
 * User Items.
 */
class Items {

    /**
     * User Items.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} ecoOptions Economy configuratuion.
     * @param {DatabaseManager} database Database Manager.
     */
    constructor(memberID, guildID, ecoOptions, database) {

        /**
         * Member ID.
         * @type {string}
         * @private
         */
        this.memberID = memberID

        /**
         * Guild ID.
         * @type {string}
         * @private
         */
        this.guildID = guildID

        /**
         * Shop Manager.
         * @type {ShopManager}
         * @private
         */
        this._shop = new ShopManager(ecoOptions)

        /**
         * Inventory Manager.
         * @type {InventoryManager}
         * @private
         */
        this._inventory = new InventoryManager(ecoOptions, database)
    }

    /**
     * Buys the item from the shop.
     * @param {string | number} itemID Item ID or name.
     * @param {number} [quantity=1] Quantity of items to buy. Default: 1.
     * 
     * @param {string} [reason='received the item from the shop'] 
     * The reason why the money was subtracted. Default: 'received the item from the shop'.
     * 
     * @returns {ShopOperationInfo} Operation information object.
     */
    buy(itemID, quantity, reason) {
        return this._shop.buyItem(itemID, this.memberID, this.guildID, quantity, reason)
    }

    /**
     * Adds the item from the shop to user's inventory.
     * @param {string | number} itemID Item ID or name.
     * @param {number} [quantity=1] Quantity of items to add. Default: 1.
     * @returns {boolean} If added successfully: true, else: false.
     */
    add(itemID, quantity) {
        return this._inventory.addItem(itemID, this.memberID, this.guildID, quantity)
    }

    /**
     * Sells the item from the user's inventory.
     * @param {string | number} itemID Item ID or name.
     * @param {number} [quantity=1] Quantity of items to sell. Default: 1.
     * 
     * @param {string} [reason='sold the item to the shop']
     * The reason why the money was added. Default: 'sold the item to the shop'.
     * 
     * @returns {SellingOperationInfo} Selling operation info.
     */
    sell(itemID, quantity, reason) {
        return this._inventory.sellItem(itemID, this.memberID, this.guildID, quantity, reason)
    }

    /**
     * Gets the specified item from the user's inventory.
     * @param {string | number} itemID Item ID or name.
     * @returns {InventoryData[]} User's inventory array.
     */
    get(itemID) {
        return this._inventory.findItem(itemID, this.memberID, this.guildID)
    }

    /**
     * Uses the item from user's inventory.
     * @param {number | string} itemID Item ID or name.
     * @param {Client} [client] Discord Client [Specify if the role will be given in a Discord server].
     * @returns {string} Item message.
     */
    use(itemID, client) {
        return this._inventory.useItem(itemID, this.memberID, this.guildID, client)
    }

    /**
     * Fetches the user's inventory.
     * @returns {InventoryItem[]} User's inventory array.
     */
    all() {
        return this._inventory.fetch(this.memberID, this.guildID)
    }

    /**
     * Removes the item from user's inventory.
     * @param {string | number} itemID Item ID or name.
     * @returns {boolean} If removed successfully: true, else: false.
     */
    remove(itemID) {
        return this._inventory.removeItem(itemID, this.memberID, this.guildID)
    }

    /**
     * Removes the item from user's inventory.
     *
     * This method is an alias for 'Items.remove' method
     * @param {string | number} itemID Item ID or name.
     * @returns {boolean} If removed successfully: true, else: false.
     */
    delete(itemID) {
        return this.remove(itemID)
    }
}


/**
 * @typedef {object} EconomyConfiguration Default Economy configuration.
 * @property {string} [storagePath='./storage.json'] Full path to a JSON file. Default: './storage.json'
 * @property {boolean} [checkStorage=true] Checks the if database file exists and if it has errors. Default: true
 * 
 * @property {number} [dailyCooldown=86400000] 
 * Cooldown for Daily Command (in ms). Default: 24 hours (60000 * 60 * 24 ms)
 * 
 * @property {number} [workCooldown=3600000] Cooldown for Work Command (in ms). Default: 1 hour (60000 * 60 ms)
 * @property {number | number[]} [dailyAmount=100] Amount of money for Daily Command. Default: 100.
 * 
 * @property {number} [weeklyCooldown=604800000] 
 * Cooldown for Weekly Command (in ms). Default: 7 days (60000 * 60 * 24 * 7 ms)
 * 
 * @property {number} [sellingItemPercent=75]
 * Percent of the item's price it will be sold for. Default: 75.
 *
 * @property {boolean} [deprecationWarnings=true]
 * If true, the deprecation warnings will be sent in the console. Default: true.
 *
 * @property {boolean} [savePurchasesHistory=true] If true, the module will save all the purchases history.
 *
 * @property {number | number[]} [weeklyAmount=100] Amount of money for Weekly Command. Default: 1000.
 * @property {number | number[]} [workAmount=[10, 50]] Amount of money for Work Command. Default: [10, 50].
 * 
 * @property {boolean} [subtractOnBuy=true] 
 * If true, when someone buys the item, their balance will subtract by item price. Default: false
 *
 * @property {number} [updateCountdown=1000] Checks for if storage file exists in specified time (in ms). Default: 1000.
 * @property {string} [dateLocale='en'] The region (example: 'ru' or 'en') to format the date and time. Default: 'en'.
 * @property {UpdaterOptions} [updater=UpdaterOptions] Update checker configuration.
 * @property {ErrorHandlerConfiguration} [errorHandler=ErrorHandlerConfiguration] Error handler configuration.

 * @property {CheckerConfiguration} [optionsChecker=CheckerConfiguration] 
 * Configuration for an 'Economy.utils.checkOptions' method.
 * @property {boolean} [debug=false] Enables or disables the debug mode.
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
 * User Items.
 * @type {Items}
 */
module.exports = Items
