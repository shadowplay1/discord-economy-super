/**
 * Database manager methods object.
 */
declare class DatabaseManager {
    /**
    * Gets a list of keys in database.
    * @returns An array with all keys in database or 'null' if nothing found.
    */
    public keysList(key: String): Array<String>

    /**
    * Sets data in a property in database.
    * @param {String} key The key in database.
    * @param {any} data Any data to set in property.
    * @returns If set successfully: true; else: false
    */
    public set(key: String, data: any): Boolean

    /**
     * Adds a number to a property data in database.
     * @param {String} key The key in database.
     * @param {Number} value Any number to add.
     * @returns {Boolean} If added successfully: true; else: false
     */
    public add(key: String, value: Number): Boolean

    /**
     * Subtracts a number from a property data in database.
     * @param {String} key The key in database.
     * @param {Number} value Any number to subtract.
     * @returns {Boolean} If set successfully: true; else: false
     */
    public subtract(key: String, value: Number): Boolean

    /**
    * Fetches the data from storage file.
    * @param {String} key The key in database.
    * @returns Value from the specified key or 'false' if failed to read or 'null' if nothing found.
    */
    public fetch(key: String): any | false

    /**
    * Removes the property from the existing object in database.
    * @param {String} key The key in database.
    * @returns If cleared: true; else: false.
    */
    public remove(key: String): Boolean

    /**
    * Fetches the entire database.
    * @returns {Object} Database contents
    */
    public all(): Object
}

export = DatabaseManager