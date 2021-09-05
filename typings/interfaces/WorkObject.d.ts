import TimeObject from './TimeObject'

/**
 * Object that returns on 'Economy.work()' method.
 */
declare class WorkObject {
    /**
     * The status of receiving money.
     */
    status: boolean

    /**
     * If reward is already claimed: time object; else: work reward.
     */
    value: TimeObject

    /**
     * If reward is already claimed: formatted time in string; else: work reward.
     */
    pretty: string | number

    /**
     * Work reward.
     */
    reward: number | Number[]
}

export = WorkObject