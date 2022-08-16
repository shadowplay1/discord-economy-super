const CacheManager = require('../managers/CacheManager')
const DatabaseManager = require('../managers/DatabaseManager')

const SettingsManager = require('../managers/SettingsManager')

const errors = require('../structures/errors')
const EconomyError = require('./util/EconomyError')

const Emitter = require('./util/Emitter')


/**
* Inventory item class.
* @extends {Emitter}
*/
class InventoryItem extends Emitter {

    /**
     * Inventory item class.
     * @param {string} guildID Guild ID.
     * @param {string} memberID Member ID.
     * @param {EconomyOptions} ecoOptions Economy configuration.
     * @param {InventoryData} itemObject Economy guild object.
     * @param {DatabaseManager} database Database Manager.
     * @param {CacheManager} cache Cache manager.
     */
    constructor(guildID, memberID, ecoOptions, itemObject, database, cache) {
        super()

        /**
         * Economy configuration.
         * @type {EconomyOptions}
         */
        this.options = ecoOptions

        /**
         * Item object.
         * @type {InventoryData}
         */
        this.itemObject = itemObject

        /**
         * Guild ID.
         * @type {string}
         */
        this.guildID = guildID

        /**
         * Guild ID.
         * @type {string}
         */
        this.memberID = memberID


        /**
         * Inventory item ID.
         * @type {number}
         */
        this.id = itemObject.id

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
         * Quantity of the item.
         * @type {number}
         */
        this.quantity = itemObject.quantity


        for (const [key, value] of Object.entries(itemObject || {})) {
            this[key] = value
        }

        /**
         * Settings manager methods object.
         * @type {SettingsManager}
         * @private
         */
        this.settings = new SettingsManager(ecoOptions, database)

        /**
         * Database Manager.
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
    }

    /**
     * Removes an item from the shop.
     * @param {number} [quantity=1] Quantity of items to delete.
     * 
     * This method is an alias for 'InventoryItem.remove()' method.
     * @returns {Promise<boolean>} If removed: true, else: false.
     */
    delete(quantity = 1) {
        return this.remove(quantity)
    }

    /**
     * Removes an item from the shop.
     * @param {number} [quantity=1] Quantity of items to delete.
     * @returns {Promise<boolean>} If removed: true, else: false.
     */
    async remove(quantity = 1) {
        const inventory = (await this.database.fetch(`${this.guildID}.${this.memberID}.inventory`) || [])

        const item = this
        const itemQuantity = inventory.filter(item => item.id == item.id).length

        const newInventory = [
            ...inventory.filter(invItem => invItem.id != item.id),
            ...Array(itemQuantity - quantity).fill(item.itemObject)
        ]

        const result = await this.database.set(`${this.guildID}.${this.memberID}.inventory`, newInventory)

        this.cache.inventory.update({
            guildID: this.guildID,
            memberID: this.memberID
        })

        return result
    }

    /**
     * Uses the item from user's inventory.
     * @param {number | string} itemID Item ID or name.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {Client} [client] Discord Client [Specify if the role will be given in a Discord server].
     * @returns {Promise<string>} Item message.
     */
    async use(client) {
        const inventory = (await this.database.fetch(`${this.guildID}.${this.memberID}.inventory`)) || []

        const itemObject = this.itemObject
        const itemIndex = inventory.findIndex(invItem => invItem.id == itemObject?.id)

        const item = inventory[itemIndex]
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

        await this.delete()

        this.cache.inventory.update({
            guildID: this.guildID,
            memberID: this.memberID
        })

        let msg
        const string = item?.message || 'You have used this item!'

        if (string.includes('[random=')) {
            const str = string.slice(string.indexOf('[')).replace('random=', '')

            let errored = false
            let arr

            try {
                arr = JSON.parse(str.slice(0, str.indexOf(']') + 1))
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
            item: this,
            receivedMessage: msg
        })

        return msg
    }

    /**
     * Removes the item from user's inventory
     * and adds its price to the user's balance.
     * This is the same as selling something.
     * 
     * @param {number} [quantity=1] Quantity of items to sell.
     * @returns {Promise<SellingOperationInfo>} Selling operation info.
     */
    async sell(quantity = 1) {
        const inventory = (await this.database.fetch(`${this.guildID}.${this.memberID}.inventory`)) || []

        const item = this
        const itemQuantity = inventory.filter(invItem => invItem.id == item.id).length

        const percent = (await this.settings.get('sellingItemPercent', guildID))
            || this.options.sellingItemPercent

        const sellingPrice = Math.floor((item?.price / 100) * percent)
        const totalSellingPrice = sellingPrice * quantity

        if (quantity > itemQuantity || quantity < 1) {
            return {
                status: false,
                message: `not enough items to sell (${itemQuantity} < ${quantity})`,
                item,
                quantity,
                totalPrice: totalSellingPrice
            }
        }

        await this.database.add(`${this.guildID}.${this.memberID}.money`, totalSellingPrice)
        this.remove(quantity)

        this.cache.updateSpecified(['users', 'inventory', 'balance'], {
            guildID: this.guildID,
            memberID: this.memberID
        })

        return {
            status: true,
            message: 'OK',
            item,
            quantity,
            totalPrice: totalSellingPrice
        }
    }
}


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
 * @typedef {object} EconomyOptions Default Economy configuration.
 * @property {string} [storagePath='./storage.json'] Full path to a JSON file. Default: './storage.json'
 * @property {boolean} [checkStorage=true] Checks the if database file exists and if it has errors. Default: true
 * @property {number} [dailyCooldown=86400000] 
 * Cooldown for Daily Command (in ms). Default: 24 hours (60000 * 60 * 24 ms)
 * 
 * @property {number} [workCooldown=3600000] Cooldown for Work Command (in ms). Default: 1 hour (60000 * 60 ms)
 * @property {Number | Number[]} [dailyAmount=100] Amount of money for Daily Command. Default: 100.
 * @property {number} [weeklyCooldown=604800000] 
 * Cooldown for Weekly Command (in ms). Default: 7 days (60000 * 60 * 24 * 7 ms)
 * 
 * @property {Number | Number[]} [weeklyAmount=100] Amount of money for Weekly Command. Default: 1000.
 * @property {Number | Number[]} [workAmount=[10, 50]] Amount of money for Work Command. Default: [10, 50].
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
 * @property {ErrorHandlerOptions} [errorHandler=ErrorHandlerOptions] Error handler configuration.
 * @property {CheckerOptions} [optionsChecker=CheckerOptions] Configuration for an 'Economy.utils.checkOptions' method.
 * @property {boolean} [debug=false] Enables or disables the debug mode.
 */


/**
 * Inventory item class.
 * @type {InventoryItem}
 */
module.exports = InventoryItem
