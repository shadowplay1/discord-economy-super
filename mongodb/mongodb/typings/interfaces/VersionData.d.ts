/**
 * Object of 'UtilsManager.checkUpdates()' method.
 */
declare interface VersionData {

    /**
     * Checks for if module is up to date.
     */
    updated: boolean

    /**
     * Shows an installed version of the module
     */
    installedVersion: string

    /**
     * Shows the latest version of the module
     */
    packageVersion: string
}

export = VersionData