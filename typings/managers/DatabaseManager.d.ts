import EconomyOptions from '../interfaces/EconomyOptions'

/**
 * Database manager methods object.
 */
declare class DatabaseManager {
    constructor(options: EconomyOptions)

    /**
    * Gets a list of keys in database.
    * @param {string} key The key in database.
    * @returns An array with all keys in database or 'null' if nothing found.
    */
    public keysList(key: string): string[]

    /**
    * Sets data in a property in database.
    * @param {string} key The key in database.
    * @param {any} data Any data to set in property.
    * @returns If set successfully: true; else: false
    */
    public set<Data>(key: string, data: Data): boolean

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
    public fetch<Data>(key: string): Data | null

    /**
    * Removes the property from the existing object in database.
    * @param {string} key The key in database.
    * @returns If cleared: true; else: false.
    */
    public remove(key: string): boolean

    /**
     * Pushes a value to a specified array from the database.
     * @param {String} key The key in database.
     * @param {any} value The key in database.
     * @returns {Boolean} If cleared: true; else: false.
     */
    public push<Data>(key: string, value: Data): boolean

    /**
     * Removes an element from a specified array in the database.
     * @param {String} key The key in database.
     * @param {Number} index The index in the array.
     * @returns {Boolean} If cleared: true; else: false.
     */
    public removeElement(key: string, index: number): boolean

    /**
    * Changes the specified element's value in a specified array in the database.
    * @param {String} key The key in database.
    * @param {Number} index The index in the array.
    * @param {any} newValue The new value to set.
    * @returns {Boolean} If cleared: true; else: false.
    */
    public changeElement<Data>(key: string, index: number, newValue: Data): boolean
    
    /**
    * Fetches the entire database.
    * @returns {object} Database contents
    */
    public all(): object
}

export = DatabaseManager