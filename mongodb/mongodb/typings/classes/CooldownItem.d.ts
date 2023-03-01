import EconomyConfiguration from '../interfaces/EconomyConfiguration'
import DatabaseManager from '../managers/DatabaseManager'


/**
* Cooldown item class.
*/
declare class CooldownItem {

    /**
     * User cooldowns class.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} ecoOptions Economy configuration.
     * @param {CooldownsObject} cooldownsObject User cooldowns object.
     * @param {DatabaseManager} database Database manager.
     */
    public constructor(
        guildID: string,
		memberID: string,
        ecoOptions: EconomyConfiguration,
        cooldownsObject: {
            daily: number
            work: number
            weekly: number
        },
        database: DatabaseManager
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
