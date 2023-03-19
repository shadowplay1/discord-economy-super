import BalanceData from './BalanceData'

import ItemData from './ItemData'
import EditedItemData from './EditedItemData'

import ItemUseData from './ItemUseData'
import ItemBuyData from './ItemBuyData'

import Currency from '../classes/Currency'
import Economy from '../Economy'


/**
 * Economy events.
 */
declare interface EconomyEvents {

    /**
     * Emits when someone's set the money on the balance.
     */
    balanceSet: BalanceData<'balanceSet'>

    /**
     * Emits when someone's added the money on the balance.
     */
    balanceAdd: BalanceData<'balanceAdd'>

    /**
     * Emits when someone's subtracts the money from the balance.
     */
    balanceSubtract: BalanceData<'balanceSubtract'>

    /**
     * Emits when someone's set the money on the bank balance.
     */
    bankSet: BalanceData<'bankSet'>

    /**
     * Emits when someone's added the money on the bank balance.
     */
    bankAdd: BalanceData<'bankAdd'>

    /**
     * Emits when someone's subtracted the money from the bank balance.
     */
    bankSubtract: BalanceData<'balanceSubtract'>

    /**
     * Emits when someone's custom currency was set
     */
    customCurrencySet: BalanceData<'customCurrencySet'> & {
        currency: Currency
    }

    /**
     * Emits when someone's custom currency was added.
     */
    customCurrencyAdd: BalanceData<'customCurrencyAdd'> & {
        currency: Currency
    }

    /**
     * Emits when someone's custom currency was subtracted.
     */
    customCurrencySubtract: BalanceData<'customCurrencySubtract'> & {
        currency: Currency
    }

    /**
     * Emits when someone's added an item in the shop.
     */
    shopItemAdd: ItemData<any>

    /**
     * Emits when someone's cleared the shop.
     */
    shopClear: boolean

    /**
     * Emits when someone's edited an item in the shop.
     */
    shopItemEdit: EditedItemData

    /**
     * Emits when someone's bought an item from the shop.
     */
    shopItemBuy: ItemBuyData

    /**
     * Emits when someone's used the item from their inventory.
     */
    shopItemUse: ItemUseData

    /**
     * Emits when the module is ready.
     */
    ready: Economy<true>

    /**
     * Emits when the module is destroyed.
     */
    destroy: void
}

export = EconomyEvents