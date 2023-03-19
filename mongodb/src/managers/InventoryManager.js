const EconomyError = require('../classes/util/EconomyError')
const Emitter = require('../classes/util/Emitter')

const BalanceManager = require('./BalanceManager')

const errors = require('../structures/errors')
const InventoryItem = require('../classes/InventoryItem')


/**
 * Inventory manager methods class.
 * @extends {Emitter}
 */
class InventoryManager extends Emitter {

    /**
      * Inventory Manager.
      * @param {EconomyConfiguration} options Economy configuration.
      * @param {DatabaseManager} database Database manager.
      * @param {CacheManager} cache Cache Manager.
     */
    constructor(options = {}, database, cache) {
        super()

        /**
         * Economy configuration.
         * @private
         * @type {?EconomyConfiguration}
         */
        this.options = options

        /**
         * Database manager methods class.
         * @type {DatabaseManager}
         * @private
         */
        this.database = database

        /**
         * Balance manager methods class.
         * @type {BalanceManager}
         * @private
         */
        this.balance = new BalanceManager(options, database, cache)

        /**
         * Cache Manager.
         * @type {CacheManager}
         * @private
         */
        this.cache = cache
    }

    /**
     * Clears the user's inventory.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<boolean>} If cleared: true, else: false.
     */
    async clear(memberID, guildID) {
        const inventory = (await this.fetch(memberID, guildID)) || []

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        if (!inventory) return false

        const result = await this.database.delete(`${guildID}.${memberID}.inventory`)

        this.cache.inventory.update({
            guildID,
            memberID
        })

        return result
    }

    /**
     * Returns the stacked user's inventory -
     * an array of objects of item's quantity, total price and the item itself from user's inventory
     * for each unique item.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<StackedInventoryItemObject[]>} Stacked user's inventory.
     */
    async stacked(memberID, guildID) {
        const inventoryArray = (await this.database.fetch(`${guildID}.${memberID}.inventory`)) || []
        const shopArray = (await this.database.fetch(`${guildID}.shop`)) || []

        const cleanInventory = [...new Set(inventoryArray.map(item => item.name))]
            .map(itemName => shopArray.find(shopItem => shopItem.name == itemName))
            .map(item => {
                const quantity = inventoryArray.filter(invItem => invItem.id == item.id).length

                return {
                    quantity,
                    totalPrice: item.price * quantity,
                    item: new InventoryItem(guildID, memberID, this.options, item, this.database, this.cache)
                }
            })

        return cleanInventory
    }

    /**
     * Returns the stacked item in user inventory: it will have the quantity and total price of the item.
     * @param {string | number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<StackedInventoryItemObject>} Stacked item object.
     */
    async stack(itemID, memberID, guildID) {
        const stackedInventory = await this.stacked(memberID, guildID)
        const stackedItem = stackedInventory.find(data => data.item.id == itemID)

        return stackedItem
    }

