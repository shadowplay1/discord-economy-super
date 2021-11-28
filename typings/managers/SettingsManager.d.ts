import EconomyOptions from "../interfaces/EconomyOptions";
import SettingsTypes from "../interfaces/SettingsTypes";

/**
 * Settings manager methods class.
 */
declare class SettingsManager {
    constructor(options: EconomyOptions)

    /**
     * Gets the specified setting from the database.
     * 
     * Note: If the server don't have any setting specified,
     * the module will take the values from the
     * options object or default options object.
     * 
     * @param {SettingsStrings} key The setting to fetch.
     * @param {string} guildID Guild ID.
     * @returns {any} The setting from the database.
     */
    public get<Data>(key: SettingsStrings, guildID: string): Data

    /**
     * Changes the specified setting.
     * 
     * Note: If the server don't have any setting specified, 
     * the module will take the values from the 
     * options object or default options object.
     * 
     * @param {SettingsStrings} key The setting to change.
     * @param {any} value The value to set.`
     * @param {string} guildID Guild ID.
     * @returns {SettingsTypes} The server settings object.
     */
    public set<Data>(key: SettingsStrings, value: Data, guildID: string): SettingsTypes

    /**
     * Removes the specified setting.
     * 
     * Note: If the server don't have any setting specified, 
     * the module will take the values from the 
     * options object or default options object.
     * 
     * @param {SettingsStrings} key The setting to remove.
     * @param {string} guildID Guild ID.
     * @returns {SettingsTypes} The server settings object.
     */
    public remove(key: SettingsStrings, guildID: string): SettingsTypes

    /**
     * Fetches the server's settings object.
     * @param {string} guildID Guild ID.
     * @returns {SettingsTypes} The server settings object.
     */
    public all(guildID: string): SettingsTypes

    /**
     * Resets all the settings to setting that are in options object.
     * @param {string} guildID Guild ID.
     * @returns {SettingsTypes} The server settings object.
     */
    public reset(guildID: string): SettingsTypes
}

export = SettingsManager

type SettingsStrings =
    'dailyAmount' | 'dailyCooldown' |
    'workAmount' | 'workCooldown' |
    'weeklyAmount' | 'weeklyCooldown' |
    'dateLocale' | 'subtractOnBuy'