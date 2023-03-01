/**
 * @type {import("./typings/interfaces/EconomyConfiguration")}
 */
// module.exports 


import EconomyConfiguration from '../typings/interfaces/EconomyConfiguration'

const options: EconomyConfiguration = {
    storagePath: './eco.json',

    debug: true,
    dailyAmount: 1000000,

    updater: {
        checkUpdates: false
    },

    optionsChecker: {
        ignoreInvalidOptions: false,
        showProblems: true,
        sendLog: true,
        sendSuccessLog: true
    }
}

export = options
