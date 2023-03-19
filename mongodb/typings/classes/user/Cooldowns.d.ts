import DatabaseManager from '../../managers/DatabaseManager'
import CacheManager from '../../managers/CacheManager'

import RewardCooldownData from '../../interfaces/RewardCooldownData'
import { RewardType } from '../../interfaces/RewardTypes'

import RawEconomyUser from '../../interfaces/RawEconomyUser'
import EconomyConfiguration from '../../interfaces/EconomyConfiguration'

declare class Cooldowns {

    /**
     * Cooldowns class.
     * @param userObject User object from database.
     */
    public constructor(
        userObject: RawEconomyUser,
        options: EconomyConfiguration,
        database: DatabaseManager,
        cache: CacheManager
    )

    /**
     * Returns the cooldown of the specified type.
     * @param type Cooldown type.
     * @returns Cooldown object.
     */
    public getCooldown(type: RewardType): Promise<RewardCooldownData>

    /**
     * Gets user's daily cooldown.
     * @returns User's daily cooldown object.
     */
    public getDaily(): Promise<RewardCooldownData>

    /**
     * Gets user's work cooldown.
     * @returns User's work cooldown object.
     */
    public getWork(): Promise<RewardCooldownData>

    /**
     * Gets user's weekly cooldown.
     * @returns User's weekly cooldown object.
     */
    public getWeekly(): Promise<RewardCooldownData>

    /**
     * Gets user's monthly cooldown.
     * @returns User's monthly cooldown object.
     */
    public getMonthly(): Promise<RewardCooldownData>

    /**
     * Gets user's hourly cooldown.
     * @returns User's hourly cooldown object.
     */
    public getHourly(): Promise<RewardCooldownData>

    /**
     * Clears all the user's cooldowns.
     * @returns {Promise<boolean>} If all cooldowns were cleared successfully: true, else: false.
     */
    public clearAll(): Promise<boolean>

    /**
     * Clears user's daily cooldown.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    public clearDaily(): Promise<boolean>

    /**
     * Clears user's work cooldown.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    public clearWork(): Promise<boolean>

    /**
     * Clears user's weekly cooldown.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    public clearWeekly(): Promise<boolean>

    /**
     * Clears user's monthly cooldown.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    public clearMonthly(): Promise<boolean>

    /**
     * Clears user's hourly cooldown.
     * @returns {Promise<boolean>} If cleared: true; else: false.
     */
    public clearHourly(): Promise<boolean>

    /**
     * Gets all user's cooldowns
     * @returns User's cooldowns object.
     */
    public getAll(): Promise<Record<'daily' | 'work' | 'weekly' | 'monthly' | 'hourly', RewardCooldownData>>
}

export = Cooldowns