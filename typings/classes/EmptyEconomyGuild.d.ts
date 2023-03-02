import EconomyConfiguration from '../interfaces/EconomyConfiguration'

import EconomyGuild from './EconomyGuild'
import DatabaseManager from '../managers/DatabaseManager'



/**
 * Empty economy guild class.
 */
declare class EmptyEconomyGuild extends EconomyGuild {

    /**
     * Economy guild class.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration.
     * @param {DatabaseManager} database Database manager.
     */
    public constructor(
        guildID: string,
        options: EconomyConfiguration,
        database: DatabaseManager
    )
}

export = EmptyEconomyGuild