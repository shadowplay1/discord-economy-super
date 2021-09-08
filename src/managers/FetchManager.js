const { readFileSync, writeFileSync, existsSync } = require('fs')

const errors = require('../structures/errors')

const EconomyError = require('../classes/EconomyError')

/**
* Fetch manager methods class.
*/
class FetchManager {

    /**
     * Economy constructor options object. There's only needed options object properties for this manager to work properly.
     * @param {Object} options Constructor options object.
     * @param {String} options.storagePath Full path to a JSON file. Default: './storage.json'.
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
    }

    /**
    * Fetches the entire database.
    * @returns {Object} Database contents
    */
    fetchAll() {
        const isFileExisting = existsSync(this.storagePath)

        if (!isFileExisting) writeFileSync(this.storagePath, '{}')

        const fileData = readFileSync(this.storagePath)
        const stringData = fileData.toString()

        return JSON.parse(stringData)
    }

    /**
    * Fetches the user's balance.
    * @param {String} memberID Member ID
    * @param {String} guildID Guild ID
    * @returns {Number} User's balance
    */
    fetchBalance(memberID, guildID) {
        const data = this.fetchAll()

        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)

        const guildData = data[guildID]
        const memberData = guildData?.[memberID]

        const money = memberData?.money

        return (money || 0)
    }

    /**
     * Fetches the user's bank balance.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Number} User's bank balance
     */
    fetchBank(memberID, guildID) {
        const data = this.fetchAll()

        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)

        const guildData = data[guildID]
        const memberData = guildData?.[memberID]

        const bankMoney = memberData?.bank

        return (bankMoney || 0)
    }

    /**
     * Fetches the user's inventory.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {InventoryData} User's bank balance
     */
    fetchInventory(memberID, guildID) {
        const data = this.fetchAll()

        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)

        const guildData = data[guildID]
        const memberData = guildData?.[memberID]

        const inventory = memberData?.inventory

        return (inventory || [])
    }

    /**
     * Fetches the user's purchases history.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {HistoryData} User's bank balance
     */
    fetchHistory(memberID, guildID) {
        const data = this.fetchAll()

        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)

        const guildData = data[guildID]
        const memberData = guildData?.[memberID]

        const history = memberData?.history

        return (history || [])
    }

    /**
     * Fetches the user's cooldowns.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {CooldownData} User's bank balance
     */
    fetchCooldowns(memberID, guildID) {
        const data = this.fetchAll()

        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)

        const guildData = data[guildID]
        const memberData = guildData?.[memberID]
        
        const dailyCooldown = memberData?.dailyCooldown
        const workCooldown = memberData?.workCooldown
        const weeklyCooldown = memberData?.weeklyCooldown

        return {
            dailyCooldown,
            workCooldown,
            weeklyCooldown
        }
    }

    /**
     * Shows all items in the shop.
     * @param {String} guildID Guild ID
     * @returns {ItemData[]} The shop array.
     */
    fetchShop(guildID) {
        const data = this.fetchAll()

        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)


        const guildData = data[guildID]
        const shop = guildData?.shop

        return (shop || [])
    }
}

/**
 * @typedef {Object} CooldownData User's cooldown data.
 * @property {Number} dailyCooldown User's daily cooldown.
 * @property {Number} workCooldown User's work cooldown.
 * @property {Number} weeklyCooldown User's weekly cooldown.
 */

/**
 * @typedef {Object} HistoryData History data object.
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
 * @typedef {Object} InventoryData Inventory data object.
 * @property {Number} id Item ID in your inventory.
 * @property {String} itemName Item name.
 * @property {Number} price Item price.
 * @property {String} message The message that will be returned on item use.
 * @property {String} role ID of Discord Role that will be given to user on item use.
 * @property {Number} maxAmount Max amount of the item that user can hold in his inventory.
 * @property {String} date Date when the item was bought.
 */

/**
 * Fetch manager class.
 * @type {FetchManager}
 */
module.exports = FetchManager
