import TimeObject from './TimeObject'

/**
 * Object that returns on 'Economy.weekly()' method.
 */
declare class WeeklyObject {
    /**
     * The status of receiving money.
     */
    status: boolean

    /**
     * If reward is already claimed: time object; else: weekly reward.
     */
    value: TimeObject

    /**
     * If reward is already claimed: formatted time in string; else: weekly reward.
     */
    pretty: string | number

    /**
     * Weekly reward.
     */
    reward: number
}

export = WeeklyObject