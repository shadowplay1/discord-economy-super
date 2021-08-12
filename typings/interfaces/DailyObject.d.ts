import TimeObject from './TimeObject'

/**
 * Object that returns on 'Economy.daily()' method.
 */
declare class DailyObject {
    /**
     * The status of receiving money.
     */
    status: boolean

    /**
     * If reward is already claimed: time object; else: daily reward.
     */
    value: TimeObject

    /**
     * If reward is already claimed: formatted time in string; else: daily reward.
     */
    pretty: string | number
    
    /**
     * Daily reward.
     */
    reward: number
}

export = DailyObject