const DatabaseManager = require('../managers/DatabaseManager')
const CacheManager = require('../managers/CacheManager')
const CurrencyManager = require('../managers/CurrencyManager')

/**
 * Currency class.
 */
class Currency {

	/**
	 * @param {number} currencyID Currency ID.
	 * @param {string} guildID Guild ID.
	 * @param {EconomyConfiguration} ecoOptions Economy configuration object.
	 * @param {CurrencyObject} currencyObject Currency object.
	 * @param {DatabaseManager} database Database manager.
	 * @param {CacheManager} cache Cache manager.
	 */
	constructor(currencyID, guildID, ecoOptions, currencyObject, database, cache) {

		/**
		 * Currency Manager.
		 * @type {CurrencyManager}
		 * @private
		 */
		this._currencies = new CurrencyManager(ecoOptions, database, cache)

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
		await this._currencies.create(this.name, this.symbol, this.guildID)
		return this
	}

	/**
	 * Deletes the currency object from guild database.
	 * @returns {Promise<Currency>} Currency object.
	 */
	async delete() {
		await this._currencies.delete(this.id, this.guildID)
		return this
	}


	/**
	 * Edits the currency object.
	 * @param {'name' | 'symbol' | 'custom'} property Currency property to edit.
	 * @param {any} value Any value to set.
	 * @returns {Promise<Currency>} Edited currency object.
	 */
	async edit(property, value) {
		await this._currencies.edit(this.id, property, value, this.guildID)

		this[property] = value
		return this
	}

	/**
	 * Edits the currency's custom data object.
	 * @param {object} customObject Custom data object to set.
	 * @returns {Promise<Currency>} Currency object with its updated custom property.
	 */
	async setCustom(customObject) {
		await this.edit('custom', customObject)

		this.custom = customObject
		return this
	}

	/**
	 * Sets the currency for specified member.
	 * @param {string} memberID Member ID.
	 * @returns {Promise<number>} Member's balance.
	 */
	getBalance(memberID) {
		return this._currencies.getBalance(this.id, memberID, this.guildID)
	}

	/**
	 * Sets the currency for specified member.
	 * @param {number} amount Amount of money to set.
	 * @param {string} memberID Member ID.
	 * @param {string} [reason] The reason why the balance was set.
	 * @returns {Promise<number>} Amount of money that was set.
	 */
	setBalance(amount, memberID, reason) {
		return this._currencies.setBalance(this.id, amount, memberID, this.guildID, reason)
	}

	/**
	 * Adds the currency for specified member.
	 * @param {number} amount Amount of money to add.
	 * @param {string} memberID Member ID.
	 * @param {string} [reason] The reason why the balance was added.
	 * @returns {Promise<number>} Amount of money that was added.
	 */
	addBalance(amount, memberID, reason) {
		return this._currencies.addBalance(this.id, amount, memberID, this.guildID, reason)
	}

	/**
	 * Subtracts the currency for specified member.
	 * @param {number} amount Amount of money to subtract.
	 * @param {string} memberID Member ID.
	 * @param {string} [reason] The reason why the balance was subtracted.
	 * @returns {Promise<number>} Amount of money that was subtracted.
	 */
	subtractBalance(amount, memberID, reason) {
		return this._currencies.subtractBalance(this.id, amount, memberID, this.guildID, reason)
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
 * @typedef {Object} CurrencyObject
 * @property {number} id Currency ID.
 * @property {string} guildID Guild ID.
 * @property {string} name Currency name.
 * @property {string} [symbol] Currency symbol.
 * @property {object} balances Currency balances object.
 * @property {object} custom Custom currency data object.
 */

/**
 * Currency class.
 * @type {Currency}
 */
module.exports = Currency
