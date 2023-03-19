import TimeObject from './TimeObject'

declare interface RewardCooldownData {

    /**
     * A time object with the remaining time until the cooldown ends.
     */
    time: TimeObject

    /**
     * A formatted string with the remaining time until the cooldown ends.
     */
    pretty: string

	/**
	 * Cooldown end timestamp.
	 */
	endTimestamp: number
}

export = RewardCooldownData
