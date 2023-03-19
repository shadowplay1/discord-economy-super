const CurrencyManager = require('../managers/CurrencyManager')

const errors = require('../structures/errors')
const EconomyError = require('./util/EconomyError')

const Emitter = require('./util/Emitter')


/**
* Shop item class.
* @extends {Emitter}
*/
class ShopItem extends Emitter {

    /**
     * Shop item class.
     * @param {string} guildID Guild ID.
     * @param {ItemData} itemObject Shop item object.
     * @param {DatabaseManager} database Database Manager.
     */
    constructor(guildID, itemObject, database) {
        super()

        /**
         * Guild ID.
         * @type {string}
         */
        this.guildID = guildID

        /**
         * Raw item object.
         * @type {ItemData}
         */
        this.rawObject = itemObject

        /**
         * Shop item ID.
         * @type {number}
         */
        this.id = itemObject.id

        /**
         * Database Manager.
         * @type {DatabaseManager}
         */
        this.database = database

        /**
         * Currency Manager.
         * @type {CurrencyManager}
         */
        this.currencies = new CurrencyManager(this.options, this.database)

        /**
         * Economy configuration.
         * @type {EconomyConfiguration}
         * @private
         */
        this.options = this.database.options

        /**
         * Item name.
         * @type {string}
         */
        this.name = itemObject.name

        /**
         * Item price.
         * @type {number}
         */
        this.price = itemObject.price

        /**
         * The message that will be returned on item use.
         * @type {string}
         */
        this.message = itemObject.message

        /**
         * Item description.
         * @type {string}
         */
        this.description = itemObject.description

        /**
         * ID of Discord Role that will be given to the user on item use.
         * @type {string}
         */
        this.role = itemObject.role

        /**
         * Max amount of the item that user can hold in their inventory.
         * @type {number}
         */
        this.maxAmount = itemObject.maxAmount

        /**
         * Date when the item was added in the shop.
         * @type {string}
         */
        this.date = itemObject.date

        /**
         * Custom item data object.
         * @type {object}
         */
        this.custom = itemObject.custom || {}

        for (const [key, value] of Object.entries(itemObject || {})) {
            this[key] = value
        }
    }


    /**
     * Checks for is the specified user has enough money to buy the item.
     * @param {string} userID User ID.
     * @param {number} [quantity=1] Quantity of the items to buy.
     * @returns {boolean} Is the user has enough money to buy the item.
     */
    isEnoughMoneyFor(userID, quantity = 1) {
        const user = this.database.fetch(`${this.guildID}.${userID}`)

        if (!arguments[1]) {
            this.database.logger.optionalParamNotSpecified(
                'ShopItem.isEnoughMoneyFor',
                'quantity',
                quantity
            )
        }

        return user?.money >= this.price * quantity
    }

    /**
     * Checks for is the specified user has the item in their inventory.
     * @param {string} userID User ID.
     * @returns {boolean} Is the user has the item in their inventory.
     */
    isInInventory(userID) {
        const user = this.database.fetch(`${this.guildID}.${userID}`)
        return !!user.inventory.find(item => item.id == this.id)
    }

