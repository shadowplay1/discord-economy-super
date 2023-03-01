/**
 * Update checker configuration.
 */
declare interface UpdaterOptions {

    /**
     * Sends the update state message in console on start. Default: true.
     */
    checkUpdates?: boolean

    /**
     * Sends the message in console on start if module is up to date. Default: true.
     */
    upToDateMessage?: boolean
}

export = UpdaterOptions
