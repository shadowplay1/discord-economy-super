const EconomyGuild = require('../classes/EconomyGuild')
const EmptyEconomyGuild = require('../classes/EmptyEconomyGuild')

const BaseManager = require('./BaseManager')
const FetchManager = require('./FetchManager')

const UtilsManager = require('./UtilsManager')
const UserManager = require('./UserManager')

const EconomyError = require('../classes/util/EconomyError')
const errors = require('../structures/errors')


/**
 * User manager methods class.
 * @extends {BaseManager}
 */
class GuildManager extends BaseManager {

    /**
     * Guild Manager.
     * @param {EconomyConfiguration} options Economy configuration.
     * @param {DatabaseManager} database Database manager.
     */
    constructor(options, database) {
        super(options, null, null, EconomyGuild, EmptyEconomyGuild)

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
        this.database = database

        /**
         * User Manager.
         * @type {UserManager}
         * @private
         */
        this._users = new UserManager(options, null)

        /**
         * Utils Manager.
         * @type {UtilsManager}
         * @private
         */
        this.utils = new UtilsManager(options, this.database, new FetchManager(options, this.database))
    }

    /**
     * Gets the guild by it's ID.
     * @param {string} guildID Guild ID.
     * @returns {EconomyGuild} Guild object.
     */
    get(guildID) {
        const allGuilds = this.all()
        const guild = allGuilds.find(guild => guild.id == guildID)

        return guild || new EmptyEconomyGuild(guildID, this.options, this.database)
    }

    /**
     * Creates an economy guild object in database.
     * @param {string} guildID The guild ID to set.
     * @returns {EconomyGuild} New guild instance.
     */
    create(guildID) {
        return this.reset(guildID)
    }

    /**
     * Resets the guild in database.
     * @param {string} guildID Guild ID.
     * @returns {EconomyGuild} New guild instance.
     */
    reset(guildID) {
        const emptyGuildObject = {
            shop: [],
            settings: []
        }

        if (!guildID) throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')

        this.database.set(guildID, emptyGuildObject)
        return new EconomyGuild(guildID, this.options, emptyGuildObject, this.database)
    }

    /**
     * Gets the array of ALL guilds in database.
     * @returns {EconomyGuild[]}
     */
    all() {

        /**
        * @type {EconomyGuild[]}
        */
        const guilds = []

        const allDatabase = this.database.all()
        const guildEntries = Object.entries(allDatabase)

        for (const [guildID, guildObject] of guildEntries) {
            guildObject.id = guildID

            const economyGuild = new EconomyGuild(guildID, this.options, guildObject)
            guilds.push(economyGuild)
        }

        return guilds
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
 * Guild manager class.
 * @type {BaseManager<GuildManager>}
 */
module.exports = GuildManager
