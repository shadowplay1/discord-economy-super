/**
 * Transfering options.
 */
interface TransferingOptions {

    /**
     * Amount of money to send.
     */
    amount: number

    /**
     * A member ID who will send the money.
     */
    senderMemberID: string

    /**
     * A member ID who will receive the money.
     */
    receiverMemberID: string


    /**
     * The reason of subtracting the money from sender. (example: "sending money to {user}")
     */
    sendingReason?: string

    /**
     * The reason of subtracting the money from sender. (example: "receiving money from {user}")
     */
    receivingReason?: string
}

export = TransferingOptions