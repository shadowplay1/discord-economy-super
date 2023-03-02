import DatabaseManager from './DatabaseManager'
import CacheManager from './CacheManager'

import If from '../interfaces/If'
import EconomyConfiguration from '../interfaces/EconomyConfiguration'

import BaseManager from './BaseManager'

import EconomyUser from '../classes/EconomyUser'
import EmptyEconomyUser from '../classes/EmptyEconomyUser'


type UserFunction<
    MemberIDRequired extends boolean,
    ReturnType = EconomyUser,
    EmptyReturnType = EmptyEconomyUser
> =
    If<
        MemberIDRequired,
        (memberID: string, guildID: string) => Promise<
            EmptyReturnType extends null ? ReturnType : ReturnType | EmptyReturnType
        >,
        (userID: string) => Promise<
            EmptyReturnType extends null ? ReturnType : ReturnType | EmptyReturnType
        >
    >


/**
 * User Manager.
 */
declare class UserManager<MemberIDRequired extends boolean> extends BaseManager<EconomyUser, EmptyEconomyUser> {

    /**
     * User Manager.
     * @param {EconomyConfiguration} options Economy configuration.
     */
    public constructor(
        options: EconomyConfiguration,
        database: DatabaseManager,
        guildID: string,
        cache: CacheManager
    )

    /**
    * Gets the array of ALL users in database.
    * @returns {EconomyUser[]}
    */
    public all: UserFunction<MemberIDRequired, EconomyUser[], null>

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
    public create: UserFunction<MemberIDRequired, EconomyUser, null>

    /**
    * Sets the default user object for a specified member.
    * @param {string} userID User ID.
    * @returns {boolean} If reset successfully: true; else: false.
    */
    public reset: UserFunction<MemberIDRequired, boolean, null>
}

export = UserManager