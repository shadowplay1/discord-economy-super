import EconomyOptions from '../interfaces/EconomyOptions'

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
     * @param {EconomyOptions} ecoOptions Economy configuration.
     * @param {any} guildObject Economy guild object.
     */
    public constructor(id: string, ecoOptions: EconomyOptions, guildObject: any, database: DatabaseManager)


    /**
    * Guild user manager.
    */
    public users: UserManager<false>

    /**
    * Guild ID.
    */
    public id: string

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
     * @returns {Promise<EconomyGuild>} Deleted guild object.
     */
    public delete(): Promise<EconomyGuild>

    /**
     * Sets the default guild object for the specified member.
     * @returns {Promise<boolean>} If reset successfully: true; else: false.
     */
    public reset(): Promise<boolean>
}

export = EconomyGuild
