// import { MongoConnectionOptions } from 'quick-mongo-super/typings/interfaces/QuickMongo'

import CheckerConfiguration from './CheckerConfiguration'
import ErrorHandlerConfiguration from './ErrorHandlerConfiguration'
import UpdaterOptions from './UpdaterOptions'


/**
 * Economy configuration.
 */
declare interface EconomyConfiguration {

    /**
     * Full path to a JSON file. Default: './storage.json'.
     */
    storagePath?: string

    /**
     * Checks the if database file exists and if it has errors. Default: true.
     */
    checkStorage?: boolean

    /**
     * How often the module will checck the storage file.
     */
    updateCountdown?: number

    /**
     * Cooldown for Daily Command (in ms). Default: 24 hours (60000 * 60 * 24 ms)
     */
    dailyCooldown?: number

    /**
     * Cooldown for Work Command (in ms). Default: 1 hour (60000 * 60 ms)
     */
    workCooldown?: number

    /**
     * Cooldown for Weekly Command (in ms). Default: 7 days (60000 * 60 * 24 * 7 ms)
     */
    weeklyCooldown?: number

    /**
     * Amount of money for Daily Command. Default: 100.
     */
    dailyAmount?: number | [number, number]

    /**
     * If true, the module will save all the purchases history.
     */
    savePurchasesHistory?: boolean

    /**
     * Amount of money for Work Command. Default: [10, 50].
     */
    workAmount?: number | [number, number]

    /**
     * If true, when someone buys the item, their balance will subtract by item price.
     */
    subtractOnBuy?: boolean

    /**
     * Amount of money for Weekly Command. Default: 1000.
     */
    weeklyAmount?: number | [number, number]

    /**
     * Percent of the item's price it will be sold for. Default: 75.
     */
    sellingItemPercent?: number

    /**
     * If true, the deprecation warnings will be sent in the console.
     */
    deprecationWarnings?: boolean

    /**
     * The region (example: 'ru'; 'en') to format date and time. Default: 'en'.
     */
    dateLocale?: string

    /**
    * Update checker configuration.
    */
    updater?: UpdaterOptions

    /**
    * Error handler configuration.
    */
    errorHandler?: ErrorHandlerConfiguration

    /**
     * Configuration for an 'Economy.utils.checkConfiguration' method.
     */
    optionsChecker?: CheckerConfiguration

    /**
     * Enables or disables the debug mode.
     */
    debug?: boolean
}

export = EconomyConfiguration