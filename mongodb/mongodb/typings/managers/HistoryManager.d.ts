import DatabaseManager from './DatabaseManager'
import CacheManager from './CacheManager'

import EconomyConfiguration from '../interfaces/EconomyConfiguration'

import HistoryItem from '../classes/HistoryItem'


/**
* History manager methods class.
*/
declare class HistoryManager {
    public constructor(options: EconomyConfiguration, database: DatabaseManager, cache: CacheManager)

    /**
     * Shows the user's purchase history.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {Promise<HistoryItem[]>} User's purchase history.
     */
    public fetch<T extends object = any>(memberID: string, guildID: string): Promise<HistoryItem<T>[]>

    /**
     * Shows the user's purchase history.
     * 
     * This method is an alias for `HistoryManager.fetch()` method.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {Promise<HistoryItem[]>} User's purchase history.
     */
    public get<T extends object = any>(memberID: string, guildID: string): Promise<HistoryItem<T>[]>

    /**
    * Clears the user's purchases history.
    * @param {string} memberID Member ID.
    * @param {string} guildID Guild ID.
    * @returns {Promise<boolean>} If cleared: true, else: false.
    */
    public clear(memberID: string, guildID: string): Promise<boolean>

    /**
     * Adds the item from the shop to the purchases history.
     * @param {string} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {number} [quantity=1] Quantity of the items.
     * @returns {Promise<boolean>} If added: true, else: false.
     */
    public add(itemID: string | number, memberID: string, guildID: string, quantity?: number): Promise<boolean>

    /**
     * Removes the specified item from history.
     * @param {string} id History item ID.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<boolean>} If removed: true, else: false.
     */
    public remove(id: string, memberID: string, guildID: string): Promise<boolean>

    /**
     * Gets the specified item from history.
     * @param {string} id History item ID.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<HistoryItem>} If removed: true, else: false.
     */
    public findItem<T extends object = any>(id: string, memberID: string, guildID: string): Promise<HistoryItem<T>>

    /**
     * Gets the specified item from history.
     * 
     * This method is an alias for the `HistoryManager.findItem()` method.
     * @param {string} id History item ID.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<HistoryItem>} If removed: true, else: false.
     */
    public getItem<T extends object = any>(id: string, memberID: string, guildID: string): Promise<HistoryItem<T>>
}

export = HistoryManager