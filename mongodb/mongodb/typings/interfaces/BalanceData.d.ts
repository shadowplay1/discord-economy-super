import BalanceOperation from './BalanceOperation'
import BalanceOperations from './BalanceOperations'

/**
 * Balance info object for balance events.
 */
declare interface BalanceData<T extends BalanceOperations> {

    /**
     * Type of operation.
     */
    type: BalanceOperation<T>;

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