    /**
     * Gets the item in the inventory.
     * @param {string | number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<InventoryItem>} If item not found: null; else: item info object.
     */
    async getItem(itemID, memberID, guildID) {

        /**
        * @type {InventoryItem[]}
        */
        const inventory = (await this.fetch(memberID, guildID)) || []
        const item = inventory.find(item => item.id == itemID || item.name == itemID)

        if (typeof itemID !== 'number' && typeof itemID !== 'string') {
            throw new EconomyError(errors.invalidType('itemID', 'string or number', itemID), 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        if (!item) return null
        return new InventoryItem(guildID, memberID, this.options, item, this.database, this.cache)
    }

    /**
     * Gets the item in the inventory.
     * 
     * This method is an alias for the `InventoryManager.getItem()` method.
     * @param {string | number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<InventoryItem>} If item not found: null; else: item info object.
     */
    findItem(itemID, memberID, guildID) {
        return this.getItem(itemID, memberID, guildID)
    }

    /**
     * Fetches the user's inventory.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<InventoryItem[]>} User's inventory array.
     */
    async fetch(memberID, guildID) {
        const inventory = (await this.database.get(`${guildID}.${memberID}.inventory`)) || []

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        return inventory.map(item => {
            return new InventoryItem(guildID, memberID, this.options, item, this.database, this.cache)
        })
    }

    /**
     * Fetches the user's inventory.
     * 
     * This method is an alias for the `InventoryManager.fetch()` method.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<InventoryItem[]>} User's inventory array.
     */
    get(memberID, guildID) {
        return this.fetch(memberID, guildID)
    }

    /**
     * Uses the item: returns the item usage message and removes the item from user's inventory.
     * @param {string | number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {Client} [client] Discord Client. [Specify if the role will be given on a Discord server]
     * @returns {Promise<string>} Item message.
     */
    async useItem(itemID, memberID, guildID, client) {

        /**
         * @type {InventoryItem[]}
         */
        const inventory = (await this.fetch(memberID, guildID)) || []

        const itemObject = await this.getItem(itemID, memberID, guildID)
        const itemIndex = inventory.findIndex(invItem => invItem.id == itemObject?.id)

        const item = inventory[itemIndex]

        if (typeof itemID !== 'number' && typeof itemID !== 'string') {
            throw new EconomyError(errors.invalidType('itemID', 'string or number', itemID), 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        if (!item) return null

        if (item.role) {
            if (item.role && !client) {
                throw new EconomyError(errors.noClient, 'NO_DISCORD_CLIENT')
            }

            const guild = client.guilds.cache.get(guildID)
            const roleID = item.role.replace('<@&', '').replace('>', '')

            guild.roles.fetch(roleID).then(role => {
                const member = guild.members.cache.get(memberID)

                member.roles.add(role).catch(err => {
                    if (!role) {
                        return console.error(new EconomyError(errors.roleNotFound + roleID, 'ROLE_NOT_FOUND'))
                    }

                    console.error(
                        `\x1b[31mFailed to give a role "${guild.roles.cache.get(roleID)?.name}"` +
                        `on guild "${guild.name}" to member ${guild.member(memberID).user.tag}:\x1b[36m`
                    )

                    console.error(err)
                    console.error('\x1b[0m')
                })
            })
        }

        await this.removeItem(itemID, memberID, guildID)

        this.cache.updateMany(['users', 'inventory'], {
            guildID,
            memberID
        })

        let msg
        const string = item?.message || 'You have used this item!'

        if (string?.includes('[random=')) {
            const s = string.slice(string.indexOf('[')).replace('random=', '')

            let errored = false
            let arr

            try {
                arr = JSON.parse(s.slice(0, s.indexOf(']') + 1))
            } catch {
                errored = true
            }

            if (errored || !arr.length) msg = string
            else {
                const randomString = arr[Math.floor(Math.random() * arr.length)]
                const replacingString = string.slice(string.indexOf('['))


                msg = string.replace(replacingString, randomString) +
                    string.slice(string.indexOf('"]')).replace('"]', '')
            }
        }

        else msg = string

        this.emit('shopItemUse', {
            guildID,
            usedBy: memberID,
            item,
            receivedMessage: msg
        })

        return msg
    }

    /**
     * Uses the item: returns the item usage message and removes the item from user's inventory.
     * 
     * This method is an alias for the `InventoryManager.useItem()` method.
     * @param {string | number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {Client} [client] The Discord Client. [Specify if the role will be given on a Discord server].
     * @returns {Promise<string>} Item message.
     */
    use(itemID, memberID, guildID, client) {
        return this.useItem(itemID, memberID, guildID, client)
    }

    /**
     * Removes the item from user's inventory.
     * @param {string | number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {number} [quantity=1] Quantity of items to remove.
     * @returns {Promise<boolean>} If removed successfully: true, else: false.
     */
    async removeItem(itemID, memberID, guildID, quantity = 1) {

        /**
        * @type {InventoryItem[]}
        */
        const inventory = (await this.fetch(memberID, guildID)) || []
        const inventoryObjects = inventory.map(item => item.rawObject)

        const item = inventory.find(invItem => invItem.id == itemID || invItem.name == itemID)
        const itemQuantity = inventoryObjects.filter(item => item.id == itemID).length

        if (!arguments[3]) {
            this.database.logger.optionalParamNotSpecified(
                'InventoryManager.removeItem',
                'quantity',
                quantity
            )
        }

        if (typeof itemID !== 'number' && typeof itemID !== 'string') {
            throw new EconomyError(errors.invalidType('itemID', 'string or number', itemID), 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        if (!item) return false

        const newInventory = [
            ...inventoryObjects.filter(invItem => invItem.id !== item.id),
            ...Array(itemQuantity - quantity).fill(item.rawObject)
        ]

        const result = await this.database.set(`${guildID}.${memberID}.inventory`, newInventory)

        this.cache.inventory.update({
            guildID,
            memberID
        })

        return result
    }

    /**
     * Adds the item from the shop to user's inventory.
     * @param {string | number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {number} [quantity=1] Quantity of items to add.
     * @returns {Promise<ShopOperationInfo>} Shop operation info.
     */
    async addItem(itemID, memberID, guildID, quantity = 1) {

        /**
        * @type {ItemData[]}
        */
        const shop = (await this.database.get(`${guildID}.shop`)) || []
        const item = shop.find(shopItem => shopItem.id == itemID || shopItem.name == itemID)

        if (!arguments[3]) {
            this.database.logger.optionalParamNotSpecified(
                'InventoryManager.addItem',
                'quantity',
                quantity
            )
        }

        /**
        * @type {InventoryItem[]}
        */
        const inventory = await this.get(memberID, guildID)
        const inventoryItems = inventory.filter(invItem => invItem.name == item.name)

        if (typeof itemID !== 'number' && typeof itemID !== 'string') {
            throw new EconomyError(errors.invalidType('itemID', 'string or number', itemID), 'INVALID_TYPE')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        if (!item) return {
            status: false,
            message: 'item not found',
            item: null,
            quantity: 0,
            totalPrice: 0
        }

        const totalPrice = item.price * quantity
        const arrayOfItems = Array(quantity).fill(item.rawObject ? item.rawObject : item)

        const newInventory = [...inventory, ...arrayOfItems]
            .map(item => item.rawObject ? item.rawObject : item)

        if (
            item.maxAmount &&
            inventoryItems.length >= item.maxAmount &&
            (inventoryItems.length + quantity) < item.maxAmount
        ) return {
            status: false,
            message: `maximum items reached (${item.maxAmount})`,
            item,
            quantity,
            totalPrice
        }

        await this.database.set(`${guildID}.${memberID}.inventory`, newInventory)

        this.cache.inventory.update({
            guildID,
            memberID
        })

        return {
            status: true,
            message: 'OK',
            item,
            quantity,
            totalPrice: item.price * quantity
        }
    }

    /**
     * Removes the item from user's inventory
     * and adds its price to the user's balance.
     * This is the same as selling something.
     * @param {string | number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {number} [quantity=1] Quantity of items to sell.
     * @param {string} [reason='sold the item from the inventory'] The reason why the item was sold.
     * @returns {Promise<ShopOperationInfo>} Selling operation info.
     */
    async sellItem(itemID, memberID, guildID, quantity = 1, reason = 'sold the item from the inventory') {
        const inventory = await this.fetch(memberID, guildID)

        const item = await this.findItem(itemID, memberID, guildID)
        const itemQuantity = inventory.filter(invItem => invItem.id == item.id).length

        const percent = (await this.database.fetch(`${guildID}.settings.sellingItemPercent`))
            || this.options.sellingItemPercent

        const sellingPrice = Math.floor((item?.price / 100) * percent)
        const totalSellingPrice = sellingPrice * quantity

        if (!arguments[3]) {
            this.database.logger.optionalParamNotSpecified(
                'InventoryManager.sellItem',
                'quantity',
                quantity
            )
        }

        if (!arguments[4]) {
            this.database.logger.optionalParamNotSpecified(
                'InventoryManager.sellItem',
                'reason',
                reason
            )
        }

        if (typeof itemID !== 'number' && typeof itemID !== 'string') {
            throw new EconomyError(errors.invalidType('itemID', 'string or number', itemID), 'INVALID_TYPE')
        }
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        if (!item) return {
            status: false,
            message: 'item not found',
            item: null,
            quantity: 0,
            totalPrice: 0
        }

        if (quantity > itemQuantity || quantity < 1) {
            return {
                status: false,
                message: `not enough items to sell (${itemQuantity} < ${quantity})`,
                item,
                quantity,
                totalPrice: totalSellingPrice
            }
        }

        await this.balance.add(totalSellingPrice, memberID, guildID, reason)
        this.removeItem(itemID, memberID, guildID, quantity)

        this.cache.updateMany(['users', 'inventory', 'balance'], {
            guildID,
            memberID
        })

        return {
            status: true,
            message: 'OK',
            item,
            quantity,
            totalPrice: totalSellingPrice
        }
    }

    /**
     * Removes the item from user's inventory
     * and adds its price to the user's balance.
     * This is the same as selling something.
     * 
     * This method is an alias for 'InventoryManager.sellItem()' method.
     * @param {string | number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {number} [quantity=1] Quantity of items to sell.
     * @param {string} [reason='sold the item from the inventory'] The reason why the item was sold.
     * @returns {Promise<ShopOperationInfo>} Selling operation info.
     */
    sell(itemID, memberID, guildID, quantity = 1, reason = 'sold the item from the inventory') {
        return this.sellItem(itemID, memberID, guildID, quantity, reason)
    }
}

/**
 * @typedef {object} AddItemOptions Configuration with item info for 'Economy.shop.addItem' method.
 * @property {string} name Item name.
 * @property {number} price Item price.
 * @property {string} [message='You have used this item!'] Item message that will be returned on use.
 * @property {string} [description='Very mysterious item.'] Item description.
 * @property {number} [maxAmount=null] Max amount of the item that user can hold in their inventory.
 * @property {string} [role=null] Role **ID** from your Discord server.
 */

/**
 * Item data object.
 * @typedef {object} ItemData
 * @property {number} id Item ID.
 * @property {string} name Item name.
 * @property {number} price Item price.
 * @property {string} message The message that will be returned on item use.
 * @property {string} description Item description.
 * @property {string} role ID of Discord Role that will be given to the user on item use.
 * @property {number} maxAmount Max amount of the item that user can hold in their inventory.
 * @property {string} date Date when the item was added in the shop.
 * @property {object} custom Custom item properties object.
 */

/**
 * Stacked item object.
 * @typedef {object} StackedInventoryItemObject
 * @property {number} quantity Quantity of the item in inventory.
 * @property {number} totalPrice Total price of the items in inventory.
 * @property {InventoryItem} item The stacked item.
 */

/**
 * @typedef {object} ShopOperationInfo
 * @property {boolean} status Operation status.
 * @property {string} message Operation message.
 * @property {ShopItem | InventoryItem} item Item object.
 * @property {number} quantity Item quantity.
 * @property {number} totalPrice Total price of the items.
 */

/**
 * @typedef {object} EconomyConfiguration Default Economy configuration.
 * @property {string} [storagePath='./storage.json'] Full path to a JSON file. Default: './storage.json'
 * @property {boolean} [checkStorage=true] Checks the if database file exists and if it has errors. Default: true
 * @property {number} [dailyCooldown=86400000] 
 * Cooldown for Daily Reward (in ms). Default: 24 hours (60000 * 60 * 24 ms)
 * 
 * @property {number} [workCooldown=3600000] Cooldown for Work Reward (in ms). Default: 1 hour (60000 * 60 ms)
 * @property {number | number[]} [dailyAmount=100] Amount of money for Daily Reward. Default: 100.
 * @property {number} [weeklyCooldown=604800000] 
 * Cooldown for Weekly Reward (in ms). Default: 7 days (60000 * 60 * 24 * 7 ms)
 *
 * @property {number} [sellingItemPercent=75]
 * Percent of the item's price it will be sold for. Default: 75.
 * 
 * @property {boolean} [deprecationWarnings=true] 
 * If true, the deprecation warnings will be sent in the console.
 * 
 * @property {boolean} [savePurchasesHistory=true] If true, the module will save all the purchases history.
 * 
 * @property {number | number[]} [weeklyAmount=100] Amount of money for Weekly Reward. Default: 1000.
 * @property {number | number[]} [workAmount=[10, 50]] Amount of money for Work Reward. Default: [10, 50].
 *
 * @property {number | number[]} [monthlyAmount=10000] Amount of money for Monthly Reward. Default: 10000.
 * @property {number} [monthlyCooldown=2629746000] Cooldown for Weekly Reward (in ms). Default: 1 month (2629746000 ms).
 * 
 * @property {number | number[]} [hourlyAmount=20] Amount of money for Hourly Reward. Default: 20.
 * @property {number} [hourlyCooldown=3600000] Cooldown for Hourly Reward (in ms). Default: 1 hour (3600000 ms).
 *
 * @property {boolean} [subtractOnBuy=true] 
 * If true, when someone buys the item, their balance will subtract by item price. Default: false
 * 
 * @property {number} [updateCountdown=1000] Checks for if storage file exists in specified time (in ms). Default: 1000.
 * @property {string} [dateLocale='en'] The region (example: 'ru' or 'en') to format the date and time. Default: 'en'.
 * @property {UpdaterOptions} [updater=UpdaterOptions] Update checker configuration.
 * @property {ErrorHandlerConfiguration} [errorHandler=ErrorHandlerConfiguration] Error handler configuration.

 * @property {CheckerConfiguration} [optionsChecker=CheckerConfiguration] 
 * Configuration for an 'Economy.utils.checkConfiguration' method.
 * @property {boolean} [debug=false] Enables or disables the debug mode.
 */


/**
 * Inventory manager class.
 * @type {InventoryManager}
 */
module.exports = InventoryManager
