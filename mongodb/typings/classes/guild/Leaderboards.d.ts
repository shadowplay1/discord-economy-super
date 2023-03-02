import EconomyConfiguration from '../../interfaces/EconomyConfiguration'
import LeaderboardData from '../../interfaces/LeaderboardData'
import DatabaseManager from '../../managers/DatabaseManager'


declare class Leaderboards {

    /**
     * Guild leaderboards class.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration.
     */
    public constructor(guildID: string, options: EconomyConfiguration, database: DatabaseManager)

    /**
     * Gets a money leaderboard for the guild.
     * @returns {LeaderboardData[]} Balance leaderboard array.
     */
    public money(): Promise<LeaderboardData[]>

    /**
     * Gets a bank balance leaderboard for the guild.
     * @returns {LeaderboardData[]} Bank balance leaderboard array.
     */
    public bank(): Promise<LeaderboardData[]>
}

export = Leaderboards