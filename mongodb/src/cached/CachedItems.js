const CachedItem = require('./CachedItem')


const EconomyGuild = require('../classes/EconomyGuild')

const EconomyUser = require('../classes/EconomyUser')
const CooldownItem = require('../classes/CooldownItem')

const ShopItem = require('../classes/ShopItem')
const InventoryItem = require('../classes/InventoryItem')
const HistoryItem = require('../classes/HistoryItem')


class CachedGuilds extends CachedItem {
    constructor(guildID, options, database, cache) {
        super(EconomyGuild, [guildID], options, database, cache)
    }
}

class CachedUsers extends CachedItem {
    constructor(userID, guildID, options, database, cache) {
        super(EconomyUser, [userID, guildID], options, database, cache)
    }
}

class CachedCooldowns extends CachedItem {
    constructor(userID, guildID, options, database, cache) {
        super(CooldownItem, [userID, guildID], options, database, cache)
    }
}

class CachedShop extends CachedItem {
    constructor(guildID, options, database, cache) {
        super(ShopItem, [guildID], options, database, cache)
    }
}

class CachedInventory extends CachedItem {
    constructor(userID, guildID, options, database, cache) {
        super(InventoryItem, [guildID, userID], options, database, cache)
    }
}

class CachedHistory extends CachedItem {
    constructor(userID, guildID, options, database, cache) {
        super(HistoryItem, [guildID, userID], options, database, cache)
    }
}

module.exports = {
    CachedGuilds,
    CachedUsers,
    CachedCooldowns,
    CachedShop,
    CachedInventory,
    CachedHistory
}