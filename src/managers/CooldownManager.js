const EconomyError = require('../classes/EconomyError')

const DatabaseManager = require('./DatabaseManager')

const errors = require('../structures/errors')

/**
* Cooldown manager methods class.
*/
class CooldownManager {

    /**
      * Cooldown Manager.
      * 
      * @param {Object} options Economy constructor options object.
      * There's only needed options object properties for this manager to work properly.
      * 
      * @param {String} options.storagePath Full path to a JSON file. Default: './storage.json'.
      * @param {Number} options.dailyCooldown Cooldown for Daily Command (in ms). Default: 24 Hours (60000 * 60 * 24) ms
      * @param {Number} options.workCooldown Cooldown for Work Command (in ms). Default: 1 Hour (60000 * 60) ms
      * @param {Number} options.dailyAmount Amount of money for Daily Command. Default: 100.
      * @param {Number} options.weeklyCooldown 
      * Cooldown for Weekly Command (in ms). Default: 7 Days (60000 * 60 * 24 * 7) ms
      * 
      * @param {Number} options.weeklyAmount Amount of money for Weekly Command. Default: 1000.
      * @param {Number | Array} options.workAmount Amount of money for Work Command. Default: [10, 50].
     */
    constructor(options) {

        /**
         * Economy options object.
         * @type {EconomyOptions}
         * @private
         */
        this.options = options

        /**
         * Database manager methods object.
         * @private
         * @type {DatabaseManager}
         */
        this.database = new DatabaseManager(options)
    }

    /**
     * Gets a user's daily cooldown
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Number} Cooldown end timestamp
     */
    daily(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        }

        const cooldown = this.database.fetch(`${guildID}.${memberID}.dailyCooldown`)

        return cooldown
    }

    /**
     * Gets a user's work cooldown
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Number} Cooldown end timestamp
     */
    work(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        }

        const cooldown = this.database.fetch(`${guildID}.${memberID}.workCooldown`)

        return cooldown
    }

    /**
     * Gets a user's daily cooldown
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Number} Cooldown end timestamp
     */
    weekly(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        }

        const cooldown = this.database.fetch(`${guildID}.${memberID}.weeklyCooldown`)

        return cooldown
    }

    /**
     * Clears user's daily cooldown
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared: true; else: false
     */
    clearDaily(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        }

        return this.database.remove(`${guildID}.${memberID}.dailyCooldown`)
    }

    /**
     * Clears user's work cooldown
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared: true; else: false
     */
    clearWork(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        }

        return this.database.remove(`${guildID}.${memberID}.workCooldown`)
    }

    /**
     * Clears user's weekly cooldown
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared: true; else: false
     */
    clearWeekly(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        }

        return this.database.remove(`${guildID}.${memberID}.weeklyCooldown`)
    }
}

/**
 * Cooldown manager class.
 * @type {CooldownManager}
 */
module.exports = CooldownManager