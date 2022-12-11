const DatabaseManager = require('../managers/DatabaseManager')

/**
 * Currency class.
 */
class Currency {

	/**
	 * @param {number} currencyID Currency ID.
	 * @param {string} guildID Guild ID.
	 * @param {EconomyConfiguration} options Economy configuration object.
	 * @param {currencyObject} Currency object.
	 * @param {DatabaseManager} database Database manager.
	 */
	constructor(currencyID, guildID, ecoOptions, currencyObject, database) {

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
		 * Determine if the currency  exists in the guild database.
		 * @type {boolean}
		 */
		this.exists = true

		/**
		 * Databasee Manager.
		 * @type {DatabaseManager}
		 */
		this.database = database

		/**
		 * Cache Manager.
		 * @type {CacheManager}
		 */
		this.cache = cache

		for (const [key, value] of Object.entries(currencyObject || {})) {
			this[key] = value
		}
	}

	/**
	 * Creates a currency object in guild database.
	 * @returns {Currency} Currency object.
	 */
	create() {

	}

	/**
	 * Deletes the currency object from guild database.
	 * @returns {Currency} Currency object.
	 */
	delete() {

	}

	/**
	 * Converts the currency object to string.
	 * @returns {string} String representation of currency object.
	 */
	toString() {
		return this.symbol ? `${this.name} ${this.symbol}` : `${this.name}`
	}
}


/**
 * @typedef {Object} CurrencyObject
 * @property {string} name Currency name.
 * @property {string} [symbol] Currency symbol.
 */

/**
 * Currency class.
 * @type {Currency}
 */
module.exports = Currency
