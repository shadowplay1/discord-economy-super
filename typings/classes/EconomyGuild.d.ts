import EconomyConfiguration from '../interfaces/EconomyConfiguration'

import DatabaseManager from '../managers/DatabaseManager'
import UtilsManager from '../managers/UtilsManager'

import ShopManager from '../managers/ShopManager'
import UserManager from '../managers/UserManager'

import Shop from './guild/Shop'
import Leaderboards from './guild/Leaderboards'

import Settings from './guild/Settings'

import EconomyUser from './EconomyUser'


declare class EconomyGuild {

    /**
     * Economy guild class.
     * @param {string} id Guild ID.
     * @param {EconomyConfiguration} ecoOptions Economy configuration.
     * @param {any} guildObject Economy guild object.
     */
    public constructor(id: string, ecoOptions: EconomyConfiguration, guildObject: any)


    /**
    * Guild user manager.
    */
    public users: UserManager<false>

    /**
    * Determine if the guild exists in the database.
    * @type {boolean}
    */
    public exists: boolean

    /**
    * Guild ID.
    */
    public id: string

    /**
     * Full path to a JSON file. Default: './storage.json'
     * @private
     */
    private storagePath: string

    /**
     * Database Manager.
     * @private
     */
    private database: DatabaseManager

    /**
     * Utils Manager.
     * @private
     */
    private utils: UtilsManager

    /**
     * Shop Manager.
     * @private
     */
    private _shop: ShopManager

    /**
     * Guild Shop.
     */
    public shop: Shop

    /**
     * Guild Leaderboards.
     */
    public leaderboards: Leaderboards

    /**
     * Guild Settings.
     */
    public settings: Settings


    /**
     * Deletes the guild from database.
     * @returns {EconomyGuild} Deleted guild object.
     */
    public delete(): EconomyGuild

    /**
     * Sets the default guild object for the specified member.
     * @returns {boolean} If reset successfully: true; else: false.
     */
    public reset(): boolean

	/**
	 * Creates an economy guild object in database.
	 * @returns {boolean} If created successfully: true; else: false.
	 */
	public create(): boolean
    
    /**
     * Converts the economy guild to string.
     * @returns {string} String representation of economy guild.
     */
    public toString(): string
}

export = EconomyGuild
