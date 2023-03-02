import EconomyConfiguration from '../interfaces/EconomyConfiguration'
import DatabaseManager from '../managers/DatabaseManager'


/**
* User balance item class.
*/
declare class BalanceItem {

    /**
     * User balance item class.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} ecoOptions Economy configuration.
     * @param {BalanceObject} balanceObject User balance object.
     * @param {DatabaseManager} database Database manager.
     */
    public constructor(
        guildID: string,
		memberID: string,
        ecoOptions: EconomyConfiguration,
        balanceObject: {
            money: number
            bank: number
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
     * User's balance.
     * @type {number}
     */
    public money: number

    /**
     * User's bank balance.
     * @type {number}
     */
    public bank: number
}

export = BalanceItem
