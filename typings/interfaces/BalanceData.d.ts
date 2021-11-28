/**
 * Balance info object for balance events.
 */
declare class BalanceData {
    
    /**
     * The type of operation.
     */
    type: string;

    /**
     * Guild ID.
     */
    guildID: string;

    /**
     * User ID.
     */
    memberID: string;

    /**
     * Amount of money.
     */
    amount: number;
    
    /**
     * User's balance after the operation was completed successfully.
     */
    balance: number;

    /**
     * The reason why the operation was completed.
     */
    reason: string;
}

export = BalanceData