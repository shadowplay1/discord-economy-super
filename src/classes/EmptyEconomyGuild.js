const EconomyGuild = require('./EconomyGuild')

/**
 * Empty economy guild class.
 */
class EmptyEconomyGuild extends EconomyGuild {

    /**
     * Economy guild class.
     * @param {string} guildID Guild ID.
     * @param {EconomyOptions} options Economy configuration.
     * @param {DatabaseManager} database Database manager.
     */
    constructor(guildID, options, database) {
        super(guildID, options, {}, database)

        /**
         * Determine if the guild exists in the database.
         * @type {boolean}
         */
        this.exists = false
    }
}

/**
 * Empty economy guild class.
 * @type {EmptyEconomyGuild}
 */
module.exports = EmptyEconomyGuild
