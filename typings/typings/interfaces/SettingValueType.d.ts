import SettingsTypes from './SettingsTypes'

type SettingValueType<T extends keyof SettingsTypes> = SettingsTypes[T]

export = SettingValueType