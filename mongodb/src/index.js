const { promisify } = require('util')

const DatabaseManager = require('./managers/DatabaseManager')
const CacheManager = require('./managers/CacheManager')

const UtilsManager = require('./managers/UtilsManager')

const BalanceManager = require('./managers/BalanceManager')
const BankManager = require('./managers/BankManager')

const CurrencyManager = require('./managers/CurrencyManager')

const RewardManager = require('./managers/RewardManager')
const CooldownManager = require('./managers/CooldownManager')

const ShopManager = require('./managers/ShopManager')
const InventoryManager = require('./managers/InventoryManager')
const HistoryManager = require('./managers/HistoryManager')

const UserManager = require('./managers/UserManager')
const SettingsManager = require('./managers/SettingsManager')

const Emitter = require('./classes/util/Emitter')
const EconomyError = require('./classes/util/EconomyError')

const errors = require('./structures/errors')
const GuildManager = require('./managers/GuildManager')

const Logger = require('./classes/util/Logger')


/**
 * The main Economy class.
 */
class Economy extends Emitter {

    /**
    * The Economy class.
    * @param {EconomyConfiguration} options Economy configuration.
    */
    constructor(options = {}) {
        super()

        /**
         * The Logger class.
         * @type {Logger}
         * @private
         */
        this._logger = new Logger(options)

        /**
         * Logger colors.
         * @type {LoggerColors}
         * @private
         */
        this.colors = this._logger.colors

        /**
         * The QuickMongo instance.
         * @type {QuickMongo}
         * @private
         */
        this._mongo = null

        /**
         * Module ready status.
         * @type {?boolean}
         */
        this.ready = false

        /**
         * Economy errored status.
         * @type {?boolean}
         */
        this.errored = false

        /**
        * Module version.
        * @type {string}
        */
        this.version = require('../package.json').version

        if (options.debug) {
            this._logger.debug('Economy version: ' + this.version, 'lightcyan')
            this._logger.debug('Database type is MongoDB.', 'lightcyan')
        }

        /**
         * Link to the module's documentation website.
         * @type {string}
         */
        this.docs = 'https://des-docs.js.org'

        /**
        * Utils manager methods class.
        * @type {UtilsManager}
        */
        this.utils = new UtilsManager(options)

        /**
         * Raw Economy configuration object.
         * @type {EconomyConfiguration}
         */
        this.rawOptions = options

        /**
         * Economy configuration.
         * @type {?EconomyConfiguration}
         */
        this.options = this.utils.checkConfiguration(options.optionsChecker, options)

        /**
         * Econoomy managers list. Made for optimization purposes.
         * @type {Manager[]}
         */
        this.managers = []

        /**
         * Database checking interval.
         * @type {?NodeJS.Timeout}
        */
        this.interval = null

        /**
         * Economy error class.
         * @type {EconomyError}
         */
        this.EconomyError = EconomyError

        /**
         * Emitter class.
         * @type {Emitter}
         */
        this.Emitter = Emitter

        /**
        * Balance manager.
        * @type {BalanceManager}
        */
        this.balance = null

        /**
        * Bank balance manager.
        * @type {BankManager}
        */
        this.bank = null

        /**
         * Currency manager manager.
         * @type {CurrencyManager}
         */
        this.currencies = null

        /**
        * Database manager manager.
        * @type {DatabaseManager}
        */
        this.database = null

        /**
        * Shop manager manager.
        * @type {ShopManager}
        */
        this.shop = null

        /**
        * Inventory manager manager.
        * @type {InventoryManager}
        */
        this.inventory = null

        /**
        * History manager manager.
        * @type {HistoryManager}
        */
        this.history = null

        /**
        * Cooldowns manager.
        * @type {CooldownManager}
        */
        this.cooldowns = null

        /**
        * Rewards manager.
        * @type {RewardManager}
        */
        this.rewards = null

        /**
        * Cache Manager.
        * @type {CacheManager}
        */
        this.cache = null

        /**
        * Users manager.
        * @type {UserManager}
        */
        this.users = null

        /**
        * Guild manager.
        * @type {GuildManager}
        */
        this.guilds = null

        /**
        * Settings manager.
        * @type {SettingsManager}
        */
        this.settings = null

        /**
         * Economy instance.
         * @type {Economy}
         */
        this.economy = this

        this._logger.debug('Economy starting process launched.')

        this.init().then(async status => {
            if (status) {
                const usersCache = {}
                const cooldownsCache = {}

                const balanceCache = {}
                const bankBalanceCache = {}

                const inventoryCache = {}
                const historyCache = {}

                this._logger.debug('Caching the database...', 'cyan')

                const database = await this.database.all()
                const guildEntries = Object.entries(database).filter(entry => !isNaN(entry[0]))

                for (const [guildID, guildObject] of guildEntries) {
                    const userEntries = Object.entries(guildObject).filter(entry => !isNaN(entry[0]))

                    for (const [userID, userObject] of userEntries) {
                        usersCache[userID] = userObject

                        cooldownsCache[userID] = {
                            daily: userObject.dailyCooldown,
                            work: userObject.workCooldown,
                            weekly: userObject.weeklyCooldown,
                            monthly: userObject.monthlyCooldown,
                            hourly: userObject.hourlyCooldown,
                        }

                        balanceCache[userID] = {
                            money: userObject.money,
                            bank: userObject.bank,
                        }

                        bankBalanceCache[userID] = {
                            balance: userObject.bank
                        }


                        inventoryCache[userID] = userObject.inventory
                        historyCache[userID] = userObject.history

                        this.cache.users.set(guildID, usersCache)
                        this.cache.cooldowns.set(guildID, cooldownsCache)

                        this.cache.balance.set(guildID, balanceCache)
                        this.cache.bank.set(guildID, bankBalanceCache)

                        this.cache.inventory.set(guildID, inventoryCache)
                        this.cache.history.set(guildID, historyCache)

                        await this.cache.inventory.update({
                            memberID: userID,
                            guildID
                        })
                    }

                    this.cache.currencies.set(guildID, guildObject.currencies || {})

                    this.cache.guilds.set(guildID, guildObject)
                    this.cache.shop.set(guildID, guildObject.shop)

                    await this.cache.updateSpecified(['shop', 'guilds', 'currencies'], {
                        guildID
                    })
                }

                this.ready = true

                this._logger.debug('Economy is ready!', 'green')
                this.emit('ready', this)
            }
        })
    }

