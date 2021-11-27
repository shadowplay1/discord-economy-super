/**
 * Cooldown data object.
 */
declare class CooldownData {
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

export = CooldownData