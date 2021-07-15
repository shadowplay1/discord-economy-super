const { writeFileSync, readFileSync } = require('fs')

const Emitter = require('../classes/Emitter')
const EconomyError = require('../classes/EconomyError')

const errors = require('../structures/Errors')
const DefaultOptions = require('../structures/DefaultOptions')

const CooldownManager = require('./CooldownManager')
const UtilsManager = require('./UtilsManager')
const ShopManager = require('./ShopManager')

/**
* Bank balance manager methods class.
* @extends Emitter
*/
class BankManager extends Emitter {
    /**
      * Economy constructor options object. There's only needed options object properties for this manager to work properly.
      * @param {Object} options Constructor options object.
      * @param {String} options.storagePath Full path to a JSON file. Default: './storage.json'.
     */
    constructor(options) {
        super()
        const Managers = require('../structures/Managers')
        const Balance = Managers.Functions(options).balance
        const { UtilsManager, CooldownManager, ShopManager, BalanceManager } = Managers
        /**
         * @private
         * @type {BalanceManager}
         */
        this.balance = Balance
        /**
         * @private
         * @type {CooldownManager}
         */
        this.cooldowns = new CooldownManager(options)
        /**
         * @private
         * @type {UtilsManager}
         */
        this.utils = new UtilsManager(options)
        /**
         * @private
         * @type {ShopManager}
         */
        this.shop = new ShopManager(options)
        /**
         * Economy constructor options object.
         * @type {?Object}
         */
        this.options = options

        if (!options?.storagePath) this.options.storagePath = DefaultOptions.storagePath
    }
    /**
     * Fetches the user's bank balance.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Number} User's bank balance
     */
    fetch(memberID, guildID) {
        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        return Number(this.utils.all()[guildID]?.[memberID]?.bank || 0)
    }
    /**
     * Sets the money amount on user's bank balance.
     * @param {Number} amount Amount of money that you want to set
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @param {String} reason The reason why you set the money
     * @returns {Number} Money amount
     */
    set(amount, memberID, guildID, reason = null) {
        if (isNaN(amount)) throw new EconomyError(errors.invalidTypes.amount + typeof amount)
        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.cooldowns.daily(memberID, guildID),
            workCooldown: this.cooldowns.work(memberID, guildID),
            weeklyCooldown: this.cooldowns.weekly(memberID, guildID),
            money: this.balance.fetch(memberID, guildID),
            bank: Number(amount),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID)
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        this.emit('bankSet', { type: 'bankSet', guildID, memberID, amount: Number(amount), balance: Number(amount), reason })
        return Number(amount)
    }
    /**
     * Adds the money amount on user's bank balance.
     * @param {Number} amount Amount of money that you want to add
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @param {String} reason The reason why you add the money
     * @returns {Number} Money amount
     */
    add(amount, memberID, guildID, reason = null) {
        if (isNaN(amount)) throw new EconomyError(errors.invalidTypes.amount + typeof amount)
        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        const money = JSON.parse(readFileSync(this.options.storagePath).toString())[guildID]?.[memberID]?.bank || 0
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.cooldowns.daily(memberID, guildID),
            workCooldown: this.cooldowns.work(memberID, guildID),
            weeklyCooldown: this.cooldowns.weekly(memberID, guildID),
            money: this.balance.fetch(memberID, guildID),
            bank: Number(money) + Number(amount),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID)
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        this.emit('bankAdd', { type: 'bankAdd', guildID, memberID, amount: Number(amount), balance: Number(money) + Number(amount), reason })
        return Number(amount)
    }
    /**
    * Subtracts the money amount from user's bank balance.
    * @param {Number} amount Amount of money that you want to subtract
    * @param {String} memberID Member ID
    * @param {String} guildID Guild ID
    * @param {String} reason The reason why you subtract the money
    * @returns {Number} Money amount
    */
    subtract(amount, memberID, guildID, reason = null) {
        if (isNaN(amount)) throw new EconomyError(errors.invalidTypes.amount + typeof amount)
        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        const money = JSON.parse(readFileSync(this.options.storagePath).toString())[guildID]?.[memberID]?.bank || 0
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.cooldowns.daily(memberID, guildID),
            workCooldown: this.cooldowns.work(memberID, guildID),
            weeklyCooldown: this.cooldowns.weekly(memberID, guildID),
            money: this.balance.fetch(memberID, guildID),
            bank: Number(money) - Number(amount),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID),
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        this.emit('bankSubtract', { type: 'bankSubtract', guildID, memberID, amount: Number(amount), balance: Number(money) - Number(amount), reason })
        return Number(amount)
    }
    /**
    * Shows a bank money leaderboard for your server
    * @param {String} guildID Guild ID
    * @returns {BankLeaderboard} Sorted leaderboard array
    */
    leaderboard(guildID) {
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        let serverData = this.utils.all()[guildID]
        if (!serverData) return []
        let lb = []
        let users = Object.keys(serverData)
        let ranks = Object.values(this.utils.all()[guildID]).map(x => x.bank)
        for (let i in users) lb.push({ index: Number(i) + 1, userID: users[i], money: Number(ranks[i]) })
        return lb.sort((a, b) => b.bankMoney - a.bankMoney).filter(x => !isNaN(x.bankMoney))
    }
}

/**
 * Bank balance leaderboard object.
 * @typedef {Object} BankLeaderboard
 * @property {Number} index User's place in the top.
 * @property {String} userID User's ID.
 * @property {Number} money User's amount of money in bank.
 */

/**
 * Bank manager class.
 * @type {BankManager}
 */
module.exports = BankManager