import Emitter from '../classes/Emitter'

import EconomyOptions from '../interfaces/EconomyOptions'
import LeaderboardData from '../interfaces/LeaderboardData'

/**
 * Bank balance manager methods object.
 * @extends {Emitter}
 */
declare class BankManager extends Emitter {
    constructor(options: EconomyOptions)
    
    /**
    * Fetches the user's bank balance.
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @returns User's bank balance
    */
    public fetch(memberID: string, guildID: string): number

    /**
    * Sets the money amount on user's bank balance.
    * @param {number} amount Amount of money that you want to set
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @param {string} reason The reason why you set the money
    * @returns Money amount
    */
    public set(amount: number, memberID: string, guildID: string, reason?: string): number

    /**
    * Adds the money amount on user's bank balance.
    * @param {number} amount Amount of money that you want to add
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @param {string} reason The reason why you add the money
    * @returns Money amount
    */
    public add(amount: number, memberID: string, guildID: string, reason?: string): number

    /**
    * Subtracts the money amount from user's bank balance.
    * @param {number} amount Amount of money that you want to subtract
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @param {string} reason The reason why you subtract the money
    * @returns Money amount
    */
    public subtract(amount: number, memberID: string, guildID: string, reason?: string): number
    
    /**
    * Shows a bank money leaderboard for your server
    * @param {string} guildID Guild ID
    * @returns Sorted leaderboard array
    */
    public leaderboard(guildID: string): LeaderboardData[]
}

export = BankManager