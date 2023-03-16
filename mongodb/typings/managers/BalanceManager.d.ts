import DatabaseManager from './DatabaseManager'
import CacheManager from './CacheManager'

import Emitter from '../classes/util/Emitter'

import EconomyConfiguration from '../interfaces/EconomyConfiguration'
import LeaderboardData from '../interfaces/LeaderboardData'

import TransferingOptions from '../interfaces/TransferingOptions'
import TransferingResult from '../interfaces/TransferingResult'

import CurrencyFactory from '../interfaces/CurrencyFactory'


/**
 * Balance manager methods class.
 * @extends {Emitter}
 */
declare class BalanceManager extends Emitter {
    public constructor(options: EconomyConfiguration, database: DatabaseManager, cache: CacheManager)

    /**
     * Returns a factory with `get`, `getCurrency` (to get a currency info object), 
     * `set`, `add` and `subtract` methods to work with custom currencies.
     * 
     * @param {string} currencyID Currency ID, its name or its symbol.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {CurrencyFactory} Currency management factory object.
     */
    public currency(currencyID: string, memberID: string, guildID: string): CurrencyFactory

    /**
     * Returns a factory with `get`, `getCurrency` (to get a currency info object), 
     * `set`, `add` and `subtract` methods to work with custom currencies.
     * 
     * @param {number} currencyID Currency ID, its name or its symbol.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {CurrencyFactory} Currency management factory object.
     */
    public currency(currencyID: number, memberID: string, guildID: string): CurrencyFactory

    /**
     * Returns a factory with `get`, `getCurrency` (to get a currency info object), 
     * `set`, `add` and `subtract` methods to work with custom currencies.
     * 
     * @param {string | number} currencyID Currency ID, its name or its symbol.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {CurrencyFactory} Currency management factory object.
     */
    public currency(currencyID: string | number, memberID: string, guildID: string): CurrencyFactory

    /**
    * Fetches the user's balance.
    * @param {string} memberID Member ID.
    * @param {string} guildID Guild ID.
    * @returns {Promise<number>} User's balance.
    */
    public fetch(memberID: string, guildID: string): Promise<number>

    /**
    * Gets the user's balance.
    * 
    * This method is an alias for the `BalanceManager.fetch()` method.
    * @param {string} memberID Member ID.
    * @param {string} guildID Guild ID.
    * @returns {Promise<number>} User's balance.
    */
    public get(memberID: string, guildID: string): Promise<number>

    /**
    * Sets the money amount on user's balance.
    * @param {number} amount Amount of money that you want to set.
    * @param {string} memberID Member ID.
    * @param {string} guildID Guild ID.
    * @param {string} [reason] The reason why you set the money.
    * @returns {Promise<number>} Money amount.
    */
    public set(amount: number, memberID: string, guildID: string, reason?: string): Promise<number>

    /**
    * Adds the money amount on user's balance.
    * @param {number} amount Amount of money that you want to add.
    * @param {string} memberID Member ID.
    * @param {string} guildID Guild ID.
    * @param {string} [reason] The reason why you add the money.
    * @returns {Promise<number>} Money amount.
    */
    public add(amount: number, memberID: string, guildID: string, reason?: string): Promise<number>

    /**
    * Subtracts the money amount from user's balance.
    * @param {number} amount Amount of money that you want to subtract.
    * @param {string} memberID Member ID.
    * @param {string} guildID Guild ID.
    * @param {string} [reason] The reason why you subtract the money.
    * @returns {Promise<number>} Money amount.
    */
    public subtract(amount: number, memberID: string, guildID: string, reason?: string): Promise<number>

    /**
     * Deposits the specified amount of money.
     * @param {number} amount Money amount.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason of the operation.
     * @returns {Promise<number>} Money amount.
     */
    public deposit(amount: number, memberID: string, guildID: string, reason?: string): Promise<number>

    /**
    * Gets a balance leaderboard for specified guild.
    * @param {string} guildID Guild ID.
    * @returns {Promise<number>} Sorted leaderboard array.
    */
    public leaderboard(guildID: string): Promise<LeaderboardData[]>

    /**
     * Transfers the money to specified user.
     * @param {string} guildID Guild ID.
     * @param {TransferingOptions} options Transfering options.
     * @returns {Promise<TransferingResult>} Transfering result object.
     */
    public transfer(guildID: string, options: TransferingOptions): Promise<TransferingResult>
}

export = BalanceManager
