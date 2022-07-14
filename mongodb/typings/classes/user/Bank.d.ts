
import Emitter from '../util/Emitter'
import EconomyOptions from '../../interfaces/EconomyOptions'
import DatabaseManager from '../../managers/DatabaseManager'

declare class Bank extends Emitter {
    public constructor(memberID: string, guildID: string, options: EconomyOptions, database: DatabaseManager)

    /**
     * Sets the money amount on user's bank balance.
     * @param {number} amount Money amount
     * @param {string} [reason] The reason why you set the money.
     * @returns {Promise<number>} Money amount
     */
    public set(amount: number, reason?: string): Promise<number>

    /**
     * Adds the money amount on user's bank balance.
     * @param {number} amount Money amount.
     * @param {string} [reason] The reason why you add the money.
     * @returns {Promise<number>} Money amount.
     */
    public add(amount: number, reason?: string): Promise<number>

    /**
     * Subtracts the money amount on user's bank balance.
     * @param {number} amount Money amount.
     * @param {string} [reason] The reason why you subtract the money.
     * @returns {Promise<number>} Money amount.
     */
    public subtract(amount: number, reason?: string): Promise<number>

    /**
     * Fetches the user's bank balance.
     * @returns {Promise<number>} User's bank balance.
     */
    public fetch(): Promise<number>

    /**
     * Fetches the user's bank balance.
     * 
     * This method is an alias for 'EconomyUser.bank.fetch()' method.
     * @returns {Promise<number>} User's bank balance.
     */
    public get(): Promise<number>
}

export = Bank