/**
 * Paying options.
 */
interface PayingOptions {
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
    recipientMemberID: string


    /**
     * The reason of subtracting the money from sender. (example: "sending money to {'user}")
     */
    sendingReason?: string | 'sending money to user'

    /**
     * The reason of subtracting the money from sender. (example: "receiving money from {user}")
     */
    receivingReason?: string | 'receiving money from user'
}

export = PayingOptions