import TimeObject from './TimeObject'

/**
 * Object that returns on 'Economy.daily()' method.
 */
declare class DailyObject {
    /**
     * The status of receiving money.
     */
    status: Boolean

    /**
     * If reward is already claimed: time object; else: daily reward.
     */
    value: TimeObject

    /**
     * If reward is already claimed: formatted time in string; else: daily reward.
     */
    pretty: String | Number
    
    /**
     * Daily reward.
     */
    reward: Number
}

export = DailyObject