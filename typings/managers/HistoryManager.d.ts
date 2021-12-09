import EconomyOptions from '../interfaces/EconomyOptions'
import HistoryData from '../interfaces/HistoryData'

/**
* History manager methods object.
*/
declare class HistoryManager {
    constructor(options: EconomyOptions)
    /**
     * Shows the user's purchase history.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {HistoryData[]} User's purchase history.
     */
    public fetch(memberID: string, guildID: string): HistoryData[]

    /**
    * Clears the user's purchases history.
    * @param {String} memberID Member ID.
    * @param {String} guildID Guild ID.
    * @returns {Boolean} If cleared: true, else: false.
    */
    public clear(memberID: string, guildID: string): boolean
    
    /**
     * Adds the item from the shop to the purchases history.
     * @param {String | Number} itemID Item ID or name.
     * @param {String} memberID Member ID.
     * @param {String} guildID Guild ID.
     * @returns {Boolean} If added: true, else: false.
     */
    public add(itemID: string | number, memberID: string, guildID: string): boolean

    /**
     * Removes the specified item from history.
     * @param {String | Number} id History item ID.
     * @param {String} memberID Member ID.
     * @param {String} guildID Guild ID.
     * @returns {Boolean} If removed: true, else: false.
     */
    public remove(id: string | number, memberID: string, guildID: string): boolean

    /**
     * Searches for the specified item from history.
     * @param {String | Number} id History item ID.
     * @param {String} memberID Member ID.
     * @param {String} guildID Guild ID.
     * @returns {HistoryData} If removed: true, else: false.
     */
    public find(id: string | number, memberID: string, guildID: string): HistoryData

    /**
     * Searches for the specified item from history.
     * 
     * This method is an alias for the `HistoryManager.find()` method.
     * @param {String | Number} id History item ID.
     * @param {String} memberID Member ID.
     * @param {String} guildID Guild ID.
     * @returns {HistoryData} If removed: true, else: false.
     */
    public search(id: string | number, memberID: string, guildID: string): HistoryData
}

export = HistoryManager