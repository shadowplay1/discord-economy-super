import EconomyOptions from '../interfaces/EconomyOptions'

import EconomyGuild from './EconomyGuild'
import DatabaseManager from '../managers/DatabaseManager'



/**
 * Empty economy guild class.
 */
declare class EmptyEconomyGuild extends EconomyGuild {

    /**
     * Economy guild class.
     * @param {string} guildID Guild ID.
     * @param {EconomyOptions} options Economy configuration.
     * @param {DatabaseManager} database Database manager.
     */
    public constructor(
        guildID: string,
        options: EconomyOptions,
        database: DatabaseManager
    )
}

export = EmptyEconomyGuild