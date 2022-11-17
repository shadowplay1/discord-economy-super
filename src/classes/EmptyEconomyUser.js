const defaultUserObject = require('../structures/DefaultUserObject')
const EconomyUser = require('./EconomyUser')

/**
 * Empty economy user class.
 * @extends {EconomyUser}
 */
class EmptyEconomyUser extends EconomyUser {

    /**
     * Economy user class.
     * @param {string} userID User ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration.
     * @param {DatabaseManager} database Database Manager.
     */
    constructor(userID, guildID, options, database) {
        super(userID, guildID, options, defaultUserObject, database)

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
