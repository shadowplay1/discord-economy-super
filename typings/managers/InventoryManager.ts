import InventoryData from '../interfaces/InventoryData'
import EconomyOptions from '../interfaces/EconomyOptions'

/**
* Shop manager methods object.
*/
declare class InventoryManager {
    constructor(options: EconomyOptions)
    /**
     * Uses the item from the user's inventory.
     * @param {number | string} itemID Item ID or name
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @param {any} client The Discord Client [Optional]
     * @returns {string} Item message 
     */
    public useItem(itemID: string, memberID: string, guildID: string, client?: any): string

    /**
     * Clears the user's inventory.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {boolean} If cleared: true, else: false
     */
    public clear(memberID: string, guildID: string): boolean

    /**
     * Searches for the item in the inventory.
     * @param {number | string} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {InventoryData} If item not found: null; else: item info object.
     */
    public searchItem(itemID: number | string, memberID: string, guildID: string): InventoryData

    /**
     * Shows all items in user's inventory
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns The user's inventory array.
     */
    public fetch(memberID: string, guildID: string): InventoryData[]

    /**
     * Removes the item from user's inventory
     * and adds its price to the user' balance.
     * This is the same as selling something.
     * @param {string | number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {number} The price the item was sold for.
     */
    public sellItem(itemID: string | number, memberID: string, guildID: string, reason?: string | 'sold the item from the inventory'): number

    /**
     * Removes the item from user's inventory.
     * @param {string | number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Boolean} If removed successfully: true, else: false.
     */
    public removeItem(itemID: string | number, memberID: string, guildID: string): boolean
}

export = InventoryManager