const EconomyError = require('../util/EconomyError')
const errors = require('../../structures/errors')

const BaseManager = require('../../managers/BaseManager')
const InventoryItem = require('../InventoryItem')


/**
 * User inventory class.
 * @extends {BaseManager}
 */
class Inventory extends BaseManager {

    /**
     * Inventory constructor.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} options Economy configuration.
     * @param {DatabaseManager} database Database manager.
     */
    constructor(memberID, guildID, options, database) {
        super(options, memberID, guildID, InventoryItem)

        /**
        * Member ID.
        * @type {string}
        */
        this.memberID = memberID

        /**
         * Guild ID.
         * @type {string}
         */
        this.guildID = guildID

        /**
         * Economy configuration.
         * @type {EconomyConfiguration}
         * @private
         */
        this.options = options

        /**
         * Database Manager.
         * @type {DatabaseManager}
         * @private
         */
        this.database = database
    }

    /**
     * Gets the item from user's inventory.
     * @param {string | number} itemID Item ID.
     * @returns {InventoryItem} User's inventory item.
     */
    get(itemID) {
        return this.fetch().find(item => item.id == itemID || item.name == itemID)
    }

    /**
     * Gets all the items in user's inventory.
     *
     * This method is an alias for 'EconomyUser.inventory.fetch' nethod.
     * @returns {InventoryItem[]} User's inventory array.
     */
    all() {
        return this.fetch()
    }

    /**
     * Uses the item: returns the item usage message and removes the item from user's inventory.
     * @param {string | number} itemID Item ID.
     * @param {any} [client] Discord Client. [Specify if the role will be given on a Discord server]
     * @returns {string} Item message or null if item not found.
     */
    use(itemID, client) {
        const inventory = this.fetch(this.memberID, this.guildID)

        const itemObject = this.searchItem(itemID, this.memberID, this.guildID)
        const itemIndex = inventory.findIndex(invItem => invItem.id == itemObject?.id)

        const item = inventory[itemIndex]

        if (typeof itemID !== 'number' && typeof itemID !== 'string') {
            throw new EconomyError(errors.invalidType('itemID', 'string or number', itemID), 'INVALID_TYPE')
        }

        if (!item) return null

        if (item.role) {
            if (item.role && !client) {
                throw new EconomyError(errors.noClient, 'NO_DISCORD_CLIENT')
            }

            const guild = client.guilds.cache.get(this.guildID)
            const roleID = item.role.replace('<@&', '').replace('>', '')

            guild.roles.fetch(roleID).then(role => {
                const member = guild.members.cache.get(this.memberID)

                member.roles.add(role).catch(err => {
                    if (!role) {
                        return console.error(new EconomyError(errors.roleNotFound + roleID, 'ROLE_NOT_FOUND'))
                    }

                    console.error(
                        `\x1b[31mFailed to give a role "${guild.roles.cache.get(roleID)?.name}"` +
                        `on guild "${guild.name}" to member ${guild.member(this.memberID).user.tag}:\x1b[36m`
                    )

                    console.error(err)
                    console.error('\x1b[0m')
                })
            })
        }

        this.removeItem(itemID, this.memberID, this.guildID)

        let msg
        const string = item?.message || 'You have used this item!'

        if (string.includes('[random=')) {
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
            guildID: this.guildID,
            usedBy: this.memberID,
            item,
            receivedMessage: msg
        })

        return msg
    }

    /**
     * Adds the item from the shop to user's inventory.
     * @param {string | number} itemID Item ID.
     * @returns {boolean} If added successfully: true, else: false.
     */
    add(itemID) {

        /**
         * @type {ItemData[]}
         */
        const shop = this.database.set(`${this.guildID}.shop`)
        const item = shop.find(shopItem => shopItem.id == itemID || shopItem.name == itemID)

        /**
        * @type {InventoryData[]}
        */
        const inventory = this.fetcher.fetchInventory(this.memberID, this.guildID)
        const inventoryItems = inventory.filter(invItem => invItem.name == item.name)

        if (typeof itemID !== 'number' && typeof itemID !== 'string') {
            throw new EconomyError(errors.invalidType('itemID', 'string or number', itemID), 'INVALID_TYPE')
        }

        if (!item) return false
        if (item.maxAmount && inventoryItems.length >= item.maxAmount) return 'max'

        const itemData = {
            id: inventory.length ? inventory[inventory.length - 1].id + 1 : 1,
            name: item.name,
            price: item.price,
            message: item.message,
            description: item.description,
            role: item.role || null,
            maxAmount: item.maxAmount,
            date: new Date().toLocaleString(this.options.dateLocale || 'en')
        }

        return this.database.push(`${this.guildID}.${this.memberID}.inventory`, itemData)
    }

    /**
     * Removes the item from user's inventory.
     * @param {string | number} itemID Item ID.
     * @returns {boolean} If removed successfully: true, else: false.
     */
    removeItem(itemID) {
        const inventory = this.fetch(this.memberID, this.guildID)

        const item = this.searchItem(itemID, this.memberID, this.guildID)
        const itemIndex = inventory.findIndex(invItem => invItem.id == item?.id)

        if (typeof itemID !== 'number' && typeof itemID !== 'string') {
            throw new EconomyError(errors.invalidType('itemID', 'string or number', itemID), 'INVALID_TYPE')
        }

        if (!item) return false
        return this.database.pop(`${this.guildID}.${this.memberID}.inventory`, itemIndex)
    }

    /**
     * Clears the user's inventory.
     * @returns {boolean} If cleared: true, else: false.
     */
    clear() {
        const inventory = this.fetch(this.memberID, this.this.guildID)
        if (!inventory) return false

        return this.database.delete(`${this.guildID}.${this.memberID}.inventory`)
    }

    /**
     * Fetches the user's inventory.
     * @returns {InventoryItem[]} User's inventory array.
     */
    fetch() {
        const inventory = this.database.fetch(`${this.guildID}.${this.memberID}.inventory`) || []

        return inventory.map(
            inventoryItem => new InventoryItem(
                this.guildID, this.memberID,
                this.options, inventoryItem,
                this.database
            )
        )
    }

    /**
     * Gets the item from user's inventory.
     *
     * This method is an alias for 'EconomyUser.inventory.get()' method.
     * @param {string | number} itemID Item ID.
     * @returns {InventoryItem} User's inventory item.
     */
    findItem(itemID) {
        return this.get(itemID)
    }
}

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
 * User inventory class.
 * @type {Inventory}
 */
module.exports = Inventory
