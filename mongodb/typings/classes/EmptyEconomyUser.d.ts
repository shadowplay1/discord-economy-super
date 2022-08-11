import EconomyOptions from '../interfaces/EconomyOptions'

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
     * @param {EconomyOptions} options Economy configuration.
     * @param {DatabaseManager} database Database Manager.
     * @param {CacheManager} cache Cache manager.
     */
    constructor(
        userID: string,
        guildID: string,
        options: EconomyOptions,
        database: DatabaseManager,
        cache: CacheManager
    )

    /**
     * Determine if the guild exists in the database.
     */
    public exists: false
}

export = EmptyEconomyUser