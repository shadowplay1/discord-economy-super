declare interface SettingsTypes {

    /**
     * Amount of money for Daily Reward. Default: 100.
     */
    dailyAmount: number | [number, number]

    /**
     * Cooldown for Daily Command (in ms). Default: 24 hours (60000 * 60 * 24 ms)
     */
    dailyCooldown: number

    /**
     * Amount of money for Work Reward. Default: [10, 50].
     */
    workAmount: number | [number, number]

    /**
     * Cooldown for Work Command (in ms). Default: 1 hour (60000 * 60 ms)
     */
    workCooldown: number

    /**
     * Amount of money for Weekly Reward. Default: 1000.
     */
    weeklyAmount: number | [number, number]

    /**
     * Amount of money for Monthly Reward. Default: 10000.
     */
    monthlyAmount: number | [number, number]

    /**
     * Cooldown for Monthly Reward (in ms). Default: 1 month (2629746000 ms).
     */
    monthlyCooldown: number | [number, number]

    /**
     * Amount of money for Monthly Reward. Default: 10000.
     */
    hourlyAmount: number | [number, number]

    /**
     * Cooldown for Hourly Reward (in ms). Default: 1 hour (3600000 ms).
     */
    hourlyCooldown: number | [number, number]

    /**
     * Cooldown for Weekly Command (in ms). Default: 7 days (60000 * 60 * 24 * 7 ms)
     */
    weeklyCooldown: number

    /**
     * The region (example: 'ru' or 'en') to format the date and time. Default: 'en'
     */
    dateLocale: string

    /**
     * If true, when someone buys the item, their balance will subtract by item price. Default: false.
     */
    subtractOnBuy: boolean

    /**
     * If true, the module will save all the purchases history. Default: true.
     */
    savePurchasesHistory: boolean
}

export = SettingsTypes
