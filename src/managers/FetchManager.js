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
     * @param {EconomyConfiguration} options Economy configuration.
     * @param {DatabaseManager} database Database Manager.
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
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const guildData = data[guildID]
        const memberData = guildData?.[memberID]

        const money = memberData?.money
        return money || 0
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
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const guildData = data[guildID]
        const memberData = guildData?.[memberID]

        const bankMoney = memberData?.bank
        return bankMoney || 0
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
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const guildData = data[guildID]
        const memberData = guildData?.[memberID]

        const inventory = memberData?.inventory || []
        return inventory.map(item => new InventoryItem(guildID, memberID, this.options, item, this.database))
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
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const guildData = data[guildID]
        const memberData = guildData?.[memberID]

        const history = memberData?.history || []
        return history.map(item => new HistoryItem(guildID, memberID, this.options, item, this.database))
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
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const guildData = data[guildID]
        const memberData = guildData?.[memberID]

        const dailyCooldown = memberData?.dailyCooldown || 0
        const workCooldown = memberData?.workCooldown || 0
        const weeklyCooldown = memberData?.weeklyCooldown || 0
        const monthlyCooldown = memberData?.monthlyCooldown || 0
        const hourlyCooldown = memberData?.hourlyCooldown || 0

        return {
            dailyCooldown,
            workCooldown,
            weeklyCooldown,
            monthlyCooldown,
            hourlyCooldown
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
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
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
 * @property {number} monthlyCooldown User's monthly cooldown.
 * @property {number} hourlyCooldown User's hourly cooldown.
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
 * @property {string} role ID of Discord Role that will be given to the user on item use.
 * @property {number} maxAmount Max amount of the item that user can hold in their inventory.
 * @property {string} date Date when the item was added in the shop.
 * @property {object} custom Custom item properties object.
 */

/**
 * Fetch manager class.
 * @type {FetchManager}
 */
module.exports = FetchManager
