import If from '../interfaces/If'

import DatabaseManager from '../managers/DatabaseManager'

import EconomyConfiguration from '../interfaces/EconomyConfiguration'
import EconomyDatabase from '../interfaces/EconomyDatabase'

import DataIdentifier from '../interfaces/DataIdentifier'
import EconomyConstructors from '../interfaces/EconomyConstructors'
import EmptyEconomyUser from '../classes/EmptyEconomyUser'
import EmptyEconomyGuild from '../classes/EmptyEconomyGuild'


declare class CachedItem<
    T extends EconomyConstructors,
    E extends EmptyEconomyUser | EmptyEconomyGuild | null = any,
    MemberIDRequired extends boolean = true,
    IsDataArray extends boolean = false,
    RequiresParam extends boolean = false
> {
    public constructor(
        baseConstructor: T,
        constructorParams: any[],
        options: EconomyConfiguration,
        database: DatabaseManager
    )

    /**
     * Economy options.
     * @type {EconomyConfiguration}
     */
    public options: EconomyConfiguration

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
    * Gets the data from a cache.
    * @param id Identifiers object (memberID, guildID) to get value from cache.
    * @returns Value from cache.
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
            If<RequiresParam, Param, E extends null ? T : T | E>
        >

    /**
    * Syncs the cache in a cached item with database for specified user/guild.
    * @param id Identifiers object (memberID, guildID) to get value from cache.
    * @returns {Promise<void>}
    */
    public update(id: DataIdentifier<MemberIDRequired>): Promise<void>

    /**
    * Syncs entries with the cache in cached item with database for specified user/guild.
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
    public set<V>(key: string, value: V): V

    /**
    * Removes a key from a cache in a cached item.
    * @param {DataIdentifier<MemberIDRequired>} id Key to delete value from cache.
    * @returns {void}
    */
    public remove(id: DataIdentifier<MemberIDRequired>): void

    /**
     * Clears the cache in a cached item.
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
