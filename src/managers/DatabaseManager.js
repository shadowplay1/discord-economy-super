const UtilsManager = require('./UtilsManager')

const DefaultOptions = require('../structures/DefaultOptions')

/**
 * Database manager methods class.
 * @extends Emitter
 */

class DatabaseManager {
    
    /**
      * Economy constructor options object. There's only needed options object properties for this manager to work properly.
      * @param {Object} options Constructor options object.
      * @param {String} options.storagePath Full path to a JSON file. Default: './storage.json'.
     */
    
    constructor(options) {
        const DotParser = require('../classes/DotParser')

        /**
         * @private
         * @type {UtilsManager}
         */
        this.utils = new UtilsManager(options)

        /**
         * @private
         * @type {String}
         */
        this.storagePath = options?.storagePath

        /**
         * @private
         * @type {DotParser}
         */
        this.parser = new DotParser()
        
        if (!options?.storagePath) this.storagePath = DefaultOptions.storagePath
    }

    /**
     * Gets a list of keys in database.
     * @returns {Array<String>} An array with all keys in database or 'null' if nothing found.
     */
    keysList(key) {
        if (!key) return Object.keys(storageData).filter(x => storageData[x])
        
        const storageData = this.utils.all()
        const data = this.fetch(key)

        if (data == null) return null

        return Object.keys(data).filter(x => data[x] !== undefined && data[x] !== null)
    }

    /**
     * Sets data in a property in database.
     * @param {String} key The key in database.
     * @param {any} data Any data to set in property.
     * @returns {Boolean} If set successfully: true; else: false
     */
    set(key, data) {
        if (!key) return false
        if (data == undefined) return false
        
        return this.parser.set(key, data)
    }

    /**
     * Fetches the data from storage file.
     * @param {String} key The key in database.
     * @returns {any | false} Value from the specified key or 'false' if failed to read or 'null' if nothing found.
     */
    fetch(key) {
        if (!key) return false

        return this.parser.parse(key)
    }
    /**
     * Removes the property from the existing object in database.
     * @param {String} key The key in database.
     * @returns {Boolean} If cleared: true; else: false.
     */
    remove(key) {
        if (!key) return false

        return this.parser.remove(key)
    }

    /**
    * Fetches the entire database.
    * @returns {Object} Database contents
    */
    all() {
        return this.utils.all()
    }
}

/**
 * Database manager class.
 * @type {DatabaseManager}
 */
module.exports = DatabaseManager