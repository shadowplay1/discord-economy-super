import Emitter from '../util/Emitter'

import EconomyOptions from '../../interfaces/EconomyOptions'
import DatabaseManager from '../../managers/DatabaseManager'

import TransferringOptions from '../../interfaces/TransferringOptions'
import TransferringResult from '../../interfaces/TransferringResult'


declare class Balance extends Emitter {

    /**
     * User balance class.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyOptions} ecoOptions Economy configuration.
     */
    public constructor(memberID: string, guildID: string, ecoOptions: EconomyOptions, database: DatabaseManager)

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
     * Fetches the user's balance.
     * @returns {Promise<number>} User's balance.
     */
    public fetch(): Promise<number>

    /**
     * Sends the money to a specified user.
     * @param {TransferringOptions} options Transferring options.
     * @returns {Promise<TransferringResult>} Transferring result object.
     */
    public transfer(options: Omit<TransferringOptions, 'receiverMemberID'>): Promise<TransferringResult>
}

export = Balance