/**
 * Transfering options.
 */
interface TransferingResult {
    
    /**
     * Operation status.
     */
    success: boolean,
    
    /**
     * Guild ID.
     */
    guildID: string,

    /**
     * New sender balance.
     */
    senderBalance: number,

    /**
     * New receiver balance.
     */
    receiverBalance: number,

    /**
     * Amount of money that was sent.
     */
    amount: number,

    /**
     * Sender member ID.
     */
    senderMemberID: string,

    /**
     * Receiver member ID.
     */
    receiverMemberID: string,

    /**
     * The reason of subtracting the money from sender. (example: "sending money to {user}")
     */
    sendingReason: string,

    /**
     * The reason of adding the money to receiver. (example: "receiving money from {user}")
     */
    receivingReason: string,
}

export = TransferingResult