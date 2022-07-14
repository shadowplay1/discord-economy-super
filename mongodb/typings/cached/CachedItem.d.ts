import If from '../interfaces/If'

import DatabaseManager from '../managers/DatabaseManager'

import EconomyOptions from '../interfaces/EconomyOptions'
import EconomyDatabase from '../interfaces/EconomyDatabase'

import EconomyConstructors from '../interfaces/EconomyConstructors'


type DataIdentifier<MemberIDRequired extends boolean = true> = If<
    MemberIDRequired,
    { guildID: string, memberID: string },
    { guildID: string }
>

declare class CachedItem<
    T extends EconomyConstructors,
    MemberIDRequired extends boolean = true,
    IsDataArray extends boolean = false,
    RequiresParam extends boolean = false
    > {
    public constructor(
        baseConstructor: T,
        constructorParams: any[],
        options: EconomyOptions,
        database: DatabaseManager
    )

    /**
     * Economy options.
     * @type {EconomyOptions}
     */
    public options: EconomyOptions

    /**
     * A constructor (EconomyUser, ShopItem, etc.) to work with.
     * @type {T}
     */
    public baseConstructor: T

    /**
     * Constructor parameters to pass to the constructor.
     * @type {any[]}
     */
    public constructorParams: any[]

    /**
     * Cache object.
     */
    public get cache(): EconomyDatabase

    /**
    * Gets the value of the key in a cache.
    * @param id Identifiers object (memberID, guildID) to get value from cache.
    * @returns {any} Value from cache.
    */
    public get<Param extends If<
        RequiresParam,
        Extract<EconomyConstructors, T>,
        never
        // @ts-expect-error
    > = T>
        (id: DataIdentifier<MemberIDRequired>): If<
            IsDataArray,
            If<RequiresParam, Param[], T[]>,
            If<RequiresParam, Param, T>
        >

    /**
    * Syncs the cache with database for specified user/guild.
    * @param id Identifiers object (memberID, guildID) to get value from cache.
    * @returns {Promise<void>}
    */
    public update(id: DataIdentifier<MemberIDRequired>): Promise<void>

    /**
    * Syncs entries the cache with database for specified user/guild.
    * @param {DataIdentifier[]} ids Identifiers objects (memberID, guildID) to get value from cache.
    * @returns {Promise<void[]>}
    */
    public updateMany(...ids: DataIdentifier<MemberIDRequired>[]): Promise<void[]>

    /**
    * Sets the value to the key in a cache.
    * @param {string} key Key to set in cache.
    * @param {any} value Value to set to cache.
    * @returns {V} Value that was set.
    */
    public set<V>(key: string, value: any): V

    /**
    * Removes a key from a cache.
    * @param {string} key Key to delete value from cache.
    * @returns {void}
    */
    public remove(key: string): void

    /**
     * Clears the cache.
     * @returns {void}
     */
    public clear(): void

    /**
     * Determine if a key exists in the cache.
     * @param {string} key Key to check if exists in cache.
     * @returns {boolean} True if key exists in cache, false if not.
     */
    public has(key: string): boolean
}

export = CachedItem