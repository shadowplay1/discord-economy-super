const EconomyGuild = require('../classes/EconomyGuild')

const BaseManager = require('./BaseManager')

const DatabaseManager = require('./DatabaseManager')
const CacheManager = require('./CacheManager')

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
     * @param {EconomyOptions} options Economy configuration.
     * @param {DatabaseManager} database Database manager.
     * @param {CacheManager} cache Cache manager.
     */
    constructor(options, database, cache) {
        super(options, null, null, EconomyGuild, database, cache)

        /**
         * Economy configuration.
         * @type {EconomyOptions}
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
        this._users = new UserManager(options, database, null, cache)

        /**
         * Utils Manager.
         * @type {UtilsManager}
         * @private
         */
        this.utils = new UtilsManager(options, this.database)

        /**
         * Cache Manager.
         * @type {CacheManager}
         * @private
         */
        this.cache = cache
    }

    /**
     * Gets the guild by it's ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<EconomyGuild>} User object.
     */
    async get(guildID) {
        const allUsers = await this.all()
        const user = allUsers.find(guild => guild.id == guildID)

        return user
    }

    /**
     * Creates an economy guild object in database.
     * @param {string} guildID The guild ID to set.
     * @returns {Promise<EconomyGuild>} New guild instance.
     */
    create(guildID) {
        return this.reset(guildID)
    }

    /**
     * Resets the guild in database.
     * @param {string} guildID Guild ID.
     * @returns {Promise<EconomyGuild>} New guild instance.
     */
    async reset(guildID) {
        const emptyGuildObject = {
            shop: [],
            settings: []
        }

        if (!guildID) throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')

        await this.database.set(guildID, emptyGuildObject)

        this.cache.updateSpecified(['guilds', 'shop'], {
            guildID
        })

        return new EconomyGuild(guildID, this.options, emptyGuildObject, this.database, this.cache)
    }

    /**
     * Gets the array of all guilds in database.
     * @returns {Promise<EconomyGuild[]>}
     */
    async all() {

        /**
        * @type {EconomyGuild[]}
        */
        const guilds = []

        const allDatabase = await this.database.all()
        const guildEntries = Object.entries(allDatabase).filter(entry => !isNaN(entry[0]))

        for (const [guildID, guildObject] of guildEntries) {
            guildObject.id = guildID

            const economyGuild = new EconomyGuild(guildID, this.options, guildObject, this.database, this.cache)
            guilds.push(economyGuild)
        }

        return guilds
    }
}

/**
 * @typedef {object} EconomyOptions Default Economy configuration.
 * @property {number} [dailyCooldown=86400000] 
 * Cooldown for Daily Command (in ms). Default: 24 hours (60000 * 60 * 24 ms)
 * 
 * @property {number} [workCooldown=3600000] Cooldown for Work Command (in ms). Default: 1 hour (60000 * 60 ms)
 * @property {Number | Number[]} [dailyAmount=100] Amount of money for Daily Command. Default: 100.
 * @property {number} [weeklyCooldown=604800000] 
 * Cooldown for Weekly Command (in ms). Default: 7 days (60000 * 60 * 24 * 7 ms)
 * 
 * @property {boolean} [deprecationWarnings=true] 
 * If true, the deprecation warnings will be sent in the console. Default: true.
 * 
 * @property {boolean} [savePurchasesHistory=true] If true, the module will save all the purchases history.
 *
 * @property {number} [sellingItemPercent=75] 
 * Percent of the item's price it will be sold for. Default: 75.
 * 
 * @property {Number | Number[]} [weeklyAmount=100] Amount of money for Weekly Command. Default: 1000.
 * @property {Number | Number[]} [workAmount=[10, 50]] Amount of money for Work Command. Default: [10, 50].
 * @property {boolean} [subtractOnBuy=true] 
 * If true, when someone buys the item, their balance will subtract by item price. Default: false
 * 
 * @property {string} [dateLocale='en'] The region (example: 'ru' or 'en') to format the date and time. Default: 'en'.
 * @property {UpdaterOptions} [updater=UpdaterOptions] Update checker configuration.
 * @property {ErrorHandlerOptions} [errorHandler=ErrorHandlerOptions] Error handler configuration.
 * @property {CheckerOptions} [optionsChecker=CheckerOptions] Configuration for an 'Economy.utils.checkOptions' method.
 * @property {boolean} [debug=false] Enables or disables the debug mode.
 */

/**
 * Guild manager class.
 * @type {BaseManager<GuildManager>}
 */
module.exports = GuildManager