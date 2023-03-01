import InventoryItem from '../classes/InventoryItem'


declare interface ItemUseData {

    /**
     * Guild ID.
     */
    guildID: string
    
    /**
     * The user ID that used the item.
     */
    usedBy: string

    /**
     * The item that was used.
     */
    item: InventoryItem<any>

    /**
     * The message that the user received after using the item.
     */
    receivedMessage: string
}

export = ItemUseData