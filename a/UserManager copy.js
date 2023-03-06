const EconomyUser = require('../src/classes/EconomyUser')
const DatabaseManager = require('../src/managers/DatabaseManager')
const UtilsManager = require('../src/managers/UtilsManager')

/**
 * User manager methods class.
 */
class UserManager {

    /**
     * User Manager.
     * @param {EconomyConfiguration} options Economy configuration.
     * @param {DatabaseManager} database Database manager.
     */
    constructor(options, database) {

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

        /**
         * Utils Manager.
         * @type {UtilsManager}
         * @private
         */
        this.utils = new UtilsManager(options, database)

        /**
         * Amount of users in database.
         * @type {number}
         */
        this.length = this.all().length
    }

    /**
     * Gets the user by it's ID and guild ID.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {EconomyUser} User object.
     */
    get(memberID, guildID) {
        const user = this.all().find(x => x.id == memberID && x.guildID == guildID)

        return user
    }

    /**
     * Creates an economy user object in database.
     * @param {string} userID The user ID to set.
     * @param {string} guildID Guild ID.
     * @returns {EconomyUser} Economy user object.
     */
    create(userID, guildID) {
        this.utils.reset(userID, guildID)

        return this.all().find(x => x.guildID == guildID && x.id == userID)
    }

    /**
     * Gets the first user in specified guild.
     * @param {string} guildID Guild ID.
     * @returns {EconomyUser} User object.
     */
    first(guildID) {
        const users = this.database.find(`${guildID}`) || []

        return new EconomyUser(memberID, guildID, this.options, users[0], this.database)
    }

    /**
     * Gets the last user in specified guild.
     * @param {string} guildID Guild ID.
     * @returns {EconomyUser} User object.
     */
    last(guildID) {
        const users = this.database.find(`${guildID}`) || []

        return new EconomyUser(memberID, guildID, this.options, users[users.length - 1])
    }

    /**
     * Returns an array of users in specified guild.
     * @param {string} guildID Guild ID.
     * @returns {EconomyUser[]} Array of users in specified guild.
     */
    toArray(guildID) {
        const users = this.database.find(`${guildID}`) || []

        return users.map(user => new EconomyUser(user.id, guildID, this.options, user))
    }

    /**
     * Gets the array of ALL users in database.
     * @returns {EconomyUser[]}
     */
    all() {
        const userArray = []
        const guildIDs = this.database.keysList('')


        for (const guildID of guildIDs) {
            const usersObject = this.database.fetch(`${guildID}`) || []
            const userEntries = Object.entries(usersObject)

            for (const [key, value] of userEntries) {
                if (!isNaN(key)) {
                    value.id = key
                    value.guildID = guildID

                    userArray.push(value)
                }
            }
        }

        return userArray.map(user => {
            const userObject = this.database.fetch(`${user.guildID}.${user.id}`)

            delete userObject.history
            delete userObject.inventory
            delete userObject.bank

            const economyUser = new EconomyUser(user.id, user.guildID, this.options, userObject)

            delete economyUser.storagePath
            delete economyUser.database
            delete economyUser.utils
            delete economyUser.shop


            return economyUser
        })
    }

    /**
     * This method is the same as `Array.find()`.
     *
     * Finds the element in array and returns it.
     * @param {(value: EconomyUser, index: number, array: EconomyUser[]) => boolean} predicate
     * A function that accepts up to three arguments.
     * The filter method calls the predicate function one time for each element in the array.
     * @param {any} [thisArg]
     * An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     * @returns {EconomyUser} Economy user object.
     */
    find(predicate, thisArg) {
        return this.all().find(predicate, thisArg)
    }

    /**
     * This method is the same as `Array.findIndex()`.
     *
     * Finds the element's index in array and returns it.
     * @param {(this: void, value: EconomyUser, index: number, obj: EconomyUser[]) => boolean} predicate
     * Find calls predicate once for each element of the array, in ascending order,
     * until it finds one where predicate returns true.
     * If such an element is found, findIndex immediately returns that element index.
     * Otherwise, findIndex returns -1.
     * @param {any} [thisArg]
     * An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     * @returns {number} Element index.
     */
    findIndex(predicate, thisArg) {
        return this.all().findIndex(predicate, thisArg)
    }

    /**
     * This method is the same as `Array.includes()`.
     *
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param {EconomyUser} searchElement The element to search for.
     * @param {number} [fromIndex] The position in this array at which to begin searching for searchElement.
     * @returns {boolean} Is the specified element included or not.
     */
    includes(searchElement, fromIndex) {
        return this.all().includes(searchElement, fromIndex)
    }

    /**
     * This method is the same as `Array.includes()`.
     *
     * This method is an alias for `UserManager.includes()` method.
     *
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param {EconomyUser} searchElement The element to search for.
     * @param {number} [fromIndex]
     * The array index at which to begin the search.
     * If fromIndex is omitted, the search starts at index 0.
     * @returns {boolean} Is the specified element included or not.
     */
    has(searchElement, fromIndex) {
        return this.all().includes(searchElement, fromIndex)
    }

