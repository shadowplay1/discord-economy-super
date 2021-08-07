import ItemData from '../interfaces/ItemData'
import AddItemOptions from '../interfaces/AddItemOptions'
import Inventory from '../interfaces/InventoryData'
import PurchasesHistory from '../interfaces/HistoryData'

/**
* Shop manager methods object.
*/
declare class ShopManager {
    /**
     * Creates an item in shop.
     * @param {AddItemOptions} options Options object with item info.
     * @param {String} guildID Guild ID.
     * @returns Item info.
     */
    public addItem(guildID: string, options: AddItemOptions): ItemData

    /**
     * Edits the item in shop.
     * @param {Number | String} itemID Item ID or name
     * @param {String} guildID Guild ID
     * @param {String} arg This argument means what thing in item you want to edit. Avaible arguments: description, price, name, message, amount, role
     * @returns {Boolean} If edited successfully: true, else: false
     */
    public editItem(itemID: string, guildID: string, arg: 'description' | 'price' | 'itemName' | 'message' | 'maxAmount' | 'role', value: string): boolean

    /**
     * Removes an item from the shop.
     * @param {Number | String} itemID Item ID or name 
     * @param {String} guildID Guild ID
     * @returns {Boolean} If removed: true, else: false
     */
    public removeItem(itemID: string, guildID: string): boolean

    /**
     * Searches for the item in the shop.
     * @param {Number | String} itemID Item ID or name 
     * @param {String} guildID Guild ID
     * @returns If item not found: null; else: item data array
     */
    public searchItem(itemID: string, guildID: string): ItemData

    /**
     * Uses the item from the user's inventory.
     * @param {Number | String} itemID Item ID or name
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @param {any} client The Discord Client [Optional]
     * @returns {String} Item message 
     */
    public useItem(itemID: string, memberID: string, guildID: string, client?: any): string

    /**
     * Buys the item from the shop
     * @param {Number | String} itemID Item ID or name
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @param {String} reason The reason why the money was added. Default: 'received the item from the shop'
     * @returns {String | Boolean} If item bought successfully: true; if item not found: false; if user reached the item's max amount: 'max'
     */
    public buy(itemID: string, memberID: string, guildID: string, reason?: 'received the item from the shop'): Boolean | 'max'

    /**
     * Clears the shop.
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared: true, else: false
     */
    public clear(guildID: string): boolean

    /**
     * Clears the user's inventory.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared: true, else: false
     */
    public clearInventory(memberID: string, guildID: string): boolean

    /**
     * Clears the user's purchases history.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared: true, else: false
     */
    public clearHistory(memberID: string, guildID: string): boolean

    /**
     * Shows all items in the shop.
     * @param {String} guildID Guild ID
     * @returns The shop array.
     */
    public list(guildID: string): Array<ItemData>

    /**
     * Searches for the item in the shop.
     * @param {Number | String} itemID Item ID or name 
     * @param {String} guildID Guild ID
     * @returns If item not found: null; else: item data array
     */
    public searchItem(itemID: number | string, guildID: string): ItemData

    /**
     * Shows all items in user's inventory
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns The user's inventory array.
     */
    public inventory(memberID: string, guildID: string): Array<Inventory>

    /**
     * Shows the user's purchase history.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns User's purchase history array.
     */
    public history(memberID: string, guildID: string): Array<PurchasesHistory>
}

export = ShopManager