const settingsArray = [
    'dailyAmount',
    'dailyCooldown',

    'workAmount',
    'workCooldown',

    'weeklyAmount',
    'weeklyCooldown',

    'dateLocale',
    'subtractOnBuy'
]

module.exports = {
    notReady: 'The module is not ready to work.',

    invalidTypes: {
        memberID: 'memberID must be a string. Received type: ',
        guildID: 'guildID must be a string. Received type: ',
        amount: 'amount must be a number. Received type: ',
        value: 'value must be specified. Received: ',

        addItemOptions: {
            itemName: 'options.itemName must be a string. Received type: ',
            price: 'options.price must be a number. Received type: ',
            message: 'options.message must be a string. Received type: ',
            description: 'options.description must be a string. Received type: ',
            maxAmount: 'options.maxAmount must be a number. Received type: ',
            role: 'options.role must be a string. Received type: '
        },

        editItemArgs: {
            itemID: 'itemID is not a string or a number. Received type: ',
            arg: `'arg' parameter must be one of these values: ${['description', 'price', 'itemName', 'message', 'maxAmount', 'role'].map(x => `'${x}'`).join(', ')}. Received: `,
            noValue: 'no value specified. Received: '
        },
    },

    workAmount: {
        tooManyElements: 'options.workAmount array cannot have more than 2 elements; it must have min and max values as first and second element of the array (example: [10, 20]).',
    },

    databaseManager: {
        invalidTypes: {
            key: 'Key must be a string. Received type: ',
            target: {
                number: 'Target is not a number. Received type: ',
                array: 'Target is not an array. Received type: '
            },
            value: {
                number: 'Value is not a number. Received type: ',
                array: 'Value is not an array. Received type: '
            }
        }
    },

    settingsManager: {
        invalidKey: `You have specified the incorrect settings key. It must be one of the following values:\n${settingsArray.map(x => `'${x}'`).join(', ')}.\nReceived: `,

        valueNotFound(setting, value) {
            return `Cannot find the value "${value}" in a setting "${setting}".`
        },

        invalidType(key, type, received) {
            return `${key} must be a ${type}. Received type: ${received}`
        }
    },

    noClient: 'You need to specify your bot client to give roles to members.',
    roleNotFound: 'Could not find a role with ID ',

    oldNodeVersion: 'This module is supporting only Node.js v14 or newer. Installed version is ',

    reservedName(name = 'testStorage123') {
        return `'${name}' is a reserved storage file name. You cannot use it.`
    },
    invalidStorage: 'Storage file is not valid.',
    wrongStorageData: 'Storage file contains wrong data.',
}