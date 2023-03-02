/**
 * Cooldown data object.
 */
declare interface UserCooldownData {

    /**
     * User's daily cooldown.
     */
    dailyCooldown: number

    /**
     * User's work cooldown.
     */
    workCooldown: number

    /**
     * User's weekly cooldown.
     */
    weeklyCooldown: number
}

export = UserCooldownData