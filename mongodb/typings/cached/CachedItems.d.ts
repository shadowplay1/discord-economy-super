import DatabaseManager from '../managers/DatabaseManager'
import EconomyOptions from '../interfaces/EconomyOptions'

import CachedItem from './CachedItem'

import EconomyGuild from '../classes/EconomyGuild'
import EconomyUser from '../classes/EconomyUser'

import ShopItem from '../classes/ShopItem'
import InventoryItem from '../classes/InventoryItem'
import HistoryItem from '../classes/HistoryItem'

export class CachedGuilds extends CachedItem<EconomyGuild, false, false, false> {
    public constructor(guildID: string, options: EconomyOptions, database: DatabaseManager)
}

export class CachedUsers extends CachedItem<EconomyUser, true, false, false> {
    public constructor(userID: string, guildID, options: EconomyOptions, database: DatabaseManager)
}

export class CachedShop extends CachedItem<ShopItem, false, true, true> {
    public constructor(guildID: string, options: EconomyOptions, database: DatabaseManager)
}

export class CachedInventory extends CachedItem<InventoryItem, true, true, true> {
    public constructor(userID: string, guildID: string, options: EconomyOptions, database: DatabaseManager)
}

export class CachedHistory extends CachedItem<HistoryItem, true, true, true> {
    public constructor(userID: string, guildID: string, options: EconomyOptions, database: DatabaseManager)
}