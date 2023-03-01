import Currency from '../classes/Currency'

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
     * @returns {number} Updated currency balance.
     */
    set(amount: number, reason?: string): number
    
    /**
     * Adds the money on the currency balance.
     * @param {number} amount Amount of money to add.
     * @param {string} [reason] The reason why the money was added.
     * @returns {number} Updated currency balance.
     */
    add(amount: number, reason?: string): number
    
    /**
     * Subtracts the money from the currency balance.
     * @param {number} amount Amount of money to subtract.
     * @param {string} [reason] The reason why the money was subtracted.
     * @returns {number} Updated currency balance.
     */
    subtract(amount: number, reason?: string): number
}

export = CurrencyFactory