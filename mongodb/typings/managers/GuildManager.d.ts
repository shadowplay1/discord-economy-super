
import EconomyOptions from '../interfaces/EconomyOptions'

import BaseManager from './BaseManager'
import EconomyGuild from '../classes/EconomyGuild'


/**
 * Guild Manager.
 */
declare class GuildManager extends BaseManager<EconomyGuild> {

    /**
     * Guild Manager.
     * @param {EconomyOptions} options Economy configuration.
     */
    public constructor(options: EconomyOptions)

    /**
     * Gets the guild by it's ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<EconomyGuild>} User object.
    */
    public get(guildID: string): Promise<EconomyGuild>

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
