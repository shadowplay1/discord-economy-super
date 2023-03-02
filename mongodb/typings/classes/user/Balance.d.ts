import Emitter from '../util/Emitter'

import EconomyConfiguration from '../../interfaces/EconomyConfiguration'
import DatabaseManager from '../../managers/DatabaseManager'

import CurrencyFactory from '../../interfaces/CurrencyFactory'

import TransferingOptions from '../../interfaces/TransferingOptions'
import TransferingResult from '../../interfaces/TransferingResult'


declare class Balance extends Emitter {

    /**
     * User balance class.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} ecoOptions Economy configuration.
     */
    public constructor(memberID: string, guildID: string, ecoOptions: EconomyConfiguration, database: DatabaseManager)

    /**
     * Returns a factory with `get`, `getCurrency` (to get a currency info object), 
     * `set`, `add` and `subtract` methods to work with custom currencies.
     * 
     * @param {string} currencyID Currency ID, its name or its symbol.
     * @returns {CurrencyFactory} Currency management factory object.
     */
    public currency(currencyID: string): CurrencyFactory

    /**
     * Returns a factory with `get`, `getCurrency` (to get a currency info object), 
     * `set`, `add` and `subtract` methods to work with custom currencies.
     * 
     * @param {number} currencyID Currency ID, its name or its symbol.
     * @returns {CurrencyFactory} Currency management factory object.
     */
    public currency(currencyID: number): CurrencyFactory

    /**
     * Returns a factory with `get`, `getCurrency` (to get a currency info object), 
     * `set`, `add` and `subtract` methods to work with custom currencies.
     * 
     * @param {string | number} currencyID Currency ID, its name or its symbol.
     * @returns {CurrencyFactory} Currency management factory object.
     */
    public currency(currencyID: string | number): CurrencyFactory

    /**
     * Sets the money amount on user's balance.
     * @param {number} amount Money amount
     * @param {string} [reason] The reason why you set the money.
     * @returns {Promise<number>} Money amount
     */
    public set(amount: number, reason?: string): Promise<number>

    /**
     * Adds the money amount on user's balance.
     * @param {number} amount Money amount.
     * @param {string} [reason] The reason why you add the money.
     * @returns {Promise<number>} Money amount.
     */
    public add(amount: number, reason?: string): Promise<number>

    /**
     * Subtracts the money amount on user's balance.
     * @param {number} amount Money amount.
     * @param {string} [reason] The reason why you subtract the money.
     * @returns {Promise<number>} Money amount.
     */
    public subtract(amount: number, reason?: string): Promise<number>

    /**
     * Fetches the user's balance.
     * 
     * This method is an alias for 'EconomyUser.balance.fetch()' method
     * @returns {Promise<number>} User's balance.
     */
    public get(): Promise<number>

    /**
     * Deposits the specified amount of money.
     * @param {number} amount Money amount.
     * @param {string} [reason] The reason of the operation.
     * @returns {Promise<number>} Money amount.
     */
    public deposit(amount: number, reason?: string): Promise<number>

    /**
     * Fetches the user's balance.
     * @returns {Promise<number>} User's balance.
     */
    public fetch(): Promise<number>

    /**
     * Transfers the money to a specified user.
     * @param {TransferingOptions} options Transfering options.
     * @returns {Promise<TransferingResult>} Transfering result object.
     */
    public transfer(options: Omit<TransferingOptions, 'receiverMemberID'>): Promise<TransferingResult>
}

export = Balance