/**
 * Purchases history object.
 */
declare class HistoryData {
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
    itemName: string

    /**
     * Item price.
     */
    price: number

    /**
     * The message that will be returned on item use.
     */
    message: string

    /**
     * Discord Role ID from your server that will be given to user. Requires to specify your bot client in 'Economy.shop.useItem' method.
     */
    role?: string

    /**
     * Date and time when the user bought the item.
     */
    date: string
}

export = HistoryData