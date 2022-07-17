import EconomyOptions from '../../interfaces/EconomyOptions'
import LeaderboardData from '../../interfaces/LeaderboardData'


declare class Leaderboards {

    /**
     * Guild leaderboards class.
     * @param {string} guildID Guild ID.
     * @param {EconomyOptions} options Economy configuration.
     */
    public constructor(guildID: string, options: EconomyOptions)

    /**
     * Gets a money leaderboard for this guild.
     * @returns {LeaderboardData[]} Balance leaderboard array.
     */
    public balance(): LeaderboardData[]

    /**
     * Gets a money leaderboard for this guild.
     *
     * This method is an alias for 'Leaderboards.balance()' method.
     * @returns {LeaderboardData[]} Balance leaderboard array.
     */
    public money(): LeaderboardData[]

    /**
     * Gets a bank balance leaderboard for this guild.
     * @returns {LeaderboardData[]} Bank balance leaderboard array.
     */
    public bank(): LeaderboardData[]
}

export = Leaderboards