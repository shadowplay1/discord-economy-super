const Emitter = require('../classes/util/Emitter')

const EconomyError = require('../classes/util/EconomyError')
const errors = require('../structures/errors')

const DatabaseManager = require('./DatabaseManager')
const CacheManager = require('./CacheManager')


/**
* Balance manager methods class.
* @extends {Emitter}
*/
class BalanceManager extends Emitter {

    /**
     * Balance Manager.
     * @param {object} options Economy configuration.
     * @param {DatabaseManager} database Database manager.
     * @param {DatabaseManager} cache Cache manager.
     */
    constructor(options = {}, database, cache) {
        super(options)

        /**
         * Economy configuration.
         * @type {EconomyConfiguration}
         * @private
         */
        this.options = options

        /**
         * Database manager.
         * @type {DatabaseManager}
         * @private
         */
        this.database = database

        /**
         * Cache manager.
         * @type {CacheManager}
         * @private
         */
        this.cache = cache
    }

    /**
    * Fetches the user's balance.
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @returns {Promise<number>} User's balance
    */
    async fetch(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const result = await this.database.fetch(`${guildID}.${memberID}.money`)
        return result || 0
    }

    /**
    * Gets the user's balance.
    * 
    * This method is an alias of `BalanceManager.fetch()` method.
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @returns {Promise<number>} User's balance
    */
    get(memberID, guildID) {
        return this.fetch(memberID, guildID)
    }

