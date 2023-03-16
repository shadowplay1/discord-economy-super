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
	 * @param {CacheManager} cache Cache manager.
	 */
	constructor(currencyID, guildID, ecoOptions, currencyObject, database, cache) {
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
		 * Cache manager.
		 * @type {CacheManager}
		 * @private
		 */
		this.cache = cache

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
	 * @returns {Promise<Currency>} Currency object.
	 */
	async create() {
		const currenciesArray = await this._all(this.guildID)
		const newCurrencyObject = defaultCurrencyObject

		newCurrencyObject.id = currenciesArray.length ? currenciesArray[currenciesArray.length - 1].id + 1 : 1
		newCurrencyObject.name = this.name
		newCurrencyObject.symbol = this.symbol

		currenciesArray.push(newCurrencyObject)

		await this.database.set(`${this.guildID}.currencies`, currenciesArray)

		this.cache.updateMany(['currencies', 'guilds'], {
			guildID: this.guildID
		})

		return this
	}

	/**
	 * Gets the array of available currencies.
	 * @returns {Promise<CurrencyObject[]>} Currencies array.
	 * @private
	 */
	async _all() {
		const currenciesArray = await this.database.fetch(`${this.guildID}.currencies`)
		return currenciesArray || []
	}

	/**
	 * Deletes the currency object from guild database.
	 * @returns {Promise<Currency>} Deleted currency object.
	 */
	async delete() {
		const currenciesArray = await this._all(this.guildID)
		const currencyIndex = currenciesArray.findIndex(currency => currency.id == this.id)

		currenciesArray.splice(currencyIndex, 1)
		await this.database.set(`${this.guildID}.currencies`, currenciesArray)

		this.cache.updateMany(['currencies', 'guilds'], {
			guildID: this.guildID
		})

		return this
	}


	/**
	 * Edits the currency object.
	 * @param {'name' | 'symbol' | 'custom'} property Currency property to edit.
	 * @param {any} value Any value to set.
	 * @returns {Promise<Currency>} Edited currency object.
	 */
	async edit(property, value) {
		const currenciesArray = await this._all(this.guildID)

		const [currency, currencyIndex] = [
			currenciesArray.find(currency => currency.id == this.id),
			currenciesArray.findIndex(currency => currency.id == this.id)
		]

		if (!['name', 'symbol', 'custom'].includes(property)) {
			throw new EconomyError(errors.invalidProperty('Currency', property), 'INVALID_PROPERTY')
		}

		currency[property] = value

		delete currency.database
		delete currency.cache
		delete currency.options
		delete currency.rawObject

		currenciesArray.splice(currencyIndex, 1, currency)
		await this.database.set(`${this.guildID}.currencies`, currenciesArray)

		this.cache.updateMany(['currencies', 'guilds'], {
			guildID: this.guildID
		})

		this[property] = value
		return this
	}

	/**
	 * Edits the currency's custom data object.
	 * @param {object} customObject Custom data object to set.
	 * @returns {Promise<Currency>} Currency object with its updated custom property.
	 */
	async setCustom(customObject) {
		const newCurrencyObject = await this.edit('custom', customObject)
		return newCurrencyObject
	}

	/**
	 * Sets the currency for specified member.
	 * @param {string} memberID Member ID.
	 * @returns {Promise<number>} Member's balance.
	 */
	async getBalance(memberID) {
		const currencyBalance = this.balances[memberID]
		return currencyBalance || 0
	}

	/**
	 * Sets the currency for specified member.
	 * @param {number} amount Amount of money to set.
	 * @param {string} memberID Member ID.
	 * @param {string} [reason] The reason why the balance was set.
	 * @param {boolean} [emitSet=true] If true, `customCurrencySet` event will be emitted on set. Default: true.
	 * @returns {Promise<number>} Amount of money that was set.
	 */
	async setBalance(amount, memberID, reason = '', emitSet = true) {
		const currenciesArray = await this._all(this.guildID)

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
		delete currency.cache
		delete currency.options
		delete currency.rawObject

		currenciesArray.splice(currencyIndex, 1, currency)
		await this.database.set(`${this.guildID}.currencies`, currenciesArray)

		this.cache.updateMany(['currencies', 'guilds'], {
			guildID: this.guildID
		})

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
	 * @returns {Promise<number>} Amount of money that was added.
	 */
	async addBalance(amount, memberID, reason = '') {
		const currencyBalance = await this.getBalance(memberID)
		const result = await this.setBalance(currencyBalance + amount, memberID, reason, false)

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
	 * Transfers the currency to specified user
	 * @param {TransferingOptions} Currency transfering options.
	 * @returns {Promise<TransferingResult>} Currency transfering result.
	 */
	async transfer(options) {
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

		await this.subtractBalance(amount, senderMemberID, sendingReason || 'sending money to {user}')
		await this.addBalance(amount, receiverMemberID, receivingReason || 'receiving money from {user}')

		return {
			success: true,
			guildID: this.guildID,

			senderBalance: await this.getBalance(senderMemberID),
			receiverBalance: await this.getBalance(receiverMemberID),

			amount,

			senderMemberID,
			receiverMemberID,

			sendingReason: sendingReason || 'sending money to {user}',
			receivingReason: receivingReason || 'receiving money from {user}',
		}
	}

	/**
	 * Subtracts the currency for specified member.
	 * @param {number} amount Amount of money to subtract.
	 * @param {string} memberID Member ID.
	 * @param {string} [reason] The reason why the balance was subtracted.
	 * @returns {Promise<number>} Amount of money that was subtracted.
	 */
	async subtractBalance(amount, memberID, reason = '') {
		const currencyBalance = await this.getBalance(memberID)
		const result = await this.setBalance(currencyBalance - amount, memberID, reason, false)

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
	 * Saves the currency object in database.
	 * @returns {Promise<Currency>} Currency instance.
	 */
	async save() {
		const currenciesArray = await this._all()
		const currencyIndex = currenciesArray.findIndex(currency => currency.id == this.id)

		for (const prop in this.rawObject) {
			this.rawObject[prop] = this[prop]
		}

		currenciesArray.splice(currencyIndex, 1, this.rawObject)
		await this.database.set(`${this.guildID}.currencies`, currenciesArray)

		this.cache.updateMany(['guilds', 'currencies'], {
			guildID: this.guildID
		})

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
 * @typedef {object} TransferingResult
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
 * @typedef {object} TransferingOptionss
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
