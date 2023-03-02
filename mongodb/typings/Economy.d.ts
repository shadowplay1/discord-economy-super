import If from './interfaces/If'
import EconomyConfiguration from './interfaces/EconomyConfiguration'

import Emitter from './classes/util/Emitter'
import EconomyError from './classes/util/EconomyError'

import BalanceManager from './managers/BalanceManager'
import BankManager from './managers/BankManager'

import UtilsManager from './managers/UtilsManager'
import DatabaseManager from './managers/DatabaseManager'

import ShopManager from './managers/ShopManager'
import InventoryManager from './managers/InventoryManager'

import CurrencyManager from './managers/CurrencyManager'

import RewardManager from './managers/RewardManager'
import CooldownManager from './managers/CooldownManager'
import HistoryManager from './managers/HistoryManager'

import UserManager from './managers/UserManager'
import GuildManager from './managers/GuildManager'

import SettingsManager from './managers/SettingsManager'
import CacheManager from './managers/CacheManager'


/**
* The Economy class.
*/
declare class Economy<Ready extends boolean = boolean> extends Emitter {
    public constructor(options?: EconomyConfiguration)


    /**
     * Module ready status.
     * @type {?boolean}
     */
    public readonly ready: boolean

    /**
     * Economy errored status.
     * @type {?boolean}
     */
    public readonly errored: boolean

    /**
    * Module version.
    * @type {string}
    */
    public readonly version: string

    /**
     * Link to the module's documentation website.
     * @type {string}
     */
    public readonly docs: string

    /**
     * Econoomy managers list. Made for optimization purposes.
     */
    public readonly managers: {
        name: string
        manager: any
    }

    /**
    * Utils manager.
    * @type {UtilsManager}
    */
    public readonly utils: If<Ready, UtilsManager>

    /**
     * Economy configuration.
     * @type {EconomyConfiguration}
     */
    public readonly options: EconomyConfiguration

    /**
     * Economy error class.
     * @type {EconomyError}
     */
    public readonly EconomyError: EconomyError

    /**
     * Emitter class.
     * @type {Emitter}
     */
    public readonly Emitter: Emitter

    /**
    * Inventory manager.
    * @type {?InventoryManager}
    */
    public readonly inventory: If<Ready, InventoryManager>

    /**
    * Cache manager.
    * @type {?CacheManager}
    */
    public readonly cache: If<Ready, CacheManager>

    /**
    * History manager.
    * @type {?HistoryManager}
    */
    public readonly history: If<Ready, HistoryManager>

    /**
    * Balance manager.
    * @type {?BalanceManager}
    */
    public readonly balance: If<Ready, BalanceManager>

    /**
    * Currency manager.
    * @type {?CurrencyManager}
    */
    public readonly currencies: If<Ready, CurrencyManager>

    /**
    * Bank balance manager.
    * @type {?BankManager}
    */
    public readonly bank: If<Ready, BankManager>

    /**
    * Database manager.
    * @type {?DatabaseManager}
    */
    public readonly database: If<Ready, DatabaseManager>

    /**
    * Shop manager.
    * @type {?ShopManager}
    */
    public readonly shop: If<Ready, ShopManager>

    /**
    * Reward manager.
    * @type {?RewardManager}
    */
    public readonly rewards: If<Ready, RewardManager>

    /**
    * Cooldown manager.
    * @type {?CooldownManager}
    */
    public readonly cooldowns: If<Ready, CooldownManager>

    /**
    * Economy users manager.
    * @type {?UserManager}
    */
    public readonly users: If<Ready, UserManager<true>>

    /**
    * Economy guilds manager.
    * @type {?GuildManager}
    */
    public readonly guilds: If<Ready, GuildManager>

    /**
    * Settings manager.
    * @type {?SettingsManager}
    */
    public readonly settings: If<Ready, SettingsManager>

    /**
     * Kills the Economy instance.
     * @returns {Economy} Economy instance.
     */
    public kill(): Economy

    /**
     * Starts the module.
     * @returns {Promise<boolean>} If started successfully: true.
    */
    public init(): Promise<boolean>

    /**
     * Connects the module to MongoDB database.
     * @returns {Promise<void>}
     * @private
     */
    private _connect(): Promise<void>

    /**
     * Initializates the module.
     * @returns {Promise<boolean>} If started successfully: true.
     * @private
    */
    private _init(): Promise<boolean>

    /**
     * Initializes the module.
     * @returns {boolean} If started successfully: true.
     * @private
    */
    private start(): boolean
}

export = Economy