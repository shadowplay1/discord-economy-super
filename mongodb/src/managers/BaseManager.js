const Emitter = require('../classes/util/Emitter')

/**
 * The default manager with its default methods.
 * 
 * [!] This manager cannot be used directly.
 * 
 * [!] When extending this manager, make sure to have an `all()` method in your child class.
 * 
 * [!] Make sure to specify your main item class (EconomyUser, ShopItem, etc.) 
 * in a second argument in super() for a manager to work with.
 * @extends {Emitter}
 * 
 * @example
 * const BaseManager = require('./BaseManager')
 * 
 * const DatabaseManager = require('./DatabaseManager')
 * const ShopItem = require('./ShopItem') // must be a class
 * 
 * class ShopManager extends BaseManager {
 *    constructor(options, memberID, guildID, database, cache) {
 *       super(options, memberID, guildID, ShopItem, database)
 * 
 *       this.database = database
 *       this.cache = cache
 *   }
 *  
 *  async all() {
 *      const shop = (await this.database.fetch(`${this.guildID}.shop`)) || []
 *      return shop.map(item => new ShopItem(this.guildID, item, this.database, this.cache))
 *   }
 * }
 */
class BaseManager extends Emitter {

    /**
     * Base Manager.
     * @param {EconomyConfiguration} options Economy configuration.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {any} constructor A constructor (EconomyUser, ShopItem, etc.) to work with.
     * @param {DatabaseManager} database Database manager.
     * @param {CacheManager} cache Cache Manager.
     * 
     * @param {any} [emptyBaseConstructor] 
     * An empty constructor (EmptyEconomyUser, EmptyEconomyGuild, etc.) to replace the `undefined` value with.
     */
    constructor(options, memberID, guildID, constructor, database, cache, emptyBaseConstructor) {
        super()

        delete options.connection


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
         * Cache Manager.
         * @type {CacheManager}
         * @private
         */
        this.cache = cache

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
         * A constructor (EconomyUser, ShopItem, etc.) to work with.
         * @type {any}
         * @private
         */
        this.baseConstructor = constructor

        /**
         * An empty constructor (EmptyEconomyUser, EmptyEconomyGuild, etc.) to replace the `undefined` value with.
         * @type {any}
         * @private
         */
        this.emptyBaseConstructor = emptyBaseConstructor

        /**
         * Number of specific element in database.
         * @type {number}
         */
        this.length = 0

        this.all().then(items => {
            this.length = items.length
        })
    }

    /**
     * Gets the first element in specified guild.
     * @returns {Promise<any>} First database object.
     */
    async first() {
        const array = await this.all()
        const firstElement = array[0]

        this.length = array.length

        if (!firstElement) {
            if (this.emptyBaseConstructor.name === 'EconomyUser') {
                return new this.emptyBaseConstructor(
                    this.memberID, this.guildID,
                    this.options,
                    this.database, this.cache
                )
            }

            return new this.emptyBaseConstructor(
                this.guildID, this.options,
                this.database, this.cache
            )
        }

        if (!this.memberID) {
            return new this.baseConstructor(
                this.guildID, this.options,
                firstElement,
                this.database, this.cache
            )
        }

        else if (this.memberID && this.guildID) {
            return new this.baseConstructor(
                this.memberID, this.guildID,
                this.options, firstElement,
                this.database, this.cache
            )
        }

        else {
            return new this.baseConstructor(
                firstElement.memberID || firstElement.id,
                firstElement.guildID,
                this.options, firstElement,
                this.database, this.cache
            )
        }
    }

    /**
     * Gets the last element in specified guild.
     * @returns {Promise<any>} Last database object.
     */
    async last() {
        const array = await this.all()
        const lastElement = array[array.length - 1]

        this.length = array.length

        if (!lastElement) {
            if (this.emptyBaseConstructor.name === 'EconomyUser') {
                return new this.emptyBaseConstructor(
                    this.memberID, this.guildID,
                    this.options,
                    this.database, this.cache
                )
            }

            return new this.emptyBaseConstructor(
                this.guildID, this.options,
                this.database, this.cache
            )
        }

        if (!this.memberID) {
            return new this.baseConstructor(
                this.guildID, this.options,
                lastElement,
                this.database, this.cache
            )
        }

        else if (this.memberID && this.guildID) {
            return new this.baseConstructor(
                this.memberID, this.guildID,
                this.options, lastElement,
                this.database, this.cache
            )
        }

        else {
            return new this.baseConstructor(
                lastElement.memberID || lastElement.id,
                lastElement.guildID,
                this.options, lastElement,
                this.database, this.cache
            )
        }

    }

