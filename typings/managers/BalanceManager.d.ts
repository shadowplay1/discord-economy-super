import LeaderboardData from '../interfaces/LeaderboardData'

/**
* Balance methods object.
*/
declare class BalanceManager {

    /**
    * Fetches the user's balance.
    * @param {String} memberID Member ID
    * @param {String} guildID Guild ID
    * @returns User's balance
    */
    public fetch(memberID: string, guildID: string): Number

    /**
    * Sets the money amount on user's balance.
    * @param {Number} amount Amount of money that you want to set
    * @param {String} memberID Member ID
    * @param {String} guildID Guild ID
    * @param {String} reason The reason why you set the money
    * @returns Money amount
    */
    public set(amount: number, memberID: string, guildID: string, reason?: string): Number
    
    /**
    * Adds the money amount on user's balance.
    * @param {Number} amount Amount of money that you want to add
    * @param {String} memberID Member ID
    * @param {String} guildID Guild ID
    * @param {String} reason The reason why you add the money
    * @returns Money amount
    */
    public add(amount: number, memberID: string, guildID: string, reason?: string): Number

    /**
    * Subtracts the money amount from user's balance.
    * @param {Number} amount Amount of money that you want to subtract
    * @param {String} memberID Member ID
    * @param {String} guildID Guild ID
    * @param {String} reason The reason why you subtract the money
    * @returns Money amount
    */
    public subtract(amount: number, memberID: string, guildID: string, reason?: string): Number

    /**
    * Shows a money leaderboard for your server
    * @param {String} guildID Guild ID
    * @returns Sorted leaderboard array
    */
    public leaderboard(guildID: string): Array<LeaderboardData>
}

export = BalanceManager