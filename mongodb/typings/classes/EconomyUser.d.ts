import EconomyConfiguration from '../interfaces/EconomyConfiguration'

import DatabaseManager from '../managers/DatabaseManager'
import CacheManager from '../managers/CacheManager'

import UtilsManager from '../managers/UtilsManager'
import ShopManager from '../managers/ShopManager'

import Balance from './user/Balance'
import Bank from './user/Bank'

import Inventory from './user/Inventory'
import History from './user/History'
import Items from '../classes/user/Items'

import Cooldowns from './user/Cooldowns'
import Rewards from './user/Rewards'

import RawEconomyUser from '../interfaces/RawEconomyUser'


declare class EconomyUser {

    /**
     * Economy user class.
     * @param {string} id User ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} ecoOptions Economy configuration.
     * @param {RawEconomyUser} userObject Economy user object.
     * @param {DatabaseManager} database Database manager.
     * @param {CacheManager} cache Cache manager.
     */
    public constructor(
        id: string,
        guildID: string,
        ecoOptions: EconomyConfiguration,
        userObject: RawEconomyUser,
        database: DatabaseManager,
        cache: CacheManager
    )


    /**
    * User ID.
    * @type {string}
    */
    public id: string

    /**
     * Guild ID.
     * @type {string}
     */
    public guildID: string

    /**
     * User's balance.
     * @type {number}
     */
    public money: number

    /**
     * Determine if the user exists in the database.
     * @type {boolean}
     */
    public exists: boolean

    /**
     * Database Manager.
     * @type {DatabaseManager}
     * @private
     */
    private database: DatabaseManager

    /**
     * Utils Manager.
     * @type {UtilsManager}
     * @private
     */
    private _utils: UtilsManager

    /**
     * Shop Manager.
     * @type {ShopManager}
     * @private
     */
    private _shop: ShopManager

    /**
     * User's cooldowns info.
     * @type {Cooldowns}
     */
    public cooldowns: Cooldowns

    /**
     * User's history info.
     * @type {History}
     */
    public history: History

    /**
     * User's inventory info.
     * @type {Inventory}
     */
    public inventory: Inventory

    /**
     * User's balance info.
     * @type {Balance}
     */
    public balance: Balance

    /**
     * User's bank balance info.
     * @type {Bank}
     */
    public bank: Bank

    /**
     * User's bank balance info.
     * @type {Rewards}
     */
    public rewards: Rewards

    /**
     * User items manager.
     */
    public items: Items

    /**
     * Deletes the user from database.
     * @returns {EconomyUser} Deleted user object.
     */
    public delete(): EconomyUser

    /**
     * Sets the default user object for the specified member.
     * @returns {Promise<boolean>} If reset successfully: true; else: false.
     */
    public reset(): Promise<boolean>

	/**
	 * Creates an economy user object in database.
	 * @returns {Promise<boolean>} If created successfully: true, else: false.
	 */
	public create(): Promise<boolean>

    /**
     * Converts the economy user to string.
     * @returns {string} String representation of economy user.
     */
    public toString(): string
}

export = EconomyUser
