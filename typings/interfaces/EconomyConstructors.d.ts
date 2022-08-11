import EconomyGuild from '../classes/EconomyGuild'
import EconomyUser from '../classes/EconomyUser'

import ShopItem from '../classes/ShopItem'
import InventoryItem from '../classes/InventoryItem'
import HistoryItem from '../classes/HistoryItem'

type EconomyConstructors =
    EconomyGuild | EconomyUser | ShopItem | InventoryItem | HistoryItem

export = EconomyConstructors