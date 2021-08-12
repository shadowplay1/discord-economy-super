import DailyObject from '../interfaces/DailyObject'
import WeeklyObject from '../interfaces/WeeklyObject'
import WorkObject from '../interfaces/WorkObject'

/**
 * Reward manager methods object.
 */
declare class RewardManager {
    /**
    * Adds a daily reward on user's balance
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @param {string} reason The reason why the money was added. Default: 'claimed the daily reward'
    * @returns Daily money amount or time before next claim
    */
    public daily(memberID: string, guildID: string, reason?: string): DailyObject

    /**
    * Adds a work reward on user's balance
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @param {string} reason The reason why the money was added. Default: 'claimed the work reward'
    * @returns Work money amount or time before next claim
    */
    public work(memberID: string, guildID: string, reason?: string): WorkObject

    /**
    * Adds a weekly reward on user's balance
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @param {string} reason The reason why the money was added. Default: 'claimed the weekly reward'
    * @returns Weekly money amount or time before next claim
    */
    public weekly(memberID: string, guildID: string, reason?: string): WeeklyObject
}

export = RewardManager