    /**
     * Edits the item in the shop.
     *
     * @param {"description" | "price" | "name" | "message" | "maxAmount" | "role" | 'custom'} itemProperty
     * This argument means what thing in item you want to edit (item property).
     * Available item properties are 'description', 'price', 'name', 'message', 'amount', 'role', 'custom'.
     *
     * @param {any} value Any value to set.
     * @returns {boolean} If edited successfully: true, else: false.
     */
    edit(itemProperty, value) {
        const itemProperties = ['description', 'price', 'name', 'message', 'maxAmount', 'role', 'custom']

        if (!itemProperties.includes(itemProperty)) {
            throw new EconomyError(
                errors.invalidTypes.editItemArgs.itemProperty + itemProperty, 'ITEM_PROPERTY_INVALID'
            )
        }

        if (value == undefined) {
            throw new EconomyError(errors.invalidTypes.editItemArgs.itemProperty + value, 'INVALID_TYPE')
        }

        const edit = (itemProperty, value) => {

            /**
             * @type {ItemData[]}
             */
            const shop = this.database.fetch(`${this.guildID}.shop`)

            const itemIndex = shop.findIndex(item => item.id == this.id || item.name == this.id)
            const item = shop[itemIndex]

            if (!item) return false

            item[itemProperty] = value
            this.database.pull(`${this.guildID}.shop`, itemIndex, item)

            this.emit('shopItemEdit', {
                item: this,
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

            case itemProperties[6]:
                return edit(itemProperties[6], value)

            default:
                return null
        }
    }

    /**
     * Buys the item from the shop.
     * @param {string} memberID Member ID.
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
     * @returns {ShopOperationInfo} Operation information object.
     */
    buy(memberID, quantity = 1, currency = null, reason = 'received the item from the shop') {
        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        const balance = this.database.fetch(`${this.guildID}.${memberID}.money`) || 0

        const shop = this.database.fetch(`${this.guildID}.shop`) || []
        const item = shop.find(item => item.id == this.id || item.name == this.id)

        const inventory = this.database.fetch(`${this.guildID}.${memberID}.inventory`) || []
        const inventoryItems = inventory.filter(invItem => invItem.name == item.name)


        if (!arguments[1]) {
            this.database.logger.optionalParamNotSpecified(
                'ShopItem.buy',
                'quantity',
                quantity
            )
        }

        if (!arguments[2]) {
            this.database.logger.optionalParamNotSpecified(
                'ShopItem.buy',
                'currency',
                currency
            )
        }

        if (!arguments[3]) {
            this.database.logger.optionalParamNotSpecified(
                'ShopItem.buy',
                'reason',
                reason
            )
        }

        if (!item) return {
            status: false,
            message: 'item not found',
            item: null,
            quantity: 0,
            totalPrice: 0,
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

        const settings = this.database.fetch(`${this.guildID}.settings`) || {}

        const dateLocale = settings.dateLocale
            || this.options.dateLocale

        const subtractOnBuy = settings.subtractOnBuy
            || this.options.subtractOnBuy

        const savePurchasesHistory = settings.savePurchasesHistory
            || this.options.savePurchasesHistory


        if (subtractOnBuy) {
            if (currency) {
                this.currencies.subtractBalance(currency, totalPrice, memberID, this.guildID, reason)
                this.database.logger.debug('ShopItem.buy - Subtracting the balance from specified currency.')
            } else {
                this.database.subtract(`${this.guildID}.${memberID}.money`, totalPrice)

                this.emit('balanceSubtract', {
                    type: 'subtract',
                    guildID: this.guildID,
                    memberID,
                    amount: Number(totalPrice),
                    balance: balance - totalPrice,
                    reason
                })
            }
        } else {
            this.database.logger.debug('ShopItem.buy - Subtracting on buying is disabled.')
        }

        this.database.set(`${this.guildID}.${memberID}.inventory`, newInventory)

        if (savePurchasesHistory) {
            const history = this.database.fetch(`${this.guildID}.${memberID}.history`) || []

            this.database.push(`${this.guildID}.${memberID}.history`, {
                id: history.length ? history[history.length - 1].id + 1 : 1,
                memberID,
                guildID: this.guildID,
                name: item.name,
                price: item.price,
                quantity,
                totalPrice,
                role: item.role || null,
                maxAmount: item.maxAmount,
                date: new Date().toLocaleString(dateLocale),
                custom: item.custom || {}
            })
        } else {
            this.database.logger.debug('ShopItem.buy - Saving purchases history is disabled.')
        }

        this.emit('shopItemBuy', {
            guildID: this.guildID,
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
     * Sets a custom object for the item.
     * @param {object} custom Custom item data object.
     * @returns {boolean} If set successfully: true, else: false.
     */
    setCustom(customObject) {
        return this.edit('custom', customObject)
    }

    /**
     * Removes an item from the shop.
     *
     * This method is an alias for 'ShopItem.remove()' method.
     * @returns {boolean} If removed: true, else: false.
     */
    delete() {
        return this.remove()
    }

    /**
     * Removes an item from the shop.
     * @returns {boolean} If removed: true, else: false.
     */
    remove() {
        const shop = this.database.fetch(`${this.guildID}.shop`) || []
        const itemIndex = shop.findIndex(item => item.id == this.id || item.name == this.id)
        const item = shop[itemIndex]

        this.database.pop(`${this.guildID}.shop`, itemIndex)

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
     * Saves the shop item object in database.
     * @returns {ShopItem} Shop item instance.
     */
    save() {
        const shopArray = this.database.fetch(`${this.guildID}.shop`) || []
        const itemIndex = shopArray.findIndex(item => item.id == this.id)

        for (const prop in this.rawObject) {
            this.rawObject[prop] = this[prop]
        }

        shopArray.splice(itemIndex, 1, this.rawObject)
        this.database.set(`${this.guildID}.shop`, shopArray)

        return this
    }

    /**
     * Converts the shop item to string.
     * @returns {string} String representation of shop item.
     */
    toString() {
        return `Shop Item ${this.name} (ID in Shop: ${this.id}) - ${this.price} coins`
    }
}


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

/**
 * Shop item class.
 * @type {ShopItem}
 */
module.exports = ShopItem
