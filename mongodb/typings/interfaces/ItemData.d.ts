import CustomItemData from './CustomItemData'

/**
 * Item info object for item events.
 */
declare interface ItemData<T extends object = any> {

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
     * Item message that will be returned on item use.
     */
    message: string

    /**
     * Item description.
     */
    description: string

    /**
     * Max amount of the item that user can hold in their inventory.
     */
    maxAmount: number

    /**
     * Role **ID** from your Discord server.
     */
    role: string

    /**
     * Formatted date when the item was added to the shop.
     */
    date: string

    /**
     * Custom item data object.
     */
    custom: CustomItemData<T>
}

export = ItemData