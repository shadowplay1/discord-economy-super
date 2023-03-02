import EconomyDatabase from '../../typings/interfaces/EconomyDatabase'
import EconomyConfiguration from '../interfaces/EconomyConfiguration'

/**
 * Tbase manager methods class.
 */
declare class DatabaseManager {
    public constructor(options: EconomyConfiguration)

    /**
    * Gets a list of keys in database.
    * @param {string} key The key in database.
    * @returns An array with all keys in database or 'null' if nothing found.
    */
    public keysList(key: string): string[]

    /**
    * Sets data in a property in database.
    * @param {string} key The key in database.
    * @param {T} data Any data to set in property.
    * @returns If set successfully: true; else: false
    */
    public set<T>(key: string, data: T): boolean

    /**
     * Adds a number to a property data in database.
     * @param {string} key The key in database.
     * @param {number} value Any number to add.
     * @returns {boolean} If added successfully: true; else: false
     */
    public add(key: string, value: number): boolean

    /**
     * Subtracts a number from a property data in database.
     * @param {string} key The key in database.
     * @param {number} value Any number to subtract.
     * @returns {boolean} If set successfully: true; else: false
     */
    public subtract(key: string, value: number): boolean

    /**
    * Fetches the data from storage file.
    * @param {string} key The key in database.
    * @returns Value from the specified key or 'false' if failed to read or 'null' if nothing found.
    */
    public fetch<T = any>(key: string): T

    /**
    * Fetches the data from storage file.
    * 
    * This method is an alias for the `DatabaseManager.fetch()` method.
    * @param {string} key The key in database.
    * @returns Value from the specified key or 'false' if failed to read or 'null' if nothing found.
    */
    public find<T = any>(key: string): T

    /**
    * Removes the property from the existing object in database.
    * @param {string} key The key in database.
    * @returns If cleared: true; else: false.
    */
    public remove(key: string): boolean

    /**
    * Removes the property from the existing object in database.
    * 
    * This method is an alias for `DatabaseManager.remove()` method.
    * @param {string} key The key in database.
    * @returns If cleared: true; else: false.
    */
    public delete(key: string): boolean

    /**
     * Pushes a value to a specified array from the database.
     * @param {string} key The key in database.
     * @param {T} value The key in database.
     * @returns {boolean} If cleared: true; else: false.
     */
    public push<T = any>(key: string, value: T): boolean

    /**
    * Removes an element from a specified array in the database.
    * @param {string} key The key in database.
    * @param {number} index The index in the array.
    * @returns {boolean} If cleared: true; else: false.
    */
    public pop(key: string, index: number): boolean

    /**
     * Removes an element from a specified array in the database.
     * 
     * This method is an alias for `DatabaseManager.pop()` method.
     * @param {string} key The key in database.
     * @param {number} index The index in the array.
     * @returns {boolean} If cleared: true; else: false.
     */
    public removeElement(key: string, index: number): boolean

    /**
    * Changes the specified element's value in a specified array in the database.
    * @param {string} key The key in database.
    * @param {number} index The index in the array.
    * @param {T} newValue The new value to set.
    * @returns {boolean} If cleared: true; else: false.
    */
    public pull<T = any>(key: string, index: number, newValue: T): boolean

    /**
    * Changes the specified element's value in a specified array in the database.
    * 
    * This method is an alias for `DatabaseManager.pull()` method.
    * @param {string} key The key in database.
    * @param {number} index The index in the array.
    * @param {T} newValue The new value to set.
    * @returns {boolean} If cleared: true; else: false.
    */
    public changeElement<T>(key: string, index: number, newValue: T): boolean

    /**
     * Clears the whole database.
     * @returns {boolean} If cleared: true; else: false.
     */
    public deleteAll(): boolean

    /**
     * Clears the whole database.
     * 
     * This method is an alias for `DatabaseManager.deleteAll()` method.
     * @returns {boolean} If cleared: true; else: false.
     */
    public clear(): boolean


    /**
    * Checks if the element is existing in database.
    * @param {string} key The key in database.
    * @returns {boolean} If existing: true; else: false.
    */
    public has(key: string): boolean

    /**
     * Checks if the element is existing in database.
     * 
     * This method is an alias for `DatabaseManager.has()` method.
     * @param {string} key The key in database.
     * @returns {boolean} If existing: true; else: false.
     */
    public includes(key: string): boolean

    /**
    * Fetches the entire database.
    * @returns {EconomyDatabase} Tbase contents
    */
    public all(): EconomyDatabase
}

export = DatabaseManager