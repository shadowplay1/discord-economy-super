import TimeObject from './TimeObject'

/**
 * Object that returns on 'Economy.weekly()' method.
 */
declare class WeeklyObject {
    /**
     * The status of receiving money.
     */
    status: Boolean

    /**
     * If reward is already claimed: time object; else: weekly reward.
     */
    value: TimeObject

    /**
     * If reward is already claimed: formatted time in string; else: weekly reward.
     */
    pretty: String | Number

    /**
     * Weekly reward.
     */
    reward: Number
}

export = WeeklyObject