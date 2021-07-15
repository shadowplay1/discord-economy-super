declare module 'discord-economy-super' {
    /**
     * The Economy class.
     */
    class Economy extends Emitter {
        /**
         * Module version.
         */
        public version: string
        /**
         * Module ready status.
         */
        public ready: boolean;
        /**
         * Balance manager methods object.
         */
        public balance: BalanceManager
        /**
         * Bank manager methods object.
         */
        public bank: BankManager
        /**
        * Shop manager methods object.
        */
        public shop: ShopManager
        /**
         * Reward manager methods object.
         */
        public rewards: RewardManager
        /**
        * Cooldown manager methods object.
        */
        public cooldowns: CooldownManager
        /**
         * Database manager methods object.
         */
        public database: DatabaseManager
        /**
         * Utils manager methods object.
         */
        public utils: UtilsManager
        /**
         * Economy errored status.
         */
        public errored: boolean
        /**
         * Constructor options object.
         */
        public options: EconomyOptions
        /**
         * Database checking interval.
         */
        public interval: NodeJS.Timeout | null
        /**
         * Economy errors object.
         */
        public errors: ErrorList
        /**
         * Link to the module's documentation website.
         */
        public docs: 'https://des-docs.tk'
        /**
         * 'EconomyError' Error instance.
         */
        public EconomyError: EconomyError
        /**
         * The Economy class.
         * @param {Object} options Constructor options object.
         */
        constructor(options?: EconomyOptions)
        /**
         * Kills the Economy instance.
         * @returns {this} Economy instance.
         */
        kill(): this
        /**
         * Starts the module.
         * @returns If started successfully: true; else: Error instance.
         */
        init(): Promise<true | Error>
        on<K extends keyof EconomyEvents>(event: K, listener: (...args: EconomyEvents[K][]) => void): this;
        once<K extends keyof EconomyEvents>(event: K, listener: (...args: EconomyEvents[K][]) => void): this;
        emit<K extends keyof EconomyEvents>(event: K, ...args: EconomyEvents[K][]): boolean;
    }
    /**
    * Simple Economy event emitter with only important emitter methods.
    */
    class Emitter {
        on(event: String, fn: Function): void
        once(event: String, fn: Function): void
        emit(event: String, data: any): void
    }
    /**
    * Balance methods object.
    */
    class BalanceManager {
        /**
        * Fetches the user's balance.
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @returns User's balance
        */
        fetch(memberID: string, guildID: string): Number;
        /**
        * Sets the money amount on user's balance.
        * @param {Number} amount Amount of money that you want to set
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @param {String} reason The reason why you set the money
        * @returns Money amount
        */
        set(amount: number, memberID: string, guildID: string, reason?: string): Number;
        /**
        * Adds the money amount on user's balance.
        * @param {Number} amount Amount of money that you want to add
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @param {String} reason The reason why you add the money
        * @returns Money amount
        */
        add(amount: number, memberID: string, guildID: string, reason?: string): Number;
        /**
        * Subtracts the money amount from user's balance.
        * @param {Number} amount Amount of money that you want to subtract
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @param {String} reason The reason why you subtract the money
        * @returns Money amount
        */
        subtract(amount: number, memberID: string, guildID: string, reason?: string): Number;
        /**
        * Shows a money leaderboard for your server
        * @param {String} guildID Guild ID
        * @returns Sorted leaderboard array
        */
        leaderboard(guildID: string): Array<LeaderboardData>;
    }
    /**
     * Bank balance methods object.
     */
    class BankManager {
        /**
        * Fetches the user's bank balance.
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @returns User's bank balance
        */
        fetch(memberID: string, guildID: string): Number;
        /**
        * Sets the money amount on user's bank balance.
        * @param {Number} amount Amount of money that you want to set
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @param {String} reason The reason why you set the money
        * @returns Money amount
        */
        set(amount: number, memberID: string, guildID: string, reason?: string): Number;
        /**
        * Adds the money amount on user's bank balance.
        * @param {Number} amount Amount of money that you want to add
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @param {String} reason The reason why you add the money
        * @returns Money amount
        */
        add(amount: number, memberID: string, guildID: string, reason?: string): Number;
        /**
        * Subtracts the money amount from user's bank balance.
        * @param {Number} amount Amount of money that you want to subtract
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @param {String} reason The reason why you subtract the money
        * @returns Money amount
        */
        subtract(amount: number, memberID: string, guildID: string, reason?: string): Number;
        /**
        * Shows a bank money leaderboard for your server
        * @param {String} guildID Guild ID
        * @returns Sorted leaderboard array
        */
        leaderboard(guildID: string): Array<LeaderboardData>;
    }
    /**
    * An object with methods to create a shop on your server.
    */
    class ShopManager {
        /**
         * Creates an item in shop.
         * @param {Object} options Options object with item info.
         * @param {String} guildID Guild ID.
         * @returns Item info.
         */
        addItem(guildID: string, options: AddItemOptions): ItemData;
        /**
         * Edits the item in shop.
         * @param {Number | String} itemID Item ID or name
         * @param {String} guildID Guild ID
         * @param {String} arg This argument means what thing in item you want to edit. Avaible arguments: description, price, name, message, amount, role
         * @returns {Boolean} If edited successfully: true, else: false
         */
        editItem(itemID: string, guildID: string, arg: 'description' | 'price' | 'itemName' | 'message' | 'maxAmount' | 'role', value: string): boolean;
        /**
         * Removes an item from the shop.
         * @param {Number | String} itemID Item ID or name 
         * @param {String} guildID Guild ID
         * @returns {Boolean} If removed: true, else: false
         */
        removeItem(itemID: string, guildID: string): boolean;
        /**
         * Searches for the item in the shop.
         * @param {Number | String} itemID Item ID or name 
         * @param {String} guildID Guild ID
         * @returns If item not found: null; else: item data array
         */
        searchItem(itemID: string, guildID: string): ItemData;
        /**
         * Uses the item from the user's inventory.
         * @param {Number | String} itemID Item ID or name
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @param {any} client The Discord Client [Optional]
         * @returns {String} Item message 
         */
        useItem(itemID: string, memberID: string, guildID: string, client?: any): string;
        /**
         * Buys the item from the shop
         * @param {Number | String} itemID Item ID or name
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @param {String} reason The reason why the money was added. Default: 'received the item from the shop'
         * @returns {String | Boolean} If item bought successfully: true; if item not found: false; if user reached the item's max amount: 'max'
         */
        buy(itemID: string, memberID: string, guildID: string, reason?: 'received the item from the shop'): Boolean | 'max';
        /**
         * Clears the shop.
         * @param {String} guildID Guild ID
         * @returns {Boolean} If cleared: true, else: false
         */
        clear(guildID: string): boolean;
        /**
         * Clears the user's inventory.
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @returns {Boolean} If cleared: true, else: false
         */
        clearInventory(memberID: string, guildID: string): boolean;
        /**
         * Clears the user's purchases history.
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @returns {Boolean} If cleared: true, else: false
         */
        clearHistory(memberID: string, guildID: string): boolean;
        /**
         * Shows all items in the shop.
         * @param {String} guildID Guild ID
         * @returns The shop array.
         */
        list(guildID: string): Array<ItemData>;
        /**
         * Searches for the item in the shop.
         * @param {Number | String} itemID Item ID or name 
         * @param {String} guildID Guild ID
         * @returns If item not found: null; else: item data array
         */
        searchItem(itemID: number | string, guildID: string): ItemData;
        /**
         * Shows all items in user's inventory
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @returns The user's inventory array.
         */
        inventory(memberID: string, guildID: string): Array<Inventory>;
        /**
         * Shows the user's purchase history.
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @returns User's purchase history array.
         */
        history(memberID: string, guildID: string): Array<PurchasesHistory>;
    }
    /**
     * Reward manager methods object.
     */
    class RewardManager {
        /**
        * Adds a daily reward on user's balance
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @param {String} reason The reason why the money was added. Default: 'claimed the daily reward'
        * @returns Daily money amount or time before next claim
        */
        daily(memberID: string, guildID: string, reason?: string): DailyObject
        /**
        * Adds a work reward on user's balance
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @param {String} reason The reason why the money was added. Default: 'claimed the work reward'
        * @returns Work money amount or time before next claim
        */
        work(memberID: string, guildID: string, reason?: string): WorkObject
        /**
        * Adds a weekly reward on user's balance
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @param {String} reason The reason why the money was added. Default: 'claimed the weekly reward'
        * @returns Weekly money amount or time before next claim
        */
        weekly(memberID: string, guildID: string, reason?: string): WeeklyObject
    }
    /**
     * Cooldown manager methods object.
     */
    class CooldownManager {
        /**
        * Clears user's daily cooldown
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @returns {Boolean} If cleared: true; else: false
        */
        clearDailyCooldown(memberID: String, guildID: String): Boolean
        /**
        * Clears user's work cooldown
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @returns {Boolean} If cleared: true; else: false
        */
        clearWorkCooldown(memberID: String, guildID: String): Boolean
        /**
        * Clears user's weekly cooldown
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @returns {Boolean} If cleared: true; else: false
        */
        clearWeeklyCooldown(memberID: String, guildID: String): Boolean
        /**
        * Gets user's daily cooldown
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @returns Cooldown end timestamp
        */
        getDailyCooldown(memberID: string, guildID: string): Number;
        /**
        * Gets user's work cooldown
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @returns Cooldown end timestamp
        */
        getWorkCooldown(memberID: string, guildID: string): Number;
        /**
        * Gets user's weekly cooldown
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @returns Cooldown end timestamp
        */
        getWeeklyCooldown(memberID: string, guildID: string): Number;
    }
    /**
     * Database manager methods object.
     */
    class DatabaseManager {
        /**
        * Gets a list of keys in database.
        * @returns An array with all keys in database or 'null' if nothing found.
        */
        keysList(key: String): Array<String>
        /**
        * Sets data in a property in database.
        * @param {String} key The key in database.
        * @param {any} data Any data to set in property.
        * @returns If set successfully: true; else: false
        */
        set(key: String, data: any): Boolean
        /**
        * Fetches the data from storage file.
        * @param {String} key The key in database.
        * @returns Value from the specified key or 'false' if failed to read or 'null' if nothing found.
        */
        fetch(key: String): any | false
        /**
        * Removes the property from the existing object in database.
        * @param {String} key The key in database.
        * @returns If cleared: true; else: false.
        */
        remove(key: String): Boolean
        /**
        * Fetches the entire database.
        * @returns {Object} Database contents
        */
        all(): Object
    }
    /**
     * Utils manager methods object.
     */
    class UtilsManager {
        /**
        * Fetches the entire database.
        * @returns Database contents
        */
        all(): object;
        /**
        * Clears the storage file.
        * @returns {Boolean} If cleared successfully: true; else: false
        */
        clearStorage(): boolean
        /**
        * Fully removes the guild from database.
        * @param {String} guildID Guild ID
        * @returns {Boolean} If cleared successfully: true; else: false
        */
        removeGuild(guildID: string): boolean
        /**
        * Removes the user from database.
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @returns {Boolean} If cleared successfully: true; else: false
        */
        removeUser(memberID: string, guildID: string): boolean
        /**
         * This method will show is the module updated, latest version and installed version.
         * @returns If started successfully: true; else: Error object.
         */
        checkUpdates(): Promise<VersionData>;
    }
    /**
     * EconomyError class.
     */
    class EconomyError extends Error {
        /**
         * Name of the error
         */
        public name: 'EconomyError'
        /**
        * Creates an 'EconomyError' error instance.
        * @param {String | Error} message Error message.
        */
        constructor(message: string | Error)
    }
    namespace Economy {
        const version: '1.3.2'
        const docs: 'https://des-docs.tk'
    }
    export = Economy;
}
/**
 * Updater options object.
 */