    /**
     * Kills the Economy instance.
     * @returns {Economy} Economy instance.
     */
    kill() {
        if (!this.ready) return false

        clearInterval(this.interval)

        for (const manager of this.managers) {
            this[manager.name] = null
        }

        this.ready = false
        this.economy = this

        this._logger.debug('Economy is killed.')
        this.emit('destroy')

        return this
    }

    /**
     * Starts the module.
     * @returns {Promise<boolean>} If started successfully: true.
     */
    init() {
        let attempt = 0

        const attempts =
            this.options.errorHandler.attempts == 0 ?
                Infinity :
                this.options.errorHandler.attempts

        const time = this.options.errorHandler.time
        const retryingTime = (time / 1000).toFixed(1)

        const sleep = promisify(setTimeout)

        const check = () => new Promise(resolve => {
            try {
                this._init().then(async status => {
                    try {
                        if (status) {
                            this.errored = false
                            this.ready = true

                            this._logger.debug('Resolved the startup error.')
                            return console.log(`${this.colors.green}Started successfully!${this.colors.reset}`)
                        }

                        resolve(status)
                    } catch (err) {
                        resolve(err)
                    }
                }).catch(async err => {
                    resolve(err)
                })
            } catch (err) {
                console.log(6)
                resolve(err)
            }
        })

        this._logger.debug('Checking the Node.js version...')

        const handleErrors = () => {
            return this.options.errorHandler.handleErrors ? this._init().catch(async err => {
                if (err.name == 'DatabaseError' && !err.name.toLowerCase().includes('mongo')) this.errored = true

                for (const i in require.cache) {
                    delete require.cache[i]
                }

                console.log(`${this.colors.red}Failed to start the module:${this.colors.cyan}`)
                console.log(err)

                if (err.message.includes('This module is only supporting Node.js v14 or newer.')) {
                    process.exit(1)
                } else console.log(`${this.colors.magenta}Retrying in ${retryingTime} seconds...${this.colors.reset}`)

                while (attempt < attempts && attempt !== -1) {
                    await sleep(time)

                    if (attempt < attempts) {
                        const sendError = async res => {
                            if (res.message) {
                                for (const i in require.cache) {
                                    delete require.cache[i]
                                }

                                attempt++

                                console.log(`${this.colors.red}Failed to start the module:${this.colors.cyan}`)
                                console.log(err)
                                console.log(`\x1b[34mAttempt ${attempt}${attempts == Infinity ? '.' : `/${attempts}`}`)

                                if (attempt == attempts) {
                                    console.log(
                                        `${this.colors.green}Failed to start the module within ` +
                                        `${attempts} attempts...${this.colors.reset}`
                                    )

                                    process.exit(1)
                                }

                                console.log(`${this.colors.magenta}Retrying in ${retryingTime} seconds...`)
                                await sleep(time)

                            } else attempt = -1
                        }

                        if (err.name == 'DatabaseError' && !err.name.toLowerCase().includes('mongo')) {
                            await this._connect().catch(async err => {
                                await sendError(err)
                                return check().then(sendError)
                            })
                        }

                        check().then(sendError)
                    }
                }
            }) : this._init()
        }

        return handleErrors()
    }

