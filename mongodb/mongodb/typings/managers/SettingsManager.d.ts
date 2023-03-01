import DatabaseManager from './DatabaseManager'
import CacheManager from './CacheManager'

import EconomyConfiguration from '../interfaces/EconomyConfiguration'

import SettingsTypes from '../interfaces/SettingsTypes'
import SettingValueType from '../interfaces/SettingValueType'

/**
 * 
 */
declare class SettingsManager {
    public constructor(options: EconomyConfiguration, database: DatabaseManager, cache: CacheManager)

    /**
     * Gets the specified setting from the database.
     * 
     * Note: If the server don't have any setting specified,
     * the module will take the values from the
     * specified configuration or default configuration.
     * 
     * @param {T} key The setting to fetch.
     * @param {string} guildID Guild ID.
     * @returns {Promise<SettingValueType<T>>} The setting from the database.
     */
    public get<T extends keyof SettingsTypes>(key: T, guildID: string): Promise<SettingValueType<T>>

    /**
     * Changes the specified setting.
     * 
     * Note: If the server don't have any setting specified, 
     * the module will take the values from the 
     * specified configuration or default configuration.
     * 
     * @param {T} key The setting to change.
     * @param {SettingValueType<T>} value The value to set.
     * @param {string} guildID Guild ID.
     * @returns {Promise<SettingsTypes>} The server settings object.
     */
    public set<T extends keyof SettingsTypes>(key: T, value: SettingValueType<T>, guildID: string): Promise<SettingsTypes>

    /**
     * Deletes the specified setting.
     * 
     * Note: If the server don't have any setting specified, 
     * the module will take the values from the 
     * specified configuration or default configuration.
     *
     * @param {keyof SettingsTypes} key The setting to delete.
     * @param {string} guildID Guild ID.
     * @returns {Promise<SettingsTypes>} The server settings object.
     */
    public delete(key: keyof SettingsTypes, guildID: string): Promise<SettingsTypes>

    /**
     * Deletes the specified setting.
     * 
     * Note: If the server don't have any setting specified, 
     * the module will take the values from the 
     * specified configuration or default configuration.
     * 
     * This method is an alias for `SettingsManager.delete()` method.
     * 
     * @param {keyof SettingsTypes} key The setting to delete.
     * @param {string} guildID Guild ID.
     * @returns {Promise<SettingsTypes>} The server settings object.
     */
    public remove(key: keyof SettingsTypes, guildID: string): Promise<SettingsTypes>

    /**
     * Fetches the server's settings object.
     * @param {string} guildID Guild ID.
     * @returns {Promise<SettingsTypes>} The server settings object.
     */
    public all(guildID: string): Promise<SettingsTypes>

    /**
     * Resets all the settings to setting that are in configuration.
     * @param {string} guildID Guild ID.
     * @returns {Promise<SettingsTypes>} The server settings object.
     */
    public reset(guildID: string): Promise<SettingsTypes>
}

export = SettingsManager