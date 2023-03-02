import Mongo from 'quick-mongo-super'

import {
    DatabaseEvents,
    MongoLatencyData,
    DatabaseObject
} from 'quick-mongo-super/typings/interfaces/QuickMongo'

import EconomyDatabase from '../interfaces/EconomyDatabase'
import EconomyConfiguration from '../interfaces/EconomyConfiguration'


/**
 * Tbase manager methods class.
 */
declare class DatabaseManager {
    public _mongo: Mongo

    public constructor(options: EconomyConfiguration, mongo: Mongo)

    /**
    * Gets a list of keys in database.
    * @param {string} key The key in database.
    * @returns An array with all keys in database or 'null' if nothing found.
    */
    public keysList(key: string): Promise<string[]>

    /**
    * Sets data in a property in database.
    * @param {string} key The key in database.
    * @param {T} data Any data to set in property.
    * @returns If set successfully: true; else: false
    */
    public set<T = any>(key: string, data: T): Promise<boolean>

    /**
     * Adds a number to a property data in database.
     * @param {string} key The key in database.
     * @param {number} value Any number to add.
     * @returns {Promise<boolean>} If added successfully: true; else: false
     */
    public add(key: string, value: number): Promise<boolean>

    /**
     * Subtracts a number from a property data in database.
     * @param {string} key The key in database.
     * @param {number} value Any number to subtract.
     * @returns {Promise<boolean>} If set successfully: true; else: false
     */
    public subtract(key: string, value: number): Promise<boolean>

    /**
    * Fetches the data from storage file.
    * @param {string} key The key in database.
    * @returns Value from the specified key or 'false' if failed to read or 'null' if nothing found.
    */
    public fetch<T = any>(key: string): Promise<T>

    /**
    * Fetches the data from storage file.
    * 
    * This method is an alias for the `DatabaseManager.fetch()` method.
    * @param {string} key The key in database.
    * @returns Value from the specified key or 'false' if failed to read or 'null' if nothing found.
    */
    public find<T = any>(key: string): Promise<T>

    /**
    * Removes the property from the existing object in database.
    * @param {string} key The key in database.
    * @returns If cleared: true; else: false.
    */
    public remove(key: string): Promise<boolean>

    /**
    * Removes the property from the existing object in database.
    * 
    * This method is an alias for `DatabaseManager.remove()` method.
    * @param {string} key The key in database.
    * @returns If cleared: true; else: false.
    */
    public delete(key: string): Promise<boolean>

    /**
     * Pushes a value to a specified array from the database.
     * @param {string} key The key in database.
     * @param {T} value The key in database.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    public push<T = any>(key: string, value: T): Promise<boolean>

    /**
     * Removes an element from a specified array in the database.
     * @param {string} key The key in database.
     * @param {number} index The index in the array.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    public pop(key: string, index: number): Promise<boolean>

    /**
     * Removes an element from a specified array in the database.
     * 
     * This method is an alias for `DatabaseManager.pop()` method.
     * @param {string} key The key in database.
     * @param {number} index The index in the array.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    public removeElement(key: string, index: number): Promise<boolean>

    /**
    * Changes the specified element's value in a specified array in the database.
    * @param {string} key The key in database.
    * @param {number} index The index in the array.
    * @param {T} newValue The new value to set.
    * @returns {Promise<boolean>} If cleared: true; else: false.
    */
    public pull<T = any>(key: string, index: number, newValue: T): Promise<boolean>

    /**
    * Changes the specified element's value in a specified array in the database.
    * 
    * This method is an alias for `DatabaseManager.pull()` method.
    * @param {string} key The key in database.
    * @param {number} index The index in the array.
    * @param {T} newValue The new value to set.
    * @returns {Promise<boolean>} If cleared: true; else: false.
    */
    public changeElement<T>(key: string, index: number, newValue: T): Promise<boolean>

    /**
     * Clears the whole database.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    public deleteAll(): Promise<boolean>

    /**
     * Clears the whole database.
     * 
     * This method is an alias for `DatabaseManager.deleteAll()` method.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    public clear(): Promise<boolean>

    /**
    * Checks if the element is existing in database.
    * @param {string} key The key in database.
    * @returns {Promise<boolean>} If existing: true; else: false.
    */
    public has(key: string): Promise<boolean>

    /**
     * Checks if the element is existing in database.
     * 
     * This method is an alias for `DatabaseManager.has()` method.
     * @param {string} key The key in database.
     * @returns {Promise<boolean>} If existing: true; else: false.
     */
    public includes(key: string): Promise<boolean>

    /**
    * Fetches the entire database.
    * @returns {Promise<EconomyDatabase>} Tbase contents
    */
    public all(): Promise<EconomyDatabase>


    /**
     * Fetches the raw content of database.
     * @returns {Promise<DatabaseObject[]>} Database contents
     */
    public raw(): Promise<DatabaseObject[]>

    /**
     * Sends a read, write and delete requests to the database and returns the request latencies.
     * @returns {Promise<MongoLatencyData>} Database latency object.
     */
    public ping(): Promise<MongoLatencyData>

    /**
     * Connects to the database.
     * @returns {Promise<boolean>} If connected - MongoDB collection will be returned.
     */
    public connect(): Promise<boolean>

    /**
     * Closes the connection.
     * @returns {Promise<boolean>} If closed, true will be returned.
     */
    public disconnect(): Promise<boolean>

    /**
    * Listens to the event.
    * @param {keyof DatabaseEvents} event Event name.
    * @param {(...args: DatabaseEvents[K][]) => void} listener Listener function.
    */
    public on<K extends keyof DatabaseEvents>(event: K, listener: (...args: DatabaseEvents[K][]) => void): this

    /**
     * Listens to the event only for once.
     * @param {keyof DatabaseEvents} event Event name.
     * @param {(...args: DatabaseEvents[K][]) => void} listener Listener function.
     */
    public once<K extends keyof DatabaseEvents>(event: K, listener: (...args: DatabaseEvents[K][]) => void): this

    /**
     * Emits the event.
     * @param {keyof DatabaseEvents} event Event name.
     * @param {DatabaseEvents[K][]} args Listener arguments.
     */
    public emit<K extends keyof DatabaseEvents>(event: K, ...args: DatabaseEvents[K][]): boolean
}

export = DatabaseManager