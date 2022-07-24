import CacheManager from '../managers/CacheManager'
import DatabaseManager from '../managers/DatabaseManager'

/**
* Cooldown item class.
*/
declare class CooldownItem {

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
        cooldownsObject: RawEconomyUser,
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
     * Daily cooldown.
     * @type {number}
     */
    public daily: number

    /**
     * Work cooldown.
     * @type {number}
     */
    public work: number

    /**
     * Weekly cooldown.
     * @type {number}
     */
    public weekly: number
}

export = CooldownItem