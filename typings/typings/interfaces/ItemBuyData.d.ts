import ShopItem from '../classes/ShopItem'


declare interface ItemBuyData {

    /**
     * Guild ID.
     */
    guildID: string

    /**
     * The user ID that used the item.
     */
    boughtBy: string

    /**
     * The item that was bought.
     */
    item: ShopItem<any>
}

export = ItemBuyData