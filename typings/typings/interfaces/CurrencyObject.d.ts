import CustomItemData from './CustomItemData'

export interface CurrencyObject<T extends object = any> {
    
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

export type CurrencyPropertyType<T extends keyof CurrencyObject> = T extends 'custom' ? object : CurrencyObject[T]