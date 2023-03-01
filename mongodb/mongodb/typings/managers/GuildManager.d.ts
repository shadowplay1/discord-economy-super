import DatabaseManager from './DatabaseManager'
import CacheManager from './CacheManager'

import EconomyConfiguration from '../interfaces/EconomyConfiguration'

import BaseManager from './BaseManager'

import EconomyGuild from '../classes/EconomyGuild'
import EmptyEconomyGuild from '../classes/EmptyEconomyGuild'


/**
 * Guild Manager.
 */
declare class GuildManager extends BaseManager<EconomyGuild, EmptyEconomyGuild> {

    /**
     * Guild Manager.
     * @param {EconomyConfiguration} options Economy configuration.
     */
    public constructor(options: EconomyConfiguration, database: DatabaseManager, cache: CacheManager)

    /**
     * Gets the guild by it's ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<EconomyGuild>} User object.
    */
    public get(guildID: string): Promise<EconomyGuild | EmptyEconomyGuild>

    /**
     * Creates an economy guild object in database.
     * @param {string} guildID The guild ID to set.
     * @returns {Promise<EconomyGuild>} New guild instance.
     */
    public create(guildID: string): Promise<EconomyGuild>

    /**
     * Resets the guild in database.
     * @param {string} guildID Guild ID.
     * @returns {Promise<EconomyGuild>} New guild instance.
     */
    public reset(guildID: string): Promise<EconomyGuild>

    /**
     * Gets the array of all guilds in database.
     * @returns {Promise<EconomyGuild[]>}
     */
    public all(): Promise<EconomyGuild[]>
}

export = GuildManager
