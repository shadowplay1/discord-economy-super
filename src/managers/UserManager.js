const EconomyUser = require('../classes/EconomyUser')
const EmptyEconomyUser = require('../classes/EmptyEconomyUser')

const BaseManager = require('./BaseManager')
const DatabaseManager = require('./DatabaseManager')

const defaultUserSchema = require('../structures/DefaultUserSchema')


/**
 * User manager methods class.
 * @extends {BaseManager}
 */
class UserManager extends BaseManager {

    /**
     * User Manager.
     * @param {EconomyConfiguration} options Economy configuration.
     * @param {string} guildID Guild ID.
     */
    constructor(options, guildID) {
        super(options, null, guildID, EconomyUser, EmptyEconomyUser)

        /**
         * Economy configuration.
         * @type {EconomyConfiguration}
         * @private
         */
        this.options = options

        /**
         * Database Manager.
         * @type {DatabaseManager}
         * @private
         */
        this.database = new DatabaseManager(options)
    }

    /**
     * Gets the user by it's ID and guild ID.
     * @param {string} userID User ID.
     * @param {string} [guildID] Guild ID.
     * @returns {EconomyUser} User object.
     */
    get(userID, guildID) {
        const allUsers = this.all()
        const result = allUsers.find(user => user.guildID == (guildID || this.guildID) && user.id == userID)

        return result || new EmptyEconomyUser(userID, guildID || this.guildID, this.options, this.database)
    }

    /**
     * Creates an economy user object in database.
     * @param {string} memberID The user ID to set.
     * @param {string} [guildID] Guild ID.
     * @returns {EconomyUser} Economy user object.
     */
    create(memberID, guildID = this.guildID) {
        if (!guildID) return null
        if (!memberID) return null

        const defaultObj = defaultUserSchema

        defaultObj.id = memberID
        defaultObj.guildID = guildID

        this.database.set(`${guildID}.${memberID}`, defaultObj)

        const newUser = new EconomyUser(memberID, guildID, this.options, defaultObj, this.database)
        return newUser
    }

    /**
     * Sets the default user object for a specified member.
     * @param {string} userID User ID.
     * @param {string} [guildID] Guild ID.
     * @returns {EconomyUser} If reset successfully: true; else: false.
     */
    reset(userID, guildID = this.guildID) {
        return this.create(userID, guildID)
    }

    /**
     * Gets the array of ALL users in database.
     * @returns {EconomyUser[]}
     */
    all() {

        /**
        * @type {EconomyUser[]}
        */
        const users = []

        const all = this.database.all()
        const guildEntries = Object.entries(all)

        for (const [guildID, guildObject] of guildEntries) {
            const userEntries = Object.entries(guildObject).filter(entry => !isNaN(entry[0]))

            for (const [userID, userObject] of userEntries) {
                userObject.id = userID
                userObject.guildID = guildID

                delete userObject.history
                delete userObject.inventory
                delete userObject.bank

                const economyUser = new EconomyUser(userID, guildID, this.options, userObject, this.database)
                users.push(economyUser)
            }
        }

        return users
    }
}


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
 * @property {boolean} [deprecationWarnings=true]
 * If true, the deprecation warnings will be sent in the console. Default: true.
 *
 * @property {boolean} [savePurchasesHistory=true] If true, the module will save all the purchases history.
 *
 * @property {number} [sellingItemPercent=75]
 * Percent of the item's price it will be sold for. Default: 75.
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

/**
 * User manager class.
 * @type {UserManager}
 */
module.exports = UserManager
