import CustomItemData from './CustomItemData'

/**
 * Inventory object.
 */
declare interface InventoryData<T extends object = any> {

    /**
     * Item ID.
     */
    public id: number

    /**
     * Item name.
     */
    public name: string

    /**
     * Item price.
     */
    public price: number

    /**
     * The message that will be returned on item use.
     */
    public message?: string

    /**
     * Max amount of the item that user can hold in their inventory.
     */
    public maxAmount?: number

    /**
     * Discord Role ID from your server that will be given to user. Requires to specify your bot client in 'Economy.shop.useItem' method.
     */
    public role?: string

    /**
     * Date and time when the user bought the item.
     */
    public date: string

    /**
     * Custom item data object.
     */
    public custom?: CustomItemData<T>
}

export = InventoryData