interface UpdaterOptions {
    /**
     * Sends the update state message in console on start. Default: true.
     */
    checkUpdates: boolean;
    /**
     * Sends the message in console on start if module is up to date. Default: true.
     */
    upToDateMessage: boolean;
}
/**
 * Error handler options object.
 */
interface ErrorHandlerOptions {
    /**
     * Handles all errors on startup. Default: true.
     */
    handleErrors: boolean;
    /**
     * Amount of attempts to load the module. Use 'null' for infinity attempts. Default: 5.
     */
    attempts: number;
    /**
     * Time between every attempt to start the module (in ms). Default: 3000.
     */
    time: number;
}
/**
 * Constructor options object.
 */
interface EconomyOptions {
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
    workAmount?: number | Array<number>;
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
}
/**
 * Balance info object for balance events.
 */
interface BalanceData {
    /**
     * The type of operation.
     */
    type: string;
    /**
     * Guild ID.
     */
    guildID: string;
    /**
     * User ID.
     */
    memberID: string;
    /**
     * Amount of money.
     */
    amount: number;
    /**
     * User's balance after the operation was completed successfully.
     */
    balance: number;
    /**
     * The reason why the operation was completed.
     */
    reason: string;
}
/**
 * Item info object for item events.
 */
interface ItemData {
    /**
     * Item ID.
     */
    id: number;
    /**
     * Item name.
     */
    itemName: string;
    /**
     * Item price.
     */
    price: number;
    /**
     * Item message that will be returned on item use.
     */
    message: string;
    /**
     * Item description.
     */
    description: string;
    /**
     * Max amount of the item that user can hold in his inventory.
     */
    maxAmount: number;
    /**
     * Role ID from your Discord server.
     */
    role: string;
    /**
     * Formatted date when the item was added to the shop.
     */
    date: string;
}
/**
 * Item info object for 'shopEditItem' event.
 */
