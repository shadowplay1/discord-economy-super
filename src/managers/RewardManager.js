const ms = require('../structures/ms')

const EconomyError = require('../classes/util/EconomyError')
const errors = require('../structures/errors')

const BalanceManager = require('./BalanceManager')
const CooldownManager = require('./CooldownManager')

const RewardType = {
    DAILY: 0,
    WORK: 1,
    WEEKLY: 2
}

const parse = ms => ({
    days: Math.floor(ms / 86400000),
    hours: Math.floor(ms / 3600000 % 24),
    minutes: Math.floor(ms / 60000 % 60),
    seconds: Math.floor(ms / 1000 % 60),
    milliseconds: Math.floor(ms % 1000)
})


/**
* Reward manager methods class.
*/
class RewardManager {

    /**
      * Reward Manager.
      * @param {object} options Economy configuration.
      * @param {string} options.storagePath Full path to a JSON file. Default: './storage.json'.
      * @param {number} options.dailyCooldown Cooldown for Daily Command (in ms). Default: 24 hours (60000 * 60 * 24 ms)
      * @param {number} options.workCooldown Cooldown for Work Command (in ms). Default: 1 hour (60000 * 60 ms)
      * @param {number} options.dailyAmount Amount of money for Daily Command. Default: 100.
      * @param {number} options.weeklyCooldown
      * Cooldown for Weekly Command (in ms). Default: 7 days (60000 * 60 * 24 * 7 ms)
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
        * Database manager methods class.
        * @type {DatabaseManager}
        * @private
        */
        this.database = database

        /**
         * Cooldown manager methods class.
         * @type {CooldownManager}
         * @private
         */
        this.cooldowns = new CooldownManager(options, database)

