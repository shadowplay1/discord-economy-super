const { existsSync, writeFileSync, readFileSync } = require('fs'), EconomyError = require('./EconomyError')
const events = new (require('events')).EventEmitter
module.exports = class Economy {
    /**
      * The Economy class.
      * @param {Object} options Constructor options object.
      * @param {String} options.storagePath Full path to JSON file. Default: ./storage.json.
      * @param {Number} options.dailyCooldown Cooldown for Daily Command (in ms). Default: 24 Hours (60000 * 60 * 24) ms
      * @param {Number} options.workCooldown Cooldown for Work Command (in ms). Default: 1 Hour (60000 * 60) ms
      * @param {Number} options.dailyAmount Amount of money for Daily Command. Default: 100.
      * @param {Number | Array} options.workAmount Amount of money for Work Command. Default: [10, 50].
      * @param {Number} options.updateCountdown Checks for if storage file exists in specified time (in ms). Default: 1000.
      * @param {String} options.dateLocale The region (example: ru; en) to format date and time. Default: ru.
      * @param {Boolean} options.checkUpdates Sends the update state message in console on start. Default: true.
      */
    constructor(options = {}) {
        /**
         * Economy ready status.
         */
        this.ready = false
        /**
         * Module version.
         */
        this.version = module.exports.version
        /**
         * Constructor options object.
         */
        this.options = options
        /**
         * 'EconomyError' Error class.
         */
        this.EconomyError = EconomyError
        this.init()
    }

    /**
     * @param {'balanceSet' | 'balanceAdd' | 'balanceSubtract' | 'shopAddItem' | 'shopEditItem' | 'shopClear'} event 
     * @param {Function} fn 
     */
    on(event, fn) {
        events.on(event, fn)
    }
    /**
     * @param {'balanceSet' | 'balanceAdd' | 'balanceSubtract' | 'shopAddItem' | 'shopEditItem' | 'shopClear'} event 
     * @param {Function} fn 
     */
    once(event, fn) {
        events.once(event, fn)
    }
    /**
     * @param {'balanceSet' | 'balanceAdd' | 'balanceSubtract' | 'shopAddItem' | 'shopEditItem' | 'shopClear'} event 
     * @param {Function} fn 
     */
    off(event, fn) {
        events.off(event, fn)
    }
    /**
     * @param {'balanceSet' | 'balanceAdd' | 'balanceSubtract' | 'shopAddItem' | 'shopEditItem' | 'shopClear'} event 
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
     * Fetches the user's balance.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns User's balance
     */
    fetch(memberID, guildID) {
        const balance = Number(this.all()[guildID]?.[memberID]?.money || 0)
        return balance
    }
    /**
     * Sets the money amount on user's balance.
     * @param {Number} amount Amount of money that you want to set
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @param {any} reason The reason why you set the money
     * @returns Money amount
     */
    set(amount, memberID, guildID, reason = null) {
        if (isNaN(amount)) throw new EconomyError(`amount must be a number. Received type: ${typeof amount}`)
        if (typeof memberID !== 'string') throw new EconomyError(`memberID must be a string. Received type: ${typeof memberID}`)
        if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.getDailyCooldown(memberID, guildID),
            workCooldown: this.getWorkCooldown(memberID, guildID),
            money: Number(amount),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID)
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj))
        /**
         * Emits when you set the balance
         * @event balanceSet
         */
        this.emit('balanceSet', { guildID, memberID, amount: Number(amount), reason })
        return Number(amount)
    }
    /**
     * Adds the money amount on user's balance.
     * @param {Number} amount Amount of money that you want to add
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @param {any} reason The reason why you add the money
     * @returns Money amount
     */
    add(amount, memberID, guildID, reason = null) {
        if (isNaN(amount)) throw new EconomyError(`amount must be a number. Received type: ${typeof amount}`)
        if (typeof memberID !== 'string') throw new EconomyError(`memberID must be a string. Received type: ${typeof memberID}`)
        if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
        const money = JSON.parse(readFileSync(this.options.storagePath).toString())[guildID]?.[memberID]?.money || 0
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.getDailyCooldown(memberID, guildID),
            workCooldown: this.getWorkCooldown(memberID, guildID),
            money: Number(money) + Number(amount),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID)
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj))
        /**
        * Emits when you add money on the balance
        * @event balanceAdd
        */
        this.emit('balanceAdd', { guildID, memberID, amount: Number(amount), reason })
        return Number(amount)
    }
    /**
    * Subtracts the money amount from user's balance.
    * @param {Number} amount Amount of money that you want to subtract
    * @param {String} memberID Member ID
    * @param {String} guildID Guild ID
    * @param {any} reason The reason why you subtract the money
    * @returns Money amount
    */
    subtract(amount, memberID, guildID, reason = null) {
        if (isNaN(amount)) throw new EconomyError(`amount must be a number. Received type: ${typeof amount}`)
        if (typeof memberID !== 'string') throw new EconomyError(`memberID must be a string. Received type: ${typeof memberID}`)
        if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
        const money = JSON.parse(readFileSync(this.options.storagePath).toString())[guildID]?.[memberID]?.money || 0
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.getDailyCooldown(memberID, guildID),
            workCooldown: this.getWorkCooldown(memberID, guildID),
            money: Number(money) - Number(amount),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID)
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj))
        /**
         * Emits when you subtract money from the balance
         * @event balanceSubtract
         */
        this.emit('balanceSubtract', { guildID, memberID, amount: Number(amount), reason })
        return Number(amount)
    }
    /**
    * Fetches the entire database storage.
    * @returns Database contents
    */
    all() {
        return JSON.parse(readFileSync(this.options.storagePath).toString())
    }
    /**
     * Adds a daily reward on user's balance
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @param {any} reason The reason why the money was added. Default: 'claimed the daily reward'
     * @returns Daily money amount or time before next claim
     */
    daily(memberID, guildID, reason = 'claimed the daily reward') {
        if (typeof memberID !== 'string') throw new EconomyError(`memberID must be a string. Received type: ${typeof memberID}`)
        if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
        let cooldown = this.options.dailyCooldown
        let reward = this.options.dailyAmount
        let cd = JSON.parse(readFileSync(this.options.storagePath).toString())[guildID]?.[memberID]?.dailyCooldown || null
        if (cd !== null && cooldown - (Date.now() - cd) > 0) return String(require('ms')(cooldown - (Date.now() - cd)))
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: Date.now(),
            workCooldown: this.getWorkCooldown(memberID, guildID),
            money: this.fetch(memberID, guildID),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID)
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj))
        this.add(reward, memberID, guildID, reason)
        return Number(reward)
    }
    /**
     * Adds a work reward on user's balance
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @param {any} reason The reason why the money was added. Default: 'claimed the work reward'
     * @returns Work money amount
     */
    work(memberID, guildID, reason = 'claimed the work reward') {
        if (typeof memberID !== 'string') throw new EconomyError(`memberID must be a string. Received type: ${typeof memberID}`)
        if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
        let cooldown = this.options.workCooldown
        let workAmount = this.options.workAmount
        let reward = Array.isArray(workAmount) ? Math.ceil(Math.random() * (Number(workAmount[0]) - Number(workAmount[1])) + Number(workAmount[1])) : this.options.workAmount
        let cd = JSON.parse(readFileSync(this.options.storagePath).toString())[guildID]?.[memberID]?.workCooldown || null
        if (cd !== null && cooldown - (Date.now() - cd) > 0) return String(require('ms')(cooldown - (Date.now() - cd)))
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString())
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID][memberID] = {
            dailyCooldown: this.getDailyCooldown(memberID, guildID),
            workCooldown: Date.now(),
            money: this.fetch(memberID, guildID),
            inventory: this.shop.inventory(memberID, guildID),
            history: this.shop.history(memberID, guildID)
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj))
        this.add(reward, memberID, guildID, reason)
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
        return lb.sort((a, b) => b.money - a.money).filter(x => !isNaN(x.money))
    }
    /**
    * An object with methods to create a shop on your server.
    */
    shop = {
        /**
         * Creates an item in shop.
         * @param {Object} options Options object with item info
         * @param {String} options.itemName Item name
         * @param {Number} options.price Item price
         * @param {String} options.message Item message that will be returned on buying
         * @param {String} options.description Item description
         * @param {Number} options.maxAmount Max item amount that user can hold in his inventory
         * @param {String} guildID Guild ID
         * @returns {Object} Item info
         */
        addItem(guildID, options) {
            let { itemName, price, message, description, maxAmount } = options
            if (typeof options.itemName !== 'string') throw new EconomyError(`options.itemName must be a string. Received type: ${typeof options.itemName}`)
            if (isNaN(options.price)) throw new EconomyError(`options.price must be a number. Received type: ${typeof options.price}`)
            if (typeof options.message !== 'string') throw new EconomyError(`options.message must be a string. Received type: ${typeof options.message}`)
            if (typeof options.description !== 'string') throw new EconomyError(`options.description must be a string. Received type: ${typeof options.description}`)
            if (isNaN(options.maxAmount)) throw new EconomyError(`options.maxAmount must be a number. Received type: ${typeof options.maxAmount}`)
            if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath))
            let shop = obj[guildID]?.shop || []
            let id = shop.length ? shop.length + 1 : 1
            shop.push({
                id,
                itemName,
                price,
                message,
                description,
                maxAmount
            })
            obj[guildID]['shop'] = shop
            writeFileSync(module.exports.options.storagePath, JSON.stringify(obj))
            let itemInfo = { id, itemName, price, message, description, maxAmount }
            /**
             * Emits when you add the item in the guild shop
             * @event shopAddItem
             */
            module.exports.emit('shopAddItem', itemInfo)
            return itemInfo
        },
        /**
         * Edits the item in shop.
         * @param {Number | String} itemID Item ID or name
         * @param {String} guildID Guild ID
         * @param {'description' | 'price' | 'itemName' | 'message' | 'maxAmount'} arg This argument means what thing in item you want to edit. Avaible arguments: description, price, name, message, amount
         * @returns {Boolean} true
         */
        editItem(itemID, guildID, arg, value) {
            let edit = (arg, value) => {
                let obj = JSON.parse(readFileSync(module.exports.options.storagePath))
                let shop = obj[guildID]?.shop || []
                let i = shop.findIndex(x => x.id == itemID || x.itemName == itemID)
                if (i == -1) return null
                let item = shop[i]
                /**
                * Emits when you edit the item in the guild shop
                * @event shopEditItem
                */
                module.exports.emit('shopEditItem', { itemID, guildID, changed: arg, oldValue: item[arg], newValue: value })
                item[arg] = value
                shop.splice(i, 1, item)
                obj[guildID]['shop'] = shop;
                writeFileSync(module.exports.options.storagePath, JSON.stringify(obj))
            }
            let args = ['description', 'price', 'itemName', 'message', 'maxAmount']
            if (typeof itemID !== 'number' && typeof itemID !== 'string') throw new EconomyError(`itemID must be a string or a number. Received type: ${typeof itemID}`)
            if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
            if (!args.includes(arg)) throw new EconomyError(`arg parameter must be one of these values: ${args.join(', ')}. Received: ${arg}`)
            if (value == undefined) throw new EconomyError(`no value specified. Received: ${value}`)
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
                default: null
            }
            return true
        },
        /**
         * Removes an item from the shop.
         * @param {Number | String} itemID Item ID or name 
         * @param {String} guildID Guild ID
         * @returns {Boolean} true or false
         */
        removeItem(itemID, guildID) {
            if (typeof itemID !== 'number' && typeof itemID !== 'string') throw new EconomyError(`itemID must be a string or a number. Received type: ${typeof itemID}`)
            if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath))
            let shop = obj[guildID]?.shop || []
            const item = shop.find(x => x.id == itemID || x.itemName == itemID)
            if (!item) return false
            shop = shop.filter(x => x.id !== item.id)
            obj[guildID]['shop'] = shop;
            /**
            * Emits when you remove the item in the guild shop
            * @event shopEditItem
            */
            module.exports.emit('shopRemoveItem', { id: item.id, itemName: item.itemName, price: item.price, message: item.message, description: item.description, maxAmount: item.maxAmount })
            writeFileSync(module.exports.options.storagePath, JSON.stringify(obj))
            return true
        },
        /**
         * Clears the shop.
         * @param {String} guildID Guild ID
         * @returns {Boolean} true
         */
        clear(guildID) {
            if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath))
            if (!obj[guildID]?.shop || !obj[guildID]?.shop?.length) {
                /**
                * Emits when you clear the shop
                * @event shopClear
                */
                module.exports.emit('shopClear', false)
                return false
            }
            obj[guildID]['shop'] = []
            writeFileSync(module.exports.options.storagePath, JSON.stringify(obj))
            module.exports.emit('shopClear', true)
            return true
        },
        /**
         * Clears the user's inventory.
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @returns {Boolean} true
         */
        clearInventory(memberID, guildID) {
            if (typeof memberID !== 'string') throw new EconomyError(`memberID must be a string. Received type: ${typeof memberID}`)
            if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath))
            obj[guildID][memberID] = {
                dailyCooldown: JSON.parse(readFileSync(module.exports.options.storagePath).toString())[guildID]?.[memberID]?.dailyCooldown || null,
                workCooldown: JSON.parse(readFileSync(module.exports.options.storagePath).toString())[guildID]?.[memberID]?.workCooldown || null,
                money: JSON.parse(readFileSync(module.exports.options.storagePath).toString())[guildID]?.[memberID]?.money || 0,
                inventory: [],
                history: this.history(memberID, guildID)
            }
            writeFileSync(module.exports.options.storagePath, JSON.stringify(obj))
            return true
        },
        /**
         * Clears the user's purchases history.
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @returns {Boolean} true
         */
        clearHistory(memberID, guildID) {
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath))
            obj[guildID][memberID] = {
                dailyCooldown: JSON.parse(readFileSync(module.exports.options.storagePath).toString())[guildID]?.[memberID]?.dailyCooldown || null,
                workCooldown: JSON.parse(readFileSync(module.exports.options.storagePath).toString())[guildID]?.[memberID]?.workCooldown || null,
                money: JSON.parse(readFileSync(module.exports.options.storagePath).toString())[guildID]?.[memberID]?.money || 0,
                inventory: this.inventory(memberID, guildID),
                history: []
            }
            writeFileSync(module.exports.options.storagePath, JSON.stringify(obj))
            return true
        },
        /**
         * Shows all items in the shop.
         * @param {String} guildID Guild ID
         * @returns {Array} The shop
         */
        list(guildID) {
            if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
            return JSON.parse(readFileSync(module.exports.options.storagePath))[guildID]?.shop || []
        },
        /**
         * Searches for the item in the shop.
         * @param {Number | String} itemID Item ID or name 
         * @param {String} guildID Guild ID
         * @returns {Object} If item not found: null; else: item data
         */
        searchItem(itemID, guildID) {
            if (typeof itemID !== 'number' && typeof itemID !== 'string') throw new EconomyError(`itemID must be a string or a number. Received type: ${typeof itemID}`)
            if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath))
            let shop = obj[guildID]?.shop || []
            let item = shop.find(x => x.id == itemID || x.itemName == itemID)
            if (!item) return false
            return item
        },
        /**
         * Buys the item from the shop
         * @param {Number | String} itemID Item ID or name
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @param {any} reason The reason why the money was added. Default: 'received the item from the shop'
         * @returns {Boolean} true
         */
        buy(itemID, memberID, guildID, reason = 'received the item from the shop') {
            if (typeof itemID !== 'number' && typeof itemID !== 'string') throw new EconomyError(`itemID must be a string or a number. Received type: ${typeof itemID}`)
            if (typeof memberID !== 'string') throw new EconomyError(`memberID must be a string. Received type: ${typeof memberID}`)
            if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath).toString());
            let shop = obj[guildID]?.shop || []
            let item = shop.find(x => x.id == itemID || x.itemName == itemID)
            if (!item) return false
            if (!obj[guildID]) obj[guildID] = {}
            const bal = obj[guildID]?.[memberID]?.money
            writeFileSync(module.exports.options.storagePath, JSON.stringify(obj))
            let inv = this.inventory(memberID, guildID)
            inv.push({ id: inv.length ? inv.length + 1 : 1, itemName: item.itemName, price: item.price, message: item.message, date: new Date().toLocaleString(module.exports.options.dateLocale || 'ru') })
            let history = JSON.parse(readFileSync(module.exports.options.storagePath).toString())[guildID]?.[memberID]?.history || []
            history.push({ id: history.length ? history.length + 1 : 1, memberID, guildID, itemName: item.itemName, price: item.price, date: new Date().toLocaleString(module.exports.options.dateLocale || 'ru') })
            obj[guildID][memberID] = {
                dailyCooldown: JSON.parse(readFileSync(module.exports.options.storagePath).toString())[guildID]?.[memberID]?.dailyCooldown || null,
                workCooldown: JSON.parse(readFileSync(module.exports.options.storagePath).toString())[guildID]?.[memberID]?.workCooldown || null,
                money: Number(bal) - Number(item.price),
                inventory: inv,
                history
            };
            writeFileSync(module.exports.options.storagePath, JSON.stringify(obj))
            module.exports.emit('balanceSubtract', { guildID, memberID, amount: item.price, reason })
            return true
        },
        /**
         * Shows all items in user's inventory
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @returns {Array} The user's inventory
         */
        inventory(memberID, guildID) {
            if (typeof memberID !== 'string') throw new EconomyError(`memberID must be a string. Received type: ${typeof memberID}`)
            if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath))
            let inv = obj[guildID]?.[memberID]?.inventory || []
            return inv
        },
        /**
         * Uses the item from the user's inventory.
         * @param {Number | String} itemID Item ID or name
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @returns {String} If item not found: null; else: message on item use (item.message) (String)
         */
        useItem(itemID, memberID, guildID) {
            if (typeof itemID !== 'number' && typeof itemID !== 'string') throw new EconomyError(`itemID must be a string or a number. Received type: ${typeof itemID}`)
            if (typeof memberID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof memberID}`)
            if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath)), inv = obj[guildID]?.[memberID]?.inventory || []
            const i = inv.findIndex(x => x.id == itemID || x.itemName == itemID)
            if (i == -1) return false
            const message = inv[i].message
            inv = inv.filter(x => x.id !== inv[i].id)
            obj[guildID][memberID] = {
                dailyCooldown: JSON.parse(readFileSync(module.exports.options.storagePath).toString())[guildID]?.[memberID]?.dailyCooldown || null,
                workCooldown: JSON.parse(readFileSync(module.exports.options.storagePath).toString())[guildID]?.[memberID]?.workCooldown || null,
                money: JSON.parse(readFileSync(module.exports.options.storagePath).toString())[guildID]?.[memberID]?.money || 0,
                inventory: inv,
                history: this.history(memberID, guildID)
            }
            writeFileSync(module.exports.options.storagePath, JSON.stringify(obj))
            return message
        },
        /**
         * Shows the user's purchase history.
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @returns {Array} User's purchase history
         */
        history(memberID, guildID) {
            return JSON.parse(readFileSync(module.exports.options.storagePath))[guildID]?.[memberID]?.history || []
        }
    }
    /**
     * Initializates the module. Please note: you don't need to use this method, it already starts in constructor.
     * @returns true
     * @private
     */
    async init() {
        module.exports.emit = this.emit
        this.options.storagePath = this.options.storagePath || './storage.json'
        this.options.dailyAmount == undefined || this.options.dailyAmount == null ? this.options.dailyAmount = 100 : this.options.dailyAmount = this.options.dailyAmount
        this.options.workAmount == undefined || this.options.workAmount == null ? this.options.workAmount = [10, 50] : this.options.dailyAmount = this.options.workAmount
        this.options.dailyCooldown == undefined || this.options.dailyCooldown == null ? this.options.dailyCooldown = 60000 * 60 * 24 : this.options.dailyAmount = this.options.dailyCooldown
        this.options.workCooldown == undefined || this.options.workCooldown == null ? this.options.workCooldown = 60000 * 60 : this.options.dailyAmount = this.options.workCooldown
        this.options.checkUpdates = this.options.checkUpdates || true
        if(this.options.checkUpdates) {
            const packageData = await require('node-fetch')(`https://registry.npmjs.com/discord-economy-super`).then(text => text.json())
            const colors = {
                red: '\x1b[31m',
                green: '\x1b[32m',
                yellow: '\x1b[33m',
                blue: '\x1b[34m',
                magenta: '\x1b[35m',
                cyan: '\x1b[36m',
                white: '\x1b[37m',
            }
            const v_ = this.version // Installed version
            const _v = packageData['dist-tags'].latest // Latest version
            if(v_ !== _v) {
                // Sorry, I wanna make it look perfectly xD
                console.log('\n\n')
                console.log(colors.green + '---------------------------------------------------')
                console.log(colors.green + '| @ discord-economy-super                  - [] X |')
                console.log(colors.green + '---------------------------------------------------')
                console.log(colors.yellow+ `|            The module is ${colors.red}out of date!${colors.yellow}           |`)
                console.log(colors.magenta+'|              New version is avaible!            |')
                console.log(colors.blue  + `|                  ${v_} --> ${_v}                |`)
                console.log(colors.cyan  + '|     Run "npm i discord-economy-super@latest"    |')
                console.log(colors.cyan  + '|                    to update!                   |')
                console.log(colors.white + `|          View the full changelog here:          |`)
                console.log(colors.red   + '| https://npmjs.com/package/discord-economy-super |')
                console.log(colors.green + '---------------------------------------------------')
                console.log('\n\n')
            } else {
                console.log('\n\n')
                console.log(colors.green + '---------------------------------------------------')
                console.log(colors.green + '| @ discord-economy-super                  - [] X |')
                console.log(colors.green + '---------------------------------------------------')
                console.log(colors.yellow+ `|            The module is ${colors.cyan}up to date!${colors.yellow}            |`)
                console.log(colors.magenta+'|             No updates are avaible.             |')
                console.log(colors.blue  + `|            Currnet version is ${_v}.            |`)
                console.log(colors.cyan  + '|                     Enjoy!                      |')
                console.log(colors.white + `|          View the full changelog here:          |`)
                console.log(colors.red   + '| https://npmjs.com/package/discord-economy-super |')
                console.log(colors.green + '---------------------------------------------------')
                console.log('\n\n')
            }
        }
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
        return true
    }
}