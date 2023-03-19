const Emitter = require('../classes/util/Emitter')
const EconomyError = require('../classes/util/EconomyError')

const CurrencyManager = require('./CurrencyManager')

const errors = require('../structures/errors')
const ShopItem = require('../classes/ShopItem')


/**
 * Shop manager methods class.
 * @extends {Emitter}
 */
class ShopManager extends Emitter {

    /**
      * Shop Manager.
      * @param {EconomyConfiguration} options Economy configuration.
      * @param {DatabaseManager} database Database manager.
      * @param {CacheManager} cache Cache Manager.
     */
    constructor(options = {}, database, cache) {
        super()

        /**
         * Economy configuration.
         * @type {?EconomyConfiguration}
         * @private
         */
        this.options = options

        /**
         * Database manager methods class.
         * @type {DatabaseManager}
         * @private
         */
        this.database = database

        /**
         * Cache Manager.
         * @type {CacheManager}
         * @private
         */
        this.cache = cache

        /**
         * Currency Manager.
         * @type {CurrencyManager}
         */
        this.currencies = new CurrencyManager(options, database, cache)
    }

    /**
     * Creates an item in shop.
     * @param {string} guildID Guild ID.
     * @param {AddItemOptions} options Configuration with item info.
     * @returns {Promise<ShopItem>} Item info.
     */
    async addItem(guildID, options = {}) {
        let name = options.name

        const {
            itemName, price, message, custom,
            description, maxAmount, role
        } = options

        const dateLocale = (await this.database.fetch(`${guildID}.settings.dateLocale`))
            || this.options.dateLocale

        const date = new Date().toLocaleString(dateLocale)
        const shop = (await this.database.fetch(`${guildID}.shop`)) || []

        if (!name && itemName) {
            name = itemName

            console.log(
                errors.propertyDeprecationWarning('ShopManager', 'itemName', 'name', {
                    method: 'addItem',
                    argumentName: 'options',
                    argumentsList: ['guildID', 'options'],
                    example: 'banana'
                })
            )
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        if (typeof name !== 'string') {
            throw new EconomyError(errors.invalidTypes.addItemOptions.name + typeof name, 'INVALID_TYPE')
        }

        if (isNaN(price)) {
            throw new EconomyError(errors.invalidTypes.addItemOptions.price + typeof price, 'INVALID_TYPE')
        }

        if (message && typeof message !== 'string') {
            throw new EconomyError(errors.invalidTypes.addItemOptions.message + typeof message, 'INVALID_TYPE')
        }

        if (description && typeof description !== 'string') {
            throw new EconomyError(errors.invalidTypes.addItemOptions.description + typeof description, 'INVALID_TYPE')
        }

        if (maxAmount !== undefined && isNaN(maxAmount)) {
            throw new EconomyError(errors.invalidTypes.addItemOptions.maxAmount + typeof maxAmount, 'INVALID_TYPE')
        }

        if (role && typeof role !== 'string') {
            throw new EconomyError(errors.invalidTypes.addItemOptions.role + typeof role, 'INVALID_TYPE')
        }

        if (custom && typeof custom !== 'object' && !Array.isArray(custom)) {
            throw new EconomyError(errors.invalidTypes.addItemOptions.role + typeof role, 'INVALID_TYPE')
        }

        const itemInfo = {
            id: shop?.length ? shop[shop.length - 1].id + 1 : 1,
            name,
            price,
            message: message || 'You have used this item!',
            description: description || 'Very mysterious item.',
            maxAmount: maxAmount == undefined ? null : Number(maxAmount),
            role: role || null,
            date,
            custom: custom || {}
        }


        const newShopItem = new ShopItem(guildID, itemInfo, this.database, this.options, this.cache)

        await this.database.push(`${guildID}.shop`, itemInfo)

        this.cache.updateMany(['guilds', 'shop'], {
            guildID
        })

        this.emit('shopItemAdd', newShopItem)
        return newShopItem
    }

    /**
     * Creates an item in shop.
     * 
     * This method is an alias for the `ShopManager.addItem()` method.
     * @param {string} guildID Guild ID.
     * @param {AddItemOptions} options Configuration with item info.
     * @returns {Promise<ShopItem>} Item info.
     */
    add(guildID, options = {}) {
        return this.addItem(guildID, options)
    }

    /**
     * Edits the item in the shop.
     * @param {string | number} itemID Item ID or name.
     * @param {string} guildID Guild ID
     * @param {'description' | 'price' | 'name' | 'message' | 'maxAmount' | 'role' | 'custom'} itemProperty 
     * This argument means what thing in item you want to edit (item property). 
     * Available item properties are 'description', 'price', 'name', 'message', 'amount', 'role', 'custom'.
     * 
     * @param {any} value Any value to set.
     * @returns {Promise<boolean>} If edited successfully: true, else: false.
     */
    async editItem(itemID, guildID, itemProperty, value) {
        const itemProperties = ['description', 'price', 'name', 'message', 'maxAmount', 'role', 'custom']

        if (typeof itemID !== 'number' && typeof itemID !== 'string') {
            throw new EconomyError(errors.invalidType('itemID', 'string or number', itemID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        if (!itemProperties.includes(itemProperty)) {
            throw new EconomyError(
                errors.invalidTypes.editItemArgs.itemProperty + itemProperty, 'ITEM_PROPERTY_INVALID'
            )
        }

        if (value == undefined) {
            throw new EconomyError(errors.invalidTypes.editItemArgs.itemProperty + value, 'INVALID_TYPE')
        }

        const edit = async (itemProperty, value) => {
            const shop = await this.fetch(guildID)

            const itemIndex = shop.findIndex(item => item.id == itemID || item.name == itemID)
            const item = shop[itemIndex]

            if (!item) return false

            item[itemProperty] = value
            await this.database.pull(`${guildID}.shop`, itemIndex, item)

            this.cache.updateMany(['guilds', 'shop'], {
                guildID
            })

            this.emit('shopItemEdit', {
                item,
                guildID,
                changedProperty: itemProperty,
                oldValue: item[itemProperty],
                newValue: value
            })

            return true
        }

        switch (itemProperty) {
            case itemProperties[0]: {
                const result = await edit(itemProperties[0], value)
                return result
            }

            case itemProperties[1]: {
                const result = await edit(itemProperties[1], value)
                return result
            }

            case itemProperties[2]: {
                const result = await edit(itemProperties[2], value)
                return result
            }

            case itemProperties[3]: {
                const result = await edit(itemProperties[3], value)
                return result
            }

            case itemProperties[4]: {
                const result = await edit(itemProperties[4], value)
                return result
            }

            case itemProperties[5]: {
                const result = await edit(itemProperties[5], value)
                return result
            }

            case itemProperties[6]: {
                const result = await edit(itemProperties[6], value)
                return result
            }

            default:
                return null
        }
    }

    /**
     * Edits the item in the shop.
     * 
     * This method is an alias for the `ShopManager.editItem()` method.
     * @param {string | number} itemID Item ID or name.
     * @param {string} guildID Guild ID
     * @param {'description' | 'price' | 'name' | 'message' | 'maxAmount' | 'role' | 'custom'} itemProperty 
     * This argument means what thing in item you want to edit (item property). 
     * Available item properties are 'description', 'price', 'name', 'message', 'amount', 'role', 'custom'.
     * 
     * @param {any} value Any value to set.
     * @returns {Promise<boolean>} If edited successfully: true, else: false.
     */
    edit(itemID, guildID, itemProperty, value) {
        return this.editItem(itemID, guildID, itemProperty, value)
    }

    /**
     * Sets a custom object for the item.
     * @param {string | number} itemID Item ID or name.
     * @param {string} guildID Guild ID.
     * @param {object} customObject Custom item data object.
     * @returns {Promise<boolean>} If set successfully: true, else: false.
     */
    setCustom(itemID, guildID, customObject) {
        return this.editItem(itemID, guildID, 'custom', customObject)
    }

    /**
     * Removes an item from the shop.
     * @param {string | number} itemID Item ID or name .
     * @param {string} guildID Guild ID.
     * @returns {Promise<boolean>} If removed: true, else: false.
     */
    async removeItem(itemID, guildID) {

        /**
        * @type {ShopItem[]}
        */
        const shop = await this.fetch(guildID)

        const itemIndex = shop.findIndex(item => item.id == itemID || item.name == itemID)
        const item = shop[itemIndex]

        if (typeof itemID !== 'number' && typeof itemID !== 'string') {
            throw new EconomyError(errors.invalidType('itemID', 'string or number', itemID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        await this.database.pop(`${guildID}.shop`, itemIndex)

        this.cache.updateMany(['guilds', 'shop'], {
            guildID
        })

        this.emit('shopItemRemove', {
            id: item.id,
            name: item.name,
            price: item.price,
            message: item.message,
            description: item.description,
            maxAmount: item.maxAmount,
            role: item.role || null,
            date: item.date,
            custom: item.custom || {}
        })

        return true
    }

    /**
     * Clears the shop.
     * @param {string} guildID Guild ID.
     * @returns {Promise<boolean>} If cleared: true, else: false.
     */
    async clear(guildID) {
        const shop = await this.fetch(guildID)

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        if (!shop && !shop?.length) {
            this.emit('shopClear', false)
            return false
        }

        await this.database.delete(`${guildID}.shop`)
        this.emit('shopClear', true)

        this.cache.updateMany(['guilds', 'shop'], {
            guildID
        })

        return true
    }

    /**
     * Shows all items in the shop.
     * @param {string} guildID Guild ID
     * @returns {Promise<ShopItem[]>} The shop array.
     */
    async fetch(guildID) {
        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        /**
         * @type {ShopItem[]}
         */
        const shop = (await this.database.fetch(`${guildID}.shop`)) || []
        return shop.map(item => new ShopItem(guildID, item, this.database, this.cache))
    }

    /**
     * Shows all items in the shop.
     * 
     * This method is an alias for the `ShopManager.fetch()` method.
     * @param {string} guildID Guild ID
     * @returns {Promise<ShopItem[]>} The shop array.
     */
    get(guildID) {
        return this.fetch(guildID)
    }

    /**
     * Shows all items in the shop.
     * 
     * This method is an alias for the `ShopManager.get()` method.
     * @param {string} guildID Guild ID
     * @returns {Promise<ShopItem[]>} The shop array.
     */
    all(guildID) {
        return this.get(guildID)
    }

    /**
     * Gets the item in the shop.
     * @param {string | number} itemID Item ID or name.
     * @param {string} guildID Guild ID.
     * @returns {Promise<ShopItem>} If item not found: null; else: item info object.
     */
    async getItem(itemID, guildID) {

        /**
        * @type {ShopItem[]}
        */
        const shop = await this.fetch(guildID)
        const item = shop.find(item => item.id == itemID || item.name == itemID)

        if (typeof itemID !== 'number' && typeof itemID !== 'string') {
            throw new EconomyError(errors.invalidType('itemID', 'string or number', itemID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        if (!item) return null
        return new ShopItem(guildID, item, this.database, this.cache)
    }

    /**
     * Gets the item in the shop.
     * 
     * This method is an alias for the `ShopManager.getItem()` method.
     * @param {string | number} itemID Item ID or name.
     * @param {string} guildID Guild ID.
     * @returns {Promise<ShopItem>} If item not found: null; else: item info object.
     */
    findItem(itemID, guildID) {
        return this.getItem(itemID, guildID)
    }

    /**
     * Buys the item from the shop.
     * @param {string | number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {number} [quantity=1] Quantity of items to buy. Default: 1.
     * 
     * @param {string | number} [currency=null] 
     * The currency to subtract the money from. 
     * Can be omitted by specifying 'null' or ignoring this parameter.
     * Requires the `subtractOnBuy` option to be enabled. Default: null.
     * 
     * @param {string} [reason='received the item from the shop'] 
     * The reason why the money was subtracted. Default: 'received the item from the shop'.
     * 
     * @returns {Promise<ShopOperationInfo>} Operation information object.
     */
    async buy(itemID, memberID, guildID, quantity = 1, currency = null, reason = 'received the item from the shop') {
        const balance = this.cache.balance.get({
            memberID,
            guildID
        }) || []

        const shop = this.cache.shop.get({
            guildID
        }) || []

        const item = shop.find(item => item.id == itemID || item.name == itemID)

        const inventory = this.cache.inventory.get({
            memberID,
            guildID
        }) || []

        const inventoryItems = inventory.filter(invItem => invItem.name == item.name)
        const settings = await this.database.fetch(`${guildID}.settings`) || {}

        const dateLocale = settings.dateLocale
            || this.options.dateLocale

        const subtractOnBuy = settings.subtractOnBuy
            || this.options.subtractOnBuy

        const savePurchasesHistory = settings.savePurchasesHistory
            || this.options.savePurchasesHistory


        if (!arguments[3]) {
            this.database.logger.optionalParamNotSpecified(
                'ShopManager.buy',
                'quantity',
                quantity
            )
        }

        if (!arguments[4]) {
            this.database.logger.optionalParamNotSpecified(
                'ShopManager.buy',
                'currency',
                currency
            )
        }

        if (!arguments[5]) {
            this.database.logger.optionalParamNotSpecified(
                'ShopManager.buy',
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

        if (subtractOnBuy) {
            if (currency) {
                this.database.logger.debug('ShopItem.buy - Subtracting the balance from specified currency.')
                await this.currencies.subtractBalance(currency, totalPrice, memberID, guildID, reason)
            } else {
                await this.database.subtract(`${guildID}.${memberID}.money`, totalPrice)

                this.cache.balance.update({
                    guildID,
                    memberID
                })

                this.emit('balanceSubtract', {
                    type: 'subtract',
                    guildID,
                    memberID,
                    amount: Number(totalPrice),
                    balance: balance - totalPrice,
                    reason
                })
            }
        } else {
            this.database.logger.debug('ShopItem.buy - Subtracting on buying is disabled.')
        }

        await this.database.set(`${guildID}.${memberID}.inventory`, newInventory)

        if (savePurchasesHistory) {
            const history = this.cache.history.get({
                memberID,
                guildID
            }) || []

            await this.database.push(`${guildID}.${memberID}.history`, {
                id: history.length ? history[history.length - 1].id + 1 : 1,
                memberID,
                guildID,
                name: item.name,
                price: item.price,
                quantity,
                totalPrice,
                role: item.role || null,
                maxAmount: item.maxAmount,
                date: new Date().toLocaleString(dateLocale),
                custom: item.custom || {}
            })

            this.cache.history.update({
                guildID,
                memberID
            })
        } else {
            this.database.logger.debug('ShopItem.buy - Saving purchases history is disabled.')
        }

        await this.cache.updateMany(['shop', 'users', 'inventory'], {
            memberID,
            guildID
        })

        this.emit('shopItemBuy', {
            guildID,
            boughtBy: memberID,
            item
        })

        return {
            status: true,
            message: 'OK',
            item,
            quantity,
            totalPrice
        }
    }

    /**
     * Buys the item from the shop.
     * 
     * This method is an alias for the `ShopManager.buy()` method.
     * @param {string | number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {number} [quantity=1] Quantity of items to buy. Default: 1.
     * 
     * @param {string | number} [currency=null] 
     * The currency to subtract the money from. 
     * Can be omitted by specifying 'null' or ignoring this parameter.
     * Requires the `subtractOnBuy` option to be enabled. Default: null.
     * 
     * @param {string} [reason='received the item from the shop'] 
     * The reason why the money was subtracted. Default: 'received the item from the shop'.
     * 
     * @returns {Promise<ShopOperationInfo>} Operation information object.
     */
    buyItem(itemID, memberID, guildID, quantity, currency, reason) {
        return this.buy(itemID, memberID, guildID, quantity, currency, reason)
    }
}

/**
 * @typedef {object} AddItemOptions Configuration with item info for 'Economy.shop.addItem' method.
 * @property {string} name Item name.
 * @property {string | number} price Item price.
 * @property {string} [message='You have used this item!'] Item message that will be returned on use.
 * @property {string} [description='Very mysterious item.'] Item description.
 * @property {string | number} [maxAmount=null] Max amount of the item that user can hold in their inventory.
 * @property {string} [role=null] Role **ID** from your Discord server.
 * @property {object} [custom] Custom item properties object.
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
 * History data object.
 * @typedef {object} HistoryData
 * @property {number} id Item ID in history.
 * @property {string} name Item name.
 * @property {number} price Item price.
 * @property {string} message The message that will be returned on item use.
 * @property {string} role ID of Discord Role that will be given to user on item use.
 * @property {string} date Date when the item was bought by a user.
 * @property {string} memberID Member ID.
 * @property {string} guildID Guild ID.
 */

/**
 * Inventory data object.
 * @typedef {object} InventoryData
 * @property {number} id Item ID in your inventory.
 * @property {string} name Item name.
 * @property {number} price Item price.
 * @property {string} message The message that will be returned on item use.
 * @property {string} role ID of Discord Role that will be given to user on item use.
 * @property {number} maxAmount Max amount of the item that user can hold in their inventory.
 * @property {string} date Date when the item was bought by a user.
 * @property {object} custom Custom item properties object.
 */

/**
 * @typedef {object} EconomyConfiguration Default Economy configuration.
 * @property {number} [dailyCooldown=86400000]
 * Cooldown for Daily Reward (in ms). Default: 24 hours (60000 * 60 * 24 ms)
 *
 * @property {number} [workCooldown=3600000] Cooldown for Work Reward (in ms). Default: 1 hour (60000 * 60 ms)
 * @property {number | number[]} [dailyAmount=100] Amount of money for Daily Reward. Default: 100.
 * @property {number} [weeklyCooldown=604800000]
 * Cooldown for Weekly Reward (in ms). Default: 7 days (60000 * 60 * 24 * 7 ms)
 *
 * @property {boolean} [deprecationWarnings=true]
 * If true, the deprecation warnings will be sent in the console. Default: true.
 *
 * @property {boolean} [savePurchasesHistory=true] If true, the module will save all the purchases history.
 *
 * @property {number} [sellingItemPercent=75]
 * Percent of the item's price it will be sold for. Default: 75.
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
 * @property {string} [dateLocale='en'] The region (example: 'ru' or 'en') to format the date and time. Default: 'en'.
 * @property {UpdaterOptions} [updater=UpdaterOptions] Update checker configuration.
 * @property {ErrorHandlerConfiguration} [errorHandler=ErrorHandlerConfiguration] Error handler configuration.

 * @property {CheckerConfiguration} [optionsChecker=CheckerConfiguration] 
 * Configuration for an 'Economy.utils.checkConfiguration' method.
 * @property {boolean} [debug=false] Enables or disables the debug mode.
 */

/**
 * Shop manager class.
 * @type {ShopManager}
 */
module.exports = ShopManager
