import EconomyOptions from '../interfaces/EconomyOptions'
import DatabaseManager from '../managers/DatabaseManager'


/**
* User bank balance item class.
*/
declare class BankBalanceItem {

    /**
     * User bank balance item class.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyOptions} ecoOptions Economy configuration.
     * @param {BalanceObject} balanceObject User bank balance object.
     * @param {DatabaseManager} database Database manager.
     */
    public constructor(
        memberID: string,
        guildID: string,
        ecoOptions: EconomyOptions,
        balanceObject: {
            balance: number
        },
        database: DatabaseManager
    )

    /**
     * Member ID.
     * @type {string}
     */
    public memberID: string

    /**
     * Guild ID.
     * @type {string}
     */
    public guildID: string

    /**
     * User's bank balance.
     * @type {number}
     */
    public balance: number
}

export = BankBalanceItem
