const {
    CachedGuilds,
    CachedUsers,
    CachedCooldowns,
    CachedBalance,
    CachedCurrency,
    CachedBank,
    CachedShop,
    CachedHistory,
    CachedInventory
} = require('../cached/CachedItems')

const EconomyError = require('../classes/util/EconomyError')
const errors = require('../structures/errors')

/**
 * Economy Cache manager.
 */
class CacheManager {

    /**
     * Economy Cache manager.
     * @param {EconomyConfiguration} options Economy configuration object.
     * @param {DatabaseManager} database Database manager instance.
     */
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
         * Cached bank balance.
         * @type {CachedBank}
         */
        this.bank = new CachedBank(null, null, options, database, this)

        /**
         * Cached currencies
         * @type {CachedCurrency}
         */
        this.currencies = new CachedCurrency(null, null, options, database, this)

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

        await this.balance.update(id)
        await this.bank.update(id)
        await this.currencies.update(id)

        await this.shop.update(id)
        await this.inventory.update(id)

        await this.history.update(id)
    }

    /**
     * Clears all the cache in all cached items.
     * @returns {void}
     */
    clearAll() {
        this.guilds.clear()
        this.users.clear()

        this.cooldowns.clear()

        this.balance.clear()
        this.bank.clear()
        this.currencies.clear()

        this.shop.clear()
        this.inventory.clear()

        this.history.clear()
    }

    /**
     * Updates the specified cached items.
     * @param {CacheItemName[]} cacheItemNames Names of the cache items to update.
     * @param {DataIdentifier} id Identifiers object (memberID, guildID) to get value from cache.
     * @returns {Promise<void[]>}
     */
    async updateSpecified(cacheItemNames, id) {
        const promises = []

        for (const cacheItemName of cacheItemNames) {
            if (this[cacheItemName]) {
                promises.push(this[cacheItemName].update(id))
            } else {
                throw new EconomyError(errors.cache.invalidCacheNames, 'INVALID_CACHE_ITEM_NAME')
            }
        }

        const result = await Promise.all(promises)
        return result
    }

    /**
     * Updates the specified cached items.
     *
     * This method is an alias for `CacheManager.updateSpecified()` method.
     * @param {CacheItemName[]} cacheItemNames Names of the cache items to update.s
     * @param {DataIdentifier} id Identifiers object (memberID, guildID) to get value from cache.
     * @returns {Promise<void[]>}
     */
    updateMany(cacheItemNames, id) {
        return this.updateSpecified(cacheItemNames, id)
    }

    /**
     * Clears the specified cached items.
     * @param {CacheItemName[]} cacheItemNames Names of the cache items to clear.
     * @returns {Promise<void[]>}
     */
    async clearSpecified(cacheItemNames, id) {
        const promises = []

        for (const cacheItemName of cacheItemNames) {
            if (this[cacheItemName]) {
                promises.push(this[cacheItemName].clear(id))
            } else {
                throw new EconomyError(errors.cache.invalidCacheNames, 'INVALID_CACHE_ITEM_NAME')
            }
        }

        const result = await Promise.all(promises)
        return result
    }

    /**
     * Clears the specified cached items.
     * 
     * This method is an alias for `CacheManager.clearSpecified` method.
     * @param {CacheItemName[]} cacheItemNames Names of the cache items to clear.
     * @returns {void}
     */
    clearMany(cacheItemNames) {
        return this.clearSpecified(cacheItemNames)
    }
}

module.exports = CacheManager


/**
 * @typedef {Object} DataIdentifier
 * @property {string} guildID Guild ID.
 * @property {string} memberID Member ID.
 */


/* eslint-disable */

/**
 * @typedef {'guilds' | 'users' | 'cooldowns' | 'balance' | 'bank' | 'currencies' | 'shop' | 'inventory' | 'history'} CacheItemName
 */
