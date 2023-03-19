const RewardManager = require('../../managers/RewardManager')
const EconomyError = require('../util/EconomyError')

const errors = require('../../structures/errors')

const RewardType = {
    DAILY: 0,
    WORK: 1,
    WEEKLY: 2,
    MONTHLY: 3,
    HOURLY: 4
}


/**
 * User rewards.
 */
class Rewards {

    /**
     * Rewards constructor.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration.
     * @param {DatabaseManager} database Database manager.
     */
    constructor(memberID, guildID, options, database) {

        /**
        * Member ID.
        * @type {string}
        */
        this.memberID = memberID

        /**
         * Guild ID.
         * @type {string}
         */
        this.guildID = guildID

        /**
         * Economy configuration.
         * @type {EconomyConfiguration}
         */
        this.options = options

        /**
         * Database manager.
         * @type {DatabaseManager}
         */
        this.database = database

        /**
         * Rewards Manager.
         * @type {RewardManager}
         * @private
         */
        this._rewards = new RewardManager(options, this.database)
    }

    /**
     * Adds a reward on user's balance.
     * @param {RewardType} reward Reward to give.
     * @param {string} [reason] The reason why the money was added.
     * @returns {RewardData} Daily reward object.
    */
    receive(reward, reason) {
        const rewardTypes = ['daily', 'work', 'weekly', 'monthly', 'hourly']

        if (isNaN(reward) || !rewardTypes[reward]) {
            throw new EconomyError(
                errors.invalidType('reward', 'key of RewardType enum', typeof reward),
                'INVALID_TYPE'
            )
        }

        /* eslint-disable indent */
        switch (reward) {
            case RewardType.DAILY:
                return this.getDaily(this.memberID, this.guildID, reason)

            case RewardType.WORK:
                return this.getWork(this.memberID, this.guildID, reason)

            case RewardType.WEEKLY:
                return this.getWeekly(this.memberID, this.guildID, reason)

            case RewardType.MONTHLY:
                return this.getMonthly(this.memberID, this.guildID, reason)

            case RewardType.HOURLY:
                return this.getHourly(this.memberID, this.guildID, reason)

            default:
                throw new EconomyError(
                    errors.invalidType('reward', 'key of RewardType enum', typeof reward),
                    'INVALID_TYPE'
                )
        }
    }

    /**
     * Adds a daily reward on user's balance.
     * 
     * @param {string} [reason='claimed the daily reward']
     * The reason why the money was added. Default: 'claimed the daily reward'
     *
     * @returns {RewardData} Reward object.
     */
    getDaily(reason) {
        return this._rewards.getDaily(this.memberID, this.guildID, reason)
    }

    /**
     * Adds a work reward on user's balance.
     * 
     * @param {string} [reason='claimed the work reward']
     * The reason why the money was added. Default: 'claimed the work reward'
     *
     * @returns {RewardData} Reward object.
     */
    getWork(reason) {
        return this._rewards.getWork(this.memberID, this.guildID, reason)
    }

    /**
     * Adds a weekly reward on user's balance.
     * 
     * @param {string} [reason='claimed the weekly reward']
     * The reason why the money was added. Default: 'claimed the weekly reward'
     *
     * @returns {RewardData} Reward object.
     */
    getWeekly(reason) {
        return this._rewards.getWeekly(this.memberID, this.guildID, reason)
    }

    /**
     * Adds a monthly reward on user's balance.
     * 
     * @param {string} [reason='claimed the monthly reward']
     * The reason why the money was added. Default: 'claimed the monthly reward'
     *
     * @returns {RewardData} Reward object.
     */
    getMonthly(reason) {
        return this._rewards.getMonthly(this.memberID, this.guildID, reason)
    }

    /**
     * Adds a hourly reward on user's balance.
     * 
     * @param {string} [reason='claimed the hourly reward']
     * The reason why the money was added. Default: 'claimed the hourly reward'
     *
     * @returns {RewardData} Reward object.
     */
    getHourly(reason) {
        return this._rewards.getHourly(this.memberID, this.guildID, reason)
    }
}

/**
 * User rewards class.
 * @type {Rewards}
 */
module.exports = Rewards


/**
 * @typedef {object} RewardData
 * @property {'daily' | 'work' | 'weekly' | 'monthly' | 'hourly'} type Reward type.
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
 * @typedef {object} EconomyConfiguration Default Economy configuration.
 * @property {string} [storagePath='./storage.json'] Full path to a JSON file. Default: './storage.json'
 * @property {boolean} [checkStorage=true] Checks the if database file exists and if it has errors. Default: true
 * @property {number} [dailyCooldown=86400000]
 * Cooldown for Daily Reward (in ms). Default: 24 hours (60000 * 60 * 24 ms)
 *
 * @property {number} [workCooldown=3600000] Cooldown for Work Reward (in ms). Default: 1 hour (60000 * 60 ms)
 * @property {number | number[]} [dailyAmount=100] Amount of money for Daily Reward. Default: 100.
 * @property {number} [weeklyCooldown=604800000]
 * Cooldown for Weekly Reward (in ms). Default: 7 days (60000 * 60 * 24 * 7 ms)
 *
 * @property {number} [sellingItemPercent=75]
 * Percent of the item's price it will be sold for. Default: 75.
 *
 * @property {boolean} [deprecationWarnings=true]
 * If true, the deprecation warnings will be sent in the console.
 *
 * @property {boolean} [savePurchasesHistory=true] If true, the module will save all the purchases history.
 *
 * @property {number | number[]} [weeklyAmount=100] Amount of money for Weekly Reward. Default: 1000.
 * @property {number | number[]} [workAmount=[10, 50]] Amount of money for Work Reward. Default: [10, 50].
 *
 * @property {number | number[]} [monthlyAmount=10000] Amount of money for Monthly Reward. Default: 10000.
 * @property {number} [monthlyCooldown=2629746000] Cooldown for Weekly Reward (in ms). Default: 1 month (2629746000 ms).
 * 
 * @property {number | number[]} [hourlyAmount=20] Amount of money for Hourly Reward. Default: 20.
 * @property {number} [hourlyCooldown=3600000] Cooldown for Hourly Reward (in ms). Default: 1 hour (3600000 ms).
 *
 * @property {boolean} [subtractOnBuy=true]
 * If true, when someone buys the item, their balance will subtract by item price. Default: false
 *
 * @property {number} [updateCountdown=1000] Checks for if storage file exists in specified time (in ms). Default: 1000.
 * @property {string} [dateLocale='en'] The region (example: 'ru' or 'en') to format the date and time. Default: 'en'.
 * @property {UpdaterOptions} [updater=UpdaterOptions] Update checker configuration.
 * @property {ErrorHandlerConfiguration} [errorHandler=ErrorHandlerConfiguration] Error handler configuration.

 * @property {CheckerConfiguration} [optionsChecker=CheckerConfiguration]
 * Configuration for an 'Economy.utils.checkConfiguration' method.
 * @property {boolean} [debug=false] Enables or disables the debug mode.
 */
