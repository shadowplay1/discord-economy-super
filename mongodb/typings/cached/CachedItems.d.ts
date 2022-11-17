import CacheManager from '../managers/CacheManager'
import DatabaseManager from '../managers/DatabaseManager'

import EconomyConfiguration from '../interfaces/EconomyConfiguration'

import CachedItem from './CachedItem'

import EconomyGuild from '../classes/EconomyGuild'
import EmptyEconomyGuild from '../classes/EmptyEconomyGuild'

import EconomyUser from '../classes/EconomyUser'
import EmptyEconomyUser from '../classes/EmptyEconomyUser'

import CooldownItem from '../classes/CooldownItem'

import BalanceItem from '../classes/BalanceItem'
import BankBalanceItem from '../classes/BankBalanceItem'

import ShopItem from '../classes/ShopItem'
import InventoryItem from '../classes/InventoryItem'
import HistoryItem from '../classes/HistoryItem'

export class CachedGuilds extends CachedItem<EconomyGuild, EmptyEconomyGuild, false, false, false> {
    public constructor(guildID: string, options: any[], database: DatabaseManager, cache: CacheManager)
}

export class CachedUsers extends CachedItem<EconomyUser, EmptyEconomyUser, true, false, false> {
    public constructor(userID: string, guildID: string, options: any[], database: DatabaseManager, cache: CacheManager)
}

export class CachedCooldowns extends CachedItem<CooldownItem, null, true, false, false> {
    public constructor(userID: string, guildID: string, options: any[], database: DatabaseManager, cache: CacheManager)
}

export class CachedBalance extends CachedItem<BalanceItem, null, true, false, false> {
    public constructor(userID: string, guildID: string, options: any[], database: DatabaseManager, cache: CacheManager)
}

export class CachedBank extends CachedItem<BankBalanceItem, null, true, false, false> {
    public constructor(userID: string, guildID: string, options: any[], database: DatabaseManager, cache: CacheManager)
}

export class CachedShop extends CachedItem<ShopItem, null, false, true, true> {
    public constructor(guildID: string, options: any[], database: DatabaseManager, cache: CacheManager)
}

export class CachedInventory extends CachedItem<InventoryItem, null, true, true, true> {
    public constructor(userID: string, guildID: string, options: any[], database: DatabaseManager, cache: CacheManager)
}

export class CachedHistory extends CachedItem<HistoryItem, null, true, true, true> {
    public constructor(userID: string, guildID: string, options: any[], database: DatabaseManager, cache: CacheManager)
}
