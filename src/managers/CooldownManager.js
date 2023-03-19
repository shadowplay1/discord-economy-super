const EconomyError = require('../classes/util/EconomyError')
const errors = require('../structures/errors')

const ms = require('../structures/ms')
const parse = require('../structures/timeParser.js')


/**
* Cooldown manager methods class.
*/
class CooldownManager {

    /**
      * Cooldown Manager.
      * @param {object} options Economy configuration.
      * @param {string} options.storagePath Full path to a JSON file. Default: './storage.json'.
      * @param {number} options.dailyCooldown Cooldown for Daily Reward (in ms). Default: 24 hours (60000 * 60 * 24 ms)
      * @param {number} options.workCooldown Cooldown for Work Reward (in ms). Default: 1 hour (60000 * 60 ms)
      * @param {number} options.dailyAmount Amount of money for Daily Reward. Default: 100.
      * @param {number} options.weeklyCooldown
      * Cooldown for Weekly Reward (in ms). Default: 7 days (60000 * 60 * 24 * 7 ms)
      *
      * @param {number} options.weeklyAmount Amount of money for Weekly Reward. Default: 1000.
      * @param {number | number[]} options.workAmount Amount of money for Work Reward. Default: [10, 50].
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
     * Gets user's daily cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {number} Cooldown end timestamp
     */
    getDaily(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const cooldown = this.database.fetch(`${guildID}.${memberID}.dailyCooldown`)
        return cooldown
    }

    /**
     * Gets user's work cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {number} Cooldown end timestamp
     */
    getWork(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const cooldown = this.database.fetch(`${guildID}.${memberID}.workCooldown`)
        return cooldown
    }

    /**
     * Gets user's daily cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {number} Cooldown end timestamp
     */
    getWeekly(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const cooldown = this.database.fetch(`${guildID}.${memberID}.weeklyCooldown`)
        return cooldown
    }

    /**
     * Gets user's monthly cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<number>} Cooldown end timestamp
     */
    getMonthly(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const cooldown = this.database.fetch(`${guildID}.${memberID}.monthlyCooldown`)
        return cooldown
    }

    /**
     * Gets user's hourly cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<number>} Cooldown end timestamp
     */
    getHourly(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const cooldown = this.database.fetch(`${guildID}.${memberID}.hourlyCooldown`)
        return cooldown
    }


    /**
     * Gets all the user's cooldowns.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {CooldownsTimeObject} User's cooldowns object.
     */
    getAll(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const rawUserObject = this.database.fetch(`${guildID}.${memberID}`)
        const settings = this.database.fetch(`${guildID}.settings`)

        const result = {}

        const cooldownsConfiguration = {
            daily: settings?.dailyCooldown || this.options.dailyCooldown,
            work: settings?.workCooldown || this.options.workCooldown,
            weekly: settings?.weeklyCooldown || this.options.weeklyCooldown,
            monthly: settings?.monthlyCooldown || this.options.monthlyCooldown,
            hourly: settings?.hourlyCooldown || this.options.hourlyCooldown
        }

        const rawCooldownsObject = {
            daily: rawUserObject?.dailyCooldown || 0,
            work: rawUserObject?.workCooldown || 0,
            weekly: rawUserObject?.weeklyCooldown || 0,
            monthly: rawUserObject?.monthlyCooldown || 0,
            hourly: rawUserObject?.hourlyCooldown || 0
        }

        for (const [rewardType, userCooldown] of Object.entries(rawCooldownsObject)) {
            const rewardCooldown = cooldownsConfiguration[rewardType]
            const cooldownEndTime = rewardCooldown - (Date.now() - userCooldown)

            const cooldownObject = userCooldown ? {
                time: parse(cooldownEndTime),
                pretty: ms(cooldownEndTime),
                endTimestamp: userCooldown
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
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const results = [
            this.clearDaily(memberID, guildID),
            this.clearWork(memberID, guildID),
            this.clearWeekly(memberID, guildID),
            this.clearMonthly(memberID, guildID),
            this.clearHourly(memberID, guildID)
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
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
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
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
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
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        return this.database.delete(`${guildID}.${memberID}.weeklyCooldown`)
    }

    /**
     * Clears user's monthly cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {boolean} If cleared: true; else: false
     */
    clearMonthly(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        return this.database.delete(`${guildID}.${memberID}.monthlyCooldown`)
    }

    /**
     * Clears user's hourly cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {boolean} If cleared: true; else: false
     */
    clearHourly(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        return this.database.delete(`${guildID}.${memberID}.hourlyCooldown`)
    }
}

/**
 * Cooldown manager class.
 * @type {CooldownManager}
 */
module.exports = CooldownManager

/**
 * @typedef {object} CooldownsTimeObject
 * @property {number} daily Cooldown for Daily Reward.
 * @property {number} work Cooldown for Work Reward.
 * @property {number} weekly Cooldown for Weekly Reward.
 * @property {number} monthly Cooldown for Monthly Reward.
 * @property {number} hourly Cooldown for Hourly Reward.
 */
