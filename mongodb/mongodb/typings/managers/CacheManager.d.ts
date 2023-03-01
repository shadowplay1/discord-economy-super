import If from '..//interfaces/If'

import EconomyConfiguration from '../interfaces/EconomyConfiguration'
import DataIdentifier from '../interfaces/DataIdentifier'

import DatabaseManager from './DatabaseManager'

import {
    CachedGuilds,
    CachedUsers,
    CachedCooldowns,
    CachedBalance,
    CachedBank,
	CachedCurrency,
    CachedShop,
    CachedHistory,
    CachedInventory
} from '../cached/CachedItems'


type CachedItemNames = 'guilds' | 'users' | 'cooldowns' | 'balance' | 'bank' | 'currencies' | 'shop' | 'inventory' | 'history'
type ArrayElements<T extends readonly string[]> = T[number]

type NonRequirable<CacheItemNamesArray extends readonly CachedItemNames[]> =
    Extract<ArrayElements<CacheItemNamesArray>, 'guilds' | 'shop'> extends never ? true : false;

type MemberIDRequired<CacheItemNamesArray extends readonly CachedItemNames[]> =
    If<NonRequirable<CacheItemNamesArray>,
        true,
        Extract<
            ArrayElements<CacheItemNamesArray>,
            'users' | 'cooldowns' | 'balance' | 'bank' | 'currencies' | 'inventory' | 'history'
        > extends never
        ? false
        : true
    >


declare class CacheManager {
    public constructor(options: EconomyConfiguration, database: DatabaseManager)

    /**
     * Cached guilds.
     * @type {CachedGuilds}
     */
    public guilds: CachedGuilds

    /**
     * Cached users.
     * @type {CachedUsers}
     */
    public users: CachedUsers

    /**
     * Cached cooldowns.
     * @type {CachedCooldowns}
     */
    public cooldowns: CachedCooldowns

    /**
     * Cached balance.
     * @type {CachedBalance}
     */
    public balance: CachedBalance

    /**
     * Cached bank balance.
     * @type {CachedBank}
     */
    public bank: CachedBank

	/**
	 * Cached currencies.
	 * @type {CachedCurrency}
	 */
	public currencies: CachedCurrency

    /**
     * Cached shop.
     * @type {CachedShop}
     */
    public shop: CachedShop

    /**
     * Cached history.
     * @type {CachedHistory}
     */
    public history: CachedHistory

    /**
     * Cached inventory.
     * @type {CachedInventory}
     */
    public inventory: CachedInventory

    /**
     * Updates all the cached items.
     * @param {DataIdentifier} id Identifiers object (memberID, guildID) to get value from cache.
     * @returns {Promise<void>}
     */
    public updateAll(id: DataIdentifier<true>): Promise<void>

    /**
     * Clears all the cache in all cached items.
     * @returns {void}
     */
    public clearAll(): void

    /**
     * Updates the specified cached items.
     * @param cacheItemNames Names of the cache items to update.
     * @param id Identifiers object (memberID, guildID) to get value from the cache.
     * @returns {Promise<void[]>}
     */
    public updateSpecified<T extends readonly CachedItemNames[]>(
        cacheItemNames: T,
        id: DataIdentifier<MemberIDRequired<T>>
    ): Promise<void[]>

    /**
     * Updates the specified cached items.
     *
     * This method is an alias for `CacheManager.updateSpecified` method.
     * @param cacheItemNames Names of the cache items to update
     * @param id Identifiers object (memberID, guildID) to get value from the cache
     * @returns {Promise<void[]>}
     */
    public updateMany<T extends readonly CachedItemNames[]>(
        cacheItemNames: T,
        id: DataIdentifier<MemberIDRequired<T>>
    ): Promise<void[]>

    /**
     * Clears the specified cached items.
     * @param cacheItemNames Names of the cache items to clear.
     * @returns {void}
     */
    public clearSpecified(cacheItemNames: CachedItemNames[]): void

    /**
     * Clears the specified cached items.
     * 
     * This method is an alias for `CacheManager.clearSpecified` method.
     * @param cacheItemNames Names of the cache items to clear.
     * @returns {void}
     */
    public clearMany(cacheItemNames: CachedItemNames[]): void
}

export = CacheManager