    /**
     * Connects the module to MongoDB database.
     * @returns {Promise<void>}
     * @private
     */
    async _connect() {
        const connectionStartDate = Date.now()
        const QuickMongo = require('quick-mongo-super')

        if (!this.options.connection) {
            throw new EconomyError(errors.noConnectionData, 'NO_CONNECTION_DATA')
        }

        this._logger.debug('Connecting to MongoDB...', 'lightgreen')

        const mongo = new QuickMongo(this.options.connection)
        await mongo.connect()

        this._mongo = mongo

        const connectionTime = Date.now() - connectionStartDate
        this._logger.debug(`MongoDB connection was established in ${connectionTime} ms.`, 'lightgreen')
    }

    /**
     * Initializes the module.
     * @returns {Promise<boolean>} If started successfully: true.
     * @private
     */
    _init() {
        return new Promise((resolve, reject) => {
            try {
                if (this.errored) return reject(new EconomyError(errors.errored, 'UNKNOWN_ERROR'))
                if (this.ready) return reject(new EconomyError(errors.notReady, 'MODULE_NOT_READY'))

                if (Number(process.version.split('.')[0].slice(1)) < 14) {
                    return reject(new EconomyError(errors.oldNodeVersion + process.version, 'OLD_NODE_VERSION'))
                }

                this._connect().then(() => {
                    this._logger.debug('Checking for updates...')

                    /* eslint-disable max-len */
                    if (this.options.updater.checkUpdates) {
                        this.utils.checkUpdates().then(version => {
                            if (!version.updated) {
                                console.log('\n\n')
                                console.log(this.colors.green + '╔═══════════════════════════════════════════════════════════════╗')
                                console.log(this.colors.green + '║ @ discord-economy-super                                - [] X ║')
                                console.log(this.colors.green + '║═══════════════════════════════════════════════════════════════║')
                                console.log(this.colors.yellow + `║                    The module is ${this.colors.red}out of date!${this.colors.yellow}                 ║`)
                                console.log(this.colors.magenta + '║                     New version is available!                 ║')
                                console.log(this.colors.blue + `║                          ${version.installedVersion} --> ${version.packageVersion}                      ║`)
                                console.log(this.colors.cyan + '║             Run "npm i discord-economy-super@latest"          ║')
                                console.log(this.colors.cyan + '║                            to update!                         ║')
                                console.log(this.colors.white + '║                  View the full changelog here:                ║')
                                console.log(this.colors.red + `║  https://des-docs.js.org/#/docs/main/${version.packageVersion}/general/changelog  ║`)
                                console.log(this.colors.green + '╚═══════════════════════════════════════════════════════════════╝\x1b[37m')
                                console.log('\n\n')

                            } else {
                                if (this.options.updater.upToDateMessage) {
                                    console.log('\n\n')
                                    console.log(this.colors.green + '╔═══════════════════════════════════════════════════════════════╗')
                                    console.log(this.colors.green + '║ @ discord-economy-super                                - [] X ║')
                                    console.log(this.colors.green + '║═══════════════════════════════════════════════════════════════║')
                                    console.log(this.colors.yellow + `║                     The module is ${this.colors.cyan}up to date!${this.colors.yellow}                 ║`)
                                    console.log(this.colors.magenta + '║                     No updates are available.                 ║')
                                    console.log(this.colors.blue + `║                     Current version is ${version.packageVersion}.                 ║`)
                                    console.log(this.colors.cyan + '║                              Enjoy!                           ║')
                                    console.log(this.colors.white + '║                  View the full changelog here:                ║')
                                    console.log(this.colors.red + `║  https://des-docs.js.org/#/docs/main/${version.packageVersion}/general/changelog  ║`)
                                    console.log(this.colors.green + '╚═══════════════════════════════════════════════════════════════╝\x1b[37m')
                                    console.log('\n\n')
                                }
                            }
                        })
                    } else {
                        this._logger.debug('Skipped updates checking...')
                    }

                    this._logger.debug('Starting the managers...', 'lightyellow')
                    this.start()

                    return resolve(true)
                })
            } catch (err) {
                this._logger.debug('Failed to start.', 'red')

                this.errored = true
                reject(err)
            }
        })
    }

