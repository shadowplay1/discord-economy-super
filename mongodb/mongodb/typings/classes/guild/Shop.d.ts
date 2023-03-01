import DatabaseManager from '../../managers/DatabaseManager'
import BaseManager from '../../managers/BaseManager'

import ShopItem from '../ShopItem'

import EconomyConfiguration from '../../interfaces/EconomyConfiguration'
import AddItemOptions from '../../interfaces/AddItemOptions'

import { ItemProperties, ItemPropertyType } from '../../interfaces/ItemProperties'
import CustomItemData from '../../interfaces/CustomItemData'


declare class Shop extends BaseManager<ShopItem<any>> {
    public constructor(guildID: string, options: EconomyConfiguration, database: DatabaseManager)

    /**
      * Creates an item in shop.
      * 
      * Type parameters:
      * 
      * - T: Set an object for 'custom' item property.
      * @param {AddItemOptions} options Configuration with item info.
      * @returns Item info.
      */
    public addItem<T extends object = any>(options: AddItemOptions<T>): Promise<ShopItem<T>>

    /**
     * Creates an item in shop.
     * 
     * Type parameters:
     * 
     * - T: Set an object for 'custom' item property.
     * 
     * This method is an alias for the `ShopManager.addItem()` method.
     * 
     * @param {AddItemOptions} options Configuration with item info.
     * @returns {ShopItem} Item info.
     */
    public add<T extends object = any>(options: AddItemOptions<T>): Promise<ShopItem<T>>

    /**
     * Gets all the items in the shop.
     * @returns {Promise<ItemData[]>} Guild shop array.
     */
    public all<T extends object = any>(): Promise<ShopItem<T>[]>

    /**
     * Gets all the items in the shop.
     * 
     * This method is an alias for the `Shop.all()` method.
     * @returns {Promise<ItemData[]>} Guild shop array.
     */
    public fetch<T extends object = any>(): Promise<ShopItem<T>[]>

    /**
    * Edits the item in the shop.
    * 
    * Type parameters:
    * 
    * - T: Item property string.
    * - K: Type for specified property in T.
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
    * Edits the item in the shop.
    * 
    * Type parameters:
    * 
    * - T: Item property string.
    * - K: Type for specified property in T.
    * 
    * This method is an alias for 'ShopItem.edit()' method.
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
     * @param {string} itemID Item ID or name.
     * @param {object} custom Custom item data object.
     * @returns {Promise<boolean>} If set successfully: true, else: false.
     */
    public setCustom<T extends object = any>(itemID: string | number, custom: CustomItemData<T>): Promise<boolean>

    /**
     * Removes an item from the shop.
     * @param {string} itemID Item ID or name.
     * @returns {Promise<boolean>} If removed: true, else: false
     */
    public removeItem(itemID: string | number): Promise<boolean>

    /**
     * Get for the item in the shop.
     * 
     * Type parameters:
     * 
     * - T: Set an object for 'custom' item property.
     * 
     * This method is an alias for the `Shop.get()` method.
     * @param {string} itemID Item ID or name.
     * @returns If item not found: null; else: item data array
     */
    public findItem<T extends object = any>(itemID: string | number): Promise<ShopItem<T>>

    /**
     * Clears the shop.
     * @returns {Promise<boolean>} If cleared: true, else: false
     */
    public clear(): Promise<boolean>

    /**
     * Shows all items in the shop.
     * 
     * Type parameters:
     * 
     * - T: Set an object for 'custom' item property.
     * 
     * This method is an alias for the `Shop.fetch()` method.
     * @returns The shop array.
     */
    public all<T extends object = any>(): Promise<ShopItem<T>[]>

    /**
     * Gets the item in the shop.
     * 
     * Type parameters:
     * 
     * - T: Set an object for 'custom' item property.
     * 
     * @param {string} itemID Item ID or name.
     * @returns If item not found: null; else: item info object
     */
    public get<T extends object = any>(itemID: string | number): Promise<ShopItem<T>>
}

export = Shop