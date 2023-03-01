import DatabaseManager from './DatabaseManager'

import EconomyConfiguration from '../interfaces/EconomyConfiguration'
import HistoryItem from '../classes/HistoryItem'

/**
* History manager methods class.
*/
declare class HistoryManager {
    public constructor(options: EconomyConfiguration, database: DatabaseManager)

    /**
     * Shows the user's purchase history.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {HistoryItem[]} User's purchase history.
     */
    public fetch<T extends object = any>(memberID: string, guildID: string): HistoryItem<T>[]

    /**
     * Shows the user's purchase history.
     * 
     * This method is an alias for `HistoryManager.fetch()` method.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {HistoryItem[]} User's purchase history.
     */
    public get<T extends object = any>(memberID: string, guildID: string): HistoryItem<T>[]

    /**
    * Clears the user's purchases history.
    * @param {string} memberID Member ID.
    * @param {string} guildID Guild ID.
    * @returns {boolean} If cleared: true, else: false.
    */
    public clear(memberID: string, guildID: string): boolean

    /**
     * Adds the item from the shop to the purchases history.
     * @param {string} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {number} [quantity=1] Quantity of the items.
     * @returns {boolean} If added: true, else: false.
     */
    public add(itemID: string | number, memberID: string, guildID: string, quantity?: number): boolean

    /**
     * Removes the specified item from history.
     * @param {string} id History item ID.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {boolean} If removed: true, else: false.
     */
    public remove(id: string, memberID: string, guildID: string): boolean

    /**
     * Gets the specified item from history.
     * @param {string} id History item ID.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {HistoryItem} If removed: true, else: false.
     */
    public findItem<T extends object = any>(id: string, memberID: string, guildID: string): HistoryItem<T>

    /**
     * Gets the specified item from history.
     * 
     * This method is an alias for the `HistoryManager.findItem()` method.
     * @param {string} id History item ID.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {HistoryItem} If removed: true, else: false.
     */
    public getItem<T extends object = any>(id: string, memberID: string, guildID: string): HistoryItem<T>
}

export = HistoryManager