    /**
     * Starts all the managers.
     * @returns {boolean} If successfully started: true.
     * @private
     */
    start() {
        const packageVersion = require('../../package.json').version

        const managers = [
            {
                name: 'utils',
                manager: UtilsManager
            },
            {
                name: 'balance',
                manager: BalanceManager
            },
            {
                name: 'bank',
                manager: BankManager
            },
            {
                name: 'currencies',
                manager: CurrencyManager
            },
            {
                name: 'shop',
                manager: ShopManager
            },
            {
                name: 'inventory',
                manager: InventoryManager
            },
            {
                name: 'history',
                manager: HistoryManager
            },
            {
                name: 'rewards',
                manager: RewardManager
            },
            {
                name: 'cooldowns',
                manager: CooldownManager
            },
            {
                name: 'guilds',
                manager: GuildManager
            },

            {
                name: 'settings',
                manager: SettingsManager
            },
        ]

        const events = [
            'balanceSet', 'balanceAdd', 'balanceSubtract',
            'bankSet', 'bankAdd', 'bankSubtract',
            'customCurrencySet', 'customCurrencyAdd', 'customCurrencySubtract',
            'shopItemAdd', 'shopClear', 'shopItemEdit',
            'shopItemBuy', 'shopItemUse',
            'ready', 'destroy'
        ]

        this.database = new DatabaseManager(this.options, this._mongo)
        this._logger.debug('DatabaseManager was started.')

        this.cache = new CacheManager(this.options, this.database)
        this._logger.debug('CacheManager was started.')

        this.users = new UserManager(this.options, this.database, null, this.cache)
        this._logger.debug('UserManager was started.')

        for (const manager of managers) {
            this[manager.name] = new manager.manager(this.options, this.database, this.cache)
            this._logger.debug(`${manager.manager.name} was started.`)
        }

        for (const event of events) {
            this.on(event, () => {
                this._logger.debug(`"${event}" event is emitted.`)
            })
        }

        this.managers = managers
        this.economy = this

        if (packageVersion.includes('dev')) {
            console.log()

            this._logger.warn(
                'You are using a DEVELOPMENT version of Economy, which provides an early access ' +
                'to all the new unfinished features and bug fixes.', 'lightmagenta'
            )

            this._logger.warn(
                'Unlike the stable builds, dev builds DO NOT guarantee that the provided changes are bug-free ' +
                'and won\'t result any degraded performance or crashes. ', 'lightmagenta')

            this._logger.warn(
                'Anything may break at any new commit, so it\'s really important to check ' +
                'the module for new development updates.', 'lightmagenta'
            )

            this._logger.warn(
                'They may include the bug fixes from the ' +
                'old ones and include some new features.', 'lightmagenta'
            )

            this._logger.warn(
                'Use development versions at your own risk.', 'lightmagenta'
            )

            console.log()

            this._logger.warn(
                'Need help? Join the Support Server - https://discord.gg/4pWKq8vUnb.', 'lightmagenta'
            )

            this._logger.warn(
                'Please provide the full version of Economy you have installed ' +
                '(check in your package.json) when asking for support.', 'lightmagenta'
            )

            console.log()
        }

        return true
    }
}


