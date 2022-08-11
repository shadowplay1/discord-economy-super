import If from './interfaces/If'
import EconomyOptions from './interfaces/EconomyOptions'

import Emitter from './classes/util/Emitter'
import EconomyError from './classes/util/EconomyError'

import BalanceManager from './managers/BalanceManager'
import BankManager from './managers/BankManager'

import UtilsManager from './managers/UtilsManager'
import DatabaseManager from './managers/DatabaseManager'

import ShopManager from './managers/ShopManager'
import InventoryManager from './managers/InventoryManager'

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
    public constructor(options?: EconomyOptions)


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
     * @type {EconomyOptions}
     */
    public readonly options: EconomyOptions

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
    * Balance.
    * @type {?BalanceManager}
    */
    public readonly balance: If<Ready, BalanceManager>

    /**
    * Bank balance.
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
    * Balance.
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
    * Economy guild settings.
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