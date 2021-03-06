
import EconomyOptions from '../interfaces/EconomyOptions'

import BaseManager from './BaseManager'
import ShopManager from './ShopManager'

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
     * @returns {EconomyGuild} User object.
    */
    public get(guildID: string): EconomyGuild

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
