const UtilsManager = require('../managers/UtilsManager')
const UserManager = require('../managers/UserManager')

const Shop = require('./guild/Shop')
const Leaderboards = require('./guild/Leaderboards')

const Settings = require('./guild/Settings')
const Currency = require('./Currency')


/**
* Economy guild class.
*/
class EconomyGuild {

    /**
     * Economy guild class.
     * @param {string} id Guild ID.
     * @param {EconomyConfiguration} ecoOptions Economy configuration.
     * @param {any} guildObject Economy guild object.
     * @param {DatabaseManager} database Database manager.
     * @param {CacheManager} cache Cache manager.
     */
    constructor(id, ecoOptions, guildObject, database, cache) {

        /**
         * Guild User Manager.
         * @type {UserManager}
         */
        this.users = new UserManager(ecoOptions, database, id, cache)

        /**
         * Guild ID.
         * @type {string}
         */
        this.id = id

        /**
         * Determine if the guild exists in the database.
         * @type {boolean}
         */
        this.exists = true

        /**
         * Database Manager.
         * @type {DatabaseManager}
         * @private
         */
        this.database = database

        /**
         * Guild currencies array.
         * @type {Currency[]}
         */
        this.currencies = guildObject?.currencies?.map(currency =>
            new Currency(currency.id, this.id, ecoOptions, currency, database, cache)
        ) || []

        /**
         * Utils Manager.
         * @type {UtilsManager}
         * @private
         */
        this.utils = new UtilsManager(ecoOptions, database, cache)

        /**
         * Guild Shop.
         * @type {Shop}
         */
        this.shop = new Shop(id, ecoOptions, database, cache)

        /**
        * Guild Leaderboards.
        * @type {Leaderboards}
        */
        this.leaderboards = new Leaderboards(id, ecoOptions, database, cache)

        /**
         * Guild Settings.
         * @type {Settings}
         */
        this.settings = new Settings(id, ecoOptions, database)

        /**
         * Cache Manager.
         * @type {CacheManager}
         * @private
         */
        this._cache = cache

        delete guildObject.settings
        delete guildObject.shop
        delete guildObject.currencies

        for (const [key, value] of Object.entries(guildObject || {})) {
            this[key] = value
        }
    }

    /**
     * Creates an economy guild object in database.
     * @returns {Promise<boolean>} If created successfully: true; else: false.
     */
    async create() {
        if (!this.exists) {
            return this.reset()
        }

        return this.exists
    }

    /**
     * Deletes the guild from database.
     * @returns {Promise<EconomyGuild>} Deleted guild object.
     */
    async delete() {
        await this.database.delete(this.id)

        this._cache.guilds.update({
            guildID: this.id,
        })

        return this
    }

    /**
     * Sets the default guild object for a specified member.
     * @returns {Promise<boolean>} If reset successfully: true; else: false.
     */
    async reset() {
        const result = await this.database.set(this.id, {
            shop: [],
            settings: []
        })

        this._cache.guilds.update({
            guildID: this.id,
        })

        return result
    }

    /**
     * Converts the economy guild to string.
     * @returns {string} String representation of economy guild.
     */
    toString() {
        return `Economy Guild - ID: ${this.id}`
    }
}

/**
 * @typedef {object} AddItemOptions Configuration with item info for 'Economy.shop.addItem' method.
 * @property {string} name Item name.
 * @property {string | number} price Item price.
 * @property {string} [message='You have used this item!'] Item message that will be returned on use.
 * @property {string} [description='Very mysterious item.'] Item description.
 * @property {string | number} [maxAmount=null] Max amount of the item that user can hold in their inventory.
 * @property {string} [role=null] Role **ID** from your Discord server.
 */

/**
 * Item data object.
 * @typedef {object} ItemData
 * @property {number} id Item ID.
 * @property {string} name Item name.
 * @property {number} price Item price.
 * @property {string} message The message that will be returned on item use.
 * @property {string} description Item description.
 * @property {string} role ID of Discord Role that will be given to the user on item use.
 * @property {number} maxAmount Max amount of the item that user can hold in their inventory.
 * @property {string} date Date when the item was added in the shop.
 * @property {object} custom Custom item properties object.
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
 * Economy guild class.
 * @type {EconomyGuild}
 */
module.exports = EconomyGuild
