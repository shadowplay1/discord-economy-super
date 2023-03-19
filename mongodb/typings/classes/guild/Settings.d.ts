import EconomyConfiguration from '../../interfaces/EconomyConfiguration'

import SettingsTypes from '../../interfaces/SettingsTypes'
import SettingValueType from '../../interfaces/SettingValueType'

import DatabaseManager from '../../managers/DatabaseManager'


declare class Settings {
    public constructor(guildID: string, options: EconomyConfiguration, database: DatabaseManager)

    /**
     * Gets the specified setting from the database.
     *
     * Note: If the server don't have any setting specified,
     * the module will take the values from the
     * specified configuration or default configuration.
     *
     * @param {T} key The setting to fetch.
     * @returns {SettingValueType<T>} The setting from the database.
     */
    public get<T extends keyof SettingsTypes>(key: T): Promise<SettingValueType<T>>

    /**
     * Changes the specified setting.
     *
     * Note: If the server don't have any setting specified,
     * the module will take the values from the
     * specified configuration or default configuration.
     *
     * @param {T} key The setting to change.
     * @param {SettingValueType<T>} value The value to set.
     * @returns {SettingsTypes} The server settings object.
     */
    public set<T extends keyof SettingsTypes>(key: T, value: SettingValueType<T>): Promise<SettingsTypes>

    /**
     * Removes the specified setting.
     *
     * Note: If the server don't have any setting specified,
     * the module will take the values from the
     * specified configuration or default configuration.
     *
     * @param {keyof SettingsTypes} key The setting to remove.
     * @returns {SettingsTypes} The server settings object.
     */
    public remove(key: keyof SettingsTypes): Promise<SettingsTypes>

    /**
     * Deletes the specified setting from the guild.
     *
     * Note: If the server don't have any setting specified,
     * the module will take the values from the
     * specified configuration or default configuration.
     *
     * @param {Settings} key The setting to delete.
     * @returns {Promise<SettingsTypes>} The server settings object.
     */
    public delete(key: keyof SettingsTypes): Promise<SettingsTypes>

    /**
     * Deletes the specified setting from the guild.
     *
     * Note: If the server don't have any setting specified,
     * the module will take the values from the
     * specified configuration or default configuration.
     * 
     * This method is an alias for `Settings.delete()` method.
     *
     * @param {Settings} key The setting to delete.
     * @returns {Promise<SettingsTypes>} The server settings object.
     */
    public remove(key: keyof SettingsTypes): Promise<SettingsTypes>

    /**
     * Fetches the server's settings object.
     * @returns {SettingsTypes} The server settings object.
     */
    public all(): Promise<SettingsTypes>

    /**
     * Resets all the settings to setting that are in configuration.
     * @returns {SettingsTypes} The server settings object.
     */
    public reset(): Promise<SettingsTypes>
}

export = Settings