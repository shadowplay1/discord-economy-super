import CustomItemData from './CustomItemData'

/**
 * Item info object for item events.
 */
declare interface ItemData<T extends object = any> {

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
     * Item message that will be returned on item use.
     */
    public message: string

    /**
     * Item description.
     */
    public description: string

    /**
     * Max amount of the item that user can hold in their inventory.
     */
    public maxAmount: number

    /**
     * Role ID from your Discord server.
     */
    public role: string

    /**
     * Formatted date when the item was added to the shop.
     */
    public date: string

    /**
     * Custom item data object.
     */
    public custom: CustomItemData<T>
}

export = ItemData