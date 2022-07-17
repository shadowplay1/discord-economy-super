import EconomyOptions from '../../interfaces/EconomyOptions'

import SettingsTypes from '../../interfaces/SettingsTypes'
import SettingValueType from '../../interfaces/SettingValueType'


declare class Settings {
    public constructor(guildID: string, options: EconomyOptions)

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
    public get<T extends keyof SettingsTypes>(key: T): SettingValueType<T>

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
    public set<T extends keyof SettingsTypes>(key: T, value: SettingValueType<T>): SettingsTypes

    /**
     * Removes the specified setting.
     *
     * Note: If the server don't have any setting specified,
     * the module will take the values from the
     * specified configuration or default configuration.
     *
     * @param {keyof SettingsTypes} key The setting to remove..
     * @returns {SettingsTypes} The server settings object.
     */
    public remove(key: keyof SettingsTypes): SettingsTypes

    /**
     * Fetches the server's settings object.
     * @returns {SettingsTypes} The server settings object.
     */
    public all(): SettingsTypes

    /**
     * Resets all the settings to setting that are in configuration.
     * @returns {SettingsTypes} The server settings object.
     */
    public reset(): SettingsTypes
}

export = Settings