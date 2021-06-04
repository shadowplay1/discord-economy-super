const { existsSync, writeFileSync, readFileSync } = require('fs'), EconomyError = require('./EconomyError')
const events = new (require('events')).EventEmitter
const ms = require('../ms')
module.exports = class Economy {
    /**
      * The Economy class.
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
    constructor(options = {}) {
        /**
         * Module ready status.
         */
        this.ready = false
        /**
         * Economy errored status.
         */
        this.errored = false
        /**
         * Module version.
         */
        this.version = module.exports.version || require('../package.json').version
        /**
         * Constructor options object.
         */
        this.options = options
        /**
         * Database checking interval.
         */
        this.interval = null
        /**
         * Economy errors object.
         */
        this.errors = require('./errors')
        this.init()
    }
    /**
     * @param {'balanceSet' | 'balanceAdd' | 'balanceSubtract' | 'bankSet' | 'bankAdd' | 'bankSubtract' | 'shopAddItem' | 'shopEditItem' | 'shopItemBuy' | 'shopItemUse' | 'shopClear'} event 
     * @param {Function} fn
     */
    on(event, fn) {
        events.on(event, fn)
    }
    /**
     * @param {'balanceSet' | 'balanceAdd' | 'balanceSubtract' | 'bankSet' | 'bankAdd' | 'bankSubtract' | 'shopAddItem' | 'shopEditItem' | 'shopItemBuy' | 'shopItemUse' | 'shopClear'} event 
     * @param {Function} fn 
     */
    once(event, fn) {
        events.once(event, fn)
    }
    /**
     * @param {'balanceSet' | 'balanceAdd' | 'balanceSubtract' | 'bankSet' | 'bankAdd' | 'bankSubtract' | 'shopAddItem' | 'shopEditItem' | 'shopItemBuy' | 'shopItemUse' | 'shopClear'} event 
     * @param {Function} fn 
     */
    off(event, fn) {
        events.off(event, fn)
    }
    /**
     * @param {'balanceSet' | 'balanceAdd' | 'balanceSubtract' | 'bankSet' | 'bankAdd' | 'bankSubtract' | 'shopAddItem' | 'shopEditItem' | 'shopItemBuy' | 'shopItemUse' | 'shopClear'} event 
     * @param {Function} fn 
     */
    emit(event, ...args) {
        events.emit(event, args[0])
    }
    setMaxListeners(n) {
        events.setMaxListeners(n)
    }
    listenerCount(type) {
        events.listenerCount(type)
    }
    addListener(event, fn) {
        events.addListener(event, fn)
    }
    /**
     * Checks for if the module is up to date.
     * @returns {Promise<{updated: Boolean, installedVersion: String, packageVersion: String>} This method will show is the module updated, latest version and installed version. [Promise: Object]
     */
    async checkUpdates() {
        const packageData = await require('node-fetch')(`https://registry.npmjs.com/discord-economy-super`).then(text => text.json())
        if (this.version == packageData['dist-tags'].latest) return {
            updated: true,
            installedVersion: this.version,
            packageVersion: packageData['dist-tags'].latest
        }
        return {
            updated: false,
            installedVersion: this.version,
            packageVersion: packageData['dist-tags'].latest
        }
    }
    /**
     * Fetches the user's balance.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Number} User's balance
     */
    fetch(memberID, guildID) {
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        return Number(this.all()[guildID]?.[memberID]?.money || 0)
    }
    /**
     * Fetches the user's bank balance.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Number} User's bank balance
     */
    bankFetch(memberID, guildID) {
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        return Number(this.all()[guildID]?.[memberID]?.bank || 0)
    }
    /**
     * Sets the money amount on user's bank balance.
     * @param {Number} amount Amount of money that you want to set
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @param {string} reason The reason why you set the money
     * @returns {Number} Money amount
     */
    bankSet(amount, memberID, guildID, reason = null) {
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (isNaN(amount)) throw new EconomyError(this.errors.invalidTypes.amount + typeof amount)
        if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.getDailyCooldown(memberID, guildID),
            workCooldown: this.getWorkCooldown(memberID, guildID),
            weeklyCooldown: this.getWeeklyCooldown(memberID, guildID),
            money: this.fetch(memberID, guildID),
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
     * @param {string} reason The reason why you add the money
     * @returns {Number} Money amount
     */
    bankAdd(amount, memberID, guildID, reason = null) {
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (isNaN(amount)) throw new EconomyError(this.errors.invalidTypes.amount + typeof amount)
        if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        const money = JSON.parse(readFileSync(this.options.storagePath).toString())[guildID]?.[memberID]?.bank || 0
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.getDailyCooldown(memberID, guildID),
            workCooldown: this.getWorkCooldown(memberID, guildID),
            weeklyCooldown: this.getWeeklyCooldown(memberID, guildID),
            money: this.fetch(memberID, guildID),
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
    * @param {string} reason The reason why you subtract the money
    * @returns {Number} Money amount
    */
    bankSubtract(amount, memberID, guildID, reason = null) {
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (isNaN(amount)) throw new EconomyError(this.errors.invalidTypes.amount + typeof amount)
        if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        const money = JSON.parse(readFileSync(this.options.storagePath).toString())[guildID]?.[memberID]?.bank || 0
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.getDailyCooldown(memberID, guildID),
            workCooldown: this.getWorkCooldown(memberID, guildID),
            weeklyCooldown: this.getWeeklyCooldown(memberID, guildID),
            money: this.fetch(memberID, guildID),
            bank: Number(money) - Number(amount),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID),
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        this.emit('bankSubtract', { type: 'bankSubtract', guildID, memberID, amount: Number(amount), balance: Number(money) - Number(amount), reason })
        return Number(amount)
    }
    /**
     * Sets the money amount on user's balance.
     * @param {Number} amount Amount of money that you want to set
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @param {string} reason The reason why you set the money
     * @returns {Number} Money amount
     */
    set(amount, memberID, guildID, reason = null) {
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (isNaN(amount)) throw new EconomyError(this.errors.invalidTypes.amount + typeof amount)
        if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.getDailyCooldown(memberID, guildID),
            workCooldown: this.getWorkCooldown(memberID, guildID),
            weeklyCooldown: this.getWeeklyCooldown(memberID, guildID),
            money: Number(amount),
            bank: this.bankFetch(memberID, guildID),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID)
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        this.emit('balanceSet', { type: 'set', guildID, memberID, amount: Number(amount), balance: Number(amount), reason })
        return Number(amount)
    }
    /**
     * Adds the money amount on user's balance.
     * @param {Number} amount Amount of money that you want to add
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @param {string} reason The reason why you add the money
     * @returns {Number} Money amount
     */
    add(amount, memberID, guildID, reason = null) {
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (isNaN(amount)) throw new EconomyError(this.errors.invalidTypes.amount + typeof amount)
        if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        const money = JSON.parse(readFileSync(this.options.storagePath).toString())[guildID]?.[memberID]?.money || 0
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.getDailyCooldown(memberID, guildID),
            workCooldown: this.getWorkCooldown(memberID, guildID),
            weeklyCooldown: this.getWeeklyCooldown(memberID, guildID),
            money: Number(money) + Number(amount),
            bank: this.bankFetch(memberID, guildID),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID)
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        this.emit('balanceAdd', { type: 'add', guildID, memberID, amount: Number(amount), balance: Number(money) + Number(amount), reason })
        return Number(amount)
    }
    /**
    * Subtracts the money amount from user's balance.
    * @param {Number} amount Amount of money that you want to subtract
    * @param {String} memberID Member ID
    * @param {String} guildID Guild ID
    * @param {string} reason The reason why you subtract the money
    * @returns {Number} Money amount
    */
    subtract(amount, memberID, guildID, reason = null) {
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (isNaN(amount)) throw new EconomyError(this.errors.invalidTypes.amount + typeof amount)
        if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        const money = JSON.parse(readFileSync(this.options.storagePath).toString())[guildID]?.[memberID]?.money || 0
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.getDailyCooldown(memberID, guildID),
            workCooldown: this.getWorkCooldown(memberID, guildID),
            weeklyCooldown: this.getWeeklyCooldown(memberID, guildID),
            money: Number(money) - Number(amount),
            bank: this.bankFetch(memberID, guildID),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID),
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        this.emit('balanceSubtract', { type: 'subtract', guildID, memberID, amount: Number(amount), balance: Number(money) - Number(amount), reason })
        return Number(amount)
    }
    /**
    * Fetches the entire database.
    * @returns {Object} Database contents
    */
    all() {
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        return JSON.parse(readFileSync(this.options.storagePath).toString())
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
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        const obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if(!obj[guildID]) return false
        obj[guildID] = {}
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        const content = readFileSync(this.options.storagePath).toString()
        writeFileSync(this.options.storagePath, JSON.stringify(JSON.parse(content.replace(`"${guildID}":{},`, ''))))
        return true
    }
    /**
     * Removes the user from database.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared successfully: true; else: false
     */
    removeUser(memberID, guildID) {
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        const obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if(!obj[guildID]?.[memberID] || !Object.keys(obj[guildID]?.[memberID]).length) return false
        obj[guildID][memberID] = {}
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        return true
    }
    /**
     * Adds a daily reward on user's balance
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @param {string} reason The reason why the money was added. Default: 'claimed the daily reward'
     * @returns {Number | String} Daily money amount or time before next claim
     */
    daily(memberID, guildID, reason = 'claimed the daily reward') {
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        let cooldown = this.options.dailyCooldown
        let reward = this.options.dailyAmount
        let cd = JSON.parse(readFileSync(this.options.storagePath).toString())[guildID]?.[memberID]?.dailyCooldown || null
        if (cd !== null && cooldown - (Date.now() - cd) > 0) return String(ms(cooldown - (Date.now() - cd)))
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: Date.now(),
            workCooldown: this.getWorkCooldown(memberID, guildID),
            weeklyCooldown: this.getWeeklyCooldown(memberID, guildID),
            money: this.fetch(memberID, guildID),
            bank: this.bankFetch(memberID, guildID),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID)
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        this.add(reward, memberID, guildID, reason)
        return Number(reward)
    }
    /**
     * Adds a work reward on user's balance
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @param {string} reason The reason why the money was added. Default: 'claimed the work reward'
     * @returns {Number | String} Work money amount
     */
    work(memberID, guildID, reason = 'claimed the work reward') {
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        let cooldown = this.options.workCooldown
        let workAmount = this.options.workAmount
        let reward = Array.isArray(workAmount) ? Math.ceil(Math.random() * (Number(workAmount[0]) - Number(workAmount[1])) + Number(workAmount[1])) : this.options.workAmount
        let cd = JSON.parse(readFileSync(this.options.storagePath).toString())[guildID]?.[memberID]?.workCooldown || null
        if (cd !== null && cooldown - (Date.now() - cd) > 0) return String(ms(cooldown - (Date.now() - cd)))
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.getDailyCooldown(memberID, guildID),
            workCooldown: Date.now(),
            weeklyCooldown: this.getWeeklyCooldown(memberID, guildID),
            money: this.fetch(memberID, guildID) + reward,
            bank: this.bankFetch(memberID, guildID),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID)
        }
        this.emit('balanceAdd', {type: 'add', guildID, memberID, amount: reward, balance: this.fetch(memberID, guildID), reason})
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        return Number(reward)
    }
    /**
     * Adds a weekly reward on user's balance
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @param {string} reason The reason why the money was added. Default: 'claimed the weekly reward'
     * @returns {Number | String} Weekly money amount
     */
    weekly(memberID, guildID, reason = 'claimed the weekly reward') {
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        let cooldown = this.options.weeklyCooldown
        let cd = JSON.parse(readFileSync(this.options.storagePath).toString())[guildID]?.[memberID]?.weeklyCooldown || null
        if (cd !== null && cooldown - (Date.now() - cd) > 0) return String(ms(cooldown - (Date.now() - cd)))
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.getDailyCooldown(memberID, guildID),
            workCooldown: this.getWorkCooldown(memberID, guildID),
            weeklyCooldown: Date.now(),
            money: this.fetch(memberID, guildID),
            bank: this.bankFetch(memberID, guildID),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID)
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        this.add(this.options.weeklyAmount, memberID, guildID, reason)
        return Number(this.options.weeklyAmount)
    }
    /**
     * Gets user's daily cooldown
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Number} Cooldown end timestamp
     */
    getDailyCooldown(memberID, guildID) {
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        return this.all()[guildID]?.[memberID]?.dailyCooldown || null
    }
    /**
     * Gets user's work cooldown
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Number} Cooldown end timestamp
     */
    getWorkCooldown(memberID, guildID) {
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        return this.all()[guildID]?.[memberID]?.workCooldown || null
    }
    /**
     * Gets user's work cooldown
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Number} Cooldown end timestamp
     */
    getWeeklyCooldown(memberID, guildID) {
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        return this.all()[guildID]?.[memberID]?.weeklyCooldown || null
    }
    /**
     * Clears user's daily cooldown
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared: true; else: false
     */
    clearDailyCooldown(memberID, guildID) {
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID][memberID]?.dailyCooldown) return false
        obj[guildID][memberID] = {
            dailyCooldown: null,
            workCooldown: this.getWorkCooldown(memberID, guildID),
            weeklyCooldown: this.getWorkCooldown(memberID, guildID),
            money: this.fetch(memberID, guildID),
            bank: this.bankFetch(memberID, guildID),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID)
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
    clearWorkCooldown(memberID, guildID) {
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID][memberID]?.workCooldown) return false
        obj[guildID][memberID] = {
            dailyCooldown: this.getDailyCooldown(memberID, guildID),
            workCooldown: null,
            weeklyCooldown: this.getWorkCooldown(memberID, guildID),
            money: this.fetch(memberID, guildID),
            bank: this.bankFetch(memberID, guildID),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID)
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
    clearWeeklyCooldown(memberID, guildID) {
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID][memberID]?.weeklyCooldown) return false
        obj[guildID][memberID] = {
            dailyCooldown: this.getDailyCooldown(memberID, guildID),
            workCooldown: this.getWorkCooldown(memberID, guildID),
            weeklyCooldown: null,
            money: this.fetch(memberID, guildID),
            bank: this.bankFetch(memberID, guildID),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID)
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        return true
    }
    /**
     * Shows a money leaderboard for your server
     * @param {String} guildID Guild ID
     * @returns {data} Sorted leaderboard array
     */
    leaderboard(guildID) {
        const data = [{ userID: String(), money: Number() }]
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        let serverData = this.all()[guildID]
        if (!serverData) return []
        let lb = []
        let users = Object.keys(serverData)
        let ranks = Object.values(this.all()[guildID]).map(x => x.money)
        for (let i in users) lb.push({ userID: users[i], money: Number(ranks[i]) })
        return lb.sort((a, b) => b.money - a.money).filter(x => !isNaN(x.money))
    }
    /**
    * Shows a bank money leaderboard for your server
    * @param {String} guildID Guild ID
    * @returns {data} Sorted leaderboard array
    */
    bankLeaderboard(guildID) {
        const data = [{ userID: String(), money: Number() }]
        if (!this.ready) throw new EconomyError(this.errors.notReady)
        if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
        let serverData = this.all()[guildID]
        if (!serverData) throw new EconomyError(this.errors.emptyServerDatabase)
        let lb = []
        let users = Object.keys(serverData)
        let ranks = Object.values(this.all()[guildID]).map(x => x.bank)
        for (let i in users) lb.push({ userID: users[i], bankMoney: Number(ranks[i]) })
        return lb.sort((a, b) => b.bankMoney - a.bankMoney).filter(x => !isNaN(x.bankMoney))
    }
    /**
    * An object with methods to create a shop on your server.
    */
    shop = {
        errors: require('./errors'),
        /**
         * Creates an item in shop.
         * @param {Object} options Options object with item info.
         * @param {String} options.itemName Item name.
         * @param {Number} options.price Item price.
         * @param {String} options.message Item message that will be returned on use.
         * @param {String} options.description Item description.
         * @param {Number} options.maxAmount Max amount of the item that user can hold in his inventory.
         * @param {String} options.role Role ID from your Discord server.
         * @param {String} guildID Guild ID.
         * @returns {{ id: Number, itemName: String, price: Number, message: String, description: String, role: String, maxAmount: Number | null, role: String, date: String }} Item info.
         */
        addItem(guildID, options) {
            if (!module.exports.ready) throw new EconomyError(this.errors.notReady)
            if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
            const { itemName, price, message, description, maxAmount, role } = options
            if (typeof itemName !== 'string') throw new EconomyError(this.errors.invalidTypes.addItemOptions.itemName + typeof itemName)
            if (isNaN(price)) throw new EconomyError(this.errors.invalidTypes.addItemOptions.price + typeof price)
            if (message && typeof message !== 'string') throw new EconomyError(this.errors.invalidTypes.addItemOptions.message + typeof message)
            if (description && typeof description !== 'string') throw new EconomyError(this.errors.invalidTypes.addItemOptions.description + typeof description)
            if (maxAmount !== undefined && isNaN(maxAmount)) throw new EconomyError(this.errors.invalidTypes.addItemOptions.maxAmount + typeof maxAmount)
            if (role && typeof role !== 'string') throw new EconomyError(this.errors.invalidTypes.addItemOptions.role + typeof role)
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath))
            let shop = obj[guildID]?.shop || []
            let id = Number(shop.length ? shop.length + 1 : 1)
            const date = new Date().toLocaleString(module.exports.options.dateLocale || 'ru')
            let itemInfo = { id, itemName: String(itemName), price: Number(price), message: String(message || 'You have used this item!'), description: String(description || 'Very mysterious item.'), maxAmount: maxAmount == undefined ? null : Number(maxAmount), role: role || null, date }
            shop.push(itemInfo)
            if (!obj[guildID]) obj[guildID] = {}
            obj[guildID]['shop'] = shop
            writeFileSync(module.exports.options.storagePath, JSON.stringify(obj, null, '\t'))
            module.exports.emit('shopAddItem', itemInfo)
            return itemInfo
        },
        /**
         * Edits the item in shop.
         * @param {Number | String} itemID Item ID or name
         * @param {String} guildID Guild ID
         * @param {'description' | 'price' | 'itemName' | 'message' | 'maxAmount' | 'role'} arg This argument means what thing in item you want to edit. Avaible arguments: description, price, name, message, amount, role
         * @returns {Boolean} If edited successfully: true, else: false
         */
        editItem(itemID, guildID, arg, value) {
            if (!module.exports.ready) throw new EconomyError(this.errors.notReady)
            let edit = (arg, value) => {
                let obj = JSON.parse(readFileSync(module.exports.options.storagePath))
                let shop = obj[guildID]?.shop || []
                let i = shop.findIndex(x => x.id == itemID || x.itemName == itemID)
                if (i == -1) return false
                let item = shop[i]
                module.exports.emit('shopEditItem', { itemID, guildID, changed: arg, oldValue: item[arg], newValue: value })
                item[arg] = value
                shop.splice(i, 1, item)
                obj[guildID]['shop'] = shop;
                writeFileSync(module.exports.options.storagePath, JSON.stringify(obj, null, '\t'))
            }
            let args = ['description', 'price', 'itemName', 'message', 'maxAmount', 'role']
            if (typeof itemID !== 'number' && typeof itemID !== 'string') throw new EconomyError(this.errors.invalidTypes.editItemArgs.itemID + typeof itemID)
            if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
            if (!args.includes(arg)) throw new EconomyError(this.errors.invalidTypes.editItemArgs.arg + arg)
            if (value == undefined) throw new EconomyError(this.errors.invalidTypes.editItemArgs.arg + value)
            switch (arg) {
                case args[0]:
                    edit(args[0], value)
                    break
                case args[1]:
                    edit(args[1], value)
                    break
                case args[2]:
                    edit(args[2], value)
                    break
                case args[3]:
                    edit(args[3], value)
                    break
                case args[4]:
                    edit(args[4], value)
                    break
                case args[5]:
                    edit(args[5], value)
                    break
                default: null
            }
            return true
        },
        /**
         * Removes an item from the shop.
         * @param {Number | String} itemID Item ID or name 
         * @param {String} guildID Guild ID
         * @returns {Boolean} If removed: true, else: false
         */
        removeItem(itemID, guildID) {
            if (!module.exports.ready) throw new EconomyError(this.errors.notReady)
            if (typeof itemID !== 'number' && typeof itemID !== 'string') throw new EconomyError(this.errors.invalidTypes.editItemArgs.itemID + typeof itemID)
            if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath))
            let shop = obj[guildID]?.shop || []
            const item = shop.find(x => x.id == itemID || x.itemName == itemID)
            if (!item) return false
            shop = shop.filter(x => x.id !== item.id)
            obj[guildID]['shop'] = shop;
            module.exports.emit('shopRemoveItem', { id: item.id, itemName: item.itemName, price: item.price, message: item.message, description: item.description, maxAmount: item.maxAmount, role: item.role || null, date: item.date })
            writeFileSync(module.exports.options.storagePath, JSON.stringify(obj, null, '\t'))
            return true
        },
        /**
         * Clears the shop.
         * @param {String} guildID Guild ID
         * @returns {Boolean} If cleared: true, else: false
         */
        clear(guildID) {
            if (!module.exports.ready) throw new EconomyError(this.errors.notReady)
            if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath))
            if (!obj[guildID]?.shop || !obj[guildID]?.shop?.length) {
                module.exports.emit('shopClear', false)
                return false
            }
            obj[guildID]['shop'] = []
            writeFileSync(module.exports.options.storagePath, JSON.stringify(obj, null, '\t'))
            module.exports.emit('shopClear', true)
            return true
        },
        /**
         * Clears the user's inventory.
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @returns {Boolean} If cleared: true, else: false
         */
        clearInventory(memberID, guildID) {
            if (!module.exports.ready) throw new EconomyError(this.errors.notReady)
            const data = JSON.parse(readFileSync(module.exports.options.storagePath).toString())[guildID]?.[memberID]
            if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
            if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath))
            if (!obj[guildID][memberID]?.inventory || !obj[guildID][memberID]?.inventory?.length) return false
            obj[guildID][memberID] = {
                dailyCooldown: data?.dailyCooldown || null,
                workCooldown: data?.workCooldown || null,
                weeklyCooldown: data?.weeklyCooldown || null,
                money: data?.money || 0,
                bank: data?.bank || 0,
                inventory: [],
                history: this.history(memberID, guildID)
            }
            writeFileSync(module.exports.options.storagePath, JSON.stringify(obj, null, '\t'))
            return true
        },
        /**
         * Clears the user's purchases history.
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @returns {Boolean} If cleared: true, else: false
         */
        clearHistory(memberID, guildID) {
            if (!module.exports.ready) throw new EconomyError(this.errors.notReady)
            const data = JSON.parse(readFileSync(module.exports.options.storagePath).toString())[guildID]?.[memberID]
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath))
            if (!obj[guildID]?.history || !obj[guildID]?.history?.length) return false
            obj[guildID][memberID] = {
                dailyCooldown: data?.dailyCooldown || null,
                workCooldown: data?.workCooldown || null,
                weeklyCooldown: data?.weeklyCooldown || null,
                money: data?.money || 0,
                bank: data?.bank || 0,
                inventory: this.inventory(memberID, guildID),
                history: []
            }
            writeFileSync(module.exports.options.storagePath, JSON.stringify(obj, null, '\t'))
            return true
        },
        /**
         * Shows all items in the shop.
         * @param {String} guildID Guild ID
         * @returns {data} The shop array.
         */
        list(guildID) {
            const data = [{ id: Number(), itemName: String(), price: Number(), message: String(), description: String(), role: String(), maxAmount: Number(), role: String(), date: String() }]
            if (!module.exports.ready) throw new EconomyError(this.errors.notReady)
            if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
            return JSON.parse(readFileSync(module.exports.options.storagePath))[guildID]?.shop || []
        },
        /**
         * Searches for the item in the shop.
         * @param {Number | String} itemID Item ID or name 
         * @param {String} guildID Guild ID
         * @returns {data} If item not found: null; else: item data array
         */
        searchItem(itemID, guildID) {
            const data = { id: Number, itemName: String(), price: Number(), message: String(), description: String(), role: String(), maxAmount: Number(), role: String(), date: String() }
            if (!module.exports.ready) throw new EconomyError(this.errors.notReady)
            if (typeof itemID !== 'number' && typeof itemID !== 'string') throw new EconomyError(this.errors.invalidTypes.editItemArgs.itemID + typeof itemID)
            if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath))
            let shop = obj[guildID]?.shop || []
            let item = shop.find(x => x.id == itemID || x.itemName == itemID)
            if (!item) return null
            return item
        },
        /**
         * Buys the item from the shop
         * @param {Number | String} itemID Item ID or name
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @param {string} reason The reason why the money was added. Default: 'received the item from the shop'
         * @returns {String | Boolean} If item bought successfully: true; if item not found: false; if user reached the item's max amount: 'max'
         */
        buy(itemID, memberID, guildID, reason = 'received the item from the shop') {
            if (!module.exports.ready) throw new EconomyError(this.errors.notReady)
            const data = JSON.parse(readFileSync(module.exports.options.storagePath).toString())[guildID]?.[memberID]
            if (typeof itemID !== 'number' && typeof itemID !== 'string') throw new EconomyError(this.errors.invalidTypes.editItemArgs.itemID + typeof itemID)
            if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
            if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath).toString());
            let shop = obj[guildID]?.shop || []
            let item = shop.find(x => x.id == itemID || x.itemName == itemID)
            if (!item) return false
            if (!obj[guildID]) obj[guildID] = {}
            if (item.maxAmount && this.inventory(memberID, guildID).filter(x => x.itemName == item.itemName).length >= item.maxAmount) return 'max'
            const bal = obj[guildID]?.[memberID]?.money
            writeFileSync(module.exports.options.storagePath, JSON.stringify(obj, null, '\t'))
            let inv = this.inventory(memberID, guildID)
            const itemData = { id: inv.length ? inv.length + 1 : 1, itemName: item.itemName, price: item.price, message: item.message, description: item.description, role: item.role || null, maxAmount: item.maxAmount, maxAmount: item.maxAmount, date: new Date().toLocaleString(module.exports.options.dateLocale || 'ru') }
            inv.push(itemData)
            let history = data?.history || []
            history.push({ id: history.length ? history.length + 1 : 1, memberID, guildID, itemName: item.itemName, price: item.price, role: item.role || null, maxAmount: item.maxAmount, date: new Date().toLocaleString(module.exports.options.dateLocale || 'ru') })
            obj[guildID][memberID] = {
                dailyCooldown: data?.dailyCooldown || null,
                workCooldown: data?.workCooldown || null,
                weeklyCooldown: data?.weeklyCooldown || null,
                money: Number(bal) - Number(item.price),
                bank: data?.bank || 0,
                inventory: inv,
                history
            };
            writeFileSync(module.exports.options.storagePath, JSON.stringify(obj, null, '\t'))
            module.exports.emit('shopItemBuy', itemData)
            module.exports.emit('balanceSubtract', { type: 'subtract', guildID, memberID, amount: item.price, balance: Number(bal) - Number(item.price), reason })
            return true
        },
        /**
         * Shows all items in user's inventory
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @returns {data} The user's inventory array.
         */
        inventory(memberID, guildID) {
            const data = [{ id: Number(), itemName: String(), price: Number(), message: String(), role: String(), maxAmount: Number(), date: String() }]
            if (!module.exports.ready) throw new EconomyError(this.errors.notReady)
            if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
            if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath))
            let inv = obj[guildID]?.[memberID]?.inventory || []
            return inv
        },
        /**
         * Uses the item from the user's inventory.
         * @param {Number | String} itemID Item ID or name
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @param {Client} client The Discord Client [Optional]
         * @returns {String} Item message 
         */
        useItem(itemID, memberID, guildID, client) {
            if (!module.exports.ready) throw new EconomyError(this.errors.notReady)
            const data = JSON.parse(readFileSync(module.exports.options.storagePath).toString())[guildID]?.[memberID]
            if (typeof itemID !== 'number' && typeof itemID !== 'string') throw new EconomyError(this.errors.invalidTypes.editItemArgs.itemID + typeof itemID)
            if (typeof memberID !== 'string') throw new EconomyError(this.errors.invalidTypes.memberID + typeof memberID)
            if (typeof guildID !== 'string') throw new EconomyError(this.errors.invalidTypes.guildID + typeof guildID)
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath)), inv = obj[guildID]?.[memberID]?.inventory || []
            const i = inv.findIndex(x => x.id == itemID || x.itemName == itemID)
            if (i == -1) return false
            const item = inv[i]
            if (item.role) {
                if (item.role && !client) throw new EconomyError(this.errors.noClient)
                const guild = client.guilds.cache.get(guildID)
                const roleID = item.role.replace('<@&', '').replace('>', '')
                guild.roles.fetch(roleID).then(role => {
                    if (!role) throw new EconomyError(this.errors.roleNotFound + roleID)
                    guild.member(memberID).roles.add(role).catch(err => {
                        console.log(`\x1b[31mFailed to give a role "${guild.roles.cache.get(roleID).name}" on guild "${guild.name}" to member ${guild.member(memberID).user.tag}:\x1b[36m`)
                        console.log(err)
                    })
                })
            }
            const itemData = item
            const message = item.message
            inv = inv.filter(x => x.id !== item.id)
            obj[guildID][memberID] = {
                dailyCooldown: data?.dailyCooldown || null,
                workCooldown: data?.workCooldown || null,
                weeklyCooldown: data?.weeklyCooldown || null,
                money: data?.money || 0,
                bank: data?.bank || 0,
                inventory: inv,
                history: this.history(memberID, guildID)
            }
            writeFileSync(module.exports.options.storagePath, JSON.stringify(obj, null, '\t'))
            module.exports.emit('shopItemUse', itemData)
            return message
        },
        /**
         * Shows the user's purchase history.
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @returns {data} User's purchase history.
         */
        history(memberID, guildID) {
            const data = [{ id: Number(), memberID: String(), guildID: String(), itemName: String(), price: Number(), message: String(), role: String(), date: String() }]
            if (!module.exports.ready) throw new EconomyError(this.errors.notReady)
            return JSON.parse(readFileSync(module.exports.options.storagePath))[guildID]?.[memberID]?.history || []
        }
    }
    /**
     * Kills the Economy instance.
     * @returns {this} Economy instance.
     */
    kill() {
        clearInterval(this.interval)
        this.interval = null
        this.options = {}
        this.ready = false
        return this
    }
    /**
     * Starts the module.
     * @returns {Promise<true | void | Error>} If started successfully: true; else: Error instance.
     */
    init() {
        this.EconomyError = EconomyError
        typeof this.options.errorHandler == 'object' ? this.options.errorHandler : this.options.errorHandler = {}
        this.options.errorHandler.handleErrors == undefined ? this.options.errorHandler.handleErrors = true : this.options.errorHandler?.handleErrors
        this.options.errorHandler.attempts !== undefined ? this.options.errorHandler.attempts == null ? this.options.errorHandler.attempts = Infinity : this.options.errorHandler?.attempts : this.options.errorHandler.attempts = 5
        this.options.errorHandler.time == undefined ? this.options.errorHandler.time = 5000 : this.options.errorHandler?.time
        return this.options.errorHandler?.handleErrors ? this._init().catch(async err => {
            let attempt = 0
            if (!err instanceof EconomyError) this.errored = true
            console.log('\x1b[31mFailed to start the module:\x1b[36m')
            console.log(err)
            if (err instanceof ReferenceError) {
                this.errored = true
                return console.log('\x1b[33mTip: Reference Errors are very important and serious errors and they cannot be handled.')
            }
            else console.log(`\x1b[35mRetrying in ${(this.options.errorHandler.time / 1000).toFixed(1)} seconds...`)
            const check = () => new Promise(resolve => {
                this._init().then(x => {
                    if (x) {
                        this.errored = false
                        console.log('\x1b[32mStarted successfully! :)')
                    }
                    resolve(x)
                }).catch(err => resolve(err))
            })
            const sleep = require('util').promisify(setTimeout);
            let attempts = this.options.errorHandler.attempts == null ? Infinity : this.options.errorHandler.attempts
            while (attempt < attempts && attempt !== -1) {
                await sleep(this.options.errorHandler.time)
                if (attempt < attempts) check().then(async res => {
                    if (res.message) {
                        attempt++
                        console.log('\x1b[31mFailed to start the module:\x1b[36m')
                        console.log(err)
                        console.log(`\x1b[34mAttempt ${attempt}${attempts == Infinity ? '.' : `/${this.options.errorHandler.attempts}`}`)
                        if (attempt == attempts) return console.log(`\x1b[32mFailed to start the module within ${this.options.errorHandler.attempts} attempts...`)
                        console.log(`\x1b[35mRetrying in ${(this.options.errorHandler.time / 1000).toFixed(1)} seconds...`)
                        await sleep(this.options.errorHandler.time)
                        delete require.cache[require.resolve(`./index.js`)]
                        check()
                    } else {
                        attempt = -1
                    }
                })
            }
        }) : this._init()
    }
    /**
     * Initializates the module.
     * @returns {Promise<true | Error>} If started successfully: true; else: Error instance.
     * @private
     */
    _init() {
        return new Promise(async (resolve, reject) => {
            try {
                if (Number(process.version.split('.')[0].slice(1)) < 14) return reject(new EconomyError(this.errors.oldNodeVersion + process.version))
                if (this.errored) return
                if (this.ready) return
                module.exports.emit = this.emit
                module.exports.options = this.options
                this.options.storagePath = this.options.storagePath || './storage.json'
                if (!this.options.storagePath.endsWith('json') && !this.options.storagePath.endsWith('json/')) return reject(new EconomyError(this.errors.invalidStorage))
                typeof this.options.errorHandler == 'object' ? this.options.errorHandler : this.options.errorHandler = {}
                this.options.errorHandler.handleErrors == undefined ? this.options.errorHandler.handleErrors = true : this.options.errorHandler?.handleErrors
                this.options.errorHandler.attempts == undefined ? this.options.errorHandler.attempts = 3 : this.options.errorHandler?.attempts
                this.options.errorHandler.time == undefined ? this.options.errorHandler.time = 5000 : this.options.errorHandler?.time
                if (this.options.checkStorage == undefined ? true : this.options.checkStorage) {
                    if(!existsSync(this.options.storagePath)) writeFileSync(this.options.storagePath, '{}')
                    try {
                        JSON.parse(readFileSync(this.options.storagePath).toString())
                    } catch (err) {
                        if (err.message.includes('Unexpected') && err.message.includes('JSON')) return reject(new EconomyError(this.errors.wrongStorageData))
                        else return reject(err)
                    }
                }
                this.options.dailyAmount == undefined || this.options.dailyAmount == null ? this.options.dailyAmount = 100 : this.options.dailyAmount = this.options.dailyAmount
                this.options.updateCountdown == undefined || this.options.updateCountdown == null ? this.options.updateCountdown = 1000 : this.options.updateCountdown = this.options.updateCountdown
                this.options.workAmount == undefined || this.options.workAmount == null ? this.options.workAmount = [10, 50] : this.options.workAmount = this.options.workAmount
                this.options.weeklyAmount == undefined || this.options.weeklyAmount == null ? this.options.weeklyAmount = 1000 : this.options.weeklyAmount = this.options.weeklyAmount
                this.options.dailyCooldown == undefined || this.options.dailyCooldown == null ? this.options.dailyCooldown = 60000 * 60 * 24 : this.options.dailyCooldown = this.options.dailyCooldown
                this.options.workCooldown == undefined || this.options.workCooldown == null ? this.options.workCooldown = 60000 * 60 : this.options.workCooldown = this.options.workCooldown
                this.options.weeklyCooldown == undefined || this.options.weeklyCooldown == null ? this.options.weeklyCooldown = 60000 * 60 * 24 * 7 : this.options.weeklyCooldown = this.options.weeklyCooldown
                this.options.checkStorage == undefined ? this.options.checkStorage = true : this.options.checkStorage
                typeof this.options.updater == 'object' ? this.options.updater : this.options.updater = {}
                typeof this.options.errorHandler == 'object' ? this.options.errorHandler : this.options.errorHandler = {}
                this.options.errorHandler.handleErrors == undefined ? this.options.errorHandler.handleErrors = true : this.options.errorHandler?.handleErrors
                this.options.errorHandler.attempts == undefined ? this.options.errorHandler.attempts = 5 : this.options.errorHandler?.attempts
                this.options.errorHandler.time == undefined ? this.options.errorHandler.time = 3000 : this.options.errorHandler?.time
                this.options.updater.checkUpdates == undefined ? this.options.updater.checkUpdates = true : this.options.updater?.checkUpdates
                this.options.updater.upToDateMessage == undefined ? this.options.updater.upToDateMessage = true : this.options.updater?.upToDateMessage
                if (this.options.updater?.checkUpdates) {
                    const version = await this.checkUpdates()
                    const colors = {
                        red: '\x1b[31m',
                        green: '\x1b[32m',
                        yellow: '\x1b[33m',
                        blue: '\x1b[34m',
                        magenta: '\x1b[35m',
                        cyan: '\x1b[36m',
                        white: '\x1b[37m',
                    }
                    if (!version.updated) {
                        console.log('\n\n')
                        console.log(colors.green + '---------------------------------------------------')
                        console.log(colors.green + '| @ discord-economy-super                  - [] X |')
                        console.log(colors.green + '---------------------------------------------------')
                        console.log(colors.yellow + `|            The module is ${colors.red}out of date!${colors.yellow}           |`)
                        console.log(colors.magenta + '|              New version is avaible!            |')
                        console.log(colors.blue + `|                  ${version.installedVersion} --> ${version.packageVersion}                |`)
                        console.log(colors.cyan + '|     Run "npm i discord-economy-super@latest"    |')
                        console.log(colors.cyan + '|                    to update!                   |')
                        console.log(colors.white + `|          View the full changelog here:          |`)
                        console.log(colors.red + '| https://npmjs.com/package/discord-economy-super |')
                        console.log(colors.green + '---------------------------------------------------\x1b[37m')
                        console.log('\n\n')
                    } else {
                        if (this.options.updater?.upToDateMessage) {
                            console.log('\n\n')
                            console.log(colors.green + '---------------------------------------------------')
                            console.log(colors.green + '| @ discord-economy-super                  - [] X |')
                            console.log(colors.green + '---------------------------------------------------')
                            console.log(colors.yellow + `|            The module is ${colors.cyan}up to date!${colors.yellow}            |`)
                            console.log(colors.magenta + '|             No updates are avaible.             |')
                            console.log(colors.blue + `|            Currnet version is ${version.packageVersion}.            |`)
                            console.log(colors.cyan + '|                     Enjoy!                      |')
                            console.log(colors.white + `|          View the full changelog here:          |`)
                            console.log(colors.red + '| https://npmjs.com/package/discord-economy-super |')
                            console.log(colors.green + '---------------------------------------------------\x1b[37m')
                            console.log('\n\n')
                        }
                    }
                }
                if (typeof this.options !== 'object') throw new EconomyError(this.errors.invalidTypes.constructorOptions.options + typeof this.options)
                if (typeof this.options.updater !== 'object') throw new EconomyError(this.errors.invalidTypes.constructorOptions.updaterType + typeof this.options.updater)
                if (typeof this.options.errorHandler !== 'object') throw new EconomyError(this.errors.invalidTypes.constructorOptions.errorHandlerType + typeof this.options.errorHandler)
                if (typeof this.options.storagePath !== 'string') throw new EconomyError(this.errors.invalidTypes.constructorOptions.storagePath + typeof this.options.storagePath)
                if (this.options.dailyCooldown && typeof this.options.dailyCooldown !== 'number') throw new EconomyError(this.errors.invalidTypes.constructorOptions.dailyCooldown + typeof this.options.dailyCooldown)
                if (this.options.dailyAmount && typeof this.options.dailyAmount !== 'number') throw new EconomyError(this.errors.invalidTypes.constructorOptions.dailyAmount + typeof this.options.dailyAmount)
                if (this.options.workCooldown && typeof this.options.workCooldown !== 'number') throw new EconomyError(this.errors.invalidTypes.constructorOptions.workCooldown + typeof this.options.workCooldown)
                if (this.options.errorHandler.attempts && typeof this.options.errorHandler.attempts !== 'number') throw new EconomyError(this.errors.invalidTypes.constructorOptions.errorHandler.attempts + typeof this.options.errorHandler.attempts)
                if (this.options.errorHandler.time && typeof this.options.errorHandler.time !== 'number') throw new EconomyError(this.errors.invalidTypes.constructorOptions.errorHandler.time + typeof this.options.errorHandler.time)
                if (this.options.errorHandler.handleErrors && typeof this.options.errorHandler.handleErrors !== 'boolean') throw new EconomyError(this.errors.invalidTypes.constructorOptions.errorHandler.handleErrors + typeof this.options.errorHandler.handleErrors)
                if (this.options.updater.checkUpdates && typeof this.options.updater.checkUpdates !== 'boolean') throw new EconomyError(this.errors.invalidTypes.constructorOptions.updater.checkUpdates + typeof this.options.updater.checkUpdates)
                if (this.options.updater.upToDateMessage && typeof this.options.updater.upToDateMessage !== 'boolean') throw new EconomyError(this.errors.invalidTypes.constructorOptions.updater.upToDateMessage + typeof this.options.updater.upToDateMessage)
                if (this.options.workAmount && (typeof this.options.workAmount !== 'number' && !Array.isArray(this.options.workAmount))) throw new EconomyError(this.errors.invalidTypes.constructorOptions.workAmount + typeof this.options.workAmount)
                if (this.options.updateCountdown && typeof this.options.updateCountdown !== 'number') throw new EconomyError(this.errors.invalidTypes.constructorOptions.updateCountdown + typeof this.options.updateCountdown)
                if (Array.isArray(this.options.workAmount) && this.options.workAmount.length > 2) throw new EconomyError(this.errors.workAmount.tooManyElements)
                if (Array.isArray(this.options.workAmount) && this.options.workAmount.length == 1) this.options.workAmount = Array.isArray(this.options.workAmount) && this.options.workAmount[0]
                if (Array.isArray(this.options.workAmount) && this.options.workAmount[0] > this.options.workAmount[1]) this.options.workAmount = this.options.workAmount.reverse()
                if (this.options.checkStorage == undefined ? true : this.options.checkStorage) {
                    const interval = setInterval(() => {
                        const storageExists = existsSync(this.options.storagePath)
                        if (!storageExists) {
                            try {
                                writeFileSync(this.options.storagePath, '{}', 'utf-8')
                            } catch (err) {
                                throw new EconomyError(this.errors.notReady)
                            }
                            console.log('\x1b[36mfailed to find a database file; created another one...\x1b[37m')
                        }
                        try {
                            JSON.parse(readFileSync(this.options.storagePath).toString())
                        } catch (err) {
                            if (err.message.includes('Unexpected token') || err.message.includes('Unexpected end')) {
                                throw new EconomyError(this.errors.wrongStorageData)
                            }
                            else {
                                reject(err)
                                throw err
                            }
                        }
                    }, this.options.updateCountdown)
                    this.interval = interval
                }
                this.ready = true
                module.exports.ready = true
                return resolve(true)
            } catch (err) {
                this.errored = true
                reject(err)
            }
        })
    }
}