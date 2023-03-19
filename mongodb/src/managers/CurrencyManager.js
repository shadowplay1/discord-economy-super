const EconomyError = require('../classes/util/EconomyError')
const Emitter = require('../classes/util/Emitter')

const errors = require('../structures/errors')
const defaultCurrencyObject = require('../structures/DefaultCurrencyObject')

const Currency = require('../classes/Currency')


/**
* Currency manager methods class.
* @extends {Emitter}
*/
class CurrencyManager extends Emitter {

    /**
      * Currency Manager.
      * @param {EconomyConfiguration} options Economy configuration.
      * @param {DatabaseManager} database Database manager.
      * @param {CacheManager} cache Cache manager.
     */
    constructor(options, database, cache) {
        super()

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
     * Finds the info for the specified currency.
     * @param {string | number} currencyID Currency ID, its name or its symbol.
     * @param {string} guildID Guild ID.
     * @returns {Promise<Currency>} Currency object.
     */
    async find(currencyID, guildID) {
        if (typeof currencyID !== 'string' && typeof currencyID !== 'number') {
            throw new EconomyError(
                errors.invalidType(
                    'currencyID',
                    'string (currency name or its symbol) or number (currency ID)',
                    typeof currencyID
                ),
                'INVALID_TYPE'
            )
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const currenciesArray = await this.all(guildID)

        const currency = currenciesArray.find(
            currency => currency.id == currencyID ||
                currency.name.toLowerCase() == currencyID?.toLowerCase() ||
                currency.symbol.toLowerCase() == currencyID?.toLowerCase()
        )

        if (!currency) {
            return {}
        }

        return new Currency(
            currency?.id,
            guildID,
            this.options,
            currency || {},
            this.database,
            this.cache
        )
    }

    /**
     * Finds the info for the specified currency.
     * 
     * This method is an alias for `CurrencyManager.find()` method.
     * @param {string | number} currencyID Currency ID, its name or its symbol.
     * @param {string} guildID Guild ID.
     * @returns {Promise<Currency>} Currency object.
     */
    get(currecyID, guildID) {
        return this.find(currecyID, guildID)
    }

    /**
     * Edits the currency object.
     * @param {string | number} currencyID Currency ID, its name or its symbol.
     * @param {'name' | 'symbol' | 'custom'} property Currency property to edit.
     * @param {any} value Any value to set.
     * @param {string} guildID Guild ID.
     * @returns {Promise<Currency>} Edited currency object.
     */
    async edit(currencyID, property, value, guildID) {
        const currenciesArray = await this.all(guildID)

        const currency = currenciesArray.find(
            currency => currency.id == currencyID ||
                currency.name.toLowerCase() == currencyID?.toLowerCase() ||
                currency.symbol.toLowerCase() == currencyID?.toLowerCase()
        )

        if (!['name', 'symbol', 'custom'].includes(property)) {
            throw new EconomyError(errors.invalidProperty('Currency', property), 'INVALID_PROPERTY')
        }

        if (!currency) {
            throw new EconomyError(errors.currencies.notFound(currencyID, guildID), 'CURRENCY_NOT_FOUND')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        currency[property] = value

        delete currency.database
        delete currency.cache
        delete currency.options
        delete currency.rawObject

        const currencyIndex = currenciesArray.findIndex(currencyObject => currencyObject.id == currency.id)
        currenciesArray.splice(currencyIndex, 1, currency)

        await this.database.set(`${guildID}.currencies`, currenciesArray)

        this.cache.updateMany(['currencies', 'guilds'], {
            guildID
        })

        return new Currency(
            currency.id,
            guildID,
            this.options,
            currency,
            this.database,
            this.cache
        )
    }

    /**
     * Edits the currency's custom data object.
     * @param {string | number} currencyID Currency ID, its name or its symbol.
     * @param {string} guildID Guild ID.
     * @param {object} customObject Custom data object to set.
     * @returns {Promise<Currency>} Currency object with its updated custom property.
     */
    async setCustom(currencyID, guildID, customObject) {
        const newCurrencyObject = await this.edit(currencyID, 'custom', customObject, guildID)
        return newCurrencyObject
    }

    /**
     * Gets the specified currency balance for specified member.
     * @param {string | number} currencyID Currency ID, its name or its symbol.
     * @param {string} memberID Guild ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<number>} Currency balance for specified member.
     */
    async getBalance(currencyID, memberID, guildID) {
        const currency = await this.get(currencyID, guildID)
        const currencyBalance = currency?.balances?.[memberID]

        if (!currency) {
            throw new EconomyError(errors.currencies.notFound(currencyID, guildID), 'CURRENCY_NOT_FOUND')
        }

        return currencyBalance || 0
    }

    /**
     * Sets the currecy balance for speciied member.
     * @param {string | number} currencyID Currency ID, its name or its symbol.
     * @param {number} amount Amount of money to set.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why the money was set.
     * @param {boolean} [emitSet=true] If true, `customCurrencySet` event will be emitted on set. Default: true.
     * @returns {Promise<number>} Amount of money that was set.
     */
    async setBalance(currencyID, amount, memberID, guildID, reason = '', emitSet = true) {
        const currenciesArray = await this.all(guildID)

        const currency = currenciesArray.find(
            currency => currency.id == currencyID ||
                currency.name.toLowerCase() == currencyID?.toLowerCase() ||
                currency.symbol.toLowerCase() == currencyID?.toLowerCase()
        )

        if (!currency) {
            throw new EconomyError(errors.currencies.notFound(currencyID, guildID), 'CURRENCY_NOT_FOUND')
        }

        if (isNaN(amount)) {
            throw new EconomyError(errors.invalidType('amount', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        currency.balances[memberID] = amount

        delete currency.database
        delete currency.cache
        delete currency.options
        delete currency.rawObject

        const currencyIndex = currenciesArray.findIndex(currencyObject => currencyObject.id == currency.id)
        currenciesArray.splice(currencyIndex, 1, currency)

        await this.database.set(`${guildID}.currencies`, currenciesArray)

        this.cache.updateMany(['currencies', 'guilds'], {
            guildID
        })

        if (emitSet) {
            this.emit('customCurrencySet', {
                type: 'customCurrencySet',
                guildID,
                memberID,
                amount,
                balance: amount,
                currency,
                reason
            })
        }

        return amount
    }

    /**
     * Adds the currecy balance for speciied member.
     * @param {string | number} currencyID Currency ID, its name or its symbol.
     * @param {number} amount Amount of money to add.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why the money was added.
     * @returns {Promise<number>} Amount of money that was added.
     */
    async addBalance(currencyID, amount, memberID, guildID, reason = '') {
        const currency = await this.get(currencyID, memberID, guildID)
        const currencyBalance = await this.getBalance(currencyID, memberID, guildID)

        const result = await this.setBalance(currencyID, currencyBalance + amount, memberID, guildID, reason, false)

        this.emit('customCurrencyAdd', {
            type: 'customCurrencyAdd',
            guildID,
            memberID,
            amount,
            balance: currencyBalance + result,
            currency,
            reason
        })

        return result
    }

    /**
     * Subtracts the currecy balance for speciied member.
     * @param {string | number} currencyID Currency ID, its name or its symbol.
     * @param {number} amount Amount of money to subtract.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why the money was subtracted.
     * @returns {Promise<number>} Amount of money that was subtracted.
     */
    async subtractBalance(currencyID, amount, memberID, guildID, reason = '') {
        const currency = await this.get(currencyID, memberID, guildID)
        const currencyBalance = await this.getBalance(currencyID, memberID, guildID)

        const result = await this.setBalance(currencyID, currencyBalance - amount, memberID, guildID, reason, false)

        this.emit('customCurrencySubtract', {
            type: 'customCurrencySubtract',
            guildID,
            memberID,
            amount,
            balance: currencyBalance - result,
            currency,
            reason
        })

        return result
    }

    /**
     * Creates a currency object in database.
     * @param {string} name Currency name to set.
     * @param {string} symbol Currency symbol to set.
     * @param {string} guildID Guild ID.
     * @returns {Promise<Currency>} Currency object.
     */
    async create(name, symbol, guildID) {
        if (!name || typeof name !== 'string') {
            throw new EconomyError(errors.invalidType('name', 'string', typeof name), 'INVALID_TYPE')
        }

        if (!symbol || typeof symbol !== 'string') {
            throw new EconomyError(errors.invalidType('symbol', 'string', typeof symbol), 'INVALID_TYPE')
        }

        const currenciesArray = await this.all(guildID)
        const newCurrencyObject = defaultCurrencyObject

        newCurrencyObject.id = currenciesArray.length ? currenciesArray[currenciesArray.length - 1].id + 1 : 1
        newCurrencyObject.name = name
        newCurrencyObject.symbol = symbol

        currenciesArray.push(newCurrencyObject)

        await this.database.set(`${guildID}.currencies`, currenciesArray)

        this.cache.updateMany(['currencies', 'guilds'], {
            guildID
        })

        return new Currency(
            newCurrencyObject.id,
            guildID,
            this.options,
            newCurrencyObject,
            this.database,
            this.cache
        ) || null
    }

    /**
     * Deletes the currency object and all its balances in a specified guild.
     * @param {string | number} currencyID Currency ID, its name or its symbol.
     * @param {string} guildID Guild ID.
     * @returns {Promise<Currency>} Deleted currency object.
     */
    async delete(currencyID, guildID) {
        const currenciesArray = await this.all(guildID)

        const currencyIndex = currenciesArray.findIndex(
            currency => currency.id == currencyID ||
                currency.name.toLowerCase() == currencyID?.toLowerCase() ||
                currency.symbol.toLowerCase() == currencyID?.toLowerCase()
        )

        if (currencyIndex == -1) return null

        currenciesArray.splice(currencyIndex, 1)
        await this.database.set(`${guildID}.currencies`, currenciesArray)

        this.cache.updateMany(['currencies', 'guilds'], {
            guildID
        })

        return this
    }

    /**
     * Clears the currencies array for specified guild.
     * @param {string} guildID Guild ID.
     * @returns {Promise<boolean>} If cleared: true, else: false.
     */
    async clear(guildID) {
        const currenciesArray = await this.all(guildID)

        if (!currenciesArray.length) {
            return false
        }

        await this.database.set(`${guildID}.currencies`, [])
        return true
    }

    /**
     * Gets the array of available currencies for specified guild.
     * @param {string} guildID Guild ID.
     * @returns {Promise<Currency[]>} Currencies array.
     */
    async all(guildID) {
        if (!guildID || typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', typeof guildID), 'INVALID_TYPE')
        }

        const currenciesArray = (await this.database.fetch(`${guildID}.currencies`)) || []

        return currenciesArray.map(currency => new Currency(
            currency.id,
            guildID,
            this.options,
            currency,
            this.database,
            this.cache
        ) || null)
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
 * Currency manager class.
 * @type {CurrencyManager}
 */
module.exports = CurrencyManager