interface EditedItemData {
    /**
     * Item ID.
     */
    itemID: string;
    /**
     * Guild ID.
     */
    guildID: string;
    /**
     * What was changed in item data.
     */
    changed: string;
    /**
     * Value before edit.
     */
    oldValue: string;
    /**
     * Value after edit.
     */
    newValue: string;
}
/**
 * All events list.
 */
interface EconomyEvents {
    /**
     * Emits when someone's set the money on the balance.
     */
    balanceSet: BalanceData;
    /**
     * Emits when someone's added the money on the balance.
     */
    balanceAdd: BalanceData;
    /**
     * Emits when someone's subtracts the money from the balance.
     */
    balanceSubtract: BalanceData;
    /**
     * Emits when someone's set the money on the bank balance.
     */
    bankSet: BalanceData;
    /**
     * Emits when someone's added the money on the bank balance.
     */
    bankAdd: BalanceData;
    /**
     * Emits when someone's subtracted the money from the bank balance.
     */
    bankSubtract: BalanceData;
    /**
     * Emits when someone's added an item in the shop.
     */
    shopAddItem: ItemData;
    /**
     * Emits when someone's cleared the shop.
     */
    shopClear: boolean;
    /**
     * Emits when someone's edited an item in the shop.
     */
    shopEditItem: EditedItemData;
    /**
     * Emits when someone's bought an item from the shop.
     */
    shopItemBuy: ItemData;
    /**
     * Emits when someone's used the item from his inventory.
     */
    shopItemUse: ItemData;
    /**
     * Emits when the module is ready.
     */
    ready: void,
    /**
     * Emits when the module is destroyed.
     */
    destroy: void,
}
/**
 * Object that returns on 'Economy.daily()' method.
 */
