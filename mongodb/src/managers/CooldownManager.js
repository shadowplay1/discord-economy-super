const EconomyError = require('../classes/util/EconomyError')
const errors = require('../structures/errors')

const ms = require('../../structures/ms')
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
     * Gets a user's daily cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<number>} Cooldown end timestamp
     */
    async getDaily(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const cooldown = await this.database.fetch(`${guildID}.${memberID}.dailyCooldown`)
        return cooldown
    }

    /**
     * Gets a user's work cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<number>} Cooldown end timestamp
     */
    async getWork(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const cooldown = await this.database.fetch(`${guildID}.${memberID}.workCooldown`)
        return cooldown
    }

    /**
     * Gets a user's daily cooldown.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<number>} Cooldown end timestamp
     */
    async getWeekly(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const cooldown = await this.database.fetch(`${guildID}.${memberID}.weeklyCooldown`)
        return cooldown
    }

    /**
     * Gets all the user's cooldowns.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<CooldownsTimeObject>} User's cooldowns object.
     */
    async getAll(memberID, guildID) {
        const rawUserObject = await this.database.fetch(`${guildID}.${memberID}`)
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
     * @returns {Promise<boolean>} If all cooldowns were cleared successfully: true, else: false.
     */
    async clearAll(memberID, guildID) {
        const results = [
            await this.clearDaily(memberID, guildID),
            await this.clearWork(memberID, guildID),
            await this.clearWeekly(memberID, guildID)
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
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
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
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
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
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const result = await this.database.delete(`${guildID}.${memberID}.weeklyCooldown`)

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
 * @property {CooldownData} daily Cooldown for Daily Command.
 * @property {CooldownData} work Cooldown for Work Command.
 * @property {CooldownData} weekly Cooldown for Weekly Command.
 */