/**
* @typedef {object} RawEconomyUser Raw economy user object from database.
* @property {number} dailyCooldown User's daily cooldown.
* @property {number} workCooldown User's work cooldown.
* @property {number} weeklyCooldown User's weekly cooldown.
* @property {number} money User's balance.
* @property {number} bank User's bank balance.
* @property {InventoryData} inventory User's inventory.
* @property {HistoryData} history User's purchases history.
*/


/**
 * @typedef {object} LoggerColors
 * @property {string} red Red color.
 * @property {string} green Green color.
 * @property {string} yellow Yellow color.
 * @property {string} blue Blue color.
 * @property {string} magenta Magenta color.
 * @property {string} cyan Cyan color.
 * @property {string} white White color.
 * @property {string} reset Reset color.
 * @property {string} black Black color.
 * @property {string} lightgray Light gray color.
 * @property {string} darkgray Dark gray color.
 * @property {string} lightred Light red color.
 * @property {string} lightgreen Light green color.
 * @property {string} lightyellow Light yellow color.
 * @property {string} lightblue Light blue color.
 * @property {string} lightmagenta Light magenta color.
 * @property {string} lightcyan Light cyan color.
 */

/**
* Emits when someone's set the money on the balance.
* @event Economy#balanceSet
* @param {object} data Data object.
* @param {string} data.type The type of operation.
* @param {string} data.guildID Guild ID.
* @param {string} data.memberID Member ID.
* @param {number} data.amount Amount of money in completed operation.
* @param {number} data.balance User's balance after the operation was completed successfully.
* @param {string} data.reason The reason why the operation was completed.
*/

/**
* Emits when someone's added the money on the balance.
* @event Economy#balanceAdd
* @param {object} data Data object.
* @param {string} data.type The type of operation.
* @param {string} data.guildID Guild ID.
* @param {string} data.memberID Member ID.
* @param {number} data.amount Amount of money in completed operation.
* @param {number} data.balance User's balance after the operation was completed successfully.
* @param {string} data.reason The reason why the operation was completed.
*/

/**
* Emits when someone's subtracts the money from user's balance.
* @event Economy#balanceSubtract
* @param {object} data Data object.
* @param {string} data.type The type of operation.
* @param {string} data.guildID Guild ID.
* @param {string} data.memberID Member ID.
* @param {number} data.amount Amount of money in completed operation.
* @param {number} data.balance User's balance after the operation was completed successfully.
* @param {string} data.reason The reason why the operation was completed.
*/

/**
* Emits when someone's set the money on the bank balance.
* @event Economy#bankSet
* @param {object} data Data object.
* @param {string} data.type The type of operation.
* @param {string} data.guildID Guild ID.
* @param {string} data.memberID Member ID.
* @param {number} data.amount Amount of money in completed operation.
* @param {number} data.balance User's balance after the operation was completed successfully.
* @param {string} data.reason The reason why the operation was completed.
*/

/**
* Emits when someone's added the money on the bank balance.
* @event Economy#bankAdd
* @param {object} data Data object.
* @param {string} data.type The type of operation.
* @param {string} data.guildID Guild ID.
* @param {string} data.memberID Member ID.
* @param {number} data.amount Amount of money in completed operation.
* @param {number} data.balance User's balance after the operation was completed successfully.
* @param {string} data.reason The reason why the operation was completed.
*/

