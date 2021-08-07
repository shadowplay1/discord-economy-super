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

/**
* The Economy class.
*/
declare class Economy extends Emitter {

    /**
     * Module ready status.
     * @type {?Boolean}
     */
    public ready: Boolean

    /**
     * Economy errored status.
     * @type {?Boolean}
     */
    public errored: Boolean

    /**
    * Module version.
    * @type {String}
    */
    public version: String

    /**
     * Link to the module's documentation website.
     * @type {String}
     */
    public docs: String

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
    public interval: null

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
    * Bank balance methods object.
    * @type {CooldownManager}
    */
    public cooldowns: CooldownManager

    /**
     * Kills the Economy instance.
     * @returns {Economy} Economy instance.
     */
    public kill(): Economy

    /**
     * Starts the module.
     * @returns {Promise<Boolean>} If started successfully: true; else: Error instance.
    */
    public init(): Promise<Boolean>

    /**
     * Initializates the module.
     * @returns {Promise<true | Error>} If started successfully: true; else: Error instance.
     * @private
    */
    private _init(): Promise<true | Error>
}


export = Economy