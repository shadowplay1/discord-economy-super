const ms = require('../../structures/ms')
const parse = require('../../structures/timeParser.js')

class Cooldowns {

    /**
     * Cooldowns class.
     * @param {RawEconomyUser} userObject User object from database.
     * @param {EconomyConfiguration} options Economy configuration.
     * @param {DatabaseManager} database Database Manager.
     * @param {CacheManager} cache Cache Manager.
     */
    constructor(userObject, options, database, cache) {

        /**
         * Cache Manager.
         * @type {CacheManager}
         * @private
         */
        this.cache = cache

        /**
         * Raw user object
         * @type {RawEconomyUser}
         * @private
         */
        this.userObject = userObject

        /**
         * Guild ID.
         * @type {string}
         * @private
         */
        this.guildID = userObject.guildID

        /**
         * Member ID.
         * @type {string}
         * @private
         */
        this.memberID = userObject.id

        /**
         * Economy configuration.
         * @type {EconomyConfiguration}
         */
        this.options = options

        /**
         * Cooldowns object.
         * @type {CooldownsObject}
         * @private
         */
        this._cooldowns = {
            daily: userObject.dailyCooldown,
            work: userObject.workCooldown,
            weekly: userObject.weeklyCooldown,
            monthly: userObject.monthlyCooldown,
            hourly: userObject.hourlyCooldown
        }

        /**
         * Cooldowns configuration object.
         * @type {RewardCooldowns}
         */
        this._rewardCooldowns = {}

        /**
         * Database Manager.
         * @type {DatabaseManager}
         */
        this._database = database
    }

    /**
     * Gets the reward cooldowns configuration.
     * @returns {Promise<RewardCooldowns>} Cooldowns configuration object.
     * @private
     */
    async _getCooldownsConfiguration() {
        const settings = await this._database.get(`${this.userObject.guildID}.settings`)

        this._rewardCooldowns.daily = settings?.dailyCooldown || this.options.dailyCooldown
        this._rewardCooldowns.work = settings?.workCooldown || this.options.workCooldown
        this._rewardCooldowns.weekly = settings?.weeklyCooldown || this.options.weeklyCooldown
        this._rewardCooldowns.monthly = settings?.monthlyCooldown || this.options.monthlyCooldown
        this._rewardCooldowns.hourly = settings?.hourlyCooldown || this.options.hourlyCooldown

        return this._rewardCooldowns
    }

    /**
     * Returns the cooldown of the specified type.
     * @param {'daily' | 'work' | 'weekly' | 'monthly' | 'hourly'} type Cooldown type.
     * @returns {Promise<CooldownData>} Cooldown object.
     */
    async getCooldown(type) {
        const allCooldowns = await this.getAll()
        return allCooldowns[type]
    }

    /**
     * Gets user's daily cooldown.
     * @returns {Promise<CooldownData>} User's daily cooldown.
     */
    async getDaily() {
        const allCooldowns = await this.getAll()
        return allCooldowns.daily
    }

    /**
     * Gets user's work cooldown.
     * @returns {Promise<CooldownData>} User's work cooldown.
     */
    async getWork() {
        const allCooldowns = await this.getAll()
        return allCooldowns.work
    }

    /**
     * Gets user's weekly cooldown.
     * @returns {Promise<CooldownData>} User's weekly cooldown.
     */
    async getWeekly() {
        const allCooldowns = await this.getAll()
        return allCooldowns.weekly
    }

    /**
     * Gets user's monthly cooldown.
     * @returns {Promise<CooldownData>} User's monthly cooldown.
     */
    async getMonthly() {
        const allCooldowns = await this.getAll()
        return allCooldowns.monthly
    }

    /**
     * Gets user's hourly cooldown.
     * @returns {Promise<CooldownData>} User's hourly cooldown.
     */
    async getHourly() {
        const allCooldowns = await this.getAll()
        return allCooldowns.hourly
    }

