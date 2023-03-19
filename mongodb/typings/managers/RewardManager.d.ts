import DatabaseManager from './DatabaseManager'
import CacheManager from './CacheManager'

import RewardObject from '../interfaces/RewardObject'
import EconomyConfiguration from '../interfaces/EconomyConfiguration'

import { RewardType } from '../interfaces/RewardTypes'


/**
 * Reward manager methods class.
 */
declare class RewardManager {
    public constructor(options: EconomyConfiguration, database: DatabaseManager, cache: CacheManager)

    /**
    * Adds a specified reward on user's balance.
    * @param reward Reward to give.
    * @param memberID Member ID.
    * @param guildID Guild ID.
    * @param reason The reason why the money was added.
    * @returns Reward object.
    */
    public receive<
        isRewardArray extends boolean = false
    >(reward: RewardType, memberID: string, guildID: string, reason?: string): Promise<RewardObject<isRewardArray, typeof reward>>

    /**
    * Adds a daily reward on user's balance.
    * @param memberID Member ID.
    * @param guildID Guild ID.
    * @param reason The reason why the money was added. Default: 'claimed the daily reward'.
    * @returns Reward object.
    */
    public getDaily<
        isRewardArray extends boolean = false
    >(memberID: string, guildID: string, reason?: string): Promise<RewardObject<isRewardArray, RewardType.DAILY>>

    /**
    * Adds a work reward on user's balance.
    * @param memberID Member ID.
    * @param guildID Guild ID.
    * @param reason The reason why the money was added. Default: 'claimed the work reward'.
    * @returns Reward object.
    */
    public getWork<
        isRewardArray extends boolean = true
    >(memberID: string, guildID: string, reason?: string): Promise<RewardObject<isRewardArray, RewardType.WORK>>

    /**
    * Adds a weekly reward on user's balance.
    * @param memberID Member ID.
    * @param guildID Guild ID.
    * @param reason The reason why the money was added. Default: 'claimed the weekly reward'.
    * @returns Reward object.
    */
    public getWeekly<
        isRewardArray extends boolean = false
    >(memberID: string, guildID: string, reason?: string): Promise<RewardObject<isRewardArray, RewardType.WEEKLY>>

    /**
    * Adds a monthly reward on user's balance
    * @param {string} memberID Member ID.
    * @param {string} guildID Guild ID.
    * @param {string} [reason] The reason why the money was added. Default: 'claimed the monthly reward'
    * @returns Reward object.
    */
    public getMonthly<
        isRewardArray extends boolean = false
    >(memberID: string, guildID: string, reason?: string): Promise<RewardObject<isRewardArray, RewardType.MONTHLY>>

    /**
    * Adds a hourly reward on user's balance
    * @param {string} memberID Member ID.
    * @param {string} guildID Guild ID.
    * @param {string} [reason] The reason why the money was added. Default: 'claimed the hourly reward'
    * @returns Reward object.
    */
    public getHourly<
        isRewardArray extends boolean = false
    >(memberID: string, guildID: string, reason?: string): Promise<RewardObject<isRewardArray, RewardType.HOURLY>>
}

export = RewardManager