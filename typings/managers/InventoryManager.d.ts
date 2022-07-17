import Emitter from '../classes/util/Emitter'

import EconomyOptions from '../interfaces/EconomyOptions'

import InventoryItem from '../classes/InventoryItem'
import ShopOperationInfo from '../interfaces/ShopOperationInfo'


/**
* Inventory manager methods object.
* @extends {Emitter}
*/
declare class InventoryManager extends Emitter {
    public constructor(options: EconomyOptions)

    /**
     * Uses the item from the user's inventory.
     * @param {string} itemID Item ID or name
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @param {any} client The Discord Client [Optional]
     * @returns {string} Item message 
     */
    public useItem(itemID: string | number, memberID: string, guildID: string, client?: any): string

    /**
     * Uses the item from user's inventory.
     * 
     * This method is an alias for the `InventoryManager.useItem()` method.
     * @param {number | string} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {Client} [client] The Discord Client. [Optional]
     * @returns {string} Item message or null if item not found.
     */
    public use(itemID: string | number, memberID: string, guildID: string, client?: any): string

    /**
     * Clears the user's inventory.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {string} If cleared: true, else: false
     */
    public clear(memberID: string, guildID: string): string

    /**
     * Gets the item in the inventory.
     * @param {string} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {InventoryItem} If item not found: null; else: item info object.
     */
    public getItem<T extends object = any>(itemID: string | number, memberID: string, guildID: string): InventoryItem<T>

    /**
     * Gets the item in the inventory.
     * 
     * This method is an alias for the `InventoryManager.getItem()` method.
     * @param {string} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {InventoryItem} If item not found: null; else: item info object.
     */
    public findItem<T extends object = any>(itemID: string | number, memberID: string, guildID: string): InventoryItem<T>

    /**
     * Adds the item from the shop to user's inventory.
     * @param {string} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {number} [quantity=1] Quantity of items to add. Default: 1.
     * @returns {ShopOperationInfo} Operation info object.
     */
    public addItem<
        T extends object = any
    >(
        itemID: string | number,
        memberID: string,
        guildID: string,
        quantity?: number
    ): ShopOperationInfo<T>

    /**
     * Shows all items in user's inventory.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns The user's inventory array.
     */
    public fetch<T extends object = any>(memberID: string, guildID: string): InventoryItem<T>[]

    /**
     * Shows all items in user's inventory.
     * 
     * This method is an alias for the `InventoryManager.fetch()` method.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns The user's inventory array.
     */
    public get<T extends object = any>(memberID: string, guildID: string): InventoryItem<T>[]

    /**
     * Removes the item from user's inventory
     * and adds its price to the user' balance.
     * This is the same as selling something.
     * @param {string} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {number} [quantity=1] Quantity of items to sell.
     * @returns {number} The price the item(s) was/were sold for.
     */
    public sellItem(itemID: string | number, memberID: string, guildID: string, quantity?: number, reason?: string): number

    /**
     * Removes the item from user's inventory
     * and adds its price to the user's balance.
     * This is the same as selling something.
     * 
     * This method is an alias for 'InventoryManager.sellItem()' method.
     * @param {string} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {number} [quantity=1] Quantity of items to sell.
     * @param {string} [reason='sold the item from the inventory'] The reason why the item was sold.
     * @returns {number} The price the item(s) was/were sold for.
     */
    public sell(itemID: string | number, memberID: string, guildID: string, quantity?: number, reason?: string): number

    /**
     * Removes the item from user's inventory.
     * @param {string} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {number} [quantity=1] Quantity of items to sell.
     * @returns {string} If removed successfully: true, else: false.
     */
    public removeItem(itemID: string | number, memberID: string, guildID: string, quantity?: number): string
}

export = InventoryManager