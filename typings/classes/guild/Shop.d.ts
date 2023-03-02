import BaseManager from '../../managers/BaseManager'
import ShopItem from '../../classes/ShopItem'

import AddItemOptions from '../../interfaces/AddItemOptions'

import { ItemProperties, ItemPropertyType } from '../../interfaces/ItemProperties'
import CustomItemData from '../../interfaces/CustomItemData'


declare class Shop extends BaseManager<ShopItem<any>> {
    public constructor(guildID: string, storagePath: string)

    /**
      * Creates an item in shop.
      * 
      * Type parameters:
      * 
      * - T: Set an object for 'custom' item property.
      * @param {AddItemOptions} options Configuration with item info.
      * @returns Item info.
      */
    public addItem<T extends object = any>(options: AddItemOptions<T>): ShopItem<T>

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
    public add<T extends object = any>(options: AddItemOptions<T>): ShopItem<T>

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
    * @returns {boolean} If edited successfully: true, else: false.
    */
    public edit<
        T extends keyof Omit<ItemProperties, 'id' | 'date'>,
        K extends ItemPropertyType<T>
    >(itemProperty: T, value: T extends 'custom' ? CustomItemData<K> : K): boolean

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
    * @returns {boolean} If edited successfully: true, else: false.
    */
    public editItem<
        T extends keyof Omit<ItemProperties, 'id' | 'date'>,
        K extends ItemPropertyType<T>
    >(itemProperty: T, value: T extends 'custom' ? CustomItemData<K> : K): boolean

    /**
     * Sets a custom object for the item.
     * @param {string} itemID Item ID or name.
     * @param {object} custom Custom item data object.
     * @returns {boolean} If set successfully: true, else: false.
     */
    public setCustom<T extends object = any>(itemID: string | number, custom: CustomItemData<T>): boolean

    /**
     * Removes an item from the shop.
     * @param {string} itemID Item ID or name.
     * @returns {boolean} If removed: true, else: false
     */
    public removeItem(itemID: string | number): boolean

    /**
     * Gets the item in the shop..
     * 
     * Type parameters:
     * 
     * - T: Set an object for 'custom' item property.
     * 
     * This method is an alias for the `Shop.get()` method.
     * @param {string} itemID Item ID or name.
     * @returns If item not found: null; else: item data array
     */
    public findItem<T extends object = any>(itemID: string | number): ShopItem<T>

    /**
     * Clears the shop.
     * @returns {boolean} If cleared: true, else: false
     */
    public clear(): boolean

    /**
     * Gets all the items in the shop.
     * @returns {ItemData[]} Guild shop array.
     */
    public all<T extends object = any>(): ShopItem<T>[]

    /**
     * Gets all the items in the shop.
     * 
     * This method is an alias for the `Shop.all()` method.
     * @returns {ItemData[]} Guild shop array.
     */
    public fetch<T extends object = any>(): ShopItem<T>[]

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
    public all<T extends object = any>(): ShopItem<T>[]

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
    public get<T extends object = any>(itemID: string | number): ShopItem<T>
}

export = Shop