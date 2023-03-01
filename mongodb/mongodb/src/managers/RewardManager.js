const ms = require('../structures/ms')

const Emitter = require('../classes/util/Emitter')

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
* @extends {Emitter}
*/
class RewardManager extends Emitter {
    /**
     * Reward Manager.
     * @param {object} options Economy configuration.
     * @param {DatabaseManager} database Database manager.
     * @param {CacheManager} cache Cache manager.
     */
    constructor(options, database, cache) {
        super()

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
         * Cooldown manager.
         * @type {CooldownManager}
         * @private
         */
        this.cooldowns = new CooldownManager(options, database, cache)

        /**
         * Balance manager.
         * @type {BalanceManager}
         * @private
         */
        this.balance = new BalanceManager(options, database, cache)

        /**
         * Cache manager.
         * @type {CacheManager}
         * @private
         */
        this.cache = cache
    }

    /**
     * Adds a reward on user's balance.
     * @param {RewardType} reward Reward to give.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why the money was added.
     * @returns {Promise<RewardData>} Daily reward object.
    */
    async receive(reward, memberID, guildID, reason) {
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
     * @returns {Promise<RewardData>} Daily reward object.
    */
    async getDaily(memberID, guildID, reason = 'claimed the daily reward') {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const settings = await this.database.get(`${guildID}.settings`)

        const [cooldown, defaultDailyReward] = [
            settings?.dailyCooldown || this.options.dailyCooldown,
            settings?.dailyAmount || this.options.dailyAmount
        ]


        let reward

        if (Array.isArray(defaultDailyReward)) {
            const [min, max] = defaultDailyReward

            if (defaultDailyReward.length == 1) reward = min
            else reward = Math.floor(Math.random() * (Number(min) - Number(max)) + Number(max))
        }


        else reward = defaultDailyReward

        const userCooldown = await this.database.get(`${guildID}.${memberID}.dailyCooldown`) || 0
        const cooldownEnd = cooldown - (Date.now() - userCooldown)

        if (userCooldown !== null && cooldownEnd > 0) {
            return {
                type: 'daily',
                status: false,
                cooldown: {
                    time: parse(cooldownEnd),
                    pretty: ms(cooldownEnd)
                },

                reward: null,
                defaultReward: defaultDailyReward
            }
        }

        await this.database.set(`${guildID}.${memberID}.dailyCooldown`, Date.now())
        await this.balance.add(reward, memberID, guildID, reason)

        this.cache.updateMany(['users', 'cooldowns', 'balance'], {
            memberID,
            guildID
        })

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
     * @returns {Promise<RewardData>} Work reward object.
     */
    async getWork(memberID, guildID, reason = 'claimed the work reward') {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const settings = await this.database.get(`${guildID}.settings`)

        const [cooldown, defaultWorkReward] = [
            settings?.workCooldown || this.options.workCooldown,
            settings?.workAmount || this.options.workAmount
        ]

        let reward

        if (Array.isArray(defaultWorkReward)) {
            const [min, max] = defaultWorkReward

            if (defaultWorkReward.length == 1) reward = min
            else reward = Math.floor(Math.random() * (Number(min) - Number(max)) + Number(max))
        }

        else reward = defaultWorkReward

        const userCooldown = await this.database.get(`${guildID}.${memberID}.workCooldown`) || 0
        const cooldownEnd = cooldown - (Date.now() - userCooldown)

        if (userCooldown !== null && cooldownEnd > 0) {
            return {
                type: 'work',
                status: false,
                cooldown: {
                    time: parse(cooldownEnd),
                    pretty: ms(cooldownEnd),
                },

                reward: null,
                defaultReward: defaultWorkReward
            }
        }

        await this.database.set(`${guildID}.${memberID}.workCooldown`, Date.now())
        await this.balance.add(reward, memberID, guildID, reason)

        this.cache.updateMany(['users', 'cooldowns', 'balance'], {
            memberID,
            guildID
        })

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
     * @returns {Promise<RewardData>} Weekly reward object.
     */
    async getWeekly(memberID, guildID, reason = 'claimed the weekly reward') {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const settings = await this.database.get(`${guildID}.settings`)

        const [cooldown, defaultWeeklyReward] = [
            settings?.weeklyCooldown || this.options.weeklyCooldown,
            settings?.weeklyAmount || this.options.weeklyAmount
        ]

        let reward

        if (Array.isArray(defaultWeeklyReward)) {
            const [min, max] = defaultWeeklyReward

            if (defaultWeeklyReward.length == 1) reward = min
            else reward = Math.floor(Math.random() * (Number(min) - Number(max)) + Number(max))
        }

        else reward = defaultWeeklyReward

        const userCooldown = await this.database.get(`${guildID}.${memberID}.weeklyCooldown`) || 0
        const cooldownEnd = cooldown - (Date.now() - userCooldown)

        if (userCooldown !== null && cooldownEnd > 0) {
            return {
                type: 'weekly',
                status: false,
                cooldown: {
                    time: parse(cooldownEnd),
                    pretty: ms(cooldownEnd),
                },

                reward: null,
                defaultReward: defaultWeeklyReward
            }
        }

        await this.database.set(`${guildID}.${memberID}.weeklyCooldown`, Date.now())
        await this.balance.add(reward, memberID, guildID, reason)

        this.cache.updateMany(['users', 'cooldowns', 'balance'], {
            memberID,
            guildID
        })

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
 */

/**
 * Reward manager class.
 * @type {RewardManager}
 */
module.exports = RewardManager
