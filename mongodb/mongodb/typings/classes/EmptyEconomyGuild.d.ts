import EconomyConfiguration from '../interfaces/EconomyConfiguration'

import DatabaseManager from '../managers/DatabaseManager'
import CacheManager from '../managers/CacheManager'

import EconomyGuild from './EconomyGuild'


/**
 * Empty economy guild class.
 */
declare class EmptyEconomyGuild extends EconomyGuild {

    /**
     * Economy guild class.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration.
     * @param {DatabaseManager} database Database manager.
     * @param {CacheManager} cache Cache manager.
     */
    public constructor(
        guildID: string,
        options: EconomyConfiguration,
        database: DatabaseManager,
        cache: CacheManager
    )
}

export = EmptyEconomyGuild