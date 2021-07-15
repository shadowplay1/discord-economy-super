const UtilsManager = require('../managers/UtilsManager')
/**
 * Dot parser class.
 * @private
 */
class DotParser {
    /**
      * Economy constructor options object.
      * @param {Object} options Constructor options object.
      * @param {String} options.storagePath Full path to a JSON file. Default: './storage.json'.
      * @param {Boolean} options.checkStorage Checks the if database file exists and if it has errors. Default: true
      * @param {Number} options.dailyCooldown Cooldown for Daily Command (in ms). Default: 24 Hours (60000 * 60 * 24) ms
      * @param {Number} options.workCooldown Cooldown for Work Command (in ms). Default: 1 Hour (60000 * 60) ms
      * @param {Number} options.dailyAmount Amount of money for Daily Command. Default: 100.
      * @param {Number} options.weeklyCooldown Cooldown for Weekly Command (in ms). Default: 7 Days (60000 * 60 * 24 * 7) ms
      * @param {Number} options.weeklyAmount Amount of money for Weekly Command. Default: 1000.
      * @param {Number | Array} options.workAmount Amount of money for Work Command. Default: [10, 50].
      * @param {Number} options.updateCountdown Checks for if storage file exists in specified time (in ms). Default: 1000.
      * @param {String} options.dateLocale The region (example: 'ru'; 'en') to format date and time. Default: 'ru'.
      * @param {Object} options.updater Update Checker options object.
      * @param {Boolean} options.updater.checkUpdates Sends the update state message in console on start. Default: true.
      * @param {Boolean} options.updater.upToDateMessage Sends the message in console on start if module is up to date. Default: true.
      * @param {Object} options.errorHandler Error Handler options object.
      * @param {Boolean} options.errorHandler.handleErrors Handles all errors on startup. Default: true.
      * @param {Number} options.errorHandler.attempts Amount of attempts to load the module. Use 'null' for infinity attempts. Default: 5.
      * @param {Number} options.errorHandler.time Time between every attempt to start the module (in ms). Default: 3000.
     */
    constructor(options) {
        /**
         * @private
         * @type {UtilsManager}
         */
        this.utils = new UtilsManager(options)
    }
    /**
     * Parses the key and fetches the value from database.
     * @param {String} key The key in database.
     * @returns {any | false} The data from database or 'false' if failed to parse or 'null' if nothing found.
     */
    parse(key) {
        const stringData = String(key)

        const storageData = this.utils.all()
        const splittedData = stringData.split('.')

        let parsed

        if (!key) return false
        if (typeof key !== 'string') return false

        switch (splittedData.length) {
            case 2:
                parsed = storageData[splittedData[0]]?.[splittedData[1]]
                break
            case 3:
                parsed = storageData[splittedData[0]]?.[splittedData[1]]?.[splittedData[2]]
                break
            case 4:
                parsed = storageData[splittedData[0]]?.[splittedData[1]]?.[splittedData[2]]?.[splittedData[3]]
                break
            case 5:
                parsed = storageData[splittedData[0]]?.[splittedData[1]]?.[splittedData[2]]?.[splittedData[3]]?.[splittedData[4]]
                break
            case 6:
                parsed = storageData[splittedData[0]]?.[splittedData[1]]?.[splittedData[2]]?.[splittedData[3]]?.[splittedData[4]]?.[splittedData[5]]
                break
            case 7:
                parsed = storageData[splittedData[0]]?.[splittedData[1]]?.[splittedData[2]]?.[splittedData[3]]?.[splittedData[4]]?.[splittedData[5]]?.[splittedData[6]]
                break
            case 8:
                parsed = storageData[splittedData[0]]?.[splittedData[1]]?.[splittedData[2]]?.[splittedData[3]]?.[splittedData[4]]?.[splittedData[5]]?.[splittedData[6]]?.[splittedData[7]]
                break
            case 9:
                parsed = storageData[splittedData[0]]?.[splittedData[1]]?.[splittedData[2]]?.[splittedData[3]]?.[splittedData[4]]?.[splittedData[5]]?.[splittedData[6]]?.[splittedData[7]]?.[splittedData[8]]
                break
            case 10:
                parsed = storageData[splittedData[0]]?.[splittedData[1]]?.[splittedData[2]]?.[splittedData[3]]?.[splittedData[4]]?.[splittedData[5]]?.[splittedData[6]]?.[splittedData[7]]?.[splittedData[8]]?.[splittedData[9]]
                break
            case 11:
                parsed = storageData[splittedData[0]]?.[splittedData[1]]?.[splittedData[2]]?.[splittedData[3]]?.[splittedData[4]]?.[splittedData[5]]?.[splittedData[6]]?.[splittedData[7]]?.[splittedData[8]]?.[splittedData[9]]?.[splittedData[10]]
                break
            case 12:
                parsed = storageData[splittedData[0]]?.[splittedData[1]]?.[splittedData[2]]?.[splittedData[3]]?.[splittedData[4]]?.[splittedData[5]]?.[splittedData[6]]?.[splittedData[7]]?.[splittedData[8]]?.[splittedData[9]]?.[splittedData[10]]?.[splittedData[11]]
                break
            default:
                parsed = storageData[key]
                break
        }

        return parsed || null
    }
    /**
     * Parses the key and sets the data in database.
     * @param {String} key The key in database.
     * @param {any} data Any data to set.
     * @returns {Boolean} If set successfully: true; else: false
     */
    set(key, data) {
        const stringData = String(key)

        const storageData = this.utils.all()
        const splittedData = stringData.split('.')

        if (!key) return false
        if (data == undefined) return false

        if (typeof key !== 'string') return false

        switch (splittedData.length) {
            case 2:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                storageData[splittedData[0]][splittedData[1]] = data
                break
            case 3:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                if (!storageData[splittedData[0]][splittedData[1]]) storageData[splittedData[0]][splittedData[1]] = {}
                storageData[splittedData[0]][splittedData[1]][splittedData[2]] = data
                break
            case 4:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                if (!storageData[splittedData[0]][splittedData[1]]) storageData[splittedData[0]][splittedData[1]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]] = {}
                storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]] = data
                break
            case 5:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                if (!storageData[splittedData[0]][splittedData[1]]) storageData[splittedData[0]][splittedData[1]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]] = {}
                storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]] = data
                break
            case 6:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                if (!storageData[splittedData[0]][splittedData[1]]) storageData[splittedData[0]][splittedData[1]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]] = {}
                storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]] = data
                break
            case 7:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                if (!storageData[splittedData[0]][splittedData[1]]) storageData[splittedData[0]][splittedData[1]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]] = {}
                storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]] = data
                break
            case 8:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                if (!storageData[splittedData[0]][splittedData[1]]) storageData[splittedData[0]][splittedData[1]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]] = {}
                storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]] = data
                break
            case 9:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                if (!storageData[splittedData[0]][splittedData[1]]) storageData[splittedData[0]][splittedData[1]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]] = {}
                storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]] = data
                break
            case 10:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                if (!storageData[splittedData[0]][splittedData[1]]) storageData[splittedData[0]][splittedData[1]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]] = {}
                storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]][splittedData[9]] = data
                break
            case 11:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                if (!storageData[splittedData[0]][splittedData[1]]) storageData[splittedData[0]][splittedData[1]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]][splittedData[9]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]][splittedData[9]] = {}
                storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]][splittedData[9]][splittedData[10]] = data
                break
            case 12:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                if (!storageData[splittedData[0]][splittedData[1]]) storageData[splittedData[0]][splittedData[1]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]][splittedData[9]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]][splittedData[9]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]][splittedData[9]][splittedData[10]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]][splittedData[9]][splittedData[10]] = {}
                storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]][splittedData[9]][splittedData[10]][splittedData[11]] = data
                break
            default:
                storageData[key] = data
                break
        }

        return this.utils.write(options.storagePath, storageData)
    }
    /**
     * Parses the key and removes the data from database. 
     * @param {String} key The key in database.
     * @returns {Boolean} If removed successfully: true; else: false
     */
    remove(key) {
        const stringData = String(key)

        const storageData = this.utils.all()
        const splittedData = stringData.split('.')

        if (!key) return false
        if (typeof key !== 'string') return false

        const data = this.parse(key)
        if (data == null) return false

        switch (splittedData.length) {
            case 2:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                storageData[splittedData[0]][splittedData[1]] = null
                break
            case 3:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                if (!storageData[splittedData[0]][splittedData[1]]) storageData[splittedData[0]][splittedData[1]] = {}
                storageData[splittedData[0]][splittedData[1]][splittedData[2]] = null
                break
            case 4:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                if (!storageData[splittedData[0]][splittedData[1]]) storageData[splittedData[0]][splittedData[1]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]] = {}
                storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]] = null
                break
            case 5:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                if (!storageData[splittedData[0]][splittedData[1]]) storageData[splittedData[0]][splittedData[1]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]] = {}
                storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]] = null
                break
            case 6:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                if (!storageData[splittedData[0]][splittedData[1]]) storageData[splittedData[0]][splittedData[1]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]] = {}
                storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]] = null
                break
            case 7:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                if (!storageData[splittedData[0]][splittedData[1]]) storageData[splittedData[0]][splittedData[1]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]] = {}
                storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]] = null
                break
            case 8:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                if (!storageData[splittedData[0]][splittedData[1]]) storageData[splittedData[0]][splittedData[1]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]] = {}
                storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]] = null
                break
            case 9:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                if (!storageData[splittedData[0]][splittedData[1]]) storageData[splittedData[0]][splittedData[1]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]] = {}
                storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]] = null
                break
            case 10:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                if (!storageData[splittedData[0]][splittedData[1]]) storageData[splittedData[0]][splittedData[1]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]] = {}
                storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]][splittedData[9]] = null
                break
            case 11:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                if (!storageData[splittedData[0]][splittedData[1]]) storageData[splittedData[0]][splittedData[1]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]][splittedData[9]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]][splittedData[9]] = {}
                storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]][splittedData[9]][splittedData[10]] = null
                break
            case 12:
                if (!storageData[splittedData[0]]) storageData[splittedData[0]] = {}
                if (!storageData[splittedData[0]][splittedData[1]]) storageData[splittedData[0]][splittedData[1]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]][splittedData[9]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]][splittedData[9]] = {}
                if (!storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]][splittedData[9]][splittedData[10]]) storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]][splittedData[9]][splittedData[10]] = {}
                storageData[splittedData[0]][splittedData[1]][splittedData[2]][splittedData[3]][splittedData[4]][splittedData[5]][splittedData[6]][splittedData[7]][splittedData[8]][splittedData[9]][splittedData[10]][splittedData[11]] = null
                break
            default:
                storageData[key] = null
                break
        }
        return this.utils.write(options.storagePath, storageData)
    }
}

/**
 * DotParser class.
 * @type {DotParser}
 */
module.exports = DotParser