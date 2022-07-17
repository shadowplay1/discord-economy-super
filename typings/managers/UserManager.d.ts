import If from '../interfaces/If'

import EconomyOptions from '../interfaces/EconomyOptions'
import BaseManager from './BaseManager'
import EconomyUser from '../classes/EconomyUser'

type UserFunction<MemberIDRequired extends boolean, ReturnType = EconomyUser> =
    If<
        MemberIDRequired,
        (memberID: string, guildID: string) => ReturnType,
        (guildID: string) => ReturnType
    >

/**
 * User Manager.
 */
declare class UserManager<MemberIDRequired extends boolean> extends BaseManager<EconomyUser> {

    /**
     * User Manager.
     * @param {EconomyOptions} options Economy configuration.
     */
    public constructor(options: EconomyOptions)

    /**
    * Gets the array of ALL users in database.
    * @returns {EconomyUser[]}
    */
    public all: UserFunction<MemberIDRequired, EconomyUser[]>

    /**
     * Gets the user by it's ID and guild ID.
     * @param {string} memberID Member ID.
     * @param {string} guildID Guild ID.
     * @returns {EconomyUser} User object.
     */
    public get: UserFunction<MemberIDRequired>

    /**
    * Creates an economy user object in database.
    * @param {string} memberID The user ID to set.
    * @param {string} guildID Guild ID.
    * @returns {EconomyUser} Economy user object.
    */
    public create: UserFunction<MemberIDRequired>

    /**
    * Sets the default user object for a specified member.
    * @param {string} userID User ID.
    * @returns {boolean} If reset successfully: true; else: false.
    */
    public reset: UserFunction<MemberIDRequired, boolean>
}

export = UserManager