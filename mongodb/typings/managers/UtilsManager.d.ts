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
    * @returns {Promise<boolean>} If cleared successfully: true; else: false
    */
    public clearDatabase(): Promise<boolean>

    /**
    * Fully removes the guild from database.
    * @param {string} guildID Guild ID
    * @returns {Promise<boolean>} If cleared successfully: true; else: false
    */
    public removeGuild(guildID: string): Promise<boolean>

    /**
    * Removes the user from database.
    * @param {string} memberID Member ID
    * @param {string} guildID Guild ID
    * @returns {Promise<boolean>} If cleared successfully: true; else: false
    */
    public removeUser(memberID: string, guildID: string): Promise<boolean>

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
     * Sets the default user object for the specified member.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {Promise<boolean>} If reset successfully: true; else: false.
     */
    public resetUser(memberID: string, guildID: string): Promise<boolean>
}

export = UtilsManager