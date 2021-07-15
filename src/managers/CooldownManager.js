const { writeFileSync, readFileSync } = require('fs')

const Emitter = require('../classes/Emitter')
const EconomyError = require('../classes/EconomyError')

const errors = require('../structures/Errors')
const DefaultOptions = require('../structures/DefaultOptions')

/**
* Cooldown manager methods class.
* @extends Emitter
*/
class CooldownManager extends Emitter {
    /**
      * Economy constructor options object. There's only needed options object properties for this manager to work properly.
      * @param {Object} options Constructor options object.
      * @param {String} options.storagePath Full path to a JSON file. Default: './storage.json'.
     */
    constructor(options) {
        super()
        /**
         * Economy constructor options object.
         */
        const UtilsManager = require('./UtilsManager')
        /**
         * @private
         * @type {UtilsManager}
         */
        this.utils = new UtilsManager(options)
        /**
         * @private
         * @type {?Object}
         */
        this.options = options

        if (!options?.storagePath) this.options.storagePath = DefaultOptions.storagePath
    }
    /**
     * Gets user's daily cooldown
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Number} Cooldown end timestamp
     */
    daily(memberID, guildID) {
        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        return this.utils.all()[guildID]?.[memberID]?.dailyCooldown || null
    }
    /**
     * Gets user's work cooldown
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Number} Cooldown end timestamp
     */
    work(memberID, guildID) {
        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        return this.utils.all()[guildID]?.[memberID]?.workCooldown || null
    }
    /**
     * Gets user's work cooldown
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Number} Cooldown end timestamp
     */
    weekly(memberID, guildID) {
        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        return this.utils.all()[guildID]?.[memberID]?.weeklyCooldown || null
    }
    /**
     * Clears user's daily cooldown
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared: true; else: false
     */
    clearDaily(memberID, guildID) {
        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID][memberID]?.dailyCooldown) return false
        obj[guildID][memberID] = {
            dailyCooldown: null,
            workCooldown: this.work(memberID, guildID),
            weeklyCooldown: this.weekly(memberID, guildID),
            money: this.utils.all()[guildID]?.[memberID]?.money || 0,
            bank: this.utils.all()[guildID]?.[memberID]?.bank || 0,
            inventory: this.utils.all()[guildID]?.[memberID]?.inventory,
            history: this.utils.all()[guildID]?.[memberID]?.history
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        return true
    }
    /**
     * Clears user's work cooldown
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared: true; else: false
     */
    clearWork(memberID, guildID) {
        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID][memberID]?.workCooldown) return false
        obj[guildID][memberID] = {
            dailyCooldown: this.daily(memberID, guildID),
            workCooldown: null,
            weeklyCooldown: this.weekly(memberID, guildID),
            money: this.utils.all()[guildID]?.[memberID]?.money || 0,
            bank: this.utils.all()[guildID]?.[memberID]?.bank || 0,
            inventory: this.utils.all()[guildID]?.[memberID]?.inventory,
            history: this.utils.all()[guildID]?.[memberID]?.history
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        return true
    }
    /**
    * Clears user's work cooldown
    * @param {String} memberID Member ID
    * @param {String} guildID Guild ID
    * @returns {Boolean} If cleared: true; else: false
    */
    clearWeekly(memberID, guildID) {
        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID][memberID]?.weeklyCooldown) return false
        obj[guildID][memberID] = {
            dailyCooldown: this.daily(memberID, guildID),
            workCooldown: this.work(memberID, guildID),
            weeklyCooldown: null,
            money: this.utils.all()[guildID]?.[memberID]?.money || 0,
            bank: this.utils.all()[guildID]?.[memberID]?.bank || 0,
            inventory: this.utils.all()[guildID]?.[memberID]?.inventory,
            history: this.utils.all()[guildID]?.[memberID]?.history
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        return true
    }
}

/**
 * Cooldown manager class.
 * @type {CooldownManager}
 */
module.exports = CooldownManager