/**
* Emits when someone's subtracts the money from user's bank balance.
* @event Economy#bankSubtract
* @param {object} data Data object.
* @param {string} data.type The type of operation.
* @param {string} data.guildID Guild ID.
* @param {string} data.memberID Member ID.
* @param {number} data.amount Amount of money in completed operation.
* @param {number} data.balance User's balance after the operation was completed successfully.
* @param {string} data.reason The reason why the operation was completed.
*/

/**
* Emits when someone's custom currency was set.
* @event Economy#customCurrencySet
* @param {object} data Data object.
* @param {string} data.type The type of operation.
* @param {Currency} data.currency Currency that was changed.
* @param {string} data.guildID Guild ID.
* @param {string} data.memberID Member ID.
* @param {number} data.amount Amount of money in completed operation.
* @param {number} data.balance User's balance after the operation was completed successfully.
* @param {string} data.reason The reason why the operation was completed.
*/

/**
* Emits when someone's custom currency was added.
* @event Economy#customCurrencyAdd
* @param {object} data Data object.
* @param {string} data.type The type of operation.
* @param {Currency} data.currency Currency that was changed.
* @param {string} data.guildID Guild ID.
* @param {string} data.memberID Member ID.
* @param {number} data.amount Amount of money in completed operation.
* @param {number} data.balance User's balance after the operation was completed successfully.
* @param {string} data.reason The reason why the operation was completed.
*/

/**
* Emits when someone's custom currency was subtracted.
* @event Economy#customCurrencySubtract
* @param {object} data Data object.
* @param {string} data.type The type of operation.
* @param {Currency} data.currency Currency that was changed.
* @param {string} data.guildID Guild ID.
* @param {string} data.memberID Member ID.
* @param {number} data.amount Amount of money in completed operation.
* @param {number} data.balance User's balance after the operation was completed successfully.
* @param {string} data.reason The reason why the operation was completed.
*/

/**
* Emits when someone's added an item in the shop.
* @event Economy#shopItemAdd
* @param {object} data Data object.
* @param {number} data.id Item ID.
* @param {string} data.name Item name.
* @param {number} data.price Item price.
* @param {string} data.message Item message that will be returned on item use.
* @param {string} data.description Item description.
* @param {number} data.maxAmount Max amount of the item that user can hold in their inventory.
* @param {string} data.role Role **ID** from your Discord server.
* @param {string} data.date Formatted date when the item was added to the shop.
*/

/**
* Emits when someone's removed an item in the shop.
* @event Economy#shopItemRemove
* @param {object} data Data object.
* @param {number} data.id Item ID.
* @param {string} data.name Item name.
* @param {number} data.price Item price.
* @param {string} data.message Item message that will be returned on item use.
* @param {string} data.description Item description.
* @param {number} data.maxAmount Max amount of the item that user can hold in their inventory.
* @param {string} data.role Role **ID** from your Discord server.
* @param {string} data.date Formatted date when the item was added to the shop.
*/

/**
* Emits when someone's added an item in the shop.
* @event Economy#shopItemBuy
* @param {ShopItem} item Shop item that was bought.
*/

/**
* Emits when someone's used an item from their inventory.
* @event Economy#shopItemUse
* @param {object} data Data object.
* @param {number} data.id Item ID.
* @param {string} data.name Item name.
* @param {number} data.price Item price.
* @param {string} data.message Item message that will be returned on item use.
* @param {string} data.description Item description.
* @param {number} data.maxAmount Max amount of the item that user can hold in their inventory.
* @param {string} data.role Role **ID** from your Discord server.
* @param {string} data.date Formatted date when the item was added to the shop.
*/

/**
* Emits when someone's edited an item in the shop.
* @event Economy#shopItemEdit
* @param {object} data Data object.
* @param {number} data.id Item ID.
* @param {string} data.guildID Guild ID.
* @param {string} data.changedProperty The item property that was changed.
* @param {string} data.oldValue Value before edit.
* @param {string} data.newValue Value after edit.
*/

