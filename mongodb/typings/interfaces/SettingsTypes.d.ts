declare interface SettingsTypes {
    
    /**
     * Amount of money for Daily Command. Default: 100.
     */
    dailyAmount: number | number[]

    /**
     * Cooldown for Daily Command (in ms). Default: 24 hours (60000 * 60 * 24 ms)
     */
    dailyCooldown: number


    /**
     * Amount of money for Work Command. Default: [10, 50].
     */
    workAmount: number | number[]

    /**
     * Cooldown for Work Command (in ms). Default: 1 hour (60000 * 60 ms)
     */
    workCooldown: number


    /**
     * Amount of money for Weekly Command. Default: 1000.
     */
    weeklyAmount: number | number[]

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