import HistoryData from './HistoryData'
import ItemData from './ItemData'

interface EconomyDatabase {
    [guildID: string]: {
        [memberID: string]: {
            dailyCooldown: number
            workCooldown: number
            weeklyCooldown: number
            money: number
            bank: number
            inventory: ItemData[]
            history: HistoryData[]
            id: string
            guildID: string
        }
    }
}

export = EconomyDatabase