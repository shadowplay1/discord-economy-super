import CheckerOptions from '../interfaces/CheckerOptions'

import EconomyDatabase from '../interfaces/EconomyDatabase'
import EconomyOptions from '../interfaces/EconomyOptions'

import VersionData from '../interfaces/VersionData'


/**
 * Utils manager methods object.
 */
declare class UtilsManager {
    public constructor(options: EconomyOptions)
    
    /**
    * Fetches the entire database.
    * @returns Database contents
    */
    public all(): EconomyDatabase

    /**
    * Clears the storage file.
    * @returns {boolean} If cleared successfully: true; else: false
    */
    public clearDatabase(): boolean

    /**
    * Fully removes the guild from database.
    * @param {string} guildID Guild ID
    * @returns {boolean} If cleared successfully: true; else: false
    */
    public removeGuild(guildID: string): boolean

    /**
    * Removes the user from database.
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @returns {boolean} If cleared successfully: true; else: false
    */
    public removeUser(memberID: string, guildID: string): boolean

    /**
    * Checks for the module updates.
    * @returns {Promise<VersionData>} Is the module updated, latest version and installed version.
    */
    public checkUpdates(): Promise<VersionData>

    /**
     * Checks the Economy configuration, fixes the problems returns it.
     * @param {CheckerOptions} options Option checker options.
     * @returns {EconomyOptions} Fixed Economy configuration.
     */
    public checkOptions(options?: CheckerOptions): EconomyOptions

    /**
     * Writes the data to file.
     * @param {string} path File path to write.
     * @param {T} data Any data to write
     * @returns {boolean} If successfully written: true; else: false.
     */
    public write<T>(path: string, data: T): boolean

    /**
     * Sets the default user object for the specified member.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {boolean} If reset successfully: true; else: false.
     */
    public reset(memberID: string, guildID: string): boolean
}

export = UtilsManager