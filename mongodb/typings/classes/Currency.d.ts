import CacheManager from '../managers/CacheManager'
import DatabaseManager from '../managers/DatabaseManager'

import CurrencyManager from '../managers/CurrencyManager'

import { CurrencyObject, CurrencyPropertyType } from '../interfaces/CurrencyObject'
import CustomItemData from '../interfaces/CustomItemData'

import TransferingOptions from '../interfaces/TransferingOptions'
import TransferingResult from '../interfaces/TransferingResult'

import EconomyConfiguration from '../interfaces/EconomyConfiguration'


/**
 * Currency class.
 */
declare class Currency<T extends object = any> {

    /**
     * @param {number} currencyID Currency ID.
     * @param {string} guildID Guild ID.
     * @param {EconomyConfiguration} ecoOptions Economy configuration object.
     * @param {CurrencyObject} currencyObject Currency object.
     * @param {DatabaseManager} database Database manager.
     * @param {CacheManager} cache Cache manager.
     */
    public constructor(
        currencyID: number,
        guildID: string,
        ecoOptions: EconomyConfiguration,
        currencyObject: CurrencyObject<T>,
        database: DatabaseManager,
        cache: CacheManager
    )

    /**
     * Guild ID.
     * @type {string}
     */
    public guildID: string

    /**
     * Currency ID.
     * @type {number}
     */
    public id: number

    /**
     * Currency name.
     * @type {string}
     */
    public name: string

    /**
     * Currency symbol.
     * @type {string}
     */
    public symbol?: string

    /**
     * Currency balances object.
     * @type {object}
     */
    public balances: object

    /**
     * Custom currency data object.
     * @type {object}
     */
    public custom: CustomItemData<T>

    /**
     * Currency Manager.
     * @type {CurrencyManager}
     * @private
     */
    private _currencies: CurrencyManager

    /**
     * Creates a currency object in guild database.
     * @returns {Promise<Currency<T>>} Currency object.
     */
    public create(): Promise<Currency<T>>

    /**
     * Deletes the currency object from guild database.
     * @returns {Promise<Currency<T>>} Currency object.
     */
    public delete(): Promise<Currency<T>>

    /**
     * Edits the currency object.
     * @param {T} property Currency property to edit.
     * @param {K} value Any value to set.
     * @returns {Promise<Currency<T>>} Edited currency object.
     */
    public edit<
        T extends keyof Omit<CurrencyObject, 'id' | 'balances'>,
        K extends CurrencyPropertyType<T>
    >(
        property: T,
        value: T extends 'custom' ? CustomItemData<K> : K,
    ): Promise<Currency<K>>

    /**
     * Edits the currency's custom data object.
     * @param {object} customObject Custom data object to set.
     * @returns {Promise<Currency<T>>} Currency object with its updated custom property.
     */
    public setCustom(customObject: CurrencyObject<T>): Promise<Currency<T>>

    /**
     * Sets the currency for specified member.
     * @param {number} amount Amount of money to set.
     * @param {string} memberID Member ID.
     * @param {string} [reason] The reason why the balance was set.
     * @returns {Promise<number>} Amount of money that was set.
     */
    public setBalance(amount: number, memberID: string, reason: string): Promise<number>

    /**
     * Sets the currency for specified member.
     * @param {string} memberID Member ID.
     * @returns {Promise<number>} Member's balance.
     */
    public getBalance(memberID: string): Promise<number>

    /**
     * Adds the currency for specified member.
     * @param {number} amount Amount of money to add.
     * @param {string} memberID Member ID.
     * @param {string} [reason] The reason why the balance was added.
     * @returns {Promise<number>} Amount of money that was added.
     */
    public addBalance(amount: number, memberID: string, reason: string): Promise<number>

    /**
     * Subtracts the currency for specified member.
     * @param {number} amount Amount of money to subtract.
     * @param {string} memberID Member ID.
     * @param {string} [reason] The reason why the balance was subtracted.
     * @returns {Promise<number>} Amount of money that was subtracted.
     */
    public subtractBalance(amount: number, memberID: string, reason: string): Promise<number>

    /**
     * Transfers the currency to specified user
     * @param {CurrencyTransferOption} Currency transfering options.
     * @returns {Promise<TransferingResult>} Currency transfering result.
     */
    public transfer(options: TransferingOptions): Promise<TransferingResult>

    /**
     * Saves the currency object in database.
     * @returns {Promise<Currency>} Currency instance.
     */
    public save(): Promise<Currency>

    /**
     * Converts the currency object to string.
     * @returns {string} String representation of currency object.
     */
    public toString(): string
}

export = Currency
