/**
* Bank balance item class.
*/
class BankBalanceItem {

    /**
     * User bank balance class.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} ecoOptions Economy configuration.
     * @param {BankBalanceObject} bankBalanceObject User bank balance object.
     */
    constructor(guildID, memberID, ecoOptions, bankBalanceObject) {

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
         * User bank balance object.
         * @type {number}
         */
        this.balance = bankBalanceObject.balance || 0
    }
}


/**
 * Bank balance object.
 * @typedef {Object} BankBalanceObject
 * @property {number} balance User's bank balance.
 */

module.exports = BankBalanceItem
