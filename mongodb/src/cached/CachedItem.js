const EconomyError = require('../classes/util/EconomyError')
const errors = require('../structures/errors')

const EmptyEconomyGuild = require('../classes/EmptyEconomyGuild')
const EmptyEconomyUser = require('../classes/EmptyEconomyUser')

const defaultUserSchema = require('../structures/DefaultUserSchema')
const Bank = require('../classes/user/Bank')
const Currency = require('../classes/Currency')

/**
 * Cached item class. Used to work with data in Economy cache 
 * (e.g. getting balance data, shop data, etc. from the cache).
 */
class CachedItem {

    /**
     * Cached item class. Used to work with data in Economy cache 
     * (e.g. getting balance data, shop data, etc. from the cache).
     * 
     * @param {any} baseConstructor Constructor that will be called in the methods.
     * @param {any[]} constructorParams Array of parameters for `baseConstructor` to pass in.
     * @param {EconomyConfiguration} options Economy configuration object.
     * @param {DatabaseManager} database Database manager instance.
     * @param {CacheManager} cache Cache manager instance.
     */
    constructor(baseConstructor, constructorParams, options, database, cache) {

        /**
         * Cache object.
         * @type {object}
         * @private
         */
        this.cache = {}

        /**
         * Economy options.
         * @type {EconomyConfiguration}
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
        this.cacheManager = cache
    }

    /**
    * Gets the data from a cache.
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

        if (this.baseConstructor.name == 'EconomyUser') {
            if (!result) {
                const economyUser = new EmptyEconomyUser(
                    id.memberID, id.guildID,
                    this.options,
                    this._database, this.cacheManager
                )

                economyUser.bank = new Bank(
                    id.memberID, id.guildID,
                    this.options,
                    this._database, this.cacheManager
                )

                return economyUser
            }

            const economyUser = new this.baseConstructor(
                id.memberID, id.guildID,
                this.options, result,
                this._database, this.cacheManager
            )

            economyUser.bank = new Bank(
                id.memberID, id.guildID,
                this.options,
                this._database, this.cacheManager
            )

            return economyUser
        }

        if (this.baseConstructor.name == 'Currency') {
            const results = this.cache[id.guildID] || []

            return results.map(result =>
                new Currency(result.id, id.guildID, this.options, result, this._database, this.cacheManager)
            )
        }

        if (this.baseConstructor.name == 'EconomyGuild') {
            if (!result) {
                return new EmptyEconomyGuild(
                    id.guildID, this.options,
                    this._database, this.cacheManager
                )
            }

            return new this.baseConstructor(
                id.guildID, this.options, result,
                this._database, this.cacheManager
            )
        }

        if (!result) {
            return null
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
    * Syncs the cache in a cached item with database for specified user/guild.
    * @param {DataIdentifier} id Identifier object (memberID, guildID) to get value from cache.
    * @returns {Promise<void>}
    */
    async update(id) {
        const constructorName = this.baseConstructor.name

        const databaseProperties = {
            ShopItem: 'shop',
            InventoryItem: 'inventory',
            HistoryItem: 'history',
            Currency: 'currencies'
        }

        const databaseProperty = databaseProperties[constructorName]

        if (!id) {
            throw new EconomyError(errors.cache.noIdentifiersProvided, 'INVALID_CACHING_IDENTIFIERS')
        }

        switch (constructorName) {
            case 'EconomyUser': {
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
            }

            case 'CooldownItem': {
                const cooldownsCache = {}

                if (!id.memberID || !id.guildID) {
                    throw new EconomyError(errors.cache.invalidIdentifiers(
                        constructorName,
                        ['memberID', 'guildID'],
                        Object.entries(id).map(([key, value]) => value ? key : `${key} (undefined)`)
                    ), 'INVALID_CACHING_IDENTIFIERS')
                }

                const rawUserObject = await this._database.fetch(`${id.guildID}.${id.memberID}`) || defaultUserSchema

                const cooldownObject = {
                    daily: rawUserObject?.dailyCooldown,
                    work: rawUserObject?.workCooldown,
                    weekly: rawUserObject?.weeklyCooldown,
                    monthly: rawUserObject.monthlyCooldown,
                    hourly: rawUserObject.hourlyCooldown
                }

                cooldownsCache[id.memberID] = cooldownObject
                this.set(id.guildID, cooldownsCache)

                return Promise.resolve()
            }

            case 'BalanceItem': {
                const balanceCache = {}

                if (!id.memberID || !id.guildID) {
                    throw new EconomyError(errors.cache.invalidIdentifiers(
                        constructorName,
                        ['memberID', 'guildID'],
                        Object.keys(id)
                    ), 'INVALID_CACHING_IDENTIFIERS')
                }

                const rawUser = await this._database.fetch(`${id.guildID}.${id.memberID}`) || defaultUserSchema

                const balanceObject = {
                    money: rawUser?.money,
                    bank: rawUser?.bank,
                }

                balanceCache[id.memberID] = balanceObject
                this.set(id.guildID, balanceCache)

                return Promise.resolve()
            }

            case 'BankBalanceItem': {
                const bankBalanceCache = {}

                if (!id.memberID || !id.guildID) {
                    throw new EconomyError(errors.cache.invalidIdentifiers(
                        constructorName,
                        ['memberID', 'guildID'],
                        Object.keys(id)
                    ), 'INVALID_CACHING_IDENTIFIERS')
                }

                const rawBankUser = await this._database.fetch(`${id.guildID}.${id.memberID}`) || defaultUserSchema

                const bankBalanceObject = {
                    balance: rawBankUser?.bank,
                }

                bankBalanceCache[id.memberID] = bankBalanceObject
                this.set(id.guildID, bankBalanceCache)

                return Promise.resolve()
            }

            case 'EconomyGuild': {
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
            }

            case 'Currency': {
                if (!id.guildID) {
                    throw new EconomyError(errors.cache.invalidIdentifiers(
                        constructorName,
                        ['guildID'],
                        Object.keys(id)
                    ), 'INVALID_CACHING_IDENTIFIERS')
                }

                const currenciesArray = await this._database.fetch(`${id.guildID}.${databaseProperty}`) || []
                this.set(id.guildID, currenciesArray)

                return Promise.resolve()
            }

            case 'ShopItem': {
                if (!id.guildID) {
                    throw new EconomyError(errors.cache.invalidIdentifiers(
                        constructorName,
                        ['guildID'],
                        Object.keys(id)
                    ), 'INVALID_CACHING_IDENTIFIERS')
                }

                const shopArray = await this._database.fetch(`${id.guildID}.${databaseProperty}`) || []
                this.set(id.guildID, shopArray)

                return Promise.resolve()
            }
        }

        const newCache = {}
        const databaseObject = await this._database.fetch(`${id.guildID}.${id.memberID}.${databaseProperty}`)

        newCache[id.memberID] = databaseObject
        this.set(id.guildID, newCache)

        return Promise.resolve()
    }

    /**
    * Syncs entries with the cache in cached item with database for specified user/guild.
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
    * Removes a key from a cache in a cached item.
    * @param {DataIdentifier} id Identifier object (memberID, guildID) to get value from cache.
    * @returns {void}
    */
    remove(id) {
        const constructorName = this.baseConstructor.name

        if (!id) {
            throw new EconomyError(errors.cache.noIdentifiersProvided, 'INVALID_CACHING_IDENTIFIERS')
        }

        switch (constructorName) {
            case 'EconomyUser':
                if (!id.memberID || !id.guildID) {
                    throw new EconomyError(errors.cache.invalidIdentifiers(
                        constructorName,
                        ['memberID', 'guildID'],
                        Object.keys(id)
                    ), 'INVALID_CACHING_IDENTIFIERS')
                }

                delete this.cache[id.guildID]?.[id.memberID]
                break

            case 'CooldownItem':
                if (!id.memberID || !id.guildID) {
                    throw new EconomyError(errors.cache.invalidIdentifiers(
                        constructorName,
                        ['memberID', 'guildID'],
                        Object.keys(id)
                    ), 'INVALID_CACHING_IDENTIFIERS')
                }

                delete this.cache[id.guildID]?.[id.memberID]
                break

            case 'EconomyGuild':
                if (!id.guildID) {
                    throw new EconomyError(errors.cache.invalidIdentifiers(
                        constructorName,
                        ['guildID'],
                        Object.keys(id)
                    ), 'INVALID_CACHING_IDENTIFIERS')
                }

                delete this.cache[id.guildID]
                break

            case 'ShopItem':
                if (!id.guildID) {
                    throw new EconomyError(errors.cache.invalidIdentifiers(
                        constructorName,
                        ['guildID'],
                        Object.keys(id)
                    ), 'INVALID_CACHING_IDENTIFIERS')
                }

                delete this.cache[id.guildID]?.[id.memberID]
                break
        }
    }

    /**
     * Clears the cache in a cached item.
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
        return !!this.cache[key]
    }
}

module.exports = CachedItem

/**
 * @typedef {Object} DataIdentifier
 * @property {string} guildID Guild ID.
 * @property {string} memberID Member ID.
 */
