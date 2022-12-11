import Emitter from '../util/Emitter'
import EconomyConfiguration from '../../interfaces/EconomyConfiguration'

import TransferingOptions from '../../interfaces/TransferingOptions'
import TransferingResult from '../../interfaces/TransferingResult'


declare class Balance extends Emitter {

    /**
     * User balance class.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} ecoOptions Economy configuration.
     */
    public constructor(memberID: string, guildID: string, ecoOptions: EconomyConfiguration)

    /**
     * Sets the money amount on user's balance.
     * @param {number} amount Money amount
     * @param {string} [reason] The reason why you set the money.
     * @returns {number} Money amount
     */
    public set(amount: number, reason?: string): number

    /**
     * Adds the money amount on user's balance.
     * @param {number} amount Money amount.
     * @param {string} [reason] The reason why you add the money.
     * @returns {number} Money amount.
     */
    public add(amount: number, reason?: string): number

    /**
     * Subtracts the money amount on user's balance.
     * @param {number} amount Money amount.
     * @param {string} [reason] The reason why you subtract the money.
     * @returns {number} Money amount.
     */
    public subtract(amount: number, reason?: string): number

    /**
     * Fetches the user's balance.
     * 
     * This method is an alias for 'EconomyUser.balance.fetch()' method
     * @returns {number} User's balance.
     */
    public get(): number

    /**
     * Fetches the user's balance.
     * @returns {number} User's balance.
     */
    public fetch(): number

    /**
     * Deposits the specified amount of money.
     * @param {number} amount Money amount.
     * @param {string} [reason] The reason of the operation.
     * @returns {number} Money amount.
     */
    public deposit(amount: number, reason?: string): number

    /**
     * Transfers the money to a specified user.
     * @param {TransferingOptions} options Transfering options.
     * @returns {TransferingResult} Transfering result object.
     */
    public transfer(options: Omit<TransferingOptions, 'receiverMemberID'>): TransferingResult
}

export = Balance