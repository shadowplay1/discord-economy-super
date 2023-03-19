const Emitter = require('../classes/util/Emitter')
const EconomyError = require('../classes/util/EconomyError')

const DatabaseManager = require('./DatabaseManager')
const CurrencyManager = require('./CurrencyManager')

const errors = require('../structures/errors')
const ShopItem = require('../classes/ShopItem')
const InventoryItem = require('../classes/InventoryItem')

/**
 * Shop manager methods class.
 * @extends {Emitter}
 */
class ShopManager extends Emitter {

    /**
      * Shop Manager.
      * @param {object} options Economy configuration.
      * @param {string} options.storagePath Full path to a JSON file. Default: './storage.json'.
      * @param {string} options.dateLocale The region (example: 'ru' or 'en') to format date and time. Default: 'en'.
      * @param {boolean} options.subtractOnBuy
      * If true, when someone buys the item, their balance will subtract by item price.
      *
      * @param {boolean} options.deprecationWarnings
      * If true, the deprecation warnings will be sent in the console.
      *
      * @param {boolean} options.savePurchasesHistory If true, the module will save all the purchases history.
     */
    constructor(options = {}) {
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
        this.database = new DatabaseManager(options)

        /**
         * Currency Manager.
         * @type {CurrencyManager}
         */
        this.currencies = new CurrencyManager(options, this.database)
    }

    /**
     * Creates an item in shop.
     * @param {string} guildID Guild ID.
     * @param {AddItemOptions} options Configuration with item info.
     * @returns {ShopItem} Item info.
     */
    addItem(guildID, options = {}) {
        let name = options.name

        const {
            itemName, price, message, custom,
            description, maxAmount, role
        } = options

        const dateLocale = this.database.fetch(`${guildID}.settings.dateLocale`)
            || this.options.dateLocale

        const date = new Date().toLocaleString(dateLocale)
        const shop = this.database.fetch(`${guildID}.shop`)

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


        const newShopItem = new ShopItem(guildID, itemInfo, this.database)

        this.database.push(`${guildID}.shop`, itemInfo)
        this.emit('shopItemAdd', newShopItem)

        return newShopItem
    }

