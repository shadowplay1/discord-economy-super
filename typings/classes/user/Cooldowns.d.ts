import RewardCooldownData from '../../interfaces/RewardCooldownData'
import { RewardType } from '../../interfaces/RewardTypes'

import RawEconomyUser from '../../interfaces/RawEconomyUser'
import EconomyConfiguration from '../../interfaces/EconomyConfiguration'
import DatabaseManager from '../../managers/DatabaseManager'


declare class Cooldowns {

    /**
     * Cooldowns class.
     * @param {RawEconomyUser} userObject User object from database.
     * @param {EconomyConfiguration} options Economy configuration.
     * @param {DatabaseManager} database Database Manager.
     */
    public constructor(
        userObject: RawEconomyUser,
        options: EconomyConfiguration,
        database: DatabaseManager
    )

    /**
     * Returns the cooldown of the specified type.
     * @param type Cooldown type.
     * @returns Cooldown object.
     */
    public getCooldown(type: RewardType): RewardCooldownData

    /**
     * Gets a user's daily cooldown.
     * @returns User's daily cooldown object.
     */
    public getDaily(): RewardCooldownData

    /**
     * Gets a user's work cooldown.
     * @returns User's work cooldown object.
     */
    public getWork(): RewardCooldownData

    /**
     * Gets a user's weekly cooldown.
     * @returns User's weekly cooldown object.
     */
    public getWeekly(): RewardCooldownData

    /**
     * Gets all user's cooldowns
     * @returns User's cooldowns object.
     */
    public getAll(): Record<'daily' | 'work' | 'weekly', RewardCooldownData>
}

export = Cooldowns