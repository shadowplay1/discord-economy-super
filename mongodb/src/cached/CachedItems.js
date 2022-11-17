const CachedItem = require('./CachedItem')

const EconomyGuild = require('../classes/EconomyGuild')
const EconomyUser = require('../classes/EconomyUser')

const CooldownItem = require('../classes/CooldownItem')

const BalanceItem = require('../classes/BalanceItem')
const BankBalanceItem = require('../classes/BankBalanceItem')

const ShopItem = require('../classes/ShopItem')
const InventoryItem = require('../classes/InventoryItem')
const HistoryItem = require('../classes/HistoryItem')


/**
 * Cached guilds class. Allows to get the Economy guilds from the cache.
 */
class CachedGuilds extends CachedItem {

    /**
     * Cached guilds class. Allows to get Economy guilds from the cache.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration object.
     * @param {DatabaseManager} database Database manager instance.
     * @param {CacheManager} cacheManager Cache manager instance.
     */
    constructor(guildID, options, database, cache) {
        super(EconomyGuild, [guildID], options, database, cache)
    }
}

/**
 * Cached user class. Allows to get Economy users from the cache.
 */
class CachedUsers extends CachedItem {

    /**
     * Cached guilds class. Allows to get Economy guilds from the cache.
     * @param {string} userID User ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration object.
     * @param {DatabaseManager} database Database manager instance.
     * @param {CacheManager} cacheManager Cache manager instance.
     */
    constructor(userID, guildID, options, database, cache) {
        super(EconomyUser, [userID, guildID], options, database, cache)
    }
}

/**
 * Cached cooldowns class. Allows to get cooldowns from the cache.
 */
class CachedCooldowns extends CachedItem {

    /**
     * Cached cooldowns class. Allows to get cooldowns from the cache.
     * @param {string} userID User ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration object.
     * @param {DatabaseManager} database Database manager instance.
     * @param {CacheManager} cacheManager Cache manager instance.
     */
    constructor(userID, guildID, options, database, cache) {
        super(CooldownItem, [userID, guildID], options, database, cache)
    }
}

/**
 * Cached balance class. Allows to get balance from the cache.
 */
class CachedBalance extends CachedItem {

    /**
     * Cached balance class. Allows to get balance from the cache.
     * @param {string} userID User ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration object.
     * @param {DatabaseManager} database Database manager instance.
     * @param {CacheManager} cacheManager Cache manager instance.
     */
    constructor(userID, guildID, options, database, cache) {
        super(BalanceItem, [userID, guildID], options, database, cache)
    }
}

/**
 * Cached bank balance class. Allows to get bank balance from the cache.
 */
class CachedBank extends CachedItem {

    /**
     * Cached bank balance class. Allows to get bank balance from the cache.
     * @param {string} userID User ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration object.
     * @param {DatabaseManager} database Database manager instance.
     * @param {CacheManager} cacheManager Cache manager instance.
     */
    constructor(userID, guildID, options, database, cache) {
        super(BankBalanceItem, [userID, guildID], options, database, cache)
    }
}

/**
 * Cached shop class. Allows to get shop from the cache.
 */
class CachedShop extends CachedItem {

    /**
     * Cached shop class. Allows to get shop from the cache.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration object.
     * @param {DatabaseManager} database Database manager instance.
     * @param {CacheManager} cacheManager Cache manager instance.
     */
    constructor(guildID, options, database, cache) {
        super(ShopItem, [guildID], options, database, cache)
    }
}

/**
 * Cached inventory class. Allows to get inventory from the cache. 
 */
class CachedInventory extends CachedItem {

    /**
     * Cached inventory class. Allows to get inventory from the cache.
     * @param {string} userID User ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration object.
     * @param {DatabaseManager} database Database manager instance.
     * @param {CacheManager} cacheManager Cache manager instance.
     */
    constructor(userID, guildID, options, database, cache) {
        super(InventoryItem, [guildID, userID], options, database, cache)
    }
}

/**
 * Cached history class. Allows to get history from the cache.
 */
class CachedHistory extends CachedItem {

    /**
     * Cached history class. Allows to get history from the cache.
     * @param {string} userID User ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration object.
     * @param {DatabaseManager} database Database manager instance.
     * @param {CacheManager} cacheManager Cache manager instance.
     */
    constructor(userID, guildID, options, database, cache) {
        super(HistoryItem, [guildID, userID], options, database, cache)
    }
}

module.exports = {
    CachedGuilds,
    CachedUsers,
    CachedCooldowns,
    CachedBalance,
    CachedBank,
    CachedShop,
    CachedInventory,
    CachedHistory
}
