const EconomyGuild = require('./EconomyGuild')

/**
 * Empty economy guild class.
 * @extends {EconomyGuild}
 */
class EmptyEconomyGuild extends EconomyGuild {

    /**
     * Economy guild class.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration.
     * @param {DatabaseManager} database Database manager.
     * @param {CacheManager} cache Cache manager.
     */
    constructor(guildID, options, database, cache) {
        super(guildID, options, {}, database, cache)

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
