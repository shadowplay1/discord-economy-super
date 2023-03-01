import EconomyConfiguration from '../interfaces/EconomyConfiguration'
import RawEconomyUser from '../interfaces/RawEconomyUser'

import DatabaseManager from '../managers/DatabaseManager'
import CacheManager from '../managers/CacheManager'

import UtilsManager from '../managers/UtilsManager'

import ShopManager from '../managers/ShopManager'
import UserManager from '../managers/UserManager'

import Shop from './guild/Shop'
import Leaderboards from './guild/Leaderboards'

import Settings from './guild/Settings'

import EconomyUser from './EconomyUser'
import Currency from './Currency'


declare class EconomyGuild {

    /**
     * Economy guild class.
     * @param {string} id Guild ID.
     * @param {EconomyConfiguration} ecoOptions Economy configuration.
     * @param {any} guildObject Economy guild object.
     * @param {DatabaseManager} database Database manager.
     * @param {CacheManager} cache Cache manager.
     */
    public constructor(
        id: string,
        ecoOptions: EconomyConfiguration,
        guildObject: {
            [userID: string]: RawEconomyUser
        },
        database: DatabaseManager,
        cache: CacheManager
    )


    /**
    * Guild user manager.
    */
    public users: UserManager<false>

    /**
    * Guild ID.
    */
    public id: string

    /**
     * Determine if the guild exists in the database.
     */
    public exists: boolean

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
     * Guild currencies array.
     * @type {Currency[]}
     */
    public currencies: Currency[]

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
     * @returns {Promise<EconomyGuild>} Deleted guild object.
     */
    public delete(): Promise<EconomyGuild>

    /**
     * Sets the default guild object for the specified member.
     * @returns {Promise<boolean>} If reset successfully: true; else: false.
     */
    public reset(): Promise<boolean>

    /**
     * Creates an economy guild object in database.
     * @returns {Promise<boolean>} If created successfully: true; else: false.
     */
    public create(): Promise<boolean>

    /**
     * Converts the economy guild to string.
     * @returns {string} String representation of economy guild.
     */
    public toString(): string
}

export = EconomyGuild
