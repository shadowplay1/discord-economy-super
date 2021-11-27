import BalanceData from './BalanceData'
import ItemData from './ItemData'
import EditedItemData from './EditedItemData'
import InventoryData from './InventoryData';

/**
 * All events list.
 */
declare class EconomyEvents {

    /**
     * Emits when someone's set the money on the balance.
     */
    balanceSet: BalanceData;

    /**
     * Emits when someone's added the money on the balance.
     */
    balanceAdd: BalanceData;

    /**
     * Emits when someone's subtracts the money from the balance.
     */
    balanceSubtract: BalanceData;

    /**
     * Emits when someone's set the money on the bank balance.
     */
    bankSet: BalanceData;

    /**
     * Emits when someone's added the money on the bank balance.
     */
    bankAdd: BalanceData;

    /**
     * Emits when someone's subtracted the money from the bank balance.
     */
    bankSubtract: BalanceData;

    /**
     * Emits when someone's added an item in the shop.
     */
    shopAddItem: ItemData;

    /**
     * Emits when someone's cleared the shop.
     */
    shopClear: boolean;

    /**
     * Emits when someone's edited an item in the shop.
     */
    shopEditItem: EditedItemData;

    /**
     * Emits when someone's bought an item from the shop.
     */
    shopItemBuy: InventoryData;

    /**
     * Emits when someone's used the item from his inventory.
     */
    shopItemUse: ItemData;

    /**
     * Emits when the module is ready.
     */
    ready: void;

    /**
     * Emits when the module is destroyed.
     */
    destroy: void;
}

export = EconomyEvents