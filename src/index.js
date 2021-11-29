const { existsSync, readFileSync, writeFileSync } = require('fs')
const { promisify } = require('util')


const DatabaseManager = require('./managers/DatabaseManager')
const FetchManager = require('./managers/FetchManager')

const UtilsManager = require('./managers/UtilsManager')

const BalanceManager = require('./managers/BalanceManager')
const BankManager = require('./managers/BankManager')

const RewardManager = require('./managers/RewardManager')
const CooldownManager = require('./managers/CooldownManager')

const ShopManager = require('./managers/ShopManager')
const InventoryManager = require('./managers/InventoryManager')

const SettingsManager = require('./managers/SettingsManager')


const Emitter = require('./classes/Emitter')
const EconomyError = require('./classes/EconomyError')

const errors = require('./structures/errors')

const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
}

/**
 * The main Economy class.
 */
class Economy extends Emitter {

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
        this.version = require('../package.json').version

        /**
         * Link to the module's documentation website.
         * @type {String}
         */
        this.docs = 'https://des-docs.tk'

        /**
        * Utils manager methods object.
        * @type {UtilsManager}
        */
        this.utils = new UtilsManager(options)

        /**
         * Constructor options object.
         * @type {?EconomyOptions}
         */
        this.options = this.utils.checkOptions(this.options?.optionsChecker, options)

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
        * Balance methods object.
        * @type {BalanceManager}
        */
        this.balance = null

        /**
        * Bank balance methods object.
        * @type {BankManager}
        */
        this.bank = null

        /**
        * Fetch manager methods object.
        * @type {FetchManager}
        */
        this.fetcher = null

        /**
        * Database manager methods object.
        * @type {DatabaseManager}
        */
        this.database = null

        /**
        * Shop manager methods object.
        * @type {ShopManager}
        */
        this.shop = null

        /**
        * Inventory manager methods object.
        * @type {InventoryManager}
        */
        this.inventory = null

        /**
        * Balance methods object.
        * @type {RewardManager}
        */
        this.rewards = null

        /**
        * Bank balance methods object.
        * @type {CooldownManager}
        */
        this.cooldowns = null

        /**
        * Settings manager methods object.
        * @type {SettingsManager}
        */
        this.settings = null

