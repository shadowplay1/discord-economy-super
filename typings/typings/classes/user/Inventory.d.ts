import InventoryItem from '../InventoryItem'

import EconomyConfiguration from '../../interfaces/EconomyConfiguration'
import BaseManager from '../../managers/BaseManager'
import DatabaseManager from '../../managers/DatabaseManager'


declare class Inventory extends BaseManager<InventoryItem<any>> {
    public constructor(memberID: string, guildID: string, options: EconomyConfiguration, database: DatabaseManager)

    /**
     * Gets the item from user's inventory.
     * 
     * This method is an alias for the `Inventory.findItem()` method.
     * @returns {InventoryItem} User's inventory item.
     */
    public get<T extends object = any>(itemID: string | number): InventoryItem<T>

    /**
     * Gets all the items in user's inventory.
     * 
     * This method is an alias for 'EconomyUser.inventory.fetch' nethod.
     * @returns {InventoryItem[]} User's inventory array.
     */
    public all<T extends object = any>(): InventoryItem<T>[]

    /**
     * Uses the item: returns the item usage message and removes the item from user's inventory.
     * @param {string} itemID Item ID.
     * @param {any} [client] Discord Client. [Specify if the role will be given on a Discord server]
     * @returns {string} Item message or null if item not found.
     */
    public use(itemID: string | number, client?: any): string

    /**
     * Adds the item from the shop to user's inventory.
     * @param {string} itemID Item ID.
     * @returns {boolean} If added successfully: true, else: false.
     */
    public add(itemID: string | number): boolean

    /**
     * Removes the item from user's inventory.
     * @param {string} itemID Item ID.
     * @returns {boolean} If removed successfully: true, else: false.
     */
    public removeItem(itemID: string | number): boolean

    /**
     * Clears the user's inventory.
     * @returns {boolean} If cleared: true, else: false.
     */
    public clear(): boolean

    /**
     * Fetches the user's inventory.
     * @returns {InventoryItem[]} User's inventory array.
     */
    public fetch<T extends object = any>(): InventoryItem<T>[]

    /**
     * Gets the item from user's inventory.
     * @param {string} itemID Item ID.
     * @returns {InventoryItem} User's inventory item.
     */
    public findItem<T extends object = any>(itemID: string | number): InventoryItem<T>
}

export = Inventory