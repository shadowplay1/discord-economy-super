import EconomyGuild from '../classes/EconomyGuild'
import EconomyUser from '../classes/EconomyUser'

import BalanceItem from '../classes/BalanceItem'
import CooldownItem from '../classes/CooldownItem'

import ShopItem from '../classes/ShopItem'
import InventoryItem from '../classes/InventoryItem'
import HistoryItem from '../classes/HistoryItem'

type EconomyConstructors =
    EconomyGuild | EconomyUser | BalanceItem | CooldownItem | ShopItem | InventoryItem | HistoryItem

export = EconomyConstructors