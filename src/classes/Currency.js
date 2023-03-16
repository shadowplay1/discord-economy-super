const defaultCurrencyObject = require('../structures/DefaultCurrencyObject')

const EconomyError = require('./util/EconomyError')
const errors = require('../structures/errors')

const Emitter = require('./util/Emitter')


/**
 * Currency class.
 * @extends {Emitter}
 */
class Currency extends Emitter {

    /**
     * @param {number} currencyID Currency ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} ecoOptions Economy configuration object.
     * @param {CurrencyObject} currencyObject Currency object.
     * @param {DatabaseManager} database Database manager.
     */
    constructor(currencyID, guildID, ecoOptions, currencyObject, database) {
        super()


        /**
         * Economy configuration.
         * @type {EconomyConfiguration}
         * @private
         */
        this.options = ecoOptions

        /**
         * Database manager.
         * @type {DatabaseManager}
         * @private
         */
        this.database = database

        /**
         * Raw currency object.
         * @type {CurrencyObject}
         */
        this.rawObject = currencyObject

        /**
         * Guild ID.
         * @type {string}
         */
        this.guildID = guildID

        /**
         * Currency ID.
         * @type {number}
         */
        this.id = currencyID

        /**
         * Currency name.
         * @type {string}
         */
        this.name = currencyObject.name

        /**
         * Currency symbol.
         * @type {?string}
         */
        this.symbol = currencyObject.symbol

        /**
         * Currency balances object.
         * @type {object}
         */
        this.balances = currencyObject.balances || {}

        /**
         * Custom currency data object.
         * @type {object}
         */
        this.custom = currencyObject.custom || {}

        for (const [key, value] of Object.entries(currencyObject || {})) {
            this[key] = value
        }
    }

    /**
     * Creates a currency object in guild database.
     * @returns {Currency} Currency object.
     */
    create() {
        const currenciesArray = this._all(this.guildID)
        const newCurrencyObject = defaultCurrencyObject

        newCurrencyObject.id = currenciesArray.length ? currenciesArray[currenciesArray.length - 1].id + 1 : 1
        newCurrencyObject.name = this.name
        newCurrencyObject.symbol = this.symbol

        currenciesArray.push(newCurrencyObject)

        this.database.set(`${this.guildID}.currencies`, currenciesArray)
        return this
    }

    /**
     * Gets the array of available currencies.
     * @returns {CurrencyObject[]} Currencies array.
     * @private
     */
    _all() {
        const currenciesArray = this.database.fetch(`${this.guildID}.currencies`)
        return currenciesArray || []
    }

    /**
     * Deletes the currency object from guild database.
     * @returns {Currency} Deleted currency object.
     */
    delete() {
        const currenciesArray = this._all(this.guildID)
        const currencyIndex = currenciesArray.findIndex(currency => currency.id == this.id)

        currenciesArray.splice(currencyIndex, 1)
        this.database.set(`${this.guildID}.currencies`, currenciesArray)

        return this
    }


    /**
     * Edits the currency object.
     * @param {'name' | 'symbol' | 'custom'} property Currency property to edit.
     * @param {any} value Any value to set.
     * @returns {Currency} Edited currency object.
     */
    edit(property, value) {
        const currenciesArray = this._all(this.guildID)

        const [currency, currencyIndex] = [
            currenciesArray.find(currency => currency.id == this.id),
            currenciesArray.findIndex(currency => currency.id == this.id)
        ]

        if (!['name', 'symbol', 'custom'].includes(property)) {
            throw new EconomyError(errors.invalidProperty('Currency', property), 'INVALID_PROPERTY')
        }

        currency[property] = value

        delete currency.database
        delete currency.options
        delete currency.rawObject

        currenciesArray.splice(currencyIndex, 1, currency)
        this.database.set(`${this.guildID}.currencies`, currenciesArray)

        this[property] = value
        return this
    }

    /**
     * Edits the currency's custom data object.
     * @param {object} customObject Custom data object to set.
     * @returns {Currency} Currency object with its updated custom property.
     */
    setCustom(customObject) {
        const newCurrencyObject = this.edit('custom', customObject)
        return newCurrencyObject
    }

    /**
     * Sets the currency for specified member.
     * @param {string} memberID Member ID.
     * @returns {number} Member's balance.
     */
    getBalance(memberID) {
        const currencyBalance = this.balances[memberID]
        return currencyBalance || 0
    }

