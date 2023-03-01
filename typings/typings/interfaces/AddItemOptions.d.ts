import CustomItemData from "./CustomItemData"

/**
 * Options of 'ShopManager.addItem()' method.
 */
declare interface AddItemOptions<T extends object = any> {

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
     * Item description.
     */
    description?: string

    /**
     * Max amount of the item that user can hold in their inventory.
     */
    maxAmount?: string

    /**
     * Discord Role ID from your server that will be given to user. 
     * Requires to specify your bot client in 'Economy.shop.useItem' method.
     */
    role?: string

    /**
     * Custom item data object.
     */
    custom?: CustomItemData<T>
}

export = AddItemOptions