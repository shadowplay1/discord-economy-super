const EconomyError = require('../util/EconomyError')
const errors = require('../../structures/errors')

const BaseManager = require('../../managers/BaseManager')

const ShopItem = require('../ShopItem')


/**
 * Guild shop class.
 * @extends {BaseManager}
 */
class Shop extends BaseManager {

    /**
     * Guild shop constructor.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration.
     */
    constructor(guildID, options) {
        super(options, null, guildID, ShopItem)

        /**
         * Guild ID.
         * @type {string}
         * @private
         */
        this.guildID = guildID
    }

    /**
    * Gets the item in the shop.
    * @param {string | number} itemID Item ID.
    * @returns {ShopItem} Shop item.
    */
    findItem(itemID) {
        const shop = this.all()
        const item = shop.find(item => item.id == itemID || item.name == itemID)

        if (typeof itemID !== 'number' && typeof itemID !== 'string') {
            throw new EconomyError(errors.invalidType('itemID', 'string or number', itemID), 'INVALID_TYPE')
        }

        if (!item) return null
        return new ShopItem(this.guildID, item, this.database)
    }

    /**
     * Gets all the items in the shop.
     * @returns {ShopItem[]} Guild shop array.
     */
    all() {
        const items = this.database.fetch(`${this.guildID}.shop`) || []
        return items.map(item => new ShopItem(this.guildID, item, this.database))
    }

    /**
     * Gets all items in the shop.
     *
     * This method is an alias for the `Shop.findItem()` method.
     * @param {string | number} itemID Item ID.
     * @returns {ShopItem} Shop item.
     */
    get(itemID) {
        return this.findItem(itemID)
    }

    /**
     * Creates an item in shop.
     * @param {AddItemOptions} options Configuration with item info.
     * @returns {ItemData} Item info.
     */
    addItem(options = {}) {
        let name = options.name

        const {
            itemName, price, message, custom,
            description, maxAmount, role
        } = options

        const dateLocale = this.database.fetch(`${this.guildID}.settings.dateLocale`)
            || this.options.dateLocale

        const date = new Date().toLocaleString(dateLocale)
        const shop = this.database.fetch(`${this.guildID}.shop`)

        if (!name && itemName) {
            name = itemName

            console.log(
                errors.propertyDeprecationWarning('Shop', 'itemName', 'name', {
                    method: 'addItem',
                    argumentName: 'options',
                    argumentsList: ['options'],
                    example: 'banana'
                })
            )
        }

        if (typeof this.guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guildID + typeof this.guildID, 'INVALID_TYPE')
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


        const newShopItem = new ShopItem(this.guildID, itemInfo, this.database)

        this.database.push(`${this.guildID}.shop`, itemInfo)
        this.emit('shopItemAdd', newShopItem)

        return newShopItem
    }

    /**
     * Creates an item in shop.
     *
     * This method is an alias for the `Shop.addItem()` method.
     * @param {AddItemOptions} options Configuration with item info.
     * @returns {ItemData} Item info.
     */
    add(options = {}) {
        return this.addItem(options)
    }

