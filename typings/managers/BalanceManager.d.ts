import Emitter from '../classes/util/Emitter'

import EconomyOptions from '../interfaces/EconomyOptions'
import LeaderboardData from '../interfaces/LeaderboardData'

import TransferringOptions from '../interfaces/TransferringOptions'
import TransferringResult from '../interfaces/TransferringResult'


/**
* Balance manager methods object.
* @extends {Emitter}
*/
declare class BalanceManager extends Emitter {
    public constructor(options: EconomyOptions)

    /**
    * Fetches the user's balance.
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @returns User's balance
    */
    public fetch(memberID: string, guildID: string): number

    /**
    * Gets the user's balance.
    * 
    * This method is an alias for the `BalanceManager.fetch()` method.
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @returns User's balance
    */
    public get(memberID: string, guildID: string): number

    /**
    * Sets the money amount on user's balance.
    * @param {number} amount Amount of money that you want to set
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @param {string} reason The reason why you set the money
    * @returns Money amount
    */
    public set(amount: number, memberID: string, guildID: string, reason?: string): number

    /**
    * Adds the money amount on user's balance.
    * @param {number} amount Amount of money that you want to add
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @param {string} reason The reason why you add the money
    * @returns Money amount
    */
    public add(amount: number, memberID: string, guildID: string, reason?: string): number

    /**
    * Subtracts the money amount from user's balance.
    * @param {number} amount Amount of money that you want to subtract
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @param {string} reason The reason why you subtract the money
    * @returns Money amount
    */
    public subtract(amount: number, memberID: string, guildID: string, reason?: string): number

    /**
    * Shows a money leaderboard for your server
    * @param {string} guildID Guild ID
    * @returns Sorted leaderboard array
    */
    public leaderboard(guildID: string): LeaderboardData[]

    /**
     * Sends the money to the specified user.
     * @param {string} guildID Guild ID.
     * @param {TransferringOptions} options Transferring options.
     * @returns {TransferringResult} Transferring result object.
     */
    public transfer(guildID: string, options: TransferringOptions): TransferringResult
}

export = BalanceManager