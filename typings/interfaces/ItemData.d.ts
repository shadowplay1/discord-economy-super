/**
 * Item info object for item events.
 */
declare class ItemData {

    /**
     * Item ID.
     */
    id: number;

    /**
     * Item name.
     */
    itemName: string;

    /**
     * Item price.
     */
    price: number;

    /**
     * Item message that will be returned on item use.
     */
    message: string;

    /**
     * Item description.
     */
    description: string;

    /**
     * Max amount of the item that user can hold in his inventory.
     */
    maxAmount: number;

    /**
     * Role ID from your Discord server.
     */
    role: string;
    
    /**
     * Formatted date when the item was added to the shop.
     */
    date: string;
}

export = ItemData