        /**
         * Balance manager methods class.
         * @type {BalanceManager}
         * @private
         */
        this.balance = new BalanceManager(options)
    }

    /**
     * Adds a reward on user's balance.
     * @param {RewardType} reward Reward to give.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why the money was added.
     * @returns {RewardData} Daily reward object.
    */
    receive(reward, memberID, guildID, reason) {
        const rewardTypes = ['daily', 'work', 'weekly']

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        if (isNaN(reward) || !rewardTypes[reward]) {
            throw new EconomyError(
                errors.invalidType('reward', 'key of RewardType enum', typeof reward),
                'INVALID_TYPE'
            )
        }

        switch (reward) {
            case RewardType.DAILY:
                return this.getDaily(memberID, guildID, reason)

            case RewardType.WORK:
                return this.getWork(memberID, guildID, reason)

            case RewardType.WEEKLY:
                return this.getWeekly(memberID, guildID, reason)

            default:
                throw new EconomyError(
                    errors.invalidType('reward', 'key of RewardType enum', typeof reward),
                    'INVALID_TYPE'
                )
        }
    }

    /**
     * Adds a daily reward on user's balance.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why the money was added. Default: 'claimed the daily reward'.
     * @returns {RewardData} Daily reward object.
    */
    getDaily(memberID, guildID, reason = 'claimed the daily reward') {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const cooldown = this.database.get(`${guildID}.settings.dailyCooldown`)
            || this.options.dailyCooldown

        const defaultDailyReward = this.database.get(`${guildID}.settings.dailyAmount`)
            || this.options.dailyAmount

        let reward

        if (Array.isArray(defaultDailyReward)) {
            const [min, max] = defaultDailyReward

            if (defaultDailyReward.length == 1) reward = min
            else reward = Math.floor(Math.random() * (Number(min) - Number(max)) + Number(max))
        }


        else reward = defaultDailyReward

        const userCooldown = this.cooldowns.getDaily(memberID, guildID)
        const cooldownEndTimestamp = cooldown - (Date.now() - userCooldown)

        if (userCooldown !== null && cooldownEndTimestamp > 0) {
            return {
                type: 'daily',
                status: false,

                cooldown: {
                    time: parse(cooldownEndTimestamp),
                    pretty: ms(cooldownEndTimestamp),
                    timestamp: cooldownEndTimestamp
                },

                reward: null,
                defaultReward: defaultDailyReward
            }
        }

        this.balance.add(reward, memberID, guildID, reason)
        this.database.set(`${guildID}.${memberID}.dailyCooldown`, Date.now())

        return {
            type: 'daily',
            status: true,
            cooldown: null,
            reward,
            defaultReward: defaultDailyReward
        }
    }

    /**
     * Adds a work reward on user's balance.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why the money was added. Default: 'claimed the work reward'.
     * @returns {RewardData} Work reward object.
     */
    getWork(memberID, guildID, reason = 'claimed the work reward') {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const cooldown = this.database.get(`${guildID}.settings.workCooldown`)
            || this.options.workCooldown

        const defaultWorkReward = this.database.get(`${guildID}.settings.workAmount`)
            || this.options.workAmount

        let reward

        if (Array.isArray(defaultWorkReward)) {
            const [min, max] = defaultWorkReward

            if (defaultWorkReward.length == 1) reward = min
            else reward = Math.floor(Math.random() * (Number(min) - Number(max)) + Number(max))
        }

        else reward = defaultWorkReward

        const userCooldown = this.cooldowns.getWork(memberID, guildID)
        const cooldownEndTimestamp = cooldown - (Date.now() - userCooldown)

        if (userCooldown !== null && cooldownEndTimestamp > 0) {
            return {
                type: 'work',
                status: false,

                cooldown: {
                    time: parse(cooldownEndTimestamp),
                    pretty: ms(cooldownEndTimestamp),
                    timestamp: cooldownEndTimestamp,
                },

                reward: null,
                defaultReward: defaultWorkReward
            }
        }

        this.balance.add(reward, memberID, guildID, reason)
        this.database.set(`${guildID}.${memberID}.workCooldown`, Date.now())

        return {
            type: 'work',
            status: true,
            cooldown: null,
            reward,
            defaultReward: defaultWorkReward
        }
    }

    /**
     * Adds a weekly reward on user's balance.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why the money was added. Default: 'claimed the weekly reward'.
     * @returns {RewardData} Weekly reward object.
     */
    getWeekly(memberID, guildID, reason = 'claimed the weekly reward') {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const cooldown = this.database.get(`${guildID}.settings.weeklyCooldown`)
            || this.options.weeklyCooldown

        const defaultWeeklyReward = this.database.get(`${guildID}.settings.weeklyAmount`)
            || this.options.weeklyAmount

        let reward

        if (Array.isArray(defaultWeeklyReward)) {
            const [min, max] = defaultWeeklyReward

            if (defaultWeeklyReward.length == 1) reward = min
            else reward = Math.floor(Math.random() * (Number(min) - Number(max)) + Number(max))
        }

        else reward = defaultWeeklyReward

        const userCooldown = this.cooldowns.getWeekly(memberID, guildID)
        const cooldownEndTimestamp = cooldown - (Date.now() - userCooldown)

        if (userCooldown !== null && cooldownEndTimestamp > 0) {
            return {
                type: 'weekly',
                status: false,

                cooldown: {
                    time: parse(cooldownEndTimestamp),
                    pretty: ms(cooldownEndTimestamp),
                    timestamp: cooldownEndTimestamp,
                },

                reward: null,
                defaultReward: defaultWeeklyReward
            }
        }

        this.balance.add(reward, memberID, guildID, reason)
        this.database.set(`${guildID}.${memberID}.weeklyCooldown`, Date.now())

        return {
            type: 'weekly',
            status: true,
            cooldown: null,
            reward,
            defaultReward: defaultWeeklyReward
        }
    }
}

/**
 * @typedef {object} RewardData
 * @property {'daily' | 'work' | 'weekly'} type Type of the operation.
 * @property {boolean} status The status of operation.
 * @property {CooldownData} cooldown Cooldown object.
 * @property {number} reward Amount of money that the user received.
 * @property {number} defaultReward Reward that was specified in a module configuration.
 */

/**
 * @typedef {object} TimeData
 * @property {number} days Amount of days until the cooldown ends.
 * @property {number} hours Amount of hours until the cooldown ends.
 * @property {number} minutes Amount of minutes until the cooldown ends.
 * @property {number} seconds Amount of seconds until the cooldown ends.
 * @property {number} milliseconds Amount of milliseconds until the cooldown ends.
 */

/**
 * @typedef {object} CooldownData
 * @property {TimeData} time A time object with the remaining time until the cooldown ends.
 * @property {string} pretty A formatted string with the remaining time until the cooldown ends.
 * @property {number} timestamp Cooldown end timestamp.
 */

/**
 * Reward manager class.
 * @type {RewardManager}
 */
module.exports = RewardManager
