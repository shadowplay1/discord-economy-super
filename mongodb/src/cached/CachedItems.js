const CachedItem = require('./CachedItem')

const EconomyGuild = require('../classes/EconomyGuild')
const EconomyUser = require('../classes/EconomyUser')

const CooldownItem = require('../classes/CooldownItem')

const BalanceItem = require('../classes/BalanceItem')
const BankBalanceItem = require('../classes/BankBalanceItem')
const Currency = require('../classes/Currency')

const ShopItem = require('../classes/ShopItem')
const InventoryItem = require('../classes/InventoryItem')
const HistoryItem = require('../classes/HistoryItem')


/**
 * Cached guilds class. Allows to get the cached Economy guilds.
 * @extends {CachedItem}
 */
class CachedGuilds extends CachedItem {

    /**
     * Cached guilds class. Allows to get cached Economy guilds.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration object.
     * @param {DatabaseManager} database Database manager instance.
     * @param {CacheManager} cache Cache manager instance.
     */
    constructor(guildID, options, database, cache) {
        super(EconomyGuild, [guildID], options, database, cache)
    }
}

/**
 * Cached user class. Allows to get cached Economy users.
 * @extends {CachedItem}
 */
class CachedUsers extends CachedItem {

    /**
     * Cached guilds class. Allows to get cached Economy guilds.
     * @param {string} userID User ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration object.
     * @param {DatabaseManager} database Database manager instance.
     * @param {CacheManager} cache Cache manager instance.
     */
    constructor(userID, guildID, options, database, cache) {
        super(EconomyUser, [userID, guildID], options, database, cache)
    }
}

/**
 * Cached cooldowns class. Allows to get cached cooldowns.
 * @extends {CachedItem}
 */
class CachedCooldowns extends CachedItem {

    /**
     * Cached cooldowns class. Allows to get cached cooldowns.
     * @param {string} userID User ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration object.
     * @param {DatabaseManager} database Database manager instance.
     * @param {CacheManager} cache Cache manager instance.
     */
    constructor(userID, guildID, options, database, cache) {
        super(CooldownItem, [userID, guildID], options, database, cache)
    }
}

/**
 * Cached balance class. Allows to get cached balance.
 * @extends {CachedItem}
 */
class CachedBalance extends CachedItem {

    /**
     * Cached balance class. Allows to get cached balance.
     * @param {string} userID User ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration object.
     * @param {DatabaseManager} database Database manager instance.
     * @param {CacheManager} cache Cache manager instance.
     */
    constructor(userID, guildID, options, database, cache) {
        super(BalanceItem, [userID, guildID], options, database, cache)
    }
}

/**
 * Cached bank balance class. Allows to get cached bank balance.
 * @extends {CachedItem}
 */
class CachedBank extends CachedItem {

    /**
     * Cached bank balance class. Allows to get cached bank balance.
     * @param {string} userID User ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration object.
     * @param {DatabaseManager} database Database manager instance.
     * @param {CacheManager} cache Cache manager instance.
     */
    constructor(userID, guildID, options, database, cache) {
        super(BankBalanceItem, [userID, guildID], options, database, cache)
    }
}

/**
 * Cached currency class. Allows to manage the cached guild currencies.
 * @extends {CachedItem}
 */
class CachedCurrency extends CachedItem {

    /**
     * Cached currency class. Allows to manage the cached guild currencies.
     * @param {number} currencyID Currency ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration object.
     * @param {DatabaseManager} database Database manager instance.
     * @param {CacheManager} cache Cache manager instance.
     */
    constructor(currencyID, guildID, options, database, cache) {
        super(Currency, [currencyID, guildID], options, database, cache)
    }
}

/**
 * Cached shop class. Allows to get the cached guildshop.
 * @extends {CachedItem}
 */
class CachedShop extends CachedItem {

    /**
     * Cached shop class. Allows to get the cached guild shop.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration object.
     * @param {DatabaseManager} database Database manager instance.
     * @param {CacheManager} cache Cache manager instance.
     */
    constructor(guildID, options, database, cache) {
        super(ShopItem, [guildID], options, database, cache)
    }
}

/**
 * Cached inventory class. Allows to get the cached user inventory.
 * @extends {CachedItem}
 */
class CachedInventory extends CachedItem {

    /**
     * Cached inventory class. Allows to get the cached user inventory.
     * @param {string} userID User ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration object.
     * @param {DatabaseManager} database Database manager instance.
     * @param {CacheManager} cache Cache manager instance.
     */
    constructor(userID, guildID, options, database, cache) {
        super(InventoryItem, [guildID, userID], options, database, cache)
    }
}

/**
 * Cached history class. Allows to get the cached user purchases history.
 * @extends {CachedItem}
 */
class CachedHistory extends CachedItem {

    /**
     * Cached history class. Allows to get the cached user purchases history.
     * @param {string} userID User ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration object.
     * @param {DatabaseManager} database Database manager instance.
     * @param {CacheManager} cache Cache manager instance.
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
    CachedCurrency,
    CachedShop,
    CachedInventory,
    CachedHistory
}
