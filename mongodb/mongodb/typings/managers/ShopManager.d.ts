import DatabaseManager from './DatabaseManager'
import CacheManager from './CacheManager'

import Emitter from '../classes/util/Emitter'
import ShopItem from '../classes/ShopItem'

import AddItemOptions from '../interfaces/AddItemOptions'
import ShopOperationInfo from '../interfaces/ShopOperationInfo'


import { ItemProperties, ItemPropertyType } from '../interfaces/ItemProperties'
import CustomItemData from '../interfaces/CustomItemData'

import EconomyConfiguration from '../interfaces/EconomyConfiguration'


/**
* Shop manager methods class.
* @extends {Emitter}
*/
declare class ShopManager extends Emitter {
    public constructor(options: EconomyConfiguration, database: DatabaseManager, cache: CacheManager)

    /**
     * Creates an item in shop.
     * 
     * Type parameters:
     * 
     * - T: Set an object for 'custom' item property.
     * @param {AddItemOptions} options Configuration with item info.
     * @param {string} guildID Guild ID.
     * @returns {Promise<ShopItem<T>>} Item info.
     */
    public addItem<T extends object = any>(guildID: string, options: AddItemOptions<T>): Promise<ShopItem<T>>

    /**
     * Creates an item in shop.
     * 
     * Type parameters:
     * 
     * - T: Set an object for 'custom' item property.
     * 
     * This method is an alias for the `ShopManager.addItem()` method.
     * @param {string} guildID Guild ID.
     * @param {AddItemOptions} options Configuration with item info.
     * @returns {Promise<ShopItem>} Item info.
     */
    public add<T extends object = any>(guildID: string, options: AddItemOptions<T>): Promise<ShopItem<T>>

    /**
    * Edits the item in the shop.
    * 
    * Type parameters:
    * 
    * - T: Item property string.
    * - K: Type for specified property in T.
    * 
    * @param {string} itemID Item ID or name.
    * @param {string} guildID Guild ID.
    * 
    * @param {T} itemProperty
    * This argument means what thing in item you want to edit (item property). 
    * Available item properties are 'description', 'price', 'name', 'message', 'amount', 'role', 'custom'.
    * 
    * @param {K} value Any value to set.
    * @returns {Promise<boolean>} If edited successfully: true, else: false.
    */
    public edit<
        T extends keyof Omit<ItemProperties, 'id' | 'date'>,
        K extends ItemPropertyType<T>
    >(
        itemID: string | number,
        guildID: string,
        itemProperty: T,
        value: T extends 'custom' ? CustomItemData<K> : K
    ): Promise<boolean>

    /**
    * Edits the item in the shop.
    *
    * Type parameters:
    * 
    * - T: Item property string.
    * - K: Type for specified property in T.
    * 
    * This method is an alias for 'ShopItem.edit()' method.
    * 
    * @param {string} itemID Item ID or name.
    * @param {string} guildID Guild ID.
    * 
    * @param {T} itemProperty
    * This argument means what thing in item you want to edit (item property). 
    * Available item properties are 'description', 'price', 'name', 'message', 'amount', 'role', 'custom'.
    * 
    * @param {K} value Any value to set.
    * @returns {Promise<boolean>} If edited successfully: true, else: false.
    */
    public editItem<
        T extends keyof Omit<ItemProperties, 'id' | 'date'>,
        K extends ItemPropertyType<T>
    >(
        itemID: string | number, guildID: string,
        itemProperty: T, value: T extends 'custom' ? CustomItemData<K> : K
    ): Promise<boolean>

    /**
     * Sets a custom object for the item.
     * @param {string} itemID Item ID or name.
     * @param {string} guildID Guild IF.
     * @param {object} custom Custom item data object.
     * @returns {Promise<boolean>} If set successfully: true, else: false.
     */
    public setCustom<
        T extends object = any
    >(itemID: string | number, guildID: string, custom: CustomItemData<T>): Promise<boolean>

    /**
     * Removes the item from the shop.
     * @param {string} itemID Item ID or name.
     * @param {string} guildID Guild ID
     * @returns {Promise<boolean>} If removed: true, else: false
     */
    public removeItem(itemID: string | number, guildID: string): Promise<boolean>

    /**
     * Gets the item in the shop.
     * 
     * Type parameters:
     * 
     * - T: Set an object for 'custom' item property.
     * 
     * This method is an alias for the `ShopManager.getItem()` method.
     * @param {string} itemID Item ID or name.
     * @param {string} guildID Guild ID
     * @returns {Promise<ShopItem<T>>} If item not found: null; else: item data array
     */
    public findItem<T extends object = any>(itemID: string | number, guildID: string): Promise<ShopItem<T>>

    /**
     * Buys the item from the shop.
     * @param {string | number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
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
     * @returns {Promise<ShopOperationInfo>} Operation information object.
     */
    public buy<
        T extends object = any
    >(
        itemID: string | number,
        memberID: string,
        guildID: string,
        quantity?: number,
        currency?: string | number,
        reason?: string
    ): Promise<ShopOperationInfo<T>>

