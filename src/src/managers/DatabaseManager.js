const FetchManager = require('./FetchManager')

const DefaultConfiguration = require('../structures/DefaultConfiguration')
const errors = require('../structures/errors')

const EconomyError = require('../classes/util/EconomyError')
const Logger = require('../classes/util/Logger')


/**
 * Database manager methods class.
 */
class DatabaseManager {

    /**
     * Database Manager.
     * @param {EconomyConfiguration} options Economy configuration.
     * @param {string} options.storagePath Full path to a JSON file. Default: './storage.json'.
     */
    constructor(options = {}) {
        const DotParser = require('../classes/util/DotParser')

        /**
         * Economy configuration.
         * @type {EconomyConfiguration}
         */
        this.options = options

        /**
         * Economy Logger.
         * @type {Logger}
         */
        this.logger = new Logger(options)

        /**
         * Fetch manager methods class.
         * @type {FetchManager}
         * @private
         */
        this.fetcher = new FetchManager(options)

        /**
         * Full path to a JSON file.
         * @type {string}
         * @private
         */
        this.storagePath = options.storagePath || './storage.json'

        /**
         * Dot parser methods class.
         * @type {DotParser}
         * @private
         */
        this.parser = new DotParser(options)

        if (!options.storagePath) this.storagePath = DefaultConfiguration.storagePath
    }

    /**
     * Gets a list of keys in database.
     * @param {string} key The key in database.
     * @returns {string[]} An array with all keys in database or 'null' if nothing found.
     */
    keysList(key) {
        const storageData = this.all()
        const data = this.fetch(key)

        if (!key || typeof key !== 'string') return Object.keys(storageData).filter(key => storageData[key])
        if (data == null) return null

        const keys = Object.keys(data)
        return keys.filter(key => data[key] !== undefined && data[key] !== null)
    }

    /**
     * Sets data in a property in database.
     * @param {string} key The key in database.
     * @param {any} value Any data to set in property.
     * @param {boolean} [debug=false] If true, debug log will be sent.
     * @returns {boolean} If set successfully: true; else: false
     */
    set(key, value, debug) {
        try {
            if (!key) return false
            if (value == undefined) return false

            if (typeof key !== 'string') {
                throw new EconomyError(errors.databaseManager.invalidTypes.key + typeof data, 'INVALID_TYPE')
            }

            if (debug) this.logger.debug(`Performed "set" operation on key "${key}".`)
            return this.parser.set(key, value)
        } catch (err) {
            this.logger.error(`Failed to perform "set" operation on the on key "${key}".`)
            console.error(err)
        }
    }

    /**
     * Adds a number to a property data in database.
     * @param {string} key The key in database.
     * @param {number} value Any number to add.
     * @returns {boolean} If added successfully: true; else: false
     */
    add(key, value) {
        try {
            const data = this.parser.parse(key)

            if (!key) return false
            if (typeof key !== 'string') {
                throw new EconomyError(errors.databaseManager.invalidTypes.key + typeof data, 'INVALID_TYPE')
            }

            if (isNaN(value)) {
                throw new EconomyError(errors.databaseManager.invalidTypes.value.number + typeof value, 'INVALID_TYPE')
            }

            if (isNaN(data)) {
                throw new EconomyError(errors.databaseManager.invalidTypes.target.number + typeof data, 'INVALID_TYPE')
            }

            const numData = Number(data)
            const numValue = Number(value)

            this.logger.debug(`Performed "add" operation on key "${key}".`)
            return this.set(key, numData + numValue, false)
        } catch (err) {
            this.logger.error(`Failed to perform "add" operation on the on key "${key}".`)
            console.error(err)
        }
    }

