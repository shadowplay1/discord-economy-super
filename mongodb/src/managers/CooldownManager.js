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
      * @param {DatabaseManager} database Database manager.
      * @param {CacheManager} cache Cache manager.
     */
    constructor(options, database, cache) {


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

        /**
         * Cache manager.
         * @type {CacheManager}
         * @private
         */
        this.cache = cache
    }

    /**
     * Gets user's daily cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<number>} Cooldown end timestamp
     */
    async getDaily(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const cooldown = await this.database.fetch(`${guildID}.${memberID}.dailyCooldown`)
        return cooldown
    }

    /**
     * Gets user's work cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<number>} Cooldown end timestamp
     */
    async getWork(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const cooldown = await this.database.fetch(`${guildID}.${memberID}.workCooldown`)
        return cooldown
    }

    /**
     * Gets user's weekly cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<number>} Cooldown end timestamp
     */
    async getWeekly(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const cooldown = await this.database.fetch(`${guildID}.${memberID}.weeklyCooldown`)
        return cooldown
    }

    /**
     * Gets user's monthly cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<number>} Cooldown end timestamp
     */
    async getMonthly(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const cooldown = await this.database.fetch(`${guildID}.${memberID}.monthlyCooldown`)
        return cooldown
    }

    /**
     * Gets user's hourly cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<number>} Cooldown end timestamp
     */
    async getHourly(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const cooldown = await this.database.fetch(`${guildID}.${memberID}.hourlyCooldown`)
        return cooldown
    }

    /**
     * Gets all the user's cooldowns.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<CooldownsTimeObject>} User's cooldowns object.
     */
    async getAll(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const rawUserObject = await this.database.fetch(`${guildID}.${memberID}`)
        const settings = await this.database.fetch(`${guildID}.settings`)

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
     * @returns {Promise<boolean>} If all cooldowns were cleared successfully: true, else: false.
     */
    async clearAll(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const results = [
            await this.clearDaily(memberID, guildID),
            await this.clearWork(memberID, guildID),
            await this.clearWeekly(memberID, guildID),
            await this.clearMonthly(memberID, guildID),
            await this.clearHourly(memberID, guildID)
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
     * @returns {Promise<boolean>} If cleared: true; else: false
     */
    async clearDaily(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const result = await this.database.delete(`${guildID}.${memberID}.dailyCooldown`)

        this.cache.updateMany(['cooldowns', 'users'], {
            memberID,
            guildID
        })

        return result
    }

    /**
     * Clears user's work cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<boolean>} If cleared: true; else: false
     */
    async clearWork(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const result = await this.database.delete(`${guildID}.${memberID}.workCooldown`)

        this.cache.updateMany(['cooldowns', 'users'], {
            memberID,
            guildID
        })

        return result
    }

    /**
     * Clears user's weekly cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<boolean>} If cleared: true; else: false
     */
    async clearWeekly(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const result = await this.database.delete(`${guildID}.${memberID}.weeklyCooldown`)

        this.cache.updateMany(['cooldowns', 'users'], {
            memberID,
            guildID
        })

        return result
    }

    /**
     * Clears user's monthly cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<boolean>} If cleared: true; else: false
     */
    async clearMonthly(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const result = await this.database.delete(`${guildID}.${memberID}.monthlyCooldown`)

        this.cache.updateMany(['cooldowns', 'users'], {
            memberID,
            guildID
        })

        return result
    }

    /**
     * Clears user's hourly cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<boolean>} If cleared: true; else: false
     */
    async clearHourly(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const result = await this.database.delete(`${guildID}.${memberID}.hourlyCooldown`)

        this.cache.updateMany(['cooldowns', 'users'], {
            memberID,
            guildID
        })

        return result
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
