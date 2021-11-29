import EconomyOptions from '../interfaces/EconomyOptions'

import PayingOptions from '../interfaces/PayingOptions'
import LeaderboardData from '../interfaces/LeaderboardData'

/**
* Balance methods object.
*/
declare class BalanceManager {
    constructor(options: EconomyOptions)

    /**
    * Fetches the user's balance.
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @returns User's balance
    */
    public fetch(memberID: string, guildID: string): number

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
     * @param {PayingOptions} options Paying options.
     * @returns {number} How much money was sent.
     */
    public pay(guildID: string, options: PayingOptions): number
}

export = BalanceManager