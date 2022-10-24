const CacheManager = require('../managers/CacheManager')


/**
* Cooldown item class.
*/
class CooldownItem {

    /**
     * User cooldowns class.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyOptions} ecoOptions Economy configuration.
     * @param {CooldownsObject} cooldownsObject User cooldowns object.
     * @param {DatabaseManager} database Database manager.
     */
    constructor(memberID, guildID, ecoOptions, cooldownsObject, database) {

        /**
         * Member ID.
         * @type {string}
         */
        this.memberID = memberID

        /**
         * Guild ID.
         * @type {string}
         */
        this.guildID = guildID


        /**
         * Daily cooldown.
         * @type {number}
         */
        this.daily = cooldownsObject.daily

        /**
         * Work cooldown.
         * @type {number}
         */
        this.work = cooldownsObject.work

        /**
         * Weekly cooldown.
         * @type {number}
         */
        this.weekly = cooldownsObject.weekly
    }
}


/**
 * Cooldowns object (in ms).
 * @typedef {Object} CooldownsObject
 * @property {number} daily Daily cooldown.
 * @property {number} work Work cooldown.
 * @property {number} weekly Weekly cooldown.
 */

module.exports = CooldownItem
