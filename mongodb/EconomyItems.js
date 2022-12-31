const Emitter = require('./src/classes/util/Emitter')
const EconomyError = require('./src/classes/util/EconomyError')

const BalanceManager = require('./src/managers/BalanceManager')
const BankManager = require('./src/managers/BankManager')

const UtilsManager = require('./src/managers/UtilsManager')
const DatabaseManager = require('./src/managers/DatabaseManager')

const ShopManager = require('./src/managers/ShopManager')
const InventoryManager = require('./src/managers/InventoryManager')

const RewardManager = require('./src/managers/RewardManager')
const CooldownManager = require('./src/managers/CooldownManager')
const HistoryManager = require('./src/managers/HistoryManager')

const CurrencyManager = require('./src/managers/CurrencyManager')

const UserManager = require('./src/managers/UserManager')
const GuildManager = require('./src/managers/GuildManager')

const SettingsManager = require('./src/managers/SettingsManager')
const BaseManager = require('./src/managers/BaseManager')

const CacheManager = require('./src/managers/CacheManager')

const EconomyGuild = require('./src/classes/EconomyGuild')
const EconomyUser = require('./src/classes/EconomyUser')


const EmptyEconomyGuild = require('./src/classes/EmptyEconomyGuild')
const EmptyEconomyUser = require('./src/classes/EmptyEconomyUser')

const Currency = require('./src/classes/Currency')

const ShopItem = require('./src/classes/ShopItem')
const InventoryItem = require('./src/classes/InventoryItem')
const HistoryItem = require('./src/classes/HistoryItem')

const CooldownItem = require('./src/classes/CooldownItem')

const BalanceItem = require('./src/classes/BalanceItem')
const BankBalanceItem = require('./src/classes/BankBalanceItem')

const Leaderboards = require('./src/classes/guild/Leaderboards')
const Settings = require('./src/classes/guild/Settings')
const Shop = require('./src/classes/guild/Shop')

const Balance = require('./src/classes/user/Balance')
const Bank = require('./src/classes/user/Bank')
const Cooldowns = require('./src/classes/user/Cooldowns')
const History = require('./src/classes/user/History')
const Inventory = require('./src/classes/user/Inventory')
const Items = require('./src/classes/user/Items')
const Rewards = require('./src/classes/user/Rewards')


module.exports = {
    EconomyError,
    Emitter,

    EconomyUser,
    EconomyGuild,

    EmptyEconomyUser,
    EmptyEconomyGuild,

    DatabaseManager,
    UtilsManager,

    BalanceManager,
    BankManager,

    RewardManager,
    CooldownManager,

    ShopManager,
    InventoryManager,

    HistoryManager,
    CurrencyManager,

    UserManager,
    GuildManager,

    SettingsManager,
    BaseManager,

    CacheManager,

    ShopItem,
    InventoryItem,
    HistoryItem,

    Currency,
    CooldownItem,

    BalanceItem,
    BankBalanceItem,

    Leaderboards,
    Settings,
    Shop,

    Balance,
    Bank,
    Cooldowns,
    History,
    Inventory,
    Items,
    Rewards,

    RewardType: {
        DAILY: 0,
        WORK: 1,
        WEEKLY: 2
    }
}
