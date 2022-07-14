const EconomyUser = require('../classes/EconomyUser')

const EconomyError = require('../classes/util/EconomyError')
const errors = require('../structures/errors')

const DatabaseManager = require('../managers/DatabaseManager')
const CacheManager = require('../managers/CacheManager')

const EconomyGuild = require('../classes/EconomyGuild')

class CachedItem {
    constructor(baseConstructor, constructorParams, options, database, cacheManager) {

        /**
         * Cache object.
         * @type {object}
         * @private
         */
        this.cache = {}

        /**
         * Economy options.
         * @type {EconomyOptions}
         */
        this.options = options

        /**
         * A constructor (EconomyUser, ShopItem, etc.) to work with.
         * @type {any}
         */
        this.baseConstructor = baseConstructor

        /**
         * Constructor parameters to pass to the constructor.
         * @type {any[]}
         */
        this.constructorParams = constructorParams

        /**
         * Database Manager.
         * @type {DatabaseManager}
         * @private
         */
        this._database = database

        /**
         * Cache Manager.
         * @type {CacheManager}
         */
        this.cacheManager = cacheManager
    }

    /**
    * Gets the value of the key in a cache.
    * @param {DataIdentifier} id Identifiers object (memberID, guildID) to get value from cache.
    * @returns {any} Value from cache.
    */
    get(id) {
        let result

        if (!id) {
            throw new EconomyError(errors.cache.noIdentifiersProvided, 'INVALID_CACHING_IDENTIFIERS')
        }

        if (id.guildID) result = this.cache?.[id.guildID]
        if (id.memberID) result = result?.[id.memberID]

        let params = this.constructorParams

        if (!result) return null

        if (this.baseConstructor.name == 'EconomyUser') {
            return new this.baseConstructor(
                id.memberID, id.guildID,
                this.options, result,
                this._database, this.cacheManager
            )
        }

        if (this.baseConstructor.name == 'EconomyGuild') {
            return new this.baseConstructor(
                id.guildID, this.options, result,
                this._database, this.cacheManager
            )
        }

        if (this.baseConstructor.name == 'ShopItem') {
            return result.map(item =>
                new this.baseConstructor(
                    id.guildID, item,
                    this._database, this.cacheManager
                )
            )
        }

        switch (params.length) {
            case 1:
                params = [id.guildID]
                break
            case 2:
                params = [id.guildID, id.memberID]
                break
        }

        if (Array.isArray(result)) {
            return result.map(
                item => new this.baseConstructor(
                    ...params, this.options, item,
                    this._database, this.cacheManager
                )
            )
        }

        return new this.baseConstructor(
            ...params, this.options, result,
            this._database, this.cacheManager
        )
    }

    /**
    * Syncs the cache with database for specified user/guild.
    * @param {DataIdentifier} id Identifier object (memberID, guildID) to get value from cache.
    * @returns {Promise<void>}
    */
    async update(id) {
        const constructorName = this.baseConstructor.name

        const databaseProperties = {
            'ShopItem': 'shop',
            'InventoryItem': 'inventory',
            'HistoryItem': 'history',
        }

        const databaseProperty = databaseProperties[constructorName]

        if (!id) {
            throw new EconomyError(errors.cache.noIdentifiersProvided, 'INVALID_CACHING_IDENTIFIERS')
        }

        switch (constructorName) {
            case 'EconomyUser':
                const usersCache = {}

                if (!id.memberID || !id.guildID) {
                    throw new EconomyError(errors.cache.invalidIdentifiers(
                        constructorName,
                        ['memberID', 'guildID'],
                        Object.keys(id)
                    ), 'INVALID_CACHING_IDENTIFIERS')
                }

                const userObject = await this._database.fetch(`${id.guildID}.${id.memberID}`)

                usersCache[id.memberID] = userObject
                this.set(id.guildID, usersCache)

                return Promise.resolve()

            case 'EconomyGuild':
                if (!id.guildID) {
                    throw new EconomyError(errors.cache.invalidIdentifiers(
                        constructorName,
                        ['guildID'],
                        Object.keys(id)
                    ), 'INVALID_CACHING_IDENTIFIERS')
                }

                const guildObject = await this._database.fetch(`${id.guildID}`)
                this.set(id.guildID, guildObject)

                return Promise.resolve()

            case 'ShopItem':
                if (!id.guildID) {
                    throw new EconomyError(errors.cache.invalidIdentifiers(
                        constructorName,
                        ['guildID'],
                        Object.keys(id)
                    ), 'INVALID_CACHING_IDENTIFIERS')
                }

                const shopArray = await this._database.fetch(`${id.guildID}.${databaseProperty}`)
                this.set(id.guildID, shopArray)

                return Promise.resolve()
        }

        const newCache = {}
        const databaseObject = await this._database.fetch(`${id.guildID}.${id.memberID}.${databaseProperty}`)

        newCache[id.memberID] = databaseObject
        this.set(id.guildID, newCache)

        return Promise.resolve()
    }

    /**
    * Syncs entries the cache with database for specified user/guild.
    * @param {DataIdentifier[]} ids Identifiers objects (memberID, guildID) to get value from cache.
    * @returns {Promise<void[]>}
    */
    updateMany(...ids) {
        const promises = []

        for (const id of ids) {
            promises.push(this.update(id))
        }

        return Promise.all(promises)
    }

    /**
    * Sets the value to the key in a cache.
    * @param {string} key Key to set in cache.
    * @param {any} value Value to set to cache.
    * @returns {any} Value that was set.
    */
    set(key, value) {
        this.cache[key] = value
        return value
    }

    /**
    * Removes a key from a cache.
    * @param {string} key Key to delete value from cache.
    * @returns {void}
    */
    remove(key) {
        delete this.cache[key]
    }

    /**
     * Clears the cache.
     * @returns {void}
     */
    clear() {
        this.cache = {}
    }

    /**
     * Determine if a key exists in the cache.
     * @param {string} key Key to check if exists in cache.
     * @returns {boolean} True if key exists in cache, false if not.
     */
    has(key) {
        return this.cache.hasOwnProperty(key)
    }
}

module.exports = CachedItem

/**
 * @typedef {Object} DataIdentifier
 * @property {string} guildID Guild ID.
 * @property {string} memberID Member ID.
 */