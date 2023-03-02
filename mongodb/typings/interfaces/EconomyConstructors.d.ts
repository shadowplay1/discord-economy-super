import EconomyGuild from '../classes/EconomyGuild'
import EconomyUser from '../classes/EconomyUser'

import BalanceItem from '../classes/BalanceItem'
import BankBalanceItem from '../classes/BankBalanceItem'

import CooldownItem from '../classes/CooldownItem'

import ShopItem from '../classes/ShopItem'
import InventoryItem from '../classes/InventoryItem'
import HistoryItem from '../classes/HistoryItem'

import Currency from '../classes/Currency'


type EconomyConstructors =
    EconomyGuild | EconomyUser | BalanceItem | BankBalanceItem | Currency | CooldownItem | ShopItem | InventoryItem | HistoryItem

export = EconomyConstructors