        this.init()
    }

    /**
     * Kills the Economy instance.
     * @returns {Economy} Economy instance.
     */
    kill() {
        if (!this.ready) return false

        clearInterval(this.interval)
        this.ready = false

        this.EconomyError = null
        this.interval = null

        this.balance = null
        this.bank = null

        this.utils = null
        this.fetcher = null
        this.database = null

        this.shop = null
        this.inventory = null

        this.rewards = null

        this.cooldowns = null
        this.settings = null

        this.emit('destroy')

        return this
    }

    /**
     * Starts the module.
     * @returns {Promise<Boolean>} If started successfully: true; else: Error instance.
     */
    init() {
        let attempt = 0

        const attempts =
            this.options?.errorHandler?.attempts == 0 ?
                Infinity :
                this.options?.errorHandler?.attempts

        const time = this.options?.errorHandler?.time
        const retryingTime = (time / 1000).toFixed(1)

        const sleep = promisify(setTimeout)

        const check = () => new Promise(resolve => {
            this._init().then(x => {

                if (x) {
                    this.errored = false
                    this.ready = true
                    return console.log(`${colors.green}Started successfully! :)`)
                }

                resolve(x)
            }).catch(err => resolve(err))
        })

        return this.options?.errorHandler?.handleErrors ? this._init().catch(async err => {
            if (!(err instanceof EconomyError)) this.errored = true

            console.log(`${colors.red}Failed to start the module:${colors.cyan}`)
            console.log(err)

            if (err.message.includes('This module is supporting only Node.js v14 or newer.')) process.exit(1)
            else console.log(`${colors.magenta}Retrying in ${retryingTime} seconds...${colors.reset}`)

            while (attempt < attempts && attempt !== -1) {
                await sleep(time)

                if (attempt < attempts) check().then(async res => {
                    if (res.message) {

                        attempt++

                        console.log(`${colors.red}Failed to start the module:${colors.cyan}`)
                        console.log(err)
                        console.log(`\x1b[34mAttempt ${attempt}${attempts == Infinity ? '.' : `/${attempts}`}`)

                        if (attempt == attempts) {
                            console.log(
                                `${colors.green}Failed to start the module within` +
                                `${attempts} attempts...${colors.reset}`
                            )

                            process.exit(1)
                        }

                        console.log(`${colors.magenta}Retrying in ${retryingTime} seconds...`)
                        await sleep(time)

                    } else attempt = -1
                })
            }
        }) : this._init()
    }

    /**
     * Initializates the module.
     * @returns {Promise<boolean | Error>} If started successfully: true; else: Error instance.
     * @private
     */
    _init() {
        const updateCountdown = this.options?.updateCountdown
        const isReservedStorage =
            !this.options?.storagePath?.includes('testStorage123') &&
            !__dirname.includes('discord-economy-super\\tests')

        const isPathReserved =
            !__dirname.includes('discord-economy-super\\tests') &&
            !__dirname.includes('discord-economy-super/tests')

        const isFileExist = existsSync(this.options?.storagePath)

        return new Promise(async (resolve, reject) => {
            try {
                if (this.errored) return
                if (this.ready) return

                if (this.options?.checkStorage == undefined ? true : this.options?.checkStorage) {
                    if (!isFileExist && isReservedStorage) writeFileSync(this.options?.storagePath, '{}')

                    try {
                        if (this.options?.storagePath?.includes('testStorage123') && isPathReserved) {
                            return reject(new EconomyError(errors.reservedName('testStorage123')))
                        }

                        if (this.options?.storagePath?.endsWith('package.json')) {
                            return reject(new EconomyError(errors.reservedName('package.json')))
                        }

                        if (this.options?.storagePath?.endsWith('package-lock.json')) {
                            return reject(new EconomyError(errors.reservedName('package-lock.json')))
                        }

                        const data = readFileSync(this.options?.storagePath)
                        JSON.parse(data.toString())

                    } catch (err) {
                        if (err.message.includes('Unexpected') && err.message.includes('JSON')) {
                            return reject(new EconomyError(errors.wrongStorageData))
                        }

                        else return reject(err)
                    }
                }

                /* eslint-disable max-len */
                if (this.options?.updater?.checkUpdates) {
                    const version = await this.utils.checkUpdates()
                    if (!version.updated) {

                        console.log('\n\n')
                        console.log(colors.green + '╔══════════════════════════════════════════════════════════╗')
                        console.log(colors.green + '║ @ discord-economy-super                           - [] X ║')
                        console.log(colors.green + '║══════════════════════════════════════════════════════════║')
                        console.log(colors.yellow + `║                 The module is ${colors.red}out of date!${colors.yellow}               ║`)
                        console.log(colors.magenta + '║                  New version is available!               ║')
                        console.log(colors.blue + `║                       ${version.installedVersion} --> ${version.packageVersion}                    ║`)
                        console.log(colors.cyan + '║          Run "npm i discord-economy-super@latest"        ║')
                        console.log(colors.cyan + '║                         to update!                       ║')
                        console.log(colors.white + '║               View the full changelog here:              ║')
                        console.log(colors.red + `║  https://des-docs.tk/#/docs/main/${version.packageVersion}/general/changelog ║`)
                        console.log(colors.green + '╚══════════════════════════════════════════════════════════╝\x1b[37m')
                        console.log('\n\n')

                    } else {
                        if (this.options?.updater?.upToDateMessage) {

                            console.log('\n\n')
                            console.log(colors.green + '╔══════════════════════════════════════════════════════════╗')
                            console.log(colors.green + '║ @ discord-economy-super                           - [] X ║')
                            console.log(colors.green + '║══════════════════════════════════════════════════════════║')
                            console.log(colors.yellow + `║                  The module is ${colors.cyan}up to date!${colors.yellow}               ║`)
                            console.log(colors.magenta + '║                  No updates are available.               ║')
                            console.log(colors.blue + `║                  Current version is ${version.packageVersion}.               ║`)
                            console.log(colors.cyan + '║                           Enjoy!                         ║')
                            console.log(colors.white + '║               View the full changelog here:              ║')
                            console.log(colors.red + `║  https://des-docs.tk/#/docs/main/${version.packageVersion}/general/changelog ║`)
                            console.log(colors.green + '╚══════════════════════════════════════════════════════════╝\x1b[37m')
                            console.log('\n\n')

                        }
                    }
                }

                if (this.options?.checkStorage == undefined ? true : this.options?.checkStorage) {
                    const storageExists = existsSync(this.options?.storagePath)

                    const interval = setInterval(() => {
                        if (!storageExists) {
                            try {
                                const isPathReserved =
                                    this.options?.storagePath?.includes('testStorage123') &&
                                    !__dirname.includes('discord-economy-super\\tests')

                                if (isPathReserved) {
                                    throw new EconomyError(errors.reservedName('testStorage123'))
                                }

                                if (this.options?.storagePath?.endsWith('package.json')) {
                                    throw new EconomyError(errors.reservedName('package.json'))
                                }

                                if (this.options?.storagePath?.endsWith('package-lock.json')) {
                                    throw new EconomyError(errors.reservedName('package-lock.json'))
                                }

                                writeFileSync(this.options?.storagePath, '{}', 'utf-8')
                            } catch (err) {
                                throw new EconomyError(errors.notReady)
                            }
                            console.log(`${colors.red}failed to find a database file; created another one...${colors.reset}`)
                        }

                        try {
                            if (!storageExists) writeFileSync(this.options?.storagePath, '{}', 'utf-8')

                            const data = readFileSync(this.options?.storagePath)
                            JSON.parse(data.toString())

                        } catch (err) {
                            if (err.message.includes('Unexpected token') ||
                                err.message.includes('Unexpected end')) reject(new EconomyError(errors.wrongStorageData))

                            else {
                                reject(err)
                                throw err
                            }
                        }

                    }, updateCountdown)
                    this.interval = interval
                }

                this.start()
                this.ready = true
                this.emit('ready')

                return resolve(true)

            } catch (err) {
                this.errored = true
                reject(err)
            }
        })
    }

    /**
     * Starts all the managers.
     * @returns {Boolean} If successfully started: true.
     * @private
     */
    start() {
        this.utils = new UtilsManager(this.options)

        this.balance = new BalanceManager(this.options)
        this.bank = new BankManager(this.options)

        this.fetcher = new FetchManager(this.options)
        this.database = new DatabaseManager(this.options)

        this.shop = new ShopManager(this.options)
        this.inventory = new InventoryManager(this.options)

        this.rewards = new RewardManager(this.options)
        this.cooldowns = new CooldownManager(this.options)

        this.settings = new SettingsManager(this.options)

        return true
    }
}

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
 * @typedef {Object} EconomyOptions Default Economy options object.
 * @property {String} [storagePath='./storage.json'] Full path to a JSON file. Default: './storage.json'
 * @property {Boolean} [checkStorage=true] Checks the if database file exists and if it has errors. Default: true
 * @property {Number} [dailyCooldown=86400000] Cooldown for Daily Command (in ms). Default: 24 Hours (60000 * 60 * 24) ms
 * @property {Number} [workCooldown=3600000] Cooldown for Work Command (in ms). Default: 1 Hour (60000 * 60) ms
 * @property {Number | Number[]} [dailyAmount=100] Amount of money for Daily Command. Default: 100.
 * @property {Number} [weeklyCooldown=604800000] Cooldown for Weekly Command (in ms). Default: 7 Days (60000 * 60 * 24 * 7) ms
 * @property {Number} [sellingItemPercent=75] 
 * Percent of the item's price it will be sold for. Default: 75.
 * 
 * @property {Boolean} deprecationWarnings 
 * If true, the deprecation warnings will be sent in the console. Default: true.
 * 
 * @property {Number | Number[]} [weeklyAmount=100] Amount of money for Weekly Command. Default: 1000.
 * @property {Number | Number[]} [workAmount=[10, 50]] Amount of money for Work Command. Default: [10, 50].
 * @property {Boolean} [subtractOnBuy=true] If true, when someone buys the item, their balance will subtract by item price. Default: false
 * 
 * @property {Number} [updateCountdown=1000] Checks for if storage file exists in specified time (in ms). Default: 1000.
 * @property {String} [dateLocale='en'] The region (example: 'ru' or 'en') to format the date and time. Default: 'en'.
 * @property {UpdaterOptions} [updater=UpdaterOptions] Update Checker options object.
 * @property {ErrorHandlerOptions} [errorHandler=ErrorHandlerOptions] Error Handler options object.
 * @property {CheckerOptions} [optionsChecker=CheckerOptions] Options object for an 'Economy.utils.checkOptions' method.
 */

