const { writeFileSync, readFileSync } = require('fs')

const Emitter = require('../classes/Emitter')
const EconomyError = require('../classes/EconomyError')

const ShopManager = require('../managers/ShopManager')
const BalanceManager = require('../managers/BalanceManager')
const BankManager = require('../managers/BankManager')
const CooldownManager = require('../managers/CooldownManager')
const UtilsManager = require('../managers/UtilsManager')
const RewardManager = require('../managers/RewardManager')

const errors = require('../structures/Errors')
const DefaultOptions = require('./DefaultOptions')

const emitter = new Emitter()

module.exports = {
    ShopManager,
    BalanceManager,
    BankManager,
    CooldownManager,
    UtilsManager,
    RewardManager,
    /**
      * Economy constructor options object.
      * @param {Object} options Constructor options object.
      * @param {String} options.storagePath Full path to a JSON file. Default: './storage.json'.
     */
    Functions(options = {}) {
        if (!options?.storagePath) options.storagePath = DefaultOptions.storagePath
        return {
            balance: {
                /**
                 * @type {UtilsManager}
                 */
                utils: new UtilsManager(options),
                /**
                 * @type {ShopManager}
                 */
                shop: new ShopManager(options),
                /**
                 * @type {CooldownManager}
                 */
                cooldowns: new CooldownManager(options),
                /**
                * Fetches the user's balance.
                * @param {String} memberID Member ID
                * @param {String} guildID Guild ID
                * @returns {Number} User's balance
                */
                fetch(memberID, guildID) {
                    if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
                    if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
                    return Number(this.utils.all()[guildID]?.[memberID]?.money || 0)
                },
                /**
                 * Sets the money amount on user's balance.
                 * @param {Number} amount Amount of money that you want to set
                 * @param {String} memberID Member ID
                 * @param {String} guildID Guild ID
                 * @param {String} reason The reason why you set the money
                 * @returns {Number} Money amount
                 */
                set(amount, memberID, guildID, reason = null) {
                    const bank = new BankManager(options)
                    if (isNaN(amount)) throw new EconomyError(errors.invalidTypes.amount + typeof amount)
                    if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
                    if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
                    let obj = JSON.parse(readFileSync(options.storagePath).toString())
                    if (!obj[guildID]) obj[guildID] = {}
                    obj[guildID][memberID] = {
                        dailyCooldown: this.cooldowns.daily(memberID, guildID),
                        workCooldown: this.cooldowns.work(memberID, guildID),
                        weeklyCooldown: this.cooldowns.weekly(memberID, guildID),
                        money: Number(amount),
                        bank: bank.fetch(memberID, guildID),
                        inventory: this.shop.inventory(memberID, guildID),
                        history: this.shop.history(memberID, guildID)
                    }
                    writeFileSync(options.storagePath, JSON.stringify(obj, null, '\t'))
                    emitter.emit('balanceSet', { type: 'set', guildID, memberID, amount: Number(amount), balance: Number(amount), reason })
                    return Number(amount)
                },
                /**
                 * Adds the money amount on user's balance.
                 * @param {Number} amount Amount of money that you want to add
                 * @param {String} memberID Member ID
                 * @param {String} guildID Guild ID
                 * @param {String} reason The reason why you add the money
                 * @returns {Number} Money amount
                 */
                add(amount, memberID, guildID, reason = null) {
                    const bank = new BankManager(options)
                    if (isNaN(amount)) throw new EconomyError(errors.invalidTypes.amount + typeof amount)
                    if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
                    if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
                    const money = JSON.parse(readFileSync(options.storagePath).toString())[guildID]?.[memberID]?.money || 0
                    let obj = JSON.parse(readFileSync(options.storagePath).toString())
                    if (!obj[guildID]) obj[guildID] = {}
                    obj[guildID][memberID] = {
                        dailyCooldown: this.cooldowns.daily(memberID, guildID),
                        workCooldown: this.cooldowns.work(memberID, guildID),
                        weeklyCooldown: this.cooldowns.weekly(memberID, guildID),
                        money: Number(money) + Number(amount),
                        bank: bank.fetch(memberID, guildID),
                        inventory: this.shop.inventory(memberID, guildID),
                        history: this.shop.history(memberID, guildID)
                    }
                    writeFileSync(options.storagePath, JSON.stringify(obj, null, '\t'))
                    emitter.emit('balanceAdd', { type: 'add', guildID, memberID, amount: Number(amount), balance: Number(money) + Number(amount), reason })
                    return Number(amount)
                },
                /**
                * Subtracts the money amount from user's balance.
                * @param {Number} amount Amount of money that you want to subtract
                * @param {String} memberID Member ID
                * @param {String} guildID Guild ID
                * @param {String} reason The reason why you subtract the money
                * @returns {Number} Money amount
                */
                subtract(amount, memberID, guildID, reason = null) {
                    const bank = new BankManager(options)
                    if (isNaN(amount)) throw new EconomyError(errors.invalidTypes.amount + typeof amount)
                    if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
                    if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
                    const money = JSON.parse(readFileSync(options.storagePath).toString())[guildID]?.[memberID]?.money || 0
                    let obj = JSON.parse(readFileSync(options.storagePath).toString())
                    if (!obj[guildID]) obj[guildID] = {}
                    obj[guildID][memberID] = {
                        dailyCooldown: this.cooldowns.daily(memberID, guildID),
                        workCooldown: this.cooldowns.work(memberID, guildID),
                        weeklyCooldown: this.cooldowns.weekly(memberID, guildID),
                        money: Number(money) - Number(amount),
                        bank: bank.fetch(memberID, guildID),
                        inventory: this.shop.inventory(memberID, guildID),
                        history: this.shop.history(memberID, guildID),
                    }
                    writeFileSync(options.storagePath, JSON.stringify(obj, null, '\t'))
                    emitter.emit('balanceSubtract', { type: 'subtract', guildID, memberID, amount: Number(amount), balance: Number(money) - Number(amount), reason })
                    return Number(amount)
                },
                /**
                 * Shows a money leaderboard for your server
                 * @param {String} guildID Guild ID
                 * @returns {data} Sorted leaderboard array
                 */
                leaderboard(guildID) {
                    const data = [{ index: Number(), userID: String(), money: Number() }]
                    if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
                    let serverData = this.utils.all()[guildID]
                    if (!serverData) return []
                    let lb = []
                    let users = Object.keys(serverData)
                    let ranks = Object.values(this.utils.all()[guildID]).map(x => x.money)
                    for (let i in users) lb.push({ index: Number(i) + 1, userID: users[i], money: Number(ranks[i]) })
                    return lb.sort((a, b) => b.money - a.money).filter(x => !isNaN(x.money))
                }
            },
            bank: {
                /**
                 * @type {UtilsManager}
                 */
                utils: new UtilsManager(options),
                /**
                 * @type {ShopManager}
                 */
                shop: new ShopManager(options),
                /**
                 * @type {CooldownManager}
                 */
                cooldowns: new CooldownManager(options),
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
                },
                /**
                 * Sets the money amount on user's bank balance.
                 * @param {Number} amount Amount of money that you want to set
                 * @param {String} memberID Member ID
                 * @param {String} guildID Guild ID
                 * @param {String} reason The reason why you set the money
                 * @returns {Number} Money amount
                 */
                set(amount, memberID, guildID, reason = null) {
                    const balance = new BalanceManager(options)
                    if (isNaN(amount)) throw new EconomyError(errors.invalidTypes.amount + typeof amount)
                    if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
                    if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
                    let obj = JSON.parse(readFileSync(options.storagePath).toString())
                    if (!obj[guildID]) obj[guildID] = {}
                    obj[guildID][memberID] = {
                        dailyCooldown: this.cooldowns.daily(memberID, guildID),
                        workCooldown: this.cooldowns.work(memberID, guildID),
                        weeklyCooldown: this.cooldowns.weekly(memberID, guildID),
                        money: balance.fetch(memberID, guildID),
                        bank: Number(amount),
                        inventory: this.shop.inventory(memberID, guildID),
                        history: this.shop.history(memberID, guildID)
                    }
                    writeFileSync(options.storagePath, JSON.stringify(obj, null, '\t'))
                    emitter.emit('bankSet', { type: 'bankSet', guildID, memberID, amount: Number(amount), balance: Number(amount), reason })
                    return Number(amount)
                },
                /**
                 * Adds the money amount on user's bank balance.
                 * @param {Number} amount Amount of money that you want to add
                 * @param {String} memberID Member ID
                 * @param {String} guildID Guild ID
                 * @param {String} reason The reason why you add the money
                 * @returns {Number} Money amount
                 */
                add(amount, memberID, guildID, reason = null) {
                    const balance = new BalanceManager(options)
                    if (isNaN(amount)) throw new EconomyError(errors.invalidTypes.amount + typeof amount)
                    if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
                    if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
                    const money = JSON.parse(readFileSync(options.storagePath).toString())[guildID]?.[memberID]?.bank || 0
                    let obj = JSON.parse(readFileSync(options.storagePath).toString())
                    if (!obj[guildID]) obj[guildID] = {}
                    obj[guildID][memberID] = {
                        dailyCooldown: this.cooldowns.daily(memberID, guildID),
                        workCooldown: this.cooldowns.work(memberID, guildID),
                        weeklyCooldown: this.cooldowns.weekly(memberID, guildID),
                        money: balance.fetch(memberID, guildID),
                        bank: Number(money) + Number(amount),
                        inventory: this.shop.inventory(memberID, guildID),
                        history: this.shop.history(memberID, guildID)
                    }
                    writeFileSync(options.storagePath, JSON.stringify(obj, null, '\t'))
                    emitter.emit('bankAdd', { type: 'bankAdd', guildID, memberID, amount: Number(amount), balance: Number(money) + Number(amount), reason })
                    return Number(amount)
                },
                /**
                * Subtracts the money amount from user's bank balance.
                * @param {Number} amount Amount of money that you want to subtract
                * @param {String} memberID Member ID
                * @param {String} guildID Guild ID
                * @param {String} reason The reason why you subtract the money
                * @returns {Number} Money amount
                */
                subtract(amount, memberID, guildID, reason = null) {
                    const balance = new BalanceManager(options)
                    if (isNaN(amount)) throw new EconomyError(errors.invalidTypes.amount + typeof amount)
                    if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
                    if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
                    const money = JSON.parse(readFileSync(options.storagePath).toString())[guildID]?.[memberID]?.bank || 0
                    let obj = JSON.parse(readFileSync(options.storagePath).toString())
                    if (!obj[guildID]) obj[guildID] = {}
                    obj[guildID][memberID] = {
                        dailyCooldown: this.cooldowns.daily(memberID, guildID),
                        workCooldown: this.cooldowns.work(memberID, guildID),
                        weeklyCooldown: this.cooldowns.weekly(memberID, guildID),
                        money: balance.fetch(memberID, guildID),
                        bank: Number(money) - Number(amount),
                        inventory: this.shop.inventory(memberID, guildID),
                        history: this.shop.history(memberID, guildID),
                    }
                    writeFileSync(options.storagePath, JSON.stringify(obj, null, '\t'))
                    emitter.emit('bankSubtract', { type: 'bankSubtract', guildID, memberID, amount: Number(amount), balance: Number(money) - Number(amount), reason })
                    return Number(amount)
                },
                /**
                * Shows a bank money leaderboard for your server
                * @param {String} guildID Guild ID
                * @returns {data} Sorted leaderboard array
                */
                leaderboard(guildID) {
                    const data = [{ index: Number(), userID: String(), money: Number() }]
                    if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
                    let serverData = this.utils.all()[guildID]
                    if (!serverData) throw new EconomyError(errors.emptyServerDatabase)
                    let lb = []
                    let users = Object.keys(serverData)
                    let ranks = Object.values(this.utils.all()[guildID]).map(x => x.bank)
                    for (let i in users) lb.push({ index: Number(i) + 1, userID: users[i], money: Number(ranks[i]) })
                    return lb.sort((a, b) => b.bankMoney - a.bankMoney).filter(x => !isNaN(x.bankMoney))
                }
            }
        }
    }
}