declare module 'discord-economy-super' {
    import { EventEmitter } from 'events';
    import { errorList } from '../src/errors'
    /**
     * The Economy class.
     */
    class Economy extends EventEmitter {
        /**
         * Module version.
         */
        public version: string;
        /**
         * Module ready status.
         */
        public ready: boolean;
        /**
        * An object with methods to create a shop on your server.
        */
        public shop: Shop;
        /**
         * Economy errored status.
         */
        public errored: boolean
        /**
         * Constructor options object.
         */
        public options: Options
        /**
         * Database checking interval.
         */
        public interval: NodeJS.Timeout | null
        /**
         * Economy errors object.
         */
        public errors: ErrorList
        /**
         * 'EconomyError' Error instance.
         */
        public EconomyError: EconomyError
        /**
         * The Economy class.
         * @param {Object} options Constructor options object.
         */
        constructor(options?: Options);
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
        * @param {string} reason The reason why you add the money
        * @returns Money amount
        */
        add(amount: number, memberID: string, guildID: string, reason?: string): Number;
        /**
        * Subtracts the money amount from user's balance.
        * @param {Number} amount Amount of money that you want to subtract
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @param {string} reason The reason why you subtract the money
        * @returns Money amount
        */
        subtract(amount: number, memberID: string, guildID: string, reason?: string): Number;
        /**
        * Fetches the user's bank balance.
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @returns User's bank balance
        */
        bankFetch(memberID: string, guildID: string): number;
        /**
        * Sets the money amount on user's bank balance.
        * @param {Number} amount Amount of money that you want to set
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @param {string} reason The reason why you set the money
        * @returns Money amount
        */
        bankSet(amount: number, memberID: string, guildID: string, reason?: string): Number;
        /**
        * Adds the money amount on user's bank balance.
        * @param {Number} amount Amount of money that you want to add
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @param {string} reason The reason why you add the money
        * @returns Money amount
        */
        bankAdd(amount: number, memberID: string, guildID: string, reason?: string): Number;
        /**
        * Subtracts the money amount from user's bank balance.
        * @param {Number} amount Amount of money that you want to subtract
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @param {string} reason The reason why you subtract the money
        * @returns Money amount
        */
        bankSubtract(amount: number, memberID: string, guildID: string, reason?: string): Number;
        /**
        * Adds a daily reward on user's balance
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @param {string} reason The reason why the money was added. Default: 'claimed the daily reward'
        * @returns Daily money amount or time before next claim
        */
        daily(memberID: string, guildID: string, reason: string): (Number | String);
        /**
        * Adds a work reward on user's balance
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @param {string} reason The reason why the money was added. Default: 'claimed the work reward'
        * @returns Work money amount or time before next claim
        */
        work(memberID: string, guildID: string, reason: string): (Number | String);
        /**
        * Adds a weekly reward on user's balance
        * @param {String} memberID Member ID
        * @param {String} guildID Guild ID
        * @param {string} reason The reason why the money was added. Default: 'claimed the weekly reward'
        * @returns Weekly money amount or time before next claim
        */
        weekly(memberID: string, guildID: string, reason: string): (Number | String);
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
        /**
        * Fetches the entire database.
        * @returns Database contents
        */
        all(): Object;
        /**
        * Clears the storage file.
        * @returns {Boolean} If cleared successfully: true; else: false
        */
        clearStorage(): Boolean
        /**
         * Shows a money leaderboard for your server
         * @param {String} guildID Guild ID
         * @returns Sorted leaderboard array
         */
        leaderboard(guildID: string): Array<{ userID: String, money: Number }>;
        /**
         * Shows a bank money leaderboard for your server
         * @param {String} guildID Guild ID
         * @returns Sorted leaderboard array
         */
        bankLeaderboard(guildID: string): Array<{ userID: String, money: Number }>;
        /**
         * This method will show is the module updated, latest version and installed version. [Promise: Object]
         * @returns If started successfully: true; else: Error object.
         */
        checkUpdates(): Promise<{
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
        }>;
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
        on<K extends keyof ModuleEvents>(
            event: K,
            listener: (...args: ModuleEvents[K][]) => void
        ): this;

        once<K extends keyof ModuleEvents>(
            event: K,
            listener: (...args: ModuleEvents[K][]) => void
        ): this;

        emit<K extends keyof ModuleEvents>(event: K, ...args: ModuleEvents[K][]): boolean;
        /**
         * Initializates the module. Please note: you don't need to use this method, it already starts in constructor.
         * @returns If started successfully: true; else: Error instance.
         */
    }
    /**
    * An object with methods to create a shop on your server.
    */
    class Shop {
        /**
         * Creates an item in shop.
         * @param {Object} options Options object with item info.
         * @param {String} guildID Guild ID.
         * @returns Item info.
         */
        addItem(guildID: string, options: {
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
        }): ItemData;
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
         * @param {string} reason The reason why the money was added. Default: 'received the item from the shop'
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
        list(memberID: string, guildID: string): Array<ItemData>;
        /**
         * Searches for the item in the shop.
         * @param {Number | String} itemID Item ID or name 
         * @param {String} guildID Guild ID
         * @returns If item not found: null; else: item data array
         */
        searchItem(itemID, guildID): ItemData;
        /**
         * Shows all items in user's inventory
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @returns The user's inventory array.
         */
        inventory(memberID: string, guildID: string): Array<{ id: Number, itemName: String, price: Number, message: String, role: String, maxAmount: Number, date: String }>;
        /**
         * Shows the user's purchase history.
         * @param {String} memberID Member ID
         * @param {String} guildID Guild ID
         * @returns User's purchase history array.
         */
        history(memberID: string, guildID: string): Array<{ id: Number, memberID: String, guildID: String, itemName: String, price: Number, message: String, role: String, date: String }>;
    }
    class EconomyError extends Error {
        /**
         * Name of the error
         */
        public name: 'EconomyError'
        /**
        * Creates an 'EconomyError' error instance.
        * @param {String | Error} message Error message.
        */
        constructor(message: string | Error) {}
    }
    namespace Economy {
        declare const version: '1.1.8'
    }
    export = Economy;
}
/**
 * Constructor options object
 */
interface Options {
    /**
     * Full path to a JSON file. Default: './storage.json'.
     */
    storagePath?: string;
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
    updater?: {
        /**
         * Sends the update state message in console on start. Default: true.
         */
        checkUpdates: boolean;
        /**
         * Sends the message in console on start if module is up to date. Default: true.
         */
        upToDateMessage: boolean;
    };
    /**
    * Error Handler options object.
    */
    errorHandler?: {
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
    };
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
interface ModuleEvents {
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
     * Emits when someone's used the item from his inventory
     */
    shopItemUse: ItemData;
}
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
    emptyServerDatabase: 'Cannot generate a leaderboard: the server database is empty.'
}