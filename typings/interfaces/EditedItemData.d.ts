/**
 * Item info object for 'shopEditItem' event.
 */
declare class EditedItemData {

    /**
     * Item ID.
     */
    itemID: string;

    /**
     * Guild ID.
     */
    guildID: string;

    /**
     * What was changed in item data.
     */
    changed: string;

    /**
     * Value before edit.
     */
    oldValue: string;
    
    /**
     * Value after edit.
     */
    newValue: string;
}

export = EditedItemData