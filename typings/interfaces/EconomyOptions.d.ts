import CheckerOptions from './CheckerOptions';
import ErrorHandlerOptions from './ErrorHandlerOptions'
import UpdaterOptions from './UpdaterOptions'

/**
 * Constructor options object.
 */
declare class EconomyOptions {
    /**
     * Full path to a JSON file. Default: './storage.json'.
     */
    storagePath?: string;

    /**
     * Checks the if database file exists and if it has errors. Default: true.
     */
    checkStorage?: boolean

    /**
     * Cooldown for Daily Command (in ms). Default: 24 Hours (60000 * 60 * 24) ms
     */
    dailyCooldown?: number;

    /**
     * Cooldown for Work Command (in ms). Default: 1 Hour (60000 * 60) ms
     */
    workCooldown?: number;

    /**
     * Cooldown for Weekly Command (in ms). Default: 7 Days (60000 * 60 * 24 * 7) ms
     */
    weeklyCooldown?: number;

    /**
     * Amount of money for Daily Command. Default: 100.
     */
    dailyAmount?: number;

    /**
     * Amount of money for Work Command. Default: [10, 50].
     */
    workAmount?: number | Number[];

    /**
     * If true, when someone buys the item, their balance will subtract by item price.
     */
    subtractOnBuy?: boolean;

    /**
     * Amount of money for Weekly Command. Default: 1000.
     */
    weeklyAmount?: number;
    /**
     * Checks for if storage file exists in specified time (in ms). Default: 1000.
     */
    updateCooldown?: number;

    /**
     * The region (example: 'ru'; 'en') to format date and time. Default: 'ru'.
     */
    dateLocale?: string;

    /**
    * Update Checker options object.
    */
    updater?: UpdaterOptions;

    /**
    * Error Handler options object.
    */
    errorHandler?: ErrorHandlerOptions;

    /**
     * Options object for an 'Economy.utils.checkOptions' method.
     */
    optionsChecker?: CheckerOptions;
}

export = EconomyOptions