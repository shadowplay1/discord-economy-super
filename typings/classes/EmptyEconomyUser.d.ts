import EconomyOptions from '../interfaces/EconomyOptions'

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
     * @param {EconomyOptions} options Economy configuration.
     * @param {DatabaseManager} database Database Manager.
     */
    constructor(
        userID: string,
        guildID: string,
        options: EconomyOptions,
        database: DatabaseManager
    )
}

export = EmptyEconomyUser