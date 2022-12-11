const EconomyError = require('../classes/util/EconomyError')

const DatabaseManager = require('./DatabaseManager')

const errors = require('../structures/errors')


/**
* Cooldown manager methods class.
*/
class CooldownManager {

    /**
      * Cooldown Manager.
      * @param {object} options Economy configuration.
      * @param {string} options.storagePath Full path to a JSON file. Default: './storage.json'.
      * @param {number} options.dailyCooldown Cooldown for Daily Command (in ms). Default: 24 hours (60000 * 60 * 24 ms)
      * @param {number} options.workCooldown Cooldown for Work Command (in ms). Default: 1 hour (60000 * 60 ms)
      * @param {number} options.dailyAmount Amount of money for Daily Command. Default: 100.
      * @param {number} options.weeklyCooldown 
      * Cooldown for Weekly Command (in ms). Default: 7 days (60000 * 60 * 24 * 7 ms)
      * 
      * @param {number} options.weeklyAmount Amount of money for Weekly Command. Default: 1000.
      * @param {number | number[]} options.workAmount Amount of money for Work Command. Default: [10, 50].
     */
    constructor(options) {


        /**
         * Economy configuration.
         * @type {EconomyConfiguration}
         * @private
         */
        this.options = options

        /**
         * Database manager.
         * @private
         * @type {DatabaseManager}
         */
        this.database = new DatabaseManager(options)
    }

    /**
     * Gets a user's daily cooldown.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {number} Cooldown end timestamp
     */
    getDaily(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const cooldown = this.database.fetch(`${guildID}.${memberID}.dailyCooldown`)
        return cooldown
    }

    /**
     * Gets a user's work cooldown.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {number} Cooldown end timestamp
     */
    getWork(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const cooldown = this.database.fetch(`${guildID}.${memberID}.workCooldown`)
        return cooldown
    }

    /**
     * Gets a user's daily cooldown.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {number} Cooldown end timestamp
     */
    getWeekly(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const cooldown = this.database.fetch(`${guildID}.${memberID}.weeklyCooldown`)
        return cooldown
    }

    /**
     * Clears user's daily cooldown.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {boolean} If cleared: true; else: false
     */
    clearDaily(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        return this.database.delete(`${guildID}.${memberID}.dailyCooldown`)
    }

    /**
     * Clears user's work cooldown.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {boolean} If cleared: true; else: false
     */
    clearWork(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        return this.database.delete(`${guildID}.${memberID}.workCooldown`)
    }

    /**
     * Clears user's weekly cooldown.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {boolean} If cleared: true; else: false
     */
    clearWeekly(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        return this.database.delete(`${guildID}.${memberID}.weeklyCooldown`)
    }
}

/**
 * Cooldown manager class.
 * @type {CooldownManager}
 */
module.exports = CooldownManager
