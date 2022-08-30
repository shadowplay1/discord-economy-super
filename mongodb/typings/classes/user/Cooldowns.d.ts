import RewardCooldownData from '../../interfaces/RewardCooldownData'
import { RewardType } from '../../interfaces/RewardTypes'

import RawEconomyUser from '../../interfaces/RawEconomyUser'
import EconomyOptions from '../../interfaces/EconomyOptions'
import DatabaseManager from '../../managers/DatabaseManager'


declare class Cooldowns {

    /**
     * Cooldowns class.
     * @param userObject User object from database.
     */
    public constructor(userObject: RawEconomyUser, options: EconomyOptions, database: DatabaseManager)

    /**
     * Returns the cooldown of the specified type.
     * @param type Cooldown type.
     * @returns Cooldown object.
     */
    public getCooldown(type: RewardType): Promise<RewardCooldownData>

    /**
     * Gets a user's daily cooldown.
     * @returns User's daily cooldown object.
     */
    public getDaily(): Promise<RewardCooldownData>

    /**
     * Gets a user's work cooldown.
     * @returns User's work cooldown object.
     */
    public getWork(): Promise<RewardCooldownData>

    /**
     * Gets a user's weekly cooldown.
     * @returns User's weekly cooldown object.
     */
    public getWeekly(): Promise<RewardCooldownData>

    /**
     * Gets all user's cooldowns
     * @returns User's cooldowns object.
     */
    public getAll(): Promise<Record<'daily' | 'work' | 'weekly', RewardCooldownData>>
}

export = Cooldowns