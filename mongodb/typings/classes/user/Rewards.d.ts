import RewardObject from '../../interfaces/RewardObject'
import EconomyOptions from '../../interfaces/EconomyOptions'
import DatabaseManager from '../../managers/DatabaseManager'


declare class Rewards {
    public constructor(memberID: string, guildID: string, options: EconomyOptions, database: DatabaseManager)

    /**
    * Adds a daily reward on user's balance.
    * @param reason The reason why the money was added. Default: 'claimed the daily reward'
    * @returns Reward object information.
    */
    public getDaily<
        isRewardArray extends boolean = false
    >(reason?: string): Promise<RewardObject<isRewardArray, 'daily'>>

    /**
    * Adds a work reward on user's balance.
    * @param reason The reason why the money was added. Default: 'claimed the work reward'
    * @returns Reward object information.
    */
    public getWork<
        isRewardArray extends boolean = true
    >(reason?: string): Promise<RewardObject<isRewardArray, 'work'>>

    /**
    * Adds a weekly reward on user's balance.
    * @param reason The reason why the money was added. Default: 'claimed the weekly reward'
    * @returns Reward object information.
    */
    public getWeekly<
        isRewardArray extends boolean = false
    >(reason?: string): Promise<RewardObject<isRewardArray, 'weekly'>>
}

export = Rewards