/**
* Emits when the module is ready.
* @event Economy#ready
* @param {Economy} eco Economy instance that was initialized and could be used.
*/

/**
* Emits when the module is destroyed.
* @event Economy#destroy
* @param {void} data Void event.
*/


/**
 * @typedef {object} EconomyConfiguration Default Economy configuration.
 * @property {number} [dailyCooldown=86400000] Cooldown for Daily Reward (in ms). Default: 24 hours (60000 * 60 * 24 ms)
 * @property {number} [workCooldown=3600000] Cooldown for Work Reward (in ms). Default: 1 hour (60000 * 60 ms)
 * @property {number | number[]} [dailyAmount=100] Amount of money for Daily Reward. Default: 100.
 * @property {number} [weeklyCooldown=604800000] Cooldown for Weekly Reward (in ms). Default: 7 days (60000 * 60 * 24 * 7 ms)
 * @property {number} [sellingItemPercent=75] 
 * Percent of the item's price it will be sold for. Default: 75.
 * 
 * @property {boolean} [deprecationWarnings=true] 
 * If true, the deprecation warnings will be sent in the console. Default: true.
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
 * @property {boolean} [subtractOnBuy=true] If true, when someone buys the item, their balance will subtract by item price. Default: false
 * 
 * @property {string} [dateLocale='en'] The region (example: 'ru' or 'en') to format the date and time. Default: 'en'.
 * @property {UpdaterOptions} [updater=UpdaterOptions] Update checker configuration.
 * @property {ErrorHandlerConfiguration} [errorHandler=ErrorHandlerConfiguration] Error handler configuration.

 * @property {CheckerConfiguration} [optionsChecker=CheckerConfiguration] 
 * Configuration for an 'Economy.utils.checkConfiguration' method.
 * @property {boolean} [debug=false] Enables or disables the debug mode.
 */

/**
 * @typedef {object} UpdaterOptions Update checker configuration.
 * @property {boolean} [checkUpdates=true] Sends the update state message in console on start. Default: true.
 * @property {boolean} [upToDateMessage=true] Sends the message in console on start if module is up to date. Default: true.
 */

/**
 * @typedef {object} ErrorHandlerConfiguration
 * @property {boolean} [handleErrors=true] Handles all errors on startup. Default: true.
 * @property {number} [attempts=5] Amount of attempts to load the module. Use 0 for infinity attempts. Default: 5.
 * @property {number} [time=3000] Time between every attempt to start the module (in ms). Default: 3000.
 */

/**
 * @typedef {object} CheckerConfiguration Configuration for an 'Economy.utils.checkConfiguration' method.
 * @property {boolean} [ignoreInvalidTypes=false] Allows the method to ignore the options with invalid types. Default: false.
 * @property {boolean} [ignoreUnspecifiedOptions=false] Allows the method to ignore the unspecified options. Default: false.
 * @property {boolean} [ignoreInvalidOptions=false] Allows the method to ignore the unexisting options. Default: false.
 * @property {boolean} [showProblems=false] Allows the method to show all the problems in the console. Default: false. 
 * 
 * @property {boolean} [sendLog=false] Allows the method to send the result in the console. 
 * Requires the 'showProblems' or 'sendLog' options to set. Default: false.
 * 
 * @property {boolean} [sendSuccessLog=false] Allows the method to send the result if no problems were found. Default: false.
 */


/**
 * @typedef {object} LoggerColors
 * @property {string} red Red color.
 * @property {string} green Green color.
 * @property {string} yellow Yellow color.
 * @property {string} blue Blue color.
 * @property {string} magenta Magenta color.
 * @property {string} cyan Cyan color.
 * @property {string} white White color.
 * @property {string} reset Reset color.
 */

/**
 * @typedef {object} Manager
 * @property {string} name The manager's short name.
 * @property {Function} manager The manager class.
 */


/**
 * The Economy class.
 * @type {Economy}
 */
module.exports = Economy
