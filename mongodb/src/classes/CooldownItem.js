const CooldownManager = require('../managers/CooldownManager')

/**
* Cooldown item class.
*/
class CooldownItem {

    /**
     * User cooldowns class.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} ecoOptions Economy configuration.
     * @param {CooldownsObject} cooldownsObject User cooldowns object.
     * @param {DatabaseManager} database Database manager.
     * @param {CacheManager} cache Cache manager.
     */
    constructor(guildID, memberID, ecoOptions, cooldownsObject, database, cache) {

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
         * Cooldown Manager.
         * @type {CooldownManager}
         * @private
         */
        this.cooldowns = new CooldownManager(ecoOptions, database, cache)

        /**
         * Daily cooldown.
         * @type {number}
         */
        this.daily = cooldownsObject.daily || 0

        /**
         * Work cooldown.
         * @type {number}
         */
        this.work = cooldownsObject.work || 0

        /**
         * Weekly cooldown.
         * @type {number}
         */
        this.weekly = cooldownsObject.weekly || 0

        /**
         * Monthly cooldown.
         * @type {number}
         */
        this.monthly = cooldownsObject.monthly || 0

        /**
         * Hourly cooldown.
         * @type {number}
         */
        this.hourly = cooldownsObject.hourly || 0
    }

    /**
      * Clears user's daily cooldown.
      * @returns {Promise<boolean>} If cleared: true; else: false
      */
    clearDaily() {
        return this.cooldowns.clearDaily(this.guildID, this.memberID)
    }

    /**
     * Clears user's work cooldown.
     * @returns {Promise<boolean>} If cleared: true; else: false
     */
    clearWork() {
        return this.cooldowns.clearWork(this.guildID, this.memberID)
    }

    /**
     * Clears user's weekly cooldown.
     * @returns {Promise<boolean>} If cleared: true; else: false
     */
    clearWeekly() {
        return this.cooldowns.clearWeekly(this.guildID, this.memberID)
    }

    /**
     * Clears user's monthly cooldown.
     * @returns {Promise<boolean>} If cleared: true; else: false
     */
    clearMonthly() {
        return this.cooldowns.clearMonthly(this.guildID, this.memberID)
    }

    /**
     * Clears user's hourly cooldown.
     * @returns {Promise<boolean>} If cleared: true; else: false
     */
    clearHourly() {
        return this.cooldowns.clearHourly(this.guildID, this.memberID)
    }
}


/**
 * Cooldowns object (in ms).
 * @typedef {Object} CooldownsObject
 * @property {number} daily Daily cooldown.
 * @property {number} work Work cooldown.
 * @property {number} weekly Weekly cooldown.
 * @property {number} monthly Monthly cooldown.
 * @property {number} hourly Weekly cooldown.
 */

module.exports = CooldownItem
