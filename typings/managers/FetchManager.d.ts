import ItemData from '../interfaces/ItemData';
import CooldownData from '../interfaces/CooldownData';
import HistoryData from '../interfaces/HistoryData';
import InventoryData from '../interfaces/InventoryData';

import Emitter from '../classes/Emitter';

/**
* Fetch manager methods class.
* @extends {Emitter}
*/
declare class FetchManager extends Emitter {
    /**
    * Fetches the entire database.
    * @returns {Object} Database contents
    */
    public fetchAll(): Object

    /**
     * Shows all items in the shop.
     * @param {String} guildID Guild ID
     * @returns {Array<ItemData>} The shop array.
     */
    public fetchShop(guildID: string): Array<ItemData>

    /**
     * Fetches the user's cooldowns.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {CooldownData} User's bank balance
     */
    public fetchCooldowns(memberID: string, guildID: string): CooldownData

    /**
     * Fetches the user's purchases history.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {HistoryData} User's bank balance
     */
    public fetchHistory(memberID: string, guildID: string): HistoryData

    /**
     * Fetches the user's inventory.
     * @param {String} memberID Member ID
     * @param {String} guildID Guild ID
     * @returns {InventoryData} User's bank balance
     */
    public fetchInventory(memberID: string, guildID: string): InventoryData

    /**
    * Fetches the user's bank balance.
    * @param {String} memberID Member ID
    * @param {String} guildID Guild ID
    * @returns {Number} User's bank balance
    */
    public fetchBank(memberID: string, guildID: string): number

    /**
    * Fetches the user's balance.
    * @param {String} memberID Member ID
    * @param {String} guildID Guild ID
    * @returns {Number} User's balance
    */
    public fetchBalance(memberID: string, guildID: string): number
}

export = FetchManager