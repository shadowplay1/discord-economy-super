// This file contains all the managers and classes Economy has (e.g. EconomyItems).
// This file was generated automatically and it's not recommended to edit it yourself.

// All of these items can be imported using:
// `const { something } = require('discord-economy-super/mongodb/EconomyItems')`

// or in TypeScript (all the economy types and interfaces available):
// `import { something } = from 'discord-economy-super/mongodb/EconomyItems'`

// Any of these items may be used in any way. Enjoy!

// - shadowplay1


module.exports = {
    Leaderboards: require('./src/classes/guild/Leaderboards'),
    Settings: require('./src/classes/guild/Settings'),
    Shop: require('./src/classes/guild/Shop'),
    Balance: require('./src/classes/user/Balance'),
    Bank: require('./src/classes/user/Bank'),
    Cooldowns: require('./src/classes/user/Cooldowns'),
    History: require('./src/classes/user/History'),
    Inventory: require('./src/classes/user/Inventory'),
    Items: require('./src/classes/user/Items'),
    Rewards: require('./src/classes/user/Rewards'),
    EconomyError: require('./src/classes/util/EconomyError'),
    Emitter: require('./src/classes/util/Emitter'),
    Logger: require('./src/classes/util/Logger'),
    Currency: require('./src/classes/Currency'),
    EconomyGuild: require('./src/classes/EconomyGuild'),
    EconomyUser: require('./src/classes/EconomyUser'),
    EmptyEconomyGuild: require('./src/classes/EmptyEconomyGuild'),
    EmptyEconomyUser: require('./src/classes/EmptyEconomyUser'),
    HistoryItem: require('./src/classes/HistoryItem'),
    InventoryItem: require('./src/classes/InventoryItem'),
    ShopItem: require('./src/classes/ShopItem'),
    BalanceItem: require('./src/classes/BalanceItem'),
    BankBalanceItem: require('./src/classes/BankBalanceItem'),
    CooldownItem: require('./src/classes/CooldownItem'),
    BalanceManager: require('./src/managers/BalanceManager'),
    BankManager: require('./src/managers/BankManager'),
    BaseManager: require('./src/managers/BaseManager'),
    CacheManager: require('./src/managers/CacheManager'),
    CooldownManager: require('./src/managers/CooldownManager'),
    CurrencyManager: require('./src/managers/CurrencyManager'),
    DatabaseManager: require('./src/managers/DatabaseManager'),
    GuildManager: require('./src/managers/GuildManager'),
    HistoryManager: require('./src/managers/HistoryManager'),
    InventoryManager: require('./src/managers/InventoryManager'),
    RewardManager: require('./src/managers/RewardManager'),
    SettingsManager: require('./src/managers/SettingsManager'),
    ShopManager: require('./src/managers/ShopManager'),
    UserManager: require('./src/managers/UserManager'),
    UtilsManager: require('./src/managers/UtilsManager'),
    CachedItem: require('./src/cached/CachedItem'),
    CachedItems: require('./src/cached/CachedItems')
}
