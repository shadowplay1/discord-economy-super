const { existsSync, writeFileSync, readFileSync } = require('fs'), EconomyError = require('./EconomyError')
module.exports = class Economy {
    /**
     * The Economy class.
     * @param {{
        storagePath: String, 
        dailyCooldown: Number,
        workCooldown: Number,
        dailyAmount: Number,
        workAmount: Number | Array,
        updateCountdown: Number
    }} options Options object 
    * @property {String} storagePath Full path to JSON file
     */
    constructor(options = {}) {
        this.ready = false
        this.version = module.exports.version
        this.options = options
        this.EconomyError = EconomyError
        this.init()
    }
    /**
     * Fetches the user's balance.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns User's balance
     */
    fetch(memberID, guildID) {
        return Number(this.all()[guildID]?.[memberID]?.money || 0)
    }
    /**
     * Sets the money amount on user's balance.
     * @param {Number} amount Amount of money that you want to set
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns Money amount
     */
    set(amount, memberID, guildID) {
        if (isNaN(amount)) throw new EconomyError(`amount must be a number. Received type: ${typeof amount}`)
        if (typeof memberID !== 'string') throw new EconomyError(`memberID must be a string. Received type: ${typeof memberID}`)
        if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
        let obj = require('../../../' + this.options.storagePath)
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.getDailyCooldown(memberID, guildID),
            workCooldown: this.getWorkCooldown(memberID, guildID),
            money: Number(amount)
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj))
        return Number(amount)
    }
    /**
     * Adds the money amount on user's balance.
     * @param {Number} amount Amount of money that you want to add
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns Money amount
     */
    add(amount, memberID, guildID) {
        if (isNaN(amount)) throw new EconomyError(`amount must be a number. Received type: ${typeof amount}`)
        if (typeof memberID !== 'string') throw new EconomyError(`memberID must be a string. Received type: ${typeof memberID}`)
        if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
        const money = require('../../../' + this.options.storagePath)[guildID]?.[memberID]?.money || 0
        let obj = require('../../../' + this.options.storagePath)
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.getDailyCooldown(memberID, guildID),
            workCooldown: this.getWorkCooldown(memberID, guildID),
            money: Number(money) + Number(amount)
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj))
        return Number(amount)
    }
    /**
    * Subtracts the money amount from user's balance.
    * @param {Number} amount Amount of money that you want to subtract
    * @param {String} memberID Member ID
    * @param {String} guildID Guild ID
    * @returns Money amount
    */
    subtract(amount, memberID, guildID) {
        if (isNaN(amount)) throw new EconomyError(`amount must be a number. Received type: ${typeof amount}`)
        if (typeof memberID !== 'string') throw new EconomyError(`memberID must be a string. Received type: ${typeof memberID}`)
        if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
        const money = require('../../../' + this.options.storagePath)[guildID]?.[memberID]?.money || 0
        let obj = require('../../../' + this.options.storagePath)
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.getDailyCooldown(memberID, guildID),
            workCooldown: this.getWorkCooldown(memberID, guildID),
            money: Number(money) - Number(amount)
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj))
        return Number(amount)
    }
    /**
    * Fetches the entire database storage.
    * @returns Database contents
    */
    all() {
        return require('../../../' + this.options.storagePath)
    }
    /**
     * Adds a daily reward on user's balance
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns Daily money amount or time before next claim
     */
    daily(memberID, guildID) {
        if (typeof memberID !== 'string') throw new EconomyError(`memberID must be a string. Received type: ${typeof memberID}`)
        if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
        let cooldown = this.options.dailyCooldown
        let reward = this.options.dailyAmount
        let cd = require('../../../' + this.options.storagePath)[guildID]?.[memberID]?.dailyCooldown || null
        if (cd !== null && cooldown - (Date.now() - cd) > 0) return String(require('ms')(cooldown - (Date.now() - cd)))
        let obj = require('../../../' + this.options.storagePath)
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: Date.now(),
            workCooldown: this.getWorkCooldown(memberID, guildID),
            money: this.fetch(memberID, guildID),
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj))
        this.add(reward, memberID, guildID)
        return Number(reward)
    }
    /**
     * Adds a work reward on user's balance
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns Work money amount
     */
    work(memberID, guildID) {
        if (typeof memberID !== 'string') throw new EconomyError(`memberID must be a string. Received type: ${typeof memberID}`)
        if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
        let cooldown = this.options.workCooldown
        let workAmount = this.options.workAmount
        let reward = Array.isArray(workAmount) ? Math.ceil(Math.random() * (Number(workAmount[0]) - Number(workAmount[1])) + Number(workAmount[1])) : this.options.workAmount
        let cd = require('../../../' + this.options.storagePath)[guildID]?.[memberID]?.workCooldown || null
        if (cd !== null && cooldown - (Date.now() - cd) > 0) return String(require('ms')(cooldown - (Date.now() - cd)))
        let obj = require('../../../' + this.options.storagePath)
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.getDailyCooldown(memberID, guildID),
            workCooldown: Date.now(),
            money: this.fetch(memberID, guildID),
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj))
        this.add(reward, memberID, guildID)
        return Number(reward)
    }
    /**
     * Gets user's daily cooldown
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns Cooldown end timestamp
     */
    getDailyCooldown(memberID, guildID) {
        if (typeof memberID !== 'string') throw new EconomyError(`memberID must be a string. Received type: ${typeof memberID}`)
        if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
        return this.all()[guildID]?.[memberID]?.dailyCooldown || null
    }
    /**
     * Gets user's work cooldown
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns Cooldown end timestamp
     */
    getWorkCooldown(memberID, guildID) {
        if (typeof memberID !== 'string') throw new EconomyError(`memberID must be a string. Received type: ${typeof memberID}`)
        if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
        return this.all()[guildID]?.[memberID]?.workCooldown || null
    }
    /**
     * Shows a money leaderboard for any server
     * @param {String} guildID Guild ID
     * @returns Sorted leaderboard array
     */
    leaderboard(guildID) {
        if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
        let data = this.all()[guildID]
        if (!data) throw new EconomyError('cannot generate a leaderboard: the server database is empty')
        let lb = []
        let users = Object.keys(data)
        let ranks = Object.values(this.all()[guildID]).map(x => x.money)
        for (let i in users) lb.push({ userID: users[i], money: Number(ranks[i]) })
        return lb.sort((a, b) => b.money - a.money)
    }
    /**
     * Initializates the module.
     * @returns If module successfully started: true
     */
    init() {
        this.options.storagePath = this.options.storagePath || './storage.json'
        setInterval(() => {
            let storageExists = existsSync(this.options.storagePath)
            if (!storageExists) {
                writeFileSync(this.options.storage, '{}', 'utf-8');
            }
        }, this.options.updateCountdown || 1000)
        try {
            JSON.parse(JSON.stringify(readFileSync(this.options.storagePath)))
        } catch (err) {
            if (err.message.startsWith('Cannot find module') || err.message.includes('no such file or directory')) return writeFileSync(this.options.storagePath, '{}')
            throw new EconomyError('Storage file contains wrong data.')
        }
        if (typeof this.options.storagePath !== 'string') throw new EconomyError(`options.storagePath must be type of string. Received type: ${typeof this.options.storagePath}`)
        if (this.options.dailyCooldown && typeof this.options.dailyCooldown !== 'number') throw new EconomyError(`options.dailyCooldown must be type of number. Received type: ${typeof this.options.dailyCooldown}`)
        if (this.options.dailyAmount && typeof this.options.dailyAmount !== 'number') throw new EconomyError(`options.dailyAmount must be type of number. Received type: ${typeof this.options.dailyAmount}`)
        if (this.options.workCooldown && typeof this.options.workCooldown !== 'number') throw new EconomyError(`options.workCooldown must be type of number. Received type: ${typeof this.options.workCooldown}`)
        if (this.options.workAmount && (typeof this.options.workAmount !== 'number' && !Array.isArray(this.options.workAmount))) throw new EconomyError(`options.workAmount must be type of number or array. Received type: ${typeof this.options.workAmount}`)
        if (this.options.updateCountdown && typeof this.options.updateCountdown !== 'number') throw new EconomyError(`options.updateCountdown must be type of number. Received type: ${typeof this.options.updateCountdown}`)
        if (Array.isArray(this.options.workAmount) && this.options.workAmount.length > 2) throw new EconomyError(`options.workAmount array cannot have more than 2 elements; it must have min and max values as first and second element of the array (example: [10, 20])`)
        if (Array.isArray(this.options.workAmount) && this.options.workAmount.length == 1) this.options.workAmount = Array.isArray(this.options.workAmount) && this.options.workAmount[0]
        if (Array.isArray(this.options.workAmount) && this.options.workAmount[0] > this.options.workAmount[1]) this.options.workAmount = this.options.workAmount.reverse()
        this.ready = true
    }
}
module.exports.version = require('../package.json').version