interface DailyObject {
    /**
     * The status of receiving money.
     */
    status: Boolean,
    /**
     * If reward is already claimed: time object; else: daily reward.
     */
    value: TimeObject,
    /**
     * If reward is already claimed: formatted time in string; else: daily reward.
     */
    pretty: String | Number,
    /**
     * Daily reward.
     */
    reward: Number
}
/**
 * Object that returns on 'Economy.work()' method.
 */
interface WorkObject {
    /**
     * The status of receiving money.
     */
    status: Boolean,
    /**
     * If reward is already claimed: time object; else: work reward.
     */
    value: TimeObject,
    /**
     * If reward is already claimed: formatted time in string; else: work reward.
     */
    pretty: String | Number,
    /**
     * Work reward.
     */
    reward: Number | Array<Number>
}
/**
 * Object that returns on 'Economy.weekly()' method.
 */
interface WeeklyObject {
    /**
     * The status of receiving money.
     */
    status: Boolean,
    /**
     * If reward is already claimed: time object; else: weekly reward.
     */
    value: TimeObject,
    /**
     * If reward is already claimed: formatted time in string; else: weekly reward.
     */
    pretty: String | Number,
    /**
     * weekly reward.
     */
    reward: Number
}
/**
 * Options of 'Economy.shop.addItem()' method.
 */
interface AddItemOptions {
    /**
     * Item name.
     */
    itemName: string,
    /**
     * Item price.
     */
    price: number,
    /**
     * The message that will be returned on item use.
     */
    message?: string,
    /**
     * Item description.
     */
    description?: string,
    /**
     * Max amount of the item that user can hold in his inventory.
     */
    maxAmount?: number,
    /**
     * Discord Role ID from your server that will be given to user. Requires to specify your bot client in 'Economy.shop.useItem' method.
     */
    role?: string
}
/**
 * Inventory object.
 */
