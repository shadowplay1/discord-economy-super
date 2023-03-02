import EconomyConfiguration from '../interfaces/EconomyConfiguration'

import EconomyUser from './EconomyUser'
import DatabaseManager from '../managers/DatabaseManager'


/**
 * Empty economy user class.
 */
declare class EmptyEconomyUser extends EconomyUser {

    /**
     * Economy user class.
     * @param {string} userID User ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration.
     * @param {DatabaseManager} database Database Manager.
     */
    public constructor(
        userID: string,
        guildID: string,
        options: EconomyConfiguration,
        database: DatabaseManager
    )
}

export = EmptyEconomyUser