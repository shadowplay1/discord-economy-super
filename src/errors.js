module.exports = {
    notReady: 'The module is not ready to work.',
    invalidTypes: {
        memberID: 'memberID must be a string. Received type: ',
        guildID: 'guildID must be a string. Received type: ',
        amount: 'amount must be a number. Received type: ',
        addItemOptions: {
            itemName: 'options.itemName must be a string. Received type: ',
            price: 'options.price must be a number. Received type: ',
            message: 'options.message must be a string. Received type: ',
            description: 'options.description must be a string. Received type: ',
            maxAmount: 'options.maxAmount must be a number. Received type: ',
            role: 'options.role must be a string. Received type: '
        },
        editItemArgs: {
            itemID: 'itemID must be a string or a number. Received type: ',
            arg: `arg parameter must be one of these values: ${['description', 'price', 'itemName', 'message', 'maxAmount', 'role'].map(x => `'${x}'`).join(', ')}. Received: `,
            noValue: 'no value specified. Received: '
        },
        constructorOptions: {
            options: 'options must be type of object. Received: ',
            updaterType: 'options.updater must be type of object. Received: ',
            errorHandlerType: 'options.errorHandler must be type of object. Received: ',
            storatePath: 'options.storagePath must be type of string. Received type: ',
            dailyCooldown: 'options.dailyCooldown must be type of number. Received type: ',
            dailyAmount: 'options.dailyAmount must be type of number. Received type: ',
            workCooldown: 'options.workCooldown must be type of number. Received type: ',
            workAmount: 'options.workAmount must be type of number or array. Received type: ',
            updateCountdown: 'options.updateCountdown must be type of number. Received type: ',
            errorHandler: {
                handleErrors: 'options.errorHandler.handleErrors must be type of boolean. Received type: ',
                attempts: 'options.errorHandler.attempts must be type of number. Received type: ',
                time: 'options.errorHandler.time must be type of number. Received type: '
            },
            updater: {
                checkUpdates: 'options.updater.checkUpdates must be type of boolean. Received type: ',
                upToDateMessage: 'options.updater.upToDateMessage must be type of boolean. Received type: '
            }
        }
    },
    workAmount: {
        tooManyElements: 'options.workAmount array cannot have more than 2 elements; it must have min and max values as first and second element of the array (example: [10, 20]).'
    },
    noClient: 'You need to specify your bot client to use this.',
    roleNotFound: 'Could not find a role with ID ',
    oldNodeVersion: 'This module is supporting only Node.js v14 or newer. Installed version is ',
    invalidStorage: 'Storage file is not valid.',
    wrongStorageData: 'Storage file contains wrong data.',
    emptyServerDatabase: 'Cannot generate a leaderboard: the server database is empty.',
}