    /**
     * Creates an item in shop.
     *
     * This method is an alias for the `ShopManager.addItem()` method.
     * @param {string} guildID Guild ID.
     * @param {AddItemOptions} options Configuration with item info.
     * @returns {ShopItem} Item info.
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
     * @returns {boolean} If edited successfully: true, else: false.
     */
    editItem(itemID, guildID, itemProperty, value) {
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

        const edit = (itemProperty, value) => {
            const shop = this.fetch(guildID)

            const itemIndex = shop.findIndex(item => item.id == itemID || item.name == itemID)
            const item = shop[itemIndex]

            if (!item) return false

            item[itemProperty] = value
            this.database.pull(`${guildID}.shop`, itemIndex, item)

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
     * @returns {boolean} If edited successfully: true, else: false.
     */
    edit(itemID, guildID, itemProperty, value) {
        return this.editItem(itemID, guildID, itemProperty, value)
    }

    /**
     * Sets a custom object for the item.
     * @param {string | number} itemID Item ID or name.
     * @param {string} guildID Guild ID.
     * @param {object} customObject Custom item data object.
     * @returns {boolean} If set successfully: true, else: false.
     */
    setCustom(itemID, guildID, customObject) {
        return this.editItem(itemID, guildID, 'custom', customObject)
    }

    /**
     * Removes an item from the shop.
     * @param {string | number} itemID Item ID or name .
     * @param {string} guildID Guild ID.
     * @returns {boolean} If removed: true, else: false.
     */
    removeItem(itemID, guildID) {

        /**
        * @type {ShopItem[]}
        */
        const shop = this.fetch(guildID)

        const itemIndex = shop.findIndex(item => item.id == itemID || item.name == itemID)
        const item = shop[itemIndex]

        if (typeof itemID !== 'number' && typeof itemID !== 'string') {
            throw new EconomyError(errors.invalidType('itemID', 'string or number', itemID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        this.database.pop(`${guildID}.shop`, itemIndex)

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
     * @returns {boolean} If cleared: true, else: false.
     */
    clear(guildID) {
        const shop = this.fetch(guildID)

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        if (!shop && !shop?.length) {
            this.emit('shopClear', false)
            return false
        }

        this.database.delete(`${guildID}.shop`)
        this.emit('shopClear', true)

        return true
    }

    /**
     * Clears the user's inventory.
     *
     * [!!!] This method is deprecated.
     * If you want to get all the bugfixes and
     * use the newest inventory features, please
     * switch to the usage of the new InventoryManager.
     *
     * [!!!] No help will be provided for inventory
     * related methods in ShopManager.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {boolean} If cleared: true, else: false.
     * @deprecated
     */
    clearInventory(memberID, guildID) {
        if (this.options.deprecationWarnings) {
            console.log(
                errors.deprecationWarning(
                    'ShopManager', 'clearInventory',
                    'InventoryManager', 'clear',
                    ['memberID', 'guildID'],
                    ['memberID', 'guildID']
                )
            )
        }


        const inventory = this.database.fetch(`${guildID}.${memberID}.inventory`) || []

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        if (!inventory) return false

        return this.database.delete(`${guildID}.${memberID}.inventory`)
    }

    /**
     * Shows all items in the shop.
     * @param {string} guildID Guild ID
     * @returns {ShopItem[]} The shop array.
     */
    fetch(guildID) {
        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        const shop = this.database.fetch(`${guildID}.shop`) || []
        return shop.map(item => new ShopItem(guildID, item, this.database))
    }

    /**
     * Shows all items in the shop.
     *
     * This method is an alias for the `ShopManager.fetch()` method.
     * @param {string} guildID Guild ID
     * @returns {ShopItem[]} The shop array.
     */
    get(guildID) {
        return this.fetch(guildID)
    }

    /**
     * Shows all items in the shop.
     *
     * This method is an alias for the `ShopManager.get()` method.
     * @param {string} guildID Guild ID
     * @returns {ShopItem[]} The shop array.
     */
    all(guildID) {
        return this.get(guildID)
    }

    /**
     * Gets the item in the shop.
     * @param {string | number} itemID Item ID or name.
     * @param {string} guildID Guild ID.
     * @returns {ShopItem} If item not found: null; else: item info object.
     */
    getItem(itemID, guildID) {

        /**
        * @type {ShopItem[]}
        */
        const shop = this.fetch(guildID)
        const item = shop.find(item => item.id == itemID || item.name == itemID)

        if (typeof itemID !== 'number' && typeof itemID !== 'string') {
            throw new EconomyError(errors.invalidType('itemID', 'string or number', itemID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        if (!item) return null
        return new ShopItem(guildID, item, this.database)
    }

    /**
     * Gets the item in the shop.
     *
     * This method is an alias for the `ShopManager.getItem()` method.
     * @param {string | number} itemID Item ID or name.
     * @param {string} guildID Guild ID.
     * @returns {ShopItem} If item not found: null; else: item info object.
     */
    findItem(itemID, guildID) {
        return this.getItem(itemID, guildID)
    }

    /**
     * Gets the item in the inventory.
     *
     * [!!!] This method is deprecated.
     * If you want to get all the bugfixes and
     * use the newest inventory features, please
     * switch to the usage of the new InventoryManager.
     *
     * [!!!] No help will be provided for inventory
     * related methods in ShopManager.
     * @param {string | number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {InventoryData} If item not found: null; else: item info object.
     * @deprecated
     */
    searchInventoryItem(itemID, memberID, guildID) {
        if (this.options.deprecationWarnings) {
            console.log(
                errors.deprecationWarning(
                    'ShopManager', 'searchInventoryItem',
                    'InventoryManager', 'getItem',
                    ['itemID', 'memberID', 'guildID'],
                    ['itemID', 'memberID', 'guildID']
                )
            )
        }

        /**
        * @type {InventoryData[]}
        */
        const inventory = this.database.fetch(`${guildID}.${memberID}.inventory`) || []
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
        return item
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
     * @returns {ShopOperationInfo} Operation information object.
     */
    buy(itemID, memberID, guildID, quantity = 1, currency = null, reason = 'received the item from the shop') {
        const balance = this.database.fetch(`${guildID}.${memberID}.money`) || 0

        const shop = this.fetch(guildID)
        const item = shop.find(item => item.id == itemID || item.name == itemID)

        const inventory = this.database.fetch(`${guildID}.${memberID}.inventory`) || []
        const inventoryItems = inventory.filter(invItem => invItem.name == item.name)

        const settings = this.database.fetch(`${guildID}.settings`) || {}

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
                this.currencies.subtractBalance(currency, totalPrice, memberID, guildID, reason)
                this.database.logger.debug('ShopItem.buy - Subtracting the balance from specified currency.')
            } else {
                this.database.subtract(`${guildID}.${memberID}.money`, totalPrice)

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

        this.database.set(`${guildID}.${memberID}.inventory`, newInventory)

        if (savePurchasesHistory) {
            const history = this.database.fetch(`${guildID}.${memberID}.history`) || []

            this.database.push(`${guildID}.${memberID}.history`, {
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
        } else {
            this.database.logger.debug('ShopItem.buy - Saving purchases history is disabled.')
        }

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
     * @returns {ShopOperationInfo} Operation information object.
     */
    buyItem(itemID, memberID, guildID, quantity, currency, reason) {
        return this.buy(itemID, memberID, guildID, quantity, currency, reason)
    }

    /**
     * Shows all items in user's inventory.
     *
     * [!!!] This method is deprecated.
     * If you want to get all the bugfixes and
     * use the newest inventory features, please
     * switch to the usage of the new InventoryManager.
     *
     * [!!!] No help will be provided for inventory
     * related methods in ShopManager.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {InventoryData[]} User's inventory array.
     * @deprecated
     */
    inventory(memberID, guildID) {
        if (this.options.deprecationWarnings) {
            console.log(
                errors.deprecationWarning(
                    'ShopManager', 'inventory',
                    'InventoryManager', 'get',
                    ['memberID', 'guildID'],
                    ['memberID', 'guildID']
                )
            )
        }

        const inventory = this.database.fetch(`${guildID}.${memberID}.inventory`) || []

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        return inventory
    }

    /**
     * Uses the item: returns the item usage message and removes the item from user's inventory.
     *
     * [!!!] This method is deprecated.
     * If you want to get all the bugfixes and
     * use the newest inventory features, please
     * switch to the usage of the new InventoryManager.
     *
     * [!!!] No help will be provided for inventory
     * related methods in ShopManager.
     * @param {string | number} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {Client} client Discord Client. [Specify if the role will be given on a Discord server]
     * @returns {string | boolean} Item message or null if item not found.
     * @deprecated
     */
    useItem(itemID, memberID, guildID, client) {
        if (this.options.deprecationWarnings) {
            console.log(
                errors.deprecationWarning(
                    'ShopManager', 'useItem',
                    'InventoryManager', 'useItem',
                    ['itemID', 'memberID', 'guildID', '[client]'],
                    ['itemID', 'memberID', 'guildID', '[client]']
                )
            )
        }


        /**
         * @type {InventoryData[]}
         */
        const inventory = this.database.fetch(`${guildID}.${memberID}.inventory`) || []

        const itemIndex = inventory.findIndex(invItem => invItem.id == itemID || invItem.name == itemID)
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

            this.database.pop(`${guildID}.${memberID}.inventory`, itemIndex + 1)

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
                item: new InventoryItem(guildID, memberID, this.options, item, this.database),
                receivedMessage: msg
            })

            return msg
        }
    }

    /**
     * Shows the user's purchase history.
     *
     * [!!!] This method is deprecated.
     * If you want to get all the bugfixes and
     * use the newest history features, please
     * switch to the usage of the new HistoryManager.
     *
     * [!!!] No help will be provided for history
     * related methods in ShopManager.
     * @param {string} memberID Member ID
     * @param {string} guildID Guild ID
     * @returns {HistoryData[]} User's purchase history.
     * @deprecated
     */
    history(memberID, guildID) {
        if (this.options.deprecationWarnings) {
            console.log(
                errors.deprecationWarning(
                    'ShopManager', 'history',
                    'HistoryManager', 'fetch',
                    ['memberID', 'guildID'],
                    ['memberID', 'guildID']
                )
            )
        }

        const history = this.database.fetch(`${guildID}.${memberID}.history`)

        if (!this.options.savePurchasesHistory) {
            throw new EconomyError(errors.savingHistoryDisabled, 'PURCHASES_HISTORY_DISABLED')
        }

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        return history
    }

    /**
    * Clears the user's purchases history.
    *
    * [!!!] This method is deprecated.
    * If you want to get all the bugfixes and
    * use the newest history features, please
    * switch to the usage of the new HistoryManager.
    *
    * [!!!] No help will be provided for history
    * related methods in ShopManager.
    * @param {string} memberID Member ID.
    * @param {string} guildID Guild ID.
    * @returns {boolean} If cleared: true, else: false.
    * @deprecated
    */
    clearHistory(memberID, guildID) {
        if (this.options.deprecationWarnings) {
            console.log(
                errors.deprecationWarning(
                    'ShopManager', 'clearHistory',
                    'HistoryManager', 'clear',
                    ['memberID', 'guildID'],
                    ['memberID', 'guildID']
                )
            )
        }

        const history = this.database.fetch(`${guildID}.${memberID}.history`) || []

        if (typeof memberID !== 'string') {
            throw new EconomyError(errors.invalidType('memberID', 'string', memberID), 'INVALID_TYPE')
        }

        if (typeof guildID !== 'string') {
            throw new EconomyError(errors.invalidType('guildID', 'string', guildID), 'INVALID_TYPE')
        }

        if (!history) return false

        return this.database.delete(`${guildID}.${memberID}.history`)
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
 * @property {number} [updateCountdown=1000] Checks for if storage file exists in specified time (in ms). Default: 1000.
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
