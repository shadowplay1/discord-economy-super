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
    public editItem(itemID: string | number, guildID: string, arg: 'description' | 'price' | 'itemName' | 'message' | 'maxAmount' | 'role', value: string): boolean

    /**
     * Removes an item from the shop.
     * @param {number | string} itemID Item ID or name 
     * @param {string} guildID Guild ID
     * @returns {boolean} If removed: true, else: false
     */
    public removeItem(itemID: string | number, guildID: string): boolean

    /**
     * Searches for the item in the shop.
     * @param {number | string} itemID Item ID or name 
     * @param {string} guildID Guild ID
     * @returns If item not found: null; else: item data array
     */
    public searchItem(itemID: string | number, guildID: string): ItemData

    /**
     * Searches for the item in the shop.
     * 
     * This method is an alias for the `ShopManager.searchItem()` method.
     * @param {number | string} itemID Item ID or name 
     * @param {string} guildID Guild ID
     * @returns If item not found: null; else: item data array
     */
    public findItem(itemID: string | number, guildID: string): ItemData

    /**
     * Uses the item from the user's inventory.
     * 
     * [!!!] This method is deprecated.
     * If you want to get all the bugfixes and
     * use the newest inventory features, please
     * switch to the usage of the new InventoryManager.
     * 
     * [!!!] No help will be provided for inventory
     * related methods in ShopManager.
     * @param {number | string} itemID Item ID or name
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @param {any} client The Discord Client [Optional]
     * @returns {string} Item message 
     * @deprecated
     */
    public useItem(itemID: string | number, memberID: string, guildID: string, client?: any): string

    /**
     * Buys the item from the shop.
     * @param {number | string} itemID Item ID or name
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @param {string} reason The reason why the money was added. Default: 'received the item from the shop'
     * @returns {string | boolean} If item bought successfully: true; if item not found: false; if user reached the item's max amount: 'max'
     */
    public buy(itemID: string | number, memberID: string, guildID: string, reason?: string | 'received the item from the shop'): boolean | string

    /**
     * Buys the item from the shop.
     * 
     * This method is an alias for the `ShopManager.buy()` method.
     * @param {number | string} itemID Item ID or name
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @param {string} reason The reason why the money was added. Default: 'received the item from the shop'
     * @returns {string | boolean} If item bought successfully: true; if item not found: false; if user reached the item's max amount: 'max'
     */
    public buyItem(itemID: string | number, memberID: string, guildID: string, reason?: string | 'received the item from the shop'): boolean | string

    /**
     * Clears the shop.
     * @param {string} guildID Guild ID
     * @returns {boolean} If cleared: true, else: false
     */
    public clear(guildID: string): boolean

    /**
     * Clears the user's inventory.
     * 
     * [!!!] This method is deprecated.
     * If you want to get all the bugfixes and
     * use the newest inventory features, please
     * switch to the usage of the new InventoryManager.
     * 
     * [!!!] No help will be provided for inventory
     * related methods in ShopManager.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {boolean} If cleared: true, else: false.
     * @deprecated
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
     * Shows all items in the shop.
     * 
     * This method is an alias for the `ShopManager.list()` method.
     * @param {string} guildID Guild ID
     * @returns The shop array.
     */
    public fetch(guildID: string): ItemData[]

    /**
     * Searches for the item in the shop.
     * @param {number | string} itemID Item ID or name 
     * @param {string} guildID Guild ID
     * @returns If item not found: null; else: item info object
     */
    public searchItem(itemID: number | string, guildID: string): ItemData

    /**
     * Searches for the item in the inventory.
     * 
     * [!!!] This method is deprecated.
     * If you want to get all the bugfixes and
     * use the newest inventory features, please
     * switch to the usage of the new InventoryManager.
     * 
     * [!!!] No help will be provided for inventory
     * related methods in ShopManager.
     * @param {number | string} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {InventoryData} If item not found: null; else: item info object.
     * @deprecated
     */
    public searchInventoryItem(itemID: number | string, memberID: string, guildID: string): InventoryData

    /**
     * Shows all items in user's inventory
     * 
     * [!!!] This method is deprecated.
     * If you want to get all the bugfixes and
     * use the newest inventory features, please
     * switch to the usage of the new InventoryManager.
     * 
     * [!!!] No help will be provided for inventory
     * related methods in ShopManager.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns The user's inventory array.
     * @deprecated
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