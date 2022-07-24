const Emitter = require('../classes/util/Emitter')
const DatabaseManager = require('./DatabaseManager')

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
 *    constructor(options, memberID, guildID) {
 *       super(options, memberID, guildID, ShopItem)
 * 
 *       this.guildID = guildID
 *       this.database = new DatabaseManager(options)
 *   }
 *  
 *  all() {
 *      const shop = this.database.fetch(`${this.guildID}.shop`) || []
        return shop.map(item => new ShopItem(this.guildID, item, this.database))
 *  }
 * }
 */
class BaseManager extends Emitter {

    /**
     * Base Manager.
     * @param {EconomyOptions} options Economy configuration.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {any} constructor A constructor (EconomyUser, ShopItem, etc.) to work with.
     */
    constructor(options, memberID, guildID, constructor) {
        super()

        /**
         * Economy configuration.
         * @type {EconomyOptions}
         * @private
         */
        this.options = options

        /**
         * Database Manager.
         * @type {DatabaseManager}
         * @private
         */
        this.database = new DatabaseManager(options)

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
         */
        this.baseConstructor = constructor

        /**
         * Amount of elements in database.
         * @type {number}
         */
        this.length = this.all().length
    }

    /**
     * Gets the first element in specified guild.
     * @returns {any} First database object.
     */
    first() {
        const array = this.all()
        const firstElement = array[0]

        if (!this.memberID) {
            return new this.baseConstructor(this.guildID, this.options, firstElement, this.database)
        }

        else if (this.memberID && this.guildID) {
            return new this.baseConstructor(this.memberID, this.guildID, this.options, firstElement, this.database)
        }

        else {
            return new this.baseConstructor(
                firstElement.memberID || firstElement.id,
                firstElement.guildID,
                this.options,
                firstElement,
                this.database
            )
        }
    }

    /**
     * Gets the last element in specified guild.
     * @returns {any} Last database object.
     */
    last() {
        const array = this.all()
        const lastElement = array[array.length - 1]

        if (!this.memberID) {
            return new this.baseConstructor(this.guildID, this.options, lastElement, this.database)
        }

        else if (this.memberID && this.guildID) {
            return new this.baseConstructor(this.memberID, this.guildID, this.options, lastElement, this.database)
        }

        else {
            return new this.baseConstructor(
                lastElement.memberID || lastElement.id,
                lastElement.guildID,
                this.options,
                lastElement,
                this.database
            )
        }

    }

    /**
     * Returns an array of elements in specified guild.
     * @returns {any[]} Array of elements in specified guild.
     */
    toArray() {
        const array = this.all()

        if (!this.memberID) {
            return array.map(element => {
                return new this.baseConstructor(this.guildID, this.options, element, this.database)
            })
        }

        if (this.memberID && this.guildID) {
            return array.map(element => {
                return new this.baseConstructor(this.memberID, this.guildID, this.options, element, this.database)
            })
        }

        else {
            return array.map(element => {
                return new this.baseConstructor(
                    element.memberID || element.id,
                    element.guildID,
                    this.options,
                    element,
                    this.database
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
     * @param {any} [thisArg] 
     * An object to which the this keyword can refer in the callbackfn function. 
     * If thisArg is omitted, undefined is used as the this value.
     * @returns {any} Database object.
     */
    find(predicate, thisArg) {
        return this.all().find(predicate, thisArg)
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
     * @returns {number} Element index.
     */
    findIndex(predicate, thisArg) {
        return this.all().findIndex(predicate, thisArg)
    }

    /**
     * This method is the same as `Array.includes()`. 
     * 
     * Determines whether an array includes a certain element, returning true or false as appropriate.
     * @param {any} searchElement The element to search for.
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
     * @param {any} searchElement The element to search for.
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
     * @param {any} searchElement The value to locate in the array.
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
     * @param {any} searchElement The value to locate in the array.
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
     * Reverses the array of all elements and returns it.
     * @returns {any[]} Reversed elements array.
     */
    reverse() {
        return this.all().reverse()
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
     * @returns {any[]} Sorted elements array.
     */
    sort(compareFn) {
        return this.all().sort(compareFn)
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
     * @returns {any[]}
     */
    filter(predicate, thisArg) {
        return this.all().filter(predicate, thisArg)
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
     * @param {PredicateFunction} callbackfn 
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
     * @param {PredicateFunction} predicate 
     * A function that accepts up to three arguments. 
     * The some method calls the predicate function for each element in the array
     * until the predicate returns a value which is coercible to the Boolean value true, 
     * or until the end of the array.
     * @param {any} [thisArg] 
     * An object to which the this keyword can refer in the callbackfn function. 
     * If thisArg is omitted, undefined is used as the this value.
     * @returns {boolean} Is any of the elements meets the specified condition.
     */
    some(predicate, thisArg) {
        return this.all().some(predicate, thisArg)
    }

    /**
     * Returns an iterable of values in the array.
     * @returns {IterableIterator<any>} An iterable of values in the array.
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
 * @property {boolean} [deprecationWarnings=true] 
 * If true, the deprecation warnings will be sent in the console. Default: true.
 * 
 * @property {boolean} [savePurchasesHistory=true] If true, the module will save all the purchases history.
 *
 * @property {number} [sellingItemPercent=75] 
 * Percent of the item's price it will be sold for. Default: 75.
 * 
 * @property {Number | Number[]} [weeklyAmount=100] Amount of money for Weekly Command. Default: 1000.
 * @property {Number | Number[]} [workAmount=[10, 50]] Amount of money for Work Command. Default: [10, 50].
 * @property {boolean} [subtractOnBuy=true] 
 * If true, when someone buys the item, their balance will subtract by item price. Default: false
 * 
 * @property {number} [updateCountdown=1000] Checks for if storage file exists in specified time (in ms). Default: 1000.
 * @property {string} [dateLocale='en'] The region (example: 'ru' or 'en') to format the date and time. Default: 'en'.
 * @property {UpdaterOptions} [updater=UpdaterOptions] Update checker configuration.
 * @property {ErrorHandlerOptions} [errorHandler=ErrorHandlerOptions] Error handler configuration.
 * @property {CheckerOptions} [optionsChecker=CheckerOptions] Configuration for an 'Economy.utils.checkOptions' method.
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
