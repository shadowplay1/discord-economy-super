/**
 * Purchases history object.
 */
declare class HistoryData {
    /**
     * Item ID.
     */
    id: Number

    /**
     * Member ID.
     */
    memberID: String

    /**
     * Guild ID.
     */
    guildID: String

    /**
     * Item name.
     */
    itemName: String

    /**
     * Item price.
     */
    price: Number

    /**
     * The message that will be returned on item use.
     */
    message: String

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