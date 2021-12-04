/**
 * Options of 'Economy.shop.addItem()' method.
 */
declare class AddItemOptions {
    /**
     * Item name.
     */
    itemName: string
    /**
     * Item price.
     */
    price: string | number
    /**
     * The message that will be returned on item use.
     */
    message?: string
    /**
     * Item description.
     */
    description?: string
    /**
     * Max amount of the item that user can hold in his inventory.
     */
    maxAmount?: string | number
    /**
     * Discord Role ID from your server that will be given to user. Requires to specify your bot client in 'Economy.shop.useItem' method.
     */
    role?: string
}

export = AddItemOptions