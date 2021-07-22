const { existsSync, writeFileSync, readFileSync } = require('fs')

const Emitter = require('./classes/Emitter')
const EconomyError = require('./classes/EconomyError')

const BankManager = require('./managers/BankManager')
const CooldownManager = require('./managers/CooldownManager')
const RewardManager = require('./managers/RewardManager')
const BalanceManager = require('./managers/BalanceManager')
const ShopManager = require('./managers/ShopManager')
const DatabaseManager = require('./managers/DatabaseManager')
const UtilsManager = require('./managers/UtilsManager')
/**
 * The main Economy class.
 */
class Economy extends Emitter {
    /**
    * Emits when someone's set the money on the balance.
    * @event Economy#balanceSet
    * @param {Object} data Data object.
    * @param {String} data.type The type of operation.
    * @param {String} data.guildID Guild ID.
    * @param {String} data.memberID Member ID.
    * @param {Number} data.amount Amount of money in completed operation.
    * @param {Number} data.balance User's balance after the operation was completed successfully.
    * @param {String} data.reason The reason why the operation was completed.
    */
    /**
    * Emits when someone's added the money on the balance.
    * @event Economy#balanceAdd
    * @param {Object} data Data object.
    * @param {String} data.type The type of operation.
    * @param {String} data.guildID Guild ID.
    * @param {String} data.memberID Member ID.
    * @param {Number} data.amount Amount of money in completed operation.
    * @param {Number} data.balance User's balance after the operation was completed successfully.
    * @param {String} data.reason The reason why the operation was completed.
    */
    /**
    * Emits when someone's subtracts the money from user's balance.
    * @event Economy#balanceSubtract
    * @param {Object} data Data object.
    * @param {String} data.type The type of operation.
    * @param {String} data.guildID Guild ID.
    * @param {String} data.memberID Member ID.
    * @param {Number} data.amount Amount of money in completed operation.
    * @param {Number} data.balance User's balance after the operation was completed successfully.
    * @param {String} data.reason The reason why the operation was completed.
    */
    /**
    * Emits when someone's set the money on the bank balance.
    * @event Economy#bankSet
    * @param {Object} data Data object.
    * @param {String} data.type The type of operation.
    * @param {String} data.guildID Guild ID.
    * @param {String} data.memberID Member ID.
    * @param {Number} data.amount Amount of money in completed operation.
    * @param {Number} data.balance User's balance after the operation was completed successfully.
    * @param {String} data.reason The reason why the operation was completed.
    */
    /**
    * Emits when someone's added the money on the bank balance.
    * @event Economy#bankAdd
    * @param {Object} data Data object.
    * @param {String} data.type The type of operation.
    * @param {String} data.guildID Guild ID.
    * @param {String} data.memberID Member ID.
    * @param {Number} data.amount Amount of money in completed operation.
    * @param {Number} data.balance User's balance after the operation was completed successfully.
    * @param {String} data.reason The reason why the operation was completed.
    */
    /**
    * Emits when someone's subtracts the money from user's bank balance.
    * @event Economy#bankSubtract
    * @param {Object} data Data object.
    * @param {String} data.type The type of operation.
    * @param {String} data.guildID Guild ID.
    * @param {String} data.memberID Member ID.
    * @param {Number} data.amount Amount of money in completed operation.
    * @param {Number} data.balance User's balance after the operation was completed successfully.
    * @param {String} data.reason The reason why the operation was completed.
    */
    /**
    * Emits when someone's added an item in the shop.
    * @event Economy#shopAddItem
    * @param {Number} id Item ID.
    * @param {String} data.name Item name.
    * @param {Number} data.price Item price.
    * @param {String} data.message Item message that will be returned on item use.
    * @param {String} data.description Item description.
    * @param {Number} data.maxAmount Max amount of the item that user can hold in his inventory.
    * @param {String} data.role Role ID from your Discord server.
    * @param {String} data.date Formatted date when the item was added to the shop.
    */
    /**
    * Emits when someone's added an item in the shop.
    * @event Economy#shopItemBuy
    * @param {Number} id Item ID.
    * @param {String} data.name Item name.
    * @param {Number} data.price Item price.
    * @param {String} data.message Item message that will be returned on item use.
    * @param {String} data.description Item description.
    * @param {Number} data.maxAmount Max amount of the item that user can hold in his inventory.
    * @param {String} data.role Role ID from your Discord server.
    * @param {String} data.date Formatted date when the item was added to the shop.
    */
    /**
    * Emits when someone's used an item from his inventory.
    * @event Economy#shopItemUse
    * @param {Number} id Item ID.
    * @param {String} data.name Item name.
    * @param {Number} data.price Item price.
    * @param {String} data.message Item message that will be returned on item use.
    * @param {String} data.description Item description.
    * @param {Number} data.maxAmount Max amount of the item that user can hold in his inventory.
    * @param {String} data.role Role ID from your Discord server.
    * @param {String} data.date Formatted date when the item was added to the shop.
    */
    /**
    * Emits when someone's edited an item in the shop.
    * @event Economy#shopEditItem
    * @param {Number} id Item ID.
    * @param {String} data.guildID Guild ID.
    * @param {String} data.changed hat was changed in item data.
    * @param {String} data.oldValue Value before edit.
    * @param {String} data.newValue Value after edit.
    */
    /**
    * Emits when the module is ready.
    * @event Economy#ready
    * @param {void} data Void event.
    */
    /**
    * Emits when the module is destroyed.
    * @event Economy#destroy
    * @param {void} data Void event.
    */
    /**
      * The Economy class.
      * @param {EconomyOptions} options Economy options object.
      */
    constructor(options = {}) {
        super()
        /**
         * Module ready status.
         * @type {?Boolean}
         */
        this.ready = false
        /**
         * Economy errored status.
         * @type {?Boolean}
         */
        this.errored = false
        /**
        * Module version.
        * @type {String}
        */
        this.version = module.exports.version || require('../package.json').version
        /**
         * Link to the module's documentation website.
         * @type {String}
         */
        this.docs = 'https://des-docs.tk'
        /**
         * Constructor options object.
         * @type {?EconomyOptions}
         */
        this.options = options
        /**
         * Database checking interval.
         * @type {?NodeJS.Timeout}
         */
        this.interval = null
        /**
         * Economy errors object.
         * @type {Object}
         */
        this.errors = require('./structures/Errors')
        /**
         * Economy error class.
         * @type {EconomyError}
         */
        this.EconomyError = EconomyError
        /**
        * Balance methods object.
        * @type {BalanceManager}
        */
        this.balance = new BalanceManager(options)
        /**
        * Bank balance methods object.
        * @type {BankManager}
        */
        this.bank = new BankManager(options)
        /**
        * An object with methods to create a shop on your server.
        * @type {ShopManager}
        */
        this.shop = new ShopManager(options)
        /**
        * Balance methods object.
        * @type {RewardManager}
        */
        this.rewards = new RewardManager(options)
        /**
        * Bank balance methods object.
        * @type {CooldownManager}
        */
        this.cooldowns = new CooldownManager(options)
        /**
        * Database manager methods object.
        * @type {DatabaseManager}
        */
        this.database = new DatabaseManager(options)
        /**
        * An object with methods to create a shop on your server.
        * @type {UtilsManager}
        */
        this.utils = new UtilsManager(options)

        this.init()
    }
    /**
     * Kills the Economy instance.
     * @returns {this} Economy instance.
     */
    kill() {
        clearInterval(this.interval)
        this.interval = null
        this.options = {}
        this.ready = false
        this.emit('destroy')
        return this
    }
    /**
     * Starts the module.
     * @returns {Promise<true | Error>} If started successfully: true; else: Error instance.
     */
    init() {
        typeof this.options.errorHandler == 'object' ? this.options.errorHandler : this.options.errorHandler = {}
        this.options.errorHandler.handleErrors == undefined ? this.options.errorHandler.handleErrors = true : this.options.errorHandler?.handleErrors
        this.options.errorHandler.attempts !== undefined ? this.options.errorHandler.attempts == null ? this.options.errorHandler.attempts = Infinity : this.options.errorHandler?.attempts : this.options.errorHandler.attempts = 5
        this.options.errorHandler.time == undefined ? this.options.errorHandler.time = 5000 : this.options.errorHandler?.time
        return this.options.errorHandler?.handleErrors ? this._init().catch(async err => {
            let attempt = 0
            if (!err instanceof EconomyError) this.errored = true
            console.log('\x1b[31mFailed to start the module:\x1b[36m')
            console.log(err)
            if (err instanceof ReferenceError) {
                this.errored = true
                return console.log('\x1b[33mTip: Reference Errors are very important and serious errors and they cannot be handled.')
            }
            else console.log(`\x1b[35mRetrying in ${(this.options.errorHandler.time / 1000).toFixed(1)} seconds...`)
            const check = () => new Promise(resolve => {
                this._init().then(x => {
                    if (x) {
                        this.errored = false
                        console.log('\x1b[32mStarted successfully! :)')
                    }
                    resolve(x)
                }).catch(err => resolve(err))
            })
            const sleep = require('util').promisify(setTimeout);
            let attempts = this.options.errorHandler.attempts == null ? Infinity : this.options.errorHandler.attempts
            while (attempt < attempts && attempt !== -1) {
                await sleep(this.options.errorHandler.time)
                if (attempt < attempts) check().then(async res => {
                    if (res.message) {
                        attempt++
                        console.log('\x1b[31mFailed to start the module:\x1b[36m')
                        console.log(err)
                        console.log(`\x1b[34mAttempt ${attempt}${attempts == Infinity ? '.' : `/${this.options.errorHandler.attempts}`}`)
                        if (attempt == attempts) return console.log(`\x1b[32mFailed to start the module within ${this.options.errorHandler.attempts} attempts...`)
                        console.log(`\x1b[35mRetrying in ${(this.options.errorHandler.time / 1000).toFixed(1)} seconds...`)
                        await sleep(this.options.errorHandler.time)
                        delete require.cache[require.resolve('./index.js')]
                        check()
                    } else {
                        attempt = -1
                    }
                })
            }
        }) : this._init()
    }
    /**
     * Initializates the module.
     * @returns {Promise<true | Error>} If started successfully: true; else: Error instance.
     * @private
     */
    _init() {
        return new Promise(async (resolve, reject) => {
            try {
                if (Number(process.version.split('.')[0].slice(1)) < 14) return reject(new EconomyError(this.errors.oldNodeVersion + process.version))
                if (this.errored) return
                if (this.ready) return
                this.options.storagePath = this.options.storagePath || './storage.json'
                if (!this.options.storagePath.endsWith('json') && !this.options.storagePath.endsWith('json/')) return reject(new EconomyError(this.errors.invalidStorage))
                typeof this.options.errorHandler == 'object' ? this.options.errorHandler : this.options.errorHandler = {}
                this.options.errorHandler.handleErrors == undefined ? this.options.errorHandler.handleErrors = true : this.options.errorHandler?.handleErrors
                this.options.errorHandler.attempts == undefined ? this.options.errorHandler.attempts = 3 : this.options.errorHandler?.attempts
                this.options.errorHandler.time == undefined ? this.options.errorHandler.time = 5000 : this.options.errorHandler?.time
                if (this.options.checkStorage == undefined ? true : this.options.checkStorage) {
                    if (!existsSync(this.options.storagePath) && (!this.options?.storagePath?.includes('testStorage123') && !__dirname.includes('discord-economy-super\\tests'))) writeFileSync(this.options.storagePath, '{}')
                    try {
                        if (this.options?.storagePath?.includes('testStorage123') && !__dirname.includes('discord-economy-super\\tests') && !__dirname.includes('discord-economy-super/tests')) return reject(new EconomyError(this.errors.reservedName))
                        JSON.parse(readFileSync(this.options.storagePath).toString())
                    } catch (err) {
                        if (err.message.includes('Unexpected') && err.message.includes('JSON')) return reject(new EconomyError(this.errors.wrongStorageData))
                        else return reject(err)
                    }
                }
                this.options.dailyAmount == undefined || this.options.dailyAmount == null ? this.options.dailyAmount = 100 : this.options.dailyAmount = this.options.dailyAmount
                this.options.updateCountdown == undefined || this.options.updateCountdown == null ? this.options.updateCountdown = 1000 : this.options.updateCountdown = this.options.updateCountdown
                this.options.workAmount == undefined || this.options.workAmount == null ? this.options.workAmount = [10, 50] : this.options.workAmount = this.options.workAmount
                this.options.weeklyAmount == undefined || this.options.weeklyAmount == null ? this.options.weeklyAmount = 1000 : this.options.weeklyAmount = this.options.weeklyAmount
                this.options.dailyCooldown == undefined || this.options.dailyCooldown == null ? this.options.dailyCooldown = 60000 * 60 * 24 : this.options.dailyCooldown = this.options.dailyCooldown
                this.options.workCooldown == undefined || this.options.workCooldown == null ? this.options.workCooldown = 60000 * 60 : this.options.workCooldown = this.options.workCooldown
                this.options.weeklyCooldown == undefined || this.options.weeklyCooldown == null ? this.options.weeklyCooldown = 60000 * 60 * 24 * 7 : this.options.weeklyCooldown = this.options.weeklyCooldown
                this.options.checkStorage == undefined ? this.options.checkStorage = true : this.options.checkStorage
                typeof this.options.updater == 'object' ? this.options.updater : this.options.updater = {}
                typeof this.options.errorHandler == 'object' ? this.options.errorHandler : this.options.errorHandler = {}
                this.options.errorHandler.handleErrors == undefined ? this.options.errorHandler.handleErrors = true : this.options.errorHandler?.handleErrors
                this.options.errorHandler.attempts == undefined ? this.options.errorHandler.attempts = 5 : this.options.errorHandler?.attempts
                this.options.errorHandler.time == undefined ? this.options.errorHandler.time = 3000 : this.options.errorHandler?.time
                this.options.updater.checkUpdates == undefined ? this.options.updater.checkUpdates = true : this.options.updater?.checkUpdates
                this.options.updater.upToDateMessage == undefined ? this.options.updater.upToDateMessage = true : this.options.updater?.upToDateMessage
                if (this.options.updater?.checkUpdates) {
                    const version = await this.utils.checkUpdates()
                    const colors = {
                        red: '\x1b[31m',
                        green: '\x1b[32m',
                        yellow: '\x1b[33m',
                        blue: '\x1b[34m',
                        magenta: '\x1b[35m',
                        cyan: '\x1b[36m',
                        white: '\x1b[37m',
                    }
                    if (!version.updated) {
                        console.log('\n\n')
                        console.log(colors.green + '---------------------------------------------------')
                        console.log(colors.green + '| @ discord-economy-super                  - [] X |')
                        console.log(colors.green + '---------------------------------------------------')
                        console.log(colors.yellow + `|            The module is ${colors.red}out of date!${colors.yellow}           |`)
                        console.log(colors.magenta + '|              New version is avaible!            |')
                        console.log(colors.blue + `|                  ${version.installedVersion} --> ${version.packageVersion}                |`)
                        console.log(colors.cyan + '|     Run "npm i discord-economy-super@latest"    |')
                        console.log(colors.cyan + '|                    to update!                   |')
                        console.log(colors.white + `|          View the full changelog here:          |`)
                        console.log(colors.red + '| https://npmjs.com/package/discord-economy-super |')
                        console.log(colors.green + '---------------------------------------------------\x1b[37m')
                        console.log('\n\n')
                    } else {
                        if (this.options.updater?.upToDateMessage) {
                            console.log('\n\n')
                            console.log(colors.green + '---------------------------------------------------')
                            console.log(colors.green + '| @ discord-economy-super                  - [] X |')
                            console.log(colors.green + '---------------------------------------------------')
                            console.log(colors.yellow + `|            The module is ${colors.cyan}up to date!${colors.yellow}            |`)
                            console.log(colors.magenta + '|             No updates are avaible.             |')
                            console.log(colors.blue + `|            Current version is ${version.packageVersion}.            |`)
                            console.log(colors.cyan + '|                     Enjoy!                      |')
                            console.log(colors.white + `|          View the full changelog here:          |`)
                            console.log(colors.red + '| https://npmjs.com/package/discord-economy-super |')
                            console.log(colors.green + '---------------------------------------------------\x1b[37m')
                            console.log('\n\n')
                        }
                    }
                }
                if (typeof this.options !== 'object') throw new EconomyError(this.errors.invalidTypes.constructorOptions.options + typeof this.options)
                if (typeof this.options.updater !== 'object') throw new EconomyError(this.errors.invalidTypes.constructorOptions.updaterType + typeof this.options.updater)
                if (typeof this.options.errorHandler !== 'object') throw new EconomyError(this.errors.invalidTypes.constructorOptions.errorHandlerType + typeof this.options.errorHandler)
                if (typeof this.options.storagePath !== 'string') throw new EconomyError(this.errors.invalidTypes.constructorOptions.storagePath + typeof this.options.storagePath)
                if (this.options.dailyCooldown && typeof this.options.dailyCooldown !== 'number') throw new EconomyError(this.errors.invalidTypes.constructorOptions.dailyCooldown + typeof this.options.dailyCooldown)
                if (this.options.dailyAmount && typeof this.options.dailyAmount !== 'number') throw new EconomyError(this.errors.invalidTypes.constructorOptions.dailyAmount + typeof this.options.dailyAmount)
                if (this.options.workCooldown && typeof this.options.workCooldown !== 'number') throw new EconomyError(this.errors.invalidTypes.constructorOptions.workCooldown + typeof this.options.workCooldown)
                if (this.options.errorHandler.attempts && typeof this.options.errorHandler.attempts !== 'number') throw new EconomyError(this.errors.invalidTypes.constructorOptions.errorHandler.attempts + typeof this.options.errorHandler.attempts)
                if (this.options.errorHandler.time && typeof this.options.errorHandler.time !== 'number') throw new EconomyError(this.errors.invalidTypes.constructorOptions.errorHandler.time + typeof this.options.errorHandler.time)
                if (this.options.errorHandler.handleErrors && typeof this.options.errorHandler.handleErrors !== 'boolean') throw new EconomyError(this.errors.invalidTypes.constructorOptions.errorHandler.handleErrors + typeof this.options.errorHandler.handleErrors)
                if (this.options.updater.checkUpdates && typeof this.options.updater.checkUpdates !== 'boolean') throw new EconomyError(this.errors.invalidTypes.constructorOptions.updater.checkUpdates + typeof this.options.updater.checkUpdates)
                if (this.options.updater.upToDateMessage && typeof this.options.updater.upToDateMessage !== 'boolean') throw new EconomyError(this.errors.invalidTypes.constructorOptions.updater.upToDateMessage + typeof this.options.updater.upToDateMessage)
                if (this.options.workAmount && (typeof this.options.workAmount !== 'number' && !Array.isArray(this.options.workAmount))) throw new EconomyError(this.errors.invalidTypes.constructorOptions.workAmount + typeof this.options.workAmount)
                if (this.options.updateCountdown && typeof this.options.updateCountdown !== 'number') throw new EconomyError(this.errors.invalidTypes.constructorOptions.updateCountdown + typeof this.options.updateCountdown)
                if (Array.isArray(this.options.workAmount) && this.options.workAmount.length > 2) throw new EconomyError(this.errors.workAmount.tooManyElements)
                if (Array.isArray(this.options.workAmount) && this.options.workAmount.length == 1) this.options.workAmount = Array.isArray(this.options.workAmount) && this.options.workAmount[0]
                if (Array.isArray(this.options.workAmount) && this.options.workAmount[0] > this.options.workAmount[1]) this.options.workAmount = this.options.workAmount.reverse()
                if (this.options.checkStorage == undefined ? true : this.options.checkStorage) {
                    const interval = setInterval(() => {
                        const storageExists = existsSync(this.options.storagePath)
                        if (!storageExists) {
                            try {
                                if (this.options?.storagePath?.includes('testStorage123') && !__dirname.includes('discord-economy-super\\tests')) throw new EconomyError(this.errors.reservedName)
                                writeFileSync(this.options.storagePath, '{}', 'utf-8')
                            } catch (err) {
                                throw new EconomyError(this.errors.notReady)
                            }
                            console.log('\x1b[36mfailed to find a database file; created another one...\x1b[37m')
                        }
                        try {
                            JSON.parse(readFileSync(this.options.storagePath).toString())
                        } catch (err) {
                            if (err.message.includes('Unexpected token') || err.message.includes('Unexpected end')) throw new EconomyError(this.errors.wrongStorageData)
                            else {
                                reject(err)
                                throw err
                            }
                        }
                    }, this.options.updateCountdown)
                    this.interval = interval
                }
                module.exports.version = require('../package.json').version
                module.exports.docs = this.docs
                this.ready = true
                this.emit('ready')
                return resolve(true)
            } catch (err) {
                this.errored = true
                reject(err)
            }
        })
    }
}

