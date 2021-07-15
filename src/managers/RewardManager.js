const { writeFileSync, readFileSync } = require('fs')

const Emitter = require('../classes/Emitter')
const EconomyError = require('../classes/EconomyError')

const errors = require('../structures/Errors')
const Managers = require('../structures/Managers')
const DefaultOptions = require('../structures/DefaultOptions')

const ms = require('../../ms')
const BalanceManager = require('./BalanceManager')
const BankManager = require('./BankManager')
const parse = ms => ({
    days: Math.floor(ms / 86400000),
    hours: Math.floor(ms / 3600000 % 24),
    minutes: Math.floor(ms / 60000 % 60),
    seconds: Math.floor(ms / 1000 % 60),
    milliseconds: Math.floor(ms % 1000)
})

/**
* Reward manager methods class.
* @extends Emitter
*/
class RewardManager extends Emitter {
    /**
      * Economy constructor options object. There's only needed options object properties for this manager to work properly.
      * @param {Object} options Constructor options object.
      * @param {String} options.storagePath Full path to a JSON file. Default: './storage.json'.
      * @param {Number} options.dailyCooldown Cooldown for Daily Command (in ms). Default: 24 Hours (60000 * 60 * 24) ms
      * @param {Number} options.workCooldown Cooldown for Work Command (in ms). Default: 1 Hour (60000 * 60) ms
      * @param {Number} options.dailyAmount Amount of money for Daily Command. Default: 100.
      * @param {Number} options.weeklyCooldown Cooldown for Weekly Command (in ms). Default: 7 Days (60000 * 60 * 24 * 7) ms
      * @param {Number} options.weeklyAmount Amount of money for Weekly Command. Default: 1000.
      * @param {Number | Array} options.workAmount Amount of money for Work Command. Default: [10, 50].
     */
    constructor(options) {
        super()
        const ShopManager = require('./ShopManager')
        const CooldownManager = require('./CooldownManager')
        const data = Managers.Functions(options)
        /**
         * @private
         * @type {BalanceManager}
         */
        this.balance = data.balance
        /**
         * @private
         * @type {BankManager}
         */
        this.bank = data.bank
        /**
         * @private
         * @type {ShopManager}
         */
        this.shop = new ShopManager(options)
        /**
         * @private
         * @type {CooldownManager}
         */
        this.cooldowns = new CooldownManager(options)
        /**
         * Economy constructor options object.
         * @type {?Object}
         */
        this.options = options

        if (!options?.storagePath) this.options.storagePath = DefaultOptions.storagePath

        if (!options?.dailyAmount) this.options.dailyAmount = DefaultOptions.dailyAmount
        if (!options?.dailyCooldown) this.options.dailyCooldown = DefaultOptions.dailyCooldown

        if (!options?.workAmount) this.options.workAmount = DefaultOptions.workAmount
        if (!options?.workCooldown) this.options.workCooldown = DefaultOptions.workCooldown

        if (!options?.weeklyAmount) this.options.weeklyAmount = DefaultOptions.weeklyAmount
        if (!options?.weeklyCooldown) this.options.weeklyCooldown = DefaultOptions.weeklyCooldown
    }
    /**
     * Adds a daily reward on user's balance.
     * @param {String} memberID Member ID.
     * @param {String} guildID Guild ID.
     * @param {String} reason The reason why the money was added. Default: 'claimed the daily reward'.
     * @returns {RewardData} Daily reward object.
    */
    daily(memberID, guildID, reason = 'claimed the daily reward') {
        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        let cooldown = this.options.dailyCooldown
        let reward = this.options.dailyAmount
        let cd = JSON.parse(readFileSync(this.options.storagePath).toString())[guildID]?.[memberID]?.dailyCooldown || null
        if (cd !== null && cooldown - (Date.now() - cd) > 0) return {
            status: false,
            value: parse(cooldown - (Date.now() - cd)),
            pretty: String(ms(cooldown - (Date.now() - cd))),
            reward
        }
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: Date.now(),
            workCooldown: this.cooldowns.work(memberID, guildID),
            weeklyCooldown: this.cooldowns.weekly(memberID, guildID),
            money: this.balance.fetch(memberID, guildID),
            bank: this.bank.fetch(memberID, guildID),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID)
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        this.balance.add(reward, memberID, guildID, reason)
        return {
            status: true,
            value: Number(reward),
            pretty: reward,
            reward
        }
    }
    /**
     * Adds a work reward on user's balance.
     * @param {String} memberID Member ID.
     * @param {String} guildID Guild ID.
     * @param {String} reason The reason why the money was added. Default: 'claimed the work reward'.
     * @returns {RewardData} Work reward object.
     */
    work(memberID, guildID, reason = 'claimed the work reward') {
        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        let cooldown = this.options.workCooldown
        let workAmount = this.options.workAmount
        let reward = Array.isArray(workAmount) ? Math.ceil(Math.random() * (Number(workAmount[0]) - Number(workAmount[1])) + Number(workAmount[1])) : this.options.workAmount
        let cd = JSON.parse(readFileSync(this.options.storagePath).toString())[guildID]?.[memberID]?.workCooldown || null
        if (cd !== null && cooldown - (Date.now() - cd) > 0) return {
            status: false,
            value: parse(cooldown - (Date.now() - cd)),
            pretty: String(ms(cooldown - (Date.now() - cd))),
            reward: this.options.workAmount
        }
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.cooldowns.daily(memberID, guildID),
            workCooldown: Date.now(),
            weeklyCooldown: this.cooldowns.weekly(memberID, guildID),
            money: this.balance.fetch(memberID, guildID) + reward,
            bank: this.bank.fetch(memberID, guildID),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID)
        }
        this.emit('balanceAdd', {
            type: 'add',
            guildID,
            memberID,
            amount: reward,
            balance: this.balance.fetch(memberID, guildID),
            reason
        })
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        return {
            status: true,
            value: Number(reward),
            pretty: reward,
            reward: this.options.workAmount
        }
    }
    /**
     * Adds a weekly reward on user's balance.
     * @param {String} memberID Member ID.
     * @param {String} guildID Guild ID.
     * @param {String} reason The reason why the money was added. Default: 'claimed the weekly reward'.
     * @returns {RewardData} Weekly reward object.
     */
    weekly(memberID, guildID, reason = 'claimed the weekly reward') {
        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        let cooldown = this.options.weeklyCooldown
        let reward = this.options.weeklyAmount
        let cd = JSON.parse(readFileSync(this.options.storagePath).toString())[guildID]?.[memberID]?.weeklyCooldown || null
        if (cd !== null && cooldown - (Date.now() - cd) > 0) return {
            status: false,
            value: parse(cooldown - (Date.now() - cd)),
            pretty: String(ms(cooldown - (Date.now() - cd))),
            reward
        }
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.cooldowns.daily(memberID, guildID),
            workCooldown: this.cooldowns.work(memberID, guildID),
            weeklyCooldown: Date.now(),
            money: this.balance.fetch(memberID, guildID),
            bank: this.bank.fetch(memberID, guildID),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID)
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        this.balance.add(this.options.weeklyAmount, memberID, guildID, reason)
        return {
            status: true,
            value: Number(reward),
            pretty: reward,
            reward
        }
    }
}

/**
 * @typedef {Object} RewardData
 * @property {Boolean} status The status of operation.
 * @property {CooldownData} value Reward or cooldown time object.
 * @property {String | Number} pretty Reward or formatted cooldown time object.
 * @property {Number | Array<Number>} reward Amount of money for the reward from constructor options.
 */

/**
 * @typedef {Object} CooldownData
 * @property {Number} days Amount of days until the cooldown ends.
 * @property {Number} hours Amount of hours until the cooldown ends.
 * @property {Number} minutes Amount of minutes until the cooldown ends.
 * @property {Number} seconds Amount of seconds until the cooldown ends.
 * @property {Number} milliseconds Amount of milliseconds until the cooldown ends.
 */

/**
 * Reward manager class.
 * @type {RewardManager}
 */
module.exports = RewardManager