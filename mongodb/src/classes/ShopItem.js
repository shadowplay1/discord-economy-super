const CacheManager = require('../managers/CacheManager')
const DatabaseManager = require('../managers/DatabaseManager')

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
     * @param {CacheManager} cache Cache manager.
     */
    constructor(guildID, itemObject, database, cache) {
        super()

        /**
         * Guild ID.
         * @type {string}
         */
        this.guildID = guildID

        /**
         * Item object.
         * @type {ItemData}
         */
        this.itemObject = itemObject

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
         * ID of Discord Role that will be given to Wuser on item use.
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

        /**
         * Cache Manager.
         * @type {CacheManager}
         * @private
         */
        this.cache = cache

        for (const [key, value] of Object.entries(itemObject || {})) {
            this[key] = value
        }
    }


    /**
     * Checks for is the specified user has enough money to buy the item.
     * @param {string} userID User ID.
     * @param {number} [quantity=1] Quantity of the items to buy.
     * @returns {Promise<boolean>} Is the user has enough money to buy the item.
     */
    async isEnoughMoneyFor(userID, quantity = 1) {
        const user = await this.database.fetch(`${this.guildID}.${userID}`)
        return user?.money >= this.price * quantity
    }

    /**
     * Checks for is the specified user has the item in their inventory.
     * @param {string} userID User ID.
     * @returns {Promise<boolean>} Is the user has the item in their inventory.
     */
    async isInInventory(userID) {
        const user = await this.database.fetch(`${this.guildID}.${userID}`)
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
     * @returns {Promise<boolean>} If edited successfully: true, else: false.
     */
    async edit(itemProperty, value) {
        const itemProperties = ['description', 'price', 'name', 'message', 'maxAmount', 'role', 'custom']

        if (!itemProperties.includes(itemProperty)) {
            throw new EconomyError(errors.invalidTypes.editItemArgs.itemProperty + itemProperty, 'INVALID_TYPE')
        }

        if (value == undefined) {
            throw new EconomyError(errors.invalidTypes.editItemArgs.itemProperty + value, 'INVALID_TYPE')
        }

        const edit = async (itemProperty, value) => {

            /**
             * @type {ItemData[]}
             */
            const shop = await this.database.fetch(`${this.guildID}.shop`)

            const itemIndex = shop.findIndex(item => item.id == this.id || item.name == this.id)
            const item = shop[itemIndex]

            if (!item) return false

            item[itemProperty] = value
            await this.database.pull(`${this.guildID}.shop`, itemIndex, item)

            this.emit('shopItemEdit', {
                item: this,
                guildID: this.guildID,
                changedProperty: itemProperty,
                oldValue: item[itemProperty],
                newValue: value
            })

            this.cache.shop.update({
                guildID: this.guildID
            })

            return true
        }

        switch (itemProperty) {
            case itemProperties[0]:
                const result = await edit(itemProperties[0], value)
                return result

            case itemProperties[1]:
                const result1 = await edit(itemProperties[1], value)
                return result1

            case itemProperties[2]:
                const result2 = await edit(itemProperties[2], value)
                return result2

            case itemProperties[3]:
                const result3 = await edit(itemProperties[3], value)
                return result3

            case itemProperties[4]:
                const result4 = await edit(itemProperties[4], value)
                return result4

            case itemProperties[5]:
                const result5 = await edit(itemProperties[5], value)
                return result5

            case itemProperties[6]:
                const result6 = await edit(itemProperties[6], value)
                return result6

            default:
                return null
        }
    }

    /**
     * Sets a custom object for the item.
     * @param {object} custom Custom item data object.
     * @returns {Promise<boolean>} If set successfully: true, else: false.
     */
    setCustom(customObject) {
        return this.edit('custom', customObject)
    }

    /**
     * Removes an item from the shop.
     * 
     * This method is an alias for 'ShopItem.remove()' method.
     * @returns {Promise<boolean>} If removed: true, else: false.
     */
    delete() {
        return this.remove()
    }

    /**
     * Removes an item from the shop.
     * @returns {Promise<boolean>} If removed: true, else: false.
     */
    async remove() {
        const shop = await this.database.fetch(`${this.guildID}.shop`) || []

        const itemIndex = shop.findIndex(item => item.id == this.id || item.name == this.id)
        const item = shop[itemIndex]

        await this.database.pop(`${this.guildID}.shop`, itemIndex)

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

        this.cache.shop.update({
            guildID: this.guildID
        })

        return true
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
 * @property {string} role ID of Discord Role that will be given to Wuser on item use.
 * @property {number} maxAmount Max amount of the item that user can hold in their inventory.
 * @property {string} date Date when the item was added in the shop.
 * @property {object} custom Custom item properties object.
 */

/**
 * @typedef {object} EconomyConfiguration Default Economy configuration.
 * @property {string} [storagePath='./storage.json'] Full path to a JSON file. Default: './storage.json'
 * @property {boolean} [checkStorage=true] Checks the if database file exists and if it has errors. Default: true
 * @property {number} [dailyCooldown=86400000] 
 * Cooldown for Daily Command (in ms). Default: 24 hours (60000 * 60 * 24 ms)
 * 
 * @property {number} [workCooldown=3600000] Cooldown for Work Command (in ms). Default: 1 hour (60000 * 60 ms)
 * @property {number | number[]} [dailyAmount=100] Amount of money for Daily Command. Default: 100.
 * @property {number} [weeklyCooldown=604800000] 
 * Cooldown for Weekly Command (in ms). Default: 7 days (60000 * 60 * 24 * 7 ms)
 * 
 * @property {number | number[]} [weeklyAmount=100] Amount of money for Weekly Command. Default: 1000.
 * @property {number | number[]} [workAmount=[10, 50]] Amount of money for Work Command. Default: [10, 50].
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
 * Configuration for an 'Economy.utils.checkOptions' method.
 * @property {boolean} [debug=false] Enables or disables the debug mode.
 */

/**
 * Shop item class.
 * @type {ShopItem}
 */
module.exports = ShopItem
