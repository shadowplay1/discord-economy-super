import Currency from '../classes/Currency'
import CurrencyTransactionInfo from './CurrencyTransactionInfo'

declare interface CurrencyFactory {

    /**
     * Gets the currency balance.
     * @returns {number} Currency balance.
     */
    get(): number

    /**
     * Gets the currency object.
     * @returns {Currency} Currency object.
     */
    getCurrency(): Currency
    
    /**
     * Sets the currency balance.
     * @param {number} amount Amount of money to set.
     * @param {string} [reason] The reason why the money was set.
     * @returns {CurrencyTransactionInfo} Currency transaction info object.
     */
    set(amount: number, reason?: string): CurrencyTransactionInfo
    
    /**
     * Adds the money on the currency balance.
     * @param {number} amount Amount of money to add.
     * @param {string} [reason] The reason why the money was added.
     * @returns {CurrencyTransactionInfo} Currency transaction info object.
     */
    add(amount: number, reason?: string): CurrencyTransactionInfo
    
    /**
     * Subtracts the money from the currency balance.
     * @param {number} amount Amount of money to subtract.
     * @param {string} [reason] The reason why the money was subtracted.
     * @returns {CurrencyTransactionInfo} Currency transaction info object.
     */
    subtract(amount: number, reason?: string): CurrencyTransactionInfo
}

export = CurrencyFactory
