
const DatabaseManager = require('../../managers/DatabaseManager')
const BalanceManager = require('../../managers/BalanceManager')


/**
 * User balance class.
 */
class Balance {

    /**
     * User balance class.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyOptions} ecoOptions Economy configuration.
     * @param {DatabaseManager} database Database manager.
     * @param {CacheManager} cache Cache Manager.
     */
    constructor(memberID, guildID, ecoOptions, database, cache) {

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
         * Balance Manager.
         * @type {BalanceManager}
         * @private
         */
        this._balance = new BalanceManager(ecoOptions, database, cache)
    }

    /**
     * Sets the money amount on user's balance.
     * @param {number} amount Money amount
     * @param {string} [reason] The reason why you set the money.
     * @returns {Promise<number>} Money amount
     */
    set(amount, reason) {
        return this._balance.set(amount, this.memberID, this.guildID, reason)
    }

    /**
     * Adds the money amount on user's balance.
     * @param {number} amount Money amount.
     * @param {string} [reason] The reason why you add the money.
     * @returns {Promise<number>} Money amount.
     */
    add(amount, reason) {
        return this._balance.add(amount, this.memberID, this.guildID, reason)
    }

    /**
     * Subtracts the money amount on user's balance.
     * @param {number} amount Money amount.
     * @param {string} [reason] The reason why you subtract the money.
     * @returns {Promise<number>} Money amount.
     */
    subtract(amount, reason) {
        return this._balance.subtract(amount, this.memberID, this.guildID, reason)
    }

    /**
     * Fetches the user's balance.
     * @returns {Promise<number>} User's balance.
     */
    get() {
        return this._balance.get(this.memberID, this.guildID) || 0
    }

    /**
     * Fetches the user's balance.
     * 
     * This method is an alias for 'Balance.get()' method
     * @returns {Promise<number>} User's balance.
     */
    fetch() {
        return this.get()
    }

    /**
     * Sends the money to a specified user.
     * @param {UserTransferringOptions} options Transferring options.
     * @returns {Promise<TransferringResult>} Transferring result object.
     */
    transfer(options) {
        return this._balance.transfer(this.guildID, options)
    }
}


/**
 * @typedef {Object} TransferringResult
 * @property {boolean} success Whether the transfer was successful or not.
 * @property {string} guildID Guild ID.
 * @property {number} amount Amount of money that was sent.
 * @property {string} senderMemberID Sender member ID.
 * @property {string} sendingReason Sending reason.
 * @property {string} receivingReason Receiving reason.
 * @property {number} senderBalance New sender balance.
 * @property {number} receiverBalance New receiver balance.
 */

/**
 * @typedef {object} EconomyOptions Default Economy configuration.
 * @property {string} [storagePath='./storage.json'] Full path to a JSON file. Default: './storage.json'
 * @property {boolean} [checkStorage=true] Checks the if database file exists and if it has errors. Default: true
 * @property {number} [dailyCooldown=86400000] 
 * Cooldown for Daily Command (in ms). Default: 24 hours (60000 * 60 * 24 ms)
 * 
 * @property {number} [workCooldown=3600000] Cooldown for Work Command (in ms). Default: 1 hour (60000 * 60 ms)
 * @property {Number | Number[]} [dailyAmount=100] Amount of money for Daily Command. Default: 100.
 * @property {number} [weeklyCooldown=604800000] 
 * Cooldown for Weekly Command (in ms). Default: 7 days (60000 * 60 * 24 * 7 ms)
 * 
 * @property {Number | Number[]} [weeklyAmount=100] Amount of money for Weekly Command. Default: 1000.
 * @property {Number | Number[]} [workAmount=[10, 50]] Amount of money for Work Command. Default: [10, 50].
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
 * @property {ErrorHandlerOptions} [errorHandler=ErrorHandlerOptions] Error handler configuration.
 * @property {CheckerOptions} [optionsChecker=CheckerOptions] Configuration for an 'Economy.utils.checkOptions' method.
 * @property {boolean} [debug=false] Enables or disables the debug mode.
 */

/**
 * Transferring options.
 * @typedef {object} UserTransferringOptions
 * @property {number} amount Amount of money to send.
 * @property {string} senderMemberID A member ID who will send the money.
 * @property {string} [sendingReason='sending money to user'] 
 * The reason of subtracting the money from sender. (example: "sending money to {user}")
 * @property {string} [receivingReason='receiving money from user']
 * The reason of adding a money to receiver. (example: "receiving money from {user}")
 */

/**
 * User balance class.
 * @type {Balance}
 */
module.exports = Balance
