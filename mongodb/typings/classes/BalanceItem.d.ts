import EconomyOptions from '../interfaces/EconomyOptions'

import CacheManager from '../managers/CacheManager'
import DatabaseManager from '../managers/DatabaseManager'


/**
* Cooldown item class.
*/
declare class BalanceItem {

    /**
     * User cooldowns class.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyOptions} ecoOptions Economy configuration.
     * @param {CooldownsObject} cooldownsObject User cooldowns object.
     * @param {DatabaseManager} database Database manager.
     * @param {CacheManager} cache Cache manager.
     */
    public constructor(
        memberID: string,
        guildID: string,
        ecoOptions: EconomyOptions,
        cooldownsObject: {
            money: number
            bank: number
        },
        database: DatabaseManager,
        cache: CacheManager
    )

    /**
     * Member ID.
     * @type {string}
     */
    public memberID: string

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
     * User's bank balance.
     * @type {number}
     */
    public bank: number
}

export = BalanceItem