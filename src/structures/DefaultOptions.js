const EconomyOptions = {
    storagePath: './storage.json',
    dailyAmount: 100,
    updateCountdown: 1000,
    workAmount: [10, 50],
    weeklyAmount: 1000,
    dailyCooldown: 86400000,
    workCooldown: 3600000,
    weeklyCooldown: 604800000,
    checkStorage: true,
    updater: {
        checkUpdates: true,
        upToDateMessage: true
    },
    errorHandler: {
        handleErrors: true,
        attempts: 5,
        time: 5000
    }
}

/**
 * Default Economy options object.
 * @typedef {Object} EconomyOptions Default Economy options object.
 * @property {String} storagePath Full path to a JSON file. Default: './storage.json'.
 * @property {Boolean} checkStorage Checks the if database file exists and if it has errors. Default: true
 * @property {Number} dailyCooldown Cooldown for Daily Command (in ms). Default: 24 Hours (60000 * 60 * 24) ms
 * @property {Number} workCooldown Cooldown for Work Command (in ms). Default: 1 Hour (60000 * 60) ms
 * @property {Number} dailyAmount Amount of money for Daily Command. Default: 100.
 * @property {Number} weeklyCooldown Cooldown for Weekly Command (in ms). Default: 7 Days (60000 * 60 * 24 * 7) ms
 * @property {Number} weeklyAmount Amount of money for Weekly Command. Default: 1000.
 * @property {Number | Array} workAmount Amount of money for Work Command. Default: [10, 50].
 * @property {Number} updateCountdown Checks for if storage file exists in specified time (in ms). Default: 1000.
 * @property {String} dateLocale The region (example: 'ru'; 'en') to format date and time. Default: 'ru'.
 * @property {UpdaterOptions} updater Update Checker options object.
 * @property {ErrorHandlerOptions} errorHandler Error Handler options object.
 */

/**
 * @typedef {Object} UpdaterOptions
 * @property {Boolean} checkUpdates Sends the update state message in console on start. Default: true.
 * @property {Boolean} upToDateMessage Sends the message in console on start if module is up to date. Default: true.
 */

/**
 * @typedef {Object} ErrorHandlerOptions
 * @property {Boolean} handleErrors Handles all errors on startup. Default: true.
 * @property {Number} attempts Amount of attempts to load the module. Use 'null' for infinity attempts. Default: 5.
 * @property {Number} time Time between every attempt to start the module (in ms). Default: 3000.
 */

/**
 * Default Economy options object.
 * @type {EconomyOptions}
 */
module.exports = EconomyOptions