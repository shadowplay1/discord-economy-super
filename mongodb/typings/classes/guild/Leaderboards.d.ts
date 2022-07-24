import EconomyOptions from '../../interfaces/EconomyOptions'
import LeaderboardData from '../../interfaces/LeaderboardData'
import DatabaseManager from '../../managers/DatabaseManager'


declare class Leaderboards {

    /**
     * Guild leaderboards class.
     * @param {string} guildID Guild ID.
     * @param {EconomyOptions} options Economy configuration.
     */
    public constructor(guildID: string, options: EconomyOptions, database: DatabaseManager)

    /**
     * Gets a money leaderboard for this guild.
     * @returns {LeaderboardData[]} Balance leaderboard array.
     */
    public money(): Promise<LeaderboardData[]>

    /**
     * Gets a bank balance leaderboard for this guild.
     * @returns {LeaderboardData[]} Bank balance leaderboard array.
     */
    public bank(): Promise<LeaderboardData[]>
}

export = Leaderboards