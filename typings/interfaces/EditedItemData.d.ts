import ShopItem from '../classes/ShopItem'


/**
 * Item info object for 'shopItemEdit' event.
 */
declare interface EditedItemData {

    /**
     * Item that was edited.
     */
    item: ShopItem<any>

    /**
     * Guild ID.
     */
    guildID: string

    /**
     * The item property that was changed.
     */
    changedProperty: string

    /**
     * Value before edit.
     */
    oldValue: string
    
    /**
     * Value after edit.
     */
    newValue: string
}

export = EditedItemData
