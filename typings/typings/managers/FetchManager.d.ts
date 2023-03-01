import DatabaseManager from './DatabaseManager'

import UserCooldownData from '../interfaces/UserCooldownData'
import EconomyConfiguration from '../interfaces/EconomyConfiguration'
import EconomyDatabase from '../interfaces/EconomyDatabase'

import HistoryItem from '../classes/HistoryItem'
import ShopItem from '../classes/ShopItem'
import InventoryItem from '../classes/InventoryItem'

/**
* Fetch manager methods class.
*/
declare class FetchManager {
    public constructor(options: EconomyConfiguration, database: DatabaseManager)

    /**
    * Fetches the entire database.
    * @returns {object} Database contents.
    */
    public fetchAll(): EconomyDatabase

    /**
     * Shows all items in the shop.
     * @param {string} guildID Guild ID
     * @returns {ShopItem[]} The shop array.
     */
    public fetchShop(guildID: string): ShopItem[]

    /**
     * Fetches the user's cooldowns.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {UserCooldownData} User's cooldowns object.
     */
    public fetchCooldowns(memberID: string, guildID: string): UserCooldownData

    /**
     * Fetches the user's purchases history.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {HistoryItem} User's purchases history.
     */
    public fetchHistory(memberID: string, guildID: string): HistoryItem[]

    /**
     * Fetches the user's inventory.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {InventoryItem} User's inventory.
     */
    public fetchInventory(memberID: string, guildID: string): InventoryItem[]

    /**
    * Fetches the user's bank balance.
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @returns {number} User's bank balance.
    */
    public fetchBank(memberID: string, guildID: string): number

    /**
    * Fetches the user's balance.
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @returns {number} User's balance.
    */
    public fetchBalance(memberID: string, guildID: string): number
}

export = FetchManager