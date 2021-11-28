import ItemData from '../interfaces/ItemData'
import AddItemOptions from '../interfaces/AddItemOptions'
import InventoryData from '../interfaces/InventoryData'
import PurchasesHistory from '../interfaces/HistoryData'
import EconomyOptions from '../interfaces/EconomyOptions'

/**
* Shop manager methods object.
*/
declare class ShopManager {
    constructor(options: EconomyOptions)

    /**
     * Creates an item in shop.
     * @param {AddItemOptions} options Options object with item info.
     * @param {string} guildID Guild ID.
     * @returns Item info.
     */
    public addItem(guildID: string, options: AddItemOptions): ItemData

    /**
     * Edits the item in shop.
     * @param {number | string} itemID Item ID or name
     * @param {string} guildID Guild ID
     * @param {string} arg This argument means what thing in item you want to edit. Avaible arguments: description, price, name, message, amount, role
     * @returns {boolean} If edited successfully: true, else: false
     */
    public editItem(itemID: string, guildID: string, arg: 'description' | 'price' | 'itemName' | 'message' | 'maxAmount' | 'role', value: string): boolean

    /**
     * Removes an item from the shop.
     * @param {number | string} itemID Item ID or name 
     * @param {string} guildID Guild ID
     * @returns {boolean} If removed: true, else: false
     */
    public removeItem(itemID: string, guildID: string): boolean

    /**
     * Searches for the item in the shop.
     * @param {number | string} itemID Item ID or name 
     * @param {string} guildID Guild ID
     * @returns If item not found: null; else: item data array
     */
    public searchItem(itemID: string, guildID: string): ItemData

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
     * Buys the item from the shop
     * @param {number | string} itemID Item ID or name
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @param {string} reason The reason why the money was added. Default: 'received the item from the shop'
     * @returns {string | boolean} If item bought successfully: true; if item not found: false; if user reached the item's max amount: 'max'
     */
    public buy(itemID: string, memberID: string, guildID: string, reason?: string | 'received the item from the shop'): boolean | 'max'

    /**
     * Clears the shop.
     * @param {string} guildID Guild ID
     * @returns {boolean} If cleared: true, else: false
     */
    public clear(guildID: string): boolean

    /**
     * Clears the user's inventory.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {boolean} If cleared: true, else: false
     */
    public clearInventory(memberID: string, guildID: string): boolean

    /**
     * Clears the user's purchases history.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {boolean} If cleared: true, else: false
     */
    public clearHistory(memberID: string, guildID: string): boolean

    /**
     * Shows all items in the shop.
     * @param {string} guildID Guild ID
     * @returns The shop array.
     */
    public list(guildID: string): ItemData[]

    /**
     * Searches for the item in the shop.
     * @param {number | string} itemID Item ID or name 
     * @param {string} guildID Guild ID
     * @returns If item not found: null; else: item info object
     */
    public searchItem(itemID: number | string, guildID: string): ItemData

    /**
     * Searches for the item in the inventory.
     * @param {number | string} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {InventoryData} If item not found: null; else: item info object.
     */
    public searchInventoryItem(itemID: number | string, memberID: string, guildID: string): InventoryData

    /**
     * Shows all items in user's inventory
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns The user's inventory array.
     */
    public inventory(memberID: string, guildID: string): InventoryData[]

    /**
     * Shows the user's purchase history.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns User's purchase history array.
     */
    public history(memberID: string, guildID: string): PurchasesHistory[]
}

export = ShopManager