import Emitter from '../classes/util/Emitter'

import CacheManager from './CacheManager'
import DatabaseManager from './DatabaseManager'

import { CurrencyObject, CurrencyPropertyType } from '../interfaces/CurrencyObject'
import CustomItemData from '../interfaces/CustomItemData'

import EconomyConfiguration from '../interfaces/EconomyConfiguration'

/**
* Currency manager methods class.
* @extends {Emitter}
*/
declare class CurrencyManager extends Emitter {

    /**
      * Currency Manager.
      * @param {EconomyConfiguration} options Economy configuration.
      * @param {DatabaseManager} database Database manager.
      * @param {CacheManager} cache Cache manager.
     */
    public constructor(options: EconomyConfiguration, database: DatabaseManager, cache: CacheManager)

    /**
     * Finds the info for the specified currency.
     * @param {string} currencyID Currency ID, its name or its symbol.
     * @param {string} guildID Guild ID.
     * @returns {Promise<CurrencyObject<T>>} Currency object.
     */
    public find<T extends object = any>(currencyID: string, guildID: string): Promise<CurrencyObject<T>>

    /**
     * Finds the info for the specified currency.
     * @param {number} currencyID Currency ID, its name or its symbol.
     * @param {string} guildID Guild ID.
     * @returns {Promise<CurrencyObject<T>>} Currency object.
     */
    public find<T extends object = any>(currencyID: number, guildID: string): Promise<CurrencyObject<T>>

    /**
     * Finds the info for the specified currency.
     * @param {string | number} currencyID Currency ID, its name or its symbol.
     * @param {string} guildID Guild ID.
     * @returns {Promise<CurrencyObject<T>>} Currency object.
     */
    public find<T extends object = any>(currencyID: string | number, guildID: string): Promise<CurrencyObject<T>>

    /**
     * Finds the info for the specified currency.
     * 
     * This method is an alias for `CurrencyManager.find()` method.
     * @param {string} currencyID Currency ID, its name or its symbol.
     * @param {string} guildID Guild ID.
     * @returns {Promise<CurrencyObject<T>>} Currency object.
     */
    public get<T extends object = any>(currencyID: string, guildID: string): Promise<CurrencyObject<T>>

    /**
     * Finds the info for the specified currency.
     * 
     * This method is an alias for `CurrencyManager.find()` method.
     * @param {number} currencyID Currency ID, its name or its symbol.
     * @param {string} guildID Guild ID.
     * @returns {Promise<CurrencyObject<T>>} Currency object.
     */
    public get<T extends object = any>(currencyID: number, guildID: string): Promise<CurrencyObject<T>>

    /**
     * Finds the info for the specified currency.
     * 
     * This method is an alias for `CurrencyManager.find()` method.
     * @param {string | number} currencyID Currency ID, its name or its symbol.
     * @param {string} guildID Guild ID.
     * @returns {Promise<CurrencyObject<T>>} Currency object.
     */
    public get<T extends object = any>(currencyID: string | number, guildID: string): Promise<CurrencyObject<T>>

    /**
     * Edits the currency object.
     * 
     * Type parameters:
     * 
     * - T: Currency property string.
     * - K: Type for specified property in T.
     * 
     * @param {string} currencyID Currency ID, its name or its symbol.
     * @param {T} property Currency property to edit.
     * @param {K} value Any value to set.
     * @param {string} guildID Guild ID.
     * @returns {Promise<CurrencyObject<T>>} Edited currency object.
     */
    public edit<
        T extends keyof Omit<CurrencyObject, 'id' | 'date'>,
        K extends CurrencyPropertyType<T>
    >(
        currencyID: string,
        property: T,
        value: T extends 'custom' ? CustomItemData<K> : K,
        guildID: string
    ): Promise<CurrencyObject<K>>

    /**
     * Edits the currency object.
     * 
     * Type parameters:
     * 
     * - T: Currency property string.
     * - K: Type for specified property in T.
     * 
     * @param {number} currencyID Currency ID, its name or its symbol.
     * @param {T} property Currency property to edit.
     * @param {K} value Any value to set.
     * @param {string} guildID Guild ID.
     * @returns {Promise<CurrencyObject<T>>} Edited currency object.
     */
    public edit<
        T extends keyof Omit<CurrencyObject, 'id' | 'date'>,
        K extends CurrencyPropertyType<T>
    >(
        currencyID: number,
        property: T,
        value: T extends 'custom' ? CustomItemData<K> : K,
        guildID: string
    ): Promise<CurrencyObject<K>>

    /**
     * Edits the currency object.
     * 
     * Type parameters:
     * 
     * - T: Item property string.
     * - K: Type for specified property in T.
     * 
     * @param {string | number} currencyID Currency ID, its name or its symbol.
     * @param {T} property Currency property to edit.
     * @param {K} value Any value to set.
     * @param {string} guildID Guild ID.
     * @returns {Promise<CurrencyObject<T>>} Edited currency object.
     */
    public edit<
        T extends keyof Omit<CurrencyObject, 'id' | 'date'>,
        K extends CurrencyPropertyType<T>
    >(
        currencyID: string | number,
        property: T,
        value: T extends 'custom' ? CustomItemData<K> : K,
        guildID: string
    ): Promise<CurrencyObject<K>>

    /**
     * Edits the currency's custom data object.
     * @param {string} currencyID Currency ID, its name or its symbol.
     * @param {string} guildID Guild ID.
     * @param {object} customObject Custom data object to set.
     * @returns {Promise<CurrencyObject<T>>} Currency object with its updated custom property.
     */
    public setCustom<T extends object = any>(currencyID: string, guildID: string, customObject: T): Promise<CurrencyObject<T>>

