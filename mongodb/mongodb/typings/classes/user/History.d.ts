import HistoryItem from '../HistoryItem'

import EconomyConfiguration from '../../interfaces/EconomyConfiguration'
import BaseManager from '../../managers/BaseManager'
import DatabaseManager from '../../managers/DatabaseManager'


declare class History extends BaseManager<HistoryItem<any>> {
    public constructor(memberID: string, guildID: string, options: EconomyConfiguration, database: DatabaseManager)

    /**
     * Gets all the items in user's purchases history.
     * 
     * This method is an alias for the `History.all()` method.
     * @returns {Promise<HistoryItem>} User's history item.
     */
    public get<T extends object = any>(): Promise<HistoryItem<T>[]>

    /**
     * Gets all the items in user's purchases history.
     * @returns {Promise<HistoryItem[]>} User's purchases history.
     */
    public all<T extends object = any>(): Promise<HistoryItem<T>[]>

    /**
     * Adds the item from the shop to the purchases history.
     * @param {string} itemID Shop item ID.
     * @returns {Promise<boolean>} If added: true, else: false.
     */
    public add(itemID: string | number): Promise<boolean>

    /**
     * Removes the specified item from purchases history.
     * @param {string} id History item ID.
     * @returns {Promise<boolean>} If removed: true, else: false.
     */
    public remove(id: string): Promise<boolean>

    /**
     * Removes the specified item from purchases history.
     * 
     * This method is an alias for `EconomyUser.history.remove()` method.
     * @param {string} id History item ID.
     * @returns {Promise<boolean>} If removed: true, else: false.
     */
    public delete(id: string): Promise<boolean>

    /**
     * Clears the user's purchases history.
     * @returns {Promise<boolean>} If cleared: true, else: false.
     */
    public clear(): Promise<boolean>

    /**
     * Gets the specified item from history.
     * @param {string | number} id History item ID.
     * @returns {Promise<HistoryItem>} Purchases history item.
     */
    public findItem<T extends object = any>(id: string | number): Promise<HistoryItem<T>>

    /**
     * Gets the specified item from history.
     * @param {string | number} id History item ID.
     * @returns {Promise<HistoryItem>} Purchases history item.
     */
    public getItem<T extends object = any>(id: string | number): Promise<HistoryItem<T>>
}

export = History