    /**
     * Returns an array of elements in specified guild.
     * @returns {Promise<any[]>} Array of elements in specified guild.
     */
    async toArray() {

        /**
         * @type {any[]}
         */
        const array = await this.all()

        this.length = array.length

        if (!this.memberID) {
            return array.map(element => {
                return new this.baseConstructor(
                    this.guildID, this.options,
                    element,
                    this.database, this.cache
                )
            })
        }

        if (this.memberID && this.guildID) {
            return array.map(element => {
                return new this.baseConstructor(
                    this.memberID, this.guildID,
                    this.options, element,
                    this.database, this.cache
                )
            })
        }

        else {
            return array.map(element => {
                return new this.baseConstructor(
                    element.memberID || element.id,
                    element.guildID,
                    this.options, element,
                    this.database, this.cache
                )
            })
        }
    }

    /**
     * This method is the same as `Array.find()`.
     * 
     * Finds the element in array and returns it.
     * @param {PredicateFunction} predicate 
     * A function that accepts up to three arguments. 
     * The filter method calls the predicate function one time for each element in the array.
     * 
     * @param {any} [thisArg] 
     * An object to which the this keyword can refer in the callbackfn function. 
     * If thisArg is omitted, undefined is used as the this value.
     * 
     * @returns {Promise<any>} Database object.
     */
    async find(predicate, thisArg) {
        const allArray = await this.all()
        this.length = allArray.length

        const result = allArray.find(predicate, thisArg)

        if (!result) {
            if (this.emptyBaseConstructor.name === 'EconomyUser') {
                return new this.emptyBaseConstructor(
                    this.memberID, this.guildID,
                    this.options,
                    this.database, this.cache
                )
            }

            return new this.emptyBaseConstructor(
                this.guildID, this.options,
                this.database, this.cache
            )
        }
    }

    /**
     * Gets the element at the specified index in the elements array.
     * @param {number} index Index of the user.
     * @returns {Promise<any>} Object at the specified index.
     */
    async at(index) {
        const array = await this.all()
        this.length = array.length

        if (!array[index]) {
            if (this.emptyBaseConstructor.name === 'EconomyUser') {
                return new this.emptyBaseConstructor(
                    this.memberID, this.guildID,
                    this.options,
                    this.database, this.cache
                )
            }

            return new this.emptyBaseConstructor(
                this.guildID, this.options,
                this.database, this.cache
            )
        }

        if (!this.memberID) {
            return new this.baseConstructor(
                this.guildID, this.options,
                array[index],
                this.database, this.cache
            )
        }

        else if (this.memberID && this.guildID) {
            return new this.baseConstructor(
                this.memberID, this.guildID,
                this.options, array[index],
                this.database, this.cache
            )
        }

        else {
            return new this.baseConstructor(
                array[index].memberID || array[index].id,
                array[index].guildID,
                this.options, array[index],
                this.database, this.cache
            )
        }
    }

    /**
     * This method is the same as `Array.findIndex()`. 
     * 
     * Finds the element's index in array and returns it.
     * @param {PredicateFunction} predicate 
     * Find calls predicate once for each element of the array, in ascending order, 
     * until it finds one where predicate returns true. 
     * If such an element is found, findIndex immediately returns that element index. 
     * Otherwise, findIndex returns -1.
     * @param {any} [thisArg] 
     * An object to which the this keyword can refer in the callbackfn function. 
     * If thisArg is omitted, undefined is used as the this value.
     * @returns {Promise<number>} Element index.
     */
    async findIndex(predicate, thisArg) {
        const allArray = await this.all()
        this.length = allArray.length

        return allArray.findIndex(predicate, thisArg)
    }

    /**
     * This method is the same as `Array.includes()`. 
     * 
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param {any} searchElement The element to search for.
     * @param {number} [fromIndex] The position in this array at which to begin searching for searchElement.
     * @returns {Promise<boolean>} Is the specified element included or not.
     */
    async includes(searchElement, fromIndex) {
        const allArray = await this.all()
        this.length = allArray.length

        return allArray.includes(searchElement, fromIndex)
    }

    /**
     * This method is the same as `Array.includes()`.
     * 
     * This method is an alias for `UserManager.includes()` method.
     * 
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param {any} searchElement The element to search for.
     * @param {number} [fromIndex] 
     * The array index at which to begin the search. 
     * If fromIndex is omitted, the search starts at index 0.
     * @returns {Promise<boolean>} Is the specified element included or not.
     */
    async has(searchElement, fromIndex) {
        const allArray = await this.all()
        this.length = allArray.length

        return allArray.includes(searchElement, fromIndex)
    }

    /**
     * This method is the same as `Array.indexOf()`. 
     * 
     * @param {any} searchElement The value to locate in the array.
     * @param {number} [fromIndex] 
     * The array index at which to begin the search. 
     * If fromIndex is omitted, the search starts at index 0.
     * @returns {Promise<number>} Element index in the array.
     */
    async indexOf(searchElement, fromIndex) {
        const allArray = await this.all()
        this.length = allArray.length

        return allArray.indexOf(searchElement, fromIndex)
    }

