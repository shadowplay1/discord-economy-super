import RewardObject from '../../interfaces/RewardObject'
import { RewardType } from '../../interfaces/RewardTypes'

import EconomyConfiguration from '../../interfaces/EconomyConfiguration'
import DatabaseManager from '../../managers/DatabaseManager'


declare class Rewards {
    public constructor(memberID: string, guildID: string, options: EconomyConfiguration, database: DatabaseManager)

    /**
    * Adds a specified reward on user's balance
    * @param reward Reward to give.
    * @param reason The reason why the money was added.
    * @returns Reward object.
    */
    public receive<
        isRewardArray extends boolean = false
    >(reward: RewardType, reason?: string): Promise<RewardObject<isRewardArray, typeof reward>>

    /**
    * Adds a daily reward on user's balance.
    * @param reason The reason why the money was added. Default: 'claimed the daily reward'
    * @returns Reward object.
    */
    public getDaily<
        isRewardArray extends boolean = false
    >(reason?: string): Promise<RewardObject<isRewardArray, RewardType.DAILY>>

    /**
    * Adds a work reward on user's balance.
    * @param reason The reason why the money was added. Default: 'claimed the work reward'
    * @returns Reward object.
    */
    public getWork<
        isRewardArray extends boolean = true
    >(reason?: string): Promise<RewardObject<isRewardArray, RewardType.WORK>>

    /**
    * Adds a weekly reward on user's balance.
    * @param reason The reason why the money was added. Default: 'claimed the weekly reward'
    * @returns Reward object.
    */
    public getWeekly<
        isRewardArray extends boolean = false
    >(reason?: string): Promise<RewardObject<isRewardArray, RewardType.WEEKLY>>

    /**
    * Adds a monthly reward on user's balance
    * @param reason The reason why the money was added. Default: 'claimed the monthly reward'
    * @returns Reward object.
    */
    public getMonthly<
        isRewardArray extends boolean = false
    >(memberID: string): Promise<RewardObject<isRewardArray, RewardType.MONTHLY>>

    /**
    * Adds a hourly reward on user's balance
    * @param reason The reason why the money was added. Default: 'claimed the hourly reward'
    * @returns Reward object.
    */
    public getHourly<
        isRewardArray extends boolean = false
    >(reason?: string): Promise<RewardObject<isRewardArray, RewardType.HOURLY>>
}

export = Rewards
