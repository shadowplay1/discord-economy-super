import Emitter from '../util/Emitter'
import EconomyOptions from '../../interfaces/EconomyOptions'

import TransferringOptions from '../../interfaces/TransferringOptions'
import TransferringResult from '../../interfaces/TransferringResult'


declare class Balance extends Emitter {

    /**
     * User balance class.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyOptions} ecoOptions Economy configuration.
     */
    public constructor(memberID: string, guildID: string, ecoOptions: EconomyOptions)

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
     * Sends the money to a specified user.
     * @param {TransferringOptions} options Transferring options.
     * @returns {TransferringResult} Transferring result object.
     */
     public transfer(options: Omit<TransferringOptions, 'receiverMemberID'>): TransferringResult
}

export = Balance