/**
 * Default Economy options object.
 * @typedef {Object} EconomyOptions Default Economy options object.
 * @property {String} storagePath Full path to a JSON file. Default: './storage.json'.
 * @property {Boolean} checkStorage Checks the if database file exists and if it has errors. Default: true
 * @property {Number} dailyCooldown Cooldown for Daily Command (in ms). Default: 24 Hours (60000 * 60 * 24) ms
 * @property {Number} workCooldown Cooldown for Work Command (in ms). Default: 1 Hour (60000 * 60) ms
 * @property {Number} dailyAmount Amount of money for Daily Command. Default: 100.
 * @property {Number} weeklyCooldown Cooldown for Weekly Command (in ms). Default: 7 Days (60000 * 60 * 24 * 7) ms
 * @property {Number} weeklyAmount Amount of money for Weekly Command. Default: 1000.
 * @property {Number | Array} workAmount Amount of money for Work Command. Default: [10, 50].
 * @property {Number} updateCountdown Checks for if storage file exists in specified time (in ms). Default: 1000.
 * @property {String} dateLocale The region (example: 'ru'; 'en') to format date and time. Default: 'ru'.
 * @property {UpdaterOptions} updater Update Checker options object.
 * @property {ErrorHandlerOptions} errorHandler Error Handler options object.
 */

/**
 * @typedef {Object} UpdaterOptions
 * @property {Boolean} checkUpdates Sends the update state message in console on start. Default: true.
 * @property {Boolean} upToDateMessage Sends the message in console on start if module is up to date. Default: true.
 */

/**
 * @typedef {Object} ErrorHandlerOptions
 * @property {Boolean} handleErrors Handles all errors on startup. Default: true.
 * @property {Number} attempts Amount of attempts to load the module. Use 'null' for infinity attempts. Default: 5.
 * @property {Number} time Time between every attempt to start the module (in ms). Default: 3000.
 */

/**
 * The Economy class.
 * @type {Economy}
 */
module.exports = Economy
