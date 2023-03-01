import EconomyConfiguration from '../interfaces/EconomyConfiguration'
import InventoryData from '../interfaces/InventoryData'

import DatabaseManager from '../managers/DatabaseManager'
import CacheManager from '../managers/CacheManager'

import CustomItemData from '../interfaces/CustomItemData'
import SellingOperationInfo from '../interfaces/SellingOperationInfo'
import StackedInventoryItemObject from '../interfaces/StackedInventoryItemObject'


/**
* Inventory item class.
*/
declare class InventoryItem<T extends object = any> {

    /**
     * Inventory item class.
     * @param {string} guildID Guild ID.
     * @param {string} memberID Member ID.
     * @param {EconomyConfiguration} ecoOptions Economy configuration.
     * @param {InventoryData} itemObject User inventory object.
     * @param {DatabaseManager} database Database manager.
     * @param {CacheManager} cache Cache manager.
     */
    public constructor(
        guildID: string,
        memberID: string,
        ecoOptions: EconomyConfiguration,
        itemObject: InventoryData<T>,
        database: DatabaseManager,
        cache: CacheManager
    )


    /**
     * Guild ID.
     * @param {string}
     */
    public guildID: string

    /**
     * Shop item ID.
     * @type {number}
     */
    public id: number

    /**
     * Item name.
     * @type {string}
     */
    public name: string

    /**
     * Item price.
     * @type {number}
     */
    public price: number

    /**
     * The message that will be returned on item use.
     * @type {string}
     */
    public message: string

    /**
     * Item description.
     * @type {string}
     */
    public description: string

    /**
     * ID of Discord Role that will be given to the user on item use.
     * @type {string}
     */
    public role: string

    /**
     * Max amount of the item that user can hold in their inventory.
     * @type {number}
     */
    public maxAmount: number

    /**
     * Date when the item was bought by a user.
     * @type {string}
     */
    public date: string

    /**
     * Custom item data object.
     */
    public custom: CustomItemData<T>


    /**
     * Removes an item from the shop.
     * @param {number} [quantity=1] Quantity of items to delete.
     * 
     * This method is an alias for 'InventoryItem.remove()' method.
     * @returns {Promise<boolean>} If removed: true, else: false.
     */
    public delete(quantity?: number): Promise<boolean>

    /**
     * Removes an item from the shop.
     * @param {number} [quantity=1] Quantity of items to delete.
     * @returns {Promise<boolean>} If removed: true, else: false.
     */
    public remove(quantity?: number): Promise<boolean>

    /**
     * Uses the item: returns the item usage message and removes the item from user's inventory.
     * @param {Client} [client] Discord Client. [Specify if the role will be given on a Discord server]
     * @returns {Promise<string>} Item message.
     */
    public use(client?: any): Promise<string>

    /**
     * Returns the stacked item in user inventory: it will have the quantity and total price of the item.
     * @returns {StackedInventoryItemObject<T>} Stacked item object.
     */
    public stack(): StackedInventoryItemObject<T>

    /**
     * Removes the item from user's inventory
     * and adds its price to the user's balance.
     * This is the same as selling something.
     * 
     * @param {number} [quantity=1] Quantity of items to sell.
     * @returns {Promise<SellingOperationInfo>} Selling operation info.
     */
    public sell<T extends object = any>(quantity?: number): Promise<SellingOperationInfo<T>>

    /**
     * Saves the inventory item object in database.
     * @returns {Promise<InventoryItem>} Inventory item instance.
     */
    public save(): Promise<InventoryItem>

    /**
     * Converts the inventory item to string.
     * @returns {string} String representation of inventory item.
     */
    public toString(): string
}

export = InventoryItem
