const DatabaseManager = require('../managers/DatabaseManager')
const CacheManager = require('../managers/CacheManager')

const defaultCurrencyObject = require('../structures/DefaultCurrencyObject')

const EconomyError = require('./util/EconomyError')
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
	 * @param {string} guildID Guild ID.
	 * @returns {Promise<CurrencyObject[]>} Currencies array.
	 * @private
	 */
	async _all() {
		const currenciesArray = await this.database.set(`${this.guildID}.currencies`)
		return currenciesArray || []
	}

	/**
	 * Deletes the currency object from guild database.
	 * @returns {Promise<Currency>} Deleted currency object.
	 */
	async delete() {
		const currenciesArray = await this._all(this.guildID)
		const currencyIndex = currenciesArray.findIndex(currency => currency.id == this.id)

		if (currencyIndex == -1) return false

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

		if (!currency) {
			throw new EconomyError(errors.currencies.notFound(this.id, this.guildID), 'CURRENCY_NOT_FOUND')
		}

		currency[property] = value

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
		const newCurrencyObject = await this.edit(this.id, 'custom', customObject, this.guildID)
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

        currency.balances[memberID] = amount

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
		const currencyBalance = await this.getBalance(this.id, memberID, this.guildID)
        const result = await this.setBalance(this.id, currencyBalance + amount, memberID, this.guildID, reason, false)

        this.emit('customCurrencyAdd', {
            type: 'customCurrencyAdd',
            guildID: this.guildID,
            memberID,
            amount,
            balance: currencyBalance + result,
            reason
        })

        return result
	}

	/**
	 * Subtracts the currency for specified member.
	 * @param {number} amount Amount of money to subtract.
	 * @param {string} memberID Member ID.
	 * @param {string} [reason] The reason why the balance was subtracted.
	 * @returns {Promise<number>} Amount of money that was subtracted.
	 */
	async subtractBalance(amount, memberID, reason = '') {
		const currencyBalance = await this.getBalance(this.id, memberID, this.guildID)
        const result = await this.setBalance(this.id, currencyBalance - amount, memberID, this.guildID, reason, false)

        this.emit('customCurrencySubtract', {
            type: 'customCurrencySubtract',
            guildID: this.guildID,
            memberID,
            amount,
            balance: currencyBalance - result,
            reason
        })

        return result
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
