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
     * Gets user's daily cooldown.
     * @returns User's daily cooldown object.
     */
    public getDaily(): RewardCooldownData

    /**
     * Gets user's work cooldown.
     * @returns User's work cooldown object.
     */
    public getWork(): RewardCooldownData

    /**
     * Gets user's weekly cooldown.
     * @returns User's weekly cooldown object.
     */
    public getWeekly(): RewardCooldownData

    /**
     * Gets user's monthly cooldown.
     * @returns User's monthly cooldown object.
     */
    public getMonthly(): RewardCooldownData

    /**
     * Gets user's hourly cooldown.
     * @returns User's hourly cooldown object.
     */
    public getHourly(): RewardCooldownData

    /**
     * Clears all the user's cooldowns.
     * @returns {boolean} If all cooldowns were cleared successfully: true, else: false.
     */
    public clearAll(): boolean

    /**
     * Clears user's daily cooldown.
     * @returns {boolean} If cleared: true; else: false.
     */
    public clearDaily(): boolean

    /**
     * Clears user's work cooldown.
     * @returns {boolean} If cleared: true; else: false.
     */
    public clearWork(): boolean

    /**
     * Clears user's weekly cooldown.
     * @returns {boolean} If cleared: true; else: false.
     */
    public clearWeekly(): boolean

    /**
     * Clears user's monthly cooldown.
     * @returns {boolean} If cleared: true; else: false.
     */
    public clearMonthly(): boolean

    /**
     * Clears user's hourly cooldown.
     * @returns {boolean} If cleared: true; else: false.
     */
    public clearHourly(): boolean

    /**
     * Gets all user's cooldowns
     * @returns User's cooldowns object.
     */
    public getAll(): Record<'daily' | 'work' | 'weekly' | 'monthly' | 'hourly', RewardCooldownData>
}

export = Cooldowns