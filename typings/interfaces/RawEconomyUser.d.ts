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
     * User's monthly cooldown.
     */
    monthlyCooldown: number

    /**
     * User's hourly cooldown.
     */
    hourlyCooldown: number

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
    inventory: InventoryData<any>[]

    /**
     * User's purchases history.
     */
    history: HistoryData<any>[]
}

export = RawEconomyUser
