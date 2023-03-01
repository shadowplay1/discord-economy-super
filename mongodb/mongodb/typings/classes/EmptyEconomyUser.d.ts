import EconomyConfiguration from '../interfaces/EconomyConfiguration'

import DatabaseManager from '../managers/DatabaseManager'
import CacheManager from '../managers/CacheManager'

import EconomyUser from './EconomyUser'


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
     * @param {CacheManager} cache Cache manager.
     */
    public constructor(
        userID: string,
        guildID: string,
        options: EconomyConfiguration,
        database: DatabaseManager,
        cache: CacheManager
    )
}

export = EmptyEconomyUser