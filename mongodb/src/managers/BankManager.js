const Emitter = require('../classes/util/Emitter')

const EconomyError = require('../classes/util/EconomyError')
const errors = require('../structures/errors')

/**
* Bank manager methods class.
* @extends {Emitter}
*/
class BankManager extends Emitter {

    /**
     * Bank Manager.
     * @param {object} options Economy configuration.
     * @param {DatabaseManager} database Database manager.
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
    * Fetches the user's bank balance.
    * @param {string} memberID Member ID.
    * @param {string} guildID Guild ID.
    * @returns {Promise<number>} User's bank balance.
    */
    async fetch(memberID, guildID) {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const result = await this.database.fetch(`${guildID}.${memberID}.bank`)
        return result || 0
    }

    /**
    * Gets the user's bank balance.
    * 
    * This method is an alias of `BankManager.fetch()` method.
    * @param {string} memberID Member ID.
    * @param {string} guildID Guild ID.
    * @returns {Promise<number>} User's bank balance
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
     * @returns {Promise<number>} Money amount.
     */
    async set(amount, memberID, guildID, reason = null) {
        const bank = await this.fetch(memberID, guildID)

        if (isNaN(amount)) {
            throw new EconomyError(errors.invalidType('amount', 'number', amount), 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        await this.database.set(`${guildID}.${memberID}.bank`, Number(amount))

        this.cache.updateMany(['bank', 'balance', 'users'], {
            guildID,
            memberID,
        })

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
     * @returns {Promise<number>} Money amount.
     */
    async add(amount, memberID, guildID, reason = null) {
        const bank = this.fetch(memberID, guildID)

        if (isNaN(amount)) {
            throw new EconomyError(errors.invalidType('amount', 'number', amount), 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        await this.database.add(`${guildID}.${memberID}.bank`, Number(amount))

        this.cache.updateMany(['bank', 'balance', 'users'], {
            guildID,
            memberID,
        })

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
     * @returns {Promise<number>} Money amount.
     */
    async subtract(amount, memberID, guildID, reason = null) {
        const bank = await this.fetch(memberID, guildID)

        if (isNaN(amount)) {
            throw new EconomyError(errors.invalidType('amount', 'number', amount), 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        await this.database.subtract(`${guildID}.${memberID}.bank`, Number(amount))

        this.cache.updateMany(['bank', 'balance', 'users'], {
            guildID,
            memberID,
        })

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
     * @returns {Promise<number>} Money amount.
     */
    async withdraw(amount, memberID, guildID, reason = null) {
        const balance = await this.fetch(memberID, guildID)
        const bank = await this.database.get(`${guildID}.${memberID}.bank`)

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

        await this.database.add(`${guildID}.${memberID}.money`, amount)
        await this.database.subtract(`${guildID}.${memberID}.bank`, amount)

        this.cache.updateMany(['users', 'bank', 'balance'], {
            memberID,
            guildID
        })

        this.emit('bankSubtract', {
            type: 'subtract',
            guildID,
            memberID,
            amount: Number(amount),
            balance: bank - amount,
            reason
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
     * Gets a balance leaderboard for specified server.
     * @param {string} guildID Guild ID.
     * @returns {Promise<BankLeaderboard[]>} Sorted leaderboard array.
     */
    async leaderboard(guildID) {
        const lb = []
        const data = await this.database.all()

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const guildData = data[guildID]
        if (!guildData) return []

        const users = Object.keys(guildData)
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
