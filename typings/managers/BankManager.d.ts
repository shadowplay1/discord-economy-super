import LeaderboardData from '../interfaces/LeaderboardData'

/**
 * Bank balance methods object.
 */
declare class BankManager {
    /**
    * Fetches the user's bank balance.
    * @param {String} memberID Member ID
    * @param {String} guildID Guild ID
    * @returns User's bank balance
    */
    public fetch(memberID: string, guildID: string): Number

    /**
    * Sets the money amount on user's bank balance.
    * @param {Number} amount Amount of money that you want to set
    * @param {String} memberID Member ID
    * @param {String} guildID Guild ID
    * @param {String} reason The reason why you set the money
    * @returns Money amount
    */
    public set(amount: number, memberID: string, guildID: string, reason?: string): Number

    /**
    * Adds the money amount on user's bank balance.
    * @param {Number} amount Amount of money that you want to add
    * @param {String} memberID Member ID
    * @param {String} guildID Guild ID
    * @param {String} reason The reason why you add the money
    * @returns Money amount
    */
    public add(amount: number, memberID: string, guildID: string, reason?: string): Number

    /**
    * Subtracts the money amount from user's bank balance.
    * @param {Number} amount Amount of money that you want to subtract
    * @param {String} memberID Member ID
    * @param {String} guildID Guild ID
    * @param {String} reason The reason why you subtract the money
    * @returns Money amount
    */
    public subtract(amount: number, memberID: string, guildID: string, reason?: string): Number
    
    /**
    * Shows a bank money leaderboard for your server
    * @param {String} guildID Guild ID
    * @returns Sorted leaderboard array
    */
    public leaderboard(guildID: string): Array<LeaderboardData>
}

export = BankManager