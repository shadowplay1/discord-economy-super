import HistoryData from './HistoryData'
import InventoryData from './InventoryData'

declare interface RawEconomyUser {

    /**
     * User's daily cooldown.
     */
    dailyCooldown: number

    /**
     * User's work cooldown.
     */
    workCooldown: number

    /**
     * User's weekly cooldown.
     */
    weeklyCooldown: number

    /**
     * User's balance.
     */
    money: number

    /**
     * User's bank balance.
     */
    bank: number

    /**
     * User's inventory.
     */
    inventory: InventoryData

    /**
     * User's purchases history.
     */
    history: HistoryData[]
}

export = RawEconomyUser