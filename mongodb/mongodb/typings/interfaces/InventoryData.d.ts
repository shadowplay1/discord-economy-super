import CustomItemData from './CustomItemData'

/**
 * Inventory object.
 */
declare interface InventoryData<T extends object = any> {

    /**
     * Item ID.
     */
    id: number

    /**
     * Item name.
     */
    name: string

    /**
     * Item price.
     */
    price: number

    /**
     * The message that will be returned on item use.
     */
    message?: string

    /**
     * Max amount of the item that user can hold in their inventory.
     */
    maxAmount?: number

    /**
     * Discord Role ID from your server that will be given to user. Requires to specify your bot client in 'Economy.shop.useItem' method.
     */
    role?: string

    /**
     * Date and time when the user bought the item.
     */
    date: string

    /**
     * Custom item data object.
     */
    custom?: CustomItemData<T>
}

export = InventoryData