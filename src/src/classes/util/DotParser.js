const { writeFileSync } = require('fs')

const FetchManager = require('../../managers/FetchManager')
const DefaultConfiguration = require('../../structures/DefaultConfiguration')


/**
 * Dot parser class.
 * @private
 */
class DotParser {

    /**
     * Economy configuration.
     * @param {object} options Economy configuration.
     * @param {string} options.storagePath Full path to a JSON file. Default: './storage.json'.
     */
    constructor(options = {}) {

        /**
         * Economy configuration.
         * @private
         * @type {EconomyConfiguration}
         */
        this.options = options

        /**
         * Fetch manager methods class.
         * @type {FetchManager}
         * @private
         */
        this.fetcher = new FetchManager(options)

        if (!options.storagePath) this.storagePath = DefaultConfiguration.storagePath
    }

    /**
    * Parses the key and fetches the value from database.
    * @param {string} key The key in database.
    * @returns {any | boolean} The data from database or 'false' if failed to parse or 'null' if nothing found.
    */
    parse(key) {
        let parsed = this.fetcher.fetchAll()

        if (!key) return false
        if (typeof key !== 'string') return false

        const keys = key.split('.')
        let tmp = parsed

        for (let i = 0; i < keys.length; i++) {
            if ((keys.length - 1) == i) {
                parsed = tmp?.[keys[i]] || null
            }

            tmp = tmp?.[keys[i]]
        }

        return parsed || null
    }

    /**
     * Parses the key and sets the data in database.
     * @param {string} key The key in database.
     * @param {any} value Any data to set.
     * @returns {boolean} If set successfully: true; else: false
     */
    set(key, value) {
        const { isObject } = this
        const storageData = this.fetcher.fetchAll()

        if (!key) return false
        if (typeof key !== 'string') return false

        if (value == undefined) return false
        if (typeof value == 'function') return false


        const keys = key.split('.')
        let tmp = storageData

        for (let i = 0; i < keys.length; i++) {

            if ((keys.length - 1) == i) {
                tmp[keys[i]] = value

            } else if (!isObject(tmp[keys[i]])) {
                tmp[keys[i]] = {}
            }

            tmp = tmp?.[keys[i]]
        }

        writeFileSync(this.options.storagePath || './storage.json', JSON.stringify(storageData, null, '\t'))

        return true
    }

    /**
     * Parses the key and removes the data from database.
     * @param {string} key The key in database.
     * @returns {boolean} If removed successfully: true; else: false
     */
    remove(key) {
        const { isObject } = this
        const storageData = this.fetcher.fetchAll()

        if (!key) return false
        if (typeof key !== 'string') return false

        const data = this.parse(key)
        if (data == null) return false

        const keys = key.split('.')
        let tmp = storageData

        for (let i = 0; i < keys.length; i++) {
            if ((keys.length - 1) == i) {
                delete tmp?.[keys[i]]

            } else if (!isObject(tmp?.[keys[i]])) {
                tmp[keys[i]] = {}
            }

            tmp = tmp[keys[i]]
        }

        writeFileSync(this.options.storagePath || './storage.json', JSON.stringify(storageData, null, '\t'))

        return true
    }

    /**
     * Checks for is the item object and returns it.
     * @param {any} item The item to check.
     * @returns {boolean} Is the item object or not.
    */
    isObject(item) {
        return !Array.isArray(item)
            && typeof item == 'object'
            && item !== null
    }
}

/**
 * DotParser class.
 * @type {DotParser}
 */
module.exports = DotParser