    /**
     * Buys the item from the shop.
     * @param {string} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
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
     * @returns {Promise<ShopOperationInfo>} Operation information object.
     */
    public buy<
        T extends object = any
    >(
        itemID: string,
        memberID: string,
        guildID: string,
        quantity?: number,
        currency?: string,
        reason?: string
    ): Promise<ShopOperationInfo<T>>

    /**
     * Buys the item from the shop.
     * @param {number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
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
     * @returns {Promise<ShopOperationInfo>} Operation information object.
     */
    public buy<
        T extends object = any
    >(
        itemID: number,
        memberID: string,
        guildID: string,
        quantity?: number,
        currency?: number,
        reason?: string
    ): Promise<ShopOperationInfo<T>>

    /**
     * Buys the item from the shop.
     * @param {string} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
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
     * @returns {Promise<ShopOperationInfo>} Operation information object.
     */
    public buy<
        T extends object = any
    >(
        itemID: string,
        memberID: string,
        guildID: string,
        quantity?: number,
        currency?: number,
        reason?: string
    ): Promise<ShopOperationInfo<T>>

    /**
     * Buys the item from the shop.
     * @param {number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
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
     * @returns {Promise<ShopOperationInfo>} Operation information object.
     */
    public buy<
        T extends object = any
    >(
        itemID: number,
        memberID: string,
        guildID: string,
        quantity?: number,
        currency?: string,
        reason?: string
    ): Promise<ShopOperationInfo<T>>

    /**
     * Buys the item from the shop.
     * 
     * This method is an alias for the `ShopManager.buy()` method.
     * @param {string | number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {number} [quantity=1] Quantity of items to buy. Default: 1.
     * 
     * @param {string} [reason='received the item from the shop'] 
     * The reason why the money was subtracted. Default: 'received the item from the shop'.
     * 
     * @returns {Promise<ShopOperationInfo>} Operation information object.
     */
    public buyItem<
        T extends object = any
    >(
        itemID: string | number,
        memberID: string,
        guildID: string,
        quantity?: number,
        reason?: string
    ): Promise<ShopOperationInfo<T>>

    /**
     * Buys the item from the shop.
     * 
     * This method is an alias for the `ShopManager.buy()` method.
     * @param {string} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
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
     * @returns {Promise<ShopOperationInfo>} Operation information object.
     */
    public buyItem<
        T extends object = any
    >(
        itemID: string,
        memberID: string,
        guildID: string,
        quantity?: number,
        currency?: string,
        reason?: string
    ): Promise<ShopOperationInfo<T>>

    /**
     * Buys the item from the shop.
     * 
     * This method is an alias for the `ShopManager.buy()` method.
     * @param {number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
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
     * @returns {Promise<ShopOperationInfo>} Operation information object.
     */
    public buyItem<
        T extends object = any
    >(
        itemID: number,
        memberID: string,
        guildID: string,
        quantity?: number,
        currency?: number,
        reason?: string
    ): Promise<ShopOperationInfo<T>>

    /**
     * Buys the item from the shop.
     * 
     * This method is an alias for the `ShopManager.buy()` method.
     * @param {string} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
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
     * @returns {Promise<ShopOperationInfo>} Operation information object.
     */
    public buyItem<
        T extends object = any
    >(
        itemID: string,
        memberID: string,
        guildID: string,
        quantity?: number,
        currency?: number,
        reason?: string
    ): Promise<ShopOperationInfo<T>>

    /**
     * Buys the item from the shop.
     * 
     * This method is an alias for the `ShopManager.buy()` method.
     * @param {number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
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
     * @returns {Promise<ShopOperationInfo>} Operation information object.
     */
    public buyItem<
        T extends object = any
    >(
        itemID: number,
        memberID: string,
        guildID: string,
        quantity?: number,
        currency?: string,
        reason?: string
    ): Promise<ShopOperationInfo<T>>

    /**
     * Clears the shop.
     * @param {string} guildID Guild ID
     * @returns {Promise<boolean>} If cleared: true, else: false
     */
    public clear(guildID: string): Promise<boolean>

    /**
     * Shows all items in the shop.
     * 
     * Type parameters:
     * 
     * - T: Set an object for 'custom' item property.
     * @param {string} guildID Guild ID
     * @returns {Promise<ShopItem<T>[]>} The shop array.
     */
    public fetch<T extends object = any>(guildID: string): Promise<ShopItem<T>[]>

    /**
     * Shows all items in the shop.
     * 
     * This method is an alias for the `ShopManager.fetch()` method.
     * @param {string} guildID Guild ID
     * @returns {ShopItem[]} The shop array.
     */
    public get<T extends object = any>(guildID: string): Promise<ShopItem<T>[]>

    /**
     * Shows all items in the shop.
     * 
     * This method is an alias for the `ShopManager.get()` method.
     * @param {string} guildID Guild ID
     * @returns {ShopItem[]} The shop array.
     */
    public all<T extends object = any>(guildID: string): Promise<ShopItem<T>[]>

    /**
     * Gets the item in the shop.
     * @param {string} itemID Item ID or name.
     * @param {string} guildID Guild ID
     * @returns {Promise<ShopItem<T>>} If item not found: null; else: item info object
     */
    public getItem<T extends object = any>(itemID: string | number, guildID: string): Promise<ShopItem<T>>
}

export = ShopManager