    /**
     * Sets the money amount on user's balance.
     * @param {number} amount Money amount.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why you set the money.
     * @returns {Promise<number>} Money amount.
     */
    async set(amount, memberID, guildID, reason = null) {
        const balance = await this.fetch(memberID, guildID)

        if (isNaN(amount)) {
            throw new EconomyError(errors.invalidTypes.amount + typeof amount, 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        await this.database.set(`${guildID}.${memberID}.money`, amount)

        this.cache.updateMany(['users', 'balance'], {
            memberID,
            guildID
        })

        this.emit('balanceSet', {
            type: 'set',
            guildID,
            memberID,
            amount: Number(amount),
            balance,
            reason
        })

        return amount
    }

    /**
     * Adds the money amount on user's balance.
     * @param {number} amount Money amount.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why you add the money.
     * @returns {Promise<number>} Money amount.
     */
    async add(amount, memberID, guildID, reason = null) {
        const balance = await this.fetch(memberID, guildID)

        if (isNaN(amount)) {
            throw new EconomyError(errors.invalidTypes.amount + typeof amount, 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        await this.database.add(`${guildID}.${memberID}.money`, amount)

        this.cache.updateMany(['users', 'balance'], {
            memberID,
            guildID
        })

        this.emit('balanceAdd', {
            type: 'add',
            guildID,
            memberID,
            amount: Number(amount),
            balance: balance + amount,
            reason
        })

        return amount
    }

    /**
     * Subtracts the money amount on user's balance.
     * @param {number} amount Money amount.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why you subtract the money.
     * @returns {Promise<number>} Money amount.
     */
    async subtract(amount, memberID, guildID, reason = null) {
        const balance = await this.fetch(memberID, guildID)

        if (isNaN(amount)) {
            throw new EconomyError(errors.invalidTypes.amount + typeof amount, 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        await this.database.subtract(`${guildID}.${memberID}.money`, amount)

        this.cache.updateMany(['users', 'balance'], {
            memberID,
            guildID
        })

        this.emit('balanceSubtract', {
            type: 'subtract',
            guildID,
            memberID,
            amount: Number(amount),
            balance: balance - amount,
            reason
        })

        return amount
    }

    /**
     * Deposits the specified amount of money.
     * @param {number} amount Money amount.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason of the operation.
     * @returns {Promise<number>} Money amount.
     */
    async deposit(amount, memberID, guildID, reason = null) {
        const balance = await this.fetch(memberID, guildID)
        const bank = await this.database.get(`${guildID}.${memberID}.bank`)

        if (isNaN(amount)) {
            throw new EconomyError(errors.invalidTypes.amount + typeof amount, 'INVALID_TYPE')
        }

        if (amount < 0) {
            throw new EconomyError(errors.invalidTypes.depositInvalidInput, 'INVALID_INPUT')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.memberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        await this.database.subtract(`${guildID}.${memberID}.money`, amount)
        await this.database.add(`${guildID}.${memberID}.bank`, amount)

        this.cache.updateMany(['users', 'balance', 'bank'], {
            memberID,
            guildID
        })

        this.emit('balanceSubtract', {
            type: 'subtract',
            guildID,
            memberID,
            amount: Number(amount),
            balance: balance - amount,
            reason
        })

        this.emit('bankAdd', {
            type: 'add',
            guildID,
            memberID,
            amount: Number(amount),
            balance: bank + amount,
            reason
        })

        return amount
    }

    /**
     * Gets a balance leaderboard for specified guild.
     * @param {string} guildID Guild ID.
     * @returns {Promise<BalanceLeaderboard[]>} Sorted leaderboard array.
     */
    async leaderboard(guildID) {
        const lb = []
        const data = await this.database.all()

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        const guildData = data[guildID]
        if (!guildData) return []

        const users = Object.keys(guildData).filter(key => key !== 'settings' && key !== 'shop')
        const ranks = Object.values(guildData).map(user => user.money).filter(userID => !isNaN(userID))

        for (const rank in ranks) lb.push({
            userID: users[rank],
            money: Number(ranks[rank])
        })

        return lb
            .sort((previous, current) => current.money - previous.money)
            .filter(entry => entry.userID !== 'shop')
    }

    /**
     * Transfers the money to a specified user.
     * @param {string} guildID Guild ID.
     * @param {TransferingOptions} options Transfering options.
     * @returns {Promise<TransferingResult>} Transfering result object.
     */
    async transfer(guildID, options) {
        const {
            amount, senderMemberID,
            receiverMemberID,
            sendingReason, receivingReason
        } = options || {}

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof guildID, 'INVALID_TYPE')
        }

        if (isNaN(amount)) {
            throw new EconomyError(errors.invalidTypes.amount + typeof amount, 'INVALID_TYPE')
        }

        if (typeof senderMemberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.senderMemberID + typeof memberID, 'INVALID_TYPE')
        }

        if (typeof receiverMemberID !== 'string') {
            throw new EconomyError(errors.invalidTypes.receiverMemberID + typeof memberID, 'INVALID_TYPE')
        }

        this.add(amount, receiverMemberID, guildID, receivingReason || 'receiving money from user')
        await this.subtract(amount, senderMemberID, guildID, sendingReason || 'sending money to user')

        await this.cache.balance.updateMany({
            senderMemberID,
            guildID
        }, {
            receiverMemberID,
            guildID
        })

        this.cache.users.updateMany({
            senderMemberID,
            guildID
        }, {
            receiverMemberID,
            guildID
        })

        const [senderBalance, receiverBalance] = [
            this.cache.balance.get({
                senderMemberID,
                guildID
            }).money,

            this.cache.balance.get({
                receiverMemberID,
                guildID
            }).money
        ]

        return {
            success: true,
            guildID,

            senderBalance,
            receiverBalance,

            amount,

            senderMemberID,
            receiverMemberID,

            sendingReason,
            receivingReason,
        }
    }
}


/**
 * @typedef {Object} TransferingResult
 * @property {boolean} success Whether the transfer was successful or not.
 * @property {string} guildID Guild ID.
 * @property {number} amount Amount of money that was sent.
 * @property {string} senderMemberID Sender member ID.
 * @property {string} receiverMemberID Receiver member ID.
 * @property {string} sendingReason Sending reason.
 * @property {string} receivingReason Receiving reason.
 * @property {number} senderBalance New sender balance.
 * @property {number} receiverBalance New receiver balance.
 */

/**
 * Transfering options.
 * @typedef {object} TransferingOptions
 * @property {number} amount Amount of money to send.
 * @property {string} senderMemberID A member ID who will send the money.
 * @property {string} receiverMemberID A member ID who will receive the money.
 * @property {string} [sendingReason='sending money to user'] 
 * The reason of subtracting the money from sender. (example: "sending money to {user}")
 * @property {string} [receivingReason='receiving money from user']
 * The reason of adding a money to receiver. (example: "receiving money from {user}")
 */

/**
 * Balance leaderboard object.
 * @typedef {object} BalanceLeaderboard
 * @property {number} index User's place in the leaderboard.
 * @property {string} userID User ID.
 * @property {number} money Amount of money.
 */


/**
 * Balance manager class.
 * @type {BalanceManager}
 */
module.exports = BalanceManager
