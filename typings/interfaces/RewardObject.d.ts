import If from './If'

import RewardCooldownData from './RewardCooldownData'
import { Reward, RewardType } from '../interfaces/RewardTypes'


/**
 * Reward object.
 */
declare interface RewardObject<RewardArray extends boolean = boolean, RewardObjectType extends RewardType = RewardType.DAILY> {

    /**
     * Type of the reward.
     */
    type: Reward<RewardObjectType>

    /**
     * Whether the reward was claimed.
     */
    claimed: boolean

    /**
     * Cooldown object.
     */
    cooldown: RewardCooldownData

    /**
     * Amount of money that the user received.
     */
    reward: number

    /**
     * Reward that was specified in a module configuration.
     */
    defaultReward: If<RewardArray, [number, number], number>
}   

export = RewardObject
