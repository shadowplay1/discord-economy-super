import ItemData from '../interfaces/ItemData'

import CustomItemData from '../interfaces/CustomItemData'
import ShopOperationInfo from '../interfaces/ShopOperationInfo'
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
        itemObject: ItemData<T>,
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
    * @returns {boolean} Is the user has enough money to buy the item.
    */
    public isEnoughMoneyFor(userID: string, quantity?: number): boolean

    /**
     * Checks for is the specified user has the item in their inventory.
     * @param {string} userID User ID.
     * @returns {boolean} Is the user has the item in their inventory.
     */
    public isInInventory(userID: string): boolean

    /**
     * Edits the item in the shop.
     * 
     * @param {"description" | "price" | "name" | "message" | "maxAmount" | "role" | 'custom'} itemProperty
     * This argument means what thing in item you want to edit (item property). 
     * Available item properties are 'description', 'price', 'name', 'message', 'amount', 'role', 'custom'.
     * 
     * @param {T} value Any value to set.
     * @returns {boolean} If edited successfully: true, else: false.
     */
    public edit<
        T extends keyof Omit<ItemProperties, 'id' | 'date'>,
        K extends ItemPropertyType<T>
    >(itemProperty: T, value: T extends 'custom' ? CustomItemData<K> : K): boolean

    /**
     * Buys the item from the shop.
     * @param {string} memberID Member ID.
     * @param {number} [quantity=1] Quantity of items to buy. Default: 1.
     * 
     * @param {string | number} [currency=null] 
     * The currency to subtract the money from. 
     * Can be omitted by specifying 'null' or ignoring this parameter.
     * Requires the `subtractOnBuy` option to be enabled. Default: null.
     * 
     * @param {string} [reason='received the item from the shop'] 
     * The reason why the money was subtracted. Default: 'received the item from the shop'.
     * 
     * @returns {ShopOperationInfo} Operation information object.
     */
    public buy<
        T extends object = any
    >(
        memberID: string,
        quantity?: number,
        currency?: string | number,
        reason?: string
    ): ShopOperationInfo<T>

    /**
     * Buys the item from the shop.
     * @param {string} memberID Member ID.
     * @param {number} [quantity=1] Quantity of items to buy. Default: 1.
     * 
     * @param {string} [currency=null] 
     * The currency to subtract the money from. 
     * Can be omitted by specifying 'null' or ignoring this parameter.
     * Requires the `subtractOnBuy` option to be enabled. Default: null.
     * 
     * @param {string} [reason='received the item from the shop'] 
     * The reason why the money was subtracted. Default: 'received the item from the shop'.
     * 
     * @returns {ShopOperationInfo} Operation information object.
     */
    public buy<
        T extends object = any
    >(
        memberID: string,
        quantity?: number,
        currency?: string,
        reason?: string
    ): ShopOperationInfo<T>

    /**
     * Buys the item from the shop.
     * @param {string} memberID Member ID.
     * @param {number} [quantity=1] Quantity of items to buy. Default: 1.
     * 
     * @param {number} [currency=null] 
     * The currency to subtract the money from. 
     * Can be omitted by specifying 'null' or ignoring this parameter.
     * Requires the `subtractOnBuy` option to be enabled. Default: null.
     * 
     * @param {string} [reason='received the item from the shop'] 
     * The reason why the money was subtracted. Default: 'received the item from the shop'.
     * 
     * @returns {ShopOperationInfo} Operation information object.
     */
    public buy<
        T extends object = any
    >(
        memberID: string,
        quantity?: number,
        currency?: number,
        reason?: string
    ): ShopOperationInfo<T>

    /**
     * Sets a custom object for the item.
     * @param {object} custom Custom item data object.
     * @returns {boolean} If set successfully: true, else: false.
     */
    public setCustom<T extends object = any>(custom: CustomItemData<T>): boolean

    /**
     * Removes an item from the shop.
     * 
     * This method is an alias for 'ShopItem.remove()' method.
     * @returns {boolean} If removed: true, else: false.
     */
    public delete(): boolean

    /**
     * Removes an item from the shop.
     * @returns {boolean} If removed: true, else: false.
     */
    public remove(): boolean

    /**
     * Saves the shop item object in database.
     * @returns {ShopItem} Shop item instance.
     */
    public save(): ShopItem

    /**
     * Converts the shop item to string.
     * @returns {string} String representation of shop item.
     */
    public toString(): string
}

export = ShopItem