    /**
     * Sets the currency for specified member.
     * @param {number} amount Amount of money to set.
     * @param {string} memberID Member ID.
     * @param {string} [reason] The reason why the balance was set.
     * @param {boolean} [emitSet=true] If true, `customCurrencySet` event will be emitted on set. Default: true.
     * @returns {number} Amount of money that was set.
     */
    setBalance(amount, memberID, reason = '', emitSet = true) {
        const currenciesArray = this._all(this.guildID)

        const [currency, currencyIndex] = [
            currenciesArray.find(currency => currency.id == this.id),
            currenciesArray.findIndex(currency => currency.id == this.id)
        ]

        if (isNaN(amount)) {
            throw new EconomyError(errors.invalidType('amount', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        currency.balances[memberID] = amount

        delete currency.database
        delete currency.options
        delete currency.rawObject

        currenciesArray.splice(currencyIndex, 1, currency)
        this.database.set(`${this.guildID}.currencies`, currenciesArray)

        if (emitSet) {
            this.emit('customCurrencySet', {
                type: 'customCurrencySet',
                guildID: this.guildID,
                memberID,
                amount,
                balance: amount,
                currency: this,
                reason
            })
        }

        return amount
    }

    /**
     * Adds the currency for specified member.
     * @param {number} amount Amount of money to add.
     * @param {string} memberID Member ID.
     * @param {string} [reason] The reason why the balance was added.
     * @returns {number} Amount of money that was added.
     */
    addBalance(amount, memberID, reason = '') {
        const currencyBalance = this.getBalance(memberID)
        const result = this.setBalance(currencyBalance + amount, memberID, reason, false)

        this.emit('customCurrencyAdd', {
            type: 'customCurrencyAdd',
            guildID: this.guildID,
            memberID,
            amount,
            balance: currencyBalance + result,
            currency: this,
            reason
        })

        return result
    }

    /**
     * Subtracts the currency for specified member.
     * @param {number} amount Amount of money to subtract.
     * @param {string} memberID Member ID.
     * @param {string} [reason] The reason why the balance was subtracted.
     * @returns {number} Amount of money that was subtracted.
     */
    subtractBalance(amount, memberID, reason = '') {
        const currencyBalance = this.getBalance(memberID)
        const result = this.setBalance(currencyBalance - amount, memberID, reason, false)

        this.emit('customCurrencySubtract', {
            type: 'customCurrencySubtract',
            guildID: this.guildID,
            memberID,
            amount,
            balance: currencyBalance - result,
            currency: this,
            reason
        })

        return result
    }

    /**
     * Transfers the currency to specified user
     * @param {TransferingOptions} Currency transfering options.
     * @returns {TransferingResult} Currency transfering result.
     */
    transfer(options) {
        const {
            amount, receiverMemberID,
            senderMemberID, sendingReason,
            receivingReason
        } = options || {}

        if (isNaN(amount)) {
            throw new EconomyError(errors.invalidType('amount', 'number', amount), 'INVALID_TYPE')
        }

        if (typeof receiverMemberID !== 'string') {
            throw new EconomyError(errors.invalidType('receiverMemberID', 'string', receiverMemberID), 'INVALID_TYPE')
        }

        if (typeof senderMemberID !== 'string') {
            throw new EconomyError(errors.invalidType('senderMemberID', 'string', senderMemberID), 'INVALID_TYPE')
        }

        this.subtractBalance(amount, senderMemberID, sendingReason || 'sending money to {user}')
        this.addBalance(amount, receiverMemberID, receivingReason || 'receiving money from {user}')

        return {
            success: true,
            guildID: this.guildID,

            senderBalance: this.getBalance(senderMemberID),
            receiverBalance: this.getBalance(receiverMemberID),

            amount,

            senderMemberID,
            receiverMemberID,

            sendingReason: sendingReason || 'sending money to {user}',
            receivingReason: receivingReason || 'receiving money from {user}',
        }
    }

    /**
     * Saves the currency object in database.
     * @returns {Currency} Currency instance.
     */
    save() {
        const currenciesArray = this._all()
        const currencyIndex = currenciesArray.findIndex(currency => currency.id == this.id)

        for (const prop in this.rawObject) {
            this.rawObject[prop] = this[prop]
        }

        currenciesArray.splice(currencyIndex, 1, this.rawObject)
        this.database.set(`${this.guildID}.currencies`, currenciesArray)

        return this
    }

    /**
     * Converts the currency object to string.
     * @returns {string} String representation of currency object.
     */
    toString() {
        return this.symbol ? `${this.symbol} ${this.name}` : `${this.name}`
    }

}

/**
 * @typedef {object} CurrencyObject
 * @property {number} id Currency ID.
 * @property {string} guildID Guild ID.
 * @property {string} name Currency name.
 * @property {string} [symbol] Currency symbol.
 * @property {object} balances Currency balances object.
 * @property {object} custom Custom currency data object.
 */

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
 * @typedef {object} TransferingOptions
 * @property {number} amount Currency amount to transfer.
 *
 * @property {string} senderMemberID Sender member ID.
 * @property {string} receiverMemberID Receiver member ID.
 *
 * @property {string} [sendingReason='sending money to {user}'] 
 * The reason of subtracting the money from sender. (example: "sending money to {user}")
 *
 * @property {string} [receivingReason='receiving money from {user}']
 * The reason of adding a money to receiver. (example: "receiving money from {user}")
 */


/**
 * Currency class.
 * @type {Currency}
 */
module.exports = Currency
