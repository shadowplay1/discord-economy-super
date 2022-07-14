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

const UserManager = require('./src/managers/UserManager')
const GuildManager = require('./src/managers/GuildManager')

const SettingsManager = require('./src/managers/SettingsManager')
const BaseManager = require('./src/managers/BaseManager')

const CacheManager = require('./src/managers/CacheManager')

const EconomyGuild = require('./src/classes/EconomyGuild')
const EconomyUser = require('./src/classes/EconomyUser')

const ShopItem = require('./src/classes/ShopItem')
const InventoryItem = require('./src/classes/InventoryItem')
const HistoryItem = require('./src/classes/HistoryItem')

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
    EconomyError: EconomyError,
    Emitter: Emitter,

    EconomyUser: EconomyUser,
    EconomyGuild: EconomyGuild,

    DatabaseManager: DatabaseManager,
    UtilsManager: UtilsManager,

    BalanceManager: BalanceManager,
    BankManager: BankManager,

    RewardManager: RewardManager,
    CooldownManager: CooldownManager,

    ShopManager: ShopManager,
    InventoryManager: InventoryManager,

    HistoryManager: HistoryManager,

    UserManager: UserManager,
    GuildManager: GuildManager,

    SettingsManager: SettingsManager,
    BaseManager: BaseManager,

    CacheManager: CacheManager,

    ShopItem: ShopItem,
    InventoryItem: InventoryItem,
    HistoryItem: HistoryItem,

    Leaderboards: Leaderboards,
    Settings: Settings,
    Shop: Shop,

    Balance: Balance,
    Bank: Bank,
    Cooldowns: Cooldowns,
    History: History,
    Inventory: Inventory,
    Items: Items,
    Rewards: Rewards
}