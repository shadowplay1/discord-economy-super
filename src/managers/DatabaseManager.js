const FetchManager = require('./FetchManager')

const DefaultOptions = require('../structures/DefaultOptions')
const errors = require('../structures/errors')

const EconomyError = require('../classes/EconomyError')

/**
 * Database manager methods class.
 */
class DatabaseManager {

    /**
     * Economy constructor options object. There's only needed options object properties for this manager to work properly.
     * @param {Object} options Constructor options object.
     * @param {String} options.storagePath Full path to a JSON file. Default: './storage.json'.
     */
    constructor(options = {}) {
        const DotParser = require('../classes/DotParser')

        /**
         * Fetch manager methods object.
         * @type {FetchManager}
         * @private
         */
        this.fetcher = new FetchManager(options)

        /**
         * Full path to a JSON file.
         * @private
         * @type {String}
         */
        this.storagePath = options.storagePath || './storage.json'

        /**
         * Dot parser methods object.
         * @private
         * @type {DotParser}
         */
        this.parser = new DotParser(options)

        if (!options.storagePath) this.storagePath = DefaultOptions.storagePath
    }

    /**
     * Gets a list of keys in database.
     * @param {String} key The key in database.
     * @returns {String[]} An array with all keys in database or 'null' if nothing found.
     */
    keyList(key) {
        const storageData = this.fetcher.fetchAll()
        const data = this.fetch(key)

        if (!key || typeof key !== 'string') return Object.keys(storageData).filter(x => storageData[x])
        if (data == null) return null

        const keys = Object.keys(data)
        return keys.filter(x => data[x] !== undefined && data[x] !== null)
    }

    /**
     * Sets data in a property in database.
     * @param {String} key The key in database.
     * @param {any} value Any data to set in property.
     * @returns {Boolean} If set successfully: true; else: false
     */
    set(key, value) {
        if (!key) return false
        if (typeof key !== 'string') throw new EconomyError(errors.databaseManager.invalidTypes.key + typeof data)
        if (value == undefined) return false

        return this.parser.set(key, value)
    }

    /**
     * Adds a number to a property data in database.
     * @param {String} key The key in database.
     * @param {Number} value Any number to add.
     * @returns {Boolean} If added successfully: true; else: false
     */
    add(key, value) {
        if (!key) return false
        if (typeof key !== 'string') throw new EconomyError(errors.databaseManager.invalidTypes.key + typeof data)

        const data = this.parser.parse(key)

        if (isNaN(value)) throw new EconomyError(errors.databaseManager.invalidTypes.value.number + typeof value)
        if (isNaN(data)) throw new EconomyError(errors.databaseManager.invalidTypes.target.number + typeof data)

        const numData = Number(data)
        const numValue = Number(value)

        return this.set(key, numData + numValue)
    }

    /**
     * Subtracts a number from a property data in database.
     * @param {String} key The key in database.
     * @param {Number} value Any number to subtract.
     * @returns {Boolean} If set successfully: true; else: false
     */
    subtract(key, value) {
        if (!key) return false
        if (typeof key !== 'string') throw new EconomyError(errors.databaseManager.invalidTypes.key + typeof data)

        const data = this.parser.parse(key)

        if (isNaN(value)) throw new EconomyError(errors.databaseManager.invalidTypes.value.number + typeof value)
        if (isNaN(data)) throw new EconomyError(errors.databaseManager.invalidTypes.target.number + typeof data)

        const numData = Number(data)
        const numValue = Number(value)

        return this.set(key, numData - numValue)
    }

    /**
     * Fetches the data from the storage file.
     * @param {String} key The key in database.
     * @returns {any | false} Value from the specified key or 'false' if failed to read or 'null' if nothing found.
     */
    fetch(key) {
        if (!key) return false
        if (typeof key !== 'string') throw new EconomyError(errors.databaseManager.invalidTypes.key + typeof data)

        return this.parser.parse(key)
    }

    /**
     * Removes the property from the existing object in database.
     * @param {String} key The key in database.
     * @returns {Boolean} If cleared: true; else: false.
     */
    remove(key) {
        if (!key) return false
        if (typeof key !== 'string') throw new EconomyError(errors.databaseManager.invalidTypes.key + typeof data)

        return this.parser.remove(key)
    }

    /**
     * Pushes a value to a specified array from the database.
     * @param {String} key The key in database.
     * @param {any} value The key in database.
     * @returns {Boolean} If cleared: true; else: false.
     */
    push(key, value) {
        if (!key) return false
        if (value == undefined) return false
        if (typeof key !== 'string') throw new EconomyError(errors.databaseManager.invalidTypes.key + typeof data)

        let data = this.fetch(key) || []
        if (!Array.isArray(data) && !data.length) throw new EconomyError(errors.databaseManager.invalidTypes.target.array + typeof data)

        data.push(value)
        return this.set(key, data)
    }

    /**
     * Removes an element from a specified array in the database.
     * @param {String} key The key in database.
     * @param {Number} index The index in the array.
     * @returns {Boolean} If cleared: true; else: false.
     */
    removeElement(key, index) {
        if (!key) return false
        if (index == undefined) return false
        if (typeof key !== 'string') throw new EconomyError(errors.databaseManager.invalidTypes.key + typeof data)

        let data = this.fetch(key)
        if (!Array.isArray(data)) throw new EconomyError(errors.databaseManager.invalidTypes.target.array + typeof data)

        data.splice(index, 1)
        return this.set(key, data)
    }

    /**
    * Fetches the entire database.
    * @returns {Object} Database contents
    */
    all() {
        return this.fetcher.fetchAll()
    }
}

/**
 * Database manager class.
 * @type {DatabaseManager}
 */
module.exports = DatabaseManager
