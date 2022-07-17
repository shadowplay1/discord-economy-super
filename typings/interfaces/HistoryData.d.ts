import CustomItemData from './CustomItemData'

/**
 * Purchases history object.
 */
declare interface HistoryData<T extends object = any> {

    /**
     * Item ID.
     */
    public id: number

    /**
     * Member ID.
     */
    public memberID: string

    /**
     * Guild ID.
     */
    public guildID: string

    /**
     * Item name.
     */
    public name: string

    /**
     * Item price.
     */
    public price: number

    /**
     * Items total price.
     */
    public totalPrice: number

    /**
     * Quantity of the items.
     */
    public quantity: number

    /**
     * The message that will be returned on item use.
     */
    public message?: string

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

export = HistoryData