    /**
     * Gets all the user's cooldowns.
     * @returns {Promise<CooldownsObject>} User's cooldowns object.
     */
    async getAll() {
        const result = {}
        const rawCooldownsObject = this._cooldowns

        for (const [rewardType, userCooldown] of Object.entries(rawCooldownsObject)) {
            let rewardCooldowns = this._rewardCooldowns

            if (!Object.keys(rewardCooldowns || {}).length) {
                rewardCooldowns = await this._getCooldownsConfiguration()
            }

            const rewardCooldown = this._rewardCooldowns[rewardType]
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
     * @returns {Promise<boolean>} If all cooldowns were cleared successfully: true, else: false.
     */
    async clearAll() {
        const results = [
            await this.clearDaily(),
            await this.clearWork(),
            await this.clearWeekly(),
            await this.clearMonthly(),
            await this.clearHourly()
        ]

        if (results.some(result => !result)) {
            return false
        }

        return true
    }

    /**
     * Clears user's daily cooldown.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    async clearDaily() {
        const result = await this._database.delete(`${this.guildID}.${this.memberID}.dailyCooldown`)

        this.cache.updateMany(['cooldowns', 'users'], {
            memberID: this.memberID,
            guildID: this.guildID
        })

        return result
    }

    /**
     * Clears user's work cooldown.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    async clearWork() {
        const result = await this._database.delete(`${this.guildID}.${this.memberID}.workCooldown`)

        this.cache.updateMany(['cooldowns', 'users'], {
            memberID: this.memberID,
            guildID: this.guildID
        })

        return result
    }

    /**
     * Clears user's weekly cooldown.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    async clearWeekly() {
        const result = await this._database.delete(`${this.guildID}.${this.memberID}.weeklyCooldown`)

        this.cache.updateMany(['cooldowns', 'users'], {
            memberID: this.memberID,
            guildID: this.guildID
        })

        return result
    }

    /**
     * Clears user's monthly cooldown.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    async clearMonthly() {
        const result = await this._database.delete(`${this.guildID}.${this.memberID}.monthlyCooldown`)

        this.cache.updateMany(['cooldowns', 'users'], {
            memberID: this.memberID,
            guildID: this.guildID
        })

        return result
    }

    /**
     * Clears user's hourly cooldown.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    async clearHourly() {
        const result = await this._database.delete(`${this.guildID}.${this.memberID}.hourlyCooldown`)

        this.cache.updateMany(['cooldowns', 'users'], {
            memberID: this.memberID,
            guildID: this.guildID
        })

        return result
    }
}

/**
 * Cooldowns class.
 * @type {Cooldowns}
 */
module.exports = Cooldowns


/**
 * @typedef {object} RewardCooldowns
 * @property {number} daily Daily cooldown.
 * @property {number} work Work cooldown.
 * @property {number} weekly Weekly cooldown.
 * @property {number} monthly Hourly cooldown.
 * @property {number} hourly Hourly cooldown.
 */

/**
 * @typedef {object} RawEconomyUser Raw economy user object from database.
 * @property {number} dailyCooldown User's daily cooldown.
 * @property {number} workCooldown User's work cooldown.
 * @property {number} weeklyCooldown User's weekly cooldown.
 * @property {number} monthlyCooldown User's monthly cooldown.
 * @property {number} hourlyCooldown User's hourly cooldown.
 * @property {number} money User's balance.
 * @property {number} bank User's bank balance.
 * @property {InventoryData} inventory User's inventory.
 * @property {HistoryData} history User's purchases history.
 * @property {string} id User ID.
 * @property {string} guildID Guild ID.
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
 * @property {number} [sellingItemPercent=75] 
 * Percent of the item's price it will be sold for. Default: 75.
 * 
 * @property {boolean} [deprecationWarnings=true] 
 * If true, the deprecation warnings will be sent in the console. Default: true.
 * 
 * @property {boolean} [savePurchasesHistory=true] If true, the module will save all the purchases history.
 * 
 * @property {number} [updateCountdown=1000] Checks for if storage file exists in specified time (in ms). Default: 1000.
 * @property {string} [dateLocale='en'] The region (example: 'ru'; 'en') to format the date and time. Default: 'en'.
 * @property {UpdaterOptions} [updater=UpdaterOptions] Update checker configuration.
 * @property {ErrorHandlerConfiguration} [errorHandler=ErrorHandlerConfiguration] Error handler configuration.

 * @property {CheckerConfiguration} [optionsChecker=CheckerConfiguration] 
 * Configuration for an 'Economy.utils.checkConfiguration' method.
 * @property {boolean} [debug=false] Enables or disables the debug mode.
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
 * @typedef {object} CooldownsObject
 * @property {number} daily Cooldown for Daily Reward.
 * @property {number} work Cooldown for Work Reward.
 * @property {number} weekly Cooldown for Weekly Reward.
 * @property {number} monthly Cooldown for Monthly Reward.
 * @property {number} hourly Cooldown for Hourly Reward.
 */
