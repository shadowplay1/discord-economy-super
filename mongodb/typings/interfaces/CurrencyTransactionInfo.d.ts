import Currency from '../classes/Currency'

declare interface CurrencyTransactionInfo {

    /**
     * Status of the transaction.
     */
    status: boolean

    /**
     * Amount of currency used in the transaction.
     */
    amount: number

    /**
     * New currency balance after completing the transaction.
     */
    newBalance: number

    /**
     * The currency that was used in the transaction.
     */
    currency: Currency
}

export = CurrencyTransactionInfo