    /**
     * Subtracts a number from a property data in database.
     * @param {string} key The key in database.
     * @param {number} value Any number to subtract.
     * @returns {boolean} If set successfully: true; else: false
     */
    subtract(key, value) {
        try {
            const data = this.parser.parse(key)

            if (!key) return false
            if (typeof key !== 'string') {
                throw new EconomyError(errors.databaseManager.invalidTypes.key + typeof data, 'INVALID_TYPE')
            }

            if (isNaN(value)) {
                throw new EconomyError(errors.databaseManager.invalidTypes.value.number + typeof value, 'INVALID_TYPE')
            }

            if (isNaN(data)) {
                throw new EconomyError(errors.databaseManager.invalidTypes.target.number + typeof data, 'INVALID_TYPE')
            }

            const numData = Number(data)
            const numValue = Number(value)

            this.logger.debug(`Performed "subtract" operation on key "${key}".`)
            return this.set(key, numData - numValue, false)
        } catch (err) {
            this.logger.error(`Failed to perform "subtract" operation on the on key "${key}".`)
            console.error(err)
        }
    }

    /**
     * Fetches the data from the storage file.
     * @param {string} key The key in database.
     * @returns {any} Value from the specified key or 'false' if failed to read or 'null' if nothing found.
     */
    fetch(key) {
        if (!key) return false
        if (typeof key !== 'string') {
            throw new EconomyError(errors.databaseManager.invalidTypes.key + typeof data, 'INVALID_TYPE')
        }

        return this.parser.parse(key)
    }

    /**
     * Fetches the data from the storage file.
     *
     * This method is an alias for 'DatabaseManager.fetch()' method.
     * @param {string} key The key in database.
     * @returns {any} Value from the specified key or 'false' if failed to read or 'null' if nothing found.
     */
    get(key) {
        return this.fetch(key)
    }

    /**
     * Fetches the data from the storage file.
     *
     * This method is an alias for the `DatabaseManager.fetch()` method.
     * @param {string} key The key in database.
     * @returns {any} Value from the specified key or 'false' if failed to read or 'null' if nothing found.
     */
    find(key) {
        return this.fetch(key)
    }

    /**
     * Removes the property from the existing object in database.
     * @param {string} key The key in database.
     * @returns {boolean} If cleared: true; else: false.
     */
    remove(key) {
        try {
            if (!key) return false

            if (typeof key !== 'string') {
                throw new EconomyError(errors.databaseManager.invalidTypes.key + typeof data, 'INVALID_TYPE')
            }

            this.logger.debug(`Performed "delete" operation on key "${key}".`)
            return this.parser.remove(key)
        } catch (err) {
            this.logger.error(`Failed to perform "delete" operation on the on key "${key}".`)
            console.error(err)
        }
    }

    /**
     * Removes the property from the existing object in database.
     *
     * This method is an alias for `DatabaseManager.remove()` method.
     * @param {string} key The key in database.
     * @returns {boolean} If cleared: true; else: false.
     */
    delete(key) {
        return this.remove(key)
    }

    /**
     * Pushes a value to a specified array from the database.
     * @param {string} key The key in database.
     * @param {any} value Any value to push.
     * @returns {boolean} If cleared: true; else: false.
     */
    push(key, value) {
        try {
            if (!key) return false
            if (value == undefined) return false

            if (typeof key !== 'string') {
                throw new EconomyError(errors.databaseManager.invalidTypes.key + typeof data, 'INVALID_TYPE')
            }

            const data = this.fetch(key) || []
            if (!Array.isArray(data) && !data.length) {
                throw new EconomyError(errors.databaseManager.invalidTypes.target.array + typeof data, 'INVALID_TYPE')
            }

            this.logger.debug(`Performed "push" operation on key "${key}".`)

            data.push(value)
            return this.set(key, data, false)
        } catch (err) {
            this.logger.error(`Failed to perform "push" operation on the on key "${key}".`)
            console.error(err)
        }
    }

