import EconomyOptions from './interfaces/EconomyOptions'

import Emitter from './classes/Emitter'
import EconomyError from './classes/EconomyError'

import BalanceManager from './managers/BalanceManager'
import BankManager from './managers/BankManager'
import UtilsManager from './managers/UtilsManager'
import FetchManager from './managers/FetchManager'
import DatabaseManager from './managers/DatabaseManager'
import ShopManager from './managers/ShopManager'
import RewardManager from './managers/RewardManager'
import CooldownManager from './managers/CooldownManager'
import SettingsManager from './managers/SettingsManager'


/**
* The Economy class.
*/
declare class Economy extends Emitter {
    constructor(options: EconomyOptions)
    
    /**
     * Module ready status.
     * @type {?boolean}
     */
    public ready: boolean

    /**
     * Economy errored status.
     * @type {?boolean}
     */
    public errored: boolean

    /**
    * Module version.
    * @type {string}
    */
    public version: string

    /**
     * Link to the module's documentation website.
     * @type {string}
     */
    public docs: string

    /**
    * Utils manager methods object.
    * @type {UtilsManager}
    */
    public utils: UtilsManager

    /**
     * Constructor options object.
     * @type {?EconomyOptions}
     */
    public options: EconomyOptions

    /**
     * Database checking interval.
     * @type {?NodeJS.Timeout}
    */
    public interval: NodeJS.Timeout

    /**
     * Economy error class.
     * @type {EconomyError}
     */
    public EconomyError: EconomyError

    /**
    * Balance methods object.
    * @type {BalanceManager}
    */
    public balance: BalanceManager

    /**
    * Bank balance methods object.
    * @type {BankManager}
    */
    public bank: BankManager

    /**
    * Fetch manager methods object.
    * @type {FetchManager}
    */
    public fetcher: FetchManager

    /**
    * Database manager methods object.
    * @type {DatabaseManager}
    */
    public database: DatabaseManager

    /**
    * Shop manager methods object.
    * @type {ShopManager}
    */
    public shop: ShopManager

    /**
    * Balance methods object.
    * @type {RewardManager}
    */
    public rewards: RewardManager

    /**
    * Cooldown methods object.
    * @type {CooldownManager}
    */
    public cooldowns: CooldownManager

    /**
    * Settings methods object.
    * @type {SettingsManager}
    */
    public settings: SettingsManager

    /**
     * Kills the Economy instance.
     * @returns {Economy} Economy instance.
     */
    public kill(): Economy

    /**
     * Starts the module.
     * @returns {Promise<boolean>} If started successfully: true; else: Error instance.
    */
    public init(): Promise<boolean>

    /**
     * Initializates the module.
     * @returns {Promise<boolean>} If started successfully: true; else: Error instance.
     * @private
    */
    private _init(): Promise<boolean>

    /**
     * Initializates the module.
     * @returns {Promise<true | Error>} If started successfully: true; else: Error instance.
     * @private
    */
    private start(): boolean
}

export = Economy