const EconomyError = require('../classes/util/EconomyError')

const DatabaseManager = require('./DatabaseManager')
const CacheManager = require('./CacheManager')

const errors = require('../structures/errors')


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
         * @type {EconomyOptions}
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
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
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
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
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
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
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
     * Clears user's daily cooldown.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {Promise<boolean>} If cleared: true; else: false
     */
    async clearDaily(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const result = await this.database.remove(`${guildID}.${memberID}.dailyCooldown`)
        return result
    }

    /**
     * Clears user's work cooldown.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {Promise<boolean>} If cleared: true; else: false
     */
    async clearWork(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const result = await this.database.remove(`${guildID}.${memberID}.workCooldown`)
        return result
    }

    /**
     * Clears user's weekly cooldown.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {Promise<boolean>} If cleared: true; else: false
     */
    async clearWeekly(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const result = await this.database.remove(`${guildID}.${memberID}.weeklyCooldown`)
        return result
    }
}

/**
 * Cooldown manager class.
 * @type {CooldownManager}
 */
module.exports = CooldownManager