    /**
     * Removes an element from a specified array in the database.
     * @param {string} key The key in database.
     * @param {number} index The index in the array.
     * @returns {boolean} If cleared: true; else: false.
     */
    pop(key, index) {
        try {
            if (!key) return false
            if (index == undefined) return false
            if (typeof key !== 'string') {
                throw new EconomyError(errors.databaseManager.invalidTypes.key + typeof data, 'INVALID_TYPE')
            }

            const data = this.fetch(key)
            if (!Array.isArray(data)) {
                throw new EconomyError(errors.databaseManager.invalidTypes.target.array + typeof data, 'INVALID_TYPE')
            }

            this.logger.debug(`Performed "pop" operation on key "${key}".`)

            data.splice(index, 1)
            return this.set(key, data, false)
        } catch (err) {
            this.logger.error(`Failed to perform "pop" operation on the on key "${key}".`)
            console.error(err)
        }
    }

    /**
     * Clears the whole database.
     * @returns {boolean} If cleared: true; else: false.
     */
    clear() {
        try {
            const data = this.all()
            const stringData = JSON.stringify(data)

            if (stringData == '{}') return false
            this.write(this.options.storagePath, '{}')

            this.logger.debug('Performed "clear" operation on the database.')
            return true
        } catch (err) {
            this.logger.error('Failed to perform "clear" operation on the database.')
            console.error(err)
        }
    }

    /**
     * Clears the whole database.
     *
     * This method is an alias for `DatabaseManager.clear()` method.
     * @returns {boolean} If cleared: true; else: false.
     */
    deleteAll() {
        return this.clear()
    }

    /**
     * Removes an element from a specified array in the database.
     *
     * This method is an alias for `DatabaseManager.pop()` method.
     * @param {string} key The key in database.
     * @param {number} index The index in the array.
     * @returns {boolean} If cleared: true; else: false.
     */
    removeElement(key, index) {
        return this.pop(key, index)
    }

    /**
    * Changes the specified element's value in a specified array in the database.
    * @param {string} key The key in database.
    * @param {number} index The index in the array.
    * @param {any} newValue The new value to set.
    * @returns {boolean} If cleared: true; else: false.
    */
    pull(key, index, newValue) {
        try {
            if (!key) return false
            if (index == undefined) return false

            if (typeof key !== 'string') {
                throw new EconomyError(errors.databaseManager.invalidTypes.key + typeof data, 'INVALID_TYPE')
            }

            const data = this.fetch(key)
            if (!Array.isArray(data)) {
                throw new EconomyError(errors.databaseManager.invalidTypes.target.array + typeof data, 'INVALID_TYPE')
            }

            if (typeof key !== 'string') {
                throw new EconomyError(errors.databaseManager.invalidTypes.key + typeof data, 'INVALID_TYPE')
            }

            if (newValue == undefined) {
                throw new EconomyError(
                    errors.databaseManager.invalidTypes.value.newValue + typeof newValue, 'INVALID_TYPE'
                )
            }

            this.logger.debug(`Performed "pull" operation on key "${key}".`)

            data.splice(index, 1, newValue)
            return this.set(key, data, false)
        } catch (err) {
            this.logger.error(`Failed to perform "pull" operation on key "${key}".`)
            console.error(err)
        }
    }

    /**
    * Changes the specified element's value in a specified array in the database.
    *
    * This method is an alias for `DatabaseManager.pull()` method.
    * @param {string} key The key in database.
    * @param {number} index The index in the array.
    * @param {any} newValue The new value to set.
    * @returns {boolean} If cleared: true; else: false.
    */
    changeElement(key, index, newValue) {
        return this.pull(key, index, newValue)
    }

    /**
    * Checks if the element is existing in database.
    * @param {string} key The key in database.
    * @returns {boolean} If existing: true; else: false.
    */
    has(key) {
        return !!this.fetch(key)
    }

    /**
     * Checks if the element is existing in database.
     *
     * This method is an alias for `DatabaseManager.has()` method.
     * @param {string} key The key in database.
     * @returns {boolean} If existing: true; else: false.
     */
    includes(key) {
        return this.has(key)
    }

    /**
    * Fetches the entire database.
    * @returns {object} Database contents
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