    /**
     * This method is the same as `Array.indexOf()`.
     *
     * @param {EconomyUser} searchElement The value to locate in the array.
     * @param {number} [fromIndex]
     * The array index at which to begin the search.
     * If fromIndex is omitted, the search starts at index 0.
     * @returns {number} Element index in the array.
     */
    indexOf(searchElement, fromIndex) {
        return this.all().indexOf(searchElement, fromIndex)
    }

    /**
     * This method is the same as `Array.lastIndexOf()`.
     *
     * @param {EconomyUser} searchElement The value to locate in the array.
     * @param {number} [fromIndex]
     * The array index at which to begin searching backward.
     * If fromIndex is omitted, the search starts at the last index in the array.
     * @returns {number} Element index in the array.
     */
    lastIndexOf(searchElement, fromIndex) {
        return this.all().lastIndexOf(searchElement, fromIndex)
    }

    /**
     * This method is the same as `Array.reverse()`.
     *
     * Reverses the array of all economy users and returns it.
     * @returns {EconomyUser[]} Reversed users array.
     */
    reverse() {
        return this.all().reverse()
    }

    /**
     * This method is the same as `Array.sort()`.
     *
     * Sorts an array in place. This method mutates the array and returns a reference to the same array.
     * @param {(a: EconomyUser, b: EconomyUser) => number} compareFn
     * Function used to determine the order of the elements.
     * It is expected to return a negative value if first argument is less than second argument,
     * zero if they're equal and a positive value otherwise.
     * If omitted, the elements are sorted in ascending, ASCII character order.
     * @returns {EconomyUser[]} Sorted users array.
     */
    sort(compareFn) {
        return this.all().sort(compareFn)
    }

    /**
     * This method is the same as `Array.filter()`.
     *
     * Filters the array by specified condition and returns the array.
     * @param {(value: EconomyUser, index: number, array: EconomyUser[]) => boolean} predicate
     * A function that accepts up to three arguments.
     * The filter method calls the predicate function one time for each element in the array.
     * @param {any} [thisArg]
     * An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     * @returns {EconomyUser[]}
     */
    filter(predicate, thisArg) {
        return this.all().filter(predicate, thisArg)
    }

    /**
     * This method is the same as `Array.map()`.
     *
     * Calls a defined callback function on each element of an array,
     * and returns an array that contains the results.
     * @param {(value: EconomyUser, index: number, array: EconomyUser[]) => boolean} callbackfn
     * A function that accepts up to three arguments.
     * The map method calls the callbackfn function one time for each element in the array.
     * @param {any} [thisArg]
     * An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     * @returns {any}
     */
    map(callbackfn, thisArg) {
        return this.all().map(callbackfn, thisArg)
    }

    /**
     * This method is the same as `Array.forEach()`.
     *
     * Calls a defined callback function on each element of an array,
     * and returns an array that contains the results.
     * @param {(value: EconomyUser, index: number, array: EconomyUser[]) => boolean} callbackfn
     * A function that accepts up to three arguments.
     * The map method calls the callbackfn function one time for each element in the array.
     * @param {any} [thisArg]
     * An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     * @returns {void}
     */
    forEach(callbackfn, thisArg) {
        return this.all().forEach(callbackfn, thisArg)
    }

    /**
     * This method is the same as `Array.some()`.
     *
     * Determines whether the specified callback function returns true for any element of an array.
     * @param {(this: void, value: EconomyUser, index: number, obj: EconomyUser[]) => boolean} predicate
     * A function that accepts up to three arguments.
     * The some method calls the predicate function for each element in the array
     * until the predicate returns a value which is coercible to the Boolean value true,
     * or until the end of the array.
     * @param {any} [thisArg]
     * An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     * @returns {boolean} Is any of the elements returns true or not.
     */
    some(predicate, thisArg) {
        return this.all().some(predicate, thisArg)
    }

    /**
     * Returns an iterable of values in the array.
     * @returns {IterableIterator<EconomyUser>} An iterable of values in the array.
     */
    values() {
        return this.all().values()
    }

    /**
     * Returns a string representation of an array.
     * @returns {string} String representation of an array.
     */
    toString() {
        return this.all().toString()
    }
}


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
 * @property {boolean} [deprecationWarnings=true]
 * If true, the deprecation warnings will be sent in the console. Default: true.
 *
 * @property {boolean} [savePurchasesHistory=true] If true, the module will save all the purchases history.
 *
 * @property {number} [sellingItemPercent=75]
 * Percent of the item's price it will be sold for. Default: 75.
 *
 * @property {number | number[]} [weeklyAmount=100] Amount of money for Weekly Command. Default: 1000.
 * @property {number | number[]} [workAmount=[10, 50]] Amount of money for Work Command. Default: [10, 50].
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
 * User manager class.
 * @type {UserManager}
 */
module.exports = UserManager
