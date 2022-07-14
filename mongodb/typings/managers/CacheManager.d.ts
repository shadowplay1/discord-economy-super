import EconomyOptions from '../interfaces/EconomyOptions'
import DatabaseManager from './DatabaseManager'

import {
    CachedGuilds,
    CachedUsers,
    CachedShop,
    CachedHistory,
    CachedInventory
} from '../cached/CachedItems'

declare class CacheManager {
    constructor(options: EconomyOptions, database: DatabaseManager)

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
}

export = CacheManager