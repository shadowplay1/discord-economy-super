const QuickMongo = require('quick-mongo-super')

const Logger = require('../classes/util/Logger')


/**
 * Database manager methods class.
 */
class DatabaseManager {

    /**
     * Database Manager.
     * @param {object} options Economy configuration.
     * @param {QuickMongo} mongo QuickMongo instance.
     */
    constructor(options = {}, mongo) {

        /**
         * Economy Logger.
         * @type {Logger}
         * @private
         */
        this._logger = new Logger(options)

        /**
         * QuickMongo instance.
         * @type {QuickMongo}
         * @private
         */
        this._mongo = mongo
    }

    /**
     * Gets a list of keys in database.
     * @param {string} key The key in database.
     * @returns {Promise<String[]>} An array with all keys in database or 'null' if nothing found.
     */
    keysList(key) {
        return this._mongo.keysList(key)
    }

    /**
     * Sets data in a property in database.
     * @param {string} key The key in database.
     * @param {any} value Any data to set in property.
     * @param {boolean} [debug=false] If true, debug log will be sent.
     * @returns {Promise<boolean>} If set successfully: true; else: false
     */
    set(key, value, debug) {
        return this._mongo.set(key, value, debug).then(() => {
            this._logger.debug(`Performed "set" operation on key "${key}".`)
        })
    }

    /**
     * Adds a number to a property data in database.
     * @param {string} key The key in database.
     * @param {number} value Any number to add.
     * @returns {Promise<boolean>} If added successfully: true; else: false
     */
    add(key, value) {
        return this._mongo.add(key, value).then(() => {
            this._logger.debug(`Performed "add" operation on key "${key}".`)
        })
    }

    /**
     * Subtracts a number from a property data in database.
     * @param {string} key The key in database.
     * @param {number} value Any number to subtract.
     * @returns {Promise<boolean>} If set successfully: true; else: false
     */
    subtract(key, value) {
        return this._mongo.subtract(key, value).then(() => {
            this._logger.debug(`Performed "subtract" operation on key "${key}".`)
        })
    }

    /**
     * Fetches the data from the database.
     * @param {string} key The key in database.
     * @returns {Promise<any>} Value from the specified key or 'false' if failed to read or 'null' if nothing found.
     */
    fetch(key) {
        return this._mongo.fetch(key)
    }

    /**
     * Fetches the data from the database.
     * 
     * This method is an alias for 'DatabaseManager.fetch()' method.
     * @param {string} key The key in database.
     * @returns {Promise<any>} Value from the specified key or 'false' if failed to read or 'null' if nothing found.
     */
    get(key) {
        return this.fetch(key)
    }

    /**
     * Fetches the data from the database.
     * 
     * This method is an alias for the `DatabaseManager.fetch()` method.
     * @param {string} key The key in database.
     * @returns {Promise<any>} Value from the specified key or 'false' if failed to read or 'null' if nothing found.
     */
    find(key) {
        return this.fetch(key)
    }

    /**
     * Removes the property from the existing object in database.
     * @param {string} key The key in database.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    remove(key) {
        return this._mongo.remove(key).then(() => {
            this._logger.debug(`Performed "remove" operation on key "${key}".`)
        })
    }

    /**
     * Removes the property from the existing object in database.
     * 
     * This method is an alias for `DatabaseManager.remove()` method.
     * @param {string} key The key in database.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    delete(key) {
        return this.remove(key)
    }

    /**
     * Clears the whole database.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    async clear() {
        const keys = await this.keysList('')

        for (const key of keys) {
            await this.remove(key)
        }

        this._logger.debug('Performed "clear" operation on a whole database.')
        return true
    }

    /**
     * Clears the whole database.
     * 
     * This method is an alias for `DatabaseManager.clear()` method.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    deleteAll() {
        return this.deleteAll()
    }

    /**
     * Pushes a value to a specified array from the database.
     * @param {string} key The key in database.
     * @param {any} value The key in database.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    push(key, value) {
        return this._mongo.push(key, value).then(() => {
            this._logger.debug(`Performed "push" operation on key "${key}".`)
        })
    }

    /**
     * Removes an element from a specified array in the database.
     * @param {string} key The key in database.
     * @param {number} index The index in the array.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    pop(key, index) {
        return this._mongo.pop(key, index).then(() => {
            this._logger.debug(`Performed "pop" operation on key "${key}".`)
        })
    }

    /**
     * Removes an element from a specified array in the database.
     * 
     * This method is an alias for `DatabaseManager.pop()` method.
     * @param {string} key The key in database.
     * @param {number} index The index in the array.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    removeElement(key, index) {
        return this.pop(key, index)
    }

    /**
    * Changes the specified element's value in a specified array in the database.
    * @param {string} key The key in database.
    * @param {number} index The index in the array.
    * @param {any} newValue The new value to set.
    * @returns {Promise<boolean>} If cleared: true; else: false.
    */
    pull(key, index, newValue) {
        return this._mongo.pull(key, index, newValue).then(() => {
            this._logger.debug(`Performed "pull" operation on key "${key}".`)
        })
    }

    /**
    * Changes the specified element's value in a specified array in the database.
    * 
    * This method is an alias for `DatabaseManager.pull()` method.
    * @param {string} key The key in database.
    * @param {number} index The index in the array.
    * @param {any} newValue The new value to set.
    * @returns {Promise<boolean>} If cleared: true; else: false.
    */
    changeElement(key, index, newValue) {
        return this.pull(key, index, newValue)
    }

    /**
     * Checks if the element is existing in database.
     * @param {string} key The key in database.
     * @returns {Promise<boolean>} If existing: true; else: false.
     */
    has(key) {
        return this._mongo.has(key)
    }

    /**
     * Checks if the element is existing in database.
     * 
     * This method is an alias for `DatabaseManager.has()` method.
     * @param {string} key The key in database.
     * @returns {Promise<boolean>} If existing: true; else: false.
     */
    includes(key) {
        return this._mongo.has(key)
    }

    /**
    * Fetches the entire database.
    * @returns {Promise<DatabaseProperties>} Database contents
    */
    all() {
        return this._mongo.all()
    }

    /**
     * Fetches the raw content of database.
     * @returns {Promise<DatabaseObject[]>} Database contents
     */
    raw() {
        return this._mongo.raw()
    }

    /**
     * Sends a read, write and delete requests to the database and returns the request latencies.
     * @returns {Promise<MongoLatencyData>} Database latency object.
     */
    ping() {
        return this._mongo.ping()
    }

    /**
     * Connects to the database.
     * @returns {Promise<boolean>} If connected - MongoDB collection will be returned.
     */
    connect() {
        return this._mongo.connect()
    }

    /**
     * Closes the connection.
     * @returns {Promise<boolean>} If closed, true will be returned.
     */
    disconnect() {
        return this._mongo.disconnect()
    }

    on(event, listener) {
        this._mongo.on(event, listener)
    }

    once(event, listener) {
        this._mongo.once(event, listener)
    }

    emit(event, ...args) {
        this._mongo.emit(event, ...args)
    }
}

/**
 * Database manager class.
 * @type {DatabaseManager}
 */
module.exports = DatabaseManager
