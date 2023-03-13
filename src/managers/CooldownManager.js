const EconomyError = require('./classes/util/EconomyError')
const errors = require('./structures/errors')

const ms = require('../../structures/ms')
const parse = require('../structures/timeParser.js')


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
      * @param {DatabaseManager} database Database manager.
      */
    constructor(options, database) {

        /**
         * Economy configuration.
         * @type {EconomyConfiguration}
         * @private
         */
        this.options = options

        /**
         * Database manager.
         * @type {DatabaseManager}
         * @private
         */
        this.database = database
    }

    /**
     * Gets a user's daily cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
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
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
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
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
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
     * Gets all the user's cooldowns.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {CooldownsTimeObject} User's cooldowns object.
     */
    getAll(memberID, guildID) {
        const rawUserObject = this.database.fetch(`${guildID}.${memberID}`)
        const result = {}

        const rawCooldownsObject = {
            daily: rawUserObject?.dailyCooldown || 0,
            work: rawUserObject?.workCooldown || 0,
            weekly: rawUserObject?.weeklyCooldown || 0,
        }

        for (const [rewardType, userCooldown] of Object.entries(rawCooldownsObject)) {
            const rewardCooldown = this._rewardCooldowns[rewardType]
            const cooldownEndTimestamp = rewardCooldown - (Date.now() - userCooldown)

            const cooldownObject = userCooldown ? {
                time: parse(cooldownEndTimestamp),
                pretty: ms(cooldownEndTimestamp),
                timestamp: cooldownEndTimestamp
            } : null

            result[rewardType] = cooldownObject
        }

        return result
    }

    /**
     * Clears all the user's cooldowns.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {boolean} If all cooldowns were cleared successfully: true, else: false.
     */
    clearAll(memberID, guildID) {
        const results = [
            this.clearDaily(memberID, guildID),
            this.clearWork(memberID, guildID),
            this.clearWeekly(memberID, guildID)
        ]

        if (results.some(result => !result)) {
            return false
        }

        return true
    }

    /**
     * Clears user's daily cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
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
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
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
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
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
