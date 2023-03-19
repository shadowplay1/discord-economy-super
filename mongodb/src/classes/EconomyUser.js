const ShopManager = require('../managers/ShopManager')

const Balance = require('./user/Balance')
const Bank = require('./user/Bank')

const History = require('./user/History')
const Inventory = require('./user/Inventory')

const Cooldowns = require('./user/Cooldowns')
const Rewards = require('./user/Rewards')

const Items = require('./user/Items')

const defaultUserSchema = require('../structures/DefaultUserSchema')


/**
* Economy user class.
*/
class EconomyUser {

    /**
     * Economy user class.
     * @param {string} id User ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} ecoOptions Economy configuration.
     * @param {RawEconomyUser} userObject Economy user object.
     * @param {DatabaseManager} database Database Manager.
     * @param {CacheManager} cache Cache manager.
     */
    constructor(id, guildID, ecoOptions, userObject, database, cache) {
        userObject.id = id
        userObject.guildID = guildID

        /**
         * User ID.
         * @type {string}
         */
        this.id = id

        /**
         * Guild ID.
         * @type {string}
         */
        this.guildID = guildID

        /**
         * User's balance.
         * @type {number}
         */
        this.money = userObject.money

        /**
         * Determine if the user exists in the database.
         * @type {boolean}
         */
        this.exists = true

        /**
         * Economy configuration.
         * @type {EconomyConfiguration}
         * @private
         */
        this.options = ecoOptions

        /**
         * Shop Manager.
         * @type {ShopManager}
         * @private
         */
        this._shop = new ShopManager(this.options, database, cache)

        /**
         * User cooldowns.
         * @type {Cooldowns}
         */
        this.cooldowns = new Cooldowns(userObject, ecoOptions, database, cache)

        /**
         * User history.
         * @type {History}
         */
        this.history = new History(id, guildID, ecoOptions, database, cache)

        /**
         * User inventory.
         * @type {Inventory}
         */
        this.inventory = new Inventory(id, guildID, ecoOptions, database, cache)

        /**
         * User balance.
         * @type {Balance}
         */
        this.balance = new Balance(id, guildID, ecoOptions, database, cache)

        /**
         * User bank balance.
         * @type {Bank}
         */
        this.bank = new Bank(id, guildID, ecoOptions, database, cache)

        /**
         * User rewards.
         * @type {Rewards}
         */
        this.rewards = new Rewards(id, guildID, ecoOptions, database, cache)

        /**
         * User items.
         * @type {Items}
         */
        this.items = new Items(id, guildID, ecoOptions, database, cache)

        /**
         * Cache Manager.
         * @type {CacheManager}
         * @private
         */
        this._cache = cache

        delete userObject.history
        delete userObject.inventory

        for (const [key, value] of Object.entries(userObject || {})) {
            this[key] = value
        }
    }

	/**
	 * Creates an economy user object in database.
	 * @returns {Promise<boolean>} If created successfully: true, else: false.
	 */
	async create() {
		if (!this.exists) {
			return this.reset()
		}

		return this.exists
	}

    /**
     * Deletes the user from database.
     * @returns {Promise<EconomyUser>} Deleted user object.
     */
    async delete() {
        await this._shop.database.delete(`${this.guildID}.${this.id}`)

        this._cache.users.update({
            memberID: this.id,
            guildID: this.guildID,
        })

        return this
    }

    /**
     * Sets the default user object for a specified member.
     * @returns {Promise<boolean>} If reset successfully: true; else: false.
     */
    async reset() {
        const defaultObj = defaultUserSchema

        defaultObj.id = this.id
        defaultObj.guildID = this.guildID

        const result = await this._shop.database.set(`${this.guildID}.${this.id}`, defaultObj)

        this._cache.users.update({
            memberID: this.id,
            guildID: this.guildID,
        })

        return result
    }

    /**
     * Converts the economy user to string.
     * @returns {string} String representation of economy user.
     */
    toString() {
        return `Economy User - ID: ${this.id} (Guild ID: ${this.guildID})`
    }
}

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
 */

/**
 * Inventory data object.
 * @typedef {object} InventoryData
 * @property {number} id Item ID in your inventory.
 * @property {string} name Item name.
 * @property {number} price Item price.
 * @property {string} message The message that will be returned on item use.
 * @property {string} role ID of Discord Role that will be given to user on item use.
 * @property {number} maxAmount Max amount of the item that user can hold in their inventory.
 * @property {string} date Date when the item was bought by a user.
 * @property {object} custom Custom item properties object.
 */

/**
 * History data object.
 * @typedef {object} HistoryData
 * @property {number} id Item ID in history.
 * @property {string} name Item name.
 * @property {number} price Item price.
 * @property {string} message The message that will be returned on item use.
 * @property {string} role ID of Discord Role that will be given to user on item use.
 * @property {string} date Date when the item was bought by a user.
 * @property {string} memberID Member ID.
 * @property {string} guildID Guild ID.
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
 * @property {string} [dateLocale='en'] The region (example: 'ru'; 'en') to format the date and time. Default: 'en'.
 * @property {UpdaterOptions} [updater=UpdaterOptions] Update checker configuration.
 * @property {ErrorHandlerConfiguration} [errorHandler=ErrorHandlerConfiguration] Error handler configuration.

 * @property {CheckerConfiguration} [optionsChecker=CheckerConfiguration] 
 * Configuration for an 'Economy.utils.checkConfiguration' method.
 * @property {boolean} [debug=false] Enables or disables the debug mode.
 */


/**
 * Economy user class.
 * @type {EconomyUser}
 */
module.exports = EconomyUser