interface Inventory {
    /**
     * Item ID.
     */
    id: number
    /**
     * Item name.
     */
    itemName: string,
    /**
     * Item price.
     */
    price: number,
    /**
     * The message that will be returned on item use.
     */
    message?: string,
    /**
     * Max amount of the item that user can hold in his inventory.
     */
    maxAmount?: number,
    /**
     * Discord Role ID from your server that will be given to user. Requires to specify your bot client in 'Economy.shop.useItem' method.
     */
    role?: string
    /**
     * Date and time when the user bought the item.
     */
    date: string
}
/**
 * Purchases history object.
 */
interface PurchasesHistory {
    /**
     * Item ID.
     */
    id: Number
    /**
     * Member ID.
     */
    memberID: String
    /**
     * Guild ID.
     */
    guildID: String
    /**
     * Item name.
     */
    itemName: String
    /**
     * Item price.
     */
    price: Number
    /**
     * The message that will be returned on item use.
     */
    message: String
    /**
     * Discord Role ID from your server that will be given to user. Requires to specify your bot client in 'Economy.shop.useItem' method.
     */
    role?: string
    /**
     * Date and time when the user bought the item.
     */
    date: string
}
/**
 * Leaderboard data object.
 */
interface LeaderboardData {
    /**
     * User's index in the leaderboard
     */
    index: Number
    /**
     * User ID.
     */
    userID: String,
    /**
     * User's amount of money.
     */
    money: Number
}
/**
 * Object of 'Economy.checkUpdates()' method.
 */
interface VersionData {
    /**
     * Checks for if module is up to date.
     */
    updated: boolean,
    /**
     * Shows an installed version of the module
     */
    installedVersion: string,
    /**
     * Shows the latest version of the module
     */
    packageVersion: string
}
/**
 * Time values object.
 */
interface TimeObject {
    /**
     * Amount of days from cooldown time.
     */
    days: Number,
    /**
     * Amount of hours from cooldown time.
     */
    hours: Number,
    /**
     * Amount of minutes from cooldown time.
     */
    minutes: Number,
    /**
     * Amount of seconds from cooldown time.
     */
    seconds: Number,
    /**
     * Amount of milliseconds from cooldown time.
     */
    milliseconds: Number
}
/**
 * Error list object.
 */
interface ErrorList {
    notReady: 'The module is not ready to work.'
    invalidTypes: {
        memberID: 'memberID must be a string. Received type: '
        guildID: 'guildID must be a string. Received type: '
        amount: 'amount must be a number. Received type: '
        addItemOptions: {
            itemName: 'options.itemName must be a string. Received type: '
            price: 'options.price must be a number. Received type: '
            message: 'options.message must be a string. Received type: '
            description: 'options.description must be a string. Received type: '
            maxAmount: 'options.maxAmount must be a number. Received type: '
            role: 'options.role must be a string. Received type: '
        }
        editItemArgs: {
            itemID: 'itemID must be a string or a number. Received type: '
            arg: `arg parameter must be one of these values: 'description', 'price', 'itemName', 'message', 'maxAmount', 'role'. Received: `
            noValue: 'no value specified. Received: '
        }
        constructorOptions: {
            options: 'options must be type of object. Received: '
            updaterType: 'options.updater must be type of object. Received: '
            errorHandlerType: 'options.errorHandler must be type of object. Received: '
            storatePath: 'options.storagePath must be type of string. Received type: '
            dailyCooldown: 'options.dailyCooldown must be type of number. Received type: '
            dailyAmount: 'options.dailyAmount must be type of number. Received type: '
            workCooldown: 'options.workCooldown must be type of number. Received type: '
            workAmount: 'options.workAmount must be type of number or array. Received type: '
            updateCountdown: 'options.updateCountdown must be type of number. Received type: '
            errorHandler: {
                handleErrors: 'options.errorHandler.handleErrors must be type of boolean. Received type: '
                attempts: 'options.errorHandler.attempts must be type of number. Received type: '
                time: 'options.errorHandler.time must be type of number. Received type: '
            }
            updater: {
                checkUpdates: 'options.updater.checkUpdates must be type of boolean. Received type: '
                upToDateMessage: 'options.updater.upToDateMessage must be type of boolean. Received type: '
            }
        }
    }
    workAmount: {
        tooManyElements: 'options.workAmount array cannot have more than 2 elements; it must have min and max values as first and second element of the array (example: [10, 20]).'
    }
    noClient: 'You need to specify your bot client to use this.'
    roleNotFound: 'Could not find a role with ID '
    oldNodeVersion: 'This module is supporting only Node.js v14 or newer. Installed version is '
    invalidStorage: 'Storage file is not valid.'
    wrongStorageData: 'Storage file contains wrong data.'
}