import CustomItemData from './CustomItemData'

declare interface CurrencyObject<T extends object = any> {
    
    /**
     * Currency ID.
     */
    id: number
    
    /**
     * Currency name.
     */
    name: string
    
    /**
     * Currency symbol.
     */
    symbol: string

    /**
     * Currency balances object.
     */
    balances: object

    /**
     * Custom currency data object.
     */
    custom: CustomItemData<T>
}