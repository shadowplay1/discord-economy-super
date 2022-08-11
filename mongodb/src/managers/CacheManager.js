const DatabaseManager = require('./DatabaseManager')

const {
    CachedGuilds,
    CachedUsers,
    CachedCooldowns,
    CachedBalance,
    CachedShop,
    CachedHistory,
    CachedInventory
} = require('../cached/CachedItems')

const EconomyError = require('../classes/util/EconomyError')
const errors = require('../structures/errors')

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
         * Cached balance.
         * @type {CachedBalance}
         */
        this.balance = new CachedBalance(null, null, options, database, this)

        /**
         * Cached cooldowns.
         * @type {CachedCooldowns}
         */
        this.cooldowns = new CachedCooldowns(null, null, options, database, this)

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

    /**
     * Updates all the cached items.
     * @param {DataIdentifier} id Identifiers object (memberID, guildID) to get value from cache.
     * @returns {Promise<void>}
     */
    async updateAll(id) {
        if (!id) {
            throw new EconomyError(errors.cache.noIdentifiersProvided, 'INVALID_CACHING_IDENTIFIERS')
        }

        await this.guilds.update(id)
        await this.users.update(id)
        await this.cooldowns.update(id)
        await this.shop.update(id)
        await this.history.update(id)
        await this.inventory.update(id)

        return
    }

    /**
     * Clears all the cache in all cached items.
     * @returns {void}
     */
    clearAll() {
        this.guilds.clear()
        this.users.clear()
        this.cooldowns.clear()
        this.shop.clear()
        this.history.clear()
        this.inventory.clear()
    }

    /**
     * Updates the specified cached items.
     * @param {CacheItemName[]} cacheItemNames 
     * Names of the cache items to update.
     * 
     * @param {DataIdentifier} id Identifiers object (memberID, guildID) to get value from cache.
     * @returns {Promise<void[]>}
     */
    async updateSpecified(cacheItemNames, id) {
        const promises = []

        for (const i of cacheItemNames) {
            switch (i) {
                case 'guilds':
                    promises.push(this.guilds.update(id))
                    break
                case 'users':
                    promises.push(this.users.update(id))
                    break
                case 'cooldowns':
                    promises.push(this.cooldowns.update(id))
                    break
                case 'shop':
                    promises.push(this.shop.update(id))
                    break
                case 'history':
                    promises.push(this.history.update(id))
                    break
                case 'inventory':
                    promises.push(this.inventory.update(id))
                    break

                default:
                    throw new EconomyError(errors.cache.invalidCacheNames, 'INVALID_CACHE_ITEM_NAME')
            }
        }

        const result = await Promise.all(promises)
        return result
    }

    /**
     * Clears the specified cached items.
     * @param {CacheItemName[]} cacheItemNames 
     * Names of the cache items to clear.
     * 
     * @returns {void}
     */
    clearSpecified(cacheItemNames) {
        for (const i of cacheItemNames) {
            switch (i) {
                case 'guilds':
                    this.guilds.clear()
                    break
                case 'users':
                    this.users.clear()
                    break
                case 'cooldowns':
                    this.cooldowns.clear()
                    break
                case 'shop':
                    this.shop.clear()
                    break
                case 'history':
                    this.history.clear()
                    break
                case 'inventory':
                    this.inventory.clear()
                    break

                default:
                    throw new EconomyError(errors.cache.invalidCacheNames, 'INVALID_CACHE_ITEM_NAME')
            }
        }
    }

}

module.exports = CacheManager

/**
 * @typedef {Object} DataIdentifier
 * @property {string} guildID Guild ID.
 * @property {string} memberID Member ID.
 */

/**
 * @typedef {'guilds' | 'users' | 'cooldowns' | 'balance' | 'shop' | 'inventory' | 'history'} CacheItemName
 */