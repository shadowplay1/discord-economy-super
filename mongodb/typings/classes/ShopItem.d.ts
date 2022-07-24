import ItemData from '../interfaces/ItemData'

import CustomItemData from '../interfaces/CustomItemData'
import { ItemProperties, ItemPropertyType } from '../interfaces/ItemProperties'

import DatabaseManager from '../managers/DatabaseManager'
import CacheManager from '../managers/CacheManager'


/**
* Shop item class.
*/
declare class ShopItem<T extends object = any> {

    /**
     * Shop item class.
     * @param {string} guildID Guild ID.
     * @param {ItemData} itemObject Shop item object.
     * @param {DatabaseManager} database Database Manager.
     * @param {CacheManager} cache Cache manager.
     */
    public constructor(
        guildID: string,
        itemObject: ItemData,
        database: DatabaseManager,
        cache: CacheManager
    )

    /**
     * Guild ID.
     * @type {string}
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
     * ID of Discord Role that will be given to Wuser on item use.
     * @type {string}
     */
    public role: string

    /**
     * Max amount of the item that user can hold in their inventory.
     * @type {number}
     */
    public maxAmount: number

    /**
     * Date when the item was added in the shop.
     * @type {string}
     */
    public date: string

    /**
     * Custom item data object.
     * @type {object}
     */
    public custom: CustomItemData<T>


    /**
    * Checks for is the specified user has enough money to buy the item.
    * @param {string} userID User ID.
    * @param {number} [quantity=1] Quantity of the items to buy.
    * @returns {Promise<boolean>} Is the user has enough money to buy the item.
    */
    public isEnoughMoneyFor(userID: string, quantity?: number): Promise<boolean>

    /**
     * Checks for is the specified user has the item in their inventory.
     * @param {string} userID User ID.
     * @returns {Promise<boolean>} Is the user has the item in their inventory.
     */
    public isInInventory(userID: string): Promise<boolean>

    /**
     * Edits the item in the shop.
     * 
     * @param {"description" | "price" | "name" | "message" | "maxAmount" | "role" | 'custom'} itemProperty
     * This argument means what thing in item you want to edit (item property). 
     * Available item properties are 'description', 'price', 'name', 'message', 'amount', 'role', 'custom'.
     * 
     * @param {T} value Any value to set.
     * @returns {Promise<boolean>} If edited successfully: true, else: false.
     */
    public edit<
        T extends keyof Omit<ItemProperties, 'id' | 'date'>,
        K extends ItemPropertyType<T>
    >(itemProperty: T, value: T extends 'custom' ? CustomItemData<K> : K): Promise<boolean>

    /**
     * Sets a custom object for the item.
     * @param {object} custom Custom item data object.
     * @returns {Promise<boolean>} If set successfully: true, else: false.
     */
    public setCustom<T extends object = any>(custom: CustomItemData<T>): Promise<boolean>

    /**
     * Removes an item from the shop.
     * 
     * This method is an alias for 'ShopItem.remove()' method.
     * @returns {Promise<boolean>} If removed: true, else: false.
     */
    public delete(): Promise<boolean>

    /**
     * Removes an item from the shop.
     * @returns {Promise<boolean>} If removed: true, else: false.
     */
    public remove(): Promise<boolean>
}

export = ShopItem