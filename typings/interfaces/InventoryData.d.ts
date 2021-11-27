/**
 * Inventory object.
 */
declare class InventoryData {
    /**
     * Item ID.
     */
    id: number

    /**
     * Item name.
     */
    itemName: string

    /**
     * Item price.
     */
    price: number

    /**
     * The message that will be returned on item use.
     */
    message?: string

    /**
     * Max amount of the item that user can hold in his inventory.
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
}

export = InventoryData