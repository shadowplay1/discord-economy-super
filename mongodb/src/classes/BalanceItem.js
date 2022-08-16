const BalanceManager = require('../managers/BalanceManager')

const CacheManager = require('../managers/CacheManager')
const DatabaseManager = require('../managers/DatabaseManager')


/**
* Balance item class.
*/
class BalanceItem {

    /**
     * User balance class.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyOptions} ecoOptions Economy configuration.
     * @param {BalanceObject} balanceObject User balance object.
     * @param {DatabaseManager} database Database manager.
     * @param {CacheManager} cache Cache manager.
     */
    constructor(memberID, guildID, ecoOptions, balanceObject, database, cache) {

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
         * User's balance.
         * @type {number}
         */
        this.money = balanceObject.money

        /**
         * User's bank balance.
         * @type {number}
         */
        this.bank = balanceObject.bank

        /**
         * Balance Manager.
         * @type {BalanceManager}
         * @private
         */
        this._balance = new BalanceManager(ecoOptions, database, cache)
    }
}


/**
 * Balance object.
 * @typedef {Object} BalanceObject
 * @property {number} money User's money amount.
 * @property {number} bank User's bank balance.
 */

module.exports = BalanceItem
