const DatabaseManager = require('./DatabaseManager')

const {
    CachedGuilds,
    CachedUsers,
    CachedShop,
    CachedHistory,
    CachedInventory
} = require('../cached/CachedItems')

class CacheManager {
    constructor(options, database) {

        /**
         * Cached guilds.
         * @type {CachedGuilds}
         */
        this.guilds = new CachedGuilds(null, options, database, this)

        /**
         * Cached users.
         * @type {CachedUsers}
         */
        this.users = new CachedUsers(null, null, options, database, this)

        /**
         * Cached shop.
         * @type {CachedShop}
         */
        this.shop = new CachedShop(null, options, database, this)

        /**
         * Cached history.
         * @type {CachedHistory}
         */
        this.history = new CachedHistory(null, null, options, database, this)

        /**
         * Cached inventory.
         * @type {CachedInventory}
         */
        this.inventory = new CachedInventory(null, null, options, database, this)

        /**
         * Database Manager.
         * @type {DatabaseManager}
         * @private
         */
        this._database = database
    }
}

module.exports = CacheManager