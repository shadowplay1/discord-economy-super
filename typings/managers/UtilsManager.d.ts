import CheckerOptions from '../interfaces/CheckerOptions';
import EconomyOptions from '../interfaces/EconomyOptions';

import VersionData from '../interfaces/VersionData';

/**
 * Utils manager methods object.
 */
declare class UtilsManager {
    constructor(options: EconomyOptions)
    
    /**
    * Fetches the entire database.
    * @returns Database contents
    */
    public all(): object

    /**
    * Clears the storage file.
    * @returns {boolean} If cleared successfully: true; else: false
    */
    public clearStorage(): boolean

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
     * This method will show is the module updated, latest version and installed version.
     * @returns If started successfully: true; else: Error object.
     */
    public checkUpdates(): Promise<VersionData>

    /**
     * Checks the Economy options object, fixes the problems in it and returns the fixed options object.
     * @param {CheckerOptions} options Option checker options.
     * @returns {EconomyOptions} Fixed economy options object.
     */
    public checkOptions(options?: CheckerOptions): EconomyOptions

    /**
     * Writes the data to file.
     * @param {String} path File path to write.
     * @param {any} data Any data to write
     * @returns {Boolean} If successfully written: true; else: false.
     */
    public write<Data>(path: string, data: Data): boolean

    /**
     * Sets the default user object for the specified member.
     * @param {String} memberID Member ID.
     * @param {String} guildID Guild ID.
     * @returns {Boolean} If resetted successfully: true; else: false.
     */
    public reset(memberID: string, guildID: string): boolean
}

export = UtilsManager