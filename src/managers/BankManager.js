const Emitter = require('../classes/util/Emitter')
const EconomyError = require('../classes/util/EconomyError')

const FetchManager = require('./FetchManager')
const DatabaseManager = require('./DatabaseManager')

const errors = require('../structures/errors')


/**
* Bank manager methods class.
* @extends {Emitter}
*/
class BankManager extends Emitter {

    /**
     * Bank Manager.
     *
     * @param {object} options Economy configuration.
     * @param {string} options.storagePath Full path to a JSON file. Default: './storage.json'.
     */
    constructor(options = {}) {
        super(options)


        /**
         * Economy configuration.
         * @type {EconomyConfiguration}
         * @private
         */
        this.options = options

        /**
         * Fetch manager.
         * @type {FetchManager}
         * @private
         */
        this.fetcher = new FetchManager(options)

        /**
         * Database manager.
         * @type {DatabaseManager}
         * @private
         */
        this.database = new DatabaseManager(options)
    }

    /**
    * Fetches the user's bank balance.
    * @param {string} memberID Member ID.
    * @param {string} guildID Guild ID.
    * @returns {number} User's bank balance
    */
    fetch(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        return this.fetcher.fetchBank(memberID, guildID)
    }

    /**
    * Gets the user's bank balance.
    *
    * This method is an alias of `BankManager.fetch()` method.
    * @param {string} memberID Member ID.
    * @param {string} guildID Guild ID.
    * @returns {number} User's bank balance
    */
    get(memberID, guildID) {
        return this.fetch(memberID, guildID)
    }

    /**
     * Sets the money amount on user's bank balance.
     * @param {number} amount Money amount.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why you set the money.
     * @returns {number} Money amount.
     */
    set(amount, memberID, guildID, reason = null) {
        const bank = this.fetcher.fetchBank(memberID, guildID)

        if (isNaN(amount)) {
            throw new EconomyError(errors.invalidType('amount', 'number', amount), 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        this.database.set(`${guildID}.${memberID}.bank`, Number(amount))

        this.emit('bankSet', {
            type: 'set',
            guildID,
            memberID,
            amount: Number(amount),
            bank,
            reason
        })

        return amount
    }

    /**
     * Adds the money amount on user's bank balance.
     * @param {number} amount Money amount.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why you add the money.
     * @returns {number} Money amount.
     */
    add(amount, memberID, guildID, reason = null) {
        const bank = this.fetcher.fetchBank(memberID, guildID)

        if (isNaN(amount)) {
            throw new EconomyError(errors.invalidType('amount', 'number', amount), 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        this.database.add(`${guildID}.${memberID}.bank`, Number(amount))

        this.emit('bankAdd', {
            type: 'add',
            guildID,
            memberID,
            amount: Number(amount),
            bank: bank + amount,
            reason
        })

        return amount
    }

    /**
     * Subtracts the money amount on user's bank balance.
     * @param {number} amount Money amount.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why you subtract the money.
     * @returns {number} Money amount.
     */
    subtract(amount, memberID, guildID, reason = null) {
        const bank = this.fetcher.fetchBank(memberID, guildID)

        if (isNaN(amount)) {
            throw new EconomyError(errors.invalidType('amount', 'number', amount), 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        this.database.subtract(`${guildID}.${memberID}.bank`, Number(amount))

        this.emit('bankSubtract', {
            type: 'subtract',
            guildID,
            memberID,
            amount: Number(amount),
            bank: bank + amount,
            reason
        })

        return amount
    }

    /**
     * Withdraws the specified amount of money.
     * @param {number} amount Money amount.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason of the operation.
     * @returns {number} Money amount.
     */
    withdraw(amount, memberID, guildID, reason = null) {
        const balance = this.fetcher.fetchBalance(memberID, guildID)
        const bank = this.fetcher.fetchBank(memberID, guildID)

        if (isNaN(amount)) {
            throw new EconomyError(errors.invalidType('amount', 'number', amount), 'INVALID_TYPE')
        }

        if (amount < 0) {
            throw new EconomyError(errors.invalidTypes.withdrawInvalidInput, 'INVALID_INPUT')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        this.database.subtract(`${guildID}.${memberID}.money`, amount)
        this.database.add(`${guildID}.${memberID}.bank`, amount)

        this.emit('balanceAdd', {
            type: 'add',
            guildID,
            memberID,
            amount: Number(amount),
            balance: balance + amount,
            reason
        })

        this.emit('bankSubtract', {
            type: 'subtract',
            guildID,
            memberID,
            amount: Number(amount),
            balance: bank - amount,
            reason
        })

        return amount
    }

    /**
     * Gets a balance leaderboard for specified server.
     * @param {string} guildID Guild ID.
     * @returns {BankLeaderboard[]} Sorted leaderboard array.
     */
    leaderboard(guildID) {
        const lb = []
        const data = this.fetcher.fetchAll()

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const guildData = data[guildID]
        if (!guildData) return []

        const users = Object.keys(guildData).filter(key => key !== 'settings' && key !== 'shop')
        const ranks = Object.values(guildData).map(user => user.bank).filter(userID => !isNaN(userID))

        for (const rank in ranks) lb.push({
            userID: users[rank],
            money: Number(ranks[rank])
        })

        return lb
            .sort((previous, current) => current.money - previous.money)
            .filter(entry => entry.userID !== 'shop' && entry.userID !== 'settings')
    }
}


/**
 * Bank leaderboard object.
 * @typedef {object} BankLeaderboard
 * @property {number} index User's position in the leaderboard.
 * @property {string} userID User ID.
 * @property {number} money Amount of money.
 */

/**
 * Bank manager class.
 * @type {BankManager}
 */
module.exports = BankManager
