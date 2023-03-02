import EconomyGuild from '../classes/EconomyGuild'
import EconomyUser from '../classes/EconomyUser'

import ShopItem from '../classes/ShopItem'
import InventoryItem from '../classes/InventoryItem'
import HistoryItem from '../classes/HistoryItem'

import Currency from '../classes/Currency'


type EconomyConstructors =
    EconomyGuild | EconomyUser | ShopItem | Currency | InventoryItem | HistoryItem

export = EconomyConstructors