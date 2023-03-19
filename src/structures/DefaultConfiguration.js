const economyConfig = {
    storagePath: './storage.json',

    checkStorage: true,
    updateCountdown: 1000,

    hourlyAmount: 20,
    hourlyCooldown: 3600000,

    dailyAmount: 100,
    dailyCooldown: 86400000,

    workAmount: [10, 50],
    workCooldown: 3600000,

    weeklyAmount: 1000,
    weeklyCooldown: 604800000,

    monthlyAmount: 10000,
    monthlyCooldown: 2629746000,

    sellingItemPercent: 75,

    savePurchasesHistory: true,
    deprecationWarnings: true,

    dateLocale: 'en',
    subtractOnBuy: true,

    updater: {
        checkUpdates: true,
        upToDateMessage: false
    },

    errorHandler: {
        handleErrors: true,
        attempts: 5,
        time: 5000
    },

    optionsChecker: {
        ignoreInvalidTypes: false,
        ignoreUnspecifiedOptions: true,
        ignoreInvalidOptions: false,
        showProblems: true,
        sendLog: true,
        sendSuccessLog: false
    },

    debug: false
}

/**
 * Default Economy configuration.
 * @type {economyConfig}
 */
module.exports = economyConfig