    /**
     * Edits the currency's custom data object.
     * @param {number} currencyID Currency ID, its name or its symbol.
     * @param {string} guildID Guild ID.
     * @param {object} customObject Custom data object to set.
     * @returns {Promise<CurrencyObject<T>>} Currency object with its updated custom property.
     */
    public setCustom<T extends object = any>(currencyID: number, guildID: string, customObject: T): Promise<CurrencyObject<T>>

    /**
     * Edits the currency's custom data object.
     * @param {string | number} currencyID Currency ID, its name or its symbol.
     * @param {string} guildID Guild ID.
     * @param {object} customObject Custom data object to set.
     * @returns {Promise<CurrencyObject<T>>} Currency object with its updated custom property.
     */
    public setCustom<T extends object = any>(currencyID: string | number, guildID: string, customObject: T): Promise<CurrencyObject<T>>

    /**
     * Gets the specified currency balance for specified member.
     * @param {string} currencyID Currency ID, its name or its symbol.
     * @param {string} memberID Guild ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<number>} Currency balance for specified member.
     */
    public getBalance(currencyID: string, memberID: string, guildID: string): Promise<number>

    /**
     * Gets the specified currency balance for specified member.
     * @param {number} currencyID Currency ID, its name or its symbol.
     * @param {string} memberID Guild ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<number>} Currency balance for specified member.
     */
    public getBalance(currencyID: number, memberID: string, guildID: string): Promise<number>

    /**
     * Gets the specified currency balance for specified member.
     * @param {string | number} currencyID Currency ID, its name or its symbol.
     * @param {string} memberID Guild ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<number>} Currency balance for specified member.
     */
    public getBalance(currencyID: string | number, memberID: string, guildID: string): Promise<number>

    /**
     * Sets the currecy balance for speciied member.
     * @param {string} currencyID Currency ID, its name or its symbol.
     * @param {number} amount Amount of money to set.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why the money was set.
     * @param {boolean} [emitSet=false] If true, `customCurrencySet` event will be emitted on set. Default: false.
     * @returns {Promise<number>} Amount of money that was set.
     */
    public setBalance(currencyID: string, amount: number, memberID: string, guildID: string, reason?: string, emitSet?: boolean): Promise<number>

    /**
     * Sets the currecy balance for speciied member.
     * @param {number} currencyID Currency ID, its name or its symbol.
     * @param {number} amount Amount of money to set.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why the money was set.
     * @param {boolean} [emitSet=false] If true, `customCurrencySet` event will be emitted on set. Default: false.
     * @returns {Promise<number>} Amount of money that was set.
     */
    public setBalance(currencyID: number, amount: number, memberID: string, guildID: string, reason?: string, emitSet?: boolean): Promise<number>

    /**
     * Sets the currecy balance for speciied member.
     * @param {string | number} currencyID Currency ID, its name or its symbol.
     * @param {number} amount Amount of money to set.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why the money was set.
     * @param {boolean} [emitSet=false] If true, `customCurrencySet` event will be emitted on set. Default: false.
     * @returns {Promise<number>} Amount of money that was set.
     */
    public setBalance(currencyID: string | number, amount: number, memberID: string, guildID: string, reason?: string, emitSet?: boolean): Promise<number>

    /**
     * Adds the currecy balance for speciied member.
     * @param {string} currencyID Currency ID, its name or its symbol.
     * @param {number} amount Amount of money to add.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why the money was added.
     * @returns {Promise<number>} Amount of money that was added.
     */
    public addBalance(currencyID: string, amount: number, memberID: string, guildID: string, reason?: string): Promise<number>

    /**
     * Subtracts the currecy balance for speciied member.
     * @param {number} currencyID Currency ID, its name or its symbol.
     * @param {number} amount Amount of money to subtract.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @param {string} [reason] The reason why the money was subtracted.
     * @returns {Promise<number>} Amount of money that was subtracted.
     */
    public subtractBalance(currencyID: number, amount: number, memberID: string, guildID: string, reason?: string): Promise<number>

    /**
     * Deletes the currency object and all its balances in a specified guild.
     * @param {string} currencyID Currency ID, its name or its symbol.
     * @param {string} guildID Guild ID.
     * @returns {Promise<boolean>} If deleted: true, else - false.
     */
    public delete(currencyID: string, guildID: string): Promise<boolean>

    /**
     * Deletes the currency object and all its balances in a specified guild.
     * @param {number} currencyID Currency ID, its name or its symbol.
     * @param {string} guildID Guild ID.
     * @returns {Promise<boolean>} If deleted: true, else - false.
     */
    public delete(currencyID: number, guildID: string): Promise<boolean>

    /**
     * Deletes the currency object and all its balances in a specified guild.
     * @param {string | number} currencyID Currency ID, its name or its symbol.
     * @param {string} guildID Guild ID.
     * @returns {Promise<boolean>} If deleted: true, else - false.
     */
    public delete(currencyID: string | number, guildID: string): Promise<boolean>

    /**
     * Creates a currency object in database.
     * @param {string} name Currency name to set.
     * @param {string} symbol Currency symbol to set.
     * @param {string} guildID Guild ID.
     * @returns {Promise<CurrencyObject<T>>} Currency object.
     */
    public create<T extends object = any>(name: string, symbol: string, guildID: string): Promise<CurrencyObject<T>>

    /**
     * Clears the currencies array for specified guild.
     * @param {string} guildID Guild ID.
     * @returns {Promise<boolean>} If cleared: true, else: false.
     */
    public clear(guildID: string): Promise<boolean>
}

export = CurrencyManager
