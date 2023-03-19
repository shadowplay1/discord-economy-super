const Emitter = require('../classes/util/Emitter')

const EconomyError = require('../classes/util/EconomyError')
const errors = require('../structures/errors')

const CurrencyManager = require('./CurrencyManager')
const Currency = require('../classes/Currency')


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

        /**
         * Currency Manager.
         * @type {CurrencyManager}
         * @private
         */
        this._currencies = new CurrencyManager(options, database, cache)
    }

    /**
     * Returns a factory with `get`, `getCurrency` (to get a currency info object), 
     * `set`, `add` and `subtract` methods to work with custom currencies.
     * 
     * @param {string | number} currencyID Currency ID, its name or its symbol.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {CurrencyFactory} Currency management factory object.
     */
    currency(currencyID, memberID, guildID) {
        const currencies = this._currencies

        const database = this.database
        const cache = this.cache

        const options = this.options

        return {
            get() {
                return currencies.getBalance(currencyID, memberID, guildID)
            },

            async getCurrency() {
                const currency = await currencies.get(currencyID, guildID)
                return new Currency(currency.id, guildID, options, currency, database, cache)
            },

            set(amount, reason) {
                return currencies.setBalance(currencyID, amount, memberID, guildID, reason)
            },

            add(amount, reason) {
                return currencies.addBalance(currencyID, amount, memberID, guildID, reason)
            },

            subtract(amount, reason) {
                return currencies.subtractBalance(currencyID, amount, memberID, guildID, reason)
            }
        }
    }

    /**
    * Fetches the user's balance.
    * @param {string} memberID Member ID.
    * @param {string} guildID Guild ID.
    * @returns {Promise<number>} User's balance.
    */
    async fetch(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const result = await this.database.fetch(`${guildID}.${memberID}.money`)
        return result || 0
    }

    /**
    * Gets the user's balance.
    * 
    * This method is an alias of `BalanceManager.fetch()` method.
    * @param {string} memberID Member ID.
    * @param {string} guildID Guild ID.
    * @returns {Promise<number>} User's balance.
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
            throw new EconomyError(errors.invalidType('amount', 'number', amount), 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
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
            throw new EconomyError(errors.invalidType('amount', 'number', amount), 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
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
            throw new EconomyError(errors.invalidType('amount', 'number', amount), 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
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
            throw new EconomyError(errors.invalidType('amount', 'number', amount), 'INVALID_TYPE')
        }

        if (amount < 0) {
            throw new EconomyError(errors.invalidTypes.depositInvalidInput, 'INVALID_INPUT')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
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
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
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
            .filter(entry => entry.userID !== 'shop' && entry.userID !== 'settings')
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
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        if (isNaN(amount)) {
            throw new EconomyError(errors.invalidType('amount', 'number', amount), 'INVALID_TYPE')
        }

        if (typeof senderMemberID !== 'string') {
            throw new EconomyError(errors.invalidType('senderMemberID', 'string', senderMemberID), 'INVALID_TYPE')
        }

        if (typeof receiverMemberID !== 'string') {
            throw new EconomyError(errors.invalidType('receiverMemberID', 'string', receiverMemberID), 'INVALID_TYPE')
        }

        await this.add(amount, receiverMemberID, guildID, receivingReason || 'receiving money from user')
        await this.subtract(amount, senderMemberID, guildID, sendingReason || 'sending money to user')

        await this.cache.balance.updateMany({
            memberID: senderMemberID,
            guildID
        }, {
            memberID: receiverMemberID,
            guildID
        })

        this.cache.users.updateMany({
            memberID: senderMemberID,
            guildID
        }, {
            memberID: receiverMemberID,
            guildID
        })

        const [senderBalance, receiverBalance] = [
            this.cache.balance.get({
                memberID: senderMemberID,
                guildID
            })?.money || 0,

            this.cache.balance.get({
                memberID: receiverMemberID,
                guildID
            })?.money || 0
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
 * @typedef {Object} CurrencyObject
 * @property {number} id Currency ID.
 * @property {string} guildID Guild ID.
 * @property {string} name Currency name.
 * @property {string} [symbol] Currency symbol.
 * @property {object} balances Currency balances object.
 * @property {object} custom Custom currency data object.
 */

/**
 * @typedef {object} CurrencyFactory
 * @property {FactoryGet} get Gets the currency balance.
 * @property {FactoryGetCurrency} getCurrency Gets the currency object.
 * @property {FactorySet} set Sets the currency balance.
 * @property {FactoryAdd} add Adds the money on the currency balance.
 * @property {FactorySubtract} subtract Subtracts the money from the currency balance.
 */
/**
 * @callback FactoryGet
 * @returns {Promise<number>} Currency balance.
 */

/**
 * @callback FactoryGetCurrency
 * @returns {Promise<Currency>} Currency data object.
 */

/**
 * @callback FactorySet
 * @param {number} amount Amount of money to set.
 * @param {string} [reason] The reason why the money was set.
 * @returns {Promise<number>} Updated currency balance.
 */

/**
 * @callback FactoryAdd
 * @param {number} amount Amount of money to add.
 * @param {string} [reason] The reason why the money was added.
 * @returns {Promise<number>} Updated currency balance.
 */

/**
 * @callback FactorySubtract
 * @param {number} amount Amount of money to subtract.
 * @param {string} [reason] The reason why the money was subtracted.
 * @returns {Promise<number>} Updated currency balance.
 */


/**
 * Balance manager class.
 * @type {BalanceManager}
 */
module.exports = BalanceManager
