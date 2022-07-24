const { readFileSync, writeFileSync, existsSync } = require('fs')

const errors = require('../structures/errors')

const EconomyError = require('../classes/util/EconomyError')

const ShopItem = require('../classes/ShopItem')
const InventoryItem = require('../classes/InventoryItem')
const HistoryItem = require('../classes/HistoryItem')


/**
* Fetch manager methods class.
*/
class FetchManager {

    /**
     * Fetch Manager.
     * @param {object} options Economy configuration.
     * @param {string} options.storagePath Full path to a JSON file. Default: './storage.json'.
     */
    constructor(options = {}) {

        /**
         * Economy configuration.
         * @type {EconomyOptions}
         * @private
         */
        this.options = options

        /**
         * Full path to a JSON file.
         * @type {string}
         * @private
         */
        this.storagePath = options.storagePath || './storage.json'
    }

    /**
    * Fetches the entire database.
    * @returns {object} Database contents
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
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @returns {number} User's balance.
    */
    fetchBalance(memberID, guildID) {
        const data = this.fetchAll()

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const guildData = data[guildID]
        const memberData = guildData?.[memberID]

        /**
         * @type {number}
         */
        const money = memberData?.money || 0

        return money
    }

    /**
     * Fetches the user's bank balance.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {number} User's bank balance.
     */
    fetchBank(memberID, guildID) {
        const data = this.fetchAll()

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const guildData = data[guildID]
        const memberData = guildData?.[memberID]

        /**
         * @type {number}
         */
        const bankMoney = memberData?.bank || 0

        return bankMoney
    }

    /**
     * Fetches the user's inventory.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {InventoryItem[]} User's inventory.
     */
    fetchInventory(memberID, guildID) {
        const data = this.fetchAll()

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const guildData = data[guildID]
        const memberData = guildData?.[memberID]

        /**
         * @type {InventoryData[]}
         */
        const inventory = memberData?.inventory || []

        return inventory.map(item => new InventoryItem(guildID, memberID, this.options, item))
    }

    /**
     * Fetches the user's purchases history.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {HistoryItem[]} User's purchases history.
     */
    fetchHistory(memberID, guildID) {
        const data = this.fetchAll()

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const guildData = data[guildID]
        const memberData = guildData?.[memberID]

        /**
         * @type {HistoryData[]}
         */
        const history = memberData?.history || []

        return history.map(item => new HistoryItem(guildID, memberID, this.options, item))
    }

    /**
     * Fetches the user's cooldowns.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {CooldownData} User's cooldowns object.
     */
    fetchCooldowns(memberID, guildID) {
        const data = this.fetchAll()

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

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
     * @param {string} guildID Guild ID
     * @returns {ShopItem[]} The shop array.
     */
    fetchShop(guildID) {
        const data = this.fetchAll()

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const guildData = data[guildID]
        const shop = guildData?.shop || []

        return shop.map(item => new ShopItem(guildID, item, this.database))
    }
}

/**
 * @typedef {object} CooldownData User's cooldown data.
 * @property {number} dailyCooldown User's daily cooldown.
 * @property {number} workCooldown User's work cooldown.
 * @property {number} weeklyCooldown User's weekly cooldown.
 */

/**
 * @typedef {object} HistoryData History data object.
 * @property {number} id Item ID in history.
 * @property {string} name Item name.
 * @property {number} price Item price.
 * @property {string} message The message that will be returned on item use.
 * @property {string} role ID of Discord Role that will be given to user on item use.
 * @property {string} date Date when the item was bought by a user.
 * @property {string} memberID Member ID.
 * @property {string} guildID Guild ID.
 */

/**
 * @typedef {object} InventoryData Inventory data object.
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
 * Item data object.
 * @typedef {object} ItemData
 * @property {number} id Item ID.
 * @property {string} name Item name.
 * @property {number} price Item price.
 * @property {string} message The message that will be returned on item use.
 * @property {string} description Item description.
 * @property {string} role ID of Discord Role that will be given to Wuser on item use.
 * @property {number} maxAmount Max amount of the item that user can hold in their inventory.
 * @property {string} date Date when the item was added in the shop.
 * @property {object} custom Custom item properties object.
 */

/**
 * Fetch manager class.
 * @type {FetchManager}
 */
module.exports = FetchManager
