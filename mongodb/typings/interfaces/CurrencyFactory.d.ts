import Currency from '../classes/Currency'

declare interface CurrencyFactory {

    /**
     * Gets the currency balance.
     * @returns {Promise<number>}
     */
    get(): Promise<number>

    /**
     * Gets the currency data object.
     * @returns {Promise<Currency>}
     */
    getInfo(): Promise<Currency>
    
    /**
     * Sets the currency balance.
     * @param {number} amount Amount of money to set.
     * @param {string} [reason] The reason why the money was set.
     * @returns {Promise<number>}
     */
    set(amount: number, reason?: string): Promise<number>
    
    /**
     * Adds the money on the currency balance.
     * @param {number} amount Amount of money to add.
     * @param {string} [reason] The reason why the money was added.
     * @returns {Promise<number>}
     */
    add(amount: number, reason?: string): Promise<number>
    
    /**
     * Subtracts the money from the currency balance.
     * @param {number} amount Amount of money to subtract.
     * @param {string} [reason] The reason why the money was subtracted.
     * @returns {Promise<number>}
     */
    subtract(amount: number, reason?: string): Promise<number>
}

export = CurrencyFactory