/**
 * @typedef {Object} UpdaterOptions Updatee options object.
 * @property {Boolean} [checkUpdates=true] Sends the update state message in console on start. Default: true.
 * @property {Boolean} [upToDateMessage=true] Sends the message in console on start if module is up to date. Default: true.
 */

/**
 * @typedef {Object} ErrorHandlerOptions
 * @property {Boolean} [handleErrors=true] Handles all errors on startup. Default: true.
 * @property {Number} [attempts=5] Amount of attempts to load the module. Use 0 for infinity attempts. Default: 5.
 * @property {Number} [time=3000] Time between every attempt to start the module (in ms). Default: 3000.
 */

/**
 * @typedef {Object} CheckerOptions Options object for an 'Economy.utils.checkOptions' method.
 * @property {Boolean} [ignoreInvalidTypes=false] Allows the method to ignore the options with invalid types. Default: false.
 * @property {Boolean} [ignoreUnspecifiedOptions=false] Allows the method to ignore the unspecified options. Default: false.
 * @property {Boolean} [ignoreInvalidOptions=false] Allows the method to ignore the unexisting options. Default: false.
 * @property {Boolean} [showProblems=false] Allows the method to show all the problems in the console. Default: false. 
 * @property {Boolean} [sendLog=false] Allows the method to send the result in the console. Default: false.
 * @property {Boolean} [sendSuccessLog=false] Allows the method to send the result if no problems were found. Default: false.
 */

/**
 * The Economy class.
 * @type {Economy}
 */
module.exports = Economy