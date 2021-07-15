const { writeFileSync, readFileSync } = require('fs')

const Emitter = require('../classes/Emitter')
const EconomyError = require('../classes/EconomyError')

const errors = require('../structures/Errors')
const DefaultOptions = require('../structures/DefaultOptions')

/**
 * Shop manager methods class.
 * @extends Emitter
 */
class ShopManager extends Emitter {
    /**
      * Economy constructor options object. There's only needed options object properties for this manager to work properly.
      * @param {Object} options Constructor options object.
      * @param {String} options.storagePath Full path to a JSON file. Default: './storage.json'.
      * @param {String} options.dateLocale The region (example: 'ru'; 'en') to format date and time. Default: 'ru'.
     */
    constructor(options) {
        super()
        /**
         * Economy constructor options object.
         * @type {?Object}
         */
        this.options = options

        if (!options?.storagePath) this.options.storagePath = DefaultOptions.storagePath
        if (!options?.dateLocale) this.options.dateLocale = DefaultOptions.dateLocale
    }
    /**
     * Creates an item in shop.
     * @param {String} guildID Guild ID.
     * @param {Object} options Options object with item info.
     * @param {String} options.itemName Item name.
     * @param {Number} options.price Item price.
     * @param {String} options.message Item message that will be returned on use.
     * @param {String} options.description Item description.
     * @param {Number} options.maxAmount Max amount of the item that user can hold in his inventory.
     * @param {String} options.role Role ID from your Discord server.
     * @returns {ItemData} Item info.
     */
    addItem(guildID, options) {
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        const { itemName, price, message, description, maxAmount, role } = options
        if (typeof itemName !== 'string') throw new EconomyError(errors.invalidTypes.addItemOptions.itemName + typeof itemName)
        if (isNaN(price)) throw new EconomyError(errors.invalidTypes.addItemOptions.price + typeof price)
        if (message && typeof message !== 'string') throw new EconomyError(errors.invalidTypes.addItemOptions.message + typeof message)
        if (description && typeof description !== 'string') throw new EconomyError(errors.invalidTypes.addItemOptions.description + typeof description)
        if (maxAmount !== undefined && isNaN(maxAmount)) throw new EconomyError(errors.invalidTypes.addItemOptions.maxAmount + typeof maxAmount)
        if (role && typeof role !== 'string') throw new EconomyError(errors.invalidTypes.addItemOptions.role + typeof role)
        let obj = JSON.parse(readFileSync(this.options.storagePath))
        let shop = obj[guildID]?.shop || []
        let id = Number(shop.length ? shop[shop.length - 1].id + 1 : 1)
        const date = new Date().toLocaleString(this.options.dateLocale || 'ru')
        let itemInfo = { id, itemName: String(itemName), price: Number(price), message: String(message || 'You have used this item!'), description: String(description || 'Very mysterious item.'), maxAmount: maxAmount == undefined ? null : Number(maxAmount), role: role || null, date }
        shop.push(itemInfo)
        if (!obj[guildID]) obj[guildID] = {}
        obj[guildID]['shop'] = shop
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        this.emit('shopAddItem', itemInfo)
        return itemInfo
    }
    /**
     * Edits the item in shop.
     * @param {Number | String} itemID Item ID or name
     * @param {String} guildID Guild ID
     * @param {'description' | 'price' | 'itemName' | 'message' | 'maxAmount' | 'role'} arg This argument means what thing in item you want to edit. Avaible arguments: description, price, name, message, amount, role
     * @returns {Boolean} If edited successfully: true, else: false
     */
    editItem(itemID, guildID, arg, value) {
        let edit = (arg, value) => {
            let obj = JSON.parse(readFileSync(this.options.storagePath))
            let shop = obj[guildID]?.shop || []
            let i = shop.findIndex(x => x.id == itemID || x.itemName == itemID)
            if (i == -1) return false
            let item = shop[i]
            this.emit('shopEditItem', { itemID, guildID, changed: arg, oldValue: item[arg], newValue: value })
            item[arg] = value
            shop.splice(i, 1, item)
            obj[guildID]['shop'] = shop;
            writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        }
        let args = ['description', 'price', 'itemName', 'message', 'maxAmount', 'role']
        if (typeof itemID !== 'number' && typeof itemID !== 'string') throw new EconomyError(errors.invalidTypes.editItemArgs.itemID + typeof itemID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        if (!args.includes(arg)) throw new EconomyError(errors.invalidTypes.editItemArgs.arg + arg)
        if (value == undefined) throw new EconomyError(errors.invalidTypes.editItemArgs.arg + value)
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
    }
    /**
     * Removes an item from the shop.
     * @param {Number | String} itemID Item ID or name 
     * @param {String} guildID Guild ID
     * @returns {Boolean} If removed: true, else: false
     */
    removeItem(itemID, guildID) {
        if (typeof itemID !== 'number' && typeof itemID !== 'string') throw new EconomyError(errors.invalidTypes.editItemArgs.itemID + typeof itemID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        let obj = JSON.parse(readFileSync(this.options.storagePath))
        let shop = obj[guildID]?.shop || []
        const item = shop.find(x => x.id == itemID || x.itemName == itemID)
        if (!item) return false
        shop = shop.filter(x => x.id !== item.id)
        obj[guildID]['shop'] = shop;
        this.emit('shopRemoveItem', { id: item.id, itemName: item.itemName, price: item.price, message: item.message, description: item.description, maxAmount: item.maxAmount, role: item.role || null, date: item.date })
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        return true
    }
    /**
     * Clears the shop.
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared: true, else: false
     */
    clear(guildID) {
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        let obj = JSON.parse(readFileSync(this.options.storagePath))
        if (!obj[guildID]?.shop || !obj[guildID]?.shop?.length) {
            this.emit('shopClear', false)
            return false
        }
        obj[guildID]['shop'] = []
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        this.emit('shopClear', true)
        return true
    }
    /**
     * Clears the user's inventory.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared: true, else: false
     */
    clearInventory(memberID, guildID) {
        const data = JSON.parse(readFileSync(this.options.storagePath).toString())[guildID]?.[memberID]
        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        let obj = JSON.parse(readFileSync(this.options.storagePath))
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
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        return true
    }
    /**
     * Clears the user's purchases history.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Boolean} If cleared: true, else: false
     */
    clearHistory(memberID, guildID) {
        const data = JSON.parse(readFileSync(this.options.storagePath).toString())[guildID]?.[memberID]
        let obj = JSON.parse(readFileSync(this.options.storagePath))
        if (!obj[guildID]?.[memberID]?.history || !obj[guildID]?.[memberID]?.history?.length) return false
        obj[guildID][memberID] = {
            dailyCooldown: data?.dailyCooldown || null,
            workCooldown: data?.workCooldown || null,
            weeklyCooldown: data?.weeklyCooldown || null,
            money: data?.money || 0,
            bank: data?.bank || 0,
            inventory: this.inventory(memberID, guildID),
            history: []
        }
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        return true
    }
    /**
     * Shows all items in the shop.
     * @param {String} guildID Guild ID
     * @returns {Array<ItemData>} The shop array.
     */
    list(guildID) {
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        return JSON.parse(readFileSync(this.options.storagePath))[guildID]?.shop || []
    }
    /**
     * Searches for the item in the shop.
     * @param {Number | String} itemID Item ID or name 
     * @param {String} guildID Guild ID
     * @returns {ItemData} If item not found: null; else: item data array
     */
    searchItem(itemID, guildID) {
        if (typeof itemID !== 'number' && typeof itemID !== 'string') throw new EconomyError(errors.invalidTypes.editItemArgs.itemID + typeof itemID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        let obj = JSON.parse(readFileSync(this.options.storagePath))
        let shop = obj[guildID]?.shop || []
        let item = shop.find(x => x.id == itemID || x.itemName == itemID)
        if (!item) return null
        return item
    }
    /**
     * Buys the item from the shop
     * @param {Number | String} itemID Item ID or name
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @param {String} reason The reason why the money was added. Default: 'received the item from the shop'
     * @returns {String | Boolean} If item bought successfully: true; if item not found: false; if user reached the item's max amount: 'max'
     */
    buy(itemID, memberID, guildID, reason = 'received the item from the shop') {
        const data = JSON.parse(readFileSync(this.options.storagePath).toString())[guildID]?.[memberID]
        if (typeof itemID !== 'number' && typeof itemID !== 'string') throw new EconomyError(errors.invalidTypes.editItemArgs.itemID + typeof itemID)
        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        let obj = JSON.parse(readFileSync(this.options.storagePath).toString());
        let shop = obj[guildID]?.shop || []
        let item = shop.find(x => x.id == itemID || x.itemName == itemID)
        if (!item) return false
        if (!obj[guildID]) obj[guildID] = {}
        if (item.maxAmount && this.inventory(memberID, guildID).filter(x => x.itemName == item.itemName).length >= item.maxAmount) return 'max'
        const bal = obj[guildID]?.[memberID]?.money
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        let inv = this.inventory(memberID, guildID)
        const itemData = { id: inv.length ? inv[inv.length - 1].id + 1 : 1, itemName: item.itemName, price: item.price, message: item.message, description: item.description, role: item.role || null, maxAmount: item.maxAmount, maxAmount: item.maxAmount, date: new Date().toLocaleString(this.options.dateLocale || 'ru') }
        inv.push(itemData)
        let history = data?.history || []
        history.push({ id: history.length ? history[history.length - 1].id + 1 : 1, memberID, guildID, itemName: item.itemName, price: item.price, role: item.role || null, maxAmount: item.maxAmount, date: new Date().toLocaleString(this.options.dateLocale || 'ru') })
        obj[guildID][memberID] = {
            dailyCooldown: data?.dailyCooldown || null,
            workCooldown: data?.workCooldown || null,
            weeklyCooldown: data?.weeklyCooldown || null,
            money: Number(bal) - Number(item.price),
            bank: data?.bank || 0,
            inventory: inv,
            history
        };
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        this.emit('shopItemBuy', itemData)
        this.emit('balanceSubtract', { type: 'subtract', guildID, memberID, amount: item.price, balance: Number(bal) - Number(item.price), reason })
        return true
    }
    /**
     * Shows all items in user's inventory
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Array<InventoryData>} The user's inventory array.
     */
    inventory(memberID, guildID) {
        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        let obj = JSON.parse(readFileSync(this.options.storagePath))
        let inv = obj[guildID]?.[memberID]?.inventory || []
        return inv
    }
    /**
     * Uses the item from the user's inventory.
     * @param {Number | String} itemID Item ID or name
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @param {Client} client The Discord Client [Optional]
     * @returns {String} Item message 
     */
    useItem(itemID, memberID, guildID, client) {
        const data = JSON.parse(readFileSync(this.options.storagePath).toString())[guildID]?.[memberID]
        if (typeof itemID !== 'number' && typeof itemID !== 'string') throw new EconomyError(errors.invalidTypes.editItemArgs.itemID + typeof itemID)
        if (typeof memberID !== 'string') throw new EconomyError(errors.invalidTypes.memberID + typeof memberID)
        if (typeof guildID !== 'string') throw new EconomyError(errors.invalidTypes.guildID + typeof guildID)
        let obj = JSON.parse(readFileSync(this.options.storagePath)), inv = obj[guildID]?.[memberID]?.inventory || []
        const i = inv.findIndex(x => x.id == itemID || x.itemName == itemID)
        if (i == -1) return false
        const item = inv[i]
        if (item.role) {
            if (item.role && !client) throw new EconomyError(errors.noClient)
            const guild = client.guilds.cache.get(guildID)
            const roleID = item.role.replace('<@&', '').replace('>', '')
            guild.roles.fetch(roleID).then(role => {
                if (!role) throw new EconomyError(errors.roleNotFound + roleID)
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
        writeFileSync(this.options.storagePath, JSON.stringify(obj, null, '\t'))
        this.emit('shopItemUse', itemData)
        return message
    }
    /**
     * Shows the user's purchase history.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {Array<HistoryData>} User's purchase history.
     */
    history(memberID, guildID) {
        return JSON.parse(readFileSync(this.options.storagePath))[guildID]?.[memberID]?.history || []
    }
}

/**
 * History data object.
 * @typedef {Object} HistoryData
 * @property {Number} id Item ID in history.
 * @property {String} itemName Item name.
 * @property {Number} price Item price.
 * @property {String} message The message that will be returned on item use.
 * @property {String} role ID of Discord Role that will be given to user on item use.
 * @property {String} date Date when the item was bought.
 * @property {String} memberID Member ID.
 * @property {String} guildID Guild ID.
 */

/**
 * Item data object.
 * @typedef {Object} ItemData
 * @property {Number} id Item ID.
 * @property {String} itemName Item name.
 * @property {Number} price Item price.
 * @property {String} message The message that will be returned on item use.
 * @property {String} description Item description.
 * @property {String} role ID of Discord Role that will be given to Wuser on item use.
 * @property {Number} maxAmount Max amount of the item that user can hold in his inventory.
 * @property {String} date Date when the item was added in the shop.
 */

/**
 * Inventory data object.
 * @typedef {Object} InventoryData
 * @property {Number} id Item ID in your inventory.
 * @property {String} itemName Item name.
 * @property {Number} price Item price.
 * @property {String} message The message that will be returned on item use.
 * @property {String} role ID of Discord Role that will be given to user on item use.
 * @property {Number} maxAmount Max amount of the item that user can hold in his inventory.
 * @property {String} date Date when the item was bought.
 */

/**
 * Shop manager class.
 * @type {ShopManager}
 */
module.exports = ShopManager