    /**
     * This method is the same as `Array.lastIndexOf()`. 
     * 
     * @param {any} searchElement The value to locate in the array.
     * @param {number} [fromIndex] 
     * The array index at which to begin searching backward. 
     * If fromIndex is omitted, the search starts at the last index in the array.
     * @returns {Promise<number>} Element index in the array.
     */
    async lastIndexOf(searchElement, fromIndex) {
        const allArray = await this.all()
        this.length = allArray.length

        return allArray.lastIndexOf(searchElement, fromIndex)
    }

    /**
     * This method is the same as `Array.reverse()`. 
     * 
     * Reverses the array of all elements and returns it.
     * @returns {Promise<any[]>} Reversed elements array.
     */
    async reverse() {
        const allArray = await this.all()
        this.length = allArray.length

        return allArray.reverse()
    }

    /**
     * This method is the same as `Array.sort()`.
     * 
     * Sorts an array in place. This method mutates the array and returns a reference to the same array.
     * @param {CompareFunction} [compareFn] 
     * Function used to determine the order of the elements. 
     * It is expected to return a negative value if first argument is less than second argument, 
     * zero if they're equal and a positive value otherwise. 
     * If omitted, the elements are sorted in ascending, ASCII character order.
     * @returns {Promise<any[]>} Sorted elements array.
     */
    async sort(compareFn) {
        const allArray = await this.all()
        this.length = allArray.length

        return allArray.sort(compareFn)
    }

    /**
     * This method is the same as `Array.filter()`.
     * 
     * Filters the array by specified condition and returns the array.
     * @param {PredicateFunction} predicate 
     * A function that accepts up to three arguments. 
     * The filter method calls the predicate function one time for each element in the array.
     * @param {any} [thisArg] 
     * An object to which the this keyword can refer in the callbackfn function. 
     * If thisArg is omitted, undefined is used as the this value.
     * @returns {Promise<any[]>}
     */
    async filter(predicate, thisArg) {
        const allArray = await this.all()
        this.length = allArray.length

        return allArray.filter(predicate, thisArg)
    }

    /**
     * This method is the same as `Array.map()`. 
     * 
     * Calls a defined callback function on each element of an array, 
     * and returns an array that contains the results.
     * @param {PredicateFunction} callbackfn 
     * A function that accepts up to three arguments. 
     * The map method calls the callbackfn function one time for each element in the array.
     * @param {any} [thisArg] 
     * An object to which the this keyword can refer in the callbackfn function. 
     * If thisArg is omitted, undefined is used as the this value.
     * @returns {Promise<any>}
     */
    async map(callbackfn, thisArg) {
        const allArray = await this.all()
        this.length = allArray.length

        return allArray.map(callbackfn, thisArg)
    }

    /**
     * This method is the same as `Array.forEach()`. 
     * 
     * Calls a defined callback function on each element of an array, 
     * and returns an array that contains the results.
     * @param {PredicateFunction} callbackfn 
     * A function that accepts up to three arguments. 
     * The map method calls the callbackfn function one time for each element in the array.
     * @param {any} [thisArg] 
     * An object to which the this keyword can refer in the callbackfn function. 
     * If thisArg is omitted, undefined is used as the this value.
     * @returns {Promise<void>}
     */
    async forEach(callbackfn, thisArg) {
        const allArray = await this.all()
        this.length = allArray.length

        return allArray.forEach(callbackfn, thisArg)
    }

    /**
     * This method is the same as `Array.some()`. 
     * 
     * Determines whether the specified callback function returns true for any element of an array.
     * @param {PredicateFunction} predicate 
     * A function that accepts up to three arguments. 
     * The some method calls the predicate function for each element in the array
     * until the predicate returns a value which is coercible to the Boolean value true, 
     * or until the end of the array.
     * @param {any} [thisArg] 
     * An object to which the this keyword can refer in the callbackfn function. 
     * If thisArg is omitted, undefined is used as the this value.
     * @returns {Promise<boolean>} Is any of the elements meets the specified condition.
     */
    async some(predicate, thisArg) {
        const allArray = await this.all()
        this.length = allArray.length

        return allArray.some(predicate, thisArg)
    }

    /**
     * Returns an iterable of values in the array.
     * @returns {Promise<IterableIterator<any>>} An iterable of values in the array.
     */
    async values() {
        const allArray = await this.all()
        this.length = allArray.length

        return allArray.values()
    }

    /**
     * Returns a string representation of an array.
     * @returns {Promise<string>} String representation of an array.
     */
    async toString() {
        const allArray = await this.all()
        this.length = allArray.length

        return allArray.toString()
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
 * @callback PredicateFunction
 * @param {any} value
 * @param {number} index
 * @param {any[]} array
 * @returns {boolean}
 */

/**
 * @callback CompareFunction
 * @param {any} a
 * @param {any} b
 * @returns {number}
 */

/**
 * Base manager class.
 * @type {BaseManager}
 */
module.exports = BaseManager
