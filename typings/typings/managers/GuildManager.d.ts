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
    public constructor(options: EconomyConfiguration)

    /**
     * Gets the guild by it's ID.
     * @param {string} guildID Guild ID.
     * @returns {EconomyGuild} User object.
    */
    public get(guildID: string): EconomyGuild | EmptyEconomyGuild

    /**
     * Creates an economy guild object in database.
     * @param {string} guildID The guild ID to set.
     * @returns {EconomyGuild} New guild instance.
     */
    public create(guildID: string): EconomyGuild

    /**
     * Resets the guild in database.
     * @param {string} guildID Guild ID.
     * @returns {EconomyGuild} New guild instance.
     */
    public reset(guildID: string): EconomyGuild

    /**
     * Gets the array of ALL guilds in database.
     * @returns {EconomyGuild[]}
     */
    public all(): EconomyGuild[]
}

export = GuildManager
