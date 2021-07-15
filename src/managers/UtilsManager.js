const { existsSync, writeFileSync, readFileSync } = require('fs')
const fetch = require('node-fetch')

const EconomyError = require('../classes/EconomyError')

const errors = require('../structures/Errors')

/**
 * Utils manager methods class.
 */
class UtilsManager {
    /**
      * Economy constructor options object. There's only needed options object properties for this manager to work properly.
      * @param {Object} options Constructor options object.
      * @param {String} options.storagePath Full path to a JSON file. Default: './storage.json'.
     */
    constructor(options = {}) {
        if (!options?.storagePath) options.storagePath = './storage.json'
        /**
         * Economy constructor options object.
         * @type {?Object}
         */
        this.options = options

        if (!options?.storagePath) this.options.storagePath = DefaultOptions.storagePath
    }
    /**
     * Checks for if the module is up to date.
     * @returns {Promise<VersionData>} This method will show is the module updated, latest version and installed version.
     */
    async checkUpdates() {
        const version = require('../../package.json').version
        const packageData = await fetch(`https://registry.npmjs.com/discord-economy-super`).then(text => text.json())
        if (version == packageData['dist-tags'].latest) return {
            updated: true,
            installedVersion: version,
            packageVersion: packageData['dist-tags'].latest
        }
        return {  
            updated: false,
            installedVersion: version,
            packageVersion: packageData['dist-tags'].latest
        }
    }
    /**
    * Fetches the entire database.
    * @returns {Object} Database contents
    */
    all() {
        if (!existsSync(this.options.storagePath)) writeFileSync(this.options.storagePath, '{}')
        return JSON.parse(readFileSync(this.options.storagePath).toString())
    }
    /**
     * Writes the data to file.
     * @param {String} path File path to write.
     * @param {any} data Any data to write
     * @returns {Boolean} If successfully written: true; else: false.
     */
    write(path, data) {
        if (!path) return false
        if (!data) return false
        const fileData = readFileSync(path, { encoding: 'utf-8' }).toString()
        if (fileData == data) return false
        writeFileSync(path, JSON.stringify(data, null, '\t'))
        return true
    }
    /**
     * Clears the storage file.
     * @returns {Boolean} If cleared successfully: true; else: false
     */
    clearStorage() {
        if (readFileSync(this.options.storagePath, { encoding: 'utf-8' }) == '{}') return false
        writeFileSync(this.options.storagePath, '{}', 'utf-8')
        return true
    }
    /**
     * Fully removes the guild from database.
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared successfully: true; else: false
     */
    removeGuild(guildID) {
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        const obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) return false
        obj[guildID] = {}
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        const content = readFileSync(this.options.storagePath).toString()
        writeFileSync(this.options.storagePath, JSON.stringify(JSON.parse(content.replace(`"${guildID}":{},`, '')), null, '\t'))
        return true
    }
    /**
     * Removes the user from database.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared successfully: true; else: false
     */
    removeUser(memberID, guildID) {
        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        const obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]?.[memberID] || !Object.keys(obj[guildID]?.[memberID]).length) return false
        obj[guildID][memberID] = {}
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        return true
    }
}

/**
* Module update state.
* @typedef {Object} VersionData
* @property {Boolean} updated Is the module updated
* @property {String} installedVersion Installed version
* @property {String} packageVersion Avaible version
*/

/**
 * Utils manager class.
 * @type {UtilsManager}
 */
module.exports = UtilsManager