    /**
     * Edits the item in the shop.
     * @param {string | number} itemID Item ID or name.
     * @param {'description' | 'price' | 'name' | 'message' | 'maxAmount' | 'role'} itemProperty
     * This argument means what thing in item you want to edit (item property).
     * Available item properties are 'description', 'price', 'name', 'message', 'amount', 'role', 'custom'.
     *
     * @param {any} value Any value to set.
     * @returns {boolean} If edited successfully: true, else: false.
     */
    editItem(itemID, itemProperty, value) {
        const itemProperties = ['description', 'price', 'name', 'message', 'maxAmount', 'role', 'custom']

        if (typeof itemID !== 'number' && typeof itemID !== 'string') {
            throw new EconomyError(errors.invalidType('itemID', 'string or number', itemID), 'INVALID_TYPE')
        }

        if (typeof this.guildID !== 'string') {
            throw new EconomyError(errors.invalidTypes.guilddID + typeof this.guildID, 'INVALID_TYPE')
        }

        if (!itemProperties.includes(itemProperty)) {
            throw new EconomyError(errors.invalidTypes.editItemArgs.itemProperty + itemProperty, 'INVALID_TYPE')
        }

        if (value == undefined) {
            throw new EconomyError(errors.invalidTypes.editItemArgs.itemProperty + value, 'INVALID_TYPE')
        }

        const edit = (itemProperty, value) => {
            const shop = this.all(this.guildID)

            const itemIndex = shop.findIndex(item => item.id == itemID || item.name == itemID)
            const item = shop[itemIndex]

            if (!item) return false

            item[itemProperty] = value
            this.database.pull(`${this.guildID}.shop`, itemIndex, item)

            this.emit('shopItemEdit', {
                item,
                guildID: this.guildID,
                changedProperty: itemProperty,
                oldValue: item[itemProperty],
                newValue: value
            })

            return true
        }

        /* eslint-disable indent */
        switch (itemProperty) {
            case itemProperties[0]:
                return edit(itemProperties[0], value)

            case itemProperties[1]:
                return edit(itemProperties[1], value)

            case itemProperties[2]:
                return edit(itemProperties[2], value)

            case itemProperties[3]:
                return edit(itemProperties[3], value)

            case itemProperties[4]:
                return edit(itemProperties[4], value)

            case itemProperties[5]:
                return edit(itemProperties[5], value)

            default:
                return null
        }
    }

    /**
     * Edits the item in the shop.
     *
     * This method is an alias for the `Shop.editItem()` method.
     * @param {string | number} itemID Item ID or name.
     * @param {'description' | 'price' | 'name' | 'message' | 'maxAmount' | 'role'} itemProperty
     * This argument means what thing in item you want to edit (item property).
     * Available item properties are 'description', 'price', 'name', 'message', 'amount', 'role', 'custom'.
     *
     * @param {any} value Any value to set.
     * @returns {boolean} If edited successfully: true, else: false.
     */
    edit(itemID, itemProperty, value) {
        return this.editItem(itemID, itemProperty, value)
    }

    /**
     * Sets a custom object for the item.
     * @param {string | number} itemID Item ID or name.
     * @param {object} customObject Custom item data object.
     * @returns {boolean} If set successfully: true, else: false.
     */
    setCustom(itemID, customObject) {
        return this.editItem(itemID, this.guildID, 'custom', customObject)
    }

    /**
     * Clears the shop.
     * @returns {boolean} If cleared: true, else: false.
     */
    clear() {
        const shop = this.all(this.guildID)

        if (!shop && !shop?.length) {
            this.emit('shopClear', false)
            return false
        }

        this.database.delete(`${this.guildID}.shop`)
        this.emit('shopClear', true)

        return true
    }
}

/**
 * Guild shop class.
 * @type {Shop}
 */
module.exports = Shop


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
 * @typedef {object} AddItemOptions Configuration with item info for 'Economy.shop.addItem' method.
 * @property {string} name Item name.
 * @property {string | number} price Item price.
 * @property {string} [message='You have used this item!'] Item message that will be returned on use.
 * @property {string} [description='Very mysterious item.'] Item description.
 * @property {string | number} [maxAmount=null] Max amount of the item that user can hold in their inventory.
 * @property {string} [role=null] Role **ID** from your Discord server.
 * @property {object} [custom] Custom item properties object.
 * @returns {ItemData} Item info.
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
 * @property {number} [sellingItemPercent=75]
 * Percent of the item's price it will be sold for. Default: 75.
 *
 * @property {boolean} [deprecationWarnings=true]
 * If true, the deprecation warnings will be sent in the console. Default: true.
 *
 * @property {boolean} [savePurchasesHistory=true] If true, the module will save all the purchases history.
 *
 * @property {number} [updateCountdown=1000] Checks for if storage file exists in specified time (in ms). Default: 1000.
 * @property {string} [dateLocale='en'] The region (example: 'ru'; 'en') to format the date and time. Default: 'en'.
 * @property {UpdaterOptions} [updater=UpdaterOptions] Update checker configuration.
 * @property {ErrorHandlerConfiguration} [errorHandler=ErrorHandlerConfiguration] Error handler configuration.

 * @property {CheckerConfiguration} [optionsChecker=CheckerConfiguration]
 * Configuration for an 'Economy.utils.checkConfiguration' method.
 * @property {boolean} [debug=false] Enables or disables the debug mode.
 */
