declare module 'discord-economy-super' {
    import { Client } from 'discord.js';
    import { EventEmitter } from 'events';

    class Economy extends EventEmitter {
        public version: string;
        public ready: boolean;
        public shop: Shop;
        
        constructor(options?: Options);

        fetch(memberID: string, guildID: string): number;
        set(amount: number, memberID: string, guildID: string, reason?: string): number;
        add(amount: number, memberID: string, guildID: string, reason?: string): number;
        subtract(amount: number, memberID: string, guildID: string, reason?: string): number;

        bankFetch(memberID: string, guildID: string): number;
        bankSet(amount: number, memberID: string, guildID: string, reason?: string): number;
        bankAdd(amount: number, memberID: string, guildID: string, reason?: string): number;
        bankSubtract(amount: number, memberID: string, guildID: string, reason?: string): number;

        daily(memberID: string, guildID: string): (number | string);
        work(memberID: string, guildID: string): (number | string);
        weekly(memberID: string, guildID: string): (number | string);

        getDailyCooldown(memberID: string, guildID: string): number;
        getWorkCooldown(memberID: string, guildID: string): number;
        getWeeklyCooldown(memberID: string, guildID: string): number;

        all(): object;
        leaderboard(guildID: string): Array<string>;
        checkUpdates(): Promise<object>;

        on<K extends keyof ModuleEvents>(
            event: K,
            listener: (...args: ModuleEvents[K][]) => void
        ): this;

        once<K extends keyof ModuleEvents>(
            event: K,
            listener: (...args: ModuleEvents[K][]) => void
        ): this;

        emit<K extends keyof ModuleEvents>(event: K, ...args: ModuleEvents[K][]): boolean;

        private init(): Promise<true | Error>;
    }

    class Shop {
        addItem(guildID: string, options: ItemData): ItemData;
        editItem(itemID: string, guildID: string, arg: EditTypes, value: string): boolean;
        removeItem(itemID: string, guildID: string): boolean;
        searchItem(itemID: string, guildID: string): ItemData;
        useItem(itemID: string, memberID: string, guildID: string, client?: Client): string;
        buy(itemID: string, memberID: string, guildID: string, reason?: 'received the item from the shop'): ItemData;
        clear(guildID: string): boolean;
        clearInventory(memberID: string, guildID: string): boolean;
        clearHistory(memberID: string, guildID: string): boolean;
        list(memberID: string, guildID: string): Array<string>;
        inventory(memberID: string, guildID: string): Array<string>;
        history(memberID: string, guildID: string): Array<string>;
    }

    namespace Economy {}

    export = Economy;
}

interface Options {
    storagePath?: string;

    dailyCooldown?: number;
    workCooldown?: number;
    weeklyCooldown?: number;

    dailyAmount?: number;
    workAmount?: number | Array<number>;
    weeklyAmount?: number;

    updateCooldown?: number;
    dateLocale?: string;

    updater?: Updater;
    errorHandler?: ErrorHandler;
}

interface Updater {
    checkUpdates: boolean;
    upToDateMessage: boolean;
}

interface ErrorHandler {
    handleErrors: boolean;
    attempts: number;
    time: number;
}

interface BalanceData {
    type: string;
    guildID: string;
    memberID: string;
    amount: number;
    balance: number;
    reason: string;
}

interface ItemData {
    id: number;
    itemName: string;
    price: number;
    message: string;
    description: string;
    maxAmount: number;
    role: string;
    date: Date;
}

interface EditedItemData {
    itemID: string;
    guildID: string;
    changed: string;
    oldValue: string;
    newValue: string;
}

interface ModuleEvents {
    balanceSet: BalanceData;
    balanceAdd: BalanceData;
    balanceSubtract: BalanceData;

    bankSet: BalanceData;
    bankAdd: BalanceData;
    bankSubtract: BalanceData;


    shopAddItem: BalanceData;
    shopEditItem: EditedItemData;
    shopItemBuy: BalanceData;
    shopItemUse: BalanceData;
    shopClear: boolean;
}

type EditTypes = ('description' | 'price' | 'itemName' | 'message' | 'maxAmount' | 'role');
