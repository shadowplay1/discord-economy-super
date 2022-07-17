
import Emitter from '../util/Emitter'
import EconomyOptions from '../../interfaces/EconomyOptions'

declare class Bank extends Emitter {
    public constructor(memberID: string, guildID: string, options: EconomyOptions)

    /**
     * Sets the money amount on user's bank balance.
     * @param {number} amount Money amount
     * @param {string} [reason] The reason why you set the money.
     * @returns {number} Money amount
     */
    public set(amount: number, reason?: string): number

    /**
     * Adds the money amount on user's bank balance.
     * @param {number} amount Money amount.
     * @param {string} [reason] The reason why you add the money.
     * @returns {number} Money amount.
     */
    public add(amount: number, reason?: string): number

    /**
     * Subtracts the money amount on user's bank balance.
     * @param {number} amount Money amount.
     * @param {string} [reason] The reason why you subtract the money.
     * @returns {number} Money amount.
     */
    public subtract(amount: number, reason?: string): number

    /**
     * Fetches the user's bank balance.
     * @returns {number} User's bank balance.
     */
    public fetch(): number

    /**
     * Fetches the user's bank balance.
     * 
     * This method is an alias for 'EconomyUser.bank.fetch()' method.
     * @returns {number} User's bank balance.
     */
    public get(): number
}

export = Bank