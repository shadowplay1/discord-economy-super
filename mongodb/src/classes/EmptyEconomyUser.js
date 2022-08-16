const CacheManager = require('../managers/CacheManager')

const defaultUserObject = require('../structures/DefaultUserObject')
const EconomyUser = require('./EconomyUser')

/**
 * Empty economy user class.
 */
class EmptyEconomyUser extends EconomyUser {

    /**
     * Economy user class.
     * @param {string} userID User ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyOptions} options Economy configuration.
     * @param {DatabaseManager} database Database Manager.
     * @param {CacheManager} cache Cache manager.
     */
    constructor(userID, guildID, options, database, cache) {
        super(userID, guildID, options, defaultUserObject, database, cache)

        /**
         * Determine if the user exists in the database.
         * @type {boolean}
         */
        this.exists = false
    }
}

/**
 * Empty economy user class.
 * @type {EmptyEconomyUser}
 */
module.exports = EmptyEconomyUser
