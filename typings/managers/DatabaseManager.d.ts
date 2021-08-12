/**
 * Database manager methods object.
 */
declare class DatabaseManager {
    /**
    * Gets a list of keys in database.
    * @returns An array with all keys in database or 'null' if nothing found.
    */
    public keysList(key: string): Array<string>

    /**
    * Sets data in a property in database.
    * @param {string} key The key in database.
    * @param {any} data Any data to set in property.
    * @returns If set successfully: true; else: false
    */
    public set(key: string, data: any): boolean

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
    public fetch(key: string): any | false

    /**
    * Removes the property from the existing object in database.
    * @param {string} key The key in database.
    * @returns If cleared: true; else: false.
    */
    public remove(key: string): boolean

    /**
    * Fetches the entire database.
    * @returns {object} Database contents
    */
    public all(): object
}

export = DatabaseManager