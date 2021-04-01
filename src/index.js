const { existsSync, writeFileSync, readFileSync } = require('fs'), EconomyError = require('./EconomyError')
module.exports = class Economy {
    /**
      * The Economy class.
      * @param {Object} options Constructor options object.
      * @param {String} options.storagePath Full path to JSON file. Default: ./storage.json.
      * @param {Number} options.dailyCooldown Cooldown for Daily Command (in ms).
      * @param {Number} options.workCooldown Cooldown for Work Command (in ms).
      * @param {Number} options.dailyAmount Amount of money for Daily Command.
      * @param {Number | Array} options.workAmount Amount of money for Work Command.
      * @param {Number} options.updateCountdown Checks for if storage file exists in specified time (in ms). Default: 1000.
      * @param {String} options.dateLocale The region (example: ru; en) to format date and time. Default: ru.
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
     * @returns Daily money amount or time before next claim
     */
    daily(memberID, guildID) {
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
            obj[guildID]?.shop = shop
            writeFileSync(module.exports.options.storagePath, JSON.stringify(obj))
            return { id, itemName, price, message, description, maxAmount }
        },
        /**
         * Edits the item in shop.
         * @param {Number | String} itemID Item ID or name
         * @param {String} guildID Guild ID
         * @param {String} arg This argument means what thing in item you want to edit. Avaible arguments: description, price, name, message, amount
         * @returns {Boolean} true
         */
        editItem(itemID, guildID, arg, value) {
            let edit = (arg, value) => {
                let obj = JSON.parse(readFileSync(module.exports.options.storagePath))
                let shop = obj[guildID]?.shop || []
                let i = shop.findIndex(x => x.id == itemID || x.itemName == itemID)
                if(i == -1) return null
                let item = shop[i]
                item[arg] = value
                shop.splice(i, 1, item)
                obj[guildID]?.shop = shop;
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
         * Removes the item from the shop.
         * @param {Number | String} itemID Item ID or name 
         * @param {String} guildID Guild ID
         * @returns {Boolean} If item not found: null; else: true
         */
        removeItem(itemID, guildID) {
            if (typeof itemID !== 'number' && typeof itemID !== 'string') throw new EconomyError(`itemID must be a string or a number. Received type: ${typeof itemID}`)
            if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath))
            let shop = obj[guildID]?.shop || []
            let item = shop.find(x => x.id == itemID || x.itemName == itemID)
            if (!item) return null
            shop = shop.filter(x => x.id !== item.id)
            obj[guildID]?.shop = shop;
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
            obj[guildID]?.shop = []
            writeFileSync(module.exports.options.storagePath, JSON.stringify(obj))
            return true
        },
        /**
         * 
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
         * 
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
         * Searches for the item in the shop
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
            if (!item) return null
            return item
        },
        /**
         * Buys the item from the shop
         * @param {Number | String} itemID Item ID or name
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @returns {Boolean} true
         */
        buy(itemID, memberID, guildID) {
            if (typeof itemID !== 'number' && typeof itemID !== 'string') throw new EconomyError(`itemID must be a string or a number. Received type: ${typeof itemID}`)
            if (typeof memberID !== 'string') throw new EconomyError(`memberID must be a string. Received type: ${typeof memberID}`)
            if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath).toString());
            let shop = obj[guildID]?.shop || []
            let item = shop.find(x => x.id == itemID || x.itemName == itemID)
            if (!item) return null
            if (!obj[guildID]) obj[guildID] = {}
            const bal = obj[guildID]?.[memberID]?.money
            writeFileSync(module.exports.options.storagePath, JSON.stringify(obj))
            let inv = this.inventory(memberID, guildID)
            inv.push({ id: inv.length ? inv.length + 1 : 1, itemName: item.itemName, price: item.price, message: item.message, date: new Date().toLocaleString(module.exports.options.dateLocale || 'ru')})
            let history = JSON.parse(readFileSync(module.exports.options.storagePath).toString())[guildID]?.[memberID]?.history || []
            console.log(history);
            history.push({id: history.length ? history.length + 1 : 1, memberID, guildID, itemName: item.itemName, price: item.price, date: new Date().toLocaleString(module.exports.options.dateLocale || 'ru')})
            obj[guildID][memberID] = {
                dailyCooldown: JSON.parse(readFileSync(module.exports.options.storagePath).toString())[guildID]?.[memberID]?.dailyCooldown || null,
                workCooldown: JSON.parse(readFileSync(module.exports.options.storagePath).toString())[guildID]?.[memberID]?.workCooldown || null,
                money: Number(bal) - Number(item.price),
                inventory: inv,
                history
            };
            writeFileSync(module.exports.options.storagePath, JSON.stringify(obj))
            return true
        },
        /**
         * Shows all items in user's inventory
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @returns {Object} The user's inventory
         */
        inventory(memberID, guildID) {
            if (typeof memberID !== 'string') throw new EconomyError(`memberID must be a string. Received type: ${typeof memberID}`)
            if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath))
            let inv = obj[guildID]?.[memberID]?.inventory || []
            return inv
        },
        /**
         * Uses the item from the user's inventory
         * @param {Number | String} itemID Item ID or name
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @returns {String} If item not found: null; else: message on item use (item.message)
         */
        useItem(itemID, memberID, guildID) {
            if (typeof itemID !== 'number' && typeof itemID !== 'string') throw new EconomyError(`itemID must be a string or a number. Received type: ${typeof itemID}`)
            if (typeof memberID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof memberID}`)
            if (typeof guildID !== 'string') throw new EconomyError(`guildID must be a string. Received type: ${typeof guildID}`)
            let obj = JSON.parse(readFileSync(module.exports.options.storagePath))
            let inv = obj[guildID]?.[memberID]?.inventory || []
            let i = inv.findIndex(x => x.id == itemID || x.itemName == itemID)
            if (i == -1) return null
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
     * @returns void
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
        module.exports.fetch = this.fetch
        module.exports.options = this.options
        module.exports.getDailyCooldown = this.getDailyCooldown
        module.exports.getWorkCooldown = this.getWorkCooldown
    }
}