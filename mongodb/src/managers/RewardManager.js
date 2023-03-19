const ms = require('../structures/ms')

const EconomyError = require('../classes/util/EconomyError')
const errors = require('../structures/errors')

const parse = require('../structures/timeParser.js')

const BalanceManager = require('./BalanceManager')
const CooldownManager = require('./CooldownManager')

const RewardType = {
    DAILY: 0,
    WORK: 1,
    WEEKLY: 2,
    MONTHLY: 3,
    HOURLY: 4
}


/**
 * Reward manager methods class.
 */
class RewardManager {

    /**
      * Reward Manager.
      * @param {object} options Economy configuration.
      * @param {string} options.storagePath Full path to a JSON file. Default: './storage.json'.
      * @param {number} options.dailyCooldown Cooldown for Daily Reward (in ms). Default: 24 hours (60000 * 60 * 24 ms)
      * @param {number} options.workCooldown Cooldown for Work Reward (in ms). Default: 1 hour (60000 * 60 ms)
      * @param {number} options.dailyAmount Amount of money for Daily Reward. Default: 100.
      * @param {number} options.weeklyCooldown
      * Cooldown for Weekly Reward (in ms). Default: 7 days (60000 * 60 * 24 * 7 ms)
      * @param {number} options.weeklyAmount Amount of money for Weekly Reward. Default: 1000.
      * @param {number | number[]} options.workAmount Amount of money for Work Reward. Default: [10, 50].
      * @param {DatabaseManager} database Database manager.
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
        const rewardTypes = ['daily', 'work', 'weekly', 'monthly', 'hourly']

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
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

            case RewardType.MONTHLY:
                return this.getMonthly(memberID, guildID, reason)

            case RewardType.HOURLY:
                return this.getHourly(memberID, guildID, reason)

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
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
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
        const cooldownEndTimestamp = cooldown - (Date.now() - userCooldown)

        if (userCooldown !== null && cooldownEndTimestamp > 0) {
            return {
                type: 'daily',
                claimed: false,

                cooldown: {
                    time: parse(cooldownEndTimestamp),
                    pretty: ms(cooldownEndTimestamp),
                    endTimestamp: cooldownEndTimestamp
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
            claimed: true,
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
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
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
        const cooldownEndTimestamp = cooldown - (Date.now() - userCooldown)

        if (userCooldown !== null && cooldownEndTimestamp > 0) {
            return {
                type: 'work',
                claimed: false,

                cooldown: {
                    time: parse(cooldownEndTimestamp),
                    pretty: ms(cooldownEndTimestamp),
                    endTimestamp: cooldownEndTimestamp,
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
            claimed: true,
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
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
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
        const cooldownEndTimestamp = cooldown - (Date.now() - userCooldown)

        if (userCooldown !== null && cooldownEndTimestamp > 0) {
            return {
                type: 'weekly',
                claimed: false,

                cooldown: {
                    time: parse(cooldownEndTimestamp),
                    pretty: ms(cooldownEndTimestamp),
                    endTimestamp: cooldownEndTimestamp,
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
            claimed: true,
            cooldown: null,
            reward,
            defaultReward: defaultWeeklyReward
        }
    }

    /**
     * Adds a monthly reward on user's balance.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why the money was added. Default: 'claimed the monthly reward'.
     * @returns {Promise<RewardData>} Monthly reward object.
     */
    async getMonthly(memberID, guildID, reason = 'claimed the monthly reward') {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const settings = await this.database.get(`${guildID}.settings`)

        const [cooldown, defaultMonthlyReward] = [
            settings?.monthlyCooldown || this.options.monthlyCooldown,
            settings?.monthlyAmount || this.options.monthlyAmount
        ]

        let reward

        if (Array.isArray(defaultMonthlyReward)) {
            const [min, max] = defaultMonthlyReward

            if (defaultMonthlyReward.length == 1) reward = min
            else reward = Math.floor(Math.random() * (Number(min) - Number(max)) + Number(max))
        }

        else reward = defaultMonthlyReward

        const userCooldown = await this.database.get(`${guildID}.${memberID}.monthlyCooldown`) || 0
        const cooldownEndTimestamp = cooldown - (Date.now() - userCooldown)

        if (userCooldown !== null && cooldownEndTimestamp > 0) {
            return {
                type: 'monthly',
                claimed: false,

                cooldown: {
                    time: parse(cooldownEndTimestamp),
                    pretty: ms(cooldownEndTimestamp),
                    endTimestamp: cooldownEndTimestamp,
                },

                reward: null,
                defaultReward: defaultMonthlyReward
            }
        }

        await this.database.set(`${guildID}.${memberID}.monthlyCooldown`, Date.now())
        await this.balance.add(reward, memberID, guildID, reason)

        this.cache.updateMany(['users', 'cooldowns', 'balance'], {
            memberID,
            guildID
        })

        return {
            type: 'monthly',
            claimed: true,
            cooldown: null,
            reward,
            defaultReward: defaultMonthlyReward
        }
    }

    /**
     * Adds a hourly reward on user's balance.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why the money was added. Default: 'claimed the hourly reward'.
     * @returns {Promise<RewardData>} Hourly reward object.
     */
    async getHourly(memberID, guildID, reason = 'claimed the hourly reward') {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const settings = await this.database.get(`${guildID}.settings`)

        const [cooldown, defaultHourlyReward] = [
            settings?.hourlyCooldown || this.options.hourlyCooldown,
            settings?.hourlyAmount || this.options.hourlyAmount
        ]

        let reward

        if (Array.isArray(defaultHourlyReward)) {
            const [min, max] = defaultHourlyReward

            if (defaultHourlyReward.length == 1) reward = min
            else reward = Math.floor(Math.random() * (Number(min) - Number(max)) + Number(max))
        }

        else reward = defaultHourlyReward

        const userCooldown = await this.database.get(`${guildID}.${memberID}.hourlyCooldown`) || 0
        const cooldownEndTimestamp = cooldown - (Date.now() - userCooldown)

        if (userCooldown !== null && cooldownEndTimestamp > 0) {
            return {
                type: 'hourly',
                claimed: false,

                cooldown: {
                    time: parse(cooldownEndTimestamp),
                    pretty: ms(cooldownEndTimestamp),
                    endTimestamp: cooldownEndTimestamp,
                },

                reward: null,
                defaultReward: defaultHourlyReward
            }
        }

        await this.database.set(`${guildID}.${memberID}.hourlyCooldown`, Date.now())
        await this.balance.add(reward, memberID, guildID, reason)

        this.cache.updateMany(['users', 'cooldowns', 'balance'], {
            memberID,
            guildID
        })

        return {
            type: 'hourly',
            claimed: true,
            cooldown: null,
            reward,
            defaultReward: defaultHourlyReward
        }
    }
}

/**
 * @typedef {object} RewardData
 * @property {'daily' | 'work' | 'weekly'} type Type of the operation.
 * @property {boolean} claimed Whether the reward was claimed.
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
 * @property {number} endTimestamp Cooldown end timestamp.
 */

/**
 * Reward manager class.
 * @type {RewardManager}
 */
module.exports = RewardManager
