const { writeFileSync } = require('fs')

const get = require('lodash/get')
const set = require('lodash/set')
const unset = require('lodash/unset')

const FetchManager = require('../managers/FetchManager')

const DefaultOptions = require('../structures/DefaultOptions')

/**
 * Dot parser class.
 * @private
 */
class DotParser {

    /**
     * Economy constructor options object. There's only needed options object properties for this manager to work properly.
     * @param {Object} options Constructor options object.
     * @param {String} options.storagePath Full path to a JSON file. Default: './storage.json'.
     */
    constructor(options = {}) {

        /**
         * Economy constructor options object.
         * @private
         * @type {EconomyOptions}
         */
        this.options = options

        /**
         * Fetch manager methods object.
         * @type {FetchManager}
         * @private
         */
        this.fetcher = new FetchManager(options)

        if (!options.storagePath) this.storagePath = DefaultOptions.storagePath
    }

    /**
     * Parses the key and fetches the value from database.
     * @param {String} key The key in database.
     * @returns {any | false} The data from database or 'false' if failed to parse or 'null' if nothing found.
     */
    parse(key) {
        const storageData = this.fetcher.fetchAll()

        if (!key) return false
        if (typeof key !== 'string') return false

        const parsed = get(storageData, key)

        return parsed || null
    }

    /**
     * Parses the key and sets the data in database.
     * @param {String} key The key in database.
     * @param {any} data Any data to set.
     * @returns {Boolean} If set successfully: true; else: false
     */
    set(key, data) {
        let storageData = this.fetcher.fetchAll()

        if (!key) return false
        if (data == undefined) return false

        if (typeof key !== 'string') return false

        storageData = set(storageData, key, data)
        writeFileSync(this.options.storagePath, JSON.stringify(storageData, null, '\t'))

        return true
    }

    /**
     * Parses the key and removes the data from database. 
     * @param {String} key The key in database.
     * @returns {Boolean} If removed successfully: true; else: false
     */
    remove(key) {
        let storageData = this.fetcher.fetchAll()

        if (!key) return false
        if (typeof key !== 'string') return false

        const data = this.parse(key)
        if (data == null) return false

        unset(storageData, key)
        writeFileSync(this.options.storagePath, JSON.stringify(storageData, null, '\t'))

        return true
    }
}

/**
 * DotParser class.
 * @type {DotParser}
 */
module.exports = DotParser