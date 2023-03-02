import CustomItemData from './CustomItemData'

/**
 * Purchases history object.
 */
declare interface HistoryData<T extends object = any> {

    /**
     * Item ID.
     */
    id: number

    /**
     * Member ID.
     */
    memberID: string

    /**
     * Guild ID.
     */
    guildID: string

    /**
     * Item name.
     */
    name: string

    /**
     * Item price.
     */
    price: number

    /**
     * Items total price.
     */
    totalPrice: number

    /**
     * Quantity of the items.
     */
    quantity: number

    /**
     * The message that will be returned on item use.
